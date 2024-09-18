# scheduleUpdateOnFiber 调度更新

在 `updateContainer` 中，我们创建了一个 `update` 对象，然后将其添加到更新队列中，接下来就是调用 `scheduleUpdateOnFiber` 进行更新（这也是 `render` 阶段的入口）

> 源码地址 [<u>scheduleUpdateOnFiber ｜ react-reconciler/src/ReactFiberWorkLoop.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberWorkLoop.js#L716)

```js {30}
// ReactFiberReconciler.js

import { createFiberRoot } from './ReactFiberRoot'
import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'

// 创建容器
export function createContainer(containerInfo) {
  ...
}

/**
 * 更新容器 把虚拟DOM，element转换成真实DOM插入到container容器中
 * @param {*} element 虚拟DOM
 * @param {*} container 容器 FiberRootNode
 */
export function updateContainer(element, container) {
  // 获取当前根fiber (HostRootFiber)
  const current = container.current

  // 创建更新
  const update = createUpdate()

  // payload是要更新的虚拟DOM
  update.payload = { element }

  // 将update（更新对象）插入到当前fiber的更新队列中，返回根节点
  const root = enqueueUpdate(current, update)

  scheduleUpdateOnFiber(root)
}
```

```js {14-17}
// ReactFiberWorkLoop.js

import { scheduleCallback } from 'scheduler'
import { createWorkInProgress } from './ReactFiber'
import { beginWork } from './ReactFiberBeginWork'

let workInProgress = null // 正在进行中的任务

/**
 * 计划更新root
 * 源码此处有一个任务调度的功能
 * @param {*} root
 */
export function scheduleUpdateOnFiber(root) {
  // 确保调度执行root上的更新
  ensureRootIsScheduled(root)
}

function ensureRootIsScheduled(root) {
  // 告诉浏览器要执行performConcurrentWorkOnRoot
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root))
}

/**
 * 根据虚拟DOM构建fiber树，要创建真实的DOM节点，还需要把真实的DOM节点插入容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root) {
  // 第一次渲染是以同步的方式渲染根节点，初次渲染的时候，都是同步的
  renderRootSync(root)
}

// 创建一个新栈
let workInProgress = null

...

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null)
  console.log('workInProgress', workInProgress)
}

// 开始构建fiber树
function renderRootSync(root) {
  prepareFreshStack(root)
  workLoopSync()
}

// 工作循环同步
function workLoopSync() {
  while (workInProgress !== null) {
    // 执行工作单元
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(unitOfWork) {
  // 获取新的fiber对应的老fiber
  const current = unitOfWork.alternate
  // 完成当前fiber的子fiber链表构建后
  const next = beginWork(current, unitOfWork)
  // 把带生效属性变成已生效
  unitOfWork.memoizedProps = unitOfWork.pendingProps

  if (next === null) {
    workInProgress = null
    // 如果没有子节点，表示当前fiber已经完成了
    // completeUnitOfWork(unitOfWork);
  } else {
    // 如果有子节点，就让子节点成为下一个工作单元
    workInProgress = next
  }
}
```

## `ensureRootIsScheduled`用于注册调度任务

注册调度任务

- 将 `performSyncWorkOnRoot` 添加到调度队列`（scheduleCallback）`中

- 等待调度中心执行 `performSyncWorkOnRoot`

```js
function ensureRootIsScheduled(root) {
  // ... 任务调度代码后面回详细分析

  // 告诉浏览器要执行performConcurrentWorkOnRoot
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root))
}
```

## `performSyncWorkOnRoot`

在 `sync` 同步模式下会执行 `performSyncWorkOnRoot`

```js
/**
 * 根据虚拟DOM构建fiber树，要创建真实的DOM节点，还需要把真实的DOM节点插入容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root) {
  // 第一次渲染是以同步的方式渲染根节点，初次渲染的时候，都是同步的
  renderRootSync(root)
}
```

## `renderRootSync`

> `Fiber Tree`

![fiber_tree](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/fiber_tree.jpg)

```js
// 开始构建fiber树
function renderRootSync(root) {
  prepareFreshStack(root)

  // 同步工作循环
  workLoopSync()
}
```

## `prepareFreshStack`

```js
// 创建一个新栈
function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null)
  console.log('workInProgress', workInProgress)
}
```

> 打印一下 `workInProgress`

![createWorkInProgress](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/createWorkInProgress.jpg)

## `createWorkInProgress` 基于老的`fiber`和新的属性，创建新的`fiber`

```js {7-47}
// ReactFiber.js

export function FiberNode(tag, pendingProps, key) {
  ...
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

/**
 * 基于老的fiber和新的属性，创建新的fiber
 * @param {*} current 老fiber
 * @param {*} pendingProps 新属性
 */
export function createWorkInProgress(current, pendingProps) {
  // 拿到老fiber的论替
  let workInprogress = current.alternate;

  if (workInprogress === null) {
    // 没有就去创建
    workInprogress = createFiber(current.tag, pendingProps, current.key);
    workInprogress.type = current.type;
    workInprogress.stateNode = current.stateNode;

    // 双向指向，互为替身
    workInprogress.alternate = current;
    current.alternate = workInprogress;
  } else {
    // 有就复用老fiber
    workInprogress.pendingProps = pendingProps;
    workInprogress.type = current.type;

    // 清空副作用
    workInprogress.flags = NoFlags;
    workInprogress.subtreeFlags = NoFlags;
  }

  workInprogress.child = current.child;
  workInprogress.memoizedProps = current.memoizedProps;
  workInprogress.memoizedState = current.memoizedState;
  workInprogress.updateQueue = current.updateQueue;
  workInprogress.sibling = current.sibling;
  workInprogress.index = current.index;

  return workInprogress;
}
```

## `workLoopSync` 同步循环

`workLoopSync` 函数会一直执行 `performUnitOfWork` 函数，直到 `workInProgress === null`，表示没有正在进行的渲染

```js
// 工作循环同步
function workLoopSync() {
  while (workInProgress !== null) {
    // 执行工作单元
    performUnitOfWork(workInProgress)
  }
}
```

## `performUnitOfWork` 执行工作单元

- `current` 表示当前页面正在使用的 `Fiber 节点`，即 `workInProgress.alternate`

- `workInProgress` 表示当前正在构建的 `Fiber 节点`

```js {5-21}
let workInProgress = null;

...

function performUnitOfWork(unitOfWork) {
  // 获取新的fiber对应的老fiber
  const current = unitOfWork.alternate;
  // 完成当前fiber的子fiber链表构建后
  const next = beginWork(current, unitOfWork);
  // 把待生效属性变成已生效
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    workInProgress = null;
    // 如果没有子节点，表示当前fiber已经完成了
    // completeUnitOfWork(unitOfWork);
  } else {
    // 如果有子节点，就让子节点成为下一个工作单元
    workInProgress = next;
  }
}
```
