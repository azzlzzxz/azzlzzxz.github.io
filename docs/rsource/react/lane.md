# Lane 模型

`React`中用`lane(赛道)模型`来表示任务优先级，使用`31`位的二进制表示`31`条赛道，也就是一共有`31条`优先级，数字越小优先级越高，某些赛道的优先级相同。

::: tip `React` 里的优先级

- 赛道优先级（也就是本文的`lane`赛道模型）

  - 事件优先级（把赛道优先级的二进制通过`lanesToEventPriority`这个函数进行归并，转成对应的`Scheduler`优先级）[<u>源码地址 ｜ 事件优先级转成对应的调度优先级 ｜ react-reconciler/src/ReactEventPriorities.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactEventPriorities.js)

- [<u>`Scheduler`优先级</u>](/rsource/react/schedule.md)

:::

## `lane` 代表的优先级

> 这里只展示一些，完整的`lane`优先级标识可以看[<u>源码地址 ｜ lane 优先级标识</u>](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactFiberLane.js)

```js
xport const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;

export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000001;
export const SyncBatchedLane: Lane = /*                 */ 0b0000000000000000000000000000010;

export const InputDiscreteHydrationLane: Lane = /*      */ 0b0000000000000000000000000000100;
const InputDiscreteLanes: Lanes = /*                    */ 0b0000000000000000000000000011000;

const InputContinuousHydrationLane: Lane = /*           */ 0b0000000000000000000000000100000;
const InputContinuousLanes: Lanes = /*                  */ 0b0000000000000000000000011000000;

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000100000000;
export const DefaultLanes: Lanes = /*                   */ 0b0000000000000000000111000000000;

const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000001000000000000;
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111110000000000000;

const RetryLanes: Lanes = /*                            */ 0b0000011110000000000000000000000;

export const SomeRetryLane: Lanes = /*                  */ 0b0000010000000000000000000000000;

export const SelectiveHydrationLane: Lane = /*          */ 0b0000100000000000000000000000000;

const NonIdleLanes = /*                                 */ 0b0000111111111111111111111111111;

export const IdleHydrationLane: Lane = /*               */ 0b0001000000000000000000000000000;
const IdleLanes: Lanes = /*                             */ 0b0110000000000000000000000000000;

export const OffscreenLane: Lane = /*                   */ 0b1000000000000000000000000000000;
```

## 优先级相关计算

