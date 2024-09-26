# beginWork

`beginWork` 主要工作是根据传入的 `Fiber 节点` 创建或复用 `子 Fiber 节点`

> 源码地址 [<u>beginWork | react-reconciler/src/ReactFiberBeginWork.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberBeginWork.js#L3861)

> `Fiber 树`的结构

![begin_work](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/begin_work.jpg)

## `beginWork`

`begin_work` 的参数

- `current` 表示当前页面正在使用的 `Fiber 节点`，即 `workInProgress.alternate`
- `workInProgress` 表示当前正在构建的 `Fiber 节点`

```js
// ReactFiberBeginWork.js

import { HostRoot, HostComponent, HostText } from './ReactWorkTags'
import { processUpdateQueue } from './ReactFiberClassUpdateQueue'
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber'

/**
 * 目标是根据新的虚拟DOM构建新的fiber子链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @param {*} renderLanes 当前渲染优先级中优先级最高的lane
 * @returns
 */
export function beginWork(current, workInProgress, renderLanes) {
  logger('beginWork', workInProgress)
  switch (workInProgress.tag) {
    case IndeterminateComponent:
      return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes)
    case FunctionComponent: {
      const Component = workInProgress.type
      const nextProps = workInProgress.pendingProps
      return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes)
    }
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes)
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes)
    case HostText:
      return null
    default:
      return null
  }
}
```

### `ReactWorkTags`

> 这里只列举了一些 `tag`，想了解全部的`tag`类型，可以看这里 [<u>FiberTage 源码地址 | react-reconciler/src/ReactWorkTags.js</u>](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactWorkTags.js)

```js
// fiber 的 tag 类型
export const FunctionComponent = 0;// 函数组件
export const IndeterminateComponent = 2; // 不确定组件类型
export const HostRoot = 3; // 容器根节点
export const HostComponent = 5; // 原生节点 div span
export const HostText = 6; // 纯文本节点
...
```

### `logger` 打印日志函数

```js
// logger.js

import * as ReactWorkTags from 'react-reconciler/src/ReactWorkTags'

const ReactWorkTagsMap = new Map()
for (const tag in ReactWorkTags) {
  ReactWorkTagsMap.set(ReactWorkTags[tag], tag)
}

/**
 * 打印日志
 * @param {*} prefix 前缀
 * @param {*} workInProgress fiber
 */
export default function (prefix, workInProgress) {
  let tagValue = workInProgress.tag
  let tagName = ReactWorkTagsMap.get(tagValue)
  let str = `${tagName}`
  if (tagName === 'HostComponent') {
    str + ` ${workInProgress.type}`
  } else if (tagName === 'HostText') {
    str + ` ${workInProgress.pendingProps}`
  }
  console.log(`${prefix} ${str}`)
}
```

## `updateHostRoot`

> 源码地址 [<u>updateHostRoot | react-reconciler/src/ReactFiberBeginWork.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberBeginWork.js#L1480)

`updateHostRoot`方法是构建`根Fiber`的`子fiber链表`

```js
function updateHostRoot(current, workInProgress) {
  // 获取新的属性
  const nextProps = workInProgress.pendingProps

  // 克隆更新队列
  cloneUpdateQueue(current, workInProgress)

  // 需要知道它的子虚拟DOM，知道它的儿子的虚拟DOM信息
  processUpdateQueue(workInProgress, nextProps, renderLanes) // workInProgress.memoizedState = { element }

  const nextState = workInProgress.memoizedState

  // nextChildren是新的子虚拟DOM
  const nextChildren = nextState.element

  // 协调子节点，DOM-DIFF在其中
  // 根据新的虚拟DOM生成子Fiber链表
  reconcileChildren(current, workInProgress, nextChildren)

  return workInProgress.child // 根据新的虚拟DOM计算新的子节点
}
```

### `processUpdateQueue`

> 源码地址 [<u>processUpdateQueue | react-reconciler/src/ReactFiberClassUpdateQueue.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberClassUpdateQueue.js#L494)

根据老状态和更新队列中的更新，来计算计算新状态

> 这里只是抽调出 计算新状态的代码，里面涉及到`lane`相关的代码，可以到[<u>processUpdateQueue 完整代码 🚀</u>](/rsource/react/lane.md#processupdatequeue)查看

```js
// ReactFiberClassUpdateQueue.js

/**
 * 根据老状态和更新队列中的更新计算新状态
 * @param {*} workInProgress 要计算的Fiber
 */
export function processUpdateQueue(workInProgress, nextProps, renderLanes) {
  const queue = workInProgress.updateQueue
  const pendingQueue = queue.shared.pending
  // 如果有更新，或者说更新队列里有内容
  if (pendingQueue !== null) {
    // 清除等待生效的更新
    queue.shared.pending = null

    // 获取更新队列中的最后一个更新 update = {payload: {element: h1}}
    const lastPendingUpdate = pendingQueue

    // 让最后一个更新的next指向第一个更新
    const firstPendingUpdate = lastPendingUpdate.next

    // 把循环链表剪开，变成单向链表
    lastPendingUpdate.next = null

    // 获取老状态
    let newState = workInProgress.memoizedState
    let update = firstPendingUpdate
    while (update) {
      // 根据老状态和更新计算新状态
      newState = getStateFromUpdate(update, newState)
      update = update.next
    }

    // 把最终计算到的状态赋值给memoizedState
    workInProgress.memoizedState = newState
  }
}

/**
 * 根据老状态和更新计算新状态
 * @param {*} update 更新的对象其实有很多种类型
 * @param {*} prevState 老状态
 */
function getStateFromUpdate(update, prevState) {
  switch (update.tag) {
    case UpdateState:
      // payload是一个对象，里面有新的状态
      const { payload } = update
      return assign({}, prevState, payload)
  }
}
```

## `updateHostComponent`

> 源码地址 [<u>updateHostComponent | react-reconciler/src/ReactFiberBeginWork.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberBeginWork.js#L1615)

`updateHostComponent` 函数用于处理`普通 DOM 标签`，构建`原生组件`的`子fiber链表`

```js
// ReactFiberBeginWork.js

import { shouldSetTextContent } from 'react-dom-bindings/src/client/ReactDOMHostConfig'

/**
 * 构建原生组件的子fiber链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber h1
 */
function updateHostComponent(current, workInProgress) {
  const { type } = workInProgress
  const nextProps = workInProgress.pendingProps
  let nextChildren = nextProps.children

  // 判断当前虚拟DOM它的子节点是不是一个文本类型的节点
  const isDirectTextChild = shouldSetTextContent(type, nextProps)

  if (isDirectTextChild) {
    nextChildren = null
  }

  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}
```

### `shouldSetTextContent`

判断当前`虚拟DOM`的子节点是不是一个文本类型的节点

```js
// react-dom-bindings/src/client/ReactDOMHostConfig.js

export function shouldSetTextContent(type, props) {
  return typeof props.children === 'string' || typeof props.children === 'number'
}
```

## `mountIndeterminateComponent`

- `mountIndeterminateComponent`函数：挂载函数组件

```js
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

## `updateFunctionComponent`

```js
export function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps,
  renderLanes,
) {
  const nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, renderLanes)
  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}
```

## `reconcileChildren` 根据`新的虚拟DOM`构建`新的fiber子链表`

> 源码地址 [<u>reconcileChildren | react-reconciler/src/ReactChildFiber.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberBeginWork.js#L340)

```js
// ReactFiberBeginWork.js

import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber'

/**
 * 根据新的虚拟DOM构建新的fiber子链表
 * @param {*} current 老的父fiber
 * @param {*} workInProgress 新的父fiber
 * @param {*} nextChildren 新的虚拟DOM
 * @returns
 */
function reconcileChildren(current, workInProgress, nextChildren) {
  // 如果此新fiber没有老fiber，说明此新fiber是新创建的不是更新的
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren)
  } else {
    // 如果此新fiber有老fiber，说明此新fiber是更新的不是新创建的，需要做DOM-DIFF，拿老的子fiber链表和新的子虚拟DOM进行最小化更新
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren)
  }
}
```

### `createChildReconciler`

> 源码地址 [<u>createChildReconciler | react-reconciler/src/ReactChildFiber.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactChildFiber.js#L402)

`createChildReconciler(true/false)`来决定调用那个

- `mountChildFibers`：有`老的父亲fiber`更新的时候调用
- `reconcileChildFibers`：没有`老的父亲fiber`，节点的初次挂载的时候调用

::: tip

`reconcileChildFibers` 和 `mountChildFibers` 最终都是 `createChildReconciler` 传递不同的参数返回的函数；在 `createChildReconciler` 函数中用 `shouldTrackSideEffects` 来判断是否需要跟踪副作用（即为对应的 `Fiber 节点` 添加 `flags` 属性），因此 `reconcileChildFibers` 和 `mountChildFibers` 的不同在于对副作用的处理不同
:::

::: info `createChildReconciler`里的函数

源码里`createChildReconciler` 中定义了大量如 `deleteXXX`、`placeXXX`、`updateXXX`、`reconcileXXX` 的函数，这些函数覆盖了对 `Fiber 节点` 的`创建`、`增加`、`删除`、`修改`等操作，而这些函数将直接或间接地被 `reconcileChildFibers` 所调用
:::

- `useFiber`函数：根据传入的`fiber`和` pendingProps``克隆 `出一个`新的fiber节点`

- `createChild`函数：根据`新的父Fiber`创建`新的子Fiber节点`

- `reconcileSingleElement`函数：`虚拟DOM`是单节的话，调用此方法 更新/创建 一个`fiber`（`DOM-DIFF`单节点协调比对，调用此方法，[<u>`DOM-DIFF`单节点处理请看这里 🚀</u>](/rsource/react/singleNode-dom-diff.md)）

- `reconcileChildrenArray`函数：处理`多个虚拟DOM`构成的数组的 更新/创建 多个`fiber`（`DOM-DIFF`多节点协调比对，调用此方法，[<u>`DOM-DIFF`多节点处理请看这里 🚀</u>](/rsource/react/multiNode-dom-diff.md)）

- `placeSingleChild`函数：给`fiber`单节点设置副作用（`flags` 增删改）
- `placeChild`函数：给`fiber`节点设置副作用（`flags` 增删改），更改其在`fiber树`中的索引

```js
// ReactChildFiber.js

