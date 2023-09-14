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
    // {
    //   text: 'TypeScript',
    //   link: '/fe/typescript/base',
    // },
  ],

  '/node/': [
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
}
