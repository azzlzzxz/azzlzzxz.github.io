# Redis 常见业务用法

本文关注“业务为什么需要 Redis，以及应该怎样使用”。Redis 的命令语法请先阅读 [Redis 基础](./base)；这里重点解释缓存、分布式锁、限流、验证码、排行榜、购物车和消息事件。

## 先判断：这个需求是否适合 Redis

使用 Redis 前先回答三个问题：

1. 数据是否需要非常快地读取或修改？
2. 数据是否允许丢失、过期或从 MySQL 重建？
3. Redis 故障时，业务是否有降级方案？

如果数据是账户余额、订单金额、库存最终值等关键事实，Redis 最多作为加速或协调组件，不能作为唯一数据源。

## 缓存：减少数据库查询

### Cache Aside 模式

Cache Aside 是最常见的缓存策略：读取时先查 Redis，未命中再查 MySQL 并写入 Redis；更新时先更新 MySQL，再删除缓存。

```text
读取：Redis 命中 -> 直接返回
      Redis 未命中 -> MySQL 查询 -> 写入 Redis -> 返回

更新：更新 MySQL -> 删除 Redis 缓存
```

读取示例：

```ts
const key = `user:profile:${userId}`
const cached = await redis.get(key)

if (cached !== null) {
  return JSON.parse(cached)
}

const user = await userRepository.findOneByOrFail({ id: userId })
await redis.set(key, JSON.stringify(user), { EX: 3600 })

return user
```

更新示例：

```ts
await userRepository.update({ id: userId }, { name })
await redis.del(`user:profile:${userId}`)
```

### 真实场景：用户资料缓存

用户详情页可能被大量访问，但用户资料并不会每秒变化。把用户资料缓存 1 小时，可以显著减少数据库查询。用户修改昵称后删除缓存，下一次读取会从数据库加载最新数据。

### 什么时候使用，什么时候不用

适合：读多写少、查询成本高、短时间内允许读取旧数据的数据。

不适合：余额、库存、支付状态等必须实时且不能丢失的数据。此类数据应先以数据库为准，再谨慎增加缓存。

### 常见陷阱：缓存与数据库不一致

推荐“先更新数据库，再删除缓存”。直接更新缓存容易遗漏其他写入路径；先删除缓存再更新数据库，则可能出现请求读到旧数据库值并重新写回缓存的问题。

如果更新数据库和删除缓存之间不能接受短暂不一致，可以使用事务事件、消息队列或重试机制处理缓存失效。

## 分布式锁：协调多个服务实例

### 它到底解决什么问题

单机程序可以用进程内锁，但后端服务通常会启动多个实例：

```text
请求 A -> 实例 1 ─┐
                  ├-> 同时处理同一个订单
请求 B -> 实例 2 ─┘
```

例如两个请求同时取消订单：如果没有协调机制，它们可能同时退款、重复释放库存或重复发送通知。

分布式锁的作用是：在多个进程、多个容器甚至多台机器之间，约定同一时间只有一个执行者处理某个资源。

### 加锁、执行业务、释放锁

Redis 中常用下面的命令抢锁：

```redis
SET lock:order:1001 request-id-abc NX EX 30
```

- `NX`：只有 key 不存在时才设置，保证抢锁具有排他性。
- `EX 30`：锁 30 秒后自动过期，避免进程崩溃造成永久死锁。
- value：锁的持有者标识，生产环境应使用随机 token。

Node.js 示例：

```ts
import crypto from 'node:crypto'

const key = `lock:order:${orderId}`
const token = crypto.randomUUID()
const acquired = await redis.set(key, token, { NX: true, EX: 30 })

if (acquired !== 'OK') {
  throw new Error('该订单正在处理中，请稍后重试')
}

try {
  await cancelOrder(orderId)
} finally {
  // 只能删除自己持有的锁
  const script = `
    if redis.call('get', KEYS[1]) == ARGV[1] then
      return redis.call('del', KEYS[1])
    end
    return 0
  `

  await redis.eval(script, { keys: [key], arguments: [token] })
}
```

### 为什么释放锁不能直接 `DEL`

假设实例 1 获取锁后执行时间超过 30 秒，锁自动过期；实例 2 随后获取了同一个锁。此时实例 1 执行 `DEL`，就会误删实例 2 的锁。

所以释放锁必须先比较 value 是否等于自己的 token，再删除。比较和删除必须由 Lua 脚本一次性执行，不能拆成 `GET` 和 `DEL` 两条命令。

