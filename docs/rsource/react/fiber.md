# Fiber

## 介绍

- 我们可以通过某些调度策略合理分配 `CPU` 资源，从而提高用户的响应速度。
- 通过 Fiber 架构，让渲染过程变成可被中断、暂停、恢复的过程。 适时地让出 `CPU` 执行权，除了可以让浏览器及时地响应用户的交互。

## `Fiber` 是一个执行单元

`Fiber` 是一个执行单元,每次执行完一个执行单元, React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去。

![fiber_task](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/fiber_task.jpeg)

## `Fiber` 是一个数据结构

- React 目前的做法是使用链表, 每个虚拟节点内部表示为一个 `Fiber`
- 从顶点开始遍历
- 如果有第一个儿子，先遍历第一个儿子
- 如果没有第一个儿子，标志着此节点遍历完成
- 如果有弟弟遍历弟弟
- 如果有没有下一个弟弟，返回父节点标识完成父节点遍历，如果有叔叔遍历叔叔
- 没有父节点遍历结束

### 创建根 `Fiber`

![fiber_root](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/Fiber_root.jpeg)

```js
// main.jsx
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

let element = (
  <h1>
    Hello, <span style={{ color: 'red' }}>world</span>
  </h1>
)

const root = createRoot(document.getElementById('root'))
console.log(root)
```

![root_node](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/root_node.png)

#### `createRoot`

```js
// ReactDOMRoot
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

#### `createContainer`(创建根容器)

```js
// ReactFiberReconciler
import { createFiberRoot } from './ReactFiberRoot'

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo)
}
```

#### `createFiberRoot`(创建 `Fiber` 根)

> `FiberRoot` 是真实的 `DOM` 节点（根节点）

```js
// ReactFiberRoot
import { createHostRootFiber } from './ReactFiber'
import { initializeUpdateQueue } from './ReactFiberClassUpdateQueue'

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo // div #root
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo)
  // HostRoot指的是根节点div #root
  const uninitializedFiber = createHostRootFiber()
  // 根容器的current指向渲染好的根Fiber
  root.current = uninitializedFiber
  // 根节点的Fiber的stateNode（真实DOM）指向根节点FiberRootNode
  uninitializedFiber.stateNode = root
  // 初始化更新队列
  initializeUpdateQueue(uninitializedFiber)
  return root
}
```

#### `createHostRootFiber`(创建根 `Fiber`)

```js
// ReactFiber
export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null)
}
```

#### `FiberNode`(`Fiber` 节点)

> 源码地址 [function FiberNode](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactFiber.old.js#L118)

```js
// ReactFiber
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
  // 替身、轮替
  //我们使用双缓冲池技术，因为我们知道我们最多只需要树的两个版本。
  //我们将可以自由重用的“其他”未使用节点集合在一起。
  this.alternate = null
}
```

#### `Fiber` 类型

> 源码地址 [ReactWorkTags](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactWorkTags.js)

```js
// ReactWorkTags

// 每种虚拟DOM都会对应自己的fiber tag类型

// 根fiber的tag类型
export const HostRoot = 3
export const HostComponent = 5 // 原生节点 div span
export const HostText = 6 // 纯文本节点
```

#### `Fiber` 更新标识代表的二进制

> 源码地址 [ReactFiberFlags](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactFiberFlags.js)

```js
// ReactFiberFlags
export const NoFlags = 0b0000000000000000000000000000
export const Placement = 0b0000000000000000000000000010
export const Update = 0b0000000000000000000000000100
```

#### 初始化更新队列

> 每个 `Fiber` 上都可能会有更新队列，存放它的更新（不同类型的 `Fiber`，存放的更新都不一样）。

![initializeUpdateQueue](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/initializeUpdateQueue.png)

```js
// ReactFiberClassUpdateQueue
export function initializeUpdateQueue(fiber) {
  // 创建一个新的更新队列
  const queue = {
    shared: {
      pending: null, // 是循环链表
    },
  }
  fiber.updateQueue = queue
}
```

### 双缓冲

双缓冲技术是在内存或显存中开辟一块与屏幕一样大小的储存空间，作为缓冲屏幕。将下一帧要显示的图像绘制到这个缓冲屏幕上，在显示的时候将虚拟屏幕中的数据复制到可见区域里去。

![double_buffering](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/double_buffering.jpg)

### 构建 Fiber Tree

![fiber_tree](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/fiber_tree.jpg)

#### `Render`

```js
// ReactDOMRoot
import { createContainer, updateContainer } from 'react-reconciler/src/ReactFiberReconciler'

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}

// render
+ ReactDOMRoot.prototype.render = function (children) {
+  const root = this._internalRoot
+  updateContainer(children, root)
+ }

export function createRoot(container) {
  // container ---> div #root
  const root = createContainer(container) // ---> 创建FiberRootNode

  return new ReactDOMRoot(root)
}
```

#### `updateContainer` 更新容器

```js
// ReactFiberReconciler
import { createFiberRoot } from './ReactFiberRoot'
import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'

// 创建容器
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo)
}

