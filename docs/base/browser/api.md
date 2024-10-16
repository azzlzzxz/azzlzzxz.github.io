# 浏览器相关的 API

## History API

`History API` 通过 `history` 全局对象提供了对浏览器会话的历史记录，你可以在用户的历史记录中来回导航，而且可以操作历史记录栈中的内容。

::: tip 注意 ⚠️

`History API` 仅在主线程`（Window）`中可用。无法在 `Worker` 上下文中访问它。

:::

- `history.back()`

在历史记录中向后跳转，这和用户点击浏览器的回退`（Back）`按钮的效果相同。

- `history.forward()`

在历史记录中向前跳转，这和用户点击浏览器的回退`（Forward）`按钮的效果相同。

- `history.go()`

可以用 `go()`方法从会话历史记录中加载某一特定页面，该页面使用与当前页面的相对位置来标识（当前页面的相对位置为 0）。

> 举个 🌰

```js
history.go(-1)
history.go(1)

// 以下语句都具有刷新页面的效果
history.go(0)
history.go()
```

- `history.length`

可以通过查看 `length` 属性的值来确定历史记录栈中的页面数量。

- `history.pushState()`

向浏览器的会话历史栈增加了一个条目。

- `history.replaceState()`

用新的条目替换当前的历史记录条目。

- `popstate`

`popstate` 事件只会在浏览器某些行为下触发，比如点击后退按钮（或者在 `JavaScript` 中调用 `history.back()` 方法）。在同一文档的两个历史记录条目之间导航会触发该事件。

> 举个 🌰

```js
window.addEventListener('popstate', (event) => {
  alert(`位置：${document.location}，状态：${JSON.stringify(event.state)}`)
})

history.pushState({ page: 1 }, '标题 1', '?page=1')
history.pushState({ page: 2 }, '标题 2', '?page=2')
history.replaceState({ page: 3 }, '标题 3', '?page=3')

history.back() // http://example.com/example.html?page=1，状态：{"page":1}”
history.back() // http://example.com/example.html，状态：null”
history.go(2) // http://example.com/example.html?page=3，状态：{"page":3}”
```

- `hashchange`

当 `URL` 的片段标识符（以 `#` 符号开头和之后的 `URL` 部分）更改时，将触发 `hashchange` 事件。

::: tip 注意

- `history.pushState`、`history.replaceState` 这种并不会触发 `popstate`，只有在 `history` 之间导航才会触发。

:::

::: info 相关资料

- [<u>MDN | History_API</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)

:::

## requestIdleCallback

[<u>MDN requestIdleCallback API 🚀</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)

- 我们希望快速响应用户，让用户觉得够快，不能阻塞用户的交互。
- `requestIdleCallback` 使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。
- 正常帧任务完成后没超过 `16.6 ms`，说明时间有富余，此时就会执行 `requestIdleCallback` 里注册的任务。

![requestIdleCallback](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/requestIdleCallback.jpeg)

::: tip 缺点

