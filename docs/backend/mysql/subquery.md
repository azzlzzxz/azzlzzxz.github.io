# 子查询与 `EXISTS`

## 子查询

子查询是嵌套在其他 SQL 语句中的查询语句。它可以先计算一个中间结果，再将这个结果提供给外层查询使用。

### `SELECT` 中使用子查询

查询成绩最高的学生姓名和班级。

先查询最高分：

```sql
SELECT MAX(score)
FROM student;
```

再查询成绩等于最高分的学生：

```sql
SELECT name, class
FROM student
WHERE score = 100;
```

将两个查询合并，可以使用子查询：

```sql
SELECT name, class
FROM student
WHERE score = (
  SELECT MAX(score)
  FROM student
);
```

查询成绩高于全校平均成绩的学生：

```sql
SELECT *
FROM student
WHERE score > (
  SELECT AVG(score)
  FROM student
);
```

这里的子查询只返回一个值，因此称为标量子查询。

## 增删改语句中的子查询

子查询不只可以用于 `SELECT`，也可以用于 `INSERT`、`UPDATE` 和 `DELETE`。

### 准备示例数据

创建产品表：

```sql
CREATE TABLE product (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  price DECIMAL(10, 2),
  category VARCHAR(50),
  stock INT
);
```

创建一个用于保存分类平均价格的表：

```sql
CREATE TABLE avg_price_by_category (
  id INT AUTO_INCREMENT,
  category VARCHAR(50) NOT NULL,
  avg_price DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (id)
);
```

其中，`DECIMAL(10, 2)` 表示总共最多 10 位数字，其中小数部分占 2 位。

插入产品数据：

```sql
INSERT INTO product (id, name, price, category, stock)
VALUES
  (1, 'iPhone 12', 6999.00, '手机', 100),
  (2, 'iPad Pro', 7999.00, '平板电脑', 50),
  (3, 'MacBook Pro', 12999.00, '笔记本电脑', 30),
  (4, 'AirPods Pro', 1999.00, '耳机', 200),
  (5, 'Apple Watch', 3299.00, '智能手表', 80);
```

### `INSERT` 中使用子查询

将 `product` 表中每个分类的平均价格插入 `avg_price_by_category` 表：

```sql
INSERT INTO avg_price_by_category (category, avg_price)
SELECT category, AVG(price)
FROM product
GROUP BY category;
```

外层语句负责插入数据，子查询实际上是 `INSERT ... SELECT` 中的查询部分。

### `UPDATE` 中使用子查询

假设 `department` 表和 `employee` 表已经存在，将技术部所有员工的姓名增加“技术-”前缀：

```sql
UPDATE employee
SET name = CONCAT('技术-', name)
WHERE department_id = (
  SELECT id
  FROM department
  WHERE name = '技术部'
);
```

子查询先查出技术部的 `id`，外层 `UPDATE` 再根据这个 id 更新员工姓名。

### `DELETE` 中使用子查询

删除技术部的所有员工：

```sql
DELETE FROM employee
WHERE department_id = (
  SELECT id
  FROM department
  WHERE name = '技术部'
);
```

## `EXISTS`

`EXISTS` 用于判断子查询是否返回数据：只要子查询返回至少一行，`EXISTS` 条件就成立；如果没有返回数据，条件就不成立。

### 使用 `EXISTS` 查询有关联数据的部门

查询至少有一名员工的部门：

```sql
SELECT d.name
FROM department AS d
WHERE EXISTS (
  SELECT 1
  FROM employee AS e
  WHERE d.id = e.department_id
);
```

外层查询会遍历每个部门，子查询检查当前部门是否存在员工。`EXISTS` 只关心是否存在结果，因此子查询通常写成 `SELECT 1`。

### 使用 `NOT EXISTS` 查询没有关联数据的部门

查询没有员工的部门：

```sql
SELECT d.name
FROM department AS d
WHERE NOT EXISTS (
  SELECT 1
  FROM employee AS e
  WHERE d.id = e.department_id
);
```

`NOT EXISTS` 与 `EXISTS` 的判断逻辑相反：只有当子查询没有返回数据时，条件才成立。

## 小结

- 子查询可以嵌套在 `SELECT`、`INSERT`、`UPDATE` 和 `DELETE` 语句中。
- 只返回一个值的子查询可以用于比较运算，例如 `=`、`>` 和 `<`。
- `EXISTS` 用于判断子查询是否返回数据。
- `NOT EXISTS` 用于判断子查询是否没有返回数据。
- 相关子查询会引用外层查询的字段，例如示例中的 `d.id = e.department_id`。
