import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.a5035e6c.js";const e="/assets/virtual_dom.516278c3.jpg",_=JSON.parse('{"title":"虚拟 DOM","description":"","frontmatter":{},"headers":[],"relativePath":"react/base/virtualDOM.md","lastUpdated":1694829106000}'),p={name:"react/base/virtualDOM.md"},o=l(`<h1 id="虚拟-dom" tabindex="-1">虚拟 DOM <a class="header-anchor" href="#虚拟-dom" aria-label="Permalink to &quot;虚拟 DOM&quot;">​</a></h1><h2 id="虚拟-dom-是什么" tabindex="-1">虚拟 DOM 是什么 <a class="header-anchor" href="#虚拟-dom-是什么" aria-label="Permalink to &quot;虚拟 DOM 是什么&quot;">​</a></h2><ol><li>React.createElement 函数所返回的就是一个虚拟 DOM</li><li>虚拟 DOM 就是一个描述真实 DOM 的纯 JS 对象</li></ol><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">let</span><span style="color:#BABED8;"> element </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> (</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">h1</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#BABED8;">    Hello, </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">span</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">style</span><span style="color:#89DDFF;">={{</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">color</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">red</span><span style="color:#89DDFF;">&#39;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">}}&gt;</span><span style="color:#BABED8;">world</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">span</span><span style="color:#89DDFF;">&gt;</span><span style="color:#BABED8;">!</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">h1</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#BABED8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#BABED8;">(element)</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p><img src="`+e+'" alt="virtual_dom"></p>',5),t=[o];function r(c,i,D,y,d,F){return a(),n("div",null,t)}const B=s(p,[["render",r]]);export{_ as __pageData,B as default};
