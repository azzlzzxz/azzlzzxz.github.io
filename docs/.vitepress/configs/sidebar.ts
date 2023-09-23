import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/base/': [
    {
      text: 'ES6 常用知识点',
      collapsed: false,
      items: [
        {
          text: 'promise',
          collapsed: false,
          items: [
            { text: 'promise原理', link: '/base/promise/promise' },
            { text: 'promise方法', link: '/base/promise/promiseMethod' },
            { text: 'async', link: '/base/promise/async' },
          ],
        },
      ],
    },
    {
      text: 'TypeScript',
      collapsed: false,
      items: [
        { text: '介绍', link: '/base/typescript/ts' },
        { text: '常用类型', link: '/base/typescript/type' },
        { text: '接口', link: '/base/typescript/interface' },
        // { text: '泛型', link: '/base/typescript/generic' },
        // { text: '类', link: '/base/typescript/class' },
        // { text: '模块', link: '/base/typescript/module' },
        // { text: '装饰器', link: '/base/typescript/decorator' },
        // { text: '类型兼容性', link: '/base/typescript/compatibility' },
        // { text: '类型体操', collapsed: false, items: [] },
      ],
    },
    {
      text: '浏览器相关知识',
      collapsed: false,
      items: [
        { text: '浏览器渲染原理', link: '/base/browser/browser' },
        { text: 'EventLoop', link: '/base/browser/eventLoop' },
        { text: '浏览器缓存', link: '/base/browser/cache' },
        // { text: '浏览器优化', link: '/base/browser/performance' },
        // { text: '浏览器相关API', link: '/base/browser/api' },
      ],
    },
  ],

  '/node/': [
    {
      text: '规范与模块',
      collapsed: false,
      items: [{ text: 'CommonJs规范', link: '/node/norm/commonJs' }],
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
      text: '包管理工具',
      collapsed: false,
      items: [
        { text: 'npm 常用命令', link: '/node/npm/npm' },
        { text: 'npm', link: '/node/npm/source' },
        { text: 'pnpm', link: '/node/npm/pnpm' },
      ],
    },
    // {
    //   text: '框架',
    // },
    // {
    //   text: 'Express',
    // },
    // {
    //   text: 'Koa',
    // },
    // {
    //   text: 'Nest',
    // },
  ],
  '/react/': [
    {
      text: 'React基础',
      collapsed: false,
      items: [
        { text: 'jsx', link: '/react/base/jsx' },
        { text: '虚拟DOM', link: '/react/base/virtualDOM' },
      ],
    },
    {
      text: 'React-18.2源码',
      collapsed: false,
      items: [{ text: 'Fiber', link: '/react/source/fiber' }],
    },
  ],
  '/vue/': [
    {
      text: 'Vue源码',
      collapsed: false,
      items: [{ text: 'Effect', link: '/vue/source/effect' }],
    },
  ],
  '/work/': [
    {
      text: '数据结构与算法',
      collapsed: false,
      items: [
        { text: '链表', link: '/work/structure/linkList' },
        { text: '树', link: '/work/structure/tree' },
        // { text: '栈', link: '/work/structure/stack' },
        // { text: '队列', link: '/work/structure/queue' },
        // { text: '图', link: '/work/structure/graph' },
        // { text: '排序', link: '/work/structure/sort' },
        // { text: '查找', link: '/work/structure/search' },
      ],
    },
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
  ],
}
