import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/base/': [
    {
      text: 'JavaScript 基础知识',
      collapsed: false,
      items: [
        { text: '数据类型', link: '/base/javaScript/dataType' },
        { text: '闭包', link: '/base/javaScript/closure' },
        { text: '原型 & 原型链', link: '/base/javaScript/prototype' },
        { text: '继承', link: '/base/javaScript/extends' },
        { text: 'this', link: '/base/javaScript/this' },
        { text: '执行上下文', link: '/base/javaScript/context' },
        { text: '作用域', link: '/base/javaScript/scope' },
        { text: '函数式编程', link: '/base/javaScript/function' },
      ],
    },
    {
      text: 'ES6 知识点',
      collapsed: false,
      items: [
        { text: 'let & const', link: '/base/es6/let&const' },
        { text: 'Set & Map', link: '/base/es6/Set&Map' },
        { text: 'Proxy & Reflect', link: '/base/es6/Proxy&Reflect' },
        { text: '模版字符串', link: '/base/es6/template' },
        { text: '解构赋值', link: '/base/es6/deconstruction' },
        { text: '箭头函数', link: '/base/es6/arrowFn' },
        { text: '函数、数组、对象、运算符扩展', link: '/base/es6/extension' },
        { text: 'Class', link: '/base/es6/class' },
        {
          text: 'promise',
          collapsed: false,
          items: [
            { text: 'promise原理', link: '/base/es6/promise/promise' },
            { text: 'promise方法', link: '/base/es6/promise/promiseMethod' },
          ],
        },
        { text: 'async&await', link: '/base/es6/async' },
        { text: '模块化', link: '/base/es6/esModule' },
      ],
    },
    {
      text: 'TypeScript',
      collapsed: false,
      items: [
        {
          text: '基础知识',
          collapsed: false,
          items: [
            { text: '类型', link: '/base/typescript/type' },
            { text: '函数', link: '/base/typescript/function' },
            { text: '类', link: '/base/typescript/class' },
            { text: '接口', link: '/base/typescript/interface' },
            { text: '泛型', link: '/base/typescript/generic' },
            { text: '兼容性', link: '/base/typescript/compatibility' },
            { text: '装饰器', link: '/base/typescript/decorator' },
            { text: '模块', link: '/base/typescript/module' },
          ],
        },
        { text: '工具类型', link: '/base/typescript/built-in' },
        { text: '编译配置', link: '/base/typescript/tsconfig' },
        // { text: '类型体操', collapsed: false, items: [] },
      ],
    },
    {
      text: 'HTML / CSS',
      collapsed: false,
      items: [
        { text: 'HTML 基础知识', link: '/base/html/base' },
        { text: 'CSS 基础知识', link: '/base/css/base' },
      ],
    },
    {
      text: '浏览器相关知识',
      collapsed: false,
      items: [
        { text: '浏览器渲染原理', link: '/base/browser/browser' },
        { text: '浏览器事件循环机制', link: '/base/browser/eventloop' },
        { text: '浏览器跨域', link: '/base/browser/cross' },
        { text: '浏览器缓存', link: '/base/browser/cache' },
        { text: '浏览器V8引擎', link: '/base/browser/engine' },
        { text: '浏览器性能优化', link: '/base/browser/performance' },
        { text: '浏览器相关API', link: '/base/browser/api' },
      ],
    },
    {
      text: '网络相关知识',
      collapsed: false,
      items: [
        { text: 'RestFulAPI', link: '/base/network/restFulAPI' },
        { text: 'http状态码', link: '/base/network/httpStatus' },
        { text: 'http协议', link: '/base/network/httpAgreement' },
        { text: 'OSI&TCP', link: '/base/network/tcp' },
        { text: 'WebSocket', link: '/base/network/webSocket' },
      ],
    },
    {
      text: '数据结构与算法',
      collapsed: false,
      items: [
        {
          text: '数据结构',
          collapsed: false,
          items: [
            { text: '链表', link: '/base/structure/linkList' },
            { text: '树', link: '/base/structure/tree' },
            // { text: '栈', link: '/base/structure/stack' },
            // { text: '队列', link: '/base/structure/queue' },
            // { text: '图', link: '/base/structure/graph' },
          ],
        },
        // { text: '排序', link: '/base/structure/sort' },
        // { text: '查找', link: '/base/structure/search' },
      ],
    },
    {
      text: '编程题',
      link: '/base/coding/',
    },
  ],

  '/node/': [
    {
      text: '模块化&规范',
      collapsed: false,
      items: [{ text: 'CommonJs规范', link: '/node/norm/commonJs' }],
    },
    {
      text: '包管理工具',
      collapsed: false,
      items: [
        { text: 'npm 常用命令', link: '/node/npm/npm' },
        { text: 'npm', link: '/node/npm/source' },
        { text: 'pnpm', link: '/node/npm/pnpm' },
      ],
    },
    {
      text: 'Node基础',
      collapsed: false,
      items: [
        { text: 'Node介绍', link: '/node/base/base' },
        { text: 'EventLoop', link: '/node/base/eventLoop' },
        {
          text: 'Node_API',
          collapsed: false,
          items: [
            { text: '基础API', link: '/node/base/global' },
            { text: 'Events', link: '/node/base/event' },
            { text: 'Buffer', link: '/node/base/buffer' },
            { text: 'FS', link: '/node/base/fs' },
            { text: 'Stream', link: '/node/base/stream' },
            { text: 'Http', link: '/node/base/http' },
            { text: 'Cookie', link: '/node/base/cookie' },
            { text: 'JWT', link: '/node/base/jwt' },
          ],
        },
      ],
    },
    {
      text: 'Nest',
      collapsed: false,
      items: [
        { text: '基础知识', link: '/node/nest/base' },
        { text: 'IOC', link: '/node/nest/ioc' },
        { text: 'AOP', link: '/node/nest/aop' },
      ],
    },
    // {
    //   text: 'Express',
    // },
    // {
    //   text: 'Koa',
    // },
  ],
  '/frame/react/': [
    {
      text: 'React',
      collapsed: false,
      items: [
        { text: 'JSX', link: '/frame/react/base/jsx' },
        { text: '虚拟DOM', link: '/frame/react/base/virtualDOM' },
        { text: '数据在 React 组件中的流动', link: '/frame/react/base/dataFlow' },
        { text: '受控与非受控', link: '/frame/react/base/control' },
        { text: 'Hooks', link: '/frame/react/base/hooks' },
        { text: 'HOC', link: '/frame/react/base/hoc' },
      ],
    },
    {
      text: '工具',
      collapsed: false,
      items: [{ text: 'Zustand', link: '/frame/react/tool/zustand' }],
    },
    {
      text: '应用',
      collapsed: false,
      items: [
        { text: 'react 实现国际化', link: '/frame/react/application/i18n' },
        // { text: 'react-flow 画流程图', link: '' },
      ],
    },
  ],
  '/frame/react-native/': [
    {
      text: 'ReactNative',
      collapsed: false,
      items: [
        { text: '环境配置', link: '/frame/react-native/init' },
        { text: '项目搭建', link: '/frame/react-native/project' },
        { text: '集成个推', link: '/frame/react-native/getui' },
      ],
    },
  ],
  '/frame/electron/': [
    {
      text: 'Electron',
      items: [
        { text: 'electron概念', link: '/frame/electron/introduce' },
        { text: 'electron进程', link: '/frame/electron/process' },
        { text: 'electron简单应用', link: '/frame/electron/apply' },
      ],
    },
  ],
  '/rsource/': [
    { text: 'React 18 的新特性', link: '/rsource/newFeature' },
    {
      text: 'React-18.2 源码解析',
      collapsed: false,
      items: [
        { text: '源码文件结构', link: '/rsource/react/file' },
        { text: '前置知识', link: '/rsource/react/preknowledge' },
        { text: 'JSX', link: '/rsource/react/jsx' },
        { text: 'Fiber', link: '/rsource/react/introduce' },
        {
          text: '渲染流程',
          collapsed: false,
          items: [
            {
              text: '初始化阶段',
              items: [
                { text: 'FiberRootNode & HostRootFiber', link: '/rsource/react/create_fiberRoot' },
                { text: '更新队列', link: '/rsource/react/updateQueue' },
              ],
            },
            {
              text: 'render 阶段',
              items: [
                { text: 'scheduleUpdateOnFiber', link: '/rsource/react/scheduleUpdateOnFiber' },
                { text: 'beginWork', link: '/rsource/react/beginWork' },
                { text: 'completeWork', link: '/rsource/react/completeWork' },
              ],
            },
            {
              text: 'commit 阶段',
              items: [{ text: 'commitRoot', link: '/rsource/react/commitRoot' }],
            },
          ],
        },
        {
          text: '合成事件',
          link: '/rsource/react/event',
        },
        {
          text: '函数组件',
          link: '/rsource/react/functionComponent',
        },
        {
          text: 'Hooks',
          collapsed: false,
          items: [
            { text: 'useReducer', link: '/rsource/react/useReducer' },
            { text: 'useState', link: '/rsource/react/useState' },
            { text: 'useEffect', link: '/rsource/react/useEffect' },
            { text: 'useLayoutEffect', link: '/rsource/react/useLayoutEffect' },
            { text: 'useRef', link: '/rsource/react/useRef' },
          ],
        },
        {
          text: 'DOM-DIFF',
          collapsed: false,
          items: [
            { text: '单节点的DOM-DIFF', link: '/rsource/react/singleNode-dom-diff' },
            { text: '多节点的DOM-DIFF', link: '/rsource/react/multiNode-dom-diff' },
          ],
        },
        { text: '任务调度', link: '/rsource/react/schedule' },
        { text: 'Lane模型', link: '/rsource/react/lane' },
      ],
    },
  ],
  // '/vsource/': [
  //   {
  //     text: 'Vue3源码',
  //     collapsed: false,
  //     items: [{ text: 'Effect', link: 'vsource/vue/effect' }],
  //   },
  // ],
  '/capital/': [
    {
      text: '工程化',
      items: [{ text: 'Monorepo', link: '/capital/engineering/monorepo' }],
    },
    {
      text: '构建工具',
      collapsed: false,
      items: [
        {
          text: 'webpack',
          collapsed: false,
          items: [
            { text: '基本概念', link: '/capital/construct/webpack/base' },
            { text: 'Loader', link: '/capital/construct/webpack/loader' },
            { text: 'Plugin', link: '/capital/construct/webpack/plugin' },
            { text: 'SourceMap', link: '/capital/construct/webpack/sourceMap' },
            { text: '优化', link: '/capital/construct/webpack/optimize' },
          ],
        },
        {
          text: 'Rspack',
          link: '/capital/construct/rspack/base',
        },
        {
          text: 'Vite',
          link: '/capital/construct/vite/base',
        },
      ],
    },
    {
      text: '部署',
      collapsed: false,
      items: [
        {
          text: '前端发布策略',
          link: '/capital/deploy/release.md',
        },
        {
          text: 'Docker',
          link: '/capital/deploy/docker/base',
        },
      ],
    },
    {
      text: '插件开发',
      collapsed: false,
      items: [
        { text: 'ESLint 插件', link: '/capital/plugins/eslint' },
        { text: 'Chrome 扩展插件', link: '/capital/plugins/chrome' },
        // { text: 'Webpack 插件', link: '/capital/plugins/webpack' },
        { text: 'Vite 扩展插件', link: '/capital/plugins/vite' },
      ],
    },
  ],
  '/work/': [
    {
      text: '编程规范',
      collapsed: false,
      items: [
        { text: '代码规范', link: '/work/standard/code' },
        { text: '命名规范', link: '/work/standard/name' },
        { text: 'Git规范', link: '/work/standard/git' },
        { text: '工程规范', link: '/work/standard/project' },
      ],
    },
    {
      text: 'Git',
      collapsed: false,
      items: [
        { text: 'Git常用命令', link: '/work/git/command' },
        { text: 'Git浅析', link: '/work/git/principle' },
        { text: 'Git 常用', link: '/work/git/method' },
      ],
    },
    {
      text: '实用工具',
      collapsed: false,
      items: [
        { text: 'ni包管理器工具', link: '/work/utility/ni' },
        { text: 'node版本管理', link: '/work/utility/nvm' },
        { text: 'vscode配置', link: '/work/utility/vscode' },
        { text: 'zsh配置', link: '/work/utility/zsh' },
        { text: '图床搭建', link: '/work/utility/picgo' },
      ],
    },
    {
      text: '常用工具/方法',
      collapsed: false,
      items: [{ text: '常用正则', link: '/work/utils/regexp' }],
    },
    {
      text: '日常问题记录',
      collapsed: false,
      items: [
        { text: 'npm相关', link: '/work/question/npm' },
        { text: '日常', link: '/work/question/work' },
      ],
    },
    {
      text: '其他',
      collapsed: false,
      items: [{ text: '命令', link: '/work/command/command' }],
    },
  ],
  '/wx/': [
    {
      text: '企业微信',
      collapsed: false,
      items: [{ text: '企微侧边栏', link: '/wx/qw/side' }],
    },
  ],
}
