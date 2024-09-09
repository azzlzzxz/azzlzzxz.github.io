# HTML 基础知识

## `HTML5` 的新特性

`HTML5` 引入了许多新特性和改进，使得 `Web` 开发变得更加强大和灵活。`HTML5` 的新特性主要包括：

- `语义化标签`：引入新的语义化标签，如`<header>`、`<footer>`、`<article>`、`<section>`等，用于更清晰地表示文档的结构和内容
- `多媒体支持`：提供了`<audio>`和`<video>`元素

::: tip 多媒体支持

- `<audio>`

```html
<audio src="" controls autoplay loop="true" />
```

属性：

- `controls` 控制面板
- `autoplay` 自动播放
- `loop=‘true’` 循环播放

---

- `<video>`

```html
<video id="video" src="video.mp4" controls = "true"
允许用户控制视频的播放，包括音量，跨帧，暂停/恢复播放 controlsList="nodownload" 去除视频下载功能
poster="images.jpg" 视频封面 preload="auto" 页面加载后载入视频 webkit-playsinline="true"
这个属性是ios 10中设置可以让视频在小窗内播放，也就是不是全屏播放 playsinline="true"
IOS微信浏览器支持小窗内播放 x-webkit-airplay="allow" 应该是使此视频支持ios的AirPlay功能
x5-video-player-type="h5" 启用H5播放器,是wechat安卓版特性 x5-video-player-fullscreen="true"
全屏设置，设置为 true 是防止横屏 x5-video-orientation="portraint"
播放器支付的方向，landscape横屏，portraint竖屏，默认值为竖屏 style="object-fit:fill" />
```

![html5_video](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/html5_video.jpg)

![html5_video_attribute](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/html5_video_attribute.jpg)

```html
<video controls controlslist="nodownload nofullscreen noremoteplayback" id="video" src="" />
```

- `nodownload`关键字表示的下载控制应使用用户代理自己的一套媒体元素控件时被隐藏。
- `nofullscreen`关键字表示在使用用户代理自己的媒体元素控件集时，应隐藏全屏模式控件。
- `noremoteplayback`关键字表示当使用用户代理自己的媒体元素控件集时，应隐藏远程播放控件。

---

- `<source/>`

因为浏览器对视频格式支持程度不一样，为了能够兼容不同的浏览器，可以通过`source`来指定视频源

```html
<video>
  <source src='aa.flv' type='video/flv'></source>
  <source src='bb.mp4' type='video/mp4'></source>
</video>
```

:::

- 进度条、度量器

::: tip

> [progress 标签 MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/progress)

`progress`标签：用来表示任务的进度`（IE、Safari不支持）`，`max`用来表示任务的进度，`value`表示已完成多少。

`meter`属性：用来显示剩余容量或剩余库存`（IE、Safari不支持）`。

- `high/low`：规定被视作高/低的范围
- `max/min`：规定最大/小值
- `value`：规定当前度量值

设置规则：`min` < `low` < `high` < `max`
:::

- `Canvas 画布`： 提供了 `<canvas>` 元素，允许通过 `JavaScript` 绘制图形、图表和动画

```html
<canvas id="myCanvas" width="200" height="100"></canvas>
```

- `SVG`：`SVG` 指可伸缩矢量图形，用于定义用于网络的基于矢量的图形，使用 `XML` 格式定义图形，图像在放大或改变尺寸的情况下其图形质量不会有损失
- 拖放：拖放是一种常见的特性，即抓取对象以后拖到另一个位置。设置元素可拖放。

```html
<img draggable="true" />
```

::: tip

> [HTML5 拖放事件 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/drag_event)

- `dragstart`：事件主体是被拖放元素，在开始拖放被拖放元素时触发。
- `darg`：事件主体是被拖放元素，在正在拖放被拖放元素时触发。
- `dragenter`：事件主体是目标元素，在被拖放元素进入某元素时触发。
- `dragover`：事件主体是目标元素，在被拖放在某元素内移动时触发。
- `dragleave`：事件主体是目标元素，在被拖放元素移出目标元素是触发。
- `drop`：事件主体是目标元素，在目标元素完全接受被拖放元素时触发。
- `dragend`：事件主体是被拖放元素，在整个拖放操作结束时触发。

:::

