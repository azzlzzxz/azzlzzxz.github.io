# 编程题

## 浅拷贝与深拷贝

### 浅拷贝

浅拷贝是创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝：基本类型拷贝的是值，引用类型拷贝的就是内存地址；所以当我们操作新对象中的引用类型时会影响源对象

- `Object.assign`

```js
const obj1 = {
  name: 'steinsgate',
  child: { a: 1 },
}

const obj2 = Object.assign({}, obj1)
obj2.name = 'azzlzzxz'
obj2.child.a++

obj1 // { name: 'steinsgate', child: { a: 2 } }
obj2 // { name: 'azzlzzxz', child: { a: 2 } }
```

- `concat`

```js
const arr1 = [1, 2, [3, 4]]

const arr2 = arr1.concat()
arr2[0] = 'arr2'
arr2[2][0] = 'arr2'

arr1 // [1, 2, ['arr2', 4]];
arr2 // ['arr2', 2, ['arr2', 4]];
```

- `ES6` 扩展运算符

```js
/* 对象 */
const obj1 = {
  name: 'steinsgate',
  child: { a: 1 },
}

const obj2 = { ...obj1 }
obj2.name = 'azzlzzxz'
obj2.child.a++

obj1 // { name: 'steinsgate', child: { a: 2 } }
obj2 // { name: 'azzlzzxz', child: { a: 2 } }

/* 数组 */
const arr1 = [1, 2, [3, 4]]

const arr2 = [...arr1]
arr2[0] = 'arr2'
arr2[2][0] = 'arr2'

arr1 // [1, 2, ['arr2', 4]];
arr2 // ['arr2', 2, ['arr2', 4]];
```

### 深拷贝

深拷贝是将一个对象从内存中完整的拷贝一份出来，即从堆内存中开辟一个新的区域存放新对象，所以修改新对象不会影响原对象

- `JSON.parse(JSON.stringify())`

```js
const obj1 = {
  name: 'steinsgate',
  child: { a: 1 },
}

const obj2 = JSON.parse(JSON.stringify(obj1))
obj2.name = 'azzlzzxz'
obj2.child.a++

obj1 // { name: 'steinsgate', child: { a: 1 } }
obj2 // { name: 'azzlzzxz', child: { a: 2 } }
```

::: warning 缺点

- 只能序列化对象的可枚举的自有属性

- `undefined`、`Symbol`、任意函数将被忽略

- `NaN`、`Infinity` 、`-Infinity` 将被当成 `null` 处理

- `RegExp`、`Error`、`Set`、`Map` 等特殊对象，仅会序列化可枚举的属性（一般情况下即为空对象）

- `Date` 类型，转换后会调用 `toJSON` 转为字符串类型

- 循环引用的对象将报错

:::

- `lodash.cloneDeep`

```js
import { cloneDeep } from 'lodash-es'

const obj2 = cloneDeep(obj1)
```

- 手写实现深拷贝

::: details 工具函数

- 判断引用类型

```js
function isObject(target) {
  const type = typeof target
  return target !== null && (type === 'object' || type === 'function')
}
```

- 获取数据类型

```js
function getType(target) {
  return Object.prototype.toString.call(target)
}
```

- 常用的数据类型

```js
/** 可遍历 */
const mapTag = '[object Map]'
const setTag = '[object Set]'
const arrayTag = '[object Array]'
const argsTag = '[object Arguments]'
const objectTag = '[object Object]'

/** 不可遍历 */
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const numberTag = '[object Number]'
const regexpTag = '[object RegExp]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'

const deepTag = [mapTag, setTag, arrayTag, argsTag, objectTag]
```

- 获取可遍历类型的初始化数据

```js
function getInit(target) {
  const Ctor = target.constructor
  return new Ctor()
}
```

- 获取不可遍历类型的初始化数据

```js
function cloneOtherType(targe, type) {
  const Ctor = targe.constructor
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(targe)
    case regexpTag:
      return cloneReg(targe)
    case symbolTag:
      return cloneSymbol(targe)
    default:
      return null
  }
}
```

