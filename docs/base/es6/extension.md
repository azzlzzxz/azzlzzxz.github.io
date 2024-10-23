# 函数、数组、对象、运算符的的扩展

## 函数的扩展

### 参数默认值

```js
function add(x, y = 4) {
  return x + y
}

add(1, 2) // 3
add(1) // 5
add(1, undefined) // 5
add(1, null) // 5
```

::: tip 注意 ⚠️

- 参数变量是默认声明的，所以不能用`let`或`const`再次声明
- 函数的参数设置默认值，要直接写在参数定义的后面
- 使用参数默认值时，函数不能有同名参数
- 参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的
  :::

### 函数的 `length` 属性

指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数。

```js
function add(x, y = 4) {
  return x + y
}

add.length // 1
```

### 剩余参数（`rest` 参数）

`ES6` 引入 `rest` 参数（形式为`...变量名`），用于获取函数的多余参数，这样就不需要使用`arguments`对象了。

`rest` 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。

```js
function push(array, ...items) {
  array.push(...items)
}

let a = []
push(a, 1, 2, 3)
a // [1, 2, 3]
```

::: tip 注意 ⚠️

- `arguments`对象不是数组，而是一个类似数组的对象。所以为了使用数组的方法，必须使用`Array.from`先将其转为数组。`rest` 参数就不存在这个问题，它就是一个真正的数组，数组特有的方法都可以使用
- `rest` 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错
- 函数的`length`属性，不包括 `rest` 参数
  :::

### 箭头函数

[<u>箭头函数请看 🚀</u>](/base/es6/arrowFn.md)

### `name` 属性

函数的 name 属性，返回该函数的函数名。

```js
function f() {}

f.name // "f"
```

## 扩展运算符

扩展运算符`（spread）`是三个点（`...`）。它好比 `rest` 参数的逆运算

- 数组的扩展运算符会将数组转为用逗号分隔的参数序列

- 对象的扩展运算符会取出参数对象的所有可遍历属性，拷贝到当前对象之中

```js
console.log(...[1, 2, 3])
// 1 2 3
```

### 替代函数的`apply()`方法

由于扩展运算符可以展开数组，所以不再需要`apply()`方法将数组转为函数的参数了

```js
// ES5 的写法
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2]
f.apply(null, args)

// ES6 的写法
function f(x, y, z) {
  // ...
}
let args = [0, 1, 2]
f(...args)
```

> 举个 🌰 应用`Math.max()`方法，简化求出一个数组最大元素的写法

```js
// ES5 的写法
Math.max.apply(null, [18, 3, 77])

// ES6 的写法
Math.max(...[18, 3, 77])

// 等同于
Math.max(18, 3, 77)
```

### 复制数组/对象

数组是复合的数据类型，直接复制的话，只是复制了指向底层数据结构的指针，而不是克隆一个全新的数组

```js
let arr1 = [1, 2, 3]
let arr2 = arr1

arr2.push(4)
arr1 // [1, 2, 3, 4]
```

上面代码中，`arr2`并不是`arr1`的克隆，而是指向同一份数据的另一个指针。修改`arr2`，会直接导致`arr1`的变化

扩展运算符提供了复制/克隆数组的简便写法

```js
let arr1 = [1, 2, 3]

// 写法一
let arr2 = [...arr1]

// 写法二
let [...arr2] = arr1

arr2.push(4)
arr1 // [1, 2, 3]
arr2 // [1, 2, 3, 4]
```

```js
const obj1 = { name: 'steins gate' }

// 写法一
const obj2 = { ...obj1 }

// 写法二
const { ...obj2 } = obj1
```

### 合并数组/对象

扩展运算符提供了数组合并的新写法，但是 是 **<font color="FF9D00">浅拷贝</font>**

```js
let arr1 = [1, 2, 3]
let arr2 = [4, 5]

let arr3 = [...arr1, ...arr2]

arr3[0] === arr1[0] // true
```

```js
const obj1 = { name: 'steins gate' }
const obj2 = { age: 18 }

const obj = { ...obj1, ...obj2 }
```

### 与解构赋值结合

扩展运算符可以与解构赋值结合起来，用于生成数组

```js
const [first, ...rest] = [1, 2, 3, 4, 5]
first // 1
rest // [2, 3, 4, 5]

const [first, ...rest] = []
first // undefined
rest // []

const [first, ...rest] = ['foo']
first // "foo"
rest // []
```

::: tip 注意 ⚠️

