# Monorepo

`Monorepo` 就是把多个项目放在一个仓库里面，相对立的是传统的 `MultiRepo` 模式，即每个项目对应一个单独的仓库来分散管理。

## `Monorepo` 和 `Multi-Repo`

`Monorepo` 和 `Multi-Repo` 是两种项目管理方式，其区别如下：

- `Monorepo` 是使用一个 `Git` 仓库管理多个项目

- `Multi-Repo` 是使用多个 `Git` 仓库管理多个项目，即一个项目对应一个仓库

`Monorepo` 的目录结构

一般 `Monorepo` 的目录如下所示，在 `packages` 存放多个子项目，并且每个子项目都有自己的`package.json`:

```sh
├── packages
|   ├── pkg1
|   |   ├── package.json
|   ├── pkg2
|   |   ├── package.json
├── package.json
```

`MultiRepo` 的目录结构

```sh
.
└─ multi-repo
    ├── .git
    ├── src
    │   └── index.js
    └── package.json
```

### `Monorepo` 优缺点

::: tip 优点

- 代码和资源复用 各个子包之间可以轻松地共享代码、工具类、组件等资源，有助于减少代码冗余，提高代码的复用性

- 一致的版本管理 可以统一管理所有项目的版本号，确保它们之间的兼容性，而不会出现不同仓库之间的版本冲突

- 集中的构建和部署 可以设置统一的构建和部署流程，减少了配置和管理的复杂性，这有助于确保所有项目的构建和部署方式保持一致

- 便于协作 促进了跨项目的协作，开发团队可以更容易地查看、修改和协作各个项目

- 更好的项目管理 通过单一代码仓库，项目管理变得更加直观。您可以使用版本控制系统的分支和标签来管理不同的项目或版本，从而简化了项目的追踪和管理

- 测试和集成更容易 更轻松地进行整体测试和集成测试，不需要跨多个仓库协调测试

:::

::: warning 缺点

- 仓库大小增长 随着项目的增多，可能会导致仓库变得庞大且难以管理从而需要额外的存储和维护成本

- 构建时间增加 由于存在多个项目，当构建整个项目时可能需要更长的时间，尤其是当只有部分项目发生更改时

- 依赖管理复杂性 多个项目依赖于相同的第三方库时可能会导致依赖管理的复杂性，在确保所有项目都使用相同的依赖版本需要额外的努力

- 分支管理复杂性 管理多个项目的分支和合并请求可能会变得复杂，需要谨慎的规划和流程

:::

## 搭建 `Monorepo` 项目

- 使用 `pnpm/npm/yarn` 的 `workspace` 功能

