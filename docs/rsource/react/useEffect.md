# useEffect

`useEffect` 是一个 `React Hook`，它允许你 [<u>将组件与外部系统同步</u>](https://zh-hans.react.dev/learn/synchronizing-with-effects)。

语法结构

```js
useEffect(setup, dependencies?)
```

---

接下来我们来看看`React`是如何实现`useEffect`这个`hook`的

## `main.js` 入口文件 🌰

```jsx
import * as React from './react'
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

function FunctionComponent() {
  const [number, setNumber] = React.useState(0)

  React.useEffect(() => {
    console.log('useEffect1')
    return () => {
      console.log('destroy useEffect1')
    }
  }, [])

  React.useEffect(() => {
    console.log('useEffect2')
    return () => {
      console.log('destroy useEffect2')
    }
  })

  React.useEffect(() => {
    console.log('useEffect3')
    return () => {
      console.log('destroy useEffect3')
    }
  })

  return (
    <button
      onClick={() => {
        setNumber(number + 1)
      }}
      style={{ fontSize: '50px' }}
    >
      {number}
    </button>
  )
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

## 在`react`文件夹里导出`useEffect`

```js
export {
  // ....省略其他
  useEffect,
} from './src/React'
```

- 在`ReactHook`里添加`useEffect`

```js
// react/src/ReactHook.js

export function useEffect(create, deps) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useEffect(create, deps)
}
```

## `useEffect`的实现分为两个阶段

- `mount阶段`：`创建hook`（对应函数`mountWorkInProgressHook`），向整个`hooks`的链表里添加`useEffect`这个`hook`（对应的函数是`mountEffectImpl`），再从`hooks`链表里收集具有`（HookHasEffect | hookFlag）标识` `【effect副作用】`的`hooks`，构成一个`effect`的循环链表（对应函数`pushEffect`）

- `update阶段`：`创建新的hook`（对应函数`updateWorkInProgressHook`），根据`新、老依赖数组`的比较（对应函数`areHookInputsEqual`）结果来看，需不需要执行`effect`（对应函数`updateEffectImpl`）：

  - 需要执行，为`新hook`添加标识`（HookHasEffect | hookFlags）`

  - 不需要执行，就不用添加标识

  - 但是，无论是否需要重新执行，都要构建出一个`新的effect链表`

## `ReactFiberHooks`

- 在`HooksDispatcherOnMount`和`HooksDispatcherOnUpdate`里添加`useEffect`

  - `HooksDispatcherOnMount = { useEffect: mountEffect }`

  - `HooksDispatcherOnUpdate = { useEffect: updateEffect }`

```js
import ReactSharedInternals from 'shared/ReactSharedInternals'
import { enqueueConcurrentHookUpdate } from './ReactFiberConcurrentUpdates'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'
import { Passive as PassiveEffect } from './ReactFiberFlags'
import { HasEffect as HookHasEffect, Passive as HookPassive } from './ReactHookEffectTags'

const { ReactCurrentDispatcher } = ReactSharedInternals

const HooksDispatcherOnMount = {
  useReducer: mountReducer,
  useState: mountState,
  useEffect: mountEffect,
}

const HooksDispatcherOnUpdate = {
  useReducer: updateReducer,
  useState: updateState,
  useEffect: updateEffect,
}

// 当前函数组件对应的 fiber
let currentlyRenderingFiber = null
// 当前正在使用中的 hook
let workInProgressHook = null
// 当前hook对应的老hook
let currentHook = null

/************************************ 公共方法 *************************************/

/**
 * 挂载构建中的hook
 * */
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null, //hook的状态
    queue: null, //存放本hook的更新队列 queue.pending=update的循环链表
    next: null, //指向下一个hook,一个函数里可以会有多个hook,它们会组成一个单向链表
  }
  if (workInProgressHook === null) {
    //当前函数对应的fiber的状态等于第一个hook对象
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook
  } else {
    workInProgressHook = workInProgressHook.next = hook
  }
  return workInProgressHook
}

/**
 * 构建新的hooks
 */
function updateWorkInProgressHook() {
  //获取将要构建的新的hook的老hook
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate
    currentHook = current.memoizedState
  } else {
    currentHook = currentHook.next
  }
  //根据老hook创建新hook
  const newHook = {
    memoizedState: currentHook.memoizedState,
    queue: currentHook.queue,
    next: null,
  }
  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = newHook
  } else {
    workInProgressHook = workInProgressHook.next = newHook
  }
  return workInProgressHook
}

/************************************ useEffect 实现 ***************************/

