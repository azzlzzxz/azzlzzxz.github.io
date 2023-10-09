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
      { text: '网络相关知识', link: '/base/network/restFul' },
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
    text: '源码阅读',
    items: [
      {
        text: '框架',
        items: [
          { text: 'React', link: '/react/source/fiber' },
          { text: 'Vue', link: '/vue/source/effect' },
        ],
      },
      {
        text: '第三方库',
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
    items: [{ text: '实用工具', link: '/work/utility/ni' }],
  },
]
