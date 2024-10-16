# Webpack 相关知识点

## `require`

在 `Webpack` 中，`require` 并不是像在 `Node.js` 中那样真正加载文件，而是经过编译时处理后的代码。

`Webpack` 是一个静态模块打包工具，它会在编译时对模块的 `require` 进行静态分析、处理和打包，而不是在运行时才加载模块。

> [<u>Node 的 require 可以看这里 🚀</u>](/docs/node/norm/commonJs.md#4require-命令)

编译时加载：`Webpack` 中的 `require` 是在编译时处理的，`Webpack` 会分析代码中的所有 `require` 调用，将依赖打包进一个或者多个 `bundle` 文件中。

> 举个 🌰

```js
// 引入一个 JavaScript 模块
const myModule = require('./myModule')

// 加载一个 CSS 文件
require('./styles.css')

// 动态加载模块（需要 Webpack 支持）
require.ensure(['./myModule'], function (require) {
  const myModule = require('./myModule')
  console.log(myModule)
})
```

::: tip 执行流程

- 静态分析：`Webpack` 在编译时会分析代码中的 `require` 调用，查找依赖模块。

- 打包：`Webpack` 会将这些模块打包到一个或者多个文件中。

- 加载时执行：打包后的 `require` 是一个函数调用，从已经打包好的模块集合中获取模块的导出内容。

:::

### `Webpack` 的 `require` 特殊处理

在 `Webpack` 中，`require` 可以用于更多类型的文件，不只是 `JavaScript` 模块。

- 可以通过 `require` 引入样式文件（`CSS`/`LESS`/`SASS`）。

- 可以通过 `require` 加载图片文件，并根据配置文件生成文件 `URL`。

- 可以动态地加载模块（使用 `require.ensure` 或 `import()`），从而支持按需加载。

`Webpack` 还对 `require` 进行了增强，可以配合 `Webpack` 的 `Loader` 系统，处理各种资源文件。

> 举个 🌰

```js
require('./styles.css') // 引入 CSS 文件，经过 Webpack CSS loader 处理
require('./image.png') // 加载图片文件，经过 Webpack file-loader 处理
```

### 区别

`Node.js` 中的 `require` 和 `Webpack` 中的 `require` 虽然在表面上看起来相似，因为它们都用于加载模块，但它们有着不同的目的和实现机制。

| 特性             | `Node.js` 中的 `require`                            | `Webpack` 中的 `require`                               |
| ---------------- | --------------------------------------------------- | ------------------------------------------------------ |
| **模块加载机制** | `CommonJS` 模块系统，运行时加载                     | 静态分析并打包，编译时处理依赖                         |
| **同步/异步**    | 同步加载模块，且阻塞主线程                          | 在打包时静态处理，支持异步代码分割（动态加载）         |
| **模块类型**     | 主要用于加载 `JavaScript` 文件和 `Node.js` 核心模块 | 支持多种资源类型（`JS`、`CSS`、图片等）                |
| **动态路径**     | 支持动态路径，如变量拼接                            | 不支持完全的动态路径，路径在编译时要明确               |
| **缓存机制**     | 模块会在第一次加载后被缓存                          | 模块在打包文件中静态管理                               |
| **打包**         | `Node.js` 中没有打包功能                            | `Webpack` 会将所有模块打包成一个或者多个 `bundle` 文件 |
| **代码优化**     | 运行时加载，不能自动删除未使用的代码                | `Webpack` 支持 `Tree Shaking` 等优化功能               |

**总结**

- **Node.js 中的 `require`**：是基于 `CommonJS` 的模块系统，用于在运行时加载模块，适合服务端 JavaScript 环境。

- **Webpack 中的 `require`**：是 `Webpack` 在编译阶段处理的，属于静态模块打包的方式，支持代码分割、资源加载等功能，适合前端项目。

两者都使用 `require` 关键字，但目的和机制是不同的。
