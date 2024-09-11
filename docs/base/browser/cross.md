# 浏览器的跨域

当请求`URL`的协议、域名、端口三者之间任意一个与当前页面`url`不同即为跨域

::: tip 前置知识 URL

`URL（Uniform Resource Locator）`是互联网上的一种资源的简洁标识。它是一种特定格式的字符串，可以指向互联网上的任何资源。

以下是一个 URL 的完整示例：`http://username:password@www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument`

这个`URL`的各个部分具有以下含义：

- `http:` 这部分被称为协议或者方案。它定义了如何访问和互动资源。常见的协议有`HTTP`, `HTTPS`, `FTP`, `FILE`等。
- `user:pass` 这是可选部分，用于需要身份验证的服务。
- `site.com` 这部分被称为主机名或者域名。它定义了我们想要访问的服务器的地址。这可以是一个`IP`地址或者一个注册的域名。
- `:80` 这部分是可选的，称为端口号。它定义了服务器上的哪个服务我们要访问。如果未指定，那么默认端口是协议的标准端口（例如，对于`HTTP`是`80`，`HTTPS`是`443`）。
- `/pa/th` 这部分是路径，它指定了服务器上的哪个具体资源我们想要访问。
- `?q=val` 这部分是查询字符串，用于发送参数到服务器。它以问号开始，参数以键值对的形式存在，并用`&`符号分隔。
- `#hash` 这部分被称为片段或者锚点，它指定了网页中的一个位置。当你访问一个`URL`时，浏览器会尝试滚动到这个位置。

![url_cross](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/url_cross.webp)
:::

::: tip 为什么会产生跨域 - 浏览器的同源策略

