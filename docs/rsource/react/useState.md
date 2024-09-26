# useState

`useState` 是一个 `React Hook`，它允许你向组件添加一个 `状态变量`。

语法结构

```js
const [state, setState] = useState(initialState)
```

---

接下来我们来看看`React`是如何实现`useState`这个`hook`的

## `main.jsx` 入口文件举例

```jsx{4-8}
import * as React from "./react";
import { createRoot } from "react-dom/src/client/ReactDOMRoot";

function FunctionComponent() {
  const [number, setNumber] = React.useState(0);

  return <button onClick={() => setNumber(number + 1)}>{number}</button>;
}

let element = <FunctionComponent />;

const root = createRoot(document.getElementById("root"));

root.render(element);
```

## 在`react`文件夹里导出`useState`

```js
export {
  // ....省略其他
  useState,
} from './src/React'
```

- 在`ReactHook`里添加`useState`

```js
// react/src/ReactHook.js

export function useState(initialState) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useState(initialState)
}
```

## `ReactFiberHooks`

- `useState`其实就是一个内置了`reducer`的`useReducer`，它俩的实现原理都差不多

- `mount` 阶段

  - 在`HooksDispatcherOnMount`里添加`useState: mountState`

  - `mountState`函数：创建`hook`和派发动作

  - `dispatchSetState`函数：派发动作的方法

- `update` 阶段

  - 在`HooksDispatcherOnUpdate`里添加`useState: updateState`

  - `updateState`函数：调用`updateReducer`

  - `baseStateReducer`：内置的`reducer`

  - `initialState`：初始状态

  - `updateReducer`函数：在`do while`循环了加了一个判断逻辑，如果`update.hasEagerState = true`也就是说当前`update`是个`急切的更新`，那么`newState(新状态)`就直接获取`update.eagerState(急切的更新状态)`

### `mount` 阶段

::: tip 注意 ⚠️

- 优化的前提会有一个判断条件：只有第一个更新都能进行此项优化，如果`fiber`上有`lanes`，就不会执行此优化。

```js
if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes == NoLanes)) {
  // ... 省略代码
}
```

如果不加判断条件，每次更新都会进来，这样的话`hasEagerState = true` ，`eagerState = 最新状态`，在`updateReducer`中最新状态直接把上一次的状态给覆盖掉了

- 这里`React`做了一个优化，`update`里对比`useReducer`多了两个属性
  - `hasEagerState`：是否有急切的更新
  - `eagerState`：急切的更新状态

`在触发调度前`，会使用`上次的状态`和`上次的reducer`结合`本次action`进行计算新状态，并通过`计算出的状态eagerState`和`上次的状态lastRenderedState`使用`Object.is()`方法进行比对，如果为`true`，就不会触发调度执行更新了

[<u>React 官网 - 我已经更新了状态，但是屏幕没有更新</u>](https://zh-hans.react.dev/reference/react/useState#ive-updated-the-state-but-the-screen-doesnt-update)

:::

#### `mountState`

- `hook`上的属性

  - `hook.memoizedState`：当前`hook`真正显示出来的状态

  - `hook.baseState`：第一个跳过的更新之前的老状态

  - `hook.queue.lastRenderedState`：上一个计算的状态

```js
const HooksDispatcherOnMount = {
  useReducer: mountReducer,
  useState: mountState,
}

function mountState(initialState) {
  const hook = mountWorkInProgressHook()
  hook.memoizedState = hook.baseState = initialState
  const queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: baseStateReducer, // 上一个reducer
    lastRenderedState: initialState, // 上一个state
  }
  hook.queue = queue
  const dispatch = (queue.dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue))
  return [hook.memoizedState, dispatch]
}
```

#### `dispatchSetState` 执行派发动作的方法

```js
function dispatchSetState(fiber, queue, action) {
  // 获取当前的更新赛道
  const lane = requestUpdateLane()

  const update = {
    action,
    hasEagerState: false, //是否有急切的更新
    eagerState: null, //急切的更新状态
    next: null,
  }

  // 当你派发动作后，我立刻用上一次的状态和上一次的reducer计算新状态
  // 只有第一个更新都能进行此项优化
  if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes == NoLanes)) {
    //先获取队列上的老的状态和老的reducer
    const { lastRenderedReducer, lastRenderedState } = queue

    //使用上次的状态和上次的reducer结合本次action进行计算新状态
    const eagerState = lastRenderedReducer(lastRenderedState, action)

    update.hasEagerState = true
    update.eagerState = eagerState

    if (Object.is(eagerState, lastRenderedState)) {
      return
    }
  }

  // 下面是真正的入队更新，并调度更新逻辑
  const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane)

  scheduleUpdateOnFiber(root, fiber, lane)
}
```

### `update` 阶段

- `baseStateReducer`：`useState`其实就是一个内置了`reducer`的`useReducer`

- `updateState`里调用`updateReducer`

```js
const HooksDispatcherOnUpdate = {
  useReducer: updateReducer,
  useState: updateState,
}

function baseStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action
}

function updateState(initialState) {
  return updateReducer(baseStateReducer, initialState)
}

function updateReducer(reducer) {
  // 获取新的hook
  const hook = updateWorkInProgressHook()

  // 获取新的hook的更新队列
  const queue = hook.queue

  // 获取老的hook
  const current = currentHook

  // 获取将要生效的的更新队列
  const pendingQueue = queue.pending

  // 初始化一个新状态，取值为当前状态
  let newState = current.memoizedState

  if (pendingQueue !== null) {
    queue.pending = null
    const firstUpdate = pendingQueue.next
    let update = firstUpdate
    do {
      if (update.hasEagerState) {
        newState = update.eagerState
      } else {
        const action = update.action
        newState = reducer(newState, action)
      }
      update = update.next
    } while (update !== null && update !== firstUpdate)
  }

  // 计算好新的状态后，不但要改变hook的状态，也要改变hook上队列的lastRenderedState
  hook.memoizedState = queue.lastRenderedState = newState

  const dispatch = queue.dispatch

  return [hook.memoizedState, dispatch]
}
```

## 渲染

### 当上一次的状态和新状态一样时我们看一下是什么效果

```js
import * as React from './react'
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'
function FunctionComponent() {
  const [number, setNumber] = React.useState(0)

  return <button onClick={() => setNumber(number)}>{number}</button>
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

我们在`dispatchSetState`加一段日志

```js
function dispatchSetState(fiber, queue, action) {
  // ... 省略代码

  if (Object.is(eagerState, lastRenderedState)) {
    console.log('上次的状态和当前状态一样，不触发调度更新')
    return
  }

  // ... 省略代码
}
```

![useState_eager](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/useState_eager.gif)

### 正常渲染

![useState_render](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/useState_render.gif)

::: tip 源码地址

实现`useState`的相关代码我放在了[<u>8.useState 分支里了 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/8.useState)
:::
