import{_ as e,B as c,o as r,c as t,x as s,D as a,z as o,a as n,Q as p}from"./chunks/framework.a5035e6c.js";const ss=JSON.parse('{"title":"Electron 的主进程&渲染进程","description":"","frontmatter":{},"headers":[],"relativePath":"frame/electron/process.md","lastUpdated":1714374586000}'),i={name:"frame/electron/process.md"},F=s("h1",{id:"electron-的主进程-渲染进程",tabindex:"-1"},[n("Electron 的主进程&渲染进程 "),s("a",{class:"header-anchor",href:"#electron-的主进程-渲染进程","aria-label":'Permalink to "Electron 的主进程&渲染进程"'},"​")],-1),y=s("h2",{id:"主进程",tabindex:"-1"},[n("主进程 "),s("a",{class:"header-anchor",href:"#主进程","aria-label":'Permalink to "主进程"'},"​")],-1),D=s("p",null,"主进程下的几个重要的模块：",-1),d=s("h3",{id:"app",tabindex:"-1"},[s("code",null,"app"),n(),s("a",{class:"header-anchor",href:"#app","aria-label":'Permalink to "`app`"'},"​")],-1),u=s("p",null,"控制应用程序的事件生命周期。",-1),B=s("p",null,[s("code",null,"app"),n(" 的常用生命周期钩子如下：")],-1),b=s("code",null,"Windows",-1),A=s("code",null,"Linux",-1),E=s("code",null,"will-finish-launching",-1),m=s("code",null," ready ",-1),_=s("code",null,"ready",-1),w=s("code",null,"electron",-1),h=s("code",null,"ready",-1),f=s("code",null,"windows",-1),g=s("code",null,"linux",-1),C=s("code",null,"Cmd + Q",-1),v=s("code",null,"app.quit()",-1),q=s("code",null,"Electron",-1),T=s("code",null,"will-quit",-1),k=s("code",null," window-all-closed",-1),x=p(`<div class="tip custom-block"><p class="custom-block-title">TIP</p><p>而我们通常会在 <code>ready</code> 的时候执行创建应用窗口、创建应用菜单、创建应用快捷键等初始化操作。而在 <code>will-quit</code> 或者 <code>quit</code> 的时候执行一些清空操作，比如解绑应用快捷键。</p><p>特别的，在非 <code>macOS</code> 的系统下，通常一个应用的所有窗口都退出的时候，也是这个应用退出之时。所以可以配合 <code>window-all-closed</code> 这个钩子来实现：</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#BABED8;">app</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">on</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">window-all-closed</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">process</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">platform</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">!==</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">darwin</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 当操作系统不是 darwin（macOS）的话</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">app</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">quit</span><span style="color:#F07178;">() </span><span style="color:#676E95;font-style:italic;">// 退出应用</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#BABED8;">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div></div><p>除了上面说的生命周期钩子之外，还有一些常用的事件钩子：</p>`,2),P=s("code",null,"（仅 macOS）",-1),S=s("code",null,"BrowserWindow",-1),R=s("code",null,"BrowserWindow",-1),V=s("p",null,"当然，app 这个模块除了上述的一些事件钩子之外，还有一些很常用的方法：",-1),W=s("h3",{id:"browerwindow-与-browerview",tabindex:"-1"},[n("BrowerWindow 与 BrowerView： "),s("a",{class:"header-anchor",href:"#browerwindow-与-browerview","aria-label":'Permalink to "BrowerWindow 与 BrowerView："'},"​")],-1),M=s("code",null,"BrowserView",-1),I=s("code",null,"BrowserWindow",-1),j=s("code",null,"webview",-1),N=s("p",null,[s("strong",null,[s("code",null,"webview")])],-1),O=s("p",null,[s("code",null,"webview"),n(" 是网页上的元素。")],-1),z=p(`<p>与 <code>iframe</code> 的作用是相似的，但是其与 <code>iframe</code> 的本质区别其是运行 <code>webview</code> 的是一个单独的进程（也就是子窗口）。</p><p><code>BrowserView</code> 就是 <code>webview</code> 的替代工具，能让 <code>BrowserWindow</code> 在主进程中动态引入 <code>webview</code>。</p><p><code>BrowserWindow</code> 的常用配置</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">let</span><span style="color:#BABED8;"> window</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">createWindow</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#BABED8;">window</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">BrowserWindow</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    height</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">900</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 高</span></span>
<span class="line"><span style="color:#F07178;">    width</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">400</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 宽</span></span>
<span class="line"><span style="color:#F07178;">    show</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 创建后是否显示</span></span>
<span class="line"><span style="color:#F07178;">    frame</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 是否创建frameless窗口</span></span>
<span class="line"><span style="color:#F07178;">    fullscreenable</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 是否允许全屏</span></span>
<span class="line"><span style="color:#F07178;">    center</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 是否出现在屏幕居中的位置</span></span>
<span class="line"><span style="color:#F07178;">    backgroundColor</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">#fff</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 背景色，用于transparent和frameless窗口</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">titleBarStyle</span><span style="color:#F07178;">: </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">xxx</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">resizable</span><span style="color:#F07178;">: </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 是否允许拉伸大小</span></span>
<span class="line"><span style="color:#F07178;">    transparent</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 是否是透明窗口（仅macOS）</span></span>
<span class="line"><span style="color:#F07178;">    vibrancy</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">ultra-dark</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 窗口模糊的样式（仅macOS）</span></span>
<span class="line"><span style="color:#F07178;">    webPreferences</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      backgroundThrottling</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 当页面被置于非激活窗口的时候是否停止动画和计时器</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// ... 以及其他可选配置</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">process</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">platform</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">win32</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 针对windows平台做出不同的配置</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">options</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">show</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">true</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 创建即展示</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">options</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">frame</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">false</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">创建一个frameless窗口</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">options</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">backgroundColor</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">#3f3c37</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 背景色</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#BABED8;">window</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">loadURL</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">url</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#BABED8;">window</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">on</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">closed</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">window</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">null</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br></div></div><p>跟 <code>app</code> 模块一样，<code>BrowserWindow </code>也有很多常用的事件钩子：</p><ul><li><code>closed</code> 当窗口被关闭的时候</li><li><code>focus</code> 当窗口被激活的时候</li><li><code>show</code> 当窗口展示的时候</li><li><code>hide</code> 当窗口被隐藏的时候</li><li><code>maxmize</code> 当窗口最大化时</li><li><code>minimize</code> 当窗口最小化时</li><li>...</li></ul><p>当然，也依然有很多实用的方法：</p><ul><li><code>BrowserWindow.getFocusedWindow()</code> [静态方法]获取激活的窗口</li><li><code>win.close()</code> [实例方法，下同]关闭窗口</li><li><code>win.focus()</code> 激活窗口</li><li><code>win.show()</code> 显示窗口</li><li><code>win.hide()</code> 隐藏窗口</li><li><code>win.maximize()</code> 最大化窗口</li><li><code>win.minimize()</code> 最小化窗口</li><li><code>win.restore()</code> 从最小化窗口恢复</li></ul><h3 id="tray" tabindex="-1"><code>Tray</code> <a class="header-anchor" href="#tray" aria-label="Permalink to &quot;\`Tray\`&quot;">​</a></h3><p>添加图标和上下文菜单到系统通知区。</p><p>可以把它理解为不同系统的任务栏里的图标组件吧。</p><h3 id="menu" tabindex="-1"><code>Menu</code> <a class="header-anchor" href="#menu" aria-label="Permalink to &quot;\`Menu\`&quot;">​</a></h3><p>创建原生应用菜单和上下文菜单。</p><p>主要分两种：</p><ul><li>第一种是 <code>app</code> 的菜单。对于 <code>macOS</code> 来说就是顶部栏左侧区域的菜单项。对于 <code>windows</code> 而言就是一个窗口的标题栏下方的菜单区。</li><li>第二种是类似于右键菜单的菜单。</li></ul><h2 id="进程通信" tabindex="-1">进程通信 <a class="header-anchor" href="#进程通信" aria-label="Permalink to &quot;进程通信&quot;">​</a></h2><p><strong>通信方式：</strong></p>`,17),$=s("h3",{id:"ipcmain-与-ipcrenderer",tabindex:"-1"},[s("code",null,"ipcMain"),n(" 与 "),s("code",null,"ipcRenderer"),n(),s("a",{class:"header-anchor",href:"#ipcmain-与-ipcrenderer","aria-label":'Permalink to "`ipcMain` 与 `ipcRenderer`"'},"​")],-1),L=s("code",null,"(web 页面)",-1),Q=p(`<div class="tip custom-block"><p class="custom-block-title">TIP</p><p>发送消息时，事件名称为 <code>channel</code> 。</p><p>回复同步信息时，需要设置 <code>event.returnValue</code>。</p><p>可以使用 <code>event.reply(...)</code>将异步消息发送回发送者</p></div><p>官网上的 🌰：</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 在主进程中.</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> ipcMain </span><span style="color:#89DDFF;">}</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">require</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">electron</span><span style="color:#89DDFF;">&#39;</span><span style="color:#BABED8;">)</span></span>
<span class="line"><span style="color:#BABED8;">ipcMain</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">on</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">asynchronous-message</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">event</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#BABED8;font-style:italic;">arg</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#BABED8;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">arg</span><span style="color:#F07178;">) </span><span style="color:#676E95;font-style:italic;">// prints &quot;ping&quot;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#BABED8;">event</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">reply</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">asynchronous-reply</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">pong</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#BABED8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">ipcMain</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">on</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">synchronous-message</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">event</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#BABED8;font-style:italic;">arg</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#BABED8;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">arg</span><span style="color:#F07178;">) </span><span style="color:#676E95;font-style:italic;">// prints &quot;ping&quot;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#BABED8;">event</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">returnValue</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">pong</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#BABED8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//在渲染器进程 (网页) 中。</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> ipcRenderer </span><span style="color:#89DDFF;">}</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">require</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">electron</span><span style="color:#89DDFF;">&#39;</span><span style="color:#BABED8;">)</span></span>
<span class="line"><span style="color:#BABED8;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#BABED8;">(ipcRenderer</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">sendSync</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">synchronous-message</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">ping</span><span style="color:#89DDFF;">&#39;</span><span style="color:#BABED8;">)) </span><span style="color:#676E95;font-style:italic;">// prints &quot;pong&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">ipcRenderer</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">on</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">asynchronous-reply</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">event</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#BABED8;font-style:italic;">arg</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#BABED8;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">arg</span><span style="color:#F07178;">) </span><span style="color:#676E95;font-style:italic;">// prints &quot;pong&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#BABED8;">)</span></span>
<span class="line"><span style="color:#BABED8;">ipcRenderer</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">send</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">asynchronous-message</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">ping</span><span style="color:#89DDFF;">&#39;</span><span style="color:#BABED8;">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p>其中 <code>ipcMain</code> 只有监听来自 <code>ipcRenderer</code> 的某个事件后才能返回给 <code>ipcRenderer</code> 值。而 <code>ipcRenderer</code> 既可以收，也可以发。</p><p>那么问题就来了，如何让 <code>ipcMain</code> 主动发送消息呢？或者说让 <code>main</code> 进程主动发送消息给 <code>ipcRenderer</code>。</p><p>首先要明确的是，<code>ipcMain</code> 无法主动发消息给 <code>ipcRenderer</code>。因为 <code>ipcMain</code> 只有<code>.on()</code>方法没有<code>.send()</code>的方法。所以只能用 <code>webContents</code>。</p><h3 id="webcontents" tabindex="-1"><code>webContents</code> <a class="header-anchor" href="#webcontents" aria-label="Permalink to &quot;\`webContents\`&quot;">​</a></h3><p><code>webContents</code> 其实是 <code>BrowserWindow</code> 实例的一个属性。也就是如果我们需要在 <code>main</code> 进程里给某个窗口某个页面发送消息，则必须通过 <code>win</code>。</p><p><code>webContents.send()</code>方法来发送。</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// In main process</span></span>
<span class="line"><span style="color:#C792EA;">let</span><span style="color:#BABED8;"> win </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">new</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">BrowserWindow</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">{...}</span><span style="color:#BABED8;">)</span></span>
<span class="line"><span style="color:#BABED8;">win</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">webContents</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">send</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">img-files</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> imgs)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// In renderer process</span></span>
<span class="line"><span style="color:#BABED8;">ipcRenderer</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">on</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">img-files</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">event</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#BABED8;font-style:italic;">files</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">files</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#BABED8;">)</span></span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>必须指定要发送的窗口，才能将信息准确送达。</p>`,11);function U(H,J,G,K,X,Y){const l=c("font");return r(),t("div",null,[F,y,D,s("ul",null,[s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("app")]),_:1})])]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("BrowerWindow 与 BrowerView")]),_:1})])]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("ipcMain")]),_:1})])]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("Menu")]),_:1})])]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("Tray")]),_:1})])])]),d,u,B,s("ul",null,[s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("will-finish-launching")]),_:1})]),n(" 在应用完成基本启动进程之后触发，在 "),b,n(" 和 "),A,n(" 中, "),E,n("  事件与 "),m,n(" 事件是相同的。")]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[_]),_:1})]),n(" 当 "),w,n(" 完成初始化后触发，绝大部分情况下，你必须在 "),h,n(" 事件句柄中处理所有事务。")]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("window-all-closed")]),_:1})]),n(" 所有窗口都关闭的时候触发，在 "),f,n(" 和 "),g,n(" 里，所有窗口都退出的时候通常是应用退出的时候，如果你没有监听此事件并且所有窗口都关闭了，默认的行为是控制退出程序；但如果你监听了此事件，你可以控制是否退出程序。 如果用户按下了  "),C,n("，或者开发者调用了  "),v,n("，"),q,n(" 会首先关闭所有的窗口然后触发  "),T,n("  事件，在这种情况下 "),k,n("  事件不会被触发。")]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("before-quit")]),_:1})]),n(" 退出应用之前的时候触发")]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("will-quit")]),_:1})]),n(" 即将退出应用的时候触发")]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("quit")]),_:1})]),n(" 应用退出的时候触发")])]),x,s("ul",null,[s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("active")]),_:1})]),P,n("当应用处于激活状态时")]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("browser-window-created")]),_:1})]),n(" 当一个 "),S,n(" 被创建的时候")]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("browser-window-focus")]),_:1})]),n(" 当一个 "),R,n(" 处于激活状态的时候")])]),V,s("ul",null,[s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("app.quit()")]),_:1})]),n(" 用于退出应用")]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("app.getPath(name)")]),_:1})]),n(" 用于获取一些系统目录，对于存放应用的配置文件等很有用")]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("app.focus()")]),_:1})]),n(" 用于激活应用，不同系统激活逻辑不一样。")])]),W,s("p",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("BrowerView：")]),_:1})]),n(" 创建和控制视图，"),M,n("  被用来让  "),I,n("  嵌入更多的 web 内容，它就像一个子窗口，除了它的位置是相对于父窗口，这意味着可以替代 "),j,n(" 标签。")]),s("p",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("BrowerWindow：")]),_:1})]),n(" 创建和控制浏览器窗口。")]),N,O,s("p",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("webwiew 的作用是用来嵌入外来不受信任资源，实现外来资源与本地资源的隔离，保证嵌入资源的安全性。")]),_:1})])]),z,s("ul",null,[s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("ipcMain 与 ipcRenderer")]),_:1})])]),s("li",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("webContent")]),_:1})])])]),$,s("p",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("ipcRenderer: ")]),_:1})]),n(" 可以使用它提供的一些方法从渲染进程 "),L,n(" 发送同步或异步的消息到主进程。 也可以接收主进程回复的消息。")]),s("p",null,[s("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[n("ipcMain：")]),_:1})]),n(" 从主进程到渲染进程的异步通信。")]),Q])}const ns=e(i,[["render",U]]);export{ss as __pageData,ns as default};