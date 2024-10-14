import{_ as s,o as e,c,N as o}from"./chunks/framework.2f525601.js";const k=JSON.parse('{"title":"Rspack","description":"","frontmatter":{},"headers":[],"relativePath":"capital/construct/rspack/base.md","lastUpdated":1728897686000}'),l={name:"capital/construct/rspack/base.md"};function p(t,a,n,d,r,i){return e(),c("div",null,a[0]||(a[0]=[o('<h1 id="rspack" tabindex="-1">Rspack <a class="header-anchor" href="#rspack" aria-label="Permalink to &quot;Rspack&quot;">​</a></h1><p><code>Rspack</code> 是一个基于 <code>Rust</code> 编写的高性能<code>Javascript</code>打包工具，它提供对<code>webpack</code>生态，良好的兼容性，能够无缝切换<code>webpack</code>，提供快速构建</p><p><strong>你只要会<code>Webpack</code>，切<code>Rspack</code>就无压力</strong></p><p>并且相比于<code>webpack</code>，<code>rspack</code>在冷启动和<code>build</code>构建时间都远远的快于<code>webpack</code></p><table><thead><tr><th>3 次构建</th><th>rsapck</th><th>webapck</th></tr></thead><tbody><tr><td>build（3 次平均时间）</td><td>2.8s</td><td>35s</td></tr><tr><td>dev（3 次平均时间）</td><td>3.4s</td><td>40s（有缓存的情况 3s 左右）</td></tr><tr><td>size</td><td>1.75m</td><td>1.45m</td></tr></tbody></table><div class="info custom-block"><p class="custom-block-title">相关资料</p><ul><li><a href="https://rspack.dev/zh/" target="_blank" rel="noreferrer"><u>Rspack 官网</u></a></li></ul></div><h2 id="迁移-webpack" tabindex="-1">迁移 <code>webpack</code> <a class="header-anchor" href="#迁移-webpack" aria-label="Permalink to &quot;迁移 `webpack`&quot;">​</a></h2><h3 id="修改-package-json" tabindex="-1">修改 <code>package.json</code> <a class="header-anchor" href="#修改-package-json" aria-label="Permalink to &quot;修改 `package.json`&quot;">​</a></h3><div class="language-json line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight has-highlighted-lines"><code><span class="line"><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">scripts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#BABED8;">-   </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">serve</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">webpack serve</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>\n<span class="line"><span style="color:#BABED8;">-   </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">build</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">webpack build</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>\n<span class="line highlighted"><span style="color:#BABED8;">+   </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">serve</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">rspack serve</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>\n<span class="line highlighted"><span style="color:#BABED8;">+   </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">build</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">rspack build</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>\n<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h3 id="修改配置" tabindex="-1">修改配置 <a class="header-anchor" href="#修改配置" aria-label="Permalink to &quot;修改配置&quot;">​</a></h3><p>将 <code>webpack.config.js</code> 文件重命名为 <code>rspack.config.js</code></p><div class="info custom-block"><p class="custom-block-title">相关资料</p><ul><li><a href="https://rspack.dev/zh/guide/migration/webpack#%E4%BF%AE%E6%94%B9%E9%85%8D%E7%BD%AE" target="_blank" rel="noreferrer"><u>迁移 webpack</u></a></li></ul></div><h2 id="迁移-cra-或-craco" tabindex="-1">迁移 <code>CRA</code> 或 <code>CRACO</code> <a class="header-anchor" href="#迁移-cra-或-craco" aria-label="Permalink to &quot;迁移 `CRA` 或 `CRACO`&quot;">​</a></h2><div class="info custom-block"><p class="custom-block-title">相关资料</p><ul><li><a href="https://rsbuild.dev/zh/guide/migration/cra" target="_blank" rel="noreferrer"><u>迁移 CRA</u></a></li></ul></div><h2 id="rspack为什么快" tabindex="-1"><code>Rspack</code>为什么快 <a class="header-anchor" href="#rspack为什么快" aria-label="Permalink to &quot;`Rspack`为什么快&quot;">​</a></h2><p><code>Rspack</code> 的核心是使用 <code>Rust</code> 语言编写的，<code>Rust</code> 可以更好地管理内存、并行执行任务和避免垃圾回收带来的性能损耗。这使得 <code>Rspack</code> 在处理大量文件和复杂构建任务时，能够更快地完成编译和打包</p><h3 id="多线程并行编译" tabindex="-1">多线程并行编译 <a class="header-anchor" href="#多线程并行编译" aria-label="Permalink to &quot;多线程并行编译&quot;">​</a></h3><p>利用 <code>Rust</code> 的并发能力，支持多线程并行编译。相比之下，<code>Webpack</code> 由于使用 <code>JavaScript</code> 引擎（单线程运行的 <code>V8</code>），虽然也可以通过一些插件（如 <code>Thread-loader</code>）实现并行任务，但效率和 <code>Rust</code> 原生多线程相比仍有较大差距。</p><div class="tip custom-block"><p class="custom-block-title">并行执行任务</p><ul><li><code>Rspack</code> 通过多线程能够同时执行多个构建任务，如解析模块、执行 <code>Tree Shaking</code>、压缩代码等，极大地提升了编译和打包的速度，尤其是在多核 <code>CPU</code> 机器上表现尤为明显。</li></ul></div><h3 id="增量构建和缓存优化" tabindex="-1">增量构建和缓存优化 <a class="header-anchor" href="#增量构建和缓存优化" aria-label="Permalink to &quot;增量构建和缓存优化&quot;">​</a></h3><div class="tip custom-block"><p class="custom-block-title">文件系统缓存</p><ul><li><p><code>Rspack</code> 使用了高效的文件系统缓存机制，这意味着在多次构建相同项目时，它能够跳过已经编译好的模块，极大地提升了二次构建的速度。</p></li><li><p><code>Webpack</code> 的缓存机制虽然经过多次改进，但由于使用 <code>JavaScript</code> 实现，性能不如 <code>Rust</code> 实现的缓存系统。</p></li></ul></div><div class="tip custom-block"><p class="custom-block-title">增量构建</p><ul><li><p><code>Rspack</code> 的增量构建机制更加，当项目中的某些文件发生变化时，它只会重新构建受影响的部分。</p></li><li><p><code>Webpack</code> 在重新编译时，会有大量不必要的模块。</p></li></ul><p>这使得 <code>Rspack</code> 在日常开发的构建速度（如热更新和局部编译）上速度更快。</p></div><h3 id="更快的冷启动" tabindex="-1">更快的冷启动 <a class="header-anchor" href="#更快的冷启动" aria-label="Permalink to &quot;更快的冷启动&quot;">​</a></h3><ul><li><p>模块缓存优化：即使是初次启动，<code>Rspack</code> 也能够通过模块缓存机制减少模块解析时间。</p></li><li><p>多线程预加载：在冷启动过程中，<code>Rspack</code> 能够同时并行处理多个模块的加载和解析任务，这大大加快了启动速度。</p></li><li><p><code>Rust</code> 的高效执行：<code>Rust</code> 语言的高效性能和 <code>Webpack</code> 使用 <code>JavaScript</code> 语言本身的运行时性能差异，使得 <code>Rspack</code> 能够在执行过程中更快地完成启动。</p></li></ul><div class="tip custom-block"><p class="custom-block-title">Rspack 的缓存机制相较 Webpack 的优势</p><ul><li>缓存命中率更高</li></ul><p>由于 <code>Rspack</code> 采用的是 模块级别缓存 和 模块哈希比对，使得缓存命中率相比 <code>Webpack</code> 更高。即使是 <code>Webpack 5</code> 引入了持久缓存机制，但 <code>Rspack</code> 的模块缓存更快。</p><ul><li>初次启动也能加速</li></ul><p>通常缓存机制在首次构建时不会起作用，而 <code>Rspack</code> 的设计使得即使是第一次启动，也能通过模块缓存加速后续的构建过程。这是由于 <code>Rspack</code> 的缓存系统并不需要前置的构建，而是动态地在首次构建中就开始缓存</p><ul><li>更快的冷启动</li></ul><p><code>Rspack</code> 能够大幅减少模块解析和依赖图的构建时间，这使得冷启动速度明显提升。</p></div><p>::: Rspack 模块缓存的运作流程</p><ul><li><p>解析模块：当 <code>Rspack</code> 解析一个模块时，会计算其内容的哈希值，并生成模块的依赖图。这个过程会被缓存起来，以便在下一次构建时可以复用。</p></li><li><p>生成缓存：在模块被成功解析和打包后，<code>Rspack</code> 会将这些模块的内容（包括模块代码和依赖关系）存储到内存或磁盘中，作为后续构建的缓存。</p></li><li><p>哈希比对：在后续构建时，<code>Rspack</code> 会为每个模块重新计算哈希值，与缓存中的哈希值进行比对。如果哈希值相同，表示模块内容未变，直接使用缓存；如果哈希值不同，才重新解析该模块。</p></li><li><p>模块替换和依赖更新：在增量构建过程中，<code>Rspack</code> 只会替换那些发生变化的模块，同时更新相应的依赖图，未变动的部分不会重新打包或解析。</p></li></ul><p>:::</p><h3 id="更快的打包构建" tabindex="-1">更快的打包构建 <a class="header-anchor" href="#更快的打包构建" aria-label="Permalink to &quot;更快的打包构建&quot;">​</a></h3><ul><li>并发处理</li></ul><p><code>Rspack</code> 是用 <code>Rust</code> 编写的，提供并发处理能力，充分利用多核 <code>CPU</code> 的能力。在构建过程中的许多任务可以并行执行，例如模块解析、代码优化等，<code>Rspack</code> 能够大幅提升并行任务的处理效率。</p><ul><li><p>基于高效缓存的增量编译</p></li><li><p>并行化和异步化的 <code>I/O</code> 处理，减少了文件系统操作的时间。</p></li></ul>',32)]))}const b=s(l,[["render",p]]);export{k as __pageData,b as default};
