# MySQL 事务与隔离级别

在真实业务中，一次操作往往会修改多张表。例如，提交订单时需要同时扣减库存、写入订单明细，并更新订单总金额。如果其中一步失败，前面的修改也必须撤销，否则数据库就会出现不一致。

事务就是用来解决这类问题的。它可以把多条 SQL 语句看作一个不可分割的整体：全部成功就提交，任意一步失败就回滚。

## 事务的基本用法

### 开启、提交与回滚

假设订单 `3` 包含一件商品，需要同时修改订单明细数量和订单总金额：

```sql
START TRANSACTION;

UPDATE order_items
SET quantity = 1
WHERE order_id = 3;

UPDATE orders
SET total_amount = 200
WHERE id = 3;

COMMIT;
```

`COMMIT` 表示确认提交事务。提交成功后，本次事务中的修改才会正式对其他事务可见，通常也不能再通过 `ROLLBACK` 撤销。

如果第二条更新失败，或者业务校验不通过，就应该回滚：

```sql
START TRANSACTION;

UPDATE order_items
SET quantity = 1
WHERE order_id = 3;

-- 假设这里发现订单金额计算错误
ROLLBACK;
```

回滚会撤销当前事务中已经执行但尚未提交的所有修改。

### 使用保存点局部回滚

如果只想回滚事务中的一部分操作，可以使用 `SAVEPOINT` 创建保存点：

```sql
START TRANSACTION;

SAVEPOINT before_items;

UPDATE order_items
SET quantity = 1
WHERE order_id = 3;

SAVEPOINT before_order;

UPDATE orders
SET total_amount = 200
WHERE id = 3;

-- 只回滚更新订单金额这一步
ROLLBACK TO SAVEPOINT before_order;

-- 确认剩余操作
COMMIT;
```

`ROLLBACK TO SAVEPOINT` 只回滚到指定保存点，不会结束整个事务。执行 `COMMIT` 或完整的 `ROLLBACK` 后，事务才会结束，保存点也会失效。

## 事务的特性：ACID

事务通常用 `ACID` 描述：

| 特性                  | 含义                                           |
| --------------------- | ---------------------------------------------- |
| 原子性（Atomicity）   | 事务中的操作要么全部成功，要么全部失败。       |
| 一致性（Consistency） | 事务执行前后，数据库都必须满足约束和业务规则。 |
| 隔离性（Isolation）   | 并发执行的事务彼此隔离，避免互相产生错误影响。 |
| 持久性（Durability）  | 事务提交后，数据即使在系统重启后也不会丢失。   |

## 真实业务场景

### 创建订单并扣减库存

提交订单通常至少涉及三类数据：订单、订单明细和商品库存。扣库存时还需要检查库存是否充足：

```sql
START TRANSACTION;

INSERT INTO orders (user_id, total_amount, status)
VALUES (1001, 200.00, 'pending');

-- 实际项目中通常先获取刚插入的订单 id
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (3, 10, 1, 200.00);

-- 只有库存足够时才扣减，避免库存变成负数
UPDATE product
SET stock = stock - 1
WHERE id = 10 AND stock >= 1;

-- 应用程序需要检查受影响行数：
-- 受影响行数为 0，说明库存不足，应执行 ROLLBACK

UPDATE orders
SET status = 'pending', total_amount = 200.00
WHERE id = 3;

COMMIT;
```

注意：`UPDATE` 执行成功不代表一定扣到了库存。应用程序还要检查 `affected rows`。如果库存不足，必须回滚订单和订单明细，否则会产生没有库存的订单。

在高并发场景下，也可以先锁定库存记录：

```sql
START TRANSACTION;

SELECT stock
FROM product
WHERE id = 10
FOR UPDATE;

-- 应用程序判断库存后，再执行扣减
UPDATE product
SET stock = stock - 1
WHERE id = 10;

COMMIT;
```

`FOR UPDATE` 会对查询到的记录加排他锁，其他事务需要等待当前事务提交或回滚后才能修改这些记录。

### 账户转账

转账必须保证付款方扣款和收款方入账同时完成：

```sql
START TRANSACTION;

UPDATE account
SET balance = balance - 100
WHERE id = 1 AND balance >= 100;

-- 应用程序检查扣款是否成功

UPDATE account
SET balance = balance + 100
WHERE id = 2;

INSERT INTO account_transaction (from_account, to_account, amount)
VALUES (1, 2, 100);

COMMIT;
```

如果付款方余额不足，或收款方更新失败，就应该执行 `ROLLBACK`，不能只完成其中一边。

真实系统还需要考虑幂等性、账户行锁、事务超时和死锁重试等问题。事务只能保证数据库内操作的一致性，不能自动保证外部支付平台也同步成功。

