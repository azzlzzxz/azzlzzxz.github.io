# 浏览器性能优化

## PerformanceAPI

![performance](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/performance.png)

| 关键时间节点 | 描述                                   | 含义                                                               |
| ------------ | -------------------------------------- | ------------------------------------------------------------------ |
| TTFB         | time to first byte(首字节时间)         | 从请求到数据返回第一个字节所消耗时间                               |
| TTI          | Time to Interactive(可交互时间)        | DOM 树构建完毕，代表可以绑定事件                                   |
| DCL          | DOMContentLoaded (事件耗时)            | 当 HTML 文档被完全加载和解析完成之后，DOMContentLoaded  事件被触发 |
| L            | onLoad (事件耗时)                      | 当依赖的资源全部加载完毕之后才会触发                               |
| FP           | First Paint（首次绘制）                | 第一个像素点绘制到屏幕的时间                                       |
| FCP          | First Contentful Paint(首次内容绘制)   | 首次绘制任何文本，图像，非空白节点的时间                           |
| FMP          | First Meaningful paint(首次有意义绘制) | 首次有意义绘制是页面可用性的量度标准                               |
| LCP          | Largest Contentful Paint(最大内容渲染) | 在 viewport 中最大的页面元素加载的时间                             |
| FID          | First Input Delay(首次输入延迟)        | 用户首次和页面交互(单击链接，点击按钮等)到页面响应交互的时间       |

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <!-- 需要等待所有的事件执行完毕后才能计算 -->
    <div style="background-color: red;width:100px;height:100px;"></div>
    <!-- elementtiming="meaningful" 加这个属性代表就是有意义的元素 -->
    <h1 elementtiming="meaningful">SteinsGate</h1>
    <script>
      window.addEventListener('DOMContentLoaded', function () {
        // let s = 0;
        // for (let i = 0; i < 100000000; i++) {
        //     s += i;
        // }
        // console.log(s)
        setTimeout(() => {
          document.body.appendChild(document.createTextNode('hello'))
        }, 1000)
      })
      // 这种是预估3s后所有的资源加载完毕
      setTimeout(() => {
        const {
          fetchStart, // 开始访问
          requestStart, // 请求的开始
          responseStart, // 响应的开始
          responseEnd, // 响应的结束
          domInteractive, // dom可交互的时间点
          domContentLoadedEventEnd, // dom加载完毕 + domcontentloaded完成的事件的时间 $(function(){})
          loadEventStart, // 所有资源加载完毕
        } = performance.timing

        let TTFB = responseStart - requestStart // 首字节返回的时间 服务器的处理能力
        let TTI = domInteractive - fetchStart // 整个的一个可交互的时长
        let DCL = domContentLoadedEventEnd - fetchStart // DOM 整个加载完毕
        let L = loadEventStart - fetchStart // 所有资源加载完毕所用的时长

        console.log(TTFB, TTI, DCL, L)

        // MDN
        const paint = performance.getEntriesByType('paint') // getEntriesByType 根据类型获取对应的信息
        console.log(paint[0].startTime) // FP 只是画像素了而已
        console.log(paint[1].startTime) // FCP 有内容才行
      }, 3000)

      // 另一种是 递归 看load的时间不为0
      // mutationObserver

      // FMP first meaningful paint
      // new PerformanceObserver 创建一个可以观测的performance对象
      new PerformanceObserver((entryList, observer) => {
        console.log(entryList.getEntries()[0])

        observer.disconnect() // 监控完后直接结束即可
      }).observe({ entryTypes: ['element'] }) // 观察所有元素

      // LCP
      new PerformanceObserver((entryList, observer) => {
        entryList = entryList.getEntries()
        console.log(entryList[entryList.length - 1], entryList) // 最后那个就是最大的
        observer.disconnect() // 监控完后直接结束即可
      }).observe({ entryTypes: ['largest-contentful-paint'] }) //监控最大的内容绘制

      // FID
      new PerformanceObserver((entryList, observer) => {
        firstInput = entryList.getEntries()[0]
        if (!firstInput) return
        FID = firstInput.processingStart - firstInput.startTime
        console.log(FID)
        observer.disconnect() // 监控完后直接结束即可
      }).observe({ type: ['first-input'], buffered: true })
      // 通过返回值计算事件延迟有多久
    </script>
  </body>
</html>
```

## 网络优化策略

1. 减少`HTTP`请求数，合并`JS、CSS`，合理内嵌`CSS、JS`。

2. 合理设置服务端缓存，提高服务器处理速度。 (强制缓存、协商缓存)

```sh
# 强缓存
Expires/Cache-Control