### 真实场景：订单取消

订单取消可能由用户点击、定时任务和支付回调同时触发。可以用订单 id 作为锁粒度：

```text
lock:order:1001
```

拿到锁后仍然要在 MySQL 事务中检查订单当前状态：

```text
获取 Redis 锁
  -> 查询订单状态
  -> 只有 paid / pending 等允许状态才能取消
  -> 更新订单状态
  -> 记录退款或释放库存
  -> 提交数据库事务
  -> 释放 Redis 锁
```

锁负责“减少并发执行者”，数据库事务负责“保证最终修改的一致性”，两者不能互相替代。

### 什么时候该用

- 同一订单、同一用户或同一资源可能被多个实例同时处理。
- 业务操作不是幂等的，重复执行会造成实际损失。
- 任务调度要求同一时刻只有一个实例执行。
- 需要在短时间内协调跨进程操作。

### 什么时候不要用

- 只是为了替代数据库唯一索引。防重复创建应优先使用唯一约束和幂等键。
- 业务本身可以安全重复执行。优先设计幂等操作，系统更简单。
- 需要长时间持锁且不能容忍锁过期。应改用数据库锁、任务队列或更专业的协调系统。
- 需要极强一致性的金融核心操作。Redis 锁不能单独承担最终正确性。

### 锁的边界与风险

- 锁必须设置 TTL，并且 TTL 要覆盖正常业务耗时。
- 业务时间可能超过 TTL 时，需要续期机制，但续期本身也会增加复杂度。
- Redis 故障、网络分区或时钟问题可能导致锁语义失效。
- 多个资源加锁时要固定加锁顺序，避免死锁。
- 锁失败时应快速返回、排队或重试，不要无限等待。

## 限流：控制接口访问速度

### 真实场景：登录接口

同一个 IP 每分钟最多登录 10 次，可以用时间窗口计数：

```text
rate:login:192.168.1.10:202607311430
```

```redis
INCR rate:login:192.168.1.10:202607311430
EXPIRE rate:login:192.168.1.10:202607311430 60
```

应用读取计数，超过阈值就返回 `429 Too Many Requests`。实际生产环境应使用 Lua 将计数和过期时间设置合并为原子操作。

### 什么时候使用

- 登录、短信发送、验证码、搜索等容易被刷的接口。
- 外部 API 有调用次数限制的场景。
- 保护数据库和下游服务，避免流量突增把系统打垮。

### 限流算法选择

- 固定窗口：实现简单，但窗口边界可能出现突发流量。
- 滑动窗口：更平滑，但需要保存更多时间片数据。
- 令牌桶：允许一定突发流量，适合 API 网关和服务限流。

## 验证码与临时数据

验证码需要短期保存、自动过期并且通常只能使用一次：

```redis
SET captcha:login:13800000000 938211 EX 300
GET captcha:login:13800000000
DEL captcha:login:13800000000
```

校验成功后立即删除，防止重复使用。验证码发送次数也应该单独限流，例如每个手机号 60 秒只能发送一次。

适合放 Redis 的临时数据还包括登录 session、短期 token、一次性链接和接口幂等标记。

## 排行榜：使用 Sorted Set

游戏积分变化时增加用户分数，查询时直接取前十名：

```redis
ZINCRBY game:rank 100 user:1001
ZREVRANGE game:rank 0 9 WITHSCORES
ZREVRANK game:rank user:1001
```

Redis 负责高频排名查询，MySQL 保存最终积分和业务记录。不能只依赖 Redis 保存关键积分，否则 Redis 故障可能导致数据丢失。

## 购物车：使用 Hash

```redis
HSET cart:user:1001 product:10 2 product:20 1
HINCRBY cart:user:1001 product:10 1
HGETALL cart:user:1001
HDEL cart:user:1001 product:20
EXPIRE cart:user:1001 604800
```

结算时必须重新查询商品价格、库存和上下架状态。购物车中的价格只是展示信息，不能作为最终结算依据。

## 消息事件：使用 Stream

订单支付成功后，可以写入订单事件供积分、通知和物流服务消费：

```redis
XADD order-events * orderId 1001 status paid
XGROUP CREATE order-events order-workers 0 MKSTREAM
XREADGROUP GROUP order-workers worker-1 COUNT 10 BLOCK 5000 STREAMS order-events >
XACK order-events order-workers 1750000000000-0
```

需要确认、重试和消费组时使用 Stream；只需要简单先进先出且允许丢失时，List 可能就足够了。
