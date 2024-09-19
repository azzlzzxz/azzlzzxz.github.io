# 函数组件

接下来我们来看看 `React` 是如何渲染函数组件的

## `main.jsx`

```jsx
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

function FunctionComponent() {
  return (
    <h1 id="container">
      hello<span style={{ color: 'red' }}>world</span>
    </h1>
  )
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

## `Fiber Tag`

每种`虚拟DOM`都会对应自己的`fiber tag类型`，函数组件对应的`tag`是`2`

```js
// ReactWorkTag.js

export const FunctionComponent = 0 // 函数组件
export const IndeterminateComponent = 2 // 不确定组件类型
export const HostRoot = 3 // 容器根节点
export const HostComponent = 5 // 原生节点 div span
export const HostText = 6 // 纯文本节点
```

## `beginWork`

在`performUnitOfWork`函数执行工作单元构建`fiber树`时，`beginWork`会根据`workInProgress.tag`的值来执行不同的逻辑

```js {17-18}
// ReactFiberBeginWork.js

import {
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
  FunctionComponent,
} from './ReactWorkTags'

/**
 * 目标是根据新虚拟DOM构建新的fiber子链表 child .sibling
 * @param {*} current 老fiber
 * @param {*} workInProgress 新的fiber h1
 * @returns
 */
export function beginWork(current, workInProgress) {
  switch (workInProgress.tag) {
    // 因为在React里组件其实有两种，一种是函数组件，一种是类组件，但是它们都是都是函数
    case IndeterminateComponent:
      return mountIndeterminateComponent(current, workInProgress, workInProgress.type)
    case HostRoot:
      return updateHostRoot(current, workInProgress)
    case HostComponent:
      return updateHostComponent(current, workInProgress)
    case HostText:
      return null
    default:
      return null
  }
}
```

## `mountIndeterminateComponent` 挂载函数组件

```js
// ReactFiberBeginWork.js

/**
 * 挂载函数组件
 * @param {*} current  老fiber
 * @param {*} workInProgress 新的fiber
 * @param {*} Component 组件类型，也就是函数组件的定义
 */
export function mountIndeterminateComponent(current, workInProgress, Component) {
  const props = workInProgress.pendingProps
  const value = renderWithHooks(current, workInProgress, Component, props)
  workInProgress.tag = FunctionComponent
  reconcileChildren(current, workInProgress, value)
  return workInProgress.child
}
```

## `renderWithHooks`

`renderWithHooks`方法详细内容请看 hooks 篇

```js
/**
 * 渲染函数组件
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @param {*} Component 组件定义
 * @param {*} props 组件属性
 * @returns 虚拟DOM或者说React元素
 */
export function renderWithHooks(current, workInProgress, Component, props) {
  // ... 省略大量代码

  const children = Component(props)
  return children
}
```

## `commitMutationEffectsOnFiber`

```js {10}
// ReactFiberCommitWork.js

/**
 * 遍历fiber树，执行fiber上的副作用 变更操作
 * @param {*} finishedWork fiber节点
 * @param {*} root 根节点
 */
export function commitMutationEffectsOnFiber(finishedWork, root) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case HostRoot:
    case HostComponent:
    case HostText: {
      //先遍历它们的子节点，处理它们的子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork)
      //再处理自己身上的副作用
      commitReconciliationEffects(finishedWork)
      break
    }
    default:
      break
  }
}
```

这样就能展示函数组件了，这里只是简单的实现了一个函数组件，更复杂的实现请看 hook 篇

![functionComponent_show](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/functionComponent_show.jpg)
