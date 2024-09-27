# 虚拟 DOM

## 什么是`React`的`虚拟DOM`

- `React.createElement` 函数所返回的就是一个`虚拟 DOM`

- `虚拟 DOM` 就是一个描述真实 `DOM` 的纯 `JS` 对象

> 举个 🌰

```js
let element = (
  <h1>
    Hello, <span style={{ color: 'red' }}>world</span>!
  </h1>
)

console.log(element)
```

![virtual_dom](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/virtual_dom.jpg)

## 为什么要有`虚拟DOM`

::: tip 前提

**没有任何框架可以比纯手动的优化 `DOM` 操作更快，因为框架的 `DOM` 操作层需要应对任何上层 `API` 可能产生的操作，它的实现必须是普适的。**

:::

由浏览器的渲染流水线可知，`DOM`操作是一个昂贵的操作，它是一个很复杂的数据结构，因此产生了`虚拟DOM`。`虚拟DOM`是对`真实DOM`的映射，`React`通过新旧虚拟`DOM`对比，得到需要更新的部分，实现数据的增量更新。

- 借助 `虚拟DOM`，带来了跨平台的能力，可以一套代码多端运行
- `虚拟DOM` 使得开发者能够更专注于应用的业务逻辑，而无需过多关注手动 `DOM` 操作
- 使用 `虚拟DOM`，能够有效避免真实 `DOM` 数频繁更新，减少多次引起重绘与回流，提高性能

## 虚拟 DOM 的工作原理

- `创建 虚拟DOM`：当应用初始化时或数据发生变化时，会创建或更新 `虚拟DOM`

- `Diff 算法`：在生成新的 `虚拟DOM` 之后，会与之前的 `虚拟DOM`进行比较，找出两者之间的差异。这个过程称为 `Diff算法`，它能够高效地计算出需要更新的最小操作集合

- `更新原生 DOM`：通过 `Diff算法` 的结果，确定了哪些部分需要更新，然后将这些变化应用到`真实 DOM`上。这个阶段真正将变化应用到 `DOM` 上，通常使用最小的 `DOM` 操作来实现更新，从而减少了 `DOM` 操作的开销。

::: tip `DOM-DIFF`

- `React` 的 `DOM-DIFF` 原理解析 可以看这里

  - [<u>单节点的 DOM-DIFF 🚀</u>](/rsource/react/singleNode-dom-diff.md)

  - [<u>多节点的 DOM-DIFF 🚀</u>](/rsource/react/multiNode-dom-diff.md)

:::