/********************** 请看 useEffect mount 阶段实现 ***************************/

/********************** 请看 useEffect update 阶段实现 ***************************/

/************************** renderWithHooks 入口函数 ***************************/

/**
 * 渲染函数组件
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @param {*} Component 组件定义
 * @param {*} props 组件属性
 * @returns 虚拟DOM或者说React元素
 */
export function renderWithHooks(current, workInProgress, Component, props) {
  currentlyRenderingFiber = workInProgress // Function组件对应的 fiber

  // 函数组件更新队列里存的effect（因为每次渲染都会构建新的updateQueue，所以在渲染之前要清空，否则会重复）
  workInProgress.updateQueue = null

  // 如果有老的fiber,并且有老的hook链表，进入更新逻辑
  if (current !== null && current.memoizedState !== null) {
    // 需要在函数组件执行前给ReactCurrentDispatcher.current赋值
    ReactCurrentDispatcher.current = HooksDispatcherOnUpdate
  } else {
    ReactCurrentDispatcher.current = HooksDispatcherOnMount
  }

  const children = Component(props)
  currentlyRenderingFiber = null
  workInProgress = null
  currentHook = null
  return children
}
```

## `mount` 阶段

> 流程图

![useEffect_mount](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/useEffect_mount.jpg)

- `create`: 实际上就是通过`useEffect()`所传入的函数

- `deps`: 依赖项数组

- `mountWorkInProgressHook`函数：`创建hook`

- 给当前的函数组件`fiber`添加`flags`：`currentlyRenderingFiber.flags |= fiberFlags`

- `hook.memoizedState`：从`hooks`链表里收集具有`（HookHasEffect | hookFlag）标识` `【effect副作用】`的`hooks`，构成一个`effect`的循环链表（对应函数`pushEffect`）,让 `useEffect` `hook.memoizedState`和`effect链表`里的`effect`对象`一一对应`

```js
function mountEffect(create, deps) {
  return mountEffectImpl(PassiveEffect, HookPassive, create, deps)
}

/**
 *
 * @param {*} fiberFlags fiber里有useEffect对应的标识
 * @param {*} hookFlags useEffect这个hook对应的标识
 * @param {*} create useEffect里的回调函数
 * @param {*} deps useEffect的依赖数组
 */
function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  // 给当前的函数组件fiber添加flags
  currentlyRenderingFiber.flags |= fiberFlags
  hook.memoizedState = pushEffect(HookHasEffect | hookFlags, create, undefined, nextDeps)
}
```

### `pushEffect`

- 创建`effect`
- 把`effect`对象添加到环形链表末尾（构成循环链表）
- 返回`effect`

```js
function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag,
    create,
    destroy,
    deps,
    next: null,
  }
  // 当前函数组件的fiber 里的更新队列
  let componentUpdateQueue = currentlyRenderingFiber.updateQueue
  if (componentUpdateQueue === null) {
    // updateQueue为null，就创建一个更新队列
    componentUpdateQueue = createFunctionComponentUpdateQueue()
    // 把新创建的updateQueue赋值给，当前函数组件的fiber 里的更新队列
    currentlyRenderingFiber.updateQueue = componentUpdateQueue
    // 让lastEffect指向最后一个effect，构成循环链表
    componentUpdateQueue.lastEffect = effect.next = effect
  } else {
    // updateQueue存在，就获取lastEffect
    const lastEffect = componentUpdateQueue.lastEffect
    if (lastEffect === null) {
      // lastEffect === null，让lastEffect指向最后一个effect，构成循环链表
      componentUpdateQueue.lastEffect = effect.next = effect
    } else {
      // 往循环链表里加，第一个effect指向下一个，最后一个effect指向第一个
      const firstEffect = lastEffect.next
      lastEffect.next = effect
      effect.next = firstEffect
      componentUpdateQueue.lastEffect = effect
    }
  }
  return effect
}
```

## `update` 阶段

- `create`: 实际上就是通过`useEffect()`所传入的函数

- `deps`: 依赖项数组，如果依赖项变动, 会创建新的`effect`

- `updateWorkInProgressHook`函数：`创建新的hook`（对应函数）

- `areHookInputsEqual`函数：根据`新、老依赖数组`的比较（对应函数）结果来看，需不需要执行`effect`

  - 不需要执行，就不用添加标识

  - 需要执行，为`新hook`添加标识`（HookHasEffect | hookFlags）`

  - 但是，无论是否需要重新执行，都要构建出一个`新的effect链表`

::: tip `HasEffect`的作用

`Passive`已经代表了`useEffect`，为什么还需`HasEffect`？

因为不是每个`Passive`都会执行的，所以通过 `HasEffect | Passive` 对应代码里的· `（HookHasEffect | hookFlags）`标识来标识需要执行的 `effect`
:::

```js
function updateEffect(create, deps) {
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps)
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  let destroy
  // 上一个老hook
  if (currentHook !== null) {
    // 获取此useEffect这个Hook上老的effect对象 (create deps destroy)
    const prevEffect = currentHook.memoizedState
    // 获取destroy方法
    destroy = prevEffect.destroy
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps
      // 用新数组和老数组进行对比，如果一样的话
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 不管要不要重新执行，都需要把新的effect组成完整的循环链表放到fiber.updateQueue中，未下次更新做准备
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps)
        return
      }
    }
  }

  // 如果要执行effect的话需要修改fiber的flags
  currentlyRenderingFiber.flags |= fiberFlags
  // 如果要执行hook的话 添加HookHasEffect flag
  // Passive已经代表了useEffect，为什么还需HookHasEffect,因为不是每个Passive都会执行的
  hook.memoizedState = pushEffect(HookHasEffect | hookFlags, create, destroy, nextDeps)
}
```

### `areHookInputsEqual`

- `areHookInputsEqual`函数：新和老的两个依赖数组的比对

```js
function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) return null
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue
    }
    return false
  }
  return true
}
```

## `commit` 提交阶段

在进行提交操作时也会经历两个阶段：

- `mount挂载`阶段

- `unmount卸载`阶段

> 流程图

![useEffect_commit](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/useEffect_commit.jpg)

### `commitRoot` 提交入口函数

::: tip `flushPassiveEffect`函数的执行时机

`scheduleCallback`函数不会立刻执行，它会开启一个宏任务，会在构建之后执行，所以`flushPassiveEffect`函数会在下一宏任务执行时执行

:::

```js
// ReactFiberWorkLoop.js