import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { createFiberFromElement, createFiberFromText, createWorkInProgress } from './ReactFiber'
import { Placement } from './ReactFiberFlags'

import isArray from 'shared/isArray'

/**
 *
 * @param {*} shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  function useFiber(fiber, pendingProps) {
    const clone = createWorkInProgress(fiber, pendingProps)
    clone.index = 0
    clone.sibling = null
    return clone
  }

  function createChild(returnFiber, newChild) {
    if ((typeof newChild === 'string' && newChild !== '') || typeof newChild === 'number') {
      const created = createFiberFromText(`${newChild}`)
      created.return = returnFiber
      return created
    }
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild)
          created.ref = newChild.ref
          created.return = returnFiber
          return created
        }
        default:
          break
      }
    }
    return null
  }

  /**
   * 虚拟DOM的单节点协调
   * @param {*} returnFiber 根fiber div#root对应的fiber
   * @param {*} currentFirstChild 老的FunctionComponent对应的fiber
   * @param {*} element 新的虚拟DOM对象
   * @returns 返回新的第一个子fiber
   */
  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    const key = element.key // 新的虚拟DOM的key,也就是唯一标准
    let child = currentFirstChild // 老的FunctionComponent对应的fiber
    while (child !== null) {
      // 判断此老fiber对应的key和新的虚拟DOM对应的key是否一样
      if (child.key === key) {
        // 判断老fiber对应的类型和新虚拟DOM元素对应的类型是否相同
        if (child.type === element.type) {
          // 如果key一样，类型也一样，则认为此节点可以复用
          const existing = useFiber(child, element.props)
          // 把ref也复用
          existing.ref = element.ref
          existing.return = returnFiber
          return existing
        }
      }
      child = child.sibling
    }

    // 在初次挂载时，那么老节点currentFirstChild肯定是没有的，不需要DOM-Diff，所以可以根据虚拟DOM创建fiber节点
    const created = createFiberFromElement(element)
    created.ref = element.ref
    created.return = returnFiber

    return created
  }

  /**
   * 设置副作用（增删改）
   * @param {*} newFiber
   * @returns
   */
  function placeSingleChild(newFiber) {
    // 说明要添加副作用 并且他的老fiber是null，才需要插入
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      // 要在提交阶段插入此节点
      // React渲染分为渲染（创建Fiber树）和提交（更新真实DOM）两个阶段
      newFiber.flags |= Placement // Placement 这个新fiber需要变成DOM，插入到dom中
    }
    return newFiber
  }

  function placeChild(newFiber, newIdx) {
    //指定新的fiber在新的挂载索引
    newFiber.index = newIdx
    //如果不需要跟踪副作用
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement
    }
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
    let resultingFirstChild = null //返回的第一个新节点
    let previousNewFiber = null //上一个的新fiber
    let newIdx = 0 //用来遍历新的虚拟DOM的索引

    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx])
      if (newFiber === null) continue
      placeChild(newFiber, newIdx)
      //如果previousNewFiber为null，说明这是第一个fiber
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber //这个newFiber就是第一个子节点
      } else {
        //否则说明不是第一个子节点，就把这个newFiber添加上一个子节点后面
        previousNewFiber.sibling = newFiber
      }
      //让newFiber成为最后一个或者说上一个子fiber
      previousNewFiber = newFiber
    }

    return resultingFirstChild
  }

  /**
   * 比较子fiber
   * DOM-DIFF 用老的子fiber链表和新的虚拟DOM进行比较的过程
   * @param {*} returnFiber 新的父fiber
   * @param {*} currentFirstChild 老fiber的第一个子fiber，current一般指的是老的意思
   * @param {*} newChild 新的子虚拟DOM （h1 虚拟DOM）
   */
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
    // 现在暂时考虑新的虚拟DOM只有一个的情况
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        // 如果是react元素
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            // 协调单节点
            reconcileSingleElement(returnFiber, currentFirstChild, newChild),
          )
        default:
          break
      }
    }
    //newChild [hello文本节点,span虚拟DOM元素]
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild)
    }

    return null
  }

  return reconcileChildFibers
}