/**
 * 更新容器 把虚拟DOM，element转换成真实DOM插入到container容器中
 * @param {*} element 虚拟DOM
 * @param {*} container 容器 FiberRootNode
 */
+ export function updateContainer(element, container) {
+  // 获取当前根fiber
+  const current = container.current
+  // 创建更新
+  const update = createUpdate()
+  // payload是要更新的虚拟DOM
+  update.payload = { element }
+  // 将update（更新对象）插入到当前fiber的更新队列中，返回根节点
+  const root = enqueueUpdate(current, update)
+
+  scheduleUpdateOnFiber(root)
}
```

#### 更新队列(单向循环链表)

![update_queue](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/update_queue.jpg)

```js
// ReactFiberClassUpdateQueue
import { markUpdateLaneFromFiberToRoot } from './ReactFiberCocurrentUpdates'

export function initializeUpdateQueue(fiber) {
  // 创建一个新的更新队列
  const queue = {
    shared: {
      pending: null, // 是循环链表
    },
  }
  fiber.updateQueue = queue
}

+export function createUpdate() {
+  const update = {}
+  return update
+}

// 单向循环链表
+export function enqueueUpdate(fiber, update) {
+  // 获取当前fiber的更新队列
+  const updateQueue = fiber.updateQueue
+  const pending = updateQueue.shared.pending
+  if (pending === null) {
+    // 第一次更新
+    update.next = update
+  } else {
+    // 第n次更新
+    update.next = pending.next
+    pending.next = update
+  }
+  // pending指向最后一个更新，最后一个更新的next指向第一个更新
+  updateQueue.shared.pending = update
+
+  // 返回跟节点，从当前fiber一直到跟节点
+  return markUpdateLaneFromFiberToRoot(fiber)
+}
```

![enqueueUpdate](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/enqueueUpdate.png)

#### `markUpdateLaneFromFiberToRoot` (找根节点)

```js
// ReactFiberCocurrentUpdates
import { HostRoot } from './ReactWorkTags'

/**
 * 本来此文件要处理更新优先级的问题
 * 目前只实现向上找跟节点
 */
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber // 当前Fiber
  let parent = sourceFiber.return // 当前Fiber的父Fiber
  while (parent !== null) {
    node = parent
    parent = parent.return
  }

  // 一直找到parent为null
  if ((node.tag = HostRoot)) {
    return node.stateNode
  }
  return null
}
```

#### `scheduleUpdateOnFiber`(任务调度与创建 `Fiber` 树)

> 源码地址 [scheduleUpdateOnFiber](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberWorkLoop.js#L716)

```js
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

> workInProgress(新的 HostRootFiber)

![prepareFreshStack](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/prepareFreshStack.png)

#### `scheduleCallback`(任务调度回调)

```js
# scheduler/src/forks

// 此处后面会实现优先级队列
export function scheduleCallback(callback) {
  requestIdleCallback(callback)
}
```

#### `createWorkInProgress`(基于老的 `fiber` 和新的属性，创建新的 `fiber`)

![fiber_tree_double](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/fiber_tree_double.jpg)

```js
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
  // 替身、轮替
  //我们使用双缓冲池技术，因为我们知道我们最多只需要树的两个版本。
  //我们将可以自由重用的“其他”未使用节点集合在一起。
  this.alternate = null
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null)
}

/**
 * 基于老的fiber和新的属性，创建新的fiber
 * @param {*} current 老fiber
 * @param {*} pendingProps 新属性
 */
+export function createWorkInProgress(current, pendingProps) {
+  // 拿到老fiber的论替
+  let workInprogress = current.alternate
+
+  if (workInprogress === null) {
+    // 没有就去创建
+    workInprogress = createFiber(current.tag, pendingProps, current.key)
+    workInprogress.type = current.type
+    workInprogress.stateNode = current.stateNode
+
+    // 双向指向，互为替身
+    workInprogress.alternate = current
+    current.alternate = workInprogress
+  } else {
+    // 有就复用老fiber
+    workInprogress.pendingProps = pendingProps
+    workInprogress.type = current.type
+
+    // 清空副作用
+    workInprogress.flags = NoFlags
+    workInprogress.subtreeFlags = NoFlags
+  }
+
+  workInprogress.child = current.child
+  workInprogress.memoizedProps = current.memoizedProps
+  workInprogress.memoizedState = current.memoizedState
+  workInprogress.updateQueue = current.updateQueue
+  workInprogress.sibling = current.sibling
+  workInprogress.index = current.index
+
+  return workInprogress
+}
```

### `BeginWork`

