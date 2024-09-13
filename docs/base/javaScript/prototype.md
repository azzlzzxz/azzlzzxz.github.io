# 原型 & 原型链

## 原型

在`JavaScript`中，每定义一个对象（函数）时，每个函数对象都有一个`prototype`属性，这个属性指向调用该构造函数的实例的原型对象

![prototype](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/prototype.jpg)

```js
function Person() {}

Person.prototype.name = 'steins gate'

let p = new Person()

console.log(p.name) // steins gate
```

使用原型对象的好处是所有的对象实例都可共享它所包含的方法与属性。

## 构造函数

构造函数是可以通过`new`运算符来新建一个对象的函数

每一个原型对象 `prototype` 都有一个 `constructor` 属性，其指向原型的构造函数

```js
function Person() {}

console.log(Person.prototype) // {constructor: ƒ Person()}
```

![constructor](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/constructor.jpg)

## 实例

通过构造函数和`new`运算符创建出来的对象，便是实例

实例通过`__proto__`属性指向原型，通过`constructor`指向构造函数

![__proto__](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/__proto__.jpg)

## 原型链

每一个实例对象下面都有一个属性`__proto__`，指向创建该对象的构造函数的原型，并从中继承属性和方法，同时原型对象也可能拥有原型，这样一层一层，最终指向 `null`，这种 **链式结构** 被称为 **原型链**

![Object.prototype](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/Object.prototype.jpg)

::: tip `Object.prototype.__proto__ === null`

`Object.prototype` 是 `JavaScript` 中所有对象的原型。其定义了所有 `JavaScript` 对象都可以使用的属性和方法，例如 `toString()` 等

同时 `Object.prototype` 自身也是一个对象，因此它也有一个原型，而该原型是 `null`，这是 `JavaScript` 原型链的顶部。因此 `Object.prototype.__proto__ === null`（为了让原型链有终点）

:::

通过原型链一个对象会拥有定义在其他对象中的属性和方法，从而使得对象之间可以共享属性和方法，从而避免重复代码的出现。

所以当我们尝试访问一个对象的属性时，`JavaScript` 首先在对象本身中查找该属性。如果它没有找到该属性，它会继续在对象的原型中查找，然后在原型的原型中查找，以此类推，直到找到该属性或原型链的顶部

![Object.prototype.__proto](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/Object.prototype.__proto.jpg)

### `Function`

`ECMAScript` 上的定义（[15.3.3](http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.3)）

> The Function constructor is itself a Function object and its [[Class]] is "Function". The value of the [[Prototype]] internal property of the Function constructor is the standard built-in Function prototype object.

`Function` 构造函数是一个函数对象，其 `[[Class]]` 属性是 `Function`。`Function` 的 `[[Prototype]]`（即`__proto__`）属性指向了 `Function.prototype`

::: tip `Function.prototype` 注意点

`Function.prototype` 是一个函数，但其没有 `prototype`，同时 `Function.prototype.bind()` 方法创建的函数对象也没有 `prototype`

```js
typeof Function.prototype // 'function'

const fn = Function.prototype.bind()
// ƒ () { [native code] }

fn.prototype // undefined
```

`Function.prototype` 是引擎创建出来的函数，引擎认为不需要给这个函数对象添加 `prototype` 属性，不然 `Function.prototype.prototype` 将无休无止并且没有存在的意义

:::

同时每个 `JavaScript` 函数实际上都是一个 `Function` 对象，即 `Function` 的实例

所以会有这些奇怪的现象

```js
Function instanceof Object // true
// 实际如下
Object.__proto__ === Function.prototype // true

Object instanceof Function // true
// 实际如下
Function.__proto__.__proto__ === Object.prototype // true

Function instanceof Function // true
// 实际如下
Function.__proto__ === Function.prototype // true
```

![prototypes-1](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/prototypes-1.jpg)
