import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/base/': [
    {
      text: 'ES6 常用知识点',
      collapsed: false,
      items: [
        { text: 'promise原理', link: '/base/promise/promise' },
        { text: 'promise方法', link: '/base/promise/promiseMethod' },
        { text: 'async&await', link: '/base/promise/async' },
      ],
    },
    {
      text: '浏览器相关知识',
      collapsed: false,
      items: [{ text: '浏览器渲染原理', link: '/base/browser/browser' }],
    },
    // {
    //   text: 'TypeScript',
    //   link: '/fe/typescript/base',
    // },
  ],

  '/node/': [
    {
      text: '规范与模块',
      collapsed: false,
      items: [{ text: 'CommonJs规范', link: '/node/norm/commonJs' }],
    },
    {
      text: 'Node 相关',
      collapsed: false,
      items: [
        { text: 'npm 常用命令', link: '/node/npm/npm' },
        { text: 'npm', link: '/node/npm/source' },
        { text: 'pnpm', link: '/node/npm/pnpm' },
      ],
    },
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
      text: 'React源码',
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
}