> 源码地址 [BeginWork](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberBeginWork.js#L3861)

![begin_work](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/begin_work.jpg)

```js
// ReactFiberBeginWork
import logger from 'shared/logger'
import { HostRoot, HostComponent, HostText } from './ReactWorkTags'
import { processUpdateQueue } from './ReactFiberClassUpdateQueue'
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

function updateHostRoot(current, workInProgress) {
  // 需要知道它的子虚拟DOM，知道它的儿子的虚拟DOM信息
  processUpdateQueue(workInProgress) // workInProgress.memoizedState = { element }

  const nextState = workInProgress.memoizedState
  // nextChildren是新的子虚拟DOM
  const nextChildren = nextState.element
  // 协调子节点，DOM-DIFF在其中
  // 根据新的虚拟DOM生成子Fiber链表
  reconcileChildren(current, workInProgress, nextChildren)

  return workInProgress.child // 根据新的虚拟DOM计算新的子节点
}

function updateHostComponent(current, workInProgress) {
  return null
}

/**
 * 目标是根据新的虚拟DOM构建新的fiber子链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @returns
 */
export function beginWork(current, workInProgress) {
  logger('beginWork', workInProgress)
  switch (workInProgress.tag) {
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

#### processUpdateQueue

> 根据老状态和更新队列中的更新计算新状态

```js
// ReactFiberClassUpdateQueue
import { markUpdateLaneFromFiberToRoot } from "./ReactFiberCocurrentUpdates";
import assign from "shared/assign";

// 更新状态
const UpdateState = 0;

export function initializeUpdateQueue(fiber) {
  // 创建一个新的更新队列
  const queue = {
    shared: {
      pending: null, // 是循环链表
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = { tag: UpdateState };
  return update;
}

// 单向循环链表
export function enqueueUpdate(fiber, update) {
  // 获取当前fiber的更新队列
  const updateQueue = fiber.updateQueue;
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    // 第一次更新
    update.next = update;
  } else {
    // 第n次更新
    update.next = pending.next;
    pending.next = update;
  }
  // pending指向最后一个更新，最后一个更新的next指向第一个更新
  updateQueue.shared.pending = update;

  // 返回跟节点，从当前fiber一直到跟节点
  return markUpdateLaneFromFiberToRoot(fiber);
}

/**
 * 根据老状态和更新队列中的更新计算新状态
 * @param {*} workInProgress 要计算的Fiber
 */
+ export function processUpdateQueue(workInProgress) {
+  const queue = workInProgress.updateQueue;
+  const pendingQueue = queue.shared.pending;
+  // 如果有更新，或者说更新队列里有内容
+  if (pendingQueue !== null) {
+    // 清除等待生效的更新
+    queue.shared.pending = null;
+    // 获取更新队列中的最后一个更新 update = {payload: {element: h1}}
+    const lastPendingUpdate = pendingQueue;
+    // 让最后一个更新的next指向第一个更新
+    const firstPendingUpdate = lastPendingUpdate.next;
+    // 把循环链表剪开，变成单向链表
+    lastPendingUpdate.next = null;
+    // 获取老状态
+    let newState = workInProgress.memoizedState;
+    let update = firstPendingUpdate;
+    while (update) {
+      // 根据老状态和更新计算新状态
+      newState = getStateFromUpdate(update, newState);
+      update = update.next;
+    }
+    // 把最终计算到的状态赋值给memoizedState
+    workInProgress.memoizedState = newState;
+  }
+ }

/**
 * 根据老状态和更新计算新状态
 * @param {*} update 更新的对象其实有很多种类型
 * @param {*} prevState 老状态
 */
+ function getStateFromUpdate(update, prevState) {
+  switch (update.tag) {
+    case UpdateState:
+      // payload是一个对象，里面有新的状态
+      const { payload } = update;
+      return assign({}, prevState, payload);
+  }
+ }
```

#### createChildReconciler

> DOM-DIFF 用老的子 fiber 链表和新的虚拟 DOM 进行比较的过程

```js
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { createFiberFromElement } from './ReactFiber'
import { Placement } from './ReactFiberFlags'

/**
 *
 * @param {*} shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    // 因为我们现在实现的是初次挂载，那么老节点currentFirstFiber肯定是没有的，所以可以根据虚拟DOM创建fiber节点
    const created = createFiberFromElement(element)
    created.return = returnFiber
    return created
  }

  /**
   * 设置副作用（增删改）
   * @param {*} newFiber
   * @returns
   */
  function placeSingleChild(newFiber) {
    // 说明要添加副作用
    if (shouldTrackSideEffects) {
      // 要在提交阶段插入此节点
      // React渲染分为渲染（创建Fiber树）和提交（更新真实DOM）两个阶段
      newFiber.flags |= Placement // Placement 这个新fiber需要变成DOM，插入到dom中
    }
    return newFiber
  }

  /**
   * 比较子fiber
   * DOM-DIFF 用老的子fiber链表和新的虚拟DOM进行比较的过程
   * @param {*} returnFiber 新的父fiber
   * @param {*} currentFirstFiber 老fiber的第一个子fiber，current一般指的是老的意思
   * @param {*} newChild 新的子虚拟DOM （h1 虚拟DOM）
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    // 现在暂时考虑新的虚拟DOM只有一个的情况
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        // 如果是react元素
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            // 协调单节点
            reconcileSingleElement(returnFiber, currentFirstFiber, newChild),
          )
        default:
          break
      }
    }
  }

  return reconcileChildFibers
}

// 有老fiber更新的时候用这个
export const reconcileChildFibers = createChildReconciler(true)
// 如果没有老父fiber，节点初次挂载的的时候用这个
export const mountChildFibers = createChildReconciler(false)
```
