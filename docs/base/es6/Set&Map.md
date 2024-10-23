# Set & Map

`Set`和`Map`是`ES6`新增加的数据类型。其中`Set`被称作“集合”的数据结构，`Map`被称作“字典”的数据结构。

新增的这两个数据结构提供了更灵活和强大的方式来处理和存储数据。

::: tip

相同点：`Set`和`Map`存储不重复的值

不同点：`Set`类似于数组的数据结构，`Map`类似于对象的数据结构，成员键是任何类型的值

:::

## Set

- `Set` 本身是一个构造函数，用来生成 `Set` 数据结构。

- `Set` 函数可以接受一个数组（或者具有 `iterable` 接口的其他数据结构）作为参数，用来初始化。

- `Set` 对象允许你存储任何类型的值，无论是原始值或者是对象引用。它类似于数组，但是成员的值都是唯一的，没有重复的值。

```js
let s = new Set()

let arr = [1, 2, 3, 4, 5, 4, 3, 2]

arr.forEach((x) => s.add(x))

for (let i of s) {
  console.log(i) // 1, 2, 3, 5, 4
}
```

::: tip Set 中的特殊值

- 向 `Set` 加入值的时候，**不会发生类型转换**，所以`5`和`"5"`是两个不同的值。

- `Set` 内部判断两个值是否不同，使用的算法叫做`“Same-value-zero equality”`，它类似于精确相等运算符`（===）`，主要的区别是向 `Set` 加入值时认为`NaN`等于自身，而精确相等运算符认为`NaN`不等于自身。
  :::

### `Set`的属性

- `size`

返回集合所包含元素的数量

```js
const items = new Set([1, 2, 2, 3])
items.size // 3
```

### `Set`实例对象的方法

- `add(value)`：添加某个值，返回 `Set` 结构本身(可以链式调用)。
- `delete(value)`：删除某个值，删除成功返回 `true`，否则返回 `false`。
- `has(value)`：返回一个布尔值，表示该值是否为 `Set` 的成员。
- `clear()`：清除所有成员，没有返回值。

```js
let s = new Set()

s.add(1).add(2).add(2)

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2)

s.has(2) // false

s.clear()
```

遍历方法

- `keys()`：返回键名的遍历器。
- `values()`：返回键值的遍历器。
- `entries()`：返回键值对的遍历器。
- `forEach()`：使用回调函数遍历每个成员。

由于 `Set` 结构没有键名，只有键值（或者说键名和键值是同一个值），所以 `keys` 方法和 `values` 方法的行为完全一致

```js
let set = new Set(['1', '2', '3'])

for (let item of set.keys()) {
  console.log(item)
}
// 1
// 2
// 3

for (let item of set.values()) {
  console.log(item)
}
// 1
// 2
// 3

for (let item of set.entries()) {
  console.log(item)
}
// ["1", "1"]
// ["2", "2"]
// ["3", "3"]
```

### `Set` 的应用

- `Set` 可以用来去除字符串的重复元素。

```js
const uniqueStr = [...new Set(str)].join('')
```

- `Set` 可以用来去除数组的重复元素。

```js
const uniqueArr = [...new Set(arr)]

const uniqueArr2 = Array.from(new Set(arr))
```

- 实现集合数组

```js
let a = new Set([1, 2, 3])
let b = new Set([4, 3, 2])

// 并集
let union = new Set([...a, ...b])

//交集
let intersection = new Set([...a].filter((v) => b.has(v)))

// 差集
let difference = new Set([...a].filter((v) => !b.has(v)))
```

## `WeakSet`

