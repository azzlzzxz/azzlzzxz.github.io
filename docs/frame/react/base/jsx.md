# JSX

## `Jsx` 是什么

[<u>`React Jsx API`</u>](https://zh-hans.legacy.reactjs.org/docs/introducing-jsx.html)，`JSX` 是一个 JavaScript 的语法扩展，结构类似 `XML`。

## 为什么要使用`Jsx`

使用 `Jsx` 可以让我们在 `JavaScript` 中编写类似 HTML 的代码，这样可以很好地描述 `UI` 应该呈现出它应有交互的本质形式。

## `Jsx` 是怎么变成真实 `DOM` 的

用户编写 `Jsx` 到生成真实 `DOM` 的流程：

![jsx](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/jsx.jpg)

::: tip

`Jsx` 语法的本质就是 `React.createElement` 方法

:::

## react18 对于 `Jsx` 的变化

在 `React17` `以前，babel` 转换是老的写法

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

`React18` 的新写法，使用 `Jsx` 方法代替了 `React.createElement`

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

## 为什么使用自定义组件必须以大写字母开头

在 `JSX` 中，如果标签名以小写字母开头，那么它会被当作一个字符串而不是一个组件来处理，而如果标签名以大写字母开头，那么它会被当作一个组件来处理。

这是因为在 `JSX` 中，`React` 会将以小写字母开头的标签名视为 `HTML` 原生标签，而将以大写字母开头的标签名视为自定义组件。为了避免混淆，`React` 自定义组件的标签名必须以大写字母开头

```jsx
/* 使用原生标签 */
<app>steins</app>
// 等价于
React.createElement('app', null, 'steins')

/* 使用自定义组件 */
<App>steins</App>
// 等价于
React.createElement(App, null, 'steins')
```
