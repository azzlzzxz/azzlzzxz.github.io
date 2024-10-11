# Proxy & Reflect

`Proxy` 和 `Reflect` 是 `ES6` 中引入的两个强大的工具，专门用于拦截对象的操作（如属性访问、赋值、删除等）以及更方便的操作对象。`Proxy` 可以看作是`“代理”`一个对象的行为，而 `Reflect` 则提供了与 `Proxy` 拦截方法一致的工具函数。

## `Proxy` 代理

`Proxy` 是用来创建一个对象的代理，从而可以拦截和自定义对该对象的基本操作（如属性读取、赋值、枚举、函数调用等）。

> 举个 🌰

```js
let target = {
  name: 'steins gate',
  age: 18,
}

let proxy = new Proxy(target, {
  get(target, key, receiver) {
    console.log(`getting ${target[key]}!`)
  },
  set(target, key, value, receiver) {
    console.log(`setting ${target[key]}!`)
  },
})

console.log(proxy.name) // getting steins gate!

proxy.age = 19
console.log(proxy.age) // setting 19!
```

### 参数与实例方法

`Proxy` 接受两个参数

- `target`：要代理的目标对象
- `handler`：代理处理器，用来拦截和定义代理行为，如果`handler`没有设置任何拦截，那就等同于直接通向原对象(访问`proxy`即访问`target`)

`Proxy`的常用操作拦截器

- `get(target, prop, receiver)`：拦截对象属性的读取，如`proxy.name`
- `set(target, prop, value, receiver)`：拦截对象属性的设置，如`proxy.name = 'steins gate'`
- `has(target, prop)`：拦截`prop in proxy`的操作，如`'name' in proxy`
- `deleteProperty(target, prop)`：拦截`delete proxy.name`的操作
- `ownKeys(target)`：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环等操作
- `apply(target, ctx, args)`：拦截函数的调用，如`proxy(...args)`、`new proxy(...args)`
- `construct(target, args, newTarget)`：拦截`new proxy(...args)`的操作

