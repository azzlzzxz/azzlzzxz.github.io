# Yarn

## 1.x（`classic`）

1. 使用扁平化依赖解决`npm1`、`npm2`的嵌套结构。

2. 采用了并行操作，支持并行安装多个依赖，提高安装速度。

3. 使用缓存机制将每个包缓存在磁盘上，在下一次安装这个包时，可以脱离网络实现从磁盘离线安装。

4. 发明了`lock`文件。

5. [<u>workspace</u>](https://yarnpkg.com/features/workspaces)

```shell
{
  "workspaces": [
    "packages/*"
  ]
}
```

## 2.x/3.x (berry [<u>PnP</u>](https://yarnpkg.com/features/pnp))

> Node 18+

```shell
# 切换yarn 版本
yarn set version berry
```

`PnP` 的具体工作原理是，作为把依赖从缓存拷贝到 `node_modules` 的替代方案，`Yarn` 会维护一张静态映射表

::: tip 该表中包含了以下信息

- 当前依赖树中包含了哪些依赖包的哪些版本
- 这些依赖包是如何互相关联的
- 这些依赖包在文件系统中的具体位置

:::

这个映射表在 `Yarn` 的 `PnP` 实现中对应项目目录中的 `.pnp.js` 文件

![yarn](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/yarn.png)

与 `pnpm` 不同，`pnpm` 使用内容可寻址存储，其中每个包中的每个文件都需要硬链接到其最终目标，`PnP` 加载程序通过其缓存路径直接引用包，从而消除了很多复杂性。

[幽灵依赖保护](https://yarnpkg.com/features/pnp#ghost-dependencies-protection)

由于 `Yarn` 保留了所有包及其依赖项的列表，因此它可以防止在解析过程中访问未说明的依赖项。

`nodeLinker`安装模式：[<u>install mode</u>](https://yarnpkg.com/features/linkers)

1. `nodeLinker: pnp`

2. `nodeLinker: pnpm`
3. `nodeLinker: node_modules`

```shell
yarnPath: .yarn/releases/yarn-3.6.3.cjs
cacheFolder: "./.yarn/cache"
nodeLinker: "pnpm"
npmRegistryServer: "https://registry.yarnpkg.com"
```

::: tip PnP 不适用的

- 已经开始使用大量依赖项，因此可能会列出大量依赖项的软件包数量成比例地增加

- 它们可能被锁定在各自软件包的旧版本上，因此更有可能包含幽灵依赖项

- 自己的脚本可能会无意中依赖于某些实现细节或幽灵依赖项

:::

::: info 相关资料

- [<u>Yarn 官网</u>](https://yarnpkg.com/)

:::
