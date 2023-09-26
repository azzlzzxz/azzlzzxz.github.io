# 箭头函数

## 什么是箭头函数

箭头函数是 Es6 新增的一种定义函数表达式的语法，它简化了我们之前写的函数书写方式，箭头函数实例化的函数对象与我们 Es5 之前创建的函数表达式的创建函数行为是相同的。在任何使用函数表达式的地方，都可以使用箭头函数。

## 箭头函数与普通函数有哪些区别

### 箭头函数的 this 指向规则

1. 箭头函数没有 prototype(原型)，所以箭头函数本身没有 this

```js
let sg = () => {}
console.log(sg.prototype) // undefined
```

2. 箭头函数的 this 指向在定义的时候继承自外层第一个普通函数的 this

一个函数中定义箭头函数，然后在另一个函数中执行箭头函数。

```js
let a,
  barObj = { msg: 'bar的this指向' }

fooObj = { msg: 'foo的this指向' }

bar.call(barObj) // 将bar的this指向barObj
foo.call(fooObj) // 将foo的this指向fooObj

function foo() {
  a() // 结果：{ msg: 'bar的this指向' }
}

function bar() {
  a = () => {
    console.log(this, 'this指向定义的时候外层第一个普通函数') //
  } // 在bar中定义 this继承于bar函数的this指向
}
```

从上面 🌰 中可以得出两点：

- 箭头函数的 this 指向定义时所在的外层第一个普通函数，跟使用位置没有关系。
- 被继承的普通函数的 this 指向改变，箭头函数的 this 指向会跟着改变

3. 不能直接修改箭头函数的 this 指向

上个栗子中的 foo 函数修改一下，尝试直接修改箭头函数的 this 指向。

```js
let fnObj = { msg: '尝试直接修改箭头函数的this指向' }

function foo() {
  a.call(fnObj) // 结果：{ msg: 'bar的this指向' }
}
```

很明显，call 显示绑定 this 指向失败了，包括 apply、bind 都一样。

> 它们(call、aaply、bind)会默认忽略第一个参数，但是可以正常传参。

然后我又通过隐式绑定来尝试同样也失败了，new 调用会报错，所有，箭头函数不能直接修改它的 this 指向。

然而，我们可以通过间接的形式来修改箭头函数的指向：

去修改被继承的普通函数的 this 指向，然后箭头函数的 this 指向也会跟着改变，这在上一个栗子中有演示。

```js
// 将bar普通函数的this指向barObj 然后内部的箭头函数也会指向barObj

bar.call(barObj)
```

4. 箭头函数外层没有普通函数，严格模式和非严格模式下它的 this 都会指向 window(全局对象)

既然箭头函数的 this 指向在定义的时候继承自外层第一个普通函数的 this，那么当箭头函数外层没有普通函数，它的 this 会指向哪里？

这里跟我之前写的 this 绑定规则不太一样(不懂的可以点进去看一下),普通函数的默认绑定规则是：

- 在非严格模式下，默认绑定的 this 指向全局对象，严格模式下 this 指向 undefined
- 如果箭头函数外层没有普通函数继承，它 this 指向的规则：箭头函数在全局作用域下，严格模式和非严格模式下它的 this 都会指向 window(全局对象)。

严格模式在中途声明无效，必须在全局/函数的开头声明才会生效：

```js
a = 1
;('use strict') // 严格模式无效 必须在一开始就声明严格模式

b = 2 // 不报错
```

### 箭头函数的 arguments

1. 箭头函数的 this 指向全局，使用 arguments 会报未声明的错误

如果箭头函数的 this 指向 window(全局对象)使用 arguments 会报错，未声明 arguments。

```js
let b = () => {
  console.log(arguments)
}

b(1, 2, 3, 4)

Uncaught ReferenceError: arguments is not defined
```