- 克隆 `Symbol` 类型

```js
function cloneSymbol(targe) {
  return Object(Symbol.prototype.valueOf.call(targe))
}
```

- 克隆正则

```js
function cloneReg(targe) {
  const reFlags = /\w*$/
  const result = new targe.constructor(targe.source, reFlags.exec(targe))
  result.lastIndex = targe.lastIndex

  return result
}
```

- 克隆函数

```js
function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m
  const paramReg = /(?<=\().+(?=\)\s+{)/
  const funcString = func.toString()
  if (func.prototype) {
    console.log('普通函数')
    const param = paramReg.exec(funcString)
    const body = bodyReg.exec(funcString)
    if (body) {
      console.log('匹配到函数体：', body[0])
      if (param) {
        const paramArr = param[0].split(',')
        console.log('匹配到参数：', paramArr)
        return new Function(...paramArr, body[0])
      } else {
        return new Function(body[0])
      }
    } else {
      return null
    }
  } else {
    return eval(funcString)
  }
}
```

:::

```js
function clone(target, map = new WeakMap()) {
  // 克隆原始类型
  if (!isObject(target)) {
    return target
  }

  // 初始化
  const type = getType(target)
  let cloneTarget
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target, type)
  }

  // 防止循环引用
  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)

  // 克隆set
  if (type === setTag) {
    target.forEach((value) => {
      cloneTarget.add(clone(value, map))
    })
    return cloneTarget
  }

  // 克隆map
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value, map))
    })
    return cloneTarget
  }

  // 克隆对象和数组
  const keys = type === arrayTag ? undefined : Object.keys(target)
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value
    }
    cloneTarget[key] = clone(target[key], map)
  })

  return cloneTarget
}
```

::: info 相关资料

