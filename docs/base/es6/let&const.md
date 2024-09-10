# let & const

`ES6` 新增了 `let` 和 `const` 命令，用于声明变量，其声明的变量只在声明所在的块级作用域内有效。

::: tip let const var 的区别

- `var` 声明的全局变量会被挂载到全局对象`window`上，`let、const`不会
- `var` 声明的变量会提升到作用域的顶部，`let、const` 不存在变量提升
- `var` 可以对一个变量进行重复声明，而 `let、const` 不能重复声明
- `var` 声明的变量作用域范围是函数作用域，`let`和`const`声明形成块作用域，只能在块作用域里访问，不能跨块访问，也不能跨函数访问
- `const` 声明的是一个只读的常量，一旦声明常量的值就不能改变(必须对变量进行初始化)
  - 基本类型保证值不可变
  - 引用类型保证内存指针不可变
- `let`和`const`声明的变量不能在声明前被使用(暂时性死区)

> 只要块级作用域内存在`let`命令，它所声明的变量就`“绑定”（binding）`这个区域，不再受外部的影响，在代码块内，使用`let`和`const`命令声明变量之前，该变量都是不可用的，语法上被称为暂时性死区

:::

## 变量提升

`JavaScript` 中，函数及变量的声明都将被提升到函数的最顶部。`JavaScript` 中，变量可以在使用后声明，也就是变量可以先使用再声明

```js
console.log(a) // 输出 undefined
console.log(b) // 报错
console.log(c) // 报错

var a = 'a'
let b = 'b'
const c = 'c'
```

函数声明优先于变量声明，函数声明会覆盖变量声明

```js {2,6}
/* var 变量声明 */
console.log(a) // undefined
var a = 'a'

/* 函数声明 */
fn() // function a() { console.log('fn') }
function fn() {
  console.log('fn')
}
```

在同一作用域内存在同名的函数声明和 `var` 变量声明时**函数声明会覆盖变量声明**

```js {1}
console.log(a) // function a() { console.log('fn') }

var a = 'a'
function a() {
  console.log('fn')
}
```

## 重复声明

```js
var a = 'a'
var a
console.log(a) // 输出 a

let b = 'let'
let b // 报错
```

## 作用域范围

```js
function fn() {
  if (true) {
    var a = 'a'
    let b = 'b'

    console.log(a) // 输出 a
    console.log(b) // 输出 b
  }

  console.log(a) // 输出 a
  console.log(b) // 报错
}

fn()
```

## `const` 常量定义

```js
const NAME = 'a'
NAME = 'b' // 报错
```

## 挂载为顶层对象的属性

顶层对象，在浏览器环境指的是 `window` 对象，在 Node 指的是 `global` 对象

在 ES5 之中，顶层对象的属性与全局变量是等价的

```js
window.a = 1
a // 1

b = 2
window.b // 2
```

> 上面代码中，顶层对象的属性赋值与全局变量的赋值，是同一件事

ES6 为了改变这一点做了如下规定：

- `var` 命令和 `function` 命令声明的全局变量依旧是顶层对象的属性（为了保持兼容性）
- `let` 命令、`const` 命令、`class` 命令声明的全局变量不属于顶层对象的属性

即从 ES6 开始，**全局变量将逐步与顶层对象的属性脱钩**

```js
var a = 'a'
let b = 'b'
const c = 'c'

console.log(window.a) // 输出 a
console.log(window.b) // 输出 undefined
console.log(window.c) // 输出 undefined
```

## `ES5` 环境下实现 `let`

```js
for (let i = 0; i < 10; i++) {
  console.log(i)
}
console.log(i)
```

`babel` 转化后输出

```js
for (var _i = 0; _i < 10; _i++) {
  console.log(_i)
}
console.log(i)
```

`babel` 在`let`定义的变量前加了道下划线，避免在块级作用域外访问到该变量，除了对变量名的转换，我们也可以通过自执行函数来模拟块级作用域

```js
;(function () {
  for (var i = 0; i < 5; i++) {
    console.log(i) // 0 1 2 3 4
  }
})()

console.log(i) //Uncaught ReferenceError: i is not defined
```

## `ES5` 环境下实现 `const`

实现`const`关键在于`Object.defineProperty()`这个`API`，这个`API`用于在一个对象上增加或修改属性。通过配置属性描述符，可以精确地控制属性行为。

`Object.defineProperty()`接收三个参数：

- `obj`：要定义属性的对象
- `prop`：要定义或修改的属性的名称
- `descriptor`：要定义或修改的属性描述符

```js
Object.defineProperty(obj, prop, desc)
```

::: tip 对象里的属性描述符

- 数据描述符：具有值的属性
- 存取描述符：由`getter`与`setter`函数对描述的属性

定义在对象内部的数据有四个特征：

- `configurable`：是否可以被 `delete` 删除或者改变特征值
- `enumerable`：是否能通过 `for-in` 循环遍历返回属性
- `writable`：是否可以修改属性的值
- `value`：保存这个属性的数据值

访问器属性

- `configurable`：能否通过 `delete` 删除，能否修改属性特性
- `enumerable`：能否通过 `for-in` 循环返回属性
- `getter`：读取属性时调用的函数，默认为 `undefined`
- `setter`：写入属性时调用的函数，默认为 `undefined`

:::

实现一个简易 const

> 由于`ES5`环境没有`block`的概念，所以是无法百分百实现`const`，只能是挂载到某个对象下，要么是全局的`window`，要么就是自定义一个`object`来当容器。

```js
var __const = function __const(data, value) {
  // 把要定义的data挂载到window下，并赋值value
  window.data = value
  // 利用Object.defineProperty的能力劫持当前对象，并修改其属性描述符
  Object.defineProperty(window, data, {
    enumerable: false,
    configurable: false,
    get: function () {
      return value
    },
    set: function (data) {
      if (data !== value) {
        // 当要对当前属性进行赋值时，则抛出错误！
        throw new TypeError('Assignment to constant variable.')
      } else {
        return value
      }
    },
  })
}

__const('a', 10)
console.log(a) // 10

// 因为const定义的属性在global下也是不存在的，所以用到了enumerable: false来模拟这一功能
for (let item in window) {
  if (item === 'a') {
    // 因为不可枚举，所以不执行
    console.log(window[item])
  }
}
a = 20 // 报错
```
