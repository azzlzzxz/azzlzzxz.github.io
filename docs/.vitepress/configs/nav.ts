import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '导航', link: '/nav', activeMatch: '^/nav' },
  {
    text: '前端知识',
    items: [
      { text: 'JavaScript 基础知识', link: '/base/javaScript/dataType' },
      { text: 'ES6+ 基础知识', link: '/base/es6/let&const' },
      { text: 'HTML 基础知识', link: '/base/html/base' },
      { text: 'CSS 基础知识', link: '/base/css/base' },
      {
        items: [
          { text: 'TypeScript 基础知识', link: '/base/typescript/type' },
          { text: 'TypeScript 工具类型', link: '/base/typescript/built-in' },
        ],
      },
      {
        items: [
          { text: '浏览器相关知识', link: '/base/browser/browser' },
          { text: '网络相关知识', link: '/base/network/restFulAPI' },
          { text: '前端安全相关知识', link: '/base/secure/attack' },
        ],
      },
      { text: '数据结构与算法', link: '/base/structure/stack' },
      { text: '编程题', link: '/base/coding/' },
      {
        text: '其他',
        items: [{ text: '前端页面渲染方式', link: '/base/other/renderMode' }],
      },
    ],
    activeMatch: '^/base',
  },
  {
    text: 'Node',
    items: [
      { text: '模块&规范', link: '/node/norm/commonJs' },
      { text: 'Node 基础知识', link: '/node/base/base' },
      {
        text: '包管理工具',
        items: [
          { text: 'Npm 相关知识', link: '/node/npm/npm' },
          { text: 'Yarn 相关知识', link: '/node/npm/yarn' },
          { text: 'Pnpm 相关知识', link: '/node/npm/pnpm' },
        ],
      },
      { text: 'Nest 相关知识', link: '/node/nest/base' },
    ],
    activeMatch: '^/node',
  },
  {
    text: '框架&源码',
    items: [
      {
        text: '框架',
        items: [
          { text: 'React 相关知识', link: '/frame/react/base/jsx' },
          { text: 'ReactNative 相关知识', link: '/frame/react-native/init' },
          { text: 'Electron 相关知识', link: '/frame/electron/introduce' },
        ],
      },
      {
        text: '源码',
        items: [
          { text: 'React18.2 源码解析', link: '/rsource/react/file' },
          // { text: 'Vue3 源码解析', link: '/vsource/vue/effect' },
        ],
      },
      {
        text: '第三方库源码解析',
        items: [
          { text: 'React-Window 源码解析', link: 'https://github.com/azzlzzxz/react-window' },
          { text: 'React-Dnd 源码解析', link: 'https://github.com/azzlzzxz/react-dnd' },
        ],
      },
    ],
  },
  {
    text: 'Flow',
    items: [
      {
        text: '工程化',
        items: [{ text: 'Monorepo', link: '/capital/engineering/monorepo' }],
      },
      {
        text: '构建工具',
        items: [
          { text: 'Webpack', link: '/capital/construct/webpack/base' },
          { text: 'Rspack', link: '/capital/construct/rspack/base' },
          { text: 'Vite', link: '/capital/construct/vite/base' },
        ],
      },
      { text: '部署', link: '/capital/deploy/release' },
      {
        text: '插件开发',
        items: [
          { text: 'Eslint 插件开发', link: '/capital/plugins/eslint' },
          { text: 'Chrome 扩展插件开发', link: '/capital/plugins/chrome' },
          // { text: 'Vite 扩展插件', link: '/capital/plugins/vite' },
        ],
      },
    ],
  },
  {
    text: '工作',
    items: [
      { text: '编程规范', link: '/work/standard/code' },
      { text: 'Git 相关知识', link: '/work/git/command' },
      {
        items: [
          { text: '实用工具 / 配置', link: '/work/utility/ni' },
          { text: '常用工具 / 方法', link: '/work/utils/regexp' },
          { text: '常用库使用 / 配置', link: '/work/library/tailwind' },
        ],
      },
      {
        text: '微信相关',
        items: [
          { text: '微信小程序', link: '/wx/mini/optimize' },
          // { text: '微信公众号', link: '/wx/qw/side' },
          { text: '企业微信侧边栏', link: '/wx/qw/side' },
        ],
      },
      { text: '日常问题记录', link: '/work/question/npm' },
      { text: '其他', link: '/work/command/command' },
    ],
  },
]
