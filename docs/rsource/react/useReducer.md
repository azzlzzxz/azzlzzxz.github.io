# useReducer

`useReducer` 是一个 `React Hook`，它允许你向组件里面添加一个 `reducer`。

语法结构

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

参数

- `reducer`：用于更新 `state` 的纯函数。参数为 `state` 和 `action`，返回值是更新后的 `state`。`state` 与 `action` 可以是任意合法值。

- `initialArg`：用于初始化 `state` 的任意值。初始值的计算逻辑取决于接下来的 init 参数。
- 可选参数 `init`：用于计算初始值的函数。如果存在，使用 `init(initialArg)` 的执行结果作为初始值，否则使用 `initialArg`。

返回值

`useReducer` 返回一个由两个值组成的数组：

- 当前的 `state`。初次渲染时，它是 `init(initialArg)` 或 `initialArg` （如果没有 `init` 函数）。

- `dispatch` 函数。用于更新 `state` 并触发组件的重新渲染。

**接下来我们来看看`React`是如何实现`useReducer`这个`hook`的**

## `main.jsx` 入口文件

```js {4-18}
import * as React from './react'
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

function counter(state, action) {
  if (action.type === 'add') return state + action.payload

  return state
}

function FunctionComponent() {
  const [number, setNumber] = React.useReducer(counter, 0)

  return (
    <button
      onClick={() => {
        setNumber({ type: 'add', payload: 1 })
        setNumber({ type: 'add', payload: 2 })
        setNumber({ type: 'add', payload: 3 })
      }}
    >
      {number}
    </button>
  )
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

## 在`react`文件夹里导出`useReducer`

### `index.js`

```js
export { useReducer, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from './src/React'
```

::: details 导出`useReducer`和`__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`的过程

- `React.js`

```js
import { useReducer } from './ReactHooks'
import ReactSharedInternals from './ReactSharedInternals'

export { useReducer, ReactSharedInternals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED }
```

- `ReactHooks.js`

```js
import ReactCurrentDispatcher from './ReactCurrentDispatcher'

function resolveDispatcher() {
  return ReactCurrentDispatcher.current
}

/**
 * 在函数执行前给ReactCurrentDispatcher.current 赋值
 * @param {*} reducer 处理函数，用于根据老状态和动作计算新状态
 * @param {*} initialArg 初始状态
 */
export function useReducer(reducer, initialArg) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useReducer(reducer, initialArg)
}
```

- `ReactCurrentDispatcher.js`

```js
// react 当前派发对象
const ReactCurrentDispatcher = {
  current: null,
}
export default ReactCurrentDispatcher
```

- `ReactSharedInternals.js`

```js
import ReactCurrentDispatcher from './ReactCurrentDispatcher'

const ReactSharedInternals = {
  ReactCurrentDispatcher,
}

export default ReactSharedInternals
```

:::

## `shared`文件夹里导出`ReactSharedInternals`给全局使用

```js
// shared/ReactSharedInternals.js

import * as React from 'react'

const ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

export default ReactSharedInternals
```

---

从这里开始就是实现`useReducer`的过程了

实现`hooks`的方法在`react-reconciler/src/ReactFiberHooks`文件里，源码地址：[<u>ReactFiberHooks</u>](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactFiberHooks.js)

`ReactFiberHooks`文件中的方法基本可以分为两类

- `mount`：挂载阶段的方法
- `update`：更新阶段的方法

## `renderWithHooks`

- 需要在函数组件执行前给`ReactCurrentDispatcher.current`赋值

```js
import ReactSharedInternals from 'shared/ReactSharedInternals'

const { ReactCurrentDispatcher } = ReactSharedInternals

const HooksDispatcherOnMount = {
  useReducer: mountReducer,
}

// 当前函数组件对应的 fiber
let currentlyRenderingFiber = null
// 当前正在使用中的 hook
let workInProgressHook = null

/**
 *
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @param {*} Component 组件定义
 * @param {*} props 组件属性
 * @returns 虚拟DOM或者说React元素
 */
