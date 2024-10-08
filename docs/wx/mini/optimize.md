# 微信小程序优化相关知识

![wx_optimize](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/wx_optimize.jpeg)

## 启动时性能优化

用户能够更快的打开并看到小程序内容，避免耗时过长导致用户流失，启动性能可从以下几个方面进行优化：

- 代码包体积优化

- 代码注入优化

- 首页渲染优化

![wx_package](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/wx_package.jpeg)

小程序启动时，微信会为小程序展示一个固定的启动界面，此时微信会在背后完成几项工作：

- 下载小程序代码包

- 加载小程序代码包

- 初始化小程序首页

> 流程图

![start_flow](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/start_flow.png)

在小程序第一次启动时，微信需要下载小程序代码包。此后，如果小程序代码包未更新且还被保留在缓存中，则下载小程序代码包的步骤会被跳过。这样控制代码包大小有助于减少小程序的启动时间。

::: tip 控制代码包大小的方法

- 精简代码，去掉不必要的 `WXML` 结构和未使用的 `WXSS` 定义

- 减少在代码包中直接嵌入的资源文件

- 压缩图片，使用适当的图片格式

:::

**如果小程序比较复杂，优化后的代码总量可能仍然较大，此时可以采用分包加载的方式进行优化**。小程序的代码包可以被划分为几个（单个代码包上限`2M`）：

- 主包：包含小程序启动时会马上打开的页面代码和相关资源

- 分包：包含其余的代码和资源

一般情况下，小程序的代码将打包在一起，在小程序启动时一次性下载完成。采用分包可以显著减少启动时需要下载的代码包大小，在不影响功能正常使用的前提下，有效降低启动耗时。

另外，结合分包加载的几个扩展功能，可以进一步优化启动耗时：

- [<u>独立分包</u>](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html)：可以独立于主包和其他分包运行，功能独立性的页面可以使用

- [<u>分包预下载</u>](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html)：进入某个页面时可自动预下载可能需要的分包，提升进入后续分包页面时的启动速度

- [<u>分包异步化</u>](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/async.html)：允许通过一些配置和新的接口，使部分跨分包的内容可以等待下载后异步使用

### 代码注入优化

![code_inject](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/code_inject.jpeg)

#### 按需注入

在小程序启动时，启动页面依赖的所有代码包（主包、分包、插件包、扩展库等）的所有 `JS` 代码会全部合并注入，包括其他未访问的页面以及未用到自定义组件，同时所有页面和自定义组件的 `JS` 代码会被立刻执行。

这造成很多没有使用的代码在小程序运行环境中注入执行，影响注入耗时和内存占用。

小程序可通过 `lazyCodeLoading` 有选择的注入必要的代码，以降低小程序的启动时间和运行时内存。

```json
{
  "lazyCodeLoading": "requiredComponents"
}
```

按需注入开启后：

小程序仅注入当前访问页面所需的自定义组件和页面代码。

未访问的页面、当前页面未声明的自定义组件不会被加载和初始化，对应的代码文件也不会被执行。

::: tip 注意 ⚠️

- 页面 `JSON` 配置中定义的所有组件和 `app.json` 中 `usingComponents` 配置的全局自定义组件，都会被视为页面的依赖并进行注入和加载。

- 因此，要及时移除 `JSON` 中未使用自定义组件的声明，并尽量避免在全局声明使用率低的自定义组件，否则可能会影响按需注入的效果。

:::

#### 用时注入

在开启`「按需注入」`特性的前提下，`「用时注入」`可以指定一部分自定义组件不在小程序启动时注入，而是在真正渲染的时候才进行注入。

在已经指定 `lazyCodeLoading` 为 `requiredComponents` 的情况下，为自定义组件配置 [<u>占位组件</u>](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/placeholder.html)，组件就会自动被视为用时注入组件：

1. 每个页面内，第一次渲染该组件前，该组件都不会被注入。
2. 每个页面内，第一次渲染该组件时，该组件会被渲染为其对应的占位组件，渲染流程结束后开始注入。
3. 注入结束后，占位组件被替换回对应组件。

**启动过程中减少同步 `API` 的调用：**