如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错

```js

const [...butLast, last] = [1, 2, 3, 4, 5];
// 报错

const [first, ...middle, last] = [1, 2, 3, 4, 5];
// 报错
```

:::

### 字符串

扩展运算符还可以将字符串转为真正的数组

```js
let str = 'hello'

;[...str] // ["h", "e", "l", "l", "o"]
```

::: tip 提示 💡

- 使用扩展运算符拷贝数组或对象时其都是浅拷贝
- 对象的扩展运算符等同于使用 Object.assign() 方法
- 只有函数调用时扩展运算符才可以放在圆括号中，否则会报错
- 扩展运算符用于赋值时只能放在参数的最后一位，否则会报错
- 在扩展运算符展开数组时，其参数必须要有 iterator 接口，否则会报错
- 在扩展运算符展开对象时，其参数如果不是对象时会自动转为对象（调用 Object()）

:::

## 数组的扩展

### `Array.from()`

`Array.from()`方法用于将两类对象转为真正的数组：

- 类似数组的对象`（array-like object）`
  - `DOM` 操作返回的 `NodeList`
  - `arguments` 对象
- 可遍历`（iterable）`的对象（包括 `ES6` 新增的数据结构 `Set` 和 `Map`）

```js
/* array-like object 转数组 */
const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
}

// ES5 写法
var arr1 = [].slice.call(arrayLike) // ['a', 'b', 'c']

// ES6 写法
let arr2 = Array.from(arrayLike) // ['a', 'b', 'c']
```

::: tip `Array.from()`的应用

- `Array.from()`还可以接受一个函数作为第二个参数，作用类似于数组的`map()`方法，用来对每个元素进行处理，将处理后的值放入返回的数组

```js
Array.from(arrayLike, (x) => x * x)
// 等同于
Array.from(arrayLike).map((x) => x * x)

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]
```

- `Array.from()`的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 `Unicode` 字符，可以避免 `JavaScript` 将大于`\uFFFF`的 `Unicode` 字符，算作两个字符的 `bug`

```js
function countString(string) {
  return Array.from(string).length
}
countString('你好') // 2
```

:::

### `Array.of()`

`Array.of()`方法用于将一组值，转换为数组

```js
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
```

::: tip 注意 ⚠️

- `Array.of()` 方法的主要目的是弥补数组构造函数 `Array()` 的不足(因为参数个数的不同会导致`Array()`的行为有差异)

```js
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```

- `Array.of()`基本上可以用来替代`Array()`或`new Array()`，并且不存在由于参数不同而导致的重载。它的行为非常统一

```js
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

- `Array.of()` 总是返回参数值组成的数组。如果没有参数就返回一个空数组

```js
/* Array.of() 的模拟实现 */
function ArrayOf() {
  return [].slice.call(arguments)
}
```

:::

### 实例方法: find() 和 findIndex()

`find()` 方法用于找出第一个符合条件的数组成员，如果**没有符合条件的成员则返回 `undefined`**

`findIndex()` 方法用于找出第一个符合条件的数组成员的位置，如果**没有符合条件的成员则返回 `-1`**

```js
const arr = [1, 5, 10, 15]

/* find() */
arr.find((item) => item > 9) // 10
arr.find((item) => item === 9) // undefined

/* findIndex() */
arr.findIndex((item) => item > 9) // 2
arr.findIndex((item) => item === 9) // -1
```

::: tip

这两个方法都可以发现 NaN，弥补了数组的`indexOf()`方法的不足。

```js
;[NaN].indexOf(NaN) // -1

