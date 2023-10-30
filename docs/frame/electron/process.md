# Electron 的主进程&渲染进程

## 主进程

主进程下的几个重要的模块：

- **<font color="FF9D00">app</font>**
- **<font color="FF9D00">BrowerWindow 与 BrowerView</font>**
- **<font color="FF9D00">ipcMain</font>**
- **<font color="FF9D00">Menu</font>**
- **<font color="FF9D00">Tray</font>**

### app

控制应用程序的事件生命周期。

app 的常用生命周期钩子如下：

- **<font color="FF9D00">will-finish-launching</font>** 在应用完成基本启动进程之后触发，在 Windows 和 Linux 中, will-finish-launching  事件与  ready  事件是相同的。
- **<font color="FF9D00">ready</font>** 当 electron 完成初始化后触发，绝大部分情况下，你必须在 ready 事件句柄中处理所有事务。
- **<font color="FF9D00">window-all-closed</font>** 所有窗口都关闭的时候触发，在 windows 和 linux 里，所有窗口都退出的时候通常是应用退出的时候，如果你没有监听此事件并且所有窗口都关闭了，默认的行为是控制退出程序；但如果你监听了此事件，你可以控制是否退出程序。 如果用户按下了  Cmd + Q，或者开发者调用了  app.quit()，Electron 会首先关闭所有的窗口然后触发  will-quit  事件，在这种情况下  window-all-closed  事件不会被触发。
- **<font color="FF9D00">before-quit</font>** 退出应用之前的时候触发
- **<font color="FF9D00">will-quit</font>** 即将退出应用的时候触发
- **<font color="FF9D00">quit</font>** 应用退出的时候触发

:::tip
而我们通常会在 ready 的时候执行创建应用窗口、创建应用菜单、创建应用快捷键等初始化操作。而在 will-quit 或者 quit 的时候执行一些清空操作，比如解绑应用快捷键。

特别的，在非 macOS 的系统下，通常一个应用的所有窗口都退出的时候，也是这个应用退出之时。所以可以配合 window-all-closed 这个钩子来实现：

```js
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // 当操作系统不是 darwin（macOS）的话
    app.quit() // 退出应用
  }
})
```

:::

除了上面说的生命周期钩子之外，还有一些常用的事件钩子：

- **<font color="FF9D00">active</font>**（仅 macOS）当应用处于激活状态时
- **<font color="FF9D00">browser-window-created</font>** 当一个 BrowserWindow 被创建的时候
- **<font color="FF9D00">browser-window-focus</font>** 当一个 BrowserWindow 处于激活状态的时候

当然，app 这个模块除了上述的一些事件钩子之外，还有一些很常用的方法：

- **<font color="FF9D00">app.quit()</font>** 用于退出应用
- **<font color="FF9D00">app.getPath(name)</font>** 用于获取一些系统目录，对于存放应用的配置文件等很有用
- **<font color="FF9D00">app.focus()</font>** 用于激活应用，不同系统激活逻辑不一样。

### BrowerWindow 与 BrowerView：

**<font color="FF9D00">BrowerView：</font>** 创建和控制视图，BrowserView  被用来让  BrowserWindow  嵌入更多的 web 内容，它就像一个子窗口，除了它的位置是相对于父窗口，这意味着可以替代 webview 标签。

**<font color="FF9D00">BrowerWindow：</font>** 创建和控制浏览器窗口。

**webview**

webview 是网页上的元素。

**<font color="FF9D00">webwiew 的作用是用来嵌入外来不受信任资源，实现外来资源与本地资源的隔离，保证嵌入资源的安全性。</font>**

与 iframe 的作用是相似的，但是其与 iframe 的本质区别其是运行 webview 的是一个单独的进程（也就是子窗口）。

BrowserView 就是 webview 的替代工具，能让 BrowserWindow 在主进程中动态引入 webview。

BrowserWindow 的常用配置