[<u>同源策略</u>](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)是浏览器一个重要的安全策略，它用于限制一个[<u>源</u>](https://developer.mozilla.org/zh-CN/docs/Glossary/Origin) `(origin)` 的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介

同源是指两个 [<u>`URL`</u>](https://developer.mozilla.org/zh-CN/docs/Glossary/URL) 的 协议、域名(子域名 + 主域名)、端口号 都相同，否则就会出现跨域
:::

## 同源策略的限制

- 限制向非同源地址发送`Ajax`请求
- 限制读取非同源网页的`cookie`、`localStorage`、`indexedDB`
- 限制跨源脚本 `API` 访问，无法获取 `DOM`

## 跨域解决方案

::: tip 常用的跨域解决方案

- `CORS`
- `JSONP`
- `Nginx`反向代理
- `Node`中间件
- `WebSocket`
- `window.postMesssage`
- `window.name`
- `document.domain`

:::

### `CORS`跨源资源共享

[<u>`CORS`</u>](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)是一种基于 [<u>HTTP</u>](https://developer.mozilla.org/zh-CN/docs/Glossary/HTTP) 头的机制，该机制允许浏览器向跨源服务器发出 `XMLHttpRequest` 请求，从而解决了 `AJAX` 只能同源使用的限制。

> `CORS` 需要浏览器和服务器同时支持，目前所有浏览器均已支持，只需服务器配置即可使用

浏览器将`CORS`请求分成两类：简单请求`（simple request）`和非简单请求`（not-simple-request）`

#### 简单请求

::: tip 同时满足下列三大条件，就属于简单请求

- 请求方式只能是：
  - `GET`
  - `POST`
  - `HEAD`
- `HTTP` 请求头限制这几种字段：
  - `Accept`
  - `Accept-Language`
  - `Content-Language`
  - `Content-Type`
  - `Last-Event-ID`
- `Content-type` 只能取：
  - `application/x-www-form-urlencoded`
  - `multipart/form-data`
  - `text/plain`
- 请求中的任意 `XMLHttpRequestUpload` 对象均没有注册任何事件监听器(使用 `XMLHttpRequest.upload` `属性访问XMLHttpRequestUpload` 对象)
- 请求中没有使用 `ReadableStream` 对象

:::

**简单请求基本流程**

1. 对于简单请求，浏览器直接请求，会在请求头信息中，增加一个 `origin` 字段，来说明本次请求来自哪个源（协议 + 域名 + 端口）。

2. 服务器根据`origin`这个值，来决定是否同意该请求，服务器返回的响应会多几个头信息字段，三个与 `CORS` 请求相关，都是以 `Access-Control-`开头。

::: tip 简单请求响应头中的 `CORS` 字段

1. [<u>`Access-Control-Allow-Origin`</u>](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)：（必须），`*` (表示接受任意域名的请求)，还可以指定域名。
2. [<u>`Access-Control-Allow-Credentials`</u>](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)：（可选），是个布尔值，表示响应标头告诉浏览器服务器是否允许 HTTP 跨源请求携带凭据，例如： `cookie`、`TLS`客户端证书、包含用户名和密码的认证标头，（注意：如果 `Access-Control-Allow-Origin` 字段设置`*`，此字段设为 `true` 无效）。
3. [<u>`Access-Control-Allow-Headers`</u>](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)：（可选）， 用于响应包含了 `Access-Control-Request-Headers` 的预检请求，以指示在实际请求中可以使用哪些 `HTTP` 标头，里面可以获取 `Cache-Control`、`Content-Type`、`Content-Language`、`Expires`、`Last-Modified`、`Pragma`，如果想要拿到其他字段，就必须在 `Access-Control-Expose-Headers`里面指定。

:::

`CORS` 请求默认不发送 `Cookie`，如果需要发送需要满足如下条件：

- 服务器必须设置 `Access-Control-Allow-Credentials`: `true`
- `Access-Control-Allow-Origin` 字段不能为 `*`
- `AJAX` 请求的配置项需设置 `withCredentials = true`

#### 非简单请求

非简单请求是对那种对服务器有特殊要求的请求，比如请求方式是 `PUT` 或者 `DELETE`，或者 `Content-Type` 字段类型是 `application/json`，都会在正式通信之前，增加一次 `HTTP` 请求，称之为[<u>预检请求</u>](https://developer.mozilla.org/zh-CN/docs/Glossary/Preflight_request)，用于获取服务器是否允许该实际请求，同时避免跨域请求对服务器的用户数据产生预期之外的影响。

::: tip 预检请求

浏览器会先询问服务器，当前网页所在域名是否在服务器的许可名单之中，服务器允许之后，浏览器会发出正式的 `XMLHttpRequest` 请求，否则会报错。（备注：如果预检请求没有通过，就不会发正式请求，需要服务器设置）。

预检请求用的请求方法是 `OPTIONS` 表示这个请求是用来询问的

- 在预检请求请求头信息里会包含如下字段
  - `Origin`: 表示本次请求来自哪个源
  - `Access-Control-Request-Method`: 用于列出浏览器的 `CORS` 请求会用到哪些 `HTTP` 方法
  - `Access-Control-Request-Headers`(可选): 指定浏览器 `CORS` 请求会额外发送的头信息字段
- 服务器通过后会在预检请求响应头中设置如下字段
  - `Access-Control-Allow-Origin`
  - `Access-Control-Allow-Credentials`(可选)
  - `Access-Control-Allow-Methods`: 表示服务器支持的所有跨域请求的方法(为了避免多次预检请求)
  - `Access-Control-Allow-Headers`: 表示服务器支持的所有头信息字段，不限于浏览器在预检中请求的字段
  - `Access-Control-Max-Age`(可选): 用来指定本次预检请求的有效期单位为秒，在有效期内将不发出另一条预检请求

:::

一旦服务器通过了预检请求，以后每次浏览器正常的 `CORS` 请求，就都跟简单请求一样会有一个 `Origin` 头信息字段。服务器的回应也都会有一个 `Access-Control-Allow-Origin` 头信息字段

### `JSONP`

`JSONP` 是利用 `<script>` 标签没有跨域限制的漏洞，当前源可以得到从其他来源动态产生的 `JSON` 数据

**`JSONP` 请求过程流程**

1. 前端定义一个解析的回调函数
2. 创建 `script` 标签，其 `src` 指向接口地址并拼接好参数和回调函数名
3. 后端处理数据并将其拼接到前端传入的回调函数中(拼接好的数据必须是一个合法的 `JavaScript` 脚本 )
4. 浏览器执行后端返回的 `JavaScript` 脚本代码(调用定义好的回调函数)并删除刚创建的 `script` 标签

::: tip JSONP 跨域优缺点

- 优点: 实现简单，兼容性好
- 缺点
  - 只支持 `GET` 请求
  - 容易遭受 `XSS` 攻击

:::

### `Nginx`反向代理

[<u>`Nginx`</u>](https://nginx.org/en/docs/njs/)是一个开源的、高性能的、可扩展的 `HTTP` 和反向代理服务器。它也可以用作邮件代理服务器和通用的 `TCP/UDP` 代理服务器。

`Nginx`可以作为一个`HTTP`服务器，提供静态资源服务，也可以作为应用服务器（例如`PHP`, `Python`等）的前端服务器。

要使用 `Nginx` 来处理跨域问题，你需要配置一些响应头。你可以在 `Nginx` 的配置文件中进行配置，通常这个配置文件位于 `/etc/nginx/nginx.conf` 或 `/etc/nginx/sites-available/default`，大部分情况只需要配置 `http` 模块下的 `server` 即可，一般初始文件，只有一个 `server`，如果你需要 `Nginx` 同时开启不同的端口或域名，就需要写多个 `server`。

#### `server`

```bash
server {
  listen       80;   # 端口号
  server_name  localhost;   # server name 默认 localhost

  #access_log  logs/host.access.log  main;

  location / {   # 访问路径匹配规则
      root   html;
      index  index.html index.htm;
  }

  error_page   500 502 503 504  /50x.html;  # 错误处理
  location = /50x.html {
      root   html;
  }
}
```

里面比较重要的是 `location` 模块，反向代理的主要工作也是配置 `location`

#### `location`

`location` 配置项定义了一条访问 `Nginx` 服务某一路径时的匹配规则，`location` 后面紧跟的是匹配的路径，这个路径可以直接写绝对路径，可以写正则匹配。

```bash
# 当访问 http://localhost/api1 时命中
location /api1 {
    # ...
}
```

```bash
# 当访问 http://localhost/api2 和 http://localhost/api 3 时命中
location ~ ^/(api2/api3) {
  # ...
}
```

```bash
# ~ 符号表示接下来的是一个正则表达式。Nginx 会使用这个正则表达式来匹配请求的 URL 路径
# .json$ 是一个正则表达式，它匹配任何以 .json 结尾的 URL 路径
location ~ \.json$ {
  # ...
}
```

#### `proxy_pass`

`location` 里有多个配置项，其中一个是 `proxy_pass`，意思是将当前命中的 `Nginx` 接口（例如：`http://localhost/api`）代理到其他 `server` 的接口，如下例子就是将 `http://localhost/api` 代理到 `https://azzlzzxz.com/api`

```bash
location /api {
  proxy_pass https://azzlzzxz.com;
}
```

::: tip 注意 ⚠️

- 在写 `proxy_pass` 不能随便在目标地址后加 `/`，如果你在地址末尾加了 `/`，则最终代理是这样的：

```bash
location /api {
  proxy_pass https://azzlzzxz.com/; # 将会被代理到 https://azzlzzxz.com/，后面没有 /api
}
```

- 不加 `/`，则最终代理是这样的，访问 `Nginx` 命中的 `/api`，`Nginx` 也会自动帮你拼接上去

```bash
location /api {
  proxy_pass https://azzlzzxz.com; # 将会代理到 https://azzlzzxz.com/api
}

```

:::

#### `add_header`

`location` 配置中的 `add_header`选项，表示 `Nginx` 将在 `response` 中添加一些额外的响应头信息给客户端。众所周知，开启跨域支持是需要服务端配置 `Access-Control-Allow-Origin`、`Access-Control-Allow-Methods`、`Access-Control-Allow-Headers` 这些请求头的，那么既然有了 `Nginx` 做了中间层代理服务，就算 `server` 不给我们开启这些，我们完全也能够自给自足：

```bash
location /api {
  add_header Access-Control-Allow-Origin * always;
  add_header Access-Control-Allow-Headers *;
  add_header Access-Control-Allow-Methods "GET, POST, PUT, OPTIONS";
  proxy_pass https://azzlzzxz.com;
}
```

一般来说，如果请求过程中出现 `40X` 、`50X`的错误，`Nginx`将不会设置 `Access-Control-Allow-Origin` 继而导致跨域失败，所以需要在后面再加个 `always` 告诉 `Nginx` 不管怎样，都给我设置这个响应头。

### `Node`中间件

[<u>`http-proxy-middleware`</u>](https://github.com/chimurai/http-proxy-middleware#readme) 是一个用于 `Node.js` 的中间件，它可以在你的应用中创建一个反向代理。这在处理跨域请求、添加负载均衡、或者在开发环境中连接到不同的服务等场景中非常有用。

你可以使用 `createProxyMiddleware` 函数来创建一个代理。这个函数接收一个配置对象，你可以在这个对象中指定代理的目标、路径重写规则等选项：

```js
const { createProxyMiddleware } = require('http-proxy-middleware')

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  }),
)
```

在 👆 例子中，所有以 `/api` 开头的请求都会被代理到 `http://localhost:4000，并且路径中的` `/api` 会被去掉。

👇 是 `createProxyMiddleware` 配置对象的一些常用选项：

- `target`：这是代理的目标服务器的 `URL`。

- `changeOrigin`：如果设置为 `true`，代理服务器会在请求转发时修改请求头中的 `host` 为目标服务器的 `host`。

- `pathRewrite`：这是一个对象，它定义了如何重写路径。例如，你可以将路径中的 `/api` 替换为 `/`。

### `WebScoket`

[<u>`WebSocket`</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)： 一种浏览器与服务器进行全双工通讯的网络技术，也就是客户端和服务器之间存在持久的连接，而且双方都可以随时开始发送数据。

这种方式本质没有使用了 `HTTP` 的响应头, 因此也没有跨域的限制。

### `window.postMessage`

[<u>`window.postMessage()`</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage) 方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为 `https）`，端口号（`443` 为 `https` 的默认值），以及主机 (两个页面的模数 `Document.domain`设置为相同的值) 时，这两个脚本才能相互通信。`window.postMessage()` 方法提供了一种受控机制来规避此限制。

它可用于解决以下方面的问题：

- 页面和其打开的新窗口的数据传递
- 多窗口之间消息传递
- 页面与嵌套的`iframe`消息传递

### `window.name`

[<u>`window.name`</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/name)是一个旧的`HTML`属性，它允许在同一浏览器窗口或者`Tab`中的不同页面之间传递数据。它有一个非常有趣的特性：当你改变窗口的`URL`时，`window.name`的值会保持不变。这个特性使得`window.name`可以被用于跨域通信。

### `document.domain`

`document.domain`是一种在同一主域名下的不同子域之间实现跨域通信的方法。这种方法的基本思想是通过将每个子域的 `document.domain` 设置为相同的主域名，使得这些子域在 `JavaScript` 中被认为是同源的。

举个 🌰

> `a.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>origin</title>
  </head>

  <body>
    <iframe
      id="myIframe"
      src="http://test.azzlzzxz.com:4000/b.html"
      style="display: none;"
    ></iframe>
    <script>
      document.domain = 'azzlzzxz.com'
      window.onload = function () {
        var iframe = document.getElementById('myIframe')
        console.log(iframe.contentWindow.document.getElementById('container').innerHTML)
      }
    </script>
  </body>
</html>
```

> `b.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>origin</title>
  </head>

  <body>
    <div id="container">container</div>
    <script>
      document.domain = 'azzlzzxz.com'
    </script>
  </body>
</html>
```
