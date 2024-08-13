# Electron

## 介绍

`Electron` 是一个框架，可以让您使用 `JavaScript`, `HTML` 和 `CSS` 创建桌面应用程序。 然后这些应用程序可以打包在 macOS、Windows 和 Linux 上直接运行。

## `Electron` 为什么能跨平台

`Electron` 由 `chromium`、`nodejs`、`native api` 构成。其中，`nodejs` 是一个基于 `Chrome V8` 引擎的 `JavaScript` 运行时，提供了不同系统平台的支持，`chromium` 是谷歌公司开源的浏览器引擎，同样的也提供了不同系统平台的支持。

`Electron` 开发团队通过继承不同系统的 `chromium` 和 `nodejs`，提供一些桌面应用依赖的系统级别 `api`，实现了 `Electron` 的跨平台。

![electron](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/electron.png)

![electron_detail](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/electron_detail.png)

:::tip
什么是进程和线程?

对于操作系统来讲，一个任务就是一个`进程（Process）`，比如打开一个浏览器就是启动一个浏览器进程，打开一个记事本就启动了一个记事本进程，打开两个记事本就启动两个记事本进程，打开一个 `word` 就是启动一个 `word` 进程。

有些进程还不止同时干一件事，比如 `word`，它可以同时进行打字、拼写检查、打印等事情。在一个进程内部，要同时干多件事，就需要运行多个子任务，把进程内的子任务称之为`线程（Thread）`。

:::

![process](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/process_electron.png)

## `Electron` 的主进程

**在 `Electron` 里，运行 `package.json` 里 `main` 脚本的进程被称为主进程。**

### 主进程这个职位很重要，它有什么特点呢？

- 可以使用和系统对接的 `ElectronAPI`，比如菜单创建等
- 支持 `NodeJS`，在主进程可以任意使用 `NodeJS` 的特性
- 创建多个渲染进程
- 有且只有一个，并且是整个程序的入口文件
- 控制整个应用程序的生命周期

在主进程调用 ` browserWindow ` 时，会生成一个渲染进程并对应一个浏览器窗口，恰如其名，渲染进程是负责渲染 `Web` 网页内容的。

## `Electron` 的渲染进程

由于 `Electron` 使用 `Chromium（浏览器）` 来展示页面，所以 `Chromium` 的多进程结构也被充分利用。

每个 `Electron` 的页面都在运行着自己的进程，这样的进程我们称之为渲染进程。在一般浏览器中，网页通常会在沙盒环境下运行，并且不允许访问原生资源。然而，`Electron` 用户拥有在网页中调用 `io.js` 的 `APIs` 的能力，可以与底层操作系统直接交互。

**<font color="FF9D00">一个 `Electron` 只会存在一个主进程，但它可以存在多个渲染进程，</font>** 由于 `Electron` 使用了 `Chromium` 来展示 `UI` 界面 (应用程序中被称为 `BrowserWindow`)，自然而然地，`Chromium` 的多进程架构也被引入。

**<font color="FF9D00">当主进程每创建一个独立的 `BrowserWindow` 实例，`Electron` 都会初始化一个独立的渲染进程，隔离了不同窗口之间的环境，</font>** 每一个渲染进程，只需要关心自己内部的 `Web` 页面。

### 渲染进程的入口是一个 HTML 文件，那么渲染进程的特点是什么？

- 可以使用部分 `Electron` 的 `API`
- 全面支持 `NodeJS`
- 存在多个渲染进程
- 可以访问 `DOM API`

## 主进程与渲染进程的区别

主进程使用 `BrowserWindow` 实例创建网页。每个 `BrowserWindow` 实例都在自己的渲染进程里运行着一个网页。当一个 `BrowserWindow` 实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有页面和与之对应的渲染进程。每个渲染进程都是相互独立的，并且只关心他们自己的网页。

由于在网页里管理原生 `GUI` 资源是非常危险而且容易造成资源泄露，所以在网页面调用 `GUI` 相关的 APIs 是不被允许的。如果你想在网页里使用 `GUI` 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 `GUI` 操作。

在 `Electron`，我们提供用于在主进程与渲染进程之间通讯的 ` ipc ` 模块。并且也有一个远程进程调用风格的通讯模块  `remote`。

`Electron`，主进程与渲染进程的通讯方式：

- `ipcMain`，`ipcRender`
- `Remote` 模块

![electron_api](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/electron_api.png)

## `GUI` 是什么？

`GUI` 图形用户界面（`Graphical User Interface`，简称 `GUI`，又称图形用户接口）是指采用图形方式显示的计算机操作用户界面。

图形用户界面是一种人与计算机通信的界面显示格式，允许用户使用鼠标等输入设备操纵屏幕上的图标或菜单选项，以选择命令、调用文件、启动程序或执行其它一些日常任务。与通过键盘输入文本或字符命令来完成例行任务的字符界面相比，图形用户界面有许多优点。

图形用户界面由窗口、下拉菜单、对话框及其相应的控制机制构成，在各种新式应用程序中都是标准化的，即相同的操作总是以同样的方式来完成，在图形用户界面，用户看到和操作的都是图形对象，应用的是计算机图形学的技术。
