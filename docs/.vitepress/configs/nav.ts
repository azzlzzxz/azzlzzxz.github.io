import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '导航', link: '/nav', activeMatch: '^/nav' },
  {
    text: '基础知识',
    items: [
      { text: '浏览器相关知识', link: '/base/browser/browser' },
      { text: 'promise', link: '/base/promise/promise' },
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
      { text: 'Vue', link: '/vue/source/effect' },
      { text: 'React', link: '/react/source/fiber' },
    ],
  },
]
