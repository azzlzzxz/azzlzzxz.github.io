# 箭头函数

## 什么是箭头函数

箭头函数是 Es6 新增的一种定义函数表达式的语法，它简化了我们之前写的函数书写方式，箭头函数实例化的函数对象与我们 Es5 之前创建的函数表达式的创建函数行为是相同的。在任何使用函数表达式的地方，都可以使用箭头函数。

## 箭头函数与普通函数有哪些区别

### 箭头函数的 this 指向规则

#### 箭头函数没有 prototype(原型)，所以箭头函数本身没有 this

```js
let sg = () => {}
console.log(sg.prototype) // undefined
```

#### 箭头函数的 this 指向在定义的时候继承自外层第一个普通函数的 this

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

##### 不能直接修改箭头函数的 this 指向

上个 🌰 中的 foo 函数修改一下，尝试直接修改箭头函数的 this 指向。

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

去修改被继承的普通函数的 this 指向，然后箭头函数的 this 指向也会跟着改变，这在上一个 🌰 中有演示。

```js
// 将bar普通函数的this指向barObj 然后内部的箭头函数也会指向barObj

bar.call(barObj)
```

#### 箭头函数外层没有普通函数，严格模式和非严格模式下它的 this 都会指向 window(全局对象)

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

#### 箭头函数的 this 指向全局，使用 arguments 会报未声明的错误

如果箭头函数的 this 指向 window(全局对象)使用 arguments 会报错，未声明 arguments。

```js
let b = () => {
  console.log(arguments)
}

b(1, 2, 3, 4)

Uncaught ReferenceError: arguments is not defined
```

如果你声明了一个全局变量为 arguments，那就不会报错了，但是你为什么要这么做呢？

箭头函数的 this 指向普通函数时,它的 argumens 继承于该普通函数

上面是第一种情况：箭头函数的 this 指向全局对象，会报 arguments 未声明的错误。

第二种情况是：箭头函数的 this 如果指向普通函数,它的 argumens 继承于该普通函数。

```js
function bar() {
  console.log(arguments) // ['外层第二个普通函数的参数']
  bb('外层第一个普通函数的参数')
  function bb() {
    console.log(arguments) // ["外层第一个普通函数的参数"]
    let a = () => {
      console.log(arguments, 'arguments继承this指向的那个普通函数') // ["外层第一个普通函数的参数"]
    }
    a('箭头函数的参数') // this指向bb
  }
}
bar('外层第二个普通函数的参数')
```

那么应该如何来获取箭头函数不定数量的参数呢？答案是：ES6 的 rest 参数（...扩展符）

#### rest 参数获取函数的多余参数

这是 ES6 的 API，用于获取函数不定数量的参数数组，这个 API 是用来替代 arguments 的，API 用法如下：

```js
let a = (first, ...abc) => {
  console.log(first, abc) // 1 [2, 3, 4]
}
a(1, 2, 3, 4)
```

上面的 🌰 展示了，获取函数除第一个确定的参数，以及用一个变量接收其他剩余参数的示例。

也可以直接接收函数的所有参数，rest 参数的用法相对于 arguments 的优点：

- 箭头函数和普通函数都可以使用。

- 更加灵活，接收参数的数量完全自定义。

- 可读性更好,参数都是在函数括号中定义的，不会突然出现一个 arguments，以前刚见到的时候，真的好奇怪了！

- rest 是一个真正的数组，可以使用数组的 API。
  因为 arguments 是一个类数组的对象，有些人以为它是真正的数组，所以会出现以下场景：

```js
arguments.push(0) // arguments.push is not a function
```

如上，如果我们需要使用数组的 API，需要使用扩展符/Array.from 来将它转换成真正的数组:

```js
arguments = [...arguments]; 或者 ：arguments = Array.from(arguments);
```

#### rest 参数有两点需要注意

1. rest 必须是函数的最后一位参数：

```js
let a = (first, ...rest, three) => {
  console.log(first, rest,three); // 报错：Rest parameter must be last formal parameter
};
a(1, 2, 3, 4);
```

2. 函数的 length 属性，不包括 rest 参数

```js
;(function (...a) {}).length(
  // 0
  function (a, ...b) {},
).length // 1
```