# 协商缓存
Etag/if-none-match/last-modified/if-modified-since
```

3. 避免重定向，重定向会降低响应速度 (`301`、`302`)。

4. 使用 `dns-prefetch`，进行`DNS`预解析。

![dns-prefetch](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/dns_prefetch.png)

5. 采用域名分片技术，将资源放到不同的域名下，解决同一个域名最多处理 6 个`TCP`链接问题。

6. 采用`CDN`加速加快访问速度(指派最近、高度可用)。

7. `gzip` 压缩优化 对传输资源进行体积压缩 `(html、js、css)`。

```lua
Content-Encoding: gzip
```

8. 加载数据优先级：
   1. `preload`：预先请求当前页面需要的资源
   2. `prefetch`：将来页面中使用的资源（当前页面在空闲时，会请求一些资源，例如路由懒加载）

```html
<link rel="preload" href="style.css" as="style" />
```

## `SEO` 优化

- 添加 `favicon` 图标 和 `TDK` (`title`、`keywords`、`description`)

- 使用 `https`

- `html` 语义化标签

- 图片标签 `alt` 属性

- 服务端渲染

- `sitemap` 站点地图

`sitemap` 站点地图一般是`xml`格式的文件，用于帮助搜索引擎更好地发现和抓取网站上的所有页面，并提供页面优先级和更新频率的信息，帮助搜索引擎更好地分配抓取资源

> 举个 🌰

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://www.xxx.com/</loc>
    <lastmod>2023-06-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

::: tip 标签

- `loc`：页面地址

- `lastmod`：内容最后修改时间

- `changefreq`：预计更新频率

- `priority`：页面相对于其他页面优先级，它的值范围是`0.0`到`1.0`，其中`1.0`表示最高优先级

:::

- `robots` 文件

`robots.txt` 文件是一个网站用来告诉搜索引擎机器人(又称爬虫或蜘蛛)应该如何抓取和索引该网站的一种标准

`robots.txt` 文件需放置在网站的根目录下，以`域名/robots.txt`的形式直接访问到

```txt
User-agent: *
Disallow: /private/
Allow: /vip

Sitemap: https://xxx/sitemap.xml
```

::: tip

- `User-agent`: 该项的值用于描述搜索引擎蜘蛛的名字。如果该项的值设为`*`，则该协议对任何机器人均有效

- `Disallow`：这条指令明确地告诉爬虫不要访问 `/private/` 路径及其下的所有内容。这是 `robots.txt` 文件的核心功能之一，用于保护网站中不希望被搜索引擎索引的页面或内容。

- `Allow`：允许爬虫访问指定路径下的内容，例如`/vip`，但 `Crawler` 不会递归地允许访问其子目录。

- `Sitemap`：提供网站 `sitemap` 的 `URL` 地址，帮助搜索引擎爬虫更有效地发现和索引这些页面

:::

- 向各个搜索引擎提交站点收录

除了`robots.txt + sitemap.xml` 方式增加网址被收录的可能性外，还可以在各搜索引擎站长平台手动提交网址，以缩短爬虫发现网站链接时间，加快爬虫抓取速度

::: tip 搜索引擎站点平台

- 百度：[<u>https://ziyuan.baidu.com/</u>](https://ziyuan.baidu.com/)

- 谷歌：[<u>https://developers.google.com/search?hl=zh-cn</u>](https://developers.google.com/search?hl=zh-cn)

- 360：[<u>https://zhanzhang.so.com/</u>](https://zhanzhang.so.com/)

:::

- 网址规范化

一个页面可能有多个 URL 地址，比如：

```js
https://example.com/xxx.html
https://example.com/xxx
https://www.example.com/xxx
```

这些 `URL` 指向同一个页面内容。但是，我们应该指定其中一个作为该页面的规范化 `URL`

在每个非规范版本的 `HTML` 网页的`<head>`部分中，添加一个 `rel="canonical"` 链接来进行指定规范网址

```html
<link rel="canonical" href="https://www.example.com/article" />
```

- `hreflang`

许多网站会根据用户使用的语言或 区域。`hreflang` 链接可以告诉搜索引擎所有版本的网址 以便针对每种语言或地区显示正确的版本。

```html
<link rel="alternate" hreflang="en" href="https://example.com" />
<link rel="alternate" hreflang="es" href="https://es.example.com" />
<link rel="alternate" hreflang="de" href="https://de.example.com" />
```

::: info

- [<u>谷歌浏览器 LightHouse SEO 审核</u>](https://developer.chrome.com/docs/lighthouse/seo/meta-description?hl=zh-cn)

:::

## 重排和重绘

- **重排（Reflow）**：当 `DOM` 结构或元素的几何属性发生改变时，浏览器需要重新计算元素的几何属性，将其安放在界面中的正确位置，这个过程叫做重排，表现为重新生成布局，重新排列元素（**重排会导致页面的布局重新计算，从而可能影响整个页面的渲染**）。

- **重绘（Repaint）**: 当元素的样式（如颜色、背景等）发生改变，但不影响其几何属性（如位置和尺寸）时，浏览器会重新绘制元素，这个过程称为重绘。**重绘不会影响元素的布局，只会影响其外观**。

![critical_render](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/critical_render.png)

### 如何触发重排和重绘？

任何改变用来构建渲染树的信息都会导致一次重排或重绘：

**重排（Reflow）可能由以下操作触发**：

1. **添加或删除元素**：如使用 `appendChild` 或 `removeChild`。

2. **修改元素的大小**：如改变 `width`、`height` 等样式属性。

3. **移动元素位置**：如通过 `position` 属性或 `margin` 等方式改变位置。

4. **获取位置相关信息**：如调用 `offsetHeight`、`getBoundingClientRect()` 等方法。

**重绘（Repaint）可能由以下操作触发**：

1. **修改元素样式**：例如改变元素的颜色、背景或边框，但不改变其尺寸或位置。

2. **通过 `display: none` 隐藏元素**：会触发重排和重绘。

3. **通过 `visibility: hidden` 隐藏元素**：只会触发重绘，因为元素仍然占据布局空间。

4. **移动或添加动画**：这会影响元素的外观和可能导致重绘。

5. **添加样式表或调整样式属性**：例如添加 CSS 类或更改样式。

**用户行为**也可以触发重排和重绘，例如：

- 调整窗口大小

- 改变字号

- 滚动页面

### 强制同步布局问题

`JavaScript` 强制将计算样式和布局操作提前到当前的任务中。

![async_lay](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/async_lay.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div id="app"></div>
    <script>
      //  优化
      //  console.log(app.offsetTop); // 放在外面比较好，就不会把重排放到js执行里
      function reflow() {
        let el = document.getElementById('app')
        let node = document.createElement('h1')
        node.innerHTML = 'hello'
        el.appendChild(node)
        // 强制同步布局
        console.log(app.offsetTop) // 获取位置就会导致 重排 （重新布局）
      }
      window.addEventListener('load', function () {
        reflow()
      })
    </script>
  </body>
</html>
```

