# Rspack

`Rspack` 是一个基于 Rust 编写的高性能`Javascript`打包工具，它提供对`webpack`生态，良好的兼容性，能够无缝切换`webpack`，提供快速构建

**你只要会`Webpack`，切`Rspack`就无压力**

并且相比于`webpack`，`rspack`在冷启动和`build`构建时间都远远的快于`webpack`

| 3 次构建              | rsapck | webapck                     |
| --------------------- | ------ | --------------------------- |
| build（3 次平均时间） | 2.8s   | 35s                         |
| dev（3 次平均时间）   | 3.4s   | 40s（有缓存的情况 3s 左右） |
| size                  | 1.75m  | 1.45m                       |

::: info 相关资料

- [<u>Rspack 官网</u>](https://rspack.dev/zh/)

:::

## 迁移 webpack

### 修改 package.json

```json{5,6}
{
  "scripts": {
-   "serve": "webpack serve",
-   "build": "webpack build",
+   "serve": "rspack serve",
+   "build": "rspack build",
  }
}
```

### 修改配置

将 `webpack.config.js` 文件重命名为 `rspack.config.js`

::: info 相关资料

- [<u>迁移 webpack</u>](https://rspack.dev/zh/guide/migration/webpack#%E4%BF%AE%E6%94%B9%E9%85%8D%E7%BD%AE)

:::

## 迁移 CRA 或 CRACO

::: info 相关资料

- [<u>迁移 CRA</u>](https://rsbuild.dev/zh/guide/migration/cra)

:::
