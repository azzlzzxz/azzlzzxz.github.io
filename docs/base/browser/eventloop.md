# 浏览器事件循环机制

**事件循环机制：`event loop` 即事件循环，是指浏览器或`Node`的一种解决`javaScript`单线程运行时不会阻塞的一种机制，也就是我们经常使用异步的原理。**

- `JavaScript` 是一个单进程的语言，同一时间不能处理多个任务，所以何时执行宏任务，何时执行微任务？我们需要有这样的一个判断逻辑存在。

例如：

每办理完一个业务，柜员就会问当前的客户，是否还有其他需要办理的业务。（检查还有没有微任务需要处理）

而客户明确告知说没有事情以后，柜员就去查看后边还有没有等着办理业务的人。（结束本次宏任务、检查还有没有宏任务需要处理）

这个检查的过程是持续进行的，每完成一个任务都会进行一次，而这样的操作就被称为 `Event Loop`。

## 浏览器中的事件循环

![browser_eventLoop](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/browser_EventLoop.jpeg)

- 整体`script`作为第一个宏任务进入主线程。
- 同步任务被放到执行栈，异步任务会进入`Event Table`并注册函数，其回调函数按类别被放到宏任务队列和微任务队列中。
- 执行完所有同步任务后，开始读取任务队列中的结果。检查微任务队列，如果有任务则按顺序执行。
- 执行完所有微任务后，开始下一个宏任务。如此循环，直到两个队列（宏任务队列和微任务队列）的任务都执行完。

**<font color="F19594">默认先执行宏任务` （script 脚本）`,会清空所有的微任务 (全部执行完毕) ,微任务执行后开始页面渲染（不是每次都渲染：如果一次渲染东西过少，有可能多次渲染进行合并的）,取出一个宏任务执行，执行过程中可能再次产生宏任务、微任务。。。不停的循环。</font >**

### 主线程、执行栈、任务队列

`Javascript` 有一个`main thread`主线程 和`call-stack`执行栈。所有的任务都会被放到执行栈等待主线程执行。

#### 执行栈

执行栈是在其它编程语言中所说的“调用栈”，是一种拥有` LIFO（后进先出）`数据结构的栈，被用来存储代码运行时创建的所有执行上下文。

（作用域链）当`JavaScript`引擎第一次遇到你的脚本时，它会创建一个全局的执行上下文并且压入当前执行栈。

每当引擎遇到一个函数调用，它会为该函数创建一个新的执行上下文并压入栈的顶部。

引擎会执行那些执行上下文位于栈顶的函数。当该函数执行结束时，执行上下文从栈中弹出，控制流程到达当前栈中的下一个上下文。

#### 任务队列`Task Queue`

队列：是一种先进先出的一种数据结构。

### 同步任务和异步任务

`Javascript` 单线程任务被分为同步任务和异步任务。

1. 同步任务会在执行栈中按照顺序等待主线程依次执行
2. 异步任务会进入`Event Table`并注册函数。
3. 当指定的事情完成时，`Event Table` 会将这个函数移入任务队列中。等待主线程空闲的时候（执行栈被清空），任务队列的任务按顺序被读取到栈内等待主线程的执行。

如图：

![task](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/task.jpg)

### 宏任务和微任务

除了广义的同步任务和异步任务，我们对任务有更精细的定义。在高层次上，`JavaScript` 中有宏任务`（MacroTask）`和微任务`（MicroTask）`。

1. `MacroTask（宏任务）`包括`script`全部代码、`setTimeout`、`setInterval`、`I/O`、`UI Rendering` 等；

![macro](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/macro.png)

1. `MicroTask（微任务`）包括 `Process.nextTick（Node 独有）`、`Promise.then`、`Object.observe(废弃)`等。

![micro](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/micro.png)

#### 浅析宏任务与微任务的区别：

- 这个就像去银行办业务一样，先要取号进行排号。

- 一般上边都会印着类似：“您的号码为 XX，前边还有 XX 人。”之类的字样。

- 因为柜员同时只能处理一个来办理业务的客户，这时每一个来办理业务的人就可以认为是银行柜员的一个宏任务来存在的，当柜员处理完当前客户的问题以后，选择接待下一位，广播报号，也就是下一个宏任务的开始。

- 多个宏任务合在一起就可以认为说有一个任务队列，里面是当前银行中所有的排号客户。

- 任务队列中都是已完成的异步操作，而不是说注册一个异步任务就会被放在这个任务队列中，就像在银行中排号，如果叫到你你不在，号码就作废了，柜员会跳过进行下一个客户处理。

- 而且一个宏任务在执行过程中，是可以添加一些微任务的，就像在柜台办理业务，你前边的一位老大爷可能在存款，在存款这个业务办理完以后，柜员会问老大爷还有没有其他需要办理的业务。

- 也就是说在当前的微任务没有执行完成时，是不会执行下一个宏任务的。

简单的来看一个 🌰：

```js
setTimeout(() => console.log(4))
// setTimeout是作为宏任务来存在的，
new Promise((resolve) => {
  resolve()
  console.log(1)
}).then((_) => {
  // Promise.then是微任务
  console.log(3)
})

console.log(2)
// 1 2 3 4
```

所有会进入的异步都是指的是事件回调中的代码。

也就是说`new Promsie`在实例化的过程中所执行的代码都是同步进行的，而`then`中注册的回调才是异步执行的。

在同步代码执行完成后才会回去检查是否有异步任务完成，并执行对应的回调，而微任务又会在宏任务之前执行，所以会输出 1、2、3、4。

+号部分表示同步执行的代码

```js
+setTimeout(_ => {
-  console.log(4)
+})

+new Promise(resolve => {
+  resolve()
+  console.log(1)
+}).then(_ => {
-  console.log(3)
+})

+console.log(2)
```

本来`setTimeout`已经先设置了定时器（相当于取号），然后在当前的进程中有添加了一些`Promsie`的处理（临时添加的业务）。

所以进阶的，即便我们继续在`Promise`中实例化`Promise`，其输出依然会早于`setTimeout`的宏任务。

```js
setTimeout((_) => console.log(4))

new Promise((resolve) => {
  resolve()
  console.log(1)
}).then((_) => {
  console.log(3)
  Promise.resolve()
    .then((_) => {
      console.log('before timeout')
    })
    .then((_) => {
      Promise.resolve().then((_) => {
        console.log('also before timeout')
      })
    })
})

console.log(2)
```

```shell
1
2
3
before timeout
also before timeout
4
```

## Node EventLoop

想了解 `Node EventLoop` 👇

[Node EventLoop 🚀](../../node/base/eventLoop.md)