// 有老fiber更新的时候用这个
export const reconcileChildFibers = createChildReconciler(true)
// 如果没有老父fiber，节点初次挂载的的时候用这个
export const mountChildFibers = createChildReconciler(false)
```

### `createFiberFromElement`

根据`虚拟DOM`元素，创建 `fiber节点`

```js
// ReactFiber.js

import { HostComponent, HostRoot, IndeterminateComponent, HostText } from "./ReactWorkTags";

export function FiberNode(tag, pendingProps, key) {
  ...
}

export function createFiber(tag, pendingProps, key) {
  ...
}

export function createHostRootFiber() {
  ...
}

export function createWorkInProgress(current, pendingProps) {
  ...
}

/**
 * 根据虚拟DOM创建Fiber节点
 * @param {*} element
 */
export function createFiberFromElement(element) {
  const { type, key, props: pendingProps } = element;
  return createFiberFromTypeAndProps(type, key, pendingProps);
}

function createFiberFromTypeAndProps(type, key, pendingProps) {
  let tag = IndeterminateComponent; //
  //如果类型type是一字符串 span div ，说此此Fiber类型是一个原生组件
  if (typeof type === "string") {
    tag = HostComponent;
  }
  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;
  return fiber;
}
```

### `createFiberFromText` 创建文本类型的 `fiber`

```js
export function createFiberFromText(content) {
  return createFiber(HostText, content, null)
}
```

## `completeUnitOfWork` 完成

```js
// ReactFiberWorkLoop.js

import { completeWork } from "./ReactFiberCompleteWork";

function performUnitOfWork {
  ...
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    //执行此fiber 的完成工作,如果是原生组件的话就是创建真实的DOM节点
    completeWork(current, completedWork);
    //如果有弟弟，就构建弟弟对应的fiber子链表
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    //如果没有弟弟，说明这当前完成的就是父fiber的最后一个节点
    //也就是说一个父fiber,所有的子fiber全部完成了
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
}
```

![begin_work](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/begin_work.jpg)

`Fiber 树`在整个构建过程中执行的`logger`打印出来

```sh
beginWork HostRoot
beginWork HostComponent h1
beginWork HostText Hello,
completeWork HostText Hello,
beginWork HostComponent span
completeWork HostComponent span
completeWork HostComponent h1
completeWork HostRoot
```

::: tip 源码地址

实现`beginWork`的相关源码解析的我放在了[<u>3.beginWork 分支里 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/3.beginWorkt)这里。
:::
