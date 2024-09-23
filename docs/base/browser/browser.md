# 浏览器渲染原理

## 浏览器中的主要的 5 个进程

- 浏览器进程

负责显示浏览器的用户界面元素（如地址栏、前进/后退按钮等），管理用户交互、创建和管理其他进程，以及负责持久化存储（如 `Cookie`、`LocalStorage` 等）。

- 渲染进程

每个标签页通常都有独立的渲染进程，负责解析 `HTML`、`CSS` 和 `JavaScript`，生成 `DOM` 树、`CSSOM` 树、渲染树，并执行布局、绘制操作。渲染进程还负责页面的 `JavaScript` 代码执行。

- 网络进程

负责网络资源的加载，包括发起 `HTTP` 请求、接收响应并处理资源缓存，最终将 `HTML`、`CSS`、`JavaScript` 等传递给渲染进程进行解析。

- `GPU` 进程

负责加速页面的 `2D` 和 `3D` 绘制，帮助提升渲染性能，同时加速页面合成、动画和视频的硬件加速处理。

- 插件进程

用于处理浏览器中的插件，每个插件通常在独立的进程中运行，以保证浏览器的安全性和稳定性。

![browser](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/browser.png)

## 渲染流程

![render](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/render.png)

1. 浏览器无法直接使用`HTML`，需要将`HTML`转化成`DOM`树`（document）`。
2. 浏览器无法解析纯文本的`CSS`样式，需要对`CSS`进行解析，解析成`CSSDOM（Object Model）`，浏览器通过 `DOM` 和 `CSSOM` 来计算页面的样式信息
3. 样式计算`（Style Calculation）`：浏览器根据 `CSS` 规则和继承机制，计算出 `DOM` 树中每个节点的具体样式。
4. 构建渲染（布局）树，将 `DOM` 树中可见节点（不包括不可见节点，如 `display: none`），添加到渲染树中，并开始布局（Layout）计算，每个节点的大小和位置会被计算出来。
5. 根据页面的需要，渲染树会被分成多个图层`（Layer）`，每个图层可能对应一个特定的 `DOM` 元素或由某些 `CSS` 特性（如 `position: fixed`、`z-index`、`transform`等属性）触发。
6. 绘制`（Painting）`：浏览器将渲染树中的每个节点进行绘制。
7. 合成`（Compositing）`：浏览器将多个图层合成为一个完整的页面，并在屏幕上展示。

## `DOM` 如何生成的

![dom](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/dom.png)

当服务端返回的类型是 `text/html` 时，浏览器会将收到的数据通过 `HTML` 解析器`（HTMLParser）`进行解析，整个过程可以分为以下几个步骤：

1. **数据下载**：

   - 浏览器在接收到 `text/html` 类型的响应后，开始下载 `HTML` 内容。

2. **预解析操作**：

   - 在解析 `HTML` 之前，浏览器会预先加载并解析 `CSS` 和 `JavaScript` 文件，这些文件会在 `HTML` 中通过 `<link>` 和 `<script>` 标签引用。

3. **解析流程**：

   - 字节流被传递到解析器，解析器将其转化为词法单元`（tokens）`。
   - 根据这些词法单元生成节点，并将这些节点插入到 `DOM` 树中。
   - 解析过程中，浏览器会处理各种 `HTML` 标签，包括文本节点、元素节点等。

4. **处理 `<script>` 标签**：

   - 当解析器遇到 `<script>` 标签时，它会停止当前的解析过程。
   - 这时，浏览器会下载和执行对应的 `JavaScript` 代码。在执行 `JavaScript` 之前，必须确保当前脚本之前的所有 `CSS` 文件都已加载和解析完毕，因为 `JavaScript` 可能会依赖于 `CSS` 的样式。

5. **异步脚本**：

   - 对于带有 `async` 或 `defer` 属性的 `<script>` 标签，浏览器将根据这些属性的设置决定是否在解析过程中停止并执行脚本。

6. **继续解析**：
   - 在执行完 `JavaScript` 后，解析器将继续之前的解析过程，继续生成和插入 `DOM` 节点。

通过这种方式，浏览器逐步构建出完整的 `DOM` 树，并在完成后开始进行渲染和布局。

::: tip 注意 ⚠️

- `CSS` 样式文件尽量放在页面头部，`CSS` 加载不会阻塞 `DOM tree` 解析,浏览器会用解析出的 `DOM TREE` 和 `CSSOM` 进行渲染，不会出现闪烁问题。如果 `CSS` 放在底部，浏览是边解析边渲染，渲染出的结果不包含样式，后续会发生重绘操作。

- `JS` 文件放在 `HTML` 底部，防止 `JS` 的加载、解析、执行堵塞页面后续的正常渲染。

:::

> 举个 🌰

1. 为什么 `css` 要放在头部、`js` 要放在底部

