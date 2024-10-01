# Node 的事件循环机制

![node_eventLoop](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/Node_EventLoop.jpg)

## `event loop` 是一个独立的线程

当 `Node.js` 启动时，它初始化事件循环，处理提供的输入脚本，这些脚本可能进行异步 `API` 调用、调度计时器或调用 `process.nextTick()`，然后开始处理事件循环。

```lua
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     pending callbacks │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

::: tip 流程

- `timers:` 执行 `setTimeout` 和 `setInterval` 中到期的 `callback`。
- `pending callback:` 上一轮循环中少数的 `callback` 会放在这一阶段执行。
- `idle, prepare:` 仅在内部使用。
- `poll:` 最重要的阶段，执行 `pending` `callback`，在适当的情况下会阻塞在这个阶段。
- `check:` 执行 `setImmediate` 的 `callback`。

> `setImmediate()`是将事件插入到事件队列尾部，主线程和事件队列的函数执行完成之后立即执行 `setImmediate` 指定的回调函数

- `close callbacks:` 执行 close 事件的 `callback`，例如 `socket.on(‘close’[,fn])`或者 `http.server.on('close, fn)`。

:::

`event loop` 的每一次循环都需要依次经过上述的阶段。

每个阶段都有自己的 `FIFO` 的 `callback` 队列（在 `timer` 阶段其实使用一个[<u>最小堆</u>](/rsource/react/preknowledge.md#最小堆)而不是队列来保存所有元素，比如 `timeout` 的 `callback` 是按照超时时间的顺序来调用的，并不是先进先出的队列逻辑），每当进入某个阶段，都会从所属的队列中取出 `callback` 来执行。

当队列为空或者被执行 `callback` 的数量达到系统的最大数量时，进入下一阶段。这六个阶段都执行完毕称为一轮循环。

## `timers`

> 源码地址 [uv\_\_run_timers](https://github.com/nodejs/node/blob/23a3410f9fecf2c8652eef4f92b4072edf307137/deps/uv/src/timer.c#L163)

在 `timers` 阶段，会执行 `setTimeout` 和 `setInterval` 中到期的 `callback`。执行这两者回调需要设置一个毫秒数，理论上来说，应该是时间一到就立即执行 `callback` 回调，但是由于 `system` 的调度可能会延时，达不到预期时间。

> 举个 🌰

```js
const fs = require('fs')

function someAsyncOperation(callback) {
  fs.readFile('/path/to/file', callback)
}

const timeoutScheduled = Date.now()

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled

  console.log(`${delay}ms have passed since I was scheduled`)
}, 100)

someAsyncOperation(() => {
  const startCallback = Date.now()

  while (Date.now() - startCallback < 10) {
    // do nothing
  }
})
```

当进入事件循环时，它有一个空队列（`fs.readFile()`尚未完成），因此定时器将等待剩余毫秒数，当到达 `95ms`（假设 `fs.readFile()`需要 `95ms`）时，`fs.readFile()`完成读取文件并且其完成需要 `10ms` 的回调被添加到轮询队列并执行。

因此，原本设置 `100ms` 后执行的回调函数，会在约 `105ms` 后执行。

## `pending callbacks`

此阶段执行某些系统操作（例如 `TCP` 错误类型）的回调。

例如：如果 `TCP socket ECONNREFUSED` 在尝试 `connect` 时 `receives`， 系统希望等待报告错误，这将在 `pending callbacks` 阶段执行。

## `poll`（轮询）

执行 `pending callback`，在适当的情况下会阻塞在这个阶段。

`poll` 里面 有很多回调 node 中有执行的最大个数，超过最大个数会被延迟到下一轮循环执行。

`poll` 阶段有两个主要功能：

1. 执行 `I/O`（连接、数据进入/输出）回调。
2. 处理轮询队列中的事件。

当事件循环进入 `poll` 阶段并且在 `timers` 中没有可以执行定时器时：

- 如果 `poll` 队列不为空，则事件循环将遍历其同步执行它们的 `callback` 队列，直到队列为空，或者达到 system-dependent（系统相关限制）。

- 如果 `poll` 队列为空，会检查是否有 `setImmediate()`回调需要执行，如果有则马上进入执行 `check` 阶段以执行回调。

- 如果 `timers` 中有可以执行定时器且 `poll` 队列为空时，则会判断是否有 `timer` 超时，如果有的话会回到 `timer` 阶段执行回调。

## `check`

此阶段执行 `setImmediate` 的 `callback`。

`setImmediate()`实际上是一个特殊的计时器，它在事件循环的一个单独阶段运行。它使用一个 `libuv API`，该 `API` 在 `poll` 阶段完成后执行 `callback`。

- `setImmediate()`和 `setTimeout()`是相似的，但根据它们被调用的时间以不同的方式表现。

- `setImmediate()`设计用于在当前 `poll` 阶段完成后 `check` 阶段执行脚本 。

- `setTimeout()` 安排在经过`最小（ms）`后运行的脚本，在 `timers` 阶段执行。

> 举个 🌰

```js
const fs = require('fs')

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout')
  }, 0)
  setImmediate(() => {
    console.log('immediate')
  })
})
```

```lua
immediate
timeout
```

主要原因是在 `I/O` 阶段读取文件后，事件循环会先进入 `poll` 阶段，发现有 `setImmediate` 需要执行，会立即进入 check 阶段执行 `setImmediate` 的回调。然后再进入 timers 阶段，执行 `setTimeout`，打印 `timeout`。

### `setImmediate` 与 `setTimeout` 的区别

`setImmediate()`  和  `setTimeout()`  很类似，但是基于被调用的时机，他们也有不同表现。

1. `setImmediate()`  设计为一旦在当前   轮询   阶段完成， 就执行脚本。
2. `setTimeout()`  在最小阈值（ms 单位）（定时器时间到达）过后运行脚本。

执行计时器的顺序将根据调用它们的上下文而异。

**如果二者都从主模块内调用，则计时器将受进程性能的约束（这可能会受到计算机上其他正在运行应用程序的影响）。**

例如，如果运行以下不在 `I/O` 周期（即主模块）内的脚本，则执行两个计时器的顺序是非确定性的，因为它受进程性能的约束：

```js
setTimeout(() => {
  console.log('timeout')
}, 0)

setImmediate(() => {
  console.log('immediate')
})
```

```lua
$ node timeout_vs_immediate.js
timeout
immediate

$ node timeout_vs_immediate.js
immediate
timeout
```

**<font color="#FF4444">但是，如果你把这两个函数放入一个 `I/O` 循环内调用，`setImmediate` 总是被优先调用：因为 `I/O` 操作是在 `poll` 阶段进行的，`poll` 阶段之后是 `check`（也就是调用 `setImmediate`）。</font>**

```js
const fs = require('fs')
// I/O  轮询时会执行i/o回调 如果没有定义setImmediate会等待剩下的i/o完成 或者定时器到达时间
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout')
  }, 0)
  setImmediate(() => {
    // 不是特别重要的任务 可以放到setImmediate
    console.log('immediate')
  })
})
```

```lua
$ node timeout_vs_immediate.js
immediate
timeout

$ node timeout_vs_immediate.js
immediate
timeout
```

**使用  `setImmediate()`  相对于 `setTimeout()`  的主要优势是，如果 `setImmediate()`是在 `I/O` 周期内被调度的，那它将会在其中任何的定时器之前执行，跟这里存在多少个定时器无关。**

## `close callbacks`

如果套接字或句柄突然关闭(例如 `socket.destroy()`)，那么`’close’`事件将在这个阶段发出。否则，它将通过 `process.nextTick()`发出。

`process.nextTick()`方法将 `callback` 添加到 `next tick` 队列。 一旦当前事件轮询队列的任务全部完成，在 `next tick` 队列中的所有 `callbacks` 会被依次调用。即，当每个阶段完成后，如果存在 `nextTick` 队列，就会清空队列中的所有回调函数，并且优先于其他 `microtask` 执行。

`Nodejs` 与浏览器的 `Event Loop` 差异：

- `Node` 端，`microtask（微任务）` 在事件循环的各个阶段之间执行。
- 浏览器端，`microtask（微任务）` 在事件循环的 `macrotask（宏任务）`执行完之后执行。

![diff](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/diff.png)
