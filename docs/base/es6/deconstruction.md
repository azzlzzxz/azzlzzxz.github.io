# 解构赋值

`ES6` 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构，解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。

## 数组的解构赋值

> 举几个 🌰

```js
let [a, b] = [1, 2]

console.log(a) // 1
console.log(b) // 2
```

```js
let [a, [[b], c]] = [1, [[2], 3]]

a // 1
b // 2
c // 3
```

```js
let [, , third] = ['a', 'b', 'c']

third // "c"
```

```js
let [a, , c] = [1, 2, 3]

a // 1
c // 3
```

本质上，这种写法属于`“模式匹配”`，只要等号两边的模式相同，左边的变量就会被赋予对应的值，如果解构不成功，变量的值就等于 undefined

```js
let [x, y, ...z] = ['a']

x // "a"
y // undefined
z // []
```

::: tip 注意 ⚠️

由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构

```js
let arr = [1, 2, 3]
let { 0: first, [arr.length - 1]: last } = arr
first // 1
last // 3
```

:::

## 对象的解构赋值

::: tip 对象解构与数组解构的不同

- 数组的元素是按次序排列的，变量的取值由它的位置决定

- 对象的属性没有次序，变量必须与属性同名，才能取到正确的值

:::

```js
let { foo, bar } = { foo: 'aaa', bar: 'bbb' }
foo // "aaa"
bar // "bbb"

let { baz } = { foo: 'aaa', bar: 'bbb' }
baz // undefined
```

### 嵌套解构赋解构

```js
let {
  foo: { bar },
} = { foo: { bar: 123 } }
bar // 123
```

```js
let {
  foo,
  foo: { bar },
} = { foo: { bar: 123 } }

foo // { bar: 123 }
bar // 123
```

### 默认值

对象解构可以指定默认值

```js
let { foo = 1 } = {}
foo // 1

let { bar: foo = 1 } = {}
foo // 1

let { bar: foo = 1 } = { bar: 5 }
foo // 5
```

默认值生效的条件是，对象的属性值严格等于`undefined`

```js
let { foo = true } = { foo: undefined }
foo // true

let { foo = true } = { foo: null }
foo // null
```

::: tip 注意 ⚠️

- 如果要将一个已经声明的变量用于解构赋值，只有不将大括号写在行首，避免 `JavaScript` 将其解释为代码块

```js{2,3}
// 错误
let x;
{x} = {x: 1};

// 正确
let x;
({x} = {x: 1});
```

- 解构赋值允许等号左边的模式之中，不放置任何变量名

```js
;({} = 'abc')
;({} = [])
```

:::

### `undefined` 和 `null`

由于 undefined 和 null 无法转为对象，所以对它们进行解构赋值，都会报错

```js
let { foo } = undefined
// Uncaught TypeError: Cannot destructure property `foo` of 'undefined' or 'null'.

let { foo } = null
// Uncaught TypeError: Cannot destructure property `foo` of 'undefined' or 'null'.
```

## 字符串的解构赋值

字符串也可以解构赋值。这是因为字符串被转换成了一个类似数组的对象

```js
const [a, b, c] = 'steins gate'
a // "s"
b // "t"
c // "e"
```

类似数组的对象都有一个`length`属性，因此还可以对这个属性解构赋值

```js
let { length: len } = 'steins gate'
len // 11
```

## 函数参数的解构赋值

```js
function add([x, y]) {
  return x + y
}

add([1, 2]) // 3
add([1]) // NaN
```

- 函数参数的解构也可以使用默认值

```js
function add([x, y] = [0, 0]) {
  return x + y
}

add([1, 2]) // 3
add([1]) // 1
add() // 0
```