优化后：

![async_opt](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/async_opt.png)

### 布局抖动问题

多次强制同步布局就会造成布局抖动，性能很差

```js
function reflow() {
  let el = document.getElementById('app')
  let node = document.createElement('h1')
  node.innerHTML = 'hello'
  el.appendChild(node)
  // 强制同步布局
  console.log(app.offsetHeight) // 不停的再触发布局
}
window.addEventListener('load', function () {
  for (let i = 0; i < 100; i++) {
    reflow()
  }
})
```

![reflow](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/reflow.png)

### 减少回流和重绘

- 集中改变样式，不要一条一条地修改`DOM`的样式。
- 不要把`DOM`结点的属性值放在循环里当成循环里的变量。
- 为动画的`HTML`元件使用`fixed`或`absoult`的`position`，那么修改他们的`CSS`是不会`reflow`的。
- 不使用`table`布局。因为可能很小的一个小改动会造成整个`table`的重新布局。
- 尽量只修改`position`：`absolute`或`fixed`元素，对其他元素影响不大
- 动画开始`GPU`加速，`translate` 使用`3D`变化

- 提升为合成层，将元素提升为合成层有以下优点：

  - 合成层的位图，会交由`GPU`合成，比`CPU`处理要快。

  - 当需要`repaint`时，只需要`repaint`本身，不会影响到其他的层。
  - 对于`transform`和`opacity`效果，不会触发`layout`和`paint`。
  - 提升合成层的最好方式是使用`CSS`的`will-change`属性：

```css
#target {
  will-change: transform;
}
```

- 脱离文档流
- 渲染时给图片增加固定宽高

- 尽量使用`css3`动画

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <style>
      /* show Rending 查看重绘操作 */
      @keyframes rotate {
        from {
          transform: rotate(0deg);
          /* width: 100px; */
        }
        to {
          transform: rotate(360deg);
          /* width: 500px; */
        }
      }
      #app {
        width: 100px;
        height: 100px;
        background: red;
        animation: rotate 0.2s linear infinite;
      }
    </style>
    <div id="app"></div>

    <div style="opacity: 0.2;">my</div>
  </body>
