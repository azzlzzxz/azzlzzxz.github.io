# FiberRootNode & HostRootFiber

以下面的代码举 🌰，来看看 `React` 是如何进行初始化流程的

```tsx
// main.tsx
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

let element = (
  <h1>
    Hello, <span style={{ color: 'red' }}>world</span>
  </h1>
)

const root = createRoot(document.getElementById('root'))
console.log(root)

root.render(element)
```

![root_node](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/root_node.png)

![fiber_root](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/Fiber_root.jpeg)

- `FiberRootNode` 本质上就是一个真实的 `DOM` 节点（也就是项目里的 `div #root`），是整个项目的根，`FiberRootNode` 的 `current` 属性，指向的是 `HostRootFiber`
- `HostRootFiber` 是 Fiber 树的根，`HostRootFiber` 的 `stateNode` 属性，指向的是 `FiberRootNode`

## `createRoot`

> 源码地址 [createRoot - react-dom/src/client/ReactDOMRoot.js](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-dom/src/client/ReactDOMRoot.js#L161)

```js
// ReactDOMRoot.js

import { createContainer } from 'react-reconciler/src/ReactFiberReconciler'

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}

export function createRoot(container) {
  // container ---> div #root
  const root = createContainer(container) // ---> 创建FiberRootNode

  return new ReactDOMRoot(root)
}
```

## `createContainer`(创建根容器)

```js
// ReactFiberReconciler.js

import { createFiberRoot } from './ReactFiberRoot'

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo)
}
```

## `createFiberRoot`(创建 `Fiber` 根)

> `FiberRootNode` 是真实的 `DOM` 节点（根节点）
>
> 源码地址 [createFiberRoot - react-reconciler/src/ReactFiberRoot.js](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberRoot.js#L144)

```js
// ReactFiberRoot.js

import { createHostRootFiber } from './ReactFiber'
import { initializeUpdateQueue } from './ReactFiberClassUpdateQueue'

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo // div #root
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo)

  // HostRoot指的是 根节点div #root 的FiberNode
  const uninitializedFiber = createHostRootFiber()

  // 根容器的current指向渲染好的根Fiber
  root.current = uninitializedFiber

  // 根节点的Fiber的stateNode（真实DOM）指向根节点FiberRootNode
  uninitializedFiber.stateNode = root

  return root
}
```

## `createHostRootFiber`(创建根 `Fiber`)

```js
// ReactFiber.js

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null)
}
```

### `FiberNode`(`Fiber` 节点)

> 源码地址 [function FiberNode | react-reconciler/src/ReactFiber.js](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactFiber.js#L136)

```js
// ReactFiber.js

import { HostRoot } from './ReactWorkTags'
import { NoFlags } from './ReactFiberFlags'

/**
 *
 * @param {*} tag  fiber 类型：函数组件（0）、类组件（1）、原生标签（5）
 * @param {*} pendingProps 新属性，等待处理或生效的属性
 * @param {*} key 唯一标识
 */
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag
  this.key = key
  this.type = null // fiber类型，来自于虚拟DOM节点的type：div、span、p
  // 每个虚拟DOM --> fiber节点 --> 真实DOM
  this.stateNode = null // 此fiber对应的真实DOM节点

  this.return = null // 指向父节点
  this.child = null // 指向第一个子节点
  this.sibling = null // 指向弟弟节点

  // 虚拟DOM会提供pendingProps，用来创建fiber节点的属性
  this.pendingProps = pendingProps // 等待生效的属性
  this.memoizedProps = null // 已经生效的属性

  // 每个fiber都有自己的状态，每种fiber状态存的类型是不一样的，HostRoot存的是要渲染的元素
  this.memoizedState = null // fiber状态

  // 每个fiber身上可能还有更新队列
  this.updateQueue = null // 更新的队列

  // 副作用的标识，标识针对此fiber节点进行何种操作（二进制增删改操作）
  this.flags = NoFlags
  // 子节点对应的副作用标识
  this.subtreeFlags = NoFlags
  // 存放需要删除的子fiber节点的数组
  ;(this.deletions = null),
    // 替身、轮替
    (this.alternate = null)
}
```

::: tip `alternate`

- 使用双缓冲存技术，因为`React Fiber树`最多只需要树的两个版本
- 可以自由重用的`“其他”`未使用节点集合在一起
  :::

### `Fiber` 类型

> 源码地址 [ReactWorkTags | react-reconciler/src/ReactWorkTags.js](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactWorkTags.js)

```js
// ReactWorkTags.js

// 每种虚拟DOM都会对应自己的fiber tag类型

// 根fiber的tag类型
export const FunctionComponent = 0;//函数组件
export const ClassComponent = 1; //类组件
export const IndeterminateComponent = 2; // 未决定的组件类型
export const HostRoot = 3; //容器根节点
export const HostComponent = 5; //原生节点 span div h1
export const HostText = 6; //纯文件节点
...
```

### `Fiber` 更新标识`（flags）`代表的二进制

> 源码地址 [ReactFiberFlags | react-reconciler/src/ReactFiberFlags.js](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactFiberFlags.js)

```js
// ReactFiberFlags.js

export const NoFlags = 0b0000000000000000000000000000 // 0
export const Placement = 0b0000000000000000000000000010 // 2
export const Update = 0b0000000000000000000000000100 // 4
...
```

::: tip 源码地址

实现`FiberRootNode` & `HostRootFiber`的相关源码解析的我放在了[<u>1.createFiberRoot 分支里 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/1.createFiberRoot)这里。
:::
