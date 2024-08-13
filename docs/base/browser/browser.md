# 浏览器渲染原理

## 浏览器中的 5 个进程

1. 浏览器进程：负责界面显示、用户交互、子进程管理，提供存储等。
2. 渲染进程：每个页卡都有单独的渲染进程，核心用于渲染页面。
3. 网络进程：主要处理网络资源加载(HTML、CSS,、JS 等)，最终将加载的资源交给渲染进程来处理。
4. GPU 进程：3d 绘制,提高性能。
5. 插件进程： chrome 中安装的一些插件。

![browser](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/browser.png)

## 渲染流程

![render](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/render.png)

1. 浏览器无法直接使用` HTML`，需要将`HTML`转化成`DOM`树`（document）`。
2. 浏览器无法解析纯文本的`CSS`样式，需要对`CSS`进行解析,解析成 `styleSheets`。`CSSOM（document.styleSeets）`。
3. 计算出 DOM 树中每个节点的具体样式`（Attachment）`。
4. 创建渲染（布局）树，将 `DOM` 树中可见节点，添加到布局树中。并计算节点渲染到页面的坐标位置`（layout）`。
5. 通过布局树，进行分层 （根据定位属性、透明属性、`transform` 属性、`clip` 属性等）生产图层树。
6. 将不同图层进行绘制，转交给合成线程处理。最终生产页面，并显示到浏览器上`(Painting,Display)`。

## `DOM` 如何生成的

![dom](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/dom.png)

1. 当服务端返回的类型是`text/html`时，浏览器会将收到的数据通过`HTMLParser`进行解析 (边下载边解析)
2. 在解析前会执行预解析操作，会预先加载`JS、CSS`等文件
3. 字节流 -> 分词器 ->`Tokens`-> 根据`token`生成节点 -> 插入到`DOM`树中
4. 遇到` js：`在解析过程中遇到`script`标签，`HTMLParser `会停止解析，（下载）执行对应的脚本。
5. 在`js`执行前，需要等待当前脚本之上的所有`CSS`加载解析完毕（`js` 是依赖 `css` 的加载）

**<font color="FF9D00">注意 ⚠️：</font>**

**<font color="FF9D00">1. CSS 样式文件尽量放在页面头部，CSS 加载不会阻塞 DOM tree 解析,浏览器会用解析出的 DOM TREE 和  CSSOM  进行渲染，不会出现闪烁问题。如果 CSS 放在底部，浏览是边解析边渲染，渲染出的结果不包含样式，后续会发生重绘操作。</font>**

**<font color="FF9D00">2. JS 文件放在 HTML 底部，防止 JS 的加载、解析、执行堵塞页面后续的正常渲染。</font>**

举个 🌰：

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

## 经典面试题

### 从输入 `URL` 到浏览器显示页面发生了什么

#### 浏览器进程的相互调用：

1. 在浏览器进程输入 `url` 地址开始导航，准备渲染进程。
2. 在网络进程中发送请求，把响应结果交给渲染进程处理。
3. 解析页面，加载页面中的所有资源。
4. 渲染完毕，展示页面。

#### 细化每一步的过程：`URL` 请求过程

1. 浏览器查找当前 `url`是否存在缓存，如果存在缓存并且缓存未过期，就直接从缓存中返回。
2. 查看域名是否被解析过，如果没有解析过，就进行 DNS 解析，把域名解析成 `ip` 地址，并增加端口号。
3. 如果请求是 `HTTPS`，进行 `SSL` 协商（保证数据安全性）。
4. 利用 `IP` 地址进行寻址，请求排队。`http1.1` 同一个域名下请求数量不能多余 6 个。
5. 排队后服务器创建 `TCP` 链接 （三次握手）。
6. 利用`TCP`协议将大文件拆分成数据包进行传输(有序传输)，可靠的传输给服务器（丢包重传），服务器收到后按照序号重排数据包 （增加 `TCP `头部，`IP` 头部）。
7. 发送 `HTTP` 请求（请求行，请求头，请求体）。
8. `HTTP 1.1` 中支持 `keep-alive` 属性,`TCP `链接不会立即关闭，后续请求可以省去建立链接时间。
9. 服务器响应结果（响应行，响应头，响应体）。
10. 返回状态码为 301、302 时，浏览器会进行重定向操作。（重新进行导航）
11. 返回 304 则查找缓存。（服务端可以设置强制缓存）。

通过 `network Timing`  观察请求发出的流程：

![netWork_jd](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/netWork_jd.png)

> 蓝色：` DOMContentLoaded:`DOM 构建完成的时间。
> 红色：`Load:`浏览器所有资源加载完毕。
> 本质上，浏览器是方便一般互联网用户通过界面解析和发送 HTTP 协议的软件。

- `Queuing: `请求发送前会根据优先级进行排队，同时每个域名最多处理 6 个 `TCP` 链接，超过的也会进行排队，并且分配磁盘空间时也会消耗一定时间。
- `Stalled :`请求发出前的等待时间（处理代理，链接复用）
- `DNS lookup :`查找 `DNS` 的时间
- `initial Connection :`建立 `TCP` 链接时间
- `SSL:` `SSL` 握手时间（`SSL` 协商）
- `Request Sent :`请求发送时间（可忽略）
- `Waiting(TTFB) :`等待响应的时间，等待返回首个字符的时间
- `Content Dowloaded :`用于下载响应的时间
