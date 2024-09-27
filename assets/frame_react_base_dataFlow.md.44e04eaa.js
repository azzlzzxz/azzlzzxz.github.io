import{_ as n,o as a,c as l,N as p}from"./chunks/framework.5873b8fd.js";const D=JSON.parse('{"title":"数据在 React 组件中的流动","description":"","frontmatter":{},"headers":[],"relativePath":"frame/react/base/dataFlow.md","lastUpdated":1727446215000}'),o={name:"frame/react/base/dataFlow.md"};function e(t,s,r,c,F,i){return a(),l("div",null,s[0]||(s[0]=[p(`<h1 id="数据在-react-组件中的流动" tabindex="-1">数据在 React 组件中的流动 <a class="header-anchor" href="#数据在-react-组件中的流动" aria-label="Permalink to &quot;数据在 React 组件中的流动&quot;">​</a></h1><p><code>React</code> 是数据驱动视图，即视图会随着数据的变化而变化</p><h2 id="react的设计思想" tabindex="-1"><code>React</code>的设计思想 <a class="header-anchor" href="#react的设计思想" aria-label="Permalink to &quot;\`React\`的设计思想&quot;">​</a></h2><ul><li>组件化</li></ul><p>每个组件都符合开放封闭原则，封闭是针对渲染工作流来说的，指的是组件内部的状态都由自身维护，只处理内部的渲染逻辑。开放是针对组件通信来说的，指的是不同组件可以通过<code>props</code>（单项数据流）进行数据交互。</p><ul><li>数据驱动视图</li></ul><p>通过上面这个公式得出，如果要渲染界面，不应该直接操作<code>DOM</code>，而是通过修改数据，数据驱动视图更新。</p><ul><li>虚拟<code>DOM</code></li></ul><p>由浏览器的渲染流水线可知，<code>DOM</code>操作是一个昂贵的操作，很耗性能，因此产生了虚拟<code>DOM</code>。虚拟<code>DOM</code>是对真实<code>DOM</code>的映射，React 通过新旧虚拟<code>DOM</code>对比，得到需要更新的部分，实现数据的增量更新</p><h2 id="单向数据流" tabindex="-1">单向数据流 <a class="header-anchor" href="#单向数据流" aria-label="Permalink to &quot;单向数据流&quot;">​</a></h2><p><strong><code>React</code> 是基于 <code>props</code> 的单向数据流</strong>，指<strong>当前组件的 <code>state</code> 以 <code>props</code> 的形式流动时，只能流向组件树中比自己层级更低的组件</strong>，即流动是单向的，只能从父组件流向子组件，而不能从子组件流向父组件</p><h2 id="state-和-props-的区别" tabindex="-1"><code>state</code> 和 <code>props</code> 的区别 <a class="header-anchor" href="#state-和-props-的区别" aria-label="Permalink to &quot;\`state\` 和 \`props\` 的区别&quot;">​</a></h2><blockquote><p><code>state</code> 和 <code>props</code> 都是组件的数据来源，但它们有以下区别：</p></blockquote><ul><li><code>state</code> 是可变的，是组件内部维护的一组用于反映组件 <code>UI</code> 变化的状态集合</li><li><code>props</code> 是组件的只读属性，组件内部不能直接修改，只能通过外部传入新的 <code>props</code> 来更新组件</li></ul><p>即：<strong><code>state</code> 是组件对内的接口，<code>props</code> 是组件对外的接口</strong></p><h2 id="组件通信" tabindex="-1">组件通信 <a class="header-anchor" href="#组件通信" aria-label="Permalink to &quot;组件通信&quot;">​</a></h2><p>在 <code>React</code> 中，组件之间的通信主要有以下几种：</p><ul><li>父组件向子组件通信</li><li>子组件向父组件通信</li><li>兄弟组件通信</li><li>父组件向后代组件通信</li><li>无关组件通信</li></ul><h3 id="父组件向子组件通信" tabindex="-1">父组件向子组件通信 <a class="header-anchor" href="#父组件向子组件通信" aria-label="Permalink to &quot;父组件向子组件通信&quot;">​</a></h3><p>利用 <code>React</code> 单向数据流通过 <code>props</code> 进行传递通信</p><div class="language-jsx line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 父组件</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">Father</span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Child</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">steinsGate</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 子组件</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">Child</span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">props</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;{</span><span style="color:#BABED8;">props</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">name</span><span style="color:#89DDFF;">}&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h3 id="子组件向父组件通信" tabindex="-1">子组件向父组件通信 <a class="header-anchor" href="#子组件向父组件通信" aria-label="Permalink to &quot;子组件向父组件通信&quot;">​</a></h3><p>通过 <code>props</code> 传递回调函数进行通信</p><blockquote><p>子组件通过调用父组件传递过来的回调函数来向父组件通信</p></blockquote><div class="language-jsx line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 子组件</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">Child</span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">props</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">button</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">onClick</span><span style="color:#89DDFF;">={()</span><span style="color:#BABED8;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#BABED8;"> props</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">onClick</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">我是子组件的数据</span><span style="color:#89DDFF;">&#39;</span><span style="color:#BABED8;">)</span><span style="color:#89DDFF;">}&gt;</span><span style="color:#BABED8;">传递数据给父组件</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">button</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 父组件</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">Father</span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">handleClick</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">data</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">data</span><span style="color:#F07178;">) </span><span style="color:#676E95;font-style:italic;">// 点击后会输出：我是子组件的数据</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Child</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">onClick</span><span style="color:#89DDFF;">={</span><span style="color:#BABED8;">handleClick</span><span style="color:#89DDFF;">} /&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="兄弟组件通信" tabindex="-1">兄弟组件通信 <a class="header-anchor" href="#兄弟组件通信" aria-label="Permalink to &quot;兄弟组件通信&quot;">​</a></h3><p>通过父组件中转数据的方式进行通信，即<strong>兄弟组件之间的通信需要将数据提升到它们的共同父组件中进行管理</strong></p><p><code>兄弟 1 → 兄弟 2</code> 会变成 <code>兄弟 1 → 父组件</code>（子父通信）和 <code>父组件 → 兄弟 2</code>（父子通信）</p><div class="language-jsx line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 兄弟组件</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">Brother1</span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">props</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;{</span><span style="color:#BABED8;">props</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">name</span><span style="color:#89DDFF;">}&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">Brother2</span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">props</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">button</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">onClick</span><span style="color:#89DDFF;">={()</span><span style="color:#BABED8;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#BABED8;"> props</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">onClick</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">azzlzzxz</span><span style="color:#89DDFF;">&#39;</span><span style="color:#BABED8;">)</span><span style="color:#89DDFF;">}&gt;</span><span style="color:#BABED8;">传递数据给兄弟组件</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">button</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 父组件</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">Father</span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">[</span><span style="color:#BABED8;">name</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">setName</span><span style="color:#89DDFF;">]</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">useState</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">steinsGate</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">handleClick</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">data</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">setName</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">data</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> (</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">&lt;&gt;</span></span>
<span class="line"><span style="color:#BABED8;">      </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Brother1</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">name</span><span style="color:#89DDFF;">={</span><span style="color:#BABED8;">name</span><span style="color:#89DDFF;">} /&gt;</span></span>
<span class="line"><span style="color:#BABED8;">      </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Brother2</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">onClick</span><span style="color:#89DDFF;">={</span><span style="color:#BABED8;">handleClick</span><span style="color:#89DDFF;">} /&gt;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#89DDFF;">&lt;/&gt;</span></span>
<span class="line"><span style="color:#F07178;">  )</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><h3 id="父组件向后代组件通信和无关组件通信" tabindex="-1">父组件向后代组件通信和无关组件通信 <a class="header-anchor" href="#父组件向后代组件通信和无关组件通信" aria-label="Permalink to &quot;父组件向后代组件通信和无关组件通信&quot;">​</a></h3><blockquote><p>父组件向后代组件通信不使用 <code>props</code> 传递数据，当层层传递 <code>props</code> 时会造成组件之间的耦合，不利于组件的复用，而且会造成组件之间的数据流动不可控</p></blockquote><p>常见的解决方案有以下几种：</p><ul><li>使用 <code>React</code> 的 <code>Context</code>(<a href="https://zh-hans.react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noreferrer"><u>React 官方文档 | 使用 Context 深层传递参数</u></a>) 进行通信</li><li>使用发布订阅模式进行通信 <ul><li><a href="https://github.com/medikoo/event-emitter" target="_blank" rel="noreferrer">event-emitter</a></li><li><a href="https://github.com/developit/mitt" target="_blank" rel="noreferrer">mitt</a></li></ul></li><li>使用第三方状态管理库进行通信 <ul><li><a href="https://docs.pmnd.rs/zustand/getting-started/introduction" target="_blank" rel="noreferrer">Zustand</a></li><li><a href="https://cn.redux.js.org" target="_blank" rel="noreferrer">Redux</a></li><li><a href="https://zh.mobx.js.org" target="_blank" rel="noreferrer">Mobx</a></li></ul></li></ul><p><strong>使用 <code>React</code> 的 <code>Context</code> 进行通信</strong></p><div class="language-jsx line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 创建 Context</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#BABED8;"> Context </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> React</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">createContext</span><span style="color:#BABED8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 子组件</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">Child</span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">name</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">useContext</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">Context</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;{</span><span style="color:#BABED8;">name</span><span style="color:#89DDFF;">}&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 父组件</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">Father</span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> (</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Context.Provider</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">value</span><span style="color:#89DDFF;">={{</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">steinsGate</span><span style="color:#89DDFF;">&#39;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">}}&gt;</span></span>
<span class="line"><span style="color:#BABED8;">      </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">Child</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#FFCB6B;">Context.Provider</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#F07178;">  )</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div>`,35)]))}const d=n(o,[["render",e]]);export{D as __pageData,d as default};
