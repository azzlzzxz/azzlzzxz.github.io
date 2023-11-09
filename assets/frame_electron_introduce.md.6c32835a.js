import{_ as a,B as l,o as n,c as i,x as o,D as d,z as t,a as e,Q as r}from"./chunks/framework.a5035e6c.js";const s="/assets/electron.1903aecb.png",p="/assets/electron_detail.416b0c0a.png",_="/assets/process.ceb11bc3.png",h="/assets/electron_api.732b8de2.png",V=JSON.parse('{"title":"Electron","description":"","frontmatter":{},"headers":[],"relativePath":"frame/electron/introduce.md","lastUpdated":1699496231000}'),u={name:"frame/electron/introduce.md"},m=r('<h1 id="electron" tabindex="-1">Electron <a class="header-anchor" href="#electron" aria-label="Permalink to &quot;Electron&quot;">​</a></h1><h2 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-label="Permalink to &quot;介绍&quot;">​</a></h2><p><code>Electron</code> 是一个框架，可以让您使用 <code>JavaScript</code>, <code>HTML</code> 和 <code>CSS</code> 创建桌面应用程序。 然后这些应用程序可以打包在 macOS、Windows 和 Linux 上直接运行。</p><h2 id="electron-为什么能跨平台" tabindex="-1"><code>Electron</code> 为什么能跨平台 <a class="header-anchor" href="#electron-为什么能跨平台" aria-label="Permalink to &quot;`Electron` 为什么能跨平台&quot;">​</a></h2><p><code>Electron</code> 由 <code>chromium</code>、<code>nodejs</code>、<code>native api</code> 构成。其中，<code>nodejs</code> 是一个基于 <code>Chrome V8</code> 引擎的 <code>JavaScript</code> 运行时，提供了不同系统平台的支持，<code>chromium</code> 是谷歌公司开源的浏览器引擎，同样的也提供了不同系统平台的支持。</p><p><code>Electron</code> 开发团队通过继承不同系统的 <code>chromium</code> 和 <code>nodejs</code>，提供一些桌面应用依赖的系统级别 <code>api</code>，实现了 <code>Electron</code> 的跨平台。</p><p><img src="'+s+'" alt="electron"></p><p><img src="'+p+'" alt="electron_detail"></p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>什么是进程和线程?</p><p>对于操作系统来讲，一个任务就是一个<code>进程（Process）</code>，比如打开一个浏览器就是启动一个浏览器进程，打开一个记事本就启动了一个记事本进程，打开两个记事本就启动两个记事本进程，打开一个 <code>word</code> 就是启动一个 <code>word</code> 进程。</p><p>有些进程还不止同时干一件事，比如 <code>word</code>，它可以同时进行打字、拼写检查、打印等事情。在一个进程内部，要同时干多件事，就需要运行多个子任务，把进程内的子任务称之为<code>线程（Thread）</code>。</p></div><p><img src="'+_+'" alt="process"></p><h2 id="electron-的主进程" tabindex="-1"><code>Electron</code> 的主进程 <a class="header-anchor" href="#electron-的主进程" aria-label="Permalink to &quot;`Electron` 的主进程&quot;">​</a></h2><p><strong>在 <code>Electron</code> 里，运行 <code>package.json</code> 里 <code>main</code> 脚本的进程被称为主进程。</strong></p><h3 id="主进程这个职位很重要-它有什么特点呢" tabindex="-1">主进程这个职位很重要，它有什么特点呢？ <a class="header-anchor" href="#主进程这个职位很重要-它有什么特点呢" aria-label="Permalink to &quot;主进程这个职位很重要，它有什么特点呢？&quot;">​</a></h3><ul><li>可以使用和系统对接的 <code>ElectronAPI</code>，比如菜单创建等</li><li>支持 <code>NodeJS</code>，在主进程可以任意使用 <code>NodeJS</code> 的特性</li><li>创建多个渲染进程</li><li>有且只有一个，并且是整个程序的入口文件</li><li>控制整个应用程序的生命周期</li></ul><p>在主进程调用 <code> browserWindow </code> 时，会生成一个渲染进程并对应一个浏览器窗口，恰如其名，渲染进程是负责渲染 <code>Web</code> 网页内容的。</p><h2 id="electron-的渲染进程" tabindex="-1"><code>Electron</code> 的渲染进程 <a class="header-anchor" href="#electron-的渲染进程" aria-label="Permalink to &quot;`Electron` 的渲染进程&quot;">​</a></h2><p>由于 <code>Electron</code> 使用 <code>Chromium（浏览器）</code> 来展示页面，所以 <code>Chromium</code> 的多进程结构也被充分利用。</p><p>每个 <code>Electron</code> 的页面都在运行着自己的进程，这样的进程我们称之为渲染进程。在一般浏览器中，网页通常会在沙盒环境下运行，并且不允许访问原生资源。然而，<code>Electron</code> 用户拥有在网页中调用 <code>io.js</code> 的 <code>APIs</code> 的能力，可以与底层操作系统直接交互。</p>',18),b=o("code",null,"Electron",-1),E=o("code",null,"Electron",-1),f=o("code",null,"Chromium",-1),P=o("code",null,"UI",-1),I=o("code",null,"BrowserWindow",-1),q=o("code",null,"Chromium",-1),T=o("code",null,"BrowserWindow",-1),w=o("code",null,"Electron",-1),g=o("code",null,"Web",-1),x=r('<h3 id="渲染进程的入口是一个-html-文件-那么渲染进程的特点是什么" tabindex="-1">渲染进程的入口是一个 HTML 文件，那么渲染进程的特点是什么？ <a class="header-anchor" href="#渲染进程的入口是一个-html-文件-那么渲染进程的特点是什么" aria-label="Permalink to &quot;渲染进程的入口是一个 HTML 文件，那么渲染进程的特点是什么？&quot;">​</a></h3><ul><li>可以使用部分 <code>Electron</code> 的 <code>API</code></li><li>全面支持 <code>NodeJS</code></li><li>存在多个渲染进程</li><li>可以访问 <code>DOM API</code></li></ul><h2 id="主进程与渲染进程的区别" tabindex="-1">主进程与渲染进程的区别 <a class="header-anchor" href="#主进程与渲染进程的区别" aria-label="Permalink to &quot;主进程与渲染进程的区别&quot;">​</a></h2><p>主进程使用 <code>BrowserWindow</code> 实例创建网页。每个 <code>BrowserWindow</code> 实例都在自己的渲染进程里运行着一个网页。当一个 <code>BrowserWindow</code> 实例被销毁后，相应的渲染进程也会被终止。</p><p>主进程管理所有页面和与之对应的渲染进程。每个渲染进程都是相互独立的，并且只关心他们自己的网页。</p><p>由于在网页里管理原生 <code>GUI</code> 资源是非常危险而且容易造成资源泄露，所以在网页面调用 <code>GUI</code> 相关的 APIs 是不被允许的。如果你想在网页里使用 <code>GUI</code> 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 <code>GUI</code> 操作。</p><p>在 <code>Electron</code>，我们提供用于在主进程与渲染进程之间通讯的 <code> ipc </code> 模块。并且也有一个远程进程调用风格的通讯模块  <code>remote</code>。</p><p><code>Electron</code>，主进程与渲染进程的通讯方式：</p><ul><li><code>ipcMain</code>，<code>ipcRender</code></li><li><code>Remote</code> 模块</li></ul><p><img src="'+h+'" alt="electron_api"></p><h2 id="gui-是什么" tabindex="-1"><code>GUI</code> 是什么？ <a class="header-anchor" href="#gui-是什么" aria-label="Permalink to &quot;`GUI` 是什么？&quot;">​</a></h2><p><code>GUI</code> 图形用户界面（<code>Graphical User Interface</code>，简称 <code>GUI</code>，又称图形用户接口）是指采用图形方式显示的计算机操作用户界面。</p><p>图形用户界面是一种人与计算机通信的界面显示格式，允许用户使用鼠标等输入设备操纵屏幕上的图标或菜单选项，以选择命令、调用文件、启动程序或执行其它一些日常任务。与通过键盘输入文本或字符命令来完成例行任务的字符界面相比，图形用户界面有许多优点。</p><p>图形用户界面由窗口、下拉菜单、对话框及其相应的控制机制构成，在各种新式应用程序中都是标准化的，即相同的操作总是以同样的方式来完成，在图形用户界面，用户看到和操作的都是图形对象，应用的是计算机图形学的技术。</p>',14);function S(k,C,A,U,N,B){const c=l("font");return n(),i("div",null,[m,o("p",null,[o("strong",null,[d(c,{color:"FF9D00"},{default:t(()=>[e("一个 "),b,e(" 只会存在一个主进程，但它可以存在多个渲染进程，")]),_:1})]),e(" 由于 "),E,e(" 使用了 "),f,e(" 来展示 "),P,e(" 界面 (应用程序中被称为 "),I,e(")，自然而然地，"),q,e(" 的多进程架构也被引入。")]),o("p",null,[o("strong",null,[d(c,{color:"FF9D00"},{default:t(()=>[e("当主进程每创建一个独立的 "),T,e(" 实例，"),w,e(" 都会初始化一个独立的渲染进程，隔离了不同窗口之间的环境，")]),_:1})]),e(" 每一个渲染进程，只需要关心自己内部的 "),g,e(" 页面。")]),x])}const W=a(u,[["render",S]]);export{V as __pageData,W as default};