[<u>`WeakSet`</u>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 类似于 `Set`，也是不重复的值的集合。但是，`WeakSet` 的成员只能是对象，`WeakSet` 不接受其他类型的值。

```js
const s = new WeakSet()

s.add(1) // TypeError: Invalid value used in weak set
```

```js
const s = new WeakSet()

s.add({ name: 'steins gate' })

console.log(s)
```

![weakSet](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/weakSet.jpg)

特点：

- `WeakSet` 中的对象都是**弱引用**，即垃圾回收机制不考虑 `WeakSet` 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么该对象会被垃圾回收机制回收。
- 可以用来保存 `DOM` 节点，不容易造成内存泄漏。
- `WeakSet` 不可枚举，这是因为对象可能会在没有显式删除的情况下被垃圾回收。
- `WeakSet` 没有 `size` 属性

::: tip `WeakSet`的弱引用

`WeakSet` 中的对象引用不会阻止这些对象被垃圾回收`（GC）`。如果某个对象只被 `WeakSet` 引用，并且没有其他强引用指向这个对象，那么即使它在 `WeakSet` 中，垃圾回收器仍然可以在不再需要该对象时自动回收它。
:::

::: tip 为什么叫弱引用？

通常在 `JavaScript` 中，对象是通常是强引用的，即只要对象被引用，它就不会被垃圾回收，而在 `WeakSet` 中，弱引用的对象可以在没有其他强引用时被回收，即使它仍然存在于 `WeakSet` 中。

:::

## `Map`

`Map` 中存储的是 `key-value` 形式的键值对, 其中的 `key` 和 `value` 可以是任何类型的, 即对象也可以作为 `key`。 `Map` `的出现，就是让各种类型的值都可以当作键。Map` 提供的是`“值-值”`的对应。

### 那 `Map` 和 `Object` 的区别是什么

- `Object` 对象有原型，也就是说他有默认的 `key` 值在对象上面， 除非我们使用`Object.create(null)`创建一个没有原型的对象。
- 在 `Object` 对象中， 只能把 `String` 和 `Symbol` 作为 `key` 值，但是在 `Map` 中，`key` 值可以是任何基本类型`(String, Number, Boolean, undefined 等)`，或者`(Map, Set, Object, Function , Symbol 等)`。
- 通过 `Map` 中的 `size` 属性， 可以很方便地获取到 `Map` 长度， 要获取 `Object` 的长度，你只能手动计算。

### `Map` 的属性

`size`: 返回集合所包含元素的数量

```js
const map = new Map()
map.set('name', 'steins gate')
map.set('age', 18)

console.log(map.size) // 2
```

### `Map`实例对象的方法

- `set(key, value)`：设置键名 `key` 对应的键值为 `value`，向 `Map` 中添加新元素，然后返回 `map` 结构本身
- `get(key)`： 通过键值查找特定的数值并返回
- `has(key)`: 判断 `Map` 中是否有 `Key` 所对应的值，有返回 `true`，否则返回 `false`
- `delete(key)`: 通过键值从 `Map` 中移除对应的数据
- `clear()`: 将这个 `Map` 中的所有元素删除

```js
const m = new Map()
const s = { name: 'steins gate' }

m.set(s, 'say hi')
m.get(s) // "say hi"

m.has(s) // true

m.delete(s)
m.has(s) // false
```

遍历方法：

- `keys()`：返回键名的遍历器
- `values()`：返回键值的遍历器
- `entries()`：返回键值对的遍历器
- `forEach()`：使用回调函数遍历每个成员

```js
const map = new Map([
  ['a', 1],
  ['b', 2],
])

for (let key of map.keys()) {
  console.log(key)
}
// "a"
// "b"

for (let value of map.values()) {
  console.log(value)
}
// 1
// 2

for (let item of map.entries()) {
  console.log(item)
}
// ["a", 1]
// ["b", 2]

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value)
}
// "a" 1
// "b" 2

// for...of...遍历map等同于使用map.entries()

for (let [key, value] of map) {
  console.log(key, value)
}
// "a" 1
// "b" 2
```

## `WeakMap`

`WeakMap` 结构与 `Map` 结构类似，也是用于生成键值对的集合。

- 只接受对象作为键名（`null` 除外），不接受其他类型的值作为键名
- 键必须是弱引用对象，而值可以是任意类型
- 不能遍历，方法有 `get`、`set`、`has`、`delete`