```html
<!-- 当html 渲染时 会先扫描js和css 渲染从上到下 边解析边渲染 -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <!-- css不会阻塞html解析 -->
    <link rel="stylesheet" href="./index.css" />
    <!-- css阻塞页面渲染 -->
  </head>
  <body>
    <!-- 浏览器可以部分渲染 -->
    <div></div>
    <!-- 渲染dom时 要等待样式加载完毕 -->
    <!-- 需要cssom 和 dom tree => 布局树  -->

    <!-- 样式放到底部,可能会导致重绘效果 ,二次渲染-->
    <link rel="stylesheet" href="./index.css" />
  </body>
</html>

<!-- parserHTML -> parserStylesheet -> updateLayerTree => paint -->
```

**css 放在头部的渲染流程：**

![ques1](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/ques1.png)

![ques2](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/ques2.png)

![ques3](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/ques3.png)

**css 放在底部的渲染流程：**

![css_b_1](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/css_b_1.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./index.css" />
  </head>
  <body>
    先渲染hello
    <div>hello</div>

    <!-- js会阻塞dom解析 ，需要暂停DOM解析去执行javascript 
         js可能会操作样式，所以需要等待样式加载完成 -->
    <!-- js阻塞html解析也阻塞渲染， js 要等上面的css加载完毕，保证页面js可以操作样式 -->
    <script>
      let s = 0
      for (let i = 0; i < 10000; i++) {
        s += i
      }
    </script>

    等script执行完再渲染world
    <div>world</div>
  </body>
</html>
```

![css_b_2](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/css_b_2.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./index.css" />
  </head>
  <body>
    <div>hello</div>
    <div>world</div>
    <!-- js 和 css 可以并行加载 但是还是需要等待js执行完毕 继续解析剩余dom -->

    <!-- 所以js放在页面的底部 防止阻塞DOM 渲染 -->
    <!-- css放顶部 防止页面重绘 -->
    <script src="./index.js"></script>
  </body>
</html>
```

![css_b_3](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/css_b_3.png)

## 从输入 `URL` 到浏览器显示页面发生了什么

### 1. `URL` 解析与域名解析`(DNS Lookup)`

- **输入 `URL`**: 用户在地址栏输入一个 `URL`（例如 `https://www.xxx.com`）。

- **检查缓存**：

  - **浏览器缓存**：首先，浏览器会检查是否有这个 `URL` 的缓存数据。如果缓存有效（比如之前访问过且缓存未过期），会直接从缓存中读取页面内容并跳过后续的网络请求步骤。
  - **操作系统缓存**：如果浏览器缓存中没有数据，浏览器会向操作系统询问域名 `www.xxx.com` 的 `IP` 地址。操作系统会检查其 `DNS` 缓存。
  - **路由器缓存**：如果操作系统缓存中没有，操作系统会向配置的 `DNS` 服务器（通常是路由器）发出 `DNS` 查询请求。
  - **`ISP` 缓存**：路由器可能没有缓存记录，会继续向 `ISP` 的 `DNS` 服务器查询。
  - **递归查询**：如果 `ISP` 的 `DNS` 服务器也没有记录，它会发起递归 `DNS` 查询，一直向权威 `DNS` 服务器查找，直到找到 `www.xxx.com` 对应的 `IP` 地址。

- **返回 `IP` 地址**：`DNS` 解析完成后，浏览器获取到 `www.xxx.com` 对应的 `IP` 地址。

### 2. 建立 `TCP` 连接

- **`TCP` 三次握手**：
  - 浏览器通过获取到的 `IP` 地址向服务器发起一个 `TCP` 连接请求（通常使用 `80` 端口进行 `HTTP` 请求，或 `443` 端口进行 `HTTPS` 请求）。
  - `TCP` 连接通过三次握手完成：
    1.  客户端向服务器发送 `SYN（同步）包`，表示请求建立连接。
    2.  服务器响应 `SYN-ACK 包`，确认收到请求，并表明服务器准备就绪。
    3.  客户端再发送 `ACK（确认）包`，表示确认建立连接。
  - 此时，客户端和服务器之间建立了一个可靠的 `TCP` 连接。

### 3. `HTTPS` 握手 (可选步骤)

- **`TLS/SSL`握手**：
  - 如果是 `HTTPS` 请求，客户端和服务器会进行 `TLS/SSL` 握手，用于加密数据传输。
  - 这个过程涉及公钥和私钥的交换、数字证书的验证等，确保数据安全和通信的私密性。

### 4. 发送 `HTTP` 请求

- **构建 `HTTP` 请求**：

  - 浏览器构建一个 `HTTP` 请求报文，包含请求方法（如 `GET`、`POST`）、`URL`、协议版本（`HTTP/1.1` 或 `HTTP/2`）、请求头等信息。请求头中包含 `Cookies`、浏览器信息等。

- **发送 `HTTP` 请求**：
  - 浏览器将 `HTTP` 请求通过刚建立的 `TCP` 连接发送到服务器。

### 5. 服务器处理请求

- **服务器处理请求**：

  - 服务器收到浏览器发送的 `HTTP` 请求后，会解析请求内容，识别请求的 `URL`，进而决定该如何处理。
  - 服务器可能执行一系列操作，如查询数据库、读取文件、执行后台逻辑，最终生成响应数据。

- **生成响应**：
  - 服务器构建一个 `HTTP` 响应报文，包含状态码（如 `200 OK`、`404 Not Found`）、响应头（如内容类型、缓存控制）以及响应体（如 `HTML` 文件、`CSS` 文件、图片、`JSON` 数据等）。

### 6. 浏览器接收 `HTTP` 响应

- **接收响应数据**：
  - 服务器将生成的 `HTTP` 响应报文通过 `TCP` 连接传输回浏览器，浏览器开始接收响应数据。
  - 浏览器会检查响应的状态码，若状态码为 `200`，表示请求成功，接下来会处理响应体中的内容。

### 7. 渲染页面

浏览器在接收到 `HTML` 响应体后，会进行一系列操作来渲染页面，具体步骤如下：

- **HTML 解析**：

  - 浏览器将 `HTML` 文件解析为一个 `DOM` 树。
  - `DOM` 树是页面结构的内存表示，每一个 `HTML` 标签都会被解析成一个 `DOM` 节点，形成父子关系。

- **处理 CSS**：

  - 浏览器根据 `HTML` 文件中包含的 `<link>` 标签（外部 `CSS`）或 `<style>` 标签（内嵌 `CSS`）来加载和解析 `CSS` 样式表，形成 `CSSOM` 树（`CSS` 对象模型）。
  - 如果是外部 `CSS` 文件，浏览器会发起额外的请求来下载这些文件。

- **渲染树的构建**：

  - `DOM` 树和 `CSSOM` 树结合在一起，生成一棵渲染树。这棵渲染树只包含可见的 `DOM` 节点，并且这些节点带有它们的样式信息。

- **布局 `(Layout)`**：

  - 浏览器根据渲染树计算每个节点的几何位置，即布局阶段。此时，浏览器会确定每个元素的尺寸、位置。

- **绘制 `(Paint)`**：

  - 布局完成后，浏览器将绘制页面的各个元素，包括文本、颜色、边框、阴影、图像等。

- **合成 `(Compositing)`**：
  - 如果页面有复杂的层次（例如 `z-index` 或者硬件加速的动画），浏览器会将页面分成多个图层并将它们合成，最终生成用户看到的页面。

### 8. 执行 `JavaScript`

- **解析与执行 `JavaScript`**：

  - 如果 HTML 文件中包含 `<script>` 标签，浏览器会解析并执行 `JavaScript` 代码。
  - 如果 `<script>` 是同步的（没有 `async` 或 `defer`），浏览器会暂停其他解析，直到 `JavaScript` 执行完毕。这可能会阻塞页面的渲染。
  - 如果 `JavaScript` 代码会动态修改 `DOM`（例如 `document.createElement`、`innerHTML`），浏览器会重新计算布局和绘制。

- **异步加载**：
  - 如果 `JavaScript` 文件标记了 `async` 或 `defer`，则浏览器会继续解析 `HTML`，不会被阻塞。`async` 脚本在加载完成后立即执行，`defer` 脚本会在 `HTML` 解析完成后执行。

### 9. 显示页面并交互

- **页面渲染完成**：

  - 当浏览器渲染完所有内容，页面会呈现在用户面前，用户可以与页面交互。

- **事件循环与交互**：
  - 浏览器开始进入事件循环状态，监听用户的操作（如点击、输入等），处理用户交互。

### 10. 后续资源加载

- **异步资源的加载**：

  - 浏览器在加载和解析 `HTML` 的过程中，可能会发现额外的资源请求，例如图片、视频、字体等。这些资源将会继续通过 HTTP 请求下载，直到所有资源加载完毕。

- **`Lazy Load`**:
  - 在开发中，一些图片或资源可能会使用懒加载`（Lazy Load）`技术，只有当用户滚动到视口时才开始加载资源，从而优化初始加载时间。

---

> 通过 `network Timing`  观察请求发出的流程：

![netWork_jd](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/netWork_jd.png)

> 蓝色：`DOMContentLoaded:`DOM 构建完成的时间。
> 红色：`Load:`浏览器所有资源加载完毕。
> 本质上，浏览器是方便一般互联网用户通过界面解析和发送 HTTP 协议的软件。

- `Queuing:`请求发送前会根据优先级进行排队，同时每个域名最多处理 6 个 `TCP` 链接，超过的也会进行排队，并且分配磁盘空间时也会消耗一定时间。
- `Stalled :`请求发出前的等待时间（处理代理，链接复用）
- `DNS lookup :`查找 `DNS` 的时间
- `initial Connection :`建立 `TCP` 链接时间
- `SSL:` `SSL` 握手时间（`SSL` 协商）
- `Request Sent :`请求发送时间（可忽略）
- `Waiting(TTFB) :`等待响应的时间，等待返回首个字符的时间
- `Content Dowloaded :`用于下载响应的时间