;[NaN].findIndex((y) => Object.is(NaN, y)) // 0
```

:::

### 实例方法: fill()

`fill`方法使用给定值，填充一个数组。

```js
;['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]
```

`fill`方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

```js
;['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']
```

### 实例方法: includes()

`includes()` 方法返回一个布尔值，表示某个数组是否包含给定的值

```js
const arr = [1, 2, NaN]
arr.includes(2) // true
arr.includes(4) // false
arr.includes(NaN) // true
```

::: tip includes() 和 indexOf() 的对比

`indexOf()` 不够语义化，其含义是找到参数值的第一个出现位置，所以要去比较是否不等于 `-1`，表达起来不够直观<br>
`indexOf()` 内部使用严格相等运算符 (`===`) 进行判断，这会导致对 `NaN` 的误判

:::

### 实例方法: at()

`at()` 方法接受一个整数(支持负数)作为参数返回对应位置的成员，如果**参数位置超出了数组范围则返回 `undefined`**

```js
const arr = ['steins gate', 18]

arr.at(0) // 'steins gate'
arr.at(-1) // 18
arr.at(99) // undefined
```

### 实例方法: flat() 和 flatMap()

`flat()` 方法用于将嵌套的数组拍平变成一维的数组，该方法**返回一个新数组不改变原数组**

`flatMap()` 方法会先对原数组的每个成员执行一个函数(相当于执行 `Array.prototype.map()`) 然后对返回值组成的数组执行 `flat()` 方法，该方法**返回一个新数组不改变原数组**

```js
/* flat() */
const arr1 = [1, 2, [3, [4, 5]]]
const arr2 = [1, 2, , 4, 5]

arr1.flat() // [1, 2, 3, [4, 5]]
arr1.flat(2) // [1, 2, 3, 4, 5]

arr2.flat() // [1, 2, 4, 5]

/* flatMap() */
const arr = [1, 2, 3, 4]
arr.flatMap((x) => [[x * 2]]) // [[2], [4], [6], [8]]
// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
```

::: tip flat() 和 flatMap() 注意点

- `flat()` 方法默认只会拉平一层
- `flat()`方法会跳过原数组中的空位
- `flatMap()` 只能展开一层数组

:::

::: info

[<u>这里只列举了一些常用方法，其他的数组扩展方法可以看 阮一峰 的 ES6 入门教程</u>](https://es6.ruanyifeng.com/#docs/array)

:::

## 对象的扩展

### 属性简写

`ES6` 允许在大括号里面直接写入变量和函数作为对象的属性和方法

```js
const foo = 'bar'
const baz = { foo }
baz // {foo: "bar"}

// 等同于
const baz = { foo: foo }
```

```js
const obj = {
  method() {
    return 'Hello!'
  },
}

// 等同于

const obj = {
  method: function () {
    return 'Hello!'
  },
}
```

::: tip 注意 ⚠️

简写的对象方法不能用作构造函数，会报错

```js
const obj = {
  f() {
    this.foo = 'bar'
  },
}

new obj.f() // 报错
```

:::

### 属性名表达式

`JavaScript` 定义对象的属性，有两种方法

```js
// 方法一
obj.foo = true

// 方法二
obj['a' + 'bc'] = 123
```

`ES6` 允许字面量定义对象时，用（表达式）作为对象的属性名，即把表达式放在方括号内

```js
let propKey = 'foo'

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123,
}
```

表达式还可以用于定义方法名

```js
let obj = {
  ['h' + 'ello']() {
    return 'hi'
  },
}

obj.hello() // hi
```

::: tip 注意 ⚠️

- 属性名表达式与简洁表示法，不能同时使用，会报错。

```js
// 报错
const key = 'name';
const obj = { [key] }

// 正确
const newKey = 'name';
const newObj = {
  [newKey]: 'steins gate'
}
```

- 属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串`[object Object]`

```js
const keyA = { a: 1 }
const keyB = { b: 2 }

const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB',
}

myObject // Object {[object Object]: "valueB"}
```

:::

### Object.is()

`Object.is()` 方法用来比较两个值是否严格相等，严格比较运算符 (`===`) 的行为基本一致

```js
Object.is('key', 'key') // true
Object.is({}, {}) // false
```

::: tip Object.is() 与 === 的不同之处

`+0`不等于`-0`

```js
/* +0 不等于 -0 */
;+0 === -0 // true
Object.is(+0, -0) // false

/* NaN 等于自身 */
NaN === NaN // false
Object.is(NaN, NaN) // true
```

:::

### Object.assign()

`Object.assign()` 方法用于对象的合并，将源对象的所有可枚举属性复制到目标对象（第一个参数是目标对象后面的参数都是源对象）

```js
const target = { a: 1, b: 1 }

const source1 = { b: 2, c: 2 }
const source2 = { c: 3 }

Object.assign(target, source1, source2)
```

#### 只有一个参数时会直接返回该参数

```js
const obj = { a: 1 }
Object.assign(obj) === obj // true
```

#### 传入参数不是对象时会先转成对象再返回

```js
typeof Object.assign(1) // "object"
typeof Object.assign(true) // "object"
```

#### 传入非对象类型的场景

```js
/* undefined 和 null */
// 首位参数时会报错
Object.assign(undefined) // TypeError
Object.assign(null) // TypeError
// 非首位参数时会忽略
const obj = {}
Object.assign(obj, undefined) === obj // true
Object.assign(obj, null) === obj // true

