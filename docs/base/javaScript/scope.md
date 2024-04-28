# 作用域

## 作用域

作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突。

执行上下文中还包含作用域链。理解作用域之前，先介绍下作用域。作用域其实可理解为该上下文中声明的 变量和声明的作用范围。可分为 块级作用域 和 函数作用域

特性:

- 声明提前: 一个声明在函数体内都是可见的, 函数优先于变量
- 非匿名自执行函数，函数变量为 只读 状态，无法修改

```js
let foo = function () {
  console.log(1)
}
;(function foo() {
  foo = 10 // 由于 foo 在函数中只为可读，因此赋值无效
  console.log(foo)
})()
```

```lua
foo(){ foo = 10 ; console.log(foo)}
```

1. 全局作⽤域 在 `<script>` 标签中定义的变量——全局变量 不使⽤ `var` 声明直接使⽤的变量——全局变量。
2. 局部作⽤域 只有在函数内部使⽤ `var` 定义的变量才是局部变量超出函数的作⽤范围后，局部变量被销毁。
3. 块级作⽤域 使⽤代码块限定的作⽤域`（let、const）`。`JavaScript` 中没有块级作⽤域 `if` 、 `for` 中使⽤ `var` 定义的变量都是全局变量。

**`JavaScript` 变量生命周期：**

1. `JavaScript` 变量生命周期在它声明时初始化。
2. 局部变量在函数执行完毕后销毁。
3. 全局变量在页面关闭后销毁

## 作用域链

当代码在一个环境中创建时，会创建变量对象的一个作用域链`（scope chain）`来保证对执行环境有权访问的变量和函数。作用域第一个对象始终是当前执行代码所在环境的变量对象`（VO）`。如果是函数执行阶段，那么将其` activation object（AO）`作为作用域链第一个对象，第二个对象是上级函数的执行上下文 `AO`，下一个对象依次类推。

在《`JavaScript `深入之变量对象》中讲到，当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

函数中所能访问的变量按照层级关系所组成的一条有着先后顺序的链子，所以每个函数最先能访问的变量（也就是在这条链子上最先能接触到的）是当前函数的活动对象（就是在函数当中定义或重新赋值的变量），其次下一个能访问的变量就是当前的函数所在的包含环境。（其包含环境一般是指外部函数或全局执行环境。但在 `ES6` 当中块级代码语句也有可能生成包含环境。）然后是下下个包含环境。这样一层层的找下去，直到找到全局执行环境为止

- 函数的生命周期
- 变量和函数的声明
- `Activetion Object（AO）`、`Variable Object（VO）`

### 函数的生命周期

创建：`JS` 解析引擎进行预解析，会将函数声明提前，同时将该函数放到全局作用域中或当前函数的上一级函数的局部作用域中。

执行：`JS` 引擎会将当前函数的局部变量和内部函数进行声明提前，然后再执行业务代码，当函数执行完退出时，释放该函数的执行上下文，并注销该函数的局部变量。

变量和函数的声明：如果变量名和函数名声明时相同，函数优先声明。

`Activetion Object（AO）`、`Variable Object（VO）`：

- `AO：Activetion Object（活动对象）`
- `VO：Variable Object（变量对象）`

`VO` 对应的是函数创建阶段，`JS` 解析引擎进行预解析时，所有的变量和函数的声明，统称为 `Variable Object`。该变量与执行上下文相关，知道自己的数据存储在哪里，并且知道如何访问。`VO `是一个与执行上下文相关的特殊对象，它存储着在上下文中声明的以下内容：

- 变量 (`var`, 变量声明);
- 函数声明 (`FunctionDeclaration`, 缩写为 `FD`);
- 函数的形参

`AO` 对应的是函数执行阶段，当函数被调用执行时，会建立一个执行上下文，该执行上下文包含了函数所需的所有变量，该变量共同组成了一个新的对象就是 `Activetion Object`。该对象包含了：

- 函数的所有局部变量
- 函数的所有命名参数
- 函数的参数集合
- 函数的 `this` 指向