#### 使用 new 调用箭头函数会报错

无论箭头函数的 this 指向哪里，使用 new 调用箭头函数都会报错，因为箭头函数没有 constructor。

```js
let a = () => {}
let b = new a() // a is not a constructor
```

#### 箭头函数不支持 new.target：

new.target 是 ES6 新引入的属性，普通函数如果通过 new 调用，new.target 会返回该函数的引用。

此属性主要：用于确定构造函数是否为 new 调用的。

1. 箭头函数的 this 指向全局对象，在箭头函数中使用箭头函数会报错

```js
let a = () => {
  console.log(new.target); // 报错：new.target 不允许在这里使用
};
a();
```

2. 箭头函数的 this 指向普通函数，它的 new.target 就是指向该普通函数的引用

```js
new bb()
function bb() {
  let a = () => {
    console.log(new.target) // 指向函数bb：function bb(){...}
  }
  a()
}
```

### 箭头函数不支持重命名函数参数,普通函数的函数参数支持重命名

如下 🌰，普通函数的函数参数支持重命名，后面出现的会覆盖前面的，箭头函数会抛出错误：

```js
function func1(a, a) {
  console.log(a, arguments) // 2 [1,2]
}

var func2 = (a, a) => {
  console.log(a) // 报错：在此上下文中不允许重复参数名称
}
func1(1, 2)
func2(1, 2)
```

### 箭头函数相对于普通函数语法更简洁优雅

语法上的不同，也属与它们两个的区别！

1. 箭头函数都是匿名函数，并且都不用写 function

2. 只有一个参数的时候可以省略括号:

```js
var f = (a) => a // 传入a 返回a
```

3. 函数只有一条语句时可以省略{}和 return

```js
var f = (a, b, c) => a // 传入a,b,c 返回a
```

4. 简化回调函数，让你的回调函数更优雅

```js
;[1, 2, 3].map(function (x) {
  return x * x
}) // 普通函数写法
```

```js
;[(1, 2, 3)].map((x) => x * x) // 箭头函数只需要一行
```

## 箭头函数的注意事项及不适用场景

### 箭头函数的注意事项

1. 一条语句返回对象字面量，需要加括号，或者直接写成多条语句的 return 形式

```js
var func1 = () => {
  foo: 1
} // 想返回一个对象,花括号被当成多条语句来解析，执行后返回undefined

var func2 = () => ({ foo: 1 }) // 用圆括号是正确的写法

var func2 = () => {
  return {
    foo: 1, // 更推荐直接当成多条语句的形式来写，可读性高
  }
}
```

2. 箭头函数在参数和箭头之间不能换行！

```js
var func = ()
           => 1;  // 报错： Unexpected token =>

```

3. 箭头函数的解析顺序相对靠前

MDN: 虽然箭头函数中的箭头不是运算符，但箭头函数具有与常规函数不同的特殊[运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)解析规则

### 箭头函数不适用场景

1. 定义字面量方法,this 的意外指向

```js
const obj = {
  array: [1, 2, 3],
  sum: () => {
    // 根据上文学到的：外层没有普通函数this会指向全局对象
    return this.array.push('全局对象下没有array，这里会报错') // 找不到push方法
  },
}
obj.sum()
```

上述栗子使用普通函数或者 ES6 中的方法简写的来定义方法，就没有问题了

```js
// 这两种写法是等价的
sum() {
  return this.array.push('this指向obj');
}

sum: function() {
  return this.array.push('this指向obj');
}
```

还有一种情况是给普通函数的原型定义方法的时候，通常会在普通函数的外部进行定义，比如说继承/添加方法的时候。

这时候因为没有在普通函数的内部进行定义，所以 this 会指向其他普通函数，或者全局对象上，导致 bug！

2. 回调函数的动态 this

下面的栗子是一个修改 dom 文本的操作，因为 this 指向错误，导致修改失败

```js
const button = document.getElementById('myButton')
button.addEventListener('click', () => {
  this.innerHTML = 'Clicked button' // this又指向了全局
})
```

3. 考虑代码的可读性，使用普通函数

- 函数体复杂：具体表现就是箭头函数中使用多个三元运算符号，就是不换行，非要在一行内写完，非常恶心！

- 行数较多

- 函数内部有大量操作
