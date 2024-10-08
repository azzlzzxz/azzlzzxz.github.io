# WebSocket

:::tip WebSocket

[<u>`WebSocket MDN`</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

:::

## 什么是 `WebSocket`

`HTML5` 开始提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。它基于 `TCP` 传输协议，并复用 `HTTP` 的握手通道。

`HTTP`、`WebSocket` 等协议都是处于 `OSI` 模型的最高层：应用层。而 `IP` 协议工作在网络层，`TCP` 协议工作在传输层。

`HTTP`、`WebSocket` 等应用层协议，都是基于 `TCP` 协议来传输数据的，因此其连接和断开，都要遵循 `TCP` 协议中的三次握手和四次挥手 ，只是在连接之后发送的内容不同，或者是断开的时间不同。

**WebSocket 兼容性：**
![websocket_compatible](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/websocket_compatible.png)

## 为什么需要 `WebSocket` 呢

### 在 `WebSocket` 出现之前，如果我们想实现实时通信

比较常采用的方式是 `Ajax` 轮询，即在特定时间间隔（比如每秒）由浏览器发出请求，服务器返回最新的数据。这样子的轮询方式有什么缺陷呢？

1. **<font color="FF9D00">`HTTP` 请求一般包含的头部信息比较多，其中有效的数据可能只占很小的一部分，导致带宽浪费。</font>**
2. **<font color="FF9D00">服务器被动接收浏览器的请求然后响应，数据没有更新时仍然要接收并处理请求，导致服务器 `CPU` 占用。</font>**

`WebSocket` 的出现可以对应解决上述问题：

1. **<font color="FF9D00">`WebSocket` 的头部信息少，通常只有 `2Bytes` 左右，能节省带宽。</font>**
2. **<font color="FF9D00">`WebSocket` 支持服务端主动推送消息，更好地支持实时通信。</font>**

### `WebSocket` 长链接 对比 `http` `keep-alive` 长链接

了解 `http` 的人都知道，`HTTP` 协议有一个“缺陷”：通信只能由客户端发起，客户端向服务器发出请求，服务器返回查询结果。

`http/1.1 keep-alive` 的确可以实现长链接，但它的本质还是客户端主动发起-服务端应答的模式，是没法做到服务端主动发送通知给客户端的。

![keep-alive](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/keep-alive.jpg)

在 `WebSocket` 中，只需要服务器和浏览器通过 `TCP` 协议进行一个握手的动作，然后单独建立一条 `TCP`的通信通道进行数据的传送。`WebSocket`同 `HTTP` 一样也是应用层的协议，但是它是一种双向通信协议，是建立在`TCP` 之上的。

::: tip `websocket` 的流程大概是以下几步:

1. 浏览器、服务器建立 `TCP` 连接，三次握手。这是通信的基础，传输控制层，若失败后续都不执行。
2. `TCP` 连接成功后，浏览器通过 `HTTP` 协议向服务器传送 `WebSocket` 支持的版本号等信息。（开始前的 `HTTP` 握手）
3. 服务器收到客户端的握手请求后，同样采用 `HTTP` 协议回馈数据。
4. 当收到了连接成功的消息后，通过 `TCP` 通道进行传输通信。

:::

也就是说 `WebSocket` 在建立握手时，数据是通过 `HTTP` 传输的。但是建立之后，在真正传输时候是不需要 `TCP` 协议的。

![websocket](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/websocket.jpg)

## `WebSocket` 的特点

- 建立在 `TCP` 协议之上

- 与 `HTTP` 协议有着良好的兼容性：默认端口也是 `80（ws）` 和 `443(wss，运行在 TLS 之上)`，并且握手阶段采用 `HTTP` 协议

- **较少的控制开销**：连接创建后，`ws` 客户端、服务端进行数据交换时，协议控制的数据包头部较小，而 `HTTP` 协议每次通信都需要携带完整的头部

- 可以发送文本，也可以发送二进制数据

- 没有同源限制，客户端可以与任意服务器通信

- 协议标识符是 `ws（如果加密，则为 wss）`，服务器网址就是 `URL`

- 支持扩展：`ws` 协议定义了扩展，用户可以扩展协议，或者实现自定义的子协议（比如支持自定义压缩算法等）

## `WebSocket` 原理

### 如何建立连接

在 `WebSocket` 开始通信之前，通信双方需要先进行握手，`WebSocket` 复用了 `HTTP` 的握手通道，即客户端通过 `HTTP` 请求与 `WebSocket` 服务端协商升级协议。

协议升级完成后，后续的数据交换则遵照 `WebSocket` 的协议。

::: tip 利用 `HTTP` 完成握手有什么好处呢？

1. 是可以让 `WebSocket` 和 `HTTP` 基础设备兼容（运行在 80 端口 或 443 端口）。

2. 是可以复用 `HTTP` 的 `Upgrade` 机制，完成升级协议的协商过程。

:::

![websocket_status](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/websocket_status.png)

- 101 状态码，表示协议切换

- `Connection:` `Upgrade` 表示要升级协议， `Upgrade: websocket` 表示要升级到 `websocket` 协议
- `Sec-WebSocket-Key`：与服务端响应头部的 `Sec-WebSocket-Accept`是配套的，提供基本的防护，比如恶意的连接，或者无意的连接

::: tip 配套

- 这里的`“配套”`指的是：`Sec-WebSocket-Accept`是根据请求头部的 `Sec-WebSocket-Key` 计算而来，计算过程大致为基于 `SHA1` 算法得到摘要并转成 `base64` 字符串。

:::

完成 🤝，服务端返回数据：

![websocket_msg](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/websocket_msg.png)

### 如何交换数据

::: tip 具体的数据格式是怎么样的呢？

`WebSocket` 的每条消息可能会被切分成多个数据帧（最小单位）。

发送端会将消息切割成多个帧发送给接收端，接收端接收消息帧，并将关联的帧重新组装成完整的消息

:::

### 如何维持连接

如果我们使用 `WebSocket` 进行通信，建立连接之后怎么判断连接正常没有断开或者服务是否可用呢？

可以通过建立心跳机制，所谓心跳机制，就是定时发送一个数据包，让对方知道自己在线且正常工作，确保通信有效。

如果对方无法响应，便可以弃用旧连接，发起新的连接了。

:::tip `pingpong`

需要重连的场景可能包括：网络问题或者机器故障导致连接断开、连接没断但不可用了或者连接对端的服务不可用了等等。

发送方 -> 接收方：`ping`。

接收方 -> 发送方：`pong`。

`ping` 、`pong` 的操作，对应的是 `WebSocket` 的两个控制帧，`Opcode` 分别是 `0x9`、`0xA`。

:::

比如说，`WebSocket` 服务端向客户端发送 `ping`：

```js
// ping
ws.ping()

// pong
ws.on('pong', () => {
  console.log('pong received')
})
```

客户端也可以发送：

```js
// 发送心跳包
ws.send('heart_beat')

// 接收响应
ws.onmessage = (e) => {
  const response = e.data
  if (response.message === 'connection alive') {
    // 重置计时器
  }
}
```

## `WebSocket` 使用

### `WebSocket` 简单使用

```js
// wss://localhost:8080
const ws = new WebSocket('ws://localhost:8080')

ws.onopen = () => {
  console.log('连接成功')
}

ws.onmessage = (e) => {
  console.log('接收服务端数据：', e.data)
}

ws.onclose = () => {
  console.log('连接关闭')
}

ws.onerror = (e) => {
  console.log('连接出错', e)
}

return ws
```

### 心跳检测 & 重连机制

`WebSocket` 在连接关闭的情况下会触发 `onclose` 事件，在链接异常的情况下会触发 `onerror` 事件。

而在弱网条件下，`onclose`事件触发的灵敏度却不高，往往已经断网很久了才触发 `onclose` 事件，前端又去进行重连操作，对实时界面的展示不友好。

::: tip 心跳检测 & 重连

- 每隔一段指定的时间（计时器），向服务器发送一个数据，服务器收到数据后再发送给客户端，正常情况下客户端通过 `onmessage` 事件是能监听到服务器返回的数据的，说明请求正常。

- 如果再这个指定时间内，客户端没有收到服务器端返回的响应消息，就判定连接断开了，使用 `websocket.close`关闭连接。

- 这个关闭连接的动作可以通过 `onclose` 事件监听到，因此在 `onclose` 事件内，我们可以调用 `reconnect` 事件进行重连操作。

:::

```ts
interface message {
  url: string
  onMessage: (content: string) => void
}

/**
 * url 请求路径
 * onMessage 服务端返回消息的回调
 */
const WebSocketApi = ({ url, onMessage }: message) => {
  // 心跳包
  const heartBeatMsg = 'heart_beat'

  // 心跳包发送间隔时间（毫秒）
  const heartbeatInterval = 5000

  // 重连次数
  let reconnectCount = 0

  // 心跳包定时器
  let heartbeatTimer: NodeJS.Timer | null = null

  // 重连定时器
  let reconnectTimer: NodeJS.Timer | null = null

  const ws = new WebSocket(url)

  // 开始发送心跳包
  function startHeartBeat(webSocket: WebSocket) {
    heartbeatTimer = setInterval(() => {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(heartBeatMsg)
      }
    }, heartbeatInterval)
  }

  // 停止发送心跳包
  function stopHeartBeat() {
    clearInterval(heartbeatTimer as NodeJS.Timer)
  }

  // 开始重连
  function startReconnect() {
    if (reconnectCount < 10) {
      reconnectTimer = setInterval(() => {
        console.log('Trying to reconnect...')

        const newWs = new WebSocket(url)

        newWs.onopen = () => {
          console.log('Reconnected!')

          clearInterval(reconnectTimer as NodeJS.Timer)
          startHeartBeat(newWs)
          reconnectCount = 0
        }

        newWs.onmessage = (e) => {
          onMessage(e.data as any)
        }

        newWs.onclose = () => {
          console.log('Connection closed!')

          stopHeartBeat()
          reconnectCount++
        }

        newWs.onerror = (e) => {
          console.log('Connection newWs error!', e)
          reconnectCount++
        }
      }, 3000)
    } else {
      clearInterval(reconnectTimer as NodeJS.Timer)

      console.log('Max reconnect count reached!')
    }
  }

  ws.onopen = () => {
    console.log('Connect success')
    startHeartBeat(ws)
  }

  ws.onmessage = (e) => {
    onMessage(e.data as any)
  }

  ws.onclose = () => {
    console.log('Connect close')
    stopHeartBeat()
  }

  ws.onerror = (e) => {
    console.log('Connect ws error', e)
    startReconnect()
  }

  return ws
}

export default WebSocketApi
```