- `表单增强`：如 `<input>` 的 `type` 属性中的 `date`、`email`、`url`
- `本地存储`：提供了 `Web Storage（localStorage 和 sessionStorage`）和 `IndexedDB`，使得浏览器可以在客户端存储数据，以提高性能和离线应用的能力
- `地理位置 API`：提供了 `Geolocation API`，使得网页可以获取用户设备的地理位置信息
- `Web Workers`：`web worker` 是运行在后台的 `js`，独立于其他脚本，不会影响页面的性能。 并且通过 `postMessage` 将结果回传到主线程。这样在进行复杂操作的时候，就不会阻塞主线程了。

## `HTML`语义化

`HTML` 语义化是指根据内容的结构化（内容语义化）来选择合适的标签（代码语义化），即用正确的标签做正确的事情

::: tip 语义化的好处

- 搜索引擎将其内容视为影响页面搜索排名的重要关键字，有利于[SEO](https://developer.mozilla.org/zh-CN/docs/Glossary/SEO)优化。
- 方便其他设备解析，例如屏幕阅读器可以将其用作指引，帮助视力受损的用户导航页面。
- 比起搜索无休止的带有或不带有语义/命名空间类的 div，找到有意义的代码块显然容易得多。
- 语义命名反映了正确的自定义元素/组件命名、增强了代码的可读性和可维护性。
  :::

> [HTML 语义化 MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Semantics#html_%E4%B8%AD%E7%9A%84%E8%AF%AD%E4%B9%89)

### 常用语义化标签

- `<article>`：表示页面中一块与上下文不相关的独立内容，如一篇文章
- `<aside>`：表示`<article>`标签内容之外的，与`<article>`标签内容相关的辅助信息，一般包含导航、广告等工具性质的内容
- `<header>`：表示页面中一个内容区块或整个页面的标题
- `<footer>`：表示整个页面或页面中一个内容区块的脚注。一般来说，它会包含创作者的姓名、创作日期及联系方式
- `<main>`：表示文章的主要内容
- `<section>`：页面中的一个内容区块，如章节、页眉、页脚或页面的其他地方，可以和`h1`、`h2`……元素结合起来使用，表示文档结构
- `<hgroup>`：表示对整个页面或页面中的一个内容区块的标题进行组合
- `<figure>` 和 `<figcaption>`：表示与文章相关的图像、照片等流内容
- `<details>` 和 `<summary>`：表示可以查看或隐藏的其他详细信息
- `<h1> ~ <h6>`：表示文章中不同层级的标题
- `<nav>`：表示导航
  - 在 `header` 中大多表示文章目录
  - 在 `aside` 中大多是关联页面或者是整站地图
- `<time>`：表示日期或时间
- `<mark>`：表示为引用或符号目的而标记或突出显示的文本

> [HTML 语义化标签 MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)

## `DOCTYPE`(⽂档类型) 的作⽤

`DOCTYPE`是`HTML5`中一种标准通用标记语言的文档类型声明，**<font color="FF9D00">它的目的是告诉浏览器（解析器）应该以什么样`（html或xhtml）`的文档类型定义来解析文档</font>**，不同的渲染模式会影响浏览器对 `CSS` 代码甚⾄ `JavaScript` 脚本的解析。它必须声明在 HTML ⽂档的第⼀⾏。
浏览器渲染页面的两种模式：

- `CSS1Compat`：标准模式`（Strick mode）`，默认模式，浏览器使用 W3C 的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面。
- `BackCompat`：怪异模式(混杂模式)`(Quick mode)`，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后兼容的方式显示。

## `meta`标签

`meta` 标签由 `name` 和 `content` 属性定义，用来描述网页文档的属性，比如网页的作者，网页描述，关键词等，除了`HTTP`标准固定了一些`name`作为大家使用的共识，开发者还可以自定义`name`

常用的`meta`标签属性：

- `charset`：用来描述 HTML 文档的编码类型

```html
<meta charset="UTF-8" />
```

- `keywords`：页面关键字

```html
<meta name="keywords" content="关键词" />
```

- `description`：页面描述

```html
<meta name="description" content="页面描述内容" />
```

- `refresh`：页面重定向和刷新

```html
<meta http-equiv="refresh" content="0;url=" />
```

- `viewport`：适配移动端，可以控制视口的大小和比例

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
```

::: tip viewport
`content` 参数有以下几种：

- `width viewport` ：宽度(数值/`device-width`)
- `height viewport` ：高度(数值/`device-height`)
- `initial-scale`：初始缩放比例
- `maximum-scale` ：最大缩放比例
- `minimum-scale`：最小缩放比例
- `user-scalable` ：是否允许用户缩放`(yes/no)`
  :::

- 搜索引擎索引方式

```html
<meta name="robots" content="index,follow" />
```

::: tip
`content` 参数有以下几种：

- `all`：文件将被检索，且页面上的链接可以被查询；
- `none`：文件将不被检索，且页面上的链接不可以被查询；
- `index`：文件将被检索；
- `follow`：页面上的链接可以被查询；
- `noindex`：文件将不被检索；
- `nofollow`：页面上的链接不可以被查询。
  :::

## `src`和`href`

`src`和`href`都是用来引用外部的资源，它们的区别如下：

- `src`： 表示对资源的引用，它指向的内容会嵌入到当前标签所在的位置。`src`会将其指向的资源下载并应⽤到⽂档内，如请求`js`脚本。**<font color="FF9D00">当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执⾏完毕，所以⼀般`js`脚本会放在页面底部</font>**。
- `href`： 表示超文本引用，它指向一些网络资源，建立和当前元素或本文档的链接关系。当浏览器识别到它他指向的⽂件时，就会并⾏下载资源，不会停⽌对当前⽂档的处理。 常用在`a`、`link`等标签上。

## `img`的`srcset`属性

响应式页面中经常用到根据屏幕密度设置不同的图片。这时就用到了 `img` 标签的`srcset`属性。`srcset`属性用于设置不同屏幕密度下，`img` 会自动加载不同的图片。

> [HTMLImageElement.srcset MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLImageElement/srcset)

```html
<img src="image-32.png" srcset="image-64.png 2x" />
```

使用 👆 的代码，就能实现在屏幕密度为`1x`的情况下加载`image-32.png`, 屏幕密度为`2x`时加载`image-64.png`。

如果不同的屏幕密度都要设置图片地址，目前的屏幕密度有`1x`、`2x`、`3x`、`4x`四种，如果每一个图片都设置 4 张图片，加载就会很慢。所以就有了新的`srcset`标准。

```html
<img
  src="image-32.png"
  srcset="image-32.png 32w, image-64.png 64w, image-128.png 128w, image-256.png 256w"
  sizes="(max-width: 360px) 340px, 128px"
/>
```

其中`srcset`指定图片的地址和对应的图片质量。

`sizes`用来设置图片的尺寸零界点。

对于 `srcset` 中的 `w` 单位，可以理解成图片质量。如果可视区域小于这个质量的值，就可以使用。浏览器会自动选择一个最小的可用图片

`sizes`语法：

```html
sizes="[media query] [length], [media query] [length] ... "
```

`sizes`就是指默认显示`128px`, 如果视区宽度大于`360px`, 则显示`340px`。

## `label`标签

`label`标签用来定义表单控件的关系：当用户选择`label`标签时，浏览器会自动将焦点转到和`label`标签相关的表单控件上。

```html
<label for="mobile">Number:</label>
<input type="text" id="mobile" />
```

```html
<label>
  Date:
  <input type="text" />
</label>
```

## `title`与`h1`的区别、`b`与`strong`的区别、`i`与`em`的区别

- `title`没有明确意义只表示是个标题，`h1`则表示层次明确的标题，对页面信息的抓取有很大的影响。
- `strong`标签有语义，是起到加重语气的效果，而`b`标签是没有的，`b`标签只是一个简单加粗标签。`b`标签之间的字符都设为粗体，`strong`标签加强字符的语气都是通过粗体来实现的，而搜索引擎更侧重`strong`标签。
- `i`内容展示为斜体，`em`表示强调的文本。

## `HTML5` 离线缓存

离线存储指的是：在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件

::: tip 原理
`HTML5`的离线存储是基于一个新建的 `.appcache` 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像`cookie`一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。
:::

### 使用方法

- 创建一个和 `html` 同名的 `manifest` 文件，然后在页面头部加入 `manifest` 属性

```html
<html lang="en" manifest="index.manifest"></html>
```

- 在 `cache.manifest` 文件中编写需要离线存储的资源

```sh
CACHE MANIFEST
    #v0.11
    CACHE:
    js/app.js
    css/style.css
    NETWORK:
    assests/logo.png
    FALLBACK:
    / /app.html
```

- `CACHE`: 表示需要离线存储的资源列表，由于包含 `manifest` 文件的页面将被自动离线存储，所以不需要把页面自身也列出来。
- `NETWORK`: 表示在它下面列出来的资源只有在在线的情况下才能访问，他们不会被离线存储，所以在离线情况下无法使用这些资源。不过，如果在 `CACHE` 和 `NETWORK` 中有一个相同的资源，那么这个资源还是会被离线存储，也就是说 `CACHE` 的优先级更高。
- `FALLBACK`: 表示如果访问第一个资源失败，那么就使用第二个资源来替换他，比如上面这个文件表示的就是如果访问根目录下任何一个资源失败了，那么就去访问 `app.html`。

在离线状态时，操作 `window.applicationCache`进行离线缓存的操作。

### 如何更新缓存

- 更新 `manifest` 文件

- 通过 `js` 操作

- 清除浏览器缓存

::: tip

- 浏览器对缓存数据的容量限制可能不太一样（某些浏览器设置的限制是每个站点 `5MB`）。
- 如果 `manifest` 文件，或者内部列举的某一个文件不能正常下载，整个更新过程都将失败，浏览器继续全部使用老的缓存。
- 引用 `manifest` 的 `html` 必须与 `manifest` 文件同源，在同一个域下。
- `FALLBACK` 中的资源必须和 `manifest` 文件同源。
- 当一个资源被缓存后，该浏览器直接请求这个绝对路径也会访问缓存中的资源。
- 站点中的其他页面即使没有设置 `manifest` 属性，请求的资源如果在缓存中也从缓存中访问。
- 当 `manifest` 文件发生改变时，资源请求本身也会触发更新。
  :::

### 浏览器是如何对 HTML5 的离线储存资源进行管理和加载

- 在线的情况下，浏览器发现 `html` 头部有 `manifest` 属性，它会请求 `manifest` 文件。
  ::: tip

如果是第一次访问页面 ，那么浏览器就会根据 `manifest` 文件的内容下载相应的资源并且进行离线存储。如果已经访问过页面并且资源已经进行离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 `manifest` 文件与旧的 `manifest` 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，就会重新下载文件中的资源并进行离线存储。
:::

- 离线的情况下，浏览器会直接使用离线存储的资源。

## `Canvas` 与 `SVG`

::: tip
[SVG MDN](https://developer.mozilla.org/zh-CN/docs/Web/SVG)

[Canvas MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas)
:::

### `SVG`

`SVG`可缩放矢量图形`（Scalable Vector Graphics）`是基于可扩展标记语言`XML`描述的`2D`图形的语言，`SVG`基于`XML`就意味着`SVG DOM`中的每个元素都是可用的，可以为某个元素附加`Javascript`事件处理器。在 `SVG` 中，每个被绘制的图形均被视为对象。如果 `SVG` 对象的属性发生变化，那么浏览器能够自动重现图形。

- 不依赖分辨率
- 支持事件处理器
- 最适合带有大型渲染区域的应用程序
- 复杂度高会减慢渲染速度
- 不适合游戏应用

### `Canvas`

`Canvas`是画布，通过`Javascript`来绘制`2D`图形，是逐像素进行渲染的。其位置发生改变，就会重新进行绘制。

- 依赖分辨率
- 不支持事件处理器
- 弱的文本渲染能力
- 能够以 .png 或 .jpg 格式保存结果图像

## 渐进增强和优雅降级

- 渐进增强：主要是针对低版本的浏览器进行页面重构，保证基本的功能情况下，再针对高级浏览器进行效果、交互等方面的改进和追加功能，以达到更好的用户体验。
- 优雅降级：一开始就构建完整的功能，然后再针对低版本的浏览器进行兼容。

区别：

- 优雅降级是从复杂的现状开始的，并试图减少用户体验的供给。
- 渐进增强是从一个非常基础的，能够起作用的版本开始的，并在此基础上不断扩充，以适应未来环境的需要。
- 降级意味着往回看，而渐进增强则意味着往前看，同时保证其根基处于安全地带。