/* 非首位参数为数值 布尔值 字符串时 */
// 数值和布尔值会忽略
const obj = {}
Object.assign(obj, 1, true) === obj // true
// 字符串会以字符数组的形式做合并
Object.assign({}, 'steins gate') // {0: 'm', 1: 'a', 2: 'o', 3: 'm', 4: 'a', 5: 'o'}

/* 数组 */
// 当参数都为数组时
Object.assign([1, 2, 3], [4, 5]) // [4, 5, 3]
// 当首位参数为对象时，后续参数为数组时
Object.assign({ a: 1 }, [1, 2]) // {0: 1, 1: 2, a: 1}
```

#### 传入数组时会把数组当对象处理

```js
Object.assign([1, 2, 3], [4, 5]) // [4, 5, 3]
```

::: tip Object.assign() 总结和应用场景

总结

- `Object.assign()` 是**浅拷贝**方法
- 存在同名属性时，后面的属性会覆盖前面的属性
- 只有一个参数时会直接返回该参数
- 传入参数不是对象时会先转成对象再返回
- 传入 `undefined` 和 `null` 时
  - 如果为第一个参数会报错（无法转成对象）
  - 如果不为第一个参数时会被忽略
- 传入数组时会把数组当对象处理

应用场景

```js
/* 为对象添加属性 */
class Point {
  constructor(x, y) {
    Object.assign(this, { x, y })
  }
}

/* 为对象添加方法 */
Object.assign(Function.prototype, {
  log() {},
})

/* 拷贝对象 */
const clone = (origin) => Object.assign({}, origin)

/* 合并多个对象 */
const merge = (target, ...sources) => Object.assign(target, ...sources)

/* 为属性指定默认值 */
const DEFAULTS = { duration: 2000 }
function toast(options) {
  options = Object.assign({}, DEFAULTS, options)
}
toast({ content: '提示' }) // {duration: 2000, content: '提示'}
```

:::

### Object.keys() Object.value() Object.entries()

`Object.keys()` 方法返回一个数组，其成员为参数对象自身的（不含继承的）所有可遍历属性的键名(`ES5` 引入)

`Object.value()` 方法返回一个数组，其成员为参数对象自身的（不含继承的）所有可遍历属性的键值(`ES2017` 引入)

`Object.entries()` 方法返回一个数组（二维数组），其成员为参数对象自身的（不含继承的）所有可遍历属性的键值对数组(`ES2017` 引入)

```js
const obj = { name: 'steins gate', age: 18 }
Object.keys(obj) // ['name', 'age']
Object.values(obj) //  ['steins gate', 18]
Object.entries(obj) // [['name', 'steins gate'], ['age', 18]]
```

### Object.fromEntries()

`Object.fromEntries()` 方法是 `Object.entries()` 的逆操作，用于将键值对的数据结构还原为对象

```js
Object.fromEntries([['name', 'steins gate']]) // {name: 'steins gate'}

/* Map 转对象 */
const map = new Map([['name', 'steins gate']])
Object.fromEntries(map) // {name: 'steins gate'}