import {
  commitMutationEffectsOnFiber, // 执行DOM操作
  commitPassiveUnmountEffects, // 执行destroy
  commitPassiveMountEffects, // 执行create
} from './ReactFiberCommitWork'

// 此根节点上有没有useEffect的类似副作用
let rootDoesHavePassiveEffect = false
// 具有useEffect副作用的跟节点（FiberRootNode，根fiber.stateNode）
let rootWithPendingPassiveEffects = null

// ... 省略其他代码

function commitRoot(root) {
  // 获取新构建好的fiber树的根fiber
  const { finishedWork } = root

  // 如果新的根fiber的子节点有effect的副作用 或 自身上有effect的副作用
  if (
    (finishedWork.subtreeFlags & Passive) !== NoFlags ||
    (finishedWork.flags & Passive) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffect) {
      // 表示跟上有要执行的副作用
      rootDoesHavePassiveEffect = true
      // scheduleCallback 不会立刻执行，它会开启一个宏任务，在构建之后执行
      scheduleCallback(flushPassiveEffect)
    }
  }
  // 判断子树里有没有副作用 （插入/更新等）
  const subtreeHasEffects = (finishedWork.subtreeFlags & MutationMask) !== NoFlags

  // 判断根fiber自己有没有副作用
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags

  // 如果自己有副作用或子节点有副作用那就进行提交DOM操作
  if (subtreeHasEffects || rootHasEffect) {
    // 提交的变更 副作用 在 fiber 上
    commitMutationEffectsOnFiber(finishedWork, root)

    // 提交变更后，把root（根节点）赋值给rootWithPendingPassiveEffects，再下个宏任务里 flushPassiveEffect 执行时就能拿到root
    if (rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = false
      rootWithPendingPassiveEffects = root
    }
  }

  // 等DOM变更后，root 的 current属性指向新fiber树
  root.current = finishedWork
}

// ... 省略其他代码
```

### `flushPassiveEffect`

- `flushPassiveEffects` 是处理 `passive effect` 的入口函数

  - `commitPassiveUnmountEffects(root.current)`：执行 `useEffect` 的销毁函数（实际是调用 `commitHookEffectListUnmount`）

  - `commitPassiveMountEffects(root, root.current)`：执行 `useEffect` 的创建函数（实际是调用 `commitHookEffectListMount`）

```js
// 刷新副作用，在构建之后执行
function flushPassiveEffect() {
  if (rootWithPendingPassiveEffects !== null) {
    // 有需要执行副作用的根
    const root = rootWithPendingPassiveEffects
    // 先执行卸载副作用，destroy
    commitPassiveUnmountEffects(root.current)
    // 再执行挂载副作用 create
    commitPassiveMountEffects(root, root.current)
  }
}
```

### `mount`挂载阶段

```js
/**
 *
 * @param {*} root 根节点
 * @param {*} finishedWork 新根fiber
 */
