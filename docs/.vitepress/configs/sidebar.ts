import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/base/': [
    {
      text: 'JavaScript 基础知识',
      collapsed: false,
      items: [
        { text: '数据类型', link: '/base/javaScript/dataType' },
        { text: '执行上下文', link: '/base/javaScript/context' },
        { text: '作用域', link: '/base/javaScript/scope' },
        { text: '闭包', link: '/base/javaScript/closure' },
        { text: '函数式编程', link: '/base/javaScript/function' },
      ],
    },
    {
      text: 'ES6 常用知识点',
      collapsed: false,
      items: [
        { text: '箭头函数', link: '/base/es6/arrowFn' },
        {
          text: 'promise',
          collapsed: false,
          items: [
            { text: 'promise原理', link: '/base/es6/promise/promise' },
            { text: 'promise方法', link: '/base/es6/promise/promiseMethod' },
          ],
        },
        { text: 'async&await', link: '/base/es6/async' },
      ],
    },
    {
      text: 'TypeScript',
      collapsed: false,
      items: [
        { text: '介绍', link: '/base/typescript/ts' },
        { text: '类型', link: '/base/typescript/type' },
        { text: '函数', link: '/base/typescript/function' },
        { text: '类', link: '/base/typescript/class' },
        { text: '接口', link: '/base/typescript/interface' },
        { text: '泛型', link: '/base/typescript/generic' },
        { text: '兼容性', link: '/base/typescript/compatibility' },
        { text: '装饰器', link: '/base/typescript/decorator' },
        { text: '工具类型', link: '/base/typescript/built-in' },
        { text: '模块', link: '/base/typescript/module' },
        // { text: '类型体操', collapsed: false, items: [] },
      ],
    },
    {
      text: 'Html/Css',
      collapsed: false,
      items: [{ text: 'Css知识点', link: '/base/css/css' }],
    },
    {
      text: '浏览器相关知识',
      collapsed: false,
      items: [
        { text: '浏览器渲染原理', link: '/base/browser/browser' },
        { text: '浏览器事件循环机制', link: '/base/browser/eventloop' },
        { text: '浏览器缓存', link: '/base/browser/cache' },
        { text: '浏览器V8引擎', link: '/base/browser/engine' },
        { text: '浏览器性能优化', link: '/base/browser/performance' },
        { text: '浏览器相关API', link: '/base/browser/api' },
        { text: 'chrome扩展开发', link: '/base/browser/chrome' },
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
    },
  ],

  '/node/': [
    {
      text: '规范与模块',
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
        { text: 'jsx', link: '/frame/react/base/jsx' },
        { text: '虚拟DOM', link: '/frame/react/base/virtualDOM' },
        { text: '受控与非受控', link: '/frame/react/base/control' },
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
    {
      text: 'React-18.2源码',
      collapsed: false,
      items: [{ text: 'Fiber', link: 'rsource/react/fiber' }],
    },
  ],
  '/vsource/': [
    {
      text: 'Vue3源码',
      collapsed: false,
      items: [{ text: 'Effect', link: 'vsource/vue/effect' }],
    },
  ],
  '/capital/': [
    {
      text: '构建工具',
      collapsed: false,
      items: [
        // {
        //   text: 'webpack',
        //   collapsed: false,
        //   items: [{ text: '基础', link: '/work/construct/webpack/base' }],
        // },
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
          collapsed: false,
          items: [
            { text: 'Docker基础', link: '/capital/deploy/docker/base' },
            // { text: 'Docker常用命令', link: '/capital/deploy/docker/command' },
          ],
        },
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
