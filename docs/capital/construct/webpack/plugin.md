# Plugin

`Plugin` 插件是 `Webpack` 的扩展，执行范围更广，可以在构建过程的各个阶段进行操作和自定义功能。`Webpack` 会提供一些 `API` 和 生命周期钩子方便开发者触达到除了编译之外的一些环节来执行操作。

## 常见的一些 `Plugin`

- [<u>`HtmlWebpackPlugin`</u>](https://webpack.docschina.org/plugins/html-webpack-plugin/)：自动生成 `HTML` 文件，并自动引入打包后的 `JS` 文件

- [<u>`MiniCssExtractPlugin`</u>](https://webpack.docschina.org/plugins/mini-css-extract-plugin#root)：将 `CSS` 提取为独立的文件，为每个包含 `CSS` 的 `JS` 文件创建一个 `CSS` 文件，支持按需加载和缓存。

- [<u>`HotModuleReplacementPlugin`</u>](https://webpack.docschina.org/plugins/hot-module-replacement-plugin/#root)：模块热替换`（HMR）`，实现页面实时预览更新。

- [<u>`TerserWebpackPlugin`</u>](https://webpack.docschina.org/plugins/terser-webpack-plugin/#root)：压缩 `JS`。

- [<u>`OptimizeCSSAssetsPlugin`</u>](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)：优化和压缩 `CSS` 。

- [<u>`BundleAnalyzerPlugin`</u>](https://www.npmjs.com/package/webpack-bundle-analyzer)：可视化 `Webpack` 输出文件的大小，帮助分析和优化。

- [<u>image-webpack-loader</u>](https://www.npmjs.com/package/image-webpack-loader)：压缩图片体积。

- [<u>`SplitChunksPlugin`</u>](https://webpack.docschina.org/plugins/split-chunks-plugin/)：代码分割

::: info 相关资料

- [<u>Webpack | Plugin</u>](https://webpack.docschina.org/plugins/)

:::

## 怎么编写一个 `Plugin`

`webpack` 插件由以下组成：

- 一个 `JavaScript` 命名函数或 `JavaScript` 类。

- 在插件函数的 `prototype` 上定义一个 `apply` 方法。

- 指定一个绑定到 `webpack` 自身的[<u>事件钩子</u>](https://webpack.docschina.org/api/compiler-hooks/)。

- 处理 `webpack` 内部实例的特定数据。

- 功能完成后调用 `webpack` 提供的回调

> 举个 🌰

```js
class MyPlugin {
  // 在插件函数的 prototype 上定义一个 `apply` 方法，以 compiler 为参数。
  apply(compiler) {
    // 指定一个挂载到 webpack 自身的事件钩子。
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      console.log('这里表示了资源的单次构建的 `compilation` 对象：', compilation)

      // 用 webpack 提供的插件 API 处理构建过程
      compilation.addModule(/* ... */)

      callback()
    })
  }
}
```

::: info 相关资料

- [<u>Webpack | 自定义 Plugin</u>](https://webpack.docschina.org/contribute/writing-a-plugin/)

:::
