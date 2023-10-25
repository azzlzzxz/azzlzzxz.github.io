import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.a5035e6c.js";const y=JSON.parse('{"title":"ni","description":"","frontmatter":{},"headers":[],"relativePath":"work/utility/ni.md","lastUpdated":1698212980000}'),e={name:"work/utility/ni.md"},p=l(`<h1 id="ni" tabindex="-1">ni <a class="header-anchor" href="#ni" aria-label="Permalink to &quot;ni&quot;">​</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p><strong><a href="https://github.com/antfu/ni#ni" target="_blank" rel="noreferrer">ni</a></strong> 根据你的项目使用对应的包管理工具。</p><p>支持：npm · yarn · pnpm · bun</p></div><h2 id="全局安装" tabindex="-1">全局安装 <a class="header-anchor" href="#全局安装" aria-label="Permalink to &quot;全局安装&quot;">​</a></h2><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#BABED8;"> </span><span style="color:#C3E88D;">i</span><span style="color:#BABED8;"> </span><span style="color:#C3E88D;">-g</span><span style="color:#BABED8;"> </span><span style="color:#C3E88D;">@antfu/ni</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="ni-1" tabindex="-1">ni <a class="header-anchor" href="#ni-1" aria-label="Permalink to &quot;ni&quot;">​</a></h2><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">ni</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># npm install</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn install</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># pnpm install</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># bun install</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">ni</span><span style="color:#BABED8;"> </span><span style="color:#C3E88D;">vite</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># npm i vite</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn add vite</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># pnpm add vite</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># bun add vite</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">ni</span><span style="color:#BABED8;"> </span><span style="color:#C3E88D;">--frozen</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># npm ci</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn install --frozen-lockfile (Yarn 1)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn install --immutable (Yarn Berry)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># pnpm install --frozen-lockfile</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># bun install --no-save</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="nr-run" tabindex="-1">nr - run <a class="header-anchor" href="#nr-run" aria-label="Permalink to &quot;nr - run&quot;">​</a></h2><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">nr</span><span style="color:#BABED8;"> </span><span style="color:#C3E88D;">dev</span><span style="color:#BABED8;"> </span><span style="color:#C3E88D;">--port=3000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># npm run dev -- --port=3000</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn run dev --port=3000</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># pnpm run dev --port=3000</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># bun run dev --port=3000</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="nlx-download-execute" tabindex="-1">nlx - download &amp; execute <a class="header-anchor" href="#nlx-download-execute" aria-label="Permalink to &quot;nlx - download &amp; execute&quot;">​</a></h2><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">nlx</span><span style="color:#BABED8;"> </span><span style="color:#C3E88D;">vitest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># npx vitest</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn dlx vitest</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># pnpm dlx vitest</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># bunx vitest</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="nu-upgrade" tabindex="-1">nu - upgrade <a class="header-anchor" href="#nu-upgrade" aria-label="Permalink to &quot;nu - upgrade&quot;">​</a></h2><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">nu</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># npm upgrade</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn upgrade (Yarn 1)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn up (Yarn Berry)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># pnpm update</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># bun update</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">nu</span><span style="color:#BABED8;"> </span><span style="color:#C3E88D;">-i</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># (not available for npm &amp; bun)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn upgrade-interactive (Yarn 1)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn up -i (Yarn Berry)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># pnpm update -i</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="nun-uninstall" tabindex="-1">nun - uninstall <a class="header-anchor" href="#nun-uninstall" aria-label="Permalink to &quot;nun - uninstall&quot;">​</a></h2><div class="language-sh line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">nun</span><span style="color:#BABED8;"> </span><span style="color:#C3E88D;">webpack</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># npm uninstall webpack</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># yarn remove webpack</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># pnpm remove webpack</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># bun remove webpack</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>`,17),i=[p];function t(r,c,o,u,b,d){return n(),a("div",null,i)}const h=s(e,[["render",t]]);export{y as __pageData,h as default};