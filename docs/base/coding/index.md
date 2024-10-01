# 编程题

## `new`运算符

::: tip `new` 运算符原理

- 创建一个全新的对象

- 为新创建的对象添加 `__proto__` 属性并指向构造函数的原型对象

- 将新创建的对象作为函数调用的 `this`

- 如果构造函数没有返回对象类型，则返回新创建的对象

:::

::: info 模拟实现 `new` 运算符

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