- 再搭配 `Monorepo` 管理工具

  - [<u>`pnpm`</u>](https://pnpm.io/)

  - [<u>`lerna`</u>](https://lerna.js.org/)

目前主流的方式是使用 `pnpm` 来做 `Monorepo`，其无须使用第三方工具就可以进行管理

### 安装 `pnpm`

```sh
npm install -g pnpm
```

### 配置 `pnpm` 工作空间

新建一个`pnpm-workspace.yaml`，这个文件定义了 工作空间的根目录，并能够使您从工作空间中包含 / 排除目录 。 默认情况下，包含所有子目录。

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

::: info 相关资料

- [<u>`pnpm-workspace`</u>](https://pnpm.io/zh/pnpm-workspace_yaml)

:::

目录结构

```sh
├── .git
├── packages
│   ├── packages1
│   │   ├── src
│   │   │   └── index.js
│   │   └── package.json
│   ├── packages2
│   │   ├── src
│   │   │   └── index.js
│   │   └── package.json
├── package.json
└── pnpm-workspace.yaml
```

### 安装依赖

在 `Monorepo` 项目中，依赖分为三种：

- 公共依赖 在主包根目录下安装的依赖，会被所有子包继承

```sh
pnpm install react -w

# 如果是开发依赖
pnpm install rollup -wD
```

- 私有依赖 在子包中安装的依赖，只会在当前子包中生效

```sh
pnpm add axios --filter packages1
```

- 模块之间的相互依赖

比如在 `packages1` 中引用 `packages2`

```sh
pnpm install packages2 -r --filter packages1
```

此时我们查看 `packages1` 的 `package.json`，可以看到 `dependencies` 字段中多了对 `packages2` 的引用，以 `workspace:` 开头，后面跟着具体的版本号

```json
{
  "name": "packages1",
  "version": "1.0.0",
  "dependencies": {
    "packages2": "workspace:^1.0.0",
    "axios": "^0.27.2"
  }
}
```

::: tip 命令

- `-D` 表示安装开发依赖

- `-w` 表示安装到工作空间（即根目录）

- `--filter(-F)` 表示安装到指定子包

- -r 表示对所有子包执行某个命令

:::

### 只允许`pnpm`

当在项目中使用 `pnpm` 时，如果不希望用户使用 `yarn` 或者 `npm` 安装依赖，可以将下面的这个 `preinstall` 脚本添加到工程根目录下的 `package.json`中

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

### `Release`工作流

`pnpm` 推荐了两个开源的版本控制工具：

- [<u>`changesets`</u>](https://github.com/changesets/changesets)：是一个管理 `CHANGELOG` 的工具，可以帮助我们自动生成 `CHANGELOG`

- [<u>`rush`</u>](https://rushjs.io/)：可以让 `JavaScript` 开发者更轻松地同时构建、发布多个 `NPM` 包

#### 配置`changesets`

```sh
# 安装 changesets
pnpm add -Dw @changesets/cli

# 初始化 changesets
pnpm changeset init
```

执行完初始化命令后，会在工程的根目录下生成 .changeset 目录，其中的 config.json 作为默认的 changeset 的配置文件

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "master",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

::: tip 参数说明

- `changelog`: `changelog` 生成方式

- `commit`: 不要让 `changeset` 在 `publish` 的时候帮我们做 `git add`

- `linked`: 配置哪些包要共享版本

- `access`: 公私有安全设定，内网建议 `restricted` ，开源使用 `public`

- `baseBranch`: 项目主分支

- `updateInternalDependencies`: 确保某包依赖的包发生 `upgrade`，该包也要发生 `version upgrade` 的衡量单位（量级）

- `ignore`: 不需要变动 `version` 的包

- `___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH`: 在每次 `version` 变动时一定无理由 `patch` 抬升依赖他的那些包的版本，防止陷入 `major` 优先的未更新问题

:::

#### 使用 `changeset`

为了便于统一管理所有包的发布过程，在工程根目录下的 `pacakge.json` 的 `scripts` 中增加如下几条脚本

1. 编译阶段，生成构建产物

```json
{
  "build": "pnpm --filter=xxx/* run build"
}
```

2. 清理构建产物和 `node_modules`

```json
{
  "clear": "rimraf 'packages/*/{lib,node_modules}' && rimraf node_modules"
}
```

3. 执行 `changeset`，开始交互式填写变更集，这个命令会将你的包全部列出来，然后选择你要更改发布的包

```sh
pnpm changeset
```

4. 执行 `changeset version`，更新版本和 `CHANGELOG`

```json
{
  "version-packages": "changeset version"
}
```

::: tip 注意

这里需要注意的是，版本的选择一共有三种类型，分别是 `patch`、`minor` 和 `major`，严格遵循 [<u>`semver`</u>](https://semver.org/) 规范。

:::

5. 发布到 `npm`

```sh
pnpm publish -r
```

::: tip 如果不想直接发 `release` 版本，而是想先发一个带 `tag` 的 `prerelease`版本呢(比如`beta`或者`rc`版本)？

1. 修改包的版本号

```json
{
  "name": "package1",
  "version": "1.0.1-beta.1"
}
```

然后运行

```sh
pnpm changeset publish --tag beta
```

注意发包的时候不要忘记加上 `--tag` 参数。

2. 通过 `changeset` 提供的 [<u>`Prereleases`</u>](https://github.com/changesets/changesets/blob/main/docs/prereleases.md) 模式，通过 `pre enter <tag>` 命令进入先进入 `pre` 模式。

常见的`tag`如下所示：

系统平台上就是发行候选版本。RC 版不会再加入新的功能了，主要着重于除错

| 名称                     | 功能                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| `alpha`                  | 是内部测试版，一般不向外部发布，会有很多 Bug，一般只有测试人员使用   |
| `beta`                   | 也是测试版，这个阶段的版本会一直加入新的功能。在`Alpha`版之后推出    |
| `rc(Release　Candidate)` | 统平台上就是发行候选版本。`RC`版不会再加入新的功能了，主要着重于除错 |

```sh
pnpm changeset pre enter beta
```

之后在此模式下的 `changeset publish` 均将默认走 `beta` 环境，下面在此模式下任意的进行你的开发

完成版本发布之后，退出 Prereleases 模式

```sh
pnpm changeset pre exit
```

:::
