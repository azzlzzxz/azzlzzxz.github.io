import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '导航', link: '/nav', activeMatch: '^/nav' },
  {
    text: '前端知识',
    items: [
      { text: 'JavaScript 基础知识', link: '/base/javaScript/dataType' },
      { text: 'ES6 基础知识', link: '/base/es6/promise/promise' },
      { text: 'TypeScript', link: '/base/typescript/ts' },
      { text: '浏览器相关知识', link: '/base/browser/browser' },
      { text: '网络相关知识', link: '/base/network/restFulAPI' },
      { text: '数据结构与算法', link: '/base/structure/linkList' },
    ],
    activeMatch: '^/base',
  },
  {
    text: 'Node',
    items: [
      { text: 'Node基础', link: '/node/base/base' },
      { text: 'NPM', link: '/node/npm/npm' },
      { text: 'Nest', link: '/node/nest/base' },
    ],
    activeMatch: '^/node',
  },
  {
    text: '框架&源码',
    items: [
      {
        text: '框架',
        items: [{ text: 'React', link: '/frame/react/base/jsx' }],
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
    items: [{ text: '构建工具', link: '/capital/construct/webpack/base' }],
  },
  {
    text: 'work',
    items: [
      { text: '实用工具', link: '/work/utility/ni' },
      { text: '日常问题记录', link: '/work/question/npm' },
    ],
  },
]