- 同步 `API` 会阻塞当前 `JS` 线程，影响代码的执行。
- 在小程序启动流程中，会注入开发者代码并顺序同步执行 `App.onLaunch`、`App.onShow`、`Page.onLoad`、`Page.onShow` ，这几个与启动相关的生命周期中应尽量避免调用同步 `API` 。

::: tip 举个 🌰

- [<u>`getSystemInfo`</u>](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfo.html)/[<u>`getSystemInfoSync`</u>](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfoSync.html)：
  `getSystemInfo` 内容多耗时长，建议缓存调用结果或使用拆分后的 `getSystemSetting` 等按需获取信息，或使用异步版本 `getSystemInfoAsync` 代替。

- [<u>`getStorageSync`</u>](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageSync.html)/[<u>`setStorageSync`</u>](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html)

  - 应该只用来进行数据持久化存储。

  - 不应用于运行时的数据传递或全局状态管理。

  - 启动过程中过多读写存储，也会影响小程序代码注入的耗时，简单数据共享推荐 `globalData`。

:::

**启动过程中不进行复杂运算：**

- 复杂运算也会阻塞当前 `JS` 线程，影响启动耗时。

- 与启动流程相关的生命周期中也应尽量避免此类运算，建议将复杂的运算延迟到启动完成后进行。

### 首屏渲染优化

![first_render_optmize](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/first_render_optmize.jpeg)

- **按需注入和用时注入**：可减少需要初始化的组件数量