既然`lane`对应了二进制的位，那么优先级相关计算其实就是[<u>位运算 🚀</u>](/rsource/react/preknowledge.md#位运算符)

> 举几个源码中的 🌰

- 计算`a`、`b`两个`lane`是否存在交集，只需要判断`a`与`b`按位与的结果是否为`0`

```js
export function includesSomeLane(a: Lanes | Lane, b: Lanes | Lane) {
  return (a & b) !== NoLanes
}
```

- 计算`b`这个`lanes`是否是`a`对应的`lanes`的子集，只需要判断`a`与`b`按位与的结果是否为`b`

```js
export function isSubsetOfLanes(set: Lanes, subset: Lanes | Lane) {
  return (set & subset) === subset
}
```

- 将两个`lane`或`lanes`的位合并只需要执行按位或操作

```js
export function mergeLanes(a: Lanes | Lane, b: Lanes | Lane): Lanes {
  return a | b
}
```

- 从`set`对应`lanes`中移除`subset`对应`lane`（或`lanes`），只需要对`subset`的`lane`（或`lanes`）执行按位非，结果再对`set`执行按位与

```js
export function removeLanes(set: Lanes, subset: Lanes | Lane): Lanes {
  return set & ~subset
}
```

---

下面我们来看看 `React` 是如何使用 `lane` 的

## `createFiberRoot`

- `pendingLanes`: 表示此根上有哪些赛道等待被处理

```js
function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo

  // 表示此根上有哪些赛道等待被处理
  this.pendingLanes = NoLanes

  // 当前根节点上的任务
  this.callbackNode = null

  // 当前任务的优先级
  this.callbackPriority = NoLane
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo)
  const uninitializedFiber = createHostRootFiber()
  root.current = uninitializedFiber
  uninitializedFiber.stateNode = root

  // 初始化更新队列
  initializeUpdateQueue(uninitializedFiber)
  return root
}
```

## `initializeUpdateQueue`

- 在创建根 fiber 的初始化更新队列时，比[<u>更新队列里文章的 queue 多了 3 个参数</u>](/rsource/react/updateQueue.md#初始化更新队列)

  - `baseState`：本次更新前，当前的`fiber`的状态，更新会基于它，来进行计算状态

  - `firstBaseUpdate`：本次更新前，该`fiber`上保存的，上次跳过的更新的链表头

  - `lastBaseUpdate`：本次更新前，该`fiber`上保存的，上次跳过的更新的链尾部

这 3 个属性会在后面`processUpdateQueue`里用到

```js
export function initializeUpdateQueue(fiber) {
  // 创建一个新的更新队列
  const queue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null, // 是循环链表
    },
  }
  fiber.updateQueue = queue
}
```

## `updateContainer`

- 在更新容器时，会调用 requestUpdateLane 方法，用来获取一个更新赛道`lane`

- 把这个`lane`，放到更新队列里，并传入调度更新

```js{5,6}
export function updateContainer(element, container) {
  // 获取当前根fiber
  const current = container.current;

  // 请求一个更新赛道
  const lane = requestUpdateLane(current);

  // 创建更新
  const update = createUpdate(lane);

  // payload是要更新的虚拟DOM
  update.payload = { element };

  // 将update（更新对象）插入到当前fiber的更新队列中，返回根节点
  const root = enqueueUpdate(current, update, lane);

  scheduleUpdateOnFiber(root, current, lane);
}
```

### `requestUpdateLane`

- [<u>getEventPriority 🚀</u>](#事件优先级对lane赛道的归并)

```js
/********** react-reconciler/src/ReactFiberWorkLoop.js ***********/
export function requestUpdateLane() {
  // 更新赛道
  const updateLane = getCurrentUpdatePriority()
  if (updateLane !== NoLanes) {
    return updateLane
  }
  // 获取事件优先级
  const eventLane = getCurrentEventPriority()
  return eventLane
}

/********** react-dom-bindings/src/ReactHostConfig.js ***********/
// 获取当前事件优先级
export function getCurrentEventPriority() {
  const currentEvent = window.event
  if (currentEvent === undefined) {
    return DefaultEventPriority
  }
  return getEventPriority(currentEvent.type)
}
```

### `createUpdate`

```js
export function createUpdate(lane) {
  const update = { tag: UpdateState, lane, next: null }
  return update
}
```

### `enqueueUpdate`

```js
export function enqueueUpdate(fiber, update, lane) {
  // 获取当前fiber的更新队列
  const updateQueue = fiber.updateQueue
  //获取共享队列
  const sharedQueue = updateQueue.shared
  return enqueueConcurrentClassUpdate(fiber, sharedQueue, update, lane)
}
```

### `enqueueConcurrentClassUpdate`

- `enqueueUpdate`方法和`getRootForUpdatedFiber`方法，可以看[<u>这里 🚀</u>](/rsource/react/useReducer.md#reactfiberconcurrentupdatesjs)

```js
/**
 * 把更新入队
 * @param {*} fiber 入队的fiber 根fiber
 * @param {*} queue shareQueue 待生效的队列
 * @param {*} update 更新
 * @param {*} lane 此更新的赛道
 */
export function enqueueConcurrentClassUpdate(fiber, queue, update, lane) {
  enqueueUpdate(fiber, queue, update, lane)
  return getRootForUpdatedFiber(fiber)
}
```

## 事件优先级对`lane赛道`的归并

- 事件优先级有四种

  - `DiscreteEventPriority = SyncLane`：离散事件优先级(例如：`click`、`onchange`) 对应 SyncLane 同步优先级 为 1

  - `ContinuousEventPriority = InputContinuousLane`：连续事件的优先级（例如：`mousemove`） 对应 InputContinuousLane 为 4

  - `DefaultEventPriority = DefaultLane`：默认事件优先级 对应 DefaultLane 默认赛道 为 16

  - `IdleEventPriority = IdleLane`：空闲事件优先级 对应 IdleLane

> 源码地址 [<u>原生事件对应的事件优先级 | getEventPriority </u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-dom-bindings/src/events/ReactDOMEventListener.js#L290)

```js
/**
 * 获取事件优先级
 * @param {*} domEventName 事件的名称
 */
export function getEventPriority(domEventName) {
  switch (domEventName) {
    case 'click':
      return DiscreteEventPriority
    case 'drag':
      return ContinuousEventPriority
    // ... 此处省略大量代码
    default:
      return DefaultEventPriority
  }
}
```

`lanesToEventPriority`把`lane`转成对应的事件优先级

> 源码地址 [<u>lanesToEventPriority | react-reconciler/src/ReactEventPriorities.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactEventPriorities.js#L55)

```js
/**
 * 获取最高优先级的lane
 * 判断eventPriority是不是比lane要小，更小意味着优先级更高
 * @param {*} eventPriority
 * @param {*} lane
 * @returns
 */
export function isHigherEventPriority(eventPriority, lane) {
  return eventPriority !== 0 && eventPriority < lane
}

export function lanesToEventPriority(lanes) {
  let lane = getHighestPriorityLane(lanes)

  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority //1
  }

  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority //4
  }

  if (includesNonIdleWork(lane)) {
    return DefaultEventPriority //16
  }

  return IdleEventPriority
}
```

在执行注册任务调度（`ensureRootIsScheduled`）的时候、找到对应的`scheduler`优先级

## `ReactFiberLane.js`

`ReactFiberLane.js`这个文件存放着，`lane`的优先级的值，和处理优先级的一些函数

```js
import { allowConcurrentByDefault } from 'shared/ReactFeatureFlags'

export const TotalLanes = 31
export const NoLanes = 0b0000000000000000000000000000000
export const NoLane = 0b0000000000000000000000000000000
export const SyncLane = 0b0000000000000000000000000000001
export const InputContinuousHydrationLane = 0b0000000000000000000000000000010
export const InputContinuousLane = 0b0000000000000000000000000000100
export const DefaultHydrationLane = 0b0000000000000000000000000001000
export const DefaultLane = 0b0000000000000000000000000010000
export const SelectiveHydrationLane = 0b0001000000000000000000000000000
export const IdleHydrationLane = 0b0010000000000000000000000000000
export const IdleLane = 0b0100000000000000000000000000000
export const OffscreenLane = 0b1000000000000000000000000000000
const NonIdleLanes = 0b0001111111111111111111111111111
// ... 省略其他优先级

//没有时间戳
export const NoTimestamp = -1

export function markRootUpdated(root, updateLane) {
  // pendingLanes指的此根上等待生效的lane
  root.pendingLanes |= updateLane
}

export function getNextLanes(root, wipLanes) {
  // 先获取所有的有更新的赛道
  const pendingLanes = root.pendingLanes

  if (pendingLanes == NoLanes) {
    return NoLanes
  }
  // 获取所有的赛道中最高优先级的赛道
  const nextLanes = getHighestPriorityLanes(pendingLanes)

  if (wipLanes !== NoLane && wipLanes !== nextLanes) {
    // 新的赛道值比渲染中的赛道大，说明新的赛道优先级更低
    if (nextLanes > wipLanes) {
      return wipLanes
    }
  }

  return nextLanes
}

export function getHighestPriorityLanes(lanes) {
  return getHighestPriorityLane(lanes)
}

// 找到最右边的1 只能返回一个赛道
export function getHighestPriorityLane(lanes) {
  return lanes & -lanes
}

// 判断是否有非空闲工作
export function includesNonIdleWork(lanes) {
  return (lanes & NonIdleLanes) !== NoLanes
}

export function isSubsetOfLanes(set, subset) {
  return (set & subset) === subset
}

export function mergeLanes(a, b) {
  return a | b
}

export function includesBlockingLane(root, lanes) {
  // 如果允许默认并发渲染
  if (allowConcurrentByDefault) {
    return false
  }

  // 同步默认赛道
  const SyncDefaultLanes = InputContinuousLane | DefaultLane
  return (lanes & SyncDefaultLanes) !== NoLane
}
```

## `lane` 在事件中的处理

- 以点击事件为例，当用户点击按钮时，在派发离散的事件的的监听函数中需要设置`lane`（更新优先级）

```js
/**
 * 当你点击按钮的时候，需要设置更新优先级
 * 派发离散的事件的的监听函数（离散事件： 不会连续触发的事件）
 * @param {*} domEventName 事件名 click
 * @param {*} eventSystemFlags 阶段 0 冒泡 4 捕获
 * @param {*} container 容器div#root
 * @param {*} nativeEvent 原生的事件
 */
function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
  // 先获取当前老的更新优先级
  const previousPriority = getCurrentUpdatePriority()
  try {
    //把当前的更新优先级设置为离散事件优先级 1
    setCurrentUpdatePriority(DiscreteEventPriority)
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent)
  } finally {
    setCurrentUpdatePriority(previousPriority)
  }
}
```

## `lane` 在任务调度中的处理

```js
// 当前正在指定的渲染优先级
let workInProgressRootRenderLanes = NoLanes
//构建fiber树正在进行中
const RootInProgress = 0
//构建fiber树已经完成
const RootCompleted = 5
//当渲染工作结束的时候当前的fiber树处于什么状态,默认进行中
let workInProgressRootExitStatus = RootInProgress

export function scheduleUpdateOnFiber(root, fiber, lane) {
  markRootUpdated(root, lane)
  // 确保调度执行root上的更新
  ensureRootIsScheduled(root)
}

// 标记当前根节点上等待更新的lane
export function markRootUpdated(root, updateLane) {
  // pendingLanes指的此根上等待生效的lane
  root.pendingLanes |= updateLane
}
```

### `ensureRootIsScheduled`

在`ensureRootIsScheduled`函数中通过判断当前优先级是否是`SyncLane`（同步优先级），来执行不同的逻辑：

- 同步渲染：把`performSyncWorkOnRoot`函数，放入同步队列里，在清空微任务时（[<u>queueMicrotask | MDN</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/queueMicrotask)），执行同步队列里的任务

- 并发渲染：把`事件优先级`对应的`lane赛道优先级`对应到`scheduler`优先级，开始任务调度，执行回调（`performConcurrentWorkOnRoot`）

> 流程图

![isSyncLane](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/isSyncLane.jpg)

```js
function ensureRootIsScheduled(root) {
  // 获取当前优先级最高的赛道
  const nextLanes = getNextLanes(root, workInProgressRootRenderLanes)

  //如果没有要执行的任务
  if (nextLanes === NoLanes) {
    return
  }

  // 获取新的调度优先级
  const newCallbackPriority = getHighestPriorityLane(nextLanes)

  //获取现在根上正在运行的优先级
  const existingCallbackPriority = root.callbackPriority

  //如果新的优先级和老的优先级一样，则可以进行批量更新
  if (existingCallbackPriority === newCallbackPriority) {
    return
  }

  //新的回调任务
  let newCallbackNode = null

  // 如果新的优先级是同步的话
  if (newCallbackPriority === SyncLane) {
    // 先把performSyncWorkOnRoot添回到同步队列中
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))

    // 再把flushSyncCallbacks放入微任务
    queueMicrotask(flushSyncCallbacks)

    // 如果是同步执行的话
    newCallbackNode = null
  } else {
    //如果不是同步，就需要调度一个新的任务
    let schedulerPriorityLevel
    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority
        break
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority
        break
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority
        break
      case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority
        break
      default:
        schedulerPriorityLevel = NormalSchedulerPriority
        break
    }

    Scheduler_scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root))
  }
  // 在根节点上执行的任务是newCallbackNode
  root.callbackNode = newCallbackNode

  root.callbackPriority = newCallbackPriority
}
```

#### `getNextLanes`

- `getNextLanes`函数：获取当前根节点上等待更新的所有赛道中，优先级最高的赛道，和当前渲染中的赛道进行对比，那个优先级高，返回那个赛道

```js
// 获取当前根节点上等待更新的所有赛道中，优先级最高的赛道
export function getNextLanes(root, wipLanes) {
  //先获取所有的有更新的赛道
  const pendingLanes = root.pendingLanes
  if (pendingLanes == NoLanes) {
    return NoLanes
  }

  // 获取所有的赛道中最高优先级的赛道
  const nextLanes = getHighestPriorityLanes(pendingLanes)

  if (wipLanes !== NoLane && wipLanes !== nextLanes) {
    // 新的赛道值比渲染中的车道大，说明新的赛道优先级更低
    if (nextLanes > wipLanes) {
      return wipLanes
    }
  }

  return nextLanes
}

// 获取所有的赛道中最高优先级的赛道
export function getHighestPriorityLanes(lanes) {
  return getHighestPriorityLane(lanes)
}

//找到最右边的1 只能返回一个赛道
export function getHighestPriorityLane(lanes) {
  return lanes & -lanes
}
```

#### `ReactFiberSyncTaskQueue`

- `scheduleSyncCallback`：向同步队列里添加同步任务

- `flushSyncCallbacks`：执行同步队列里的同步任务

```js
import {
  DiscreteEventPriority,
  getCurrentUpdatePriority,
  setCurrentUpdatePriority,
} from './ReactEventPriorities'

// 同步队列
let syncQueue = null
// 是否正在执行同步队列
let isFlushingSyncQueue = false

// 向同步队列里添加同步任务
export function scheduleSyncCallback(callback) {
  if (syncQueue === null) {
    syncQueue = [callback]
  } else {
    syncQueue.push(callback)
  }
}

// 执行同步任务
export function flushSyncCallbacks() {
  if (!isFlushingSyncQueue && syncQueue !== null) {
    isFlushingSyncQueue = true
    let i = 0
    // 暂存当前的更新优先级
    const previousUpdatePriority = getCurrentUpdatePriority()
    try {
      const isSync = true
      const queue = syncQueue

      //把优先级设置为同步优先级
      setCurrentUpdatePriority(DiscreteEventPriority)
      for (; i < queue.length; i++) {
        let callback = queue[i]
        do {
          callback = callback(isSync)
        } while (callback !== null)
      }
      syncQueue = null
    } finally {
      setCurrentUpdatePriority(previousUpdatePriority)
      isFlushingSyncQueue = false
    }
  }
}
```

### 同步渲染

同步渲染意味着，一旦开始渲染就无法中断，直到用户可以在屏幕上看到渲染结果。

#### `performSyncWorkOnRoot`

```js
function performSyncWorkOnRoot(root) {
  //获得最高优的lane
  const lanes = getNextLanes(root)

  //渲染新的fiber树
  renderRootSync(root, lanes)

  //获取新渲染完成的fiber根节点
  const finishedWork = root.current.alternate

  root.finishedWork = finishedWork

  commitRoot(root)

  return null
}
```

#### `renderRootSync`

```js
function renderRootSync(root, renderLanes) {
  //如果新的根和老的根不一样，或者新的渲染优先级和老的渲染优先级不一样
  if (root !== workInProgressRoot || workInProgressRootRenderLanes !== renderLanes) {
    prepareFreshStack(root, renderLanes)
  }

  workLoopSync()

  // 构建fiber树已经完成标识 = 5
  return RootCompleted
}
```

#### `workLoopSync` 开始工作循环

```js
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}
```

### 并发渲染

并发模式的一个关键特性是渲染可中断。

::: tip 渲染可中断

- 当`shouldYield`为`true`，以至于`performUnitOfWork`被中断后是如何重新启动的呢？

`performConcurrentWorkOnRoot`函数末尾有这段代码，在`root.callbackNode === originalCallbackNode`条件下，会把函数本身作为返回值

```js
if (root.callbackNode === originalCallbackNode) {
  return performConcurrentWorkOnRoot.bind(null, root)
}
```

> 源码地址 [<u>performConcurrentWorkOnRoot return getContinuationForRoot </u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberWorkLoop.js#L1008)
>
> 源码地址 [<u>getContinuationForRoot | react-reconciler/src/ReactFiberRootScheduler.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberRootScheduler.js#L401)

:::

#### `performConcurrentWorkOnRoot`

> 源码地址 [performConcurrentWorkOnRoot | react-reconciler/src/ReactFiberWorkLoop.js](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberWorkLoop.js#L867)

- 根据`shouldTimeSlice`，来判断是否可以进行时间切片

  - `true`：进行并发渲染，也就是可中断执行，调用`renderRootConcurrent`函数
  - `false`：进行同步渲染，调用`renderRootSync`函数

- 根据`renderRootConcurrent`和`renderRootSync`的返回状态`exitStatus`，判断是否渲染完成，执行提交

```js
function performConcurrentWorkOnRoot(root, didTimeout) {
  // 先获取当前根节点上的任务
  const originalCallbackNode = root.callbackNode

  // 获取当前优先级最高的赛道
  const lanes = getNextLanes(root, NoLanes)
  if (lanes === NoLanes) {
    return null
  }

  /** 如果不包含阻塞的赛道，并且没有超时，就可以并行渲染,就是启用时间分片，所以说默认更新赛道是同步的,不能启用时间分片 */

  // 是否不包含阻塞赛道
  const nonIncludesBlockingLane = !includesBlockingLane(root, lanes)
  // 是否不包含过期的赛道
  const nonIncludesExpiredLane = !includesExpiredLane(root, lanes)
  // 时间片没有过期
  const nonTimeout = !didTimeout

  // 三个变量都是真，才能进行时间分片，也就是进行并发渲染，也就是可以中断执行
  const shouldTimeSlice = nonIncludesBlockingLane && nonIncludesExpiredLane && nonTimeout

  // 执行渲染，得到退出的状态
  const exitStatus = shouldTimeSlice
    ? renderRootConcurrent(root, lanes)
    : renderRootSync(root, lanes)

  // 如果不是渲染中的话，那说明肯定渲染完了
  if (exitStatus !== RootInProgress) {
    const finishedWork = root.current.alternate
    root.finishedWork = finishedWork
    commitRoot(root)
  }

  // 说明任务没有完成
  if (root.callbackNode === originalCallbackNode) {
    // 把此函数返回，下次接着执行
    return performConcurrentWorkOnRoot.bind(null, root)
  }

  return null
}
```

#### `renderRootConcurrent`

- 因为在构建`fiber树`的过程中，此方法会反复进入，会进入多次，所以需要判断，只有在第一次进来的时候会创建新的 fiber 树

```js
function renderRootConcurrent(root, lanes) {
  // 只有在第一次进来的时候会创建新的fiber树，或者说新fiber
  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    prepareFreshStack(root, lanes)
  }

  //在当前分配的时间片(5ms)内执行fiber树的构建或者说渲染，
  workLoopConcurrent()

  //如果 workInProgress不为null，说明fiber树的构建还没有完成
  if (workInProgress !== null) {
    return RootInProgress
  }

  //如果workInProgress是null了说明渲染工作完全结束了
  return workInProgressRootExitStatus // 0
}
```

#### `workLoopConcurrent`

- `React`在开启`Concurrent Mode`时，每次遍历前，都会通过`Scheduler`提供的`shouldYield`方法判断是否需要中断遍历，使浏览器有时间渲染

- 是否中断的依据，最重要的一点便是每个任务的剩余时间是否用完，你在这里看到[<u>shouldYield 方法的实现 🚀</u>](/rsource/react/schedule.md)

```js
function workLoopConcurrent() {
  // 如果有下一个要构建的fiber并且时间片没有过期
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

### `processUpdateQueue` 处理更新队列

- 在处理更新队列（让更新生效时，也就是用老状态，依次计算`update`得到新状态），需要指定一个渲染优先级`（renderLanes）`

- 判断`update`的优先级`updateLane`，和`renderLanes`渲染优先级，如果`updateLane`不是`renderLanes`的子集的话，说明本次渲染不需要处理过个更新，就是需要跳过此更新

- **<font color="#FF9D00">执行完高优先级`（updateLane <= renderLane）`的更新后，再执行低优先级的更新，这时就需要把低优先级的更新，存起来。（但是更新的顺序和结果的顺序永远是一致的，只是会先执行高优操作，高优操作可能会执行多次）</font>**

- 这时就会用到我们在初始化时，添加的那 3 个属性：

  - `baseState`：本次更新前，当前的`fiber`的状态，更新会基于它，来进行计算状态

  - `firstBaseUpdate`：本次更新前，该`fiber`上保存的，上次跳过的更新的链表头

  - `lastBaseUpdate`：本次更新前，该`fiber`上保存的，上次跳过的更新的链尾部

> 处理更新流程

- 合并新老链表为单链表

> 流程图 1

![processUpdateQueue_1](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/processUpdateQueue_1.jpg)

> 流程图 2

![processUpdateQueue_2](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/processUpdateQueue_2.jpg)

- 更新状态

```js
export function processUpdateQueue(workInProgress, nextProps, renderLanes) {
  const queue = workInProgress.updateQueue

  // 老链表头
  let firstBaseUpdate = queue.firstBaseUpdate

  // 老链表尾巴
  let lastBaseUpdate = queue.lastBaseUpdate

  // 新链表尾部
  const pendingQueue = queue.shared.pending

  // 合并新老链表为单链表
  if (pendingQueue !== null) {
    queue.shared.pending = null

    // 新链表尾部
    const lastPendingUpdate = pendingQueue

    // 新链表头部
    const firstPendingUpdate = lastPendingUpdate.next

    // 把老链表剪断，变成单链表
    lastPendingUpdate.next = null

    // 如果没有老链表
    if (lastBaseUpdate === null) {
      // 指向新的链表头
      firstBaseUpdate = firstPendingUpdate
    } else {
      lastBaseUpdate.next = firstPendingUpdate
    }
    lastBaseUpdate = lastPendingUpdate
  }

  // 如果老链表不为空
  if (firstBaseUpdate !== null) {
    // 上次跳过的更新前的状态
    let newState = queue.baseState

    // 尚未执行的更新的lane
    let newLanes = NoLanes
    let newBaseState = null
    let newFirstBaseUpdate = null
    let newLastBaseUpdate = null
    let update = firstBaseUpdate

    do {
      // 获取此更新赛道
      const updateLane = update.lane

      // 如果updateLane不是renderLanes的子集的话，说明本次渲染不需要处理过个更新，就是需要跳过此更新
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // 把此更新克隆一份
        const clone = {
          id: update.id,
          lane: updateLane,
          payload: update.payload,
        }

        // 如果新的跳过的base链表为空,说明当前这个更新是第一个跳过的更新
        if (newLastBaseUpdate === null) {
          // 让新的跳过的链表头和链表尾都指向这个第一次跳过的更新
          newFirstBaseUpdate = newLastBaseUpdate = clone

          // 计算保存新的baseState为此跳过更新时的state
          newBaseState = newState
        } else {
          newLastBaseUpdate = newLastBaseUpdate.next = clone
        }

        // 如果有跳过的更新，就把跳过的更新所在的赛道合并到newLanes,最后会把newLanes赋给fiber.lanes
        newLanes = mergeLanes(newLanes, updateLane)
      } else {
        // 说明已经有跳过的更新了
        if (newLastBaseUpdate !== null) {
          const clone = {
            id: update.id,
            lane: 0,
            payload: update.payload,
          }
          newLastBaseUpdate = newLastBaseUpdate.next = clone
        }
        newState = getStateFromUpdate(update, newState, nextProps)
      }
      update = update.next
    } while (update)

    // 如果没能跳过的更新的话
    if (!newLastBaseUpdate) {
      newBaseState = newState
    }

    queue.baseState = newBaseState
    queue.firstBaseUpdate = newFirstBaseUpdate
    queue.lastBaseUpdate = newLastBaseUpdate
    workInProgress.lanes = newLanes

    // 本次渲染完会判断，此fiber上还有没有不为0的lane,如果有，会再次渲染
    workInProgress.memoizedState = newState
  }
}
```

## 批量更新

- 批量更新就是判断新老优先级是否相同，相同的话，就不再产生新的调度任务了，其他的更新，复用老的任务调度（任务调度是宏任务，在下次执行时，把所有更新都处理了）**同步添加、异步调用**
  - 复用老任务，就创建一次 fiber 树、commit 提交一次，就不会进行多次任务调度，提高性能了。

```js
function ensureRootIsScheduled(root, currentTime) {
  // ... 省略大量代码

  //获取新的调度优先级
  let newCallbackPriority = getHighestPriorityLane(nextLanes)

  // 获取现在根上正在运行的优先级
  const existingCallbackPriority = root.callbackPriority

  // 如果新的优先级和老的优先级一样，则可以进行批量更新
  if (existingCallbackPriority === newCallbackPriority) {
    return
  }

  // ... 省略大量代码
  root.callbackPriority = newCallbackPriority
}
```

## 高优先级操作打断低优先级

### `main.jsx` 举例

- 需要两个优先级，`按钮点击事件`优先级为`1`，`useEffect`执行优先级是`DefaultLanes`为`16`，在`useEffect`里没有渲染完成之前，点击按钮

```jsx
import * as React from './react'
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

function FunctionComponent() {
  const [numbers, setNumbers] = React.useState(new Array(19).fill('A'))

  React.useEffect(() => {
    setTimeout(() => {}, 10)

    setNumbers((numbers) => numbers.map((number) => number + 'B'))
  }, [])

  return (
    <button
      onClick={() => {
        setNumbers((number) => number + 'C')
      }}
    >
      {numbers.map((number, index) => (
        <span key={index}>{number}</span>
      ))}
    </button>
  )
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

### `cancelCallback` 取消任务

```js
function ensureRootIsScheduled(root, currentTime) {
  // 先获取当前根上执行任务
  const existingCallbackNode = root.callbackNode

  // ... 省略大量代码

  if (existingCallbackNode !== null) {
    Scheduler_cancelCallback(existingCallbackNode)
  }
}
```

### `commitRootImpl`

```js
function commitRootImpl(root) {
  // ... 省略大量代码

  //在提交之后，因为根上可能会有跳过的更新，所以需要重新再次调度
  ensureRootIsScheduled(root)
}
```

::: tip 源码地址

实现`lane`同步渲染和并发渲染的相关代码我放在了[<u>15.lane 分支里了 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/15.lane)
:::
