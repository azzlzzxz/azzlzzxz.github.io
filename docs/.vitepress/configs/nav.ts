import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '导航', link: '/nav', activeMatch: '^/nav' },
  {
    text: '基础知识',
    items: [
      { text: 'promise', link: '/base/promise/promise' },
      { text: 'TS', link: '/base/typescript/ts' },
      { text: '浏览器相关知识', link: '/base/browser/browser' },
    ],
    activeMatch: '^/base',
  },
  {
    text: 'Node',
    items: [{ text: 'npm', link: '/node/npm/npm' }],
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
    text: 'work',
    items: [{ text: '数据结构与算法', link: '/work/structure/linkList' }],
  },
]
