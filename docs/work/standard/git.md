# Git 规范

> 使用 Git Flow 工作流进行分支管理

![git-flow](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/git-flow.png)

- `master` 主分支

  - 用于存放对外发布的稳定版本（不能直接在该分支上开发，只能从 `develop` 分支合并过来）

- `develop` 开发分支

  - 用于存放最新的开发版本（所有新功能都以该分支来创建自己的开发分支，该分支只做合并操作，不能直接在该分支上开发）

- `feature` 功能分支

  - 用于开发新功能（在 `develop` 上创建分支，以自己开发功能模块命名，功能测试正常后合并到 `develop` 分支）
  - `feature` 分支推荐命名规范：`feature`/日期-开发者-功能模块

- `release` 预发布分支

  - 用于当需要为发布新版做准备时（在 `develop` 上创建分支，以版本号命名，测试完成后合并到 master 和 develop）
  - `release` 分支推荐命名规范：`release`/版本号

## `commit` 提交规范

> `git commit message` 的格式

```sh
<type>(<scope>): <subject>

<body>

<footer>
```

- `type`（必填）：`commit` 的类型
- `scope`（选填）：`commit` 的影响范围
- `subject`（必填）：`commit` 信息的简短描述（50 字以内）
- `body`（选填）：`commit` 信息的具体描述
- `footer`（选填）：重大变化（`Breaking Change`）和需要关闭的`Issue`

### `commit` 常用的 `type`

|    type    | 含义                                   |
| :--------: | :------------------------------------- |
|   _feat_   | 新功能                                 |
|   _fix_    | 修复 bug                               |
|   _docs_   | 文档类改动                             |
|  _style_   | 代码格式改动，同理适用于业务样式调整   |
| _refactor_ | 重构（即不是新增功能，也不是修复 bug） |
|   _perf_   | 性能优化相关                           |
|  _types_   | `TypeScript` 类型相关的改动            |
|   _test_   | 单元测试、e2e 测试                     |
|  _build_   | 构建工具或者依赖项的改动               |
|    _ci_    | 修改项目持续集成流程                   |
|  _chore_   | 其他类型的提交                         |
|  _revert_  | 恢复或还原相关提交                     |

## 参考

- [Conventional Commits | GitHub](https://www.conventionalcommits.org/zh-hans/v1.0.0/)
