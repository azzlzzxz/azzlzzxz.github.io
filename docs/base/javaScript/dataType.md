# 数据类型

## javaScript 的 8 种数据类型

### 7 种基本数据类型

`Number`、`String`、`Boolean`、`Undefined`、`Null`、`Symbol（es6 新增）`、`Biglent（es10 新增）`

在内存中占据固定大小，保存在栈内存中

### 1 种引用数据类型

`Object`

里面包含 `Function(函数)`，其他还有`Array(数组)`、`Date(日期)`、`RegExp(正则表达式)`等。

特殊的基本包装类型(`String`、`Number`、`Boolean`) 以及单体内置对象(`Global`、`Math`)等。

引用类型的值是对象，保存在堆内存中，而栈内存存储的是对象的变量标识符以及对象在堆内存中的存储地址。

### `null` 与 `undefined` 的区别

1. `null` 是表示一个'无'的对象，转为数值是 0。

2. `undefined` 是表示一个'无'的原始值，转为数值是 `NAN`。

3. `null` 用来表示尚未存在的对象，常用来表示函数企图返回一个不存在的对象

4. `undefined` 表示”缺少值”，就是此处应该有一个值,但是还没有定义，典型用法是：
   1. 变量被声明了，但没有赋值时，就等于 `undefined`
   2. 调用函数时，应该提供的参数没有提供，该参数等于 `undefined`
   3. 对象没有赋值属性，该属性的值为 `undefined`
   4. 函数没有返回值时，默认返回 `undefined`
5. `null` 表示”没有对象”，即该处不应该有值，典型用法是：
   1. 作为函数的参数，表示该函数的参数不是对象
   2. 作为对象原型链的终点

### === 和 == 的区别

前者会⾃动转换类型，再判断是否相等，后者不会⾃动类型转换，直接去⽐较。
