# 源码文件结构

## 顶层目录

```sh
├── fixtures        # 为代码贡献者准备的小型项目，用于测试 React 的功能
├── packages        # React 的源码目录
└── scripts         # 各种工具链的脚本，如 git、jest、eslint 等
```

## `packages` 目录

### 核心包

```sh
├── react                         # React 核心包
├── react-reconciler              # React 的协调器
├── react-is                      # 判断 React 元素的工具包
├── scheduler                     # 调度器
└── shared                        # 公共方法和变量
```

### `Renderer`包

```sh
├── react-dom                     # Web 渲染器
├── react-art                     # Canvas 和 SVG 的渲染器
├── react-native-renderer         # React Native 的渲染器
├── react-noop-renderer           # 用来调试 Fiber 的渲染器
└── react-test-renderer           # 用于单元测试 React 组件的渲染器，不依赖于浏览器环境
```

### 工具包

```sh
├── dom-event-testing-library     # 用于 DOM 事件的单元测试包
├── eslint-plugin-react-hooks     # React Hooks 的 ESLint 插件
├── jest-mock-scheduler           # 用于测试 scheduler 的 Jest 工具包
├── jest-react                    # 用于测试 React 的 Jest 工具包
├── react-devtools                # 用于调试非浏览器环境下的 React 应用
├── react-devtools-core           # React 开发者工具的核心
├── react-devtools-extensions     # React 开发者工具浏览器扩展的源代码
├── react-devtools-inline         # React 开发者工具的内联实现（嵌入到基于浏览器的工具 CodeSandbox、StackBlitz 和 Replay）
├── react-devtools-shared         # React 开发者工具的公共方法和变量
├── react-devtools-shell          # 用于测试 react-devtools-inline 和 react-devtools-shared 包的工具
├── react-devtools-timeline       # React 并发模式的分析器
├── react-refresh                 # React 热更新的工具包
├── use-subscription              # 用于订阅外部数据源的 Hook
└── use-sync-external-store       # 同步外部存储的 Hook
```

### 实验性的包

```sh
# 实验性的包
├── react-cache                   # React 的缓存实现
├── react-client                  # 创建自定义流的实验包
├── react-debug-tools             # 用于调试 React 渲染器的实验包
├── react-fetch                   # 用于数据请求的实验包
├── react-fs
├── react-interactions
├── react-pg
├── react-server                  # 创建自定义 React 流服务器渲染器的实验包
├── react-server-dom-relay
├── react-server-dom-webpack
├── react-server-native-relay
└─ react-suspense-test-utils     # React Suspense 组件的测试工具包
```

::: info 相关资料

- [<u>源码目录结构</u>](https://react.iamkasong.com/preparation/file.html#%E9%A1%B6%E5%B1%82%E7%9B%AE%E5%BD%95)

- [<u>React 18.2.0 源码地址</u>](https://github.com/facebook/react/tree/v18.2.0)

:::