1. 兼容性问题 [<u>requestIdleCallback 的兼容性 🚀</u>](https://caniuse.com/?search=requestIdleCallback)。
2. 执行任务的帧空闲时间不可控（`React` 自己实现了一个 `requestIdleCallback`）。
3. 一个任务就是最小的执行单位，不能被打断，所以有可能会被卡住。

:::

> 举个例子 🌰

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>requestIdleCallback</title>
  </head>

  <body>
    <script>
      function sleep(duration) {
        for (var t = Date.now(); Date.now() - t <= duration; ) {}
      }

      const works = [
        () => {
          console.log('第1个任务开始')
          // 任务执行时间少过当前帧的空余时间，就会等待当前任务执行完毕，当前帧才会结束
          sleep(1000)
          console.log('第1个任务结束')
        },
        () => {
          console.log('第2个任务开始')
          sleep(20)
          console.log('第2个任务结束')
        },
        () => {
          console.log('第3个任务开始')
          sleep(20)
          console.log('第3个任务结束')
        },
      ]

      requestIdleCallback(workLoop)

      function workLoop(deadline) {
        //因为一帧是16.6ms，浏览器执行完高优先级之后，如果还有时间，会执行workLoop,timeRemaining获取此帧剩下的时间
        console.log(`本帧的剩余时间是`, deadline.timeRemaining())

        //如果没有剩余时间了，就会跳出循环
        while (deadline.timeRemaining() > 1 && works.length > 0) {
          // 还有空闲时间 && 还有任务没执行
          performUnitOfWork()
        }

        //如果还有剩余任务
        if (works.length > 0) {
          console.log(
            `只剩下${deadline.timeRemaining()}ms，不够了，等待浏览器下次空闲 的时候再帮我调用`,
          )
          requestIdleCallback(workLoop)
        }
      }

      function performUnitOfWork() {
        //取出任务数组中的第一个任务，并移除第一个任务
        let work = works.shift()
        work()
      }
    </script>
  </body>
</html>
```

```lua
- 本帧的剩余时间是 5.4
- 第1个任务开始
- 第1个任务结束
- 只剩下0ms，不够了，等待浏览器下次空闲 的时候再帮我调用
- 本帧的剩余时间是 3.3
- 第2个任务开始
- 第2个任务结束
- 只剩下0ms，不够了，等待浏览器下次空闲 的时候再帮我调用
- 本帧的剩余时间是 50
- 第3个任务开始
- 第3个任务结束
```

## requestAnimationFrame

[<u>MDN requestAnimationFrame API 🚀</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame)

`requestAnimationFrame` 是 HTML5 提供的一种 API，用于在浏览器的下一次重绘之前执行回调函数。它是用于优化动画效果的工具，能够帮助你实现更加流畅、高效的动画。相比于传统的 `setTimeout` 或 `setInterval` 来控制动画帧的更新，`requestAnimationFrame` 更加精确，因为它可以根据浏览器的刷新频率来调整动画的节奏，从而避免掉帧或者卡顿。

> 举个例子 🌰

```javascript
let start

function step(timestamp) {
  if (!start) start = timestamp // 记录起始时间
  const progress = timestamp - start // 计算已经过去的时间
  const element = document.getElementById('box')

  // 控制 box 的水平移动，随着时间前进
  element.style.transform = `translateX(${Math.min(progress / 10, 200)}px)`

  // 如果动画未完成，继续调用 requestAnimationFrame
  if (progress < 2000) {
    requestAnimationFrame(step)
  }
}

// 启动动画
requestAnimationFrame(step)
```

- **`timestamp`**：`requestAnimationFrame` 的回调函数接收一个参数 `timestamp`，这个参数是浏览器传递的当前回调函数执行的时间点。它表示自页面加载完成以来的毫秒数，可以用来计算动画进行的时间。

### 如何取消 `requestAnimationFrame`

你可以使用 `cancelAnimationFrame` 来停止动画的执行：

```javascript
let animationId = requestAnimationFrame(step)

function stopAnimation() {
  cancelAnimationFrame(animationId) // 停止动画
}
```

### 主要特点

- **节能高效**： `requestAnimationFrame` 是由浏览器来决定回调函数的执行时机，通常与显示器的刷新频率相匹配（例如每秒 60 帧，60Hz 显示器）。这避免了不必要的重绘，降低了 CPU 和 GPU 的开销。

- **避免多余的重绘**： 如果页面当前处于后台标签页或未显示状态，`requestAnimationFrame` 会暂停回调，从而节省系统资源。而 `setTimeout` 或 `setInterval` 则会继续执行动画，即使用户看不到变化。

- **帧同步**：`requestAnimationFrame` 允许动画与浏览器的刷新频率保持同步，从而使动画更加平滑。

### `requestAnimationFrame` vs `setTimeout`/`setInterval`

- **精度**：`requestAnimationFrame` 能够根据浏览器的刷新率精确同步动画帧，而 `setTimeout`/`setInterval` 依赖于 `JavaScript` 引擎的定时机制，可能会不够精确。
- **节能**：当页面不在前台显示时，`requestAnimationFrame` 会自动暂停执行，从而节省 `CPU` 资源；而 `setTimeout` 和 `setInterval` 仍然会继续运行。

- **性能优化**：`requestAnimationFrame` 内置性能优化机制，与浏览器的渲染周期紧密结合，避免了不必要的渲染和计算，从而提高了性能和动画流畅度。

## `MessageChannel`

[<u>MDN MessageChannel API 🚀</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel)

`MessageChannel` 是 `Web API` 中的一部分，提供了一种在不同的浏览上下文（如不同的 `window`、`iframe`、`worker` 等）之间传递消息的方式。它允许两个独立的环境之间建立一个双向通信通道，使用 `MessageChannel` 的两个 `MessagePort` 对象来发送和接收消息。

### `MessageChannel` 的构成

- **`MessageChannel`**：这是主要的对象，用来创建一个新的消息通道。

- **`MessagePort`**：当你创建一个 `MessageChannel` 对象时，它会生成两个 `MessagePort` 对象。两个端口对象可以分别发送和接收消息。它们通过 `postMessage` 方法发送消息，使用 `onmessage` 事件处理程序接收消息。

- **`postMessage`**：使用 `postMessage` 方法发送消息到另一端的 `MessagePort`。

- **`onmessage`**：用于接收消息的事件处理程序。

> 举个例子 🌰

```javascript
// 创建一个新的 MessageChannel 实例
const channel = new MessageChannel()

// 获取两个 MessagePort
const port1 = channel.port1
const port2 = channel.port2

// 监听 port1 的消息
port1.onmessage = function (event) {
  console.log('Message received at port1:', event.data)
}

// 监听 port2 的消息
port2.onmessage = function (event) {
  console.log('Message received at port2:', event.data)
}

// 使用 postMessage 发送消息
port1.postMessage('Hello from port1!')
port2.postMessage('Hello from port2!')
```

> 输出

```sh
Message received at port1: Hello from port2!
Message received at port2: Hello from port1!
```

### 主要特点

- **双向通信**：每个 `MessagePort` 可以同时发送和接收消息。
- **跨上下文**：可以在不同的浏览器上下文之间（如 `window`、`iframe`、`web worker`）进行通信。
- **无副作用的通信**：与 `DOM` 没有直接的关系，消息传递机制是独立的，避免了性能开销。

### `MessageChannel` 和 `postMessage` 的区别

- `postMessage` 是全局的跨上下文通信方式，允许页面与同源或跨域的 `iframe` 以及同域的 worker 之间通信。
- `MessageChannel` 提供的是独立的、基于 `MessagePort` 的双向通信通道，可以通过传递 `MessagePort` 对象，在多个上下文中使用。

## `LocalStorage`

生命周期：除非被手动清除，否则将会永久保存

大小：可以保存`5MB`的信息

::: tip 注意

- `localStorage` 写入的时候，如果超出容量会报错，但之前保存的数据不会丢失。

- `localStorage` 存储容量快要满的时候，`getItem` 方法性能会急剧下降。

:::

::: info 相关资料

- [<u>`LocalStorage | MDN`</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)

:::

## `SessionStorage`

生命周期：仅在当前网页会话下有效，关闭页面或浏览器后就会被清除

大小：可以保存`5MB`的信息

::: info 相关资料

- [<u>`SessionStorage | MDN`</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)

:::