- [<u>**初始渲染缓存**</u>](https://developers.weixin.qq.com/miniprogram/dev/framework/view/initial-rendering-cache.html)

::: tip 小程序页面的初始化分为两个部分

- **逻辑层初始化**：载入必需的小程序代码、初始化页面 `this` 对象（也包括它涉及到的所有自定义组件的 `this` 对象）、将相关数据发送给视图层。

- **视图层初始化**：载入必需的小程序代码，然后等待逻辑层初始化完毕并接收逻辑层发送的数据，最后渲染页面。

:::

- **清除废弃组件**：不用的组件从 `usingComponents` 移除，减少不必要的初始化。

- **精简首屏数据**：降低数据复杂度，与渲染无关的数据不要放 `data` 中。

- 骨架屏

## 运行时性能优化

运行时性能保障用户能够流畅的使用小程序功能，可从以下几个角度进行优化：

- 合理使用 `setData`

- 渲染性能优化

- 页面切换优化

- 资源加载优化

- 内存优化

### 合理使用 `setData`

![`setData`](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/`setData`.jpeg)

::: tip 小程序的逻辑层和渲染层是分开的两个线程

在渲染层，宿主环境会把 `WXML` 转换成对应的 `JS` 对象，在逻辑层发生数据变更的时候，我们需要通过宿主环境提供的 `setData` 方法把数据从逻辑层传递到渲染层，再经过对比前后差异，把差异应用在原来的 `Dom` 树上，渲染出正确的 `UI` 界面。

:::

正因为逻辑层和渲染层不属于同一个线程，因此是无法数据共享的，这就涉及到了渲染层和逻辑层之间的通信。

![message](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/message.png)

::: tip 注意
渲染层和逻辑层之间的数据通信都要经由微信客户端`（Native）`来转发。正因如此，数据传输的时间就与数据量大体上呈正相关的关系，因而减少传输数据量是降低数据传输时间的有效方式。
:::

初始化渲染完毕后，当我们需要更新界面时，需要调用逻辑层的 `setData` 来执行界面更新。

在数据传输时，逻辑层会执行一次 `JSON.stringify` 来去除掉 `setData` 数据中不可传输的部分，之后将数据发送给视图层。

同时，逻辑层还会将 `setData` 所设置的数据字段与 `data` 合并，这样可以用 `this.data` 读取变更后的数据。

::: info 为了提升数据更新性能，我们在调用 `setData` 时应注意：

- 不要过于频繁调用`setData`，应考虑将多次 `setData` 合并成一次 `setData` 调用，`setData`接口的调用涉及逻辑层与渲染层间的线程通信，通信过于频繁可能导致处理队列阻塞，界面渲染不及时而导致卡顿，应避免无用的频繁调用。

- 数据通信的性能与数据量正相关，因而如果有一些数据字段不在界面中展示且数据结构比较复杂或包含长字符串，则不应使用 `setData` 来设置这些数据

- 与界面渲染无关的数据最好不要设置在 `data` 中，可以考虑设置在 `page` 对象的其他字段下

:::

当某个元素的绑定事件被触发，视图层将事件反馈给逻辑层时，同样需要一个通信过程，通信的方向是从视图层到逻辑层。因为这个通信过程是异步的，会产生一定的延迟，延迟时间同样与传输的数据量正相关。

::: tip 降低延迟时间的方法主要有两个：

- 去掉不必要的事件绑定（`WXML`中的 `bind` 和 `catch`），从而减少通信的数据量和次数。

- 事件绑定时需要传输 `target` 和 `currentTarget` 的 `dataset`，因而不要在节点的 `data` 前缀属性中放置过大的数据。

:::

### 渲染性能优化

![render_optimize](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/render_optimize.jpeg)

视图层在接收到初始数据`（data）`和更新数据`（`setData`数据）`时，需要进行视图层渲染。

在一个页面的生命周期中，视图层会收到一份初始数据和多份更新数据。

收到初始数据时需要执行初始渲染，每次收到更新数据时需要执行重渲染。

初始渲染发生在页面刚刚创建时。

初始渲染时，将初始数据套用在对应的 `WXML` 片段上生成节点树。它包含页面内所有组件节点的名称、属性值和事件回调函数等信息，最后根据节点树包含的各个节点，在界面上依次创建出各个组件。

> 流程图

![render_flow](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/render_flow.png)

在这整个流程中，时间开销大体上与节点树中节点的总量成正比例关系，因而减少 `WXML` 中节点的数量可以有效降低初始渲染和重渲染的时间开销，提升渲染性能。

::: tip 初始渲染完毕后

视图层可以多次应用 `setData` 的数据。每次应用 `setData` 数据时，都会执行重渲染来更新界面。

- 初始渲染中得到的 `data` 和当前节点树会保留下来用于重渲染。

- 每次重渲染时，将 `data` 和 `setData` 数据套用在 `WXML` 片段上，得到一个新节点树。

- 然后将新节点树与当前节点树进行比较，这样可以得到哪些节点的哪些属性需要更新、哪些节点需要添加或移除。

- 最后，将 `setData` 数据合并到 `data` 中，并用新节点树替换旧节点树，用于下一次重渲染。

:::

> 流程图

![dom-diff](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/dom-diff.png)

在进行当前节点树与新节点树的比较时，会着重比较 `setData` 数据影响到的节点属性。因而，去掉不必要设置的数据、减少 `setData` 的数据量有助于提升重渲染性能。

### 页面切换优化

![page_optimize](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/page_optimize.jpeg)

页面切换的性能影响用户操作的连贯性和流畅度，是小程序运行时性能的一个重要组成部分。

**不在 `onHide/onUnload` 中执行耗时操作：**

页面切换时，会先调用前一个`main`页面的 `onHide` 或 `onUnload` 生命周期，然后在进行新页面的创建和渲染。如果 `onHide` 和 `onUnload` 执行过久，可能导致页面切换的延迟。

**提前发起数据请求：**

对那些性能要求较高的场景，当使用 `JSAPI` 进行页面跳转时，可以通过 [<u>`EventChannel`</u>](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#%E9%A1%B5%E9%9D%A2%E9%97%B4%E9%80%9A%E4%BF%A1) 进行通信提前发起接口请求，无需等到页面 `onLoad` 时再进行，从而让用户可以更早的看到页面内容。

### 资源加载优化

![assest_optimize](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/wx/assest_optimize.jpeg)

`widthFix/heightFix` 模式会在图片加载完成后，动态改变图片的高度或宽度。图片高度或宽度的动态改变，可能会引起页面内大范围的布局重排，导致页面发生抖动，并造成卡顿。

### 内存优化

- 事件监听结束及时解绑

- 定时器及时清理

- 代码中持有的页面实例 `this` 应及时释放