```js
let window

function createWindow () {
  window = new BrowserWindow({
    height: 900, // 高
    width: 400, // 宽
    show: false, // 创建后是否显示
    frame: false, // 是否创建frameless窗口
    fullscreenable: false, // 是否允许全屏
    center: true, // 是否出现在屏幕居中的位置
    backgroundColor: '#fff' // 背景色，用于transparent和frameless窗口
    titleBarStyle: 'xxx' // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
    resizable: false, // 是否允许拉伸大小
    transparent: true, // 是否是透明窗口（仅macOS）
    vibrancy: 'ultra-dark', // 窗口模糊的样式（仅macOS）
    webPreferences: {
      backgroundThrottling: false // 当页面被置于非激活窗口的时候是否停止动画和计时器
    }
    // ... 以及其他可选配置
  })
if (process.platform === 'win32') {
    // 针对windows平台做出不同的配置
    options.show = true
    // 创建即展示
    options.frame = false
    //
    创建一个frameless窗口 options.backgroundColor = '#3f3c37' // 背景色
}

  window.loadURL(url)

  window.on('closed', () => { window = null })
}
```

跟 app 模块一样，BrowserWindow 也有很多常用的事件钩子：

- closed 当窗口被关闭的时候
- focus 当窗口被激活的时候
- show 当窗口展示的时候
- hide 当窗口被隐藏的时候
- maxmize 当窗口最大化时
- minimize 当窗口最小化时
- ...

当然，也依然有很多实用的方法：

- BrowserWindow.getFocusedWindow() [静态方法]获取激活的窗口
- win.close() [实例方法，下同]关闭窗口
- win.focus() 激活窗口
- win.show() 显示窗口
- win.hide() 隐藏窗口
- win.maximize() 最大化窗口
- win.minimize() 最小化窗口
- win.restore() 从最小化窗口恢复

### Tray

添加图标和上下文菜单到系统通知区。

可以把它理解为不同系统的任务栏里的图标组件吧。

### Menu

创建原生应用菜单和上下文菜单。

主要分两种：

- 第一种是 app 的菜单。对于 macOS 来说就是顶部栏左侧区域的菜单项。对于 windows 而言就是一个窗口的标题栏下方的菜单区。
- 第二种是类似于右键菜单的菜单。

## 进程通信

**通信方式：**

- **<font color="FF9D00">ipcMain 与 ipcRenderer</font>**
- **<font color="FF9D00">webContent</font>**

### ipcMain 与 ipcRenderer

**<font color="FF9D00">ipcRenderer: </font>** 可以使用它提供的一些方法从渲染进程 (web 页面) 发送同步或异步的消息到主进程。 也可以接收主进程回复的消息。

**<font color="FF9D00">ipcMain：</font>** 从主进程到渲染进程的异步通信。

:::tip
发送消息时，事件名称为 channel 。

回复同步信息时，需要设置 event.returnValue。

可以使用 event.reply(...)将异步消息发送回发送者
:::

官网上的 🌰：

```js
// 在主进程中.
const { ipcMain } = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

//在渲染器进程 (网页) 中。
const { ipcRenderer } = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
```

其中 ipcMain 只有监听来自 ipcRenderer 的某个事件后才能返回给 ipcRenderer 值。而 ipcRenderer 既可以收，也可以发。

那么问题就来了，如何让 ipcMain 主动发送消息呢？或者说让 main 进程主动发送消息给 ipcRenderer。

首先要明确的是，ipcMain 无法主动发消息给 ipcRenderer。因为 ipcMain 只有.on()方法没有.send()的方法。所以只能用 webContents。

### webContents

webContents 其实是 BrowserWindow 实例的一个属性。也就是如果我们需要在 main 进程里给某个窗口某个页面发送消息，则必须通过 win。

webContents.send()方法来发送。

```js
// In main process
let win = new BrowserWindow({...})
win.webContents.send('img-files', imgs)

// In renderer process
ipcRenderer.on('img-files', (event, files) => {
console.log(files)
})

```

必须指定要发送的窗口，才能将信息准确送达。
