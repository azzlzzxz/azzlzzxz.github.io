import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '导航', link: '/nav', activeMatch: '^/nav' },
  {
    text: '前端知识',
    items: [
      { text: 'JavaScript 基础知识', link: '/base/javaScript/dataType' },
      { text: 'ES6 基础知识', link: '/base/es6/let&const' },
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
        ],
      },
      { text: '数据结构与算法', link: '/base/structure/linkList' },
      { text: '编程题', link: '/base/coding/' },
    ],
    activeMatch: '^/base',
  },
  {
    text: 'Node',
    items: [
      { text: '模块&规范', link: '/node/norm/commonJs' },
      { text: 'Node 相关知识', link: '/node/base/base' },
      { text: 'NPM 相关知识', link: '/node/npm/npm' },
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
          { text: 'React', link: '/frame/react/base/jsx' },
          { text: 'ReactNative', link: '/frame/react-native/init' },
          { text: 'Electron', link: '/frame/electron/introduce' },
        ],
      },
      {
        text: '源码',
        items: [
          { text: 'React18.2源码', link: '/rsource/react/fiber' },
          { text: 'Vue3源码', link: '/vsource/vue/effect' },
        ],
      },
      {
        text: '第三方库源码解析',
        items: [
          { text: 'React-Window', link: 'https://github.com/azzlzzxz/react-window' },
          { text: 'React-Dnd', link: 'https://github.com/azzlzzxz/react-dnd' },
        ],
      },
    ],
  },
  {
    text: '基建',
    items: [
      { text: '构建', link: '/capital/construct/webpack/base' },
      { text: '部署', link: '/capital/deploy/release' },
      { text: '插件开发', link: '/capital/plugins/eslint' },
    ],
  },
  {
    text: '工作',
    items: [
      { text: '编程规范', link: '/work/standard/code' },
      { text: 'Git', link: '/work/git/command' },
      {
        items: [
          { text: '实用工具/配置', link: '/work/utility/ni' },
          { text: '常用工具/方法', link: '/work/utils/regexp' },
        ],
      },
      { text: '日常问题记录', link: '/work/question/npm' },
      { text: '其他', link: '/work/command/command' },
      { text: '微信相关', link: '/wx/qw/side' },
    ],
  },
]