- [<u>如何写出一个惊艳面试官的深拷贝</u>](https://juejin.cn/post/6844903929705136141#heading-7)

:::

## `new`运算符

::: tip `new` 运算符原理

- 创建一个全新的对象

- 为新创建的对象添加 `__proto__` 属性并指向构造函数的原型对象

- 将新创建的对象作为函数调用的 `this`

- 如果构造函数没有返回对象类型，则返回新创建的对象

:::

::: info 模拟实现 new 运算符

```js
function myNew() {
  // 用new Object() 的方式新建了一个对象 obj
  const obj = new Object()

  // 取出第一个参数，就是我们要传入的构造函数
  const Constructor = [].shift.call(arguments)

  // 将 obj 的原型指向构造函数
  obj.__proto__ = Constructor.prototype

  // 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
  const result = Constructor.apply(obj, arguments)

  // 返回构造函数显示返回的值或新对象
  return result && (type === 'object' || type === 'function') ? result : obj
}
```

:::

::: info 相关资料

- [<u>JavaScript 深入之 new 的模拟实现</u>](https://github.com/mqyqingfeng/Blog/issues/13)

:::

## `Object.create`

> `Object.create()` 方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__`

::: info 模拟实现 Object.create

```js
function create(proto, properties) {
  // 如果 proto 不是 null 或非原始包装对象，抛出 TypeError 异常
  const type = typeof proto
  if (type !== 'object' && type !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null: ' + proto)
  }

  function Fn() {}
  // 将 proto 的原型设置为 Fn 的原型
  Fn.prototype = proto
  // 创建新对象
  const result = new Fn()

  // 兼容 null 的处理
  if (proto === null) {
    result.__proto__ = null
    // OR Reflect.setPrototypeOf(result, null)
  }

  // 将 properties 的属性设置到新对象上
  if (properties !== null && properties !== undefined) {
    Object.defineProperties(result, properties)
  }

  return result
}
```

:::

## `call` 实现

> `call()` 方法在使用一个指定的 `this` 值和若干个指定的参数值的前提下调用某个函数或方法。

::: info 模拟 call 实现

```js
Function.prototype.myCall = function (context, ...args) {
  // 在非严格模式下，传入的 context 为 null 或 undefined 时会自动替换为全局对象
  // 因此在判断时不能使用 context = context || window
  if (context == null) {
    context = window
  } else {
    // 原始值需要被 Object 包装成对象
    context = Object(context)
  }

  // 创建一个唯一的符号属性，防止覆盖原有属性
  const fn = Symbol('fn')

  // 将当前函数（即调用 myCall 的函数）作为 context 的一个属性
  context[fn] = this

  // 使用上下文调用这个函数，并传递参数
  const result = context[fn](...args)

  // 删除临时添加的属性
  delete context[fn]

  // 返回函数执行的结果
  return result
}
```

:::

::: info 相关资料

- [<u>JavaScript 深入之 call 和 apply 的模拟实现</u>](https://github.com/mqyqingfeng/Blog/issues/11)

:::

## `apply` 实现

> `apply()` 方法调用一个具有给定 `this` 值的函数，以及以一个数组（或类数组对象）的形式提供的参数

::: info 模拟 apply 实现

```js
Function.prototype.myApply = function (context, arr) {
  // 在非严格模式下，传入的 context 为 null 或 undefined 时会自动替换为全局对象
  // 因此在判断时不能使用 context = context || window
  if (context == null) {
    context = window
  } else {
    // 原始值需要被 Object 包装成对象
    context = Object(context)
  }

  // 创建一个唯一的符号属性，防止覆盖原有属性
  const fn = Symbol('fn')

  // 将当前函数（即调用 myApply 的函数）作为 context 的一个属性
  context[fn] = this

  // 使用上下文调用这个函数，并传递参数
  const result = context[fn](...arr)

  // 删除临时添加的属性
  delete context[fn]

  // 返回函数执行的结果
  return result
}
```

:::

::: info 相关资料

- [<u>JavaScript 深入之 call 和 apply 的模拟实现</u>](https://github.com/mqyqingfeng/Blog/issues/11)

:::

## `bind` 实现

> `bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数供调用时使用。

::: info 模拟 bind 实现

```js
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('not a function')
  }

  const self = this

  return function F(...fArgs) {
    const params = [...args, ...fArgs]
    // 当作为构造函数时
    if (this instanceof F) {
      return new self(...params)
    }

    // 当作为普通函数时，将函数的 this 指向 context
    return self.apply(context, params)
  }
}
```

:::

::: info 相关资料

- [<u>JavaScript 深入之 bind 的模拟实现</u>](https://github.com/mqyqingfeng/Blog/issues/12)

:::

## `debounce` 防抖函数

::: tip `debounce`

- 作用： 一个函数在一段时间内多次触发都只执行最后一次

- 原理： 利用定时器，在函数第一次执行时设定一个定时器，再次调用时如果已经设定过定时器就清空之前的定时器并设定一个新的定时器，当定时器结束后执行传入的回调函数

- 应用： 搜索输入框获取用户输入的结果

:::

::: info 实现防抖函数

```js
function debounce(fn, wait) {
  // 通过闭包缓存定时器 id
  let timer = null

  return function (...args) {
    // 如果定时器已经存在，清除定时器
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    // 设定定时器，定时器结束后执行传入的回调函数 fn
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}
```

:::

## `throttle` 节流函数

::: tip `throttle`

- 作用： 函数节流指指的是在一段时间内只允许函数执行一次 (例如 `3` 秒执行一次那么在函数第一次调用后的 `3` 秒内后面的函数调用将被忽略)

- 原理： 利用时间戳来判断，记录上次执行的时间戳，在每次触发事件时判断当前时间是否大于上次执行的时间 + 设置的间隔 ，如果是则执行回调并更新上次执行的时间戳

- 应用： 降低 `scroll resize` 事件的触发频率
  :::

::: info 实现节流函数

```js
function throttle(fn, wait) {
  // 通过闭包缓存上一次的调用时间 (默认为 0)
  let lastCallTime = 0
  return function () {
    const now = Date.now()
    // 判断当前调用时间和上次调用时间的差值是否大于 wait
    if (now - lastCallTime >= wait) {
      // 更新调用时间
      lastCallTime = now
      // 执行回调函数
      fn.apply(this, arguments)
    }
  }
}
```

:::