export function renderWithHooks(current, workInProgress, Component, props) {
  currentlyRenderingFiber = workInProgress // Function组件对应的 fiber

  // 需要要函数组件执行前给ReactCurrentDispatcher.current赋值
  ReactCurrentDispatcher.current = HooksDispatcherOnMount

  const children = Component(props)

  return children
}
```

## `mount` 阶段

> 流程图

![useReducer_mount](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/useReducer_mount.jpg)

### `mountReducer`

- `mountWorkInProgressHook`函数：是来创建 hook
- `dispatchReducerAction`函数：是来执行派发动作的方法

```js
function mountReducer(reducer, initialArg) {
  const hook = mountWorkInProgressHook()

  hook.memoizedState = initialArg

  const queue = {
    pending: null,
    dispatch: null,
  }

  hook.queue = queue

  const dispatch = (queue.dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ))

  return [hook.memoizedState, dispatch]
}
```

### `mountWorkInProgressHook` 挂载构建中的 hook

```js
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null, // hook的状态 0
    queue: null, // 存放本hook的更新队列 queue:{pending: update}的循环链表
    next: null, // 指向下一个hook，一个函数里可以会有多个hook，它们会组成一个单向链表
  }

  if (workInProgressHook === null) {
    //当前函数对应的fiber的状态(currentlyRenderingFiber.memoizedState)等于第一个hook对象
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook
  } else {
    workInProgressHook = workInProgressHook.next = hook
  }

  return workInProgressHook
}
```

## `update` 阶段

### `dispatchReducerAction`

- `dispatchReducerAction`函数：执行派发动作的方法，它要更新状态，并且让界面重新更新

```js
import { enqueueConcurrentHookUpdate } from './ReactFiberCocurrentUpdates'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'

/**
 * 执行派发动作的方法，它要更新状态，并且让界面重新更新
 * @param {*} fiber function对应的fiber
 * @param {*} queue hook对应的更新队列
 * @param {*} action 派发的动作
 */
function dispatchReducerAction(fiber, queue, action) {
  console.log(fiber, queue, action)

  const update = {
    action, // { type: 'add', payload: 1 } 派发的动作
    next: null, // 指向下一个更新对象
  }
  // 把当前的最新的更新添加到更新队列中，并且返回当前的根fiber
  const root = enqueueConcurrentHookUpdate(fiber, queue, update)
  scheduleUpdateOnFiber(root)
}
```

> 点击按钮后，打印看一下 `dispatchReducerAction` 函数的入参

![useReducer_dispatchReducerAction](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/useReducer_dispatchReducerAction.jpg)

### `scheduleUpdateOnFiber`

```js
// ReactFiberWorkLoop.js

import { finishQueueingConcurrentUpdates } from './ReactFiberConcurrentUpdates'

/**
 * 计划更新root
 * 源码此处有一个任务调度的功能
 * @param {*} root
 */
export function scheduleUpdateOnFiber(root) {
  // 确保调度执行root上的更新
  ensureRootIsScheduled(root)
}

// ... 省略此处代码

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null)

  // 在工作循环之前完成更新队列的收集
  finishQueueingConcurrentUpdates()
}

// 开始构建fiber树
function renderRootSync(root) {
  prepareFreshStack(root)
  workLoopSync()
}
```

### `ReactFiberConcurrentUpdates.js`

- `enqueueConcurrentHookUpdate`函数：把更新对象添加到更新队列中去

- `enqueueUpdate`函数：把更新先缓存到`concurrentQueue`数组中

- `getRootForUpdatedFiber`函数：从当前的`fiber`往上找，一直找到根节点

- `finishQueueingConcurrentUpdates`函数：把更新放到队列里

```js
//

// 更新队列
const concurrentQueues = []
// 并发更新队列的索引
let concurrentQueuesIndex = 0

/**
 * 把更新先缓存到concurrentQueue数组中
 * @param {*} fiber
 * @param {*} queue
 * @param {*} update
 */
function enqueueUpdate(fiber, queue, update) {
  //012 setNumber1 345 setNumber2 678 setNumber3
  concurrentQueues[concurrentQueuesIndex++] = fiber // 函数组件对应的fiber
  concurrentQueues[concurrentQueuesIndex++] = queue // 要更新的hook对应的更新队列
  concurrentQueues[concurrentQueuesIndex++] = update //更新对象
}

/**
 * 把更新对象添加到更新队列中
 * @param {*} fiber 函数组件对应的fiber
 * @param {*} queue 要更新的hook对应的更新队列
 * @param {*} update 更新对象
 */
export function enqueueConcurrentHookUpdate(fiber, queue, update) {
  enqueueUpdate(fiber, queue, update)
  return getRootForUpdatedFiber(fiber)
}

// 从当前的fiber往上找，找到根节点
function getRootForUpdatedFiber(sourceFiber) {
  let node = sourceFiber
  let parent = node.return
  while (parent !== null) {
    node = parent
    parent = node.return
  }
  return node.tag === HostRoot ? node.stateNode : null //FiberRootNode div#root
}

// 把更新放到队列里
export function finishQueueingConcurrentUpdates() {
  const endIndex = concurrentQueuesIndex // 9 只是一边界条件
  concurrentQueuesIndex = 0
  let i = 0
  while (i < endIndex) {
    const fiber = concurrentQueues[i++]
    const queue = concurrentQueues[i++]
    const update = concurrentQueues[i++]
    if (queue !== null && update !== null) {
      const pending = queue.pending
      if (pending === null) {
        update.next = update
      } else {
        update.next = pending.next
        pending.next = update
      }
      queue.pending = update
    }
  }
}
```