</html>
```

`css3` 动画使用`GPU`加速渲染（都是图层的复合，并没有回流、重绘），只在第一次进行绘制`（css3 会生成一个自己的图层）`。

图层优点：脱离文档流，其变化不会影响其他。

![layer](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/layer.png)

## 静态文件优化策略

### 图片优化

---

#### 图片格式优化

1. `jpg:`适合色彩丰富的照片、`banner` 图；不适合图形文字、图标（纹理边缘有锯齿），不支持透明度。

2. `png:`适合纯色、透明、图标，支持半透明；不适合色彩丰富图片，因为无损存储会导致存储体积大。

3. `gif:`适合动画，可以动的图标；不支持半透明，不适和存储彩色图片。

4. `webp:` 适合半透明图片，可以保证图片质量和较小的体积。

5. `svg 格式图片:`相比于 `jpg` 和 `jpg` 它的体积更小，渲染成本过高,适合小且色彩单一的图标。

---

#### 图片其他优化

1. 避免空`src`的图片。

2. 减小图片尺寸，节约用户流量。

3. img 标签设置`alt`属性， 提升图片加载失败时的用户体验。

4. 原生的`loading:lazy`图片懒加载（原生用的少不好监控，一般都是`js`实现）。

```html
<img loading="lazy" src="./images/1.jpg" width="300" height="450" />
```

5. 不同环境下，加载不同尺寸和像素的图片。

```html
<img
  src="./images/1.jpg"
  sizes="(max-width:500px) 100px,(max-width:600px) 200px"
  srcset="./images/1.jpg 100w, ./images/3.jpg 200w"
/>
```

6. 对于较大的图片可以考虑采用渐进式图片（渐进式图片是`ui`设计的，图片网速慢时可能会一条一条的加载，渐进式图片一般会比正常的小一些 ）。

7. 采用`base64URL`减少图片请求。

8. 采用雪碧图合并图标图片等。

## `HTML` 优化

1. 语义化 `HTML`:代码简洁清晰，利于搜索引擎，便于团队开发

2. 提前声明字符编码，让浏览器快速确定如何渲染网页内容

3. 减少 `HTML` 嵌套关系、减少`DOM`节点数量

4. 删除多余空格、空行、注释、及无用的属性等

5. `HTML` 减少`iframes`使用（父页面要等待自页面加载完成） `(iframe 会阻塞 onload 事件可以动态加载 iframe)`

6. 避免使用`table`布局

## `CSS` 优化

1. 减少伪类选择器、减少样式层数、减少使用通配符

2. 避免使用`CSS`表达式，`CSS` 表达式会频繁求值，当滚动页面，或者移动鼠标时都会重新计算`(IE6,7)`。

```css
background-color: expression((new Date()) .getHours() %2 ? 'red': 'yellow');
```

3. 删除、减少无意义的代码、对`css` 进行压缩

4. 使用外链 `css`,可以对 `css` 进行缓存

5. 添加媒体字段，只加载有效的 `css` 文件

```html
<link href="index.css" rel="stylesheet" media="screen and (min-width:1024px)" />
```

6. `CSS contain` 属性,将元素进行隔离（表示我当前修改的资源和其他资源没有关系，它可以节约渲染性能）

7. 减少`@import` 使用，由于`@import` 采用的是串行加载

## JS 优化

1. 通过`async、defer`异步加载文件

- `defer`是 `html` 解析时加载 `js`，等 `html` 解析完执行 `js`，`defer` 是有序的。
- `async` 是 `html` 解析时加载 `js`，`js` 加载完毕就立即执行 `js`，会阻塞 `html` 解析，`async` 是无序的。

![async_defer](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/async_defer.png)

2. 减少对 `DOM` 的操作，缓存访问过的元素。

3. 使用 `webWorker` 解决程序阻塞问题。

4. 使用虚拟滚动。

5. `IntersectionObserver`：监控当前屏幕可视范围（性能比 `onscroll` 更高）。

```js
<img src="./images/loading.jpg" data-src="./images/1.jpg" style="width: 200px;height:300px;" />
<img src="./images/loading.jpg" data-src="./images/2.jpg" style="width: 200px;height:300px;" />
<img src="./images/loading.jpg" data-src="./images/3.jpg" style="width: 200px;height:300px;" />

const observer = new IntersectionObserver(function(changes) {
  changes.forEach(function(element, index) {
    if (element.intersectionRatio > 0) { // 元素到达可视区
      observer.unobserve(element.target);
      element.target.src = element.target.dataset.src;
    }
  });
});
function initObserver() {
  const listItems = document.querySelectorAll('img');

  listItems.forEach(function(item) {
    observer.observe(item);
  });
}
initObserver();
```

## 优化策略

1. 关键资源个数越多，首次页面加载时间就会越长。
2. 关键资源的大小，内容越小，下载时间越短。
3. 优化白屏：内联`css`和内联`js`移除文件下载,较小文件体积。
4. 预渲染，打包时进行预渲染。
5. 使用`SSR`加速首屏加载（耗费服务端资源），有利于`SEO`优化。 首屏利用服务端渲染，后续交互采用客户端渲染。