/* 将查询字符串转为对象 */
const params = 'name=steins gate&age=18'
Object.fromEntries(new URLSearchParams(params)) // {name: 'steins gate', age: '18'}
```

### 对象遍历方法对比

| 方法名                       | 说明                                                 | 继承的原型属性 | 不可枚举属性 | Symbol 属性 |      返回值      |
| ---------------------------- | :--------------------------------------------------- | :------------: | :----------: | :---------: | :--------------: |
| for...in                     | 遍历对象自身和继承的所有可枚举属性(不含 Symbol 属性) |       ✅       |      ❌      |     ❌      |       key        |
| Object.keys                  | 遍历对象自身所有可枚举属性(不含 Symbol 属性)         |       ❌       |      ❌      |     ❌      |     [key...]     |
| Object.getOwnPropertyNames   | 遍历对象自身所有属性(不含 Symbol 属性)               |       ❌       |      ✅      |     ❌      |     [key...]     |
| Object.getOwnPropertySymbols | 遍历对象自身所有的 Symbol 属性                       |       ❌       |      ✅      |     ✅      |     [key...]     |
| Reflect.ownKeys              | 遍历对象自身所有的属性(包含不可枚举和 Symbol 属性)   |       ❌       |      ✅      |     ✅      |     [key...]     |
| Object.values                | 遍历对象自身所有可枚举属性(不含 Symbol 属性)         |       ❌       |      ❌      |     ❌      |    [value...]    |
| Object.entries               | 遍历对象自身所有可枚举属性(不含 Symbol 属性)         |       ❌       |      ❌      |     ❌      | [[key,value]...] |

::: tip 遍历顺序

`ES5` 没有规定遍历顺序，其遍历顺序由浏览器厂商定义(可以简单理解为无序的)

`ES6` 之后规定遍历顺序将按如下规则进行

1. 首先遍历所有数值键，按照数值升序排列。
2. 其次遍历所有字符串键，按照加入时间升序排列。
3. 最后遍历所有 `Symbol` 键，按照加入时间升序排列。

`ES6` 内部定义了 [\[\[OwnPropertyKeys\]\]()](https://262.ecma-international.org/11.0/#sec-ordinary-object-internal-methods-and-internal-slots-ownpropertykeys) 方法对属性进行分类和排序

:::

[<u>这里只列举了一些常用方法，其他的对象扩展方法可以看 阮一峰 的 ES6 入门教程</u>](https://es6.ruanyifeng.com/#docs/object)

## 运算符的扩展

### ?. 可选链操作符

[<u>`ES2020`</u>](https://tc39.es/proposal-optional-chaining/) 引入了可选链操作符(又名链判断运算符)，其允许我们在读取对象内部的某个属性时，不需要判断属性的上层对象是否存在

```js
// 可选链操作符之前的写法
const user = (user && user.detail && user.detail.name) || '用户'

// 可选链操作符之后的写法
const user = user?.detail?.name || '用户'
```

- 如果对象存在，则返回对象的属性值，否则返回 undefined

```js
const obj = {
  a: 1,
  b: 2,
}

obj?.a // 1
obj?.c // undefined
```

- 函数或对象方法可选链操作符可以用于判断对象是否存在，而不需要判断对象是否为 null 或 undefined

```js
const obj = {
  f: function () {},
}

obj?.f?.()
```

```js
fn?.()
// 等同于
fn == null ? undefined : fn()
```

::: tip 注意 ⚠️

- 可选链操作符相当于一种短路机制，只要不满足条件就不再往下执行

- 当有括号时，可选链操作符对圆括号外部没有影响，只对圆括号内部有影响。

- 右侧不得为十进制数值。为了保证兼容以前的代码，允许 `a?.3:0` 会被解析成 `a ? .3 : 0`，因此规定如果 `?.` 后面紧跟一个十进制数字，那么 `?.` 不再被看成是一个完整的运算符，而会按照三元运算符进行处理，即小数点会归属于后面的十进制数字形成一个小数。

- 禁止使用以下写法

```js
// 构造函数
new a?.()
new a?.b()

// 右侧有模板字符串
a?.`{b}`
a?.b`{c}`

// 左侧是 super
super?.()
super?.foo

// 用于赋值运算符左侧
a?.b = c
```

:::

### ?? 逻辑空值合并操作符

[<u>`ES2020`</u>](https://tc39.es/proposal-nullish-coalescing/) 引入了逻辑空值合并操作符（`Nullish Coalescing Operator`），用于判断一个值是否为 null 或 undefined，如果是，则返回其右侧值，否则返回其左侧值

```js
const a = 0 ?? 'steins gate' // 0
const b = '' ?? 'steins gate' // ''
const c = null ?? 'steins gate' // "steins gate"
const d = undefined ?? 'steins gate' // "steins gate"
```

::: tip ?? 与 || 的区别

- `||` 运算符：如果左侧为 `true`，则返回左侧，如果左侧为 `false`，则返回右侧。
- `??` 运算符：如果左侧为 `null` 或 `undefined`，则返回右侧，否则返回左侧。

```js
const a = 0 || 'steins gate' // "steins gate"
const b = '' || 'steins gate' // "steins gate"
const c = null || 'steins gate' // "steins gate"
const d = undefined || 'steins gate' // "steins gate"
```

:::

### 逻辑赋值运算符

[<u>`ES2021`</u>](https://tc39.es/proposal-logical-assignment/) 引入了逻辑赋值运算符，用于简化逻辑赋值操作。

#### `??=`

```js
a ??= b
// 等同于
a ?? (a = b)
```

#### `||=`

```js
a ||= b
// 等同于
a || (a = b)
```

#### `&&=`

```js
a &&= b
// 等同于
a && (a = b)
```