export function commitPassiveMountEffects(root, finishedWork) {
  commitPassiveMountOnFiber(root, finishedWork)
}

// 递归处理新fiber树上的 effect
function commitPassiveMountOnFiber(finishedRoot, finishedWork) {
  const flags = finishedWork.flags
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork)
      break
    }
    case FunctionComponent: {
      recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork)
      if (flags & Passive) {
        // 1024
        commitHookPassiveMountEffects(finishedWork, HookHasEffect | HookPassive)
      }
      break
    }
  }
}

// 深度优先的递归遍历
function recursivelyTraversePassiveMountEffects(root, parentFiber) {
  // 检查父fiber的子树是否包含副作用
  if (parentFiber.subtreeFlags & Passive) {
    let child = parentFiber.child
    // 遍历父fiber的所有子fiber
    while (child !== null) {
      // 每个子fiber上都执行commitPassiveMountOnFiber
      commitPassiveMountOnFiber(root, child)
      // 移动到下一个子fiber
      child = child.sibling
    }
  }
}

// 提交hook上的挂载副作用（effect）
function commitHookPassiveMountEffects(finishedWork, hookFlags) {
  commitHookEffectListMount(hookFlags, finishedWork)
}
```

#### `commitHookEffectListMount`

- `commitHookEffectListMount`函数：从第一个`effect`开始 执行循环链表中的所有`effect`的`create`方法

```js
// 从第一个开始 执行循环链表中的所有effect
function commitHookEffectListMount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null

  // lastEffect不为null，至少有一个effect要执行
  if (lastEffect !== null) {
    //获取 第一个effect
    const firstEffect = lastEffect.next
    let effect = firstEffect
    do {
      //如果此 effect类型和传入的相同，都是 9 HookHasEffect | PassiveEffect
      if ((effect.tag & flags) === flags) {
        const create = effect.create

        // 执行create方法，把结果给destroy
        effect.destroy = create()
      }
      effect = effect.next
    } while (effect !== firstEffect)
  }
}
```

### `unmount`卸载阶段

- `unmount`卸载阶段的代码逻辑和`mount`挂载阶段代码逻辑基本一致，只是在提交`hook`上的挂载副作用`（effect）`时，执行的是`destroy方法`

```js
export function commitPassiveUnmountEffects(finishedWork) {
  commitPassiveUnmountOnFiber(finishedWork)
}

function commitPassiveUnmountOnFiber(finishedWork) {
  const flags = finishedWork.flags
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraversePassiveUnmountEffects(finishedWork)
      break
    }
    case FunctionComponent: {
      recursivelyTraversePassiveUnmountEffects(finishedWork)
      if (flags & Passive) {
        //1024
        commitHookPassiveUnmountEffects(finishedWork, HookHasEffect | HookPassive)
      }
      break
    }
  }
}

function recursivelyTraversePassiveUnmountEffects(parentFiber) {
  if (parentFiber.subtreeFlags & Passive) {
    let child = parentFiber.child
    while (child !== null) {
      commitPassiveUnmountOnFiber(child)
      child = child.sibling
    }
  }
}

function commitHookPassiveUnmountEffects(finishedWork, hookFlags) {
  commitHookEffectListUnmount(hookFlags, finishedWork)
}

function commitHookEffectListUnmount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null
  if (lastEffect !== null) {
    //获取 第一个effect
    const firstEffect = lastEffect.next
    let effect = firstEffect
    do {
      //如果此 effect类型和传入的相同，都是 9 HookHasEffect | PassiveEffect
      if ((effect.tag & flags) === flags) {
        const destroy = effect.destroy
        if (destroy !== undefined) {
          destroy()
        }
      }
      effect = effect.next
    } while (effect !== firstEffect)
  }
}
```

## 渲染

- 现在我们来看一下`main.jsx`里执行结果

![useEffect_no_deps](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/useEffect_no_deps.gif)

- 我们改一下代码，给`useEffect1`添加依赖数组，再看一下执行结果

```js
React.useEffect(() => {
  console.log('useEffect1')
  return () => {
    console.log('destroy useEffect1')
  }
}, [])
```

![useEffect_deps](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/useEffect_deps.gif)

::: tip 源码地址

实现`useEffect`的相关代码我放在了[<u>11.useEffect 分支里了 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/11.useEffect)
:::