### 支付成功后的订单状态更新

支付回调可能重复到达，因此更新订单时通常要限制旧状态：

```sql
START TRANSACTION;

UPDATE orders
SET status = 'paid', paid_at = CURRENT_TIMESTAMP
WHERE id = 3 AND status = 'pending';

-- 如果受影响行数为 1，说明本次回调完成了状态变更
-- 如果受影响行数为 0，可能是重复回调或订单状态已改变

INSERT INTO payment_record (order_id, payment_id, amount)
VALUES (3, 'pay_20260731_001', 200.00);

COMMIT;
```

实际项目中还应为支付流水号增加唯一索引，避免同一笔支付被重复处理。

### 事务边界应放在哪里

事务通常应该覆盖一个完整的业务动作，而不是只包住某一条 SQL：

```text
开始事务
  -> 校验订单状态
  -> 扣减库存
  -> 写入订单明细
  -> 更新订单状态
  -> 提交事务
```

事务中不要执行耗时的外部操作，例如调用支付平台、发送网络请求或等待用户输入。否则会长时间占用数据库连接和锁，降低并发能力。常见做法是先提交数据库事务，再通过消息队列或可靠事件机制处理外部操作。

## 事务隔离级别

当一个事务还没有 `COMMIT`，另一个事务是否能够看到它的修改，取决于事务隔离级别。

MySQL 常见的四种隔离级别如下：

| 隔离级别           | 脏读 | 不可重复读 | 幻读                            | 特点                                                           |
| ------------------ | ---- | ---------- | ------------------------------- | -------------------------------------------------------------- |
| `READ UNCOMMITTED` | 可能 | 可能       | 可能                            | 可以读到其他事务未提交的数据，并发性能较高但一致性最差。       |
| `READ COMMITTED`   | 不会 | 可能       | 可能                            | 只能读到其他事务已经提交的数据。                               |
| `REPEATABLE READ`  | 不会 | 不会       | 通常不会（InnoDB 普通一致性读） | 同一事务中的普通查询通常读取同一个快照，是 InnoDB 的默认级别。 |
| `SERIALIZABLE`     | 不会 | 不会       | 不会                            | 通过更强的锁让事务近似串行执行，并发能力最弱。                 |

### 脏读

事务 A 修改了数据但尚未提交，事务 B 读取到了这份数据。之后事务 A 回滚，事务 B 读取到的就是不存在的临时数据，这种现象叫脏读。

`READ UNCOMMITTED` 可能发生脏读，其他常见隔离级别不会读取未提交的数据。

### 不可重复读

事务 A 两次读取同一行数据。在两次读取之间，事务 B 修改并提交了这行数据，于是事务 A 两次读到的结果不同，这叫不可重复读。

### 幻读

事务 A 按条件查询一批记录。两次查询之间，事务 B 插入或删除了满足条件的记录，导致事务 A 第二次查询到的行数发生变化，这种现象叫幻读。

在 InnoDB 中，普通 `SELECT` 通常使用 MVCC 的一致性读；`SELECT ... FOR UPDATE` 等锁定读则会使用当前读，并可能涉及间隙锁。因此分析幻读时，要明确区分普通读和锁定读。

## 查看与设置隔离级别

查看当前会话的事务隔离级别：

```sql
SELECT @@SESSION.transaction_isolation;
```

查看全局默认隔离级别：

```sql
SELECT @@GLOBAL.transaction_isolation;
```

只修改当前数据库连接的隔离级别：

```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

修改全局默认值会影响之后建立的新连接，通常需要谨慎操作：

```sql
SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

## 使用事务时的注意事项

- 事务要尽量短，避免长时间持有锁。
- 事务中多个更新操作应保持固定的访问顺序，降低死锁概率。
- 扣库存、转账等操作必须检查 SQL 的受影响行数。
- 事务回滚只能撤销数据库事务中的修改，不能撤销已经发出的邮件、HTTP 请求或支付请求。
- 对支付回调、消息消费等重复请求，需要通过唯一索引、状态条件或幂等表保证幂等性。
- 事务隔离级别越高，一致性通常越强，但锁竞争和并发性能可能变差，应结合业务选择。

## 小结

- 使用 `START TRANSACTION` 开启事务。
- 使用 `COMMIT` 提交所有修改。
- 使用 `ROLLBACK` 撤销当前事务中的修改。
- 使用 `SAVEPOINT` 和 `ROLLBACK TO SAVEPOINT` 实现局部回滚。
- 使用 `SELECT ... FOR UPDATE` 保护需要并发修改的记录。
- 事务解决的是数据库内部的一致性问题；跨服务、跨系统的一致性还需要消息队列、幂等设计和补偿机制。
