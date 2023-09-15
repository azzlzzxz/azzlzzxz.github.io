# JSX

## jsx 是什么

[React Jsx API](https://zh-hans.legacy.reactjs.org/docs/introducing-jsx.html)，JSX 是一个 JavaScript 的语法扩展,JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。

## jsx 是怎么变成真实 DOM 的

用户编写 jsx 到生成真实 DOM 的流程：

![jsx](../../.vuepress/public/images/jsx.jpg)

## react18 对于 jsx 的变化

在 React17 以前，babel 转换是老的写法

```jsx
const babel = require('@babel/core')
const sourceCode = `
<h1>Hello, <span style={{color: 'red'}}>world</span>!</h1>`

const result = babel.transform(sourceCode, {
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'classic',
      },
    ],
  ],
})

console.log(result.code)
```

```jsx
/*#__PURE__*/ React.createElement(
  'h1',
  null,
  'Hello, ',
  /*#__PURE__*/ React.createElement(
    'span',
    {
      style: {
        color: 'red',
      },
    },
    'world',
  ),
  '!',
)
```

React18 的新写法，使用 jsx 方法代替了 React.createElement

```jsx
const babel = require('@babel/core')
const sourceCode = `
<h1>Hello, <span style={{color: 'red'}}>world</span>!</h1>`

const result = babel.transform(sourceCode, {
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
  ],
})

console.log(result.code)
```

```jsx
import { jsx as _jsx } from 'react/jsx-runtime'
import { jsxs as _jsxs } from 'react/jsx-runtime'
/*#__PURE__*/ _jsxs('h1', {
  children: [
    'Hello, ',
    /*#__PURE__*/ _jsx('span', {
      style: {
        color: 'red',
      },
      children: 'world',
    }),
    '!',
  ],
})
```