[<u>这里只列举了一些常用操作拦截器，其他 Proxy 的拦截器可以看 阮一峰 的 ES6 入门教程</u>](https://es6.ruanyifeng.com/#docs/proxy)

### `Proxy.revocable()`

`Proxy.revocable()`方法返回一个可取消的 `Proxy` 实例

> 举个 🌰

```js
let target = {}
let handler = {}

let { proxy, revoke } = Proxy.revocable(target, handler)

proxy.foo = 123
proxy.foo // 123

revoke()
proxy.foo // TypeError: Revoked
```

上面代码中，当执行`revoke`函数之后，再访问`Proxy`实例，就会抛出一个错误。

- `Proxy.revocable()`方法返回一个对象，该对象的`proxy`属性是`Proxy`实例，`revoke`属性是一个函数，可以取消`Proxy`实例。

- `Proxy.revocable()`的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

### `this`

虽然 `Proxy` 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。

**<font color="FF9D00">主要原因就是在 `Proxy` 代理的情况下，目标对象内部的`this`关键字会指向 `Proxy` 代理。</font>**

> 举个 🌰

```js
const target = {
  m: function () {
    console.log(this === proxy)
  },
}
const handler = {}

const proxy = new Proxy(target, handler)

target.m() // false
proxy.m() // true
```

::: tip 注意 ⚠️

- 有些原生对象的内部属性，只有通过正确的 this 才能拿到，所以 Proxy 也无法代理这些原生对象的属性

```js
const target = new Date()
const handler = {}
const proxy = new Proxy(target, handler)

proxy.getDate()
// TypeError: this is not a Date object.
```

`getDate()`方法只能在`Date`对象实例上面拿到，如果`this`不是`Date`对象实例就会报错。

这时，`this`绑定原始对象，就可以解决这个问题。

```js
const target = new Date('2015-01-01')
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
      return target.getDate.bind(target)
    }
    return Reflect.get(target, prop)
  },
}
const proxy = new Proxy(target, handler)

proxy.getDate() // 1
```

- `Proxy` 拦截函数内部的`this`，指向的是`handler`对象

```js
const handler = {
  get: function (target, key, receiver) {
    console.log(this === handler)
    return 'Hello, ' + key
  },
  set: function (target, key, value) {
    console.log(this === handler)
    target[key] = value
    return true
  },
}

const proxy = new Proxy({}, handler)

proxy.foo
// true
// Hello, foo

proxy.foo = 1
// true
```

:::

## `Reflect`

设计`Reflect`对象的目的

- 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。

- 修改某些`Object`方法的返回结果，让其变得更合理，比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。

```js
// 老写法
try {
  Object.defineProperty(target, property, attributes)
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```

- 让`Object`操作都变成函数行为，增加可读性，方便使用

某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为

```js
// 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assign') // true
```

- `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。

**<font color="FF9D00">这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为</font>**

> 举个 🌰

```js
let target = { name: 'steins gate' }

let handler = {
  get: function (target, prop) {
    console.log(`Getting property ${prop}`)
    return Reflect.get(target, prop) // 调用 Reflect 来执行默认行为
  },
}

let proxy = new Proxy(target, handler)
console.log(proxy.name) // 输出 "Getting property name steins gate"
```

**<font color="FF9D00">`Reflect.get` 可以用于保持原有的对象行为，只是在执行前添加一些自定义逻辑</font>**

### `Reflect`的静态方法

- `Reflect.get(target, prop, receiver)`：`Reflect.get`方法用于读取一个对象的属性。它接受三个参数： `target`（目标对象）、`prop`（属性）、`receiver`（代理对象）。

- `Reflect.set(target, prop, value, receiver)`：`Reflect.set`方法用于设置一个对象的属性。它接受四个参数： `target`（目标对象）、`prop`（属性）、`value`（值）、`receiver`（代理对象）。
- `Reflect.has(target, prop)`：`Reflect.has`方法用于判断一个对象是否具有某个属性。它接受两个参数： `target`（目标对象）、`prop`（属性）。
- `Reflect.deleteProperty(target, prop)`：`Reflect.deleteProperty`方法用于删除一个对象的属性。它接受两个参数： `target`（目标对象）、`prop`（属性）。
- `Reflect.construct(target, args)`：`Reflect.construct`方法用于构造函数的调用。它接受两个参数： `target`（目标对象）、`args`（参数数组）。
- `Reflect.apply(target, thisArg, args)`：`Reflect.apply`方法用于调用函数。它接受三个参数： `target`（目标函数）、`thisArg`（函数的 this 上下文）、`args`（参数数组）。
- `Reflect.defineProperty(target, prop, attributes)`：`Reflect.defineProperty`方法用于定义一个对象的属性。它接受三个参数： `target`（目标对象）、`prop`（属性）、`attributes`（属性描述符）。
- `Reflect.getOwnPropertyDescriptor(target, prop)`：`Reflect.getOwnPropertyDescriptor`方法用于获取一个对象的属性描述符。它接受两个参数： `target`（目标对象）、`prop`（属性）。
- `Reflect.isExtensible(target)`：`Reflect.isExtensible`方法用于判断一个对象是否是可扩展的。它接受一个参数： `target`（目标对象）。
- `Reflect.preventExtensions(target)`：`Reflect.preventExtensions`方法用于阻止一个对象被扩展。它接受一个参数： `target`（目标对象）。
- `Reflect.ownKeys(target)`：`Reflect.ownKeys`方法用于返回一个对象的所有属性，包括自身的属性和继承的属性。它接受一个参数： `target`（目标对象）。
- `Reflect.setPrototypeOf(target, prototype)`：`Reflect.setPrototypeOf`方法用于设置一个对象的原型。它接受两个参数： `target`（目标对象）、`prototype`（原型对象）。
- `Reflect.getPrototypeOf(target)`：`Reflect.getPrototypeOf`方法用于获取一个对象的原型。它接受一个参数： `target`（目标对象）。

## `Proxy` 与 `Reflect` 的关系

- `Proxy` 提供了对象操作的拦截能力，而 `Reflect` 提供了对应的默认行为。两者结合可以很方便地对对象行为进行增强或修改。
- 使用 `Proxy` 可以拦截对象的操作，而使用 `Reflect` 可以调用对象的默认操作，从而确保对象行为不会被完全修改。

- `Reflect` 可以作为 `Proxy` 捕获器中的默认处理器，当我们想在自定义行为中保留对象的某些默认行为时，可以直接调用 `Reflect`。
