# scheduleUpdateOnFiber 调度更新

在 `updateContainer` 中，我们创建了一个 `update` 对象，然后将其添加到更新队列中，接下来就是调用 `scheduleUpdateOnFiber` 进行更新（这也是 `render` 阶段的入口）

> 从调度更新 `scheduleUpdateOnFiber` 到 提交更新 `commitRoot` 流程图

![scheduleUpdateOnFiber](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/scheduleUpdateOnFiber.jpg)

---

代码里关于`lane(赛道模型)`的，可以看这里 [<u>React | lane 模型 🚀</u>](/rsource/react/lane.md)

---

> 入口 `ReactFiberReconciler.js`

```js {30}
// 创建容器
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo)
}

/**
 * 更新容器 把虚拟DOM，element转换成真实DOM插入到container容器中
 * @param {*} element 虚拟DOM
 * @param {*} container 容器 FiberRootNode
 */
export function updateContainer(element, container) {
  // 获取当前根fiber (HostRootFiber)
  const current = container.current

  // 请求事件发生时间
  const eventTime = requestEventTime()

  // 请求一个更新车道
  const lane = requestUpdateLane(current)

  // 创建更新
  const update = createUpdate(lane)

  // payload是要更新的虚拟DOM
  update.payload = { element }

  // 将update（更新对象）插入到当前fiber的更新队列中，返回根节点
  const root = enqueueUpdate(current, update, lane)

  scheduleUpdateOnFiber(root, current, lane)
}
```

## `scheduleUpdateOnFiber` 调度更新

> 源码地址 [<u>scheduleUpdateOnFiber ｜ react-reconciler/src/ReactFiberWorkLoop.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberWorkLoop.js#L716)

```js {16-25}
// ReactFiberWorkLoop.js

// 正在进行中的任务
let workInProgress = null
// 当前正在调度的跟节点
let workInProgressRoot = null
// 此根节点上有没有useEffect的类似副作用
let rootDoesHavePassiveEffect = false
// 具有useEffect副作用的跟节点（FiberRootNode，根fiber.stateNode）
let rootWithPendingPassiveEffects = null
// 当前正在指定的渲染优先级
let workInProgressRootRenderLanes = NoLanes
// 保存当前的事件发生的时间
let currentEventTime = NoTimestamp

/**
 * 计划更新root
 * @param {*} root
 */
export function scheduleUpdateOnFiber(root, fiber, lane, eventTime) {
  // 标记当前根节点上等待更新的lane
  markRootUpdated(root, lane)
  // 确保调度执行root上的更新
  ensureRootIsScheduled(root, eventTime)
}
```

## `ensureRootIsScheduled`用于注册调度任务

`ensureRootIsScheduled` 函数用于注册调度任务，其大致流程如下：

- 判断是否需要注册新的调度（如果无需新的调度，会退出函数）

- 注册调度任务（[<u>关于 React 的 任务调度可以看这里 🚀</u>](/rsource/react/schedule.md)）

  - 将 `performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot` 添加到调度队列（`scheduleCallback`）中

  - 等待调度中心执行 `performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`

::: tip `performSyncWorkOnRoot` 和 `performConcurrentWorkOnRoot`

- 在 `sync` 同步模式下会执行 `performSyncWorkOnRoot`
- 在 `concurrent` 并发模式下会执行 `performConcurrentWorkOnRoot`

这两个函数的作用是执行 `render` 阶段和 `commit` 阶段

也就是根据`虚拟DOM`构建`fiber树`，要创建真实的`DOM`节点，还需要把真实的`DOM`节点插入容器

:::

```js {37-69}
function ensureRootIsScheduled(root) {
  // 先获取当前根上执行任务
  const existingCallbackNode = root.callbackNode

  // 把所有饿死的赛道标记为过期
  markStarvedLanesAsExpired(root, currentTime)

  //获取当前优先级最高的车道
  const nextLanes = getNextLanes(root, workInProgressRootRenderLanes)

  //如果没有要执行的任务
  if (nextLanes === NoLanes) {
    root.callbackNode = null
    root.callbackPriority = NoLane
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

  if (existingCallbackNode !== null) {
    console.log('cancelCallback')
    Scheduler_cancelCallback(existingCallbackNode)
  }

  // 新的回调任务
  let newCallbackNode = null

  // 如果新的优先级是同步的话
  if (newCallbackPriority === SyncLane) {
    //先把performSyncWorkOnRoot添回到同步队列中
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))
    //再把flushSyncCallbacks放入微任务
    queueMicrotask(flushSyncCallbacks)
    //如果是同步执行的话
    newCallbackNode = null
  } else {
    //如果不是同步，就需要调度一个新的任务
    let schedulerPriorityLevel
    // lanesToEventPriority 方法 是把赛道优先级转成事件优先级
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

    // 将 performConcurrentWorkOnRoot 添加到调度队列中
    Scheduler_scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root))
  }

  // 在根节点上执行的任务是newCallbackNode
  root.callbackNode = newCallbackNode

  root.callbackPriority = newCallbackPriority
}
```

> 构建 `Fiber Tree`

![fiber_tree](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/fiber_tree.jpg)

## `sync`同步模式

- `performSyncWorkOnRoot`

- `renderRootSync`

- `prepareFreshStack`

- `workLoopSync`

### `performSyncWorkOnRoot` 执行同步工作

在 `sync` 并发模式下会执行 `performSyncWorkOnRoot`

- `return null`： `flushSyncCallbacks` 里的 `callback` 根据是否为`null`，来`中断循环`（[`flushSyncCallbacks 可以看这里`](/rsource/react/lane.md#reactfibersynctaskqueue)）

```js
function performSyncWorkOnRoot(root) {
  // 获得最高优的lane
  const lanes = getNextLanes(root)

  // 渲染新的fiber树(第一次渲染是以同步的方式渲染根节点，初次渲染的时候，都是同步的)
  renderRootSync(root, lanes)

  // 获取新渲染完成的fiber根节点
  const finishedWork = root.current.alternate

  root.finishedWork = finishedWork

  commitRoot(root)

  // flushSyncCallbacks 里的 callback 根据是否为null，来中断循环
  return null
}
```

### `renderRootSync`

```js
function renderRootSync(root, renderLanes) {
  // 如果新的根和老的根不一样，或者新的渲染优先级和老的渲染优先级不一样
  if (root !== workInProgressRoot || workInProgressRootRenderLanes !== renderLanes) {
    prepareFreshStack(root, renderLanes)
  }

  workLoopSync()

  return RootCompleted
}
```

### `workLoopSync`

- `workLoopSync`：开始同步模式的工作循环

- `workLoopSync` 函数会一直执行 `performUnitOfWork` 函数，直到 `workInProgress === null`，表示没有正在进行的渲染

```js
function workLoopSync() {
  while (workInProgress !== null) {
    // 执行工作单元
    performUnitOfWork(workInProgress)
  }
}
```

## `concurrent`并发模式

### `performConcurrentWorkOnRoot`执行并发工作

在 `concurrent` 并发模式下会执行 `performConcurrentWorkOnRoot`

```js
function performConcurrentWorkOnRoot(root, didTimeout) {
  // 先获取当前根节点上的任务
  const originalCallbackNode = root.callbackNode

  //获取当前优先级最高的车道
  const lanes = getNextLanes(root, NoLanes)

  if (lanes === NoLanes) {
    return null
  }

  //是否不包含阻塞车道
  const nonIncludesBlockingLane = !includesBlockingLane(root, lanes)
  //是否不包含过期的车道
  const nonIncludesExpiredLane = !includesExpiredLane(root, lanes)
  //时间片没有过期
  const nonTimeout = !didTimeout

  //三个变量都是真，才能进行时间分片，也就是进行并发渲染，也就是可以中断执行
  const shouldTimeSlice = nonIncludesBlockingLane && nonIncludesExpiredLane && nonTimeout

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

### `renderRootConcurrent`

```js
function renderRootConcurrent(root, lanes) {
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
  return workInProgressRootExitStatus
}
```

### `workLoopConcurrent`

`workLoopConcurrent` 函数在 `workLoopSync` 的基础上增加了 `shouldYield` 的判断

`shouldYield` 函数会判断当前是否有剩余时间，如果没有剩余时间，就会返回 `true` 表示需要中断当前任务

```js
function workLoopConcurrent() {
  // 如果有下一个要构建的fiber并且时间片没有过期
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

## `prepareFreshStack`

- 因为在构建`fiber树`的过程中，`renderRootSync`和`renderRootConcurrent`会反复进入，所以只有在第一次进来的时候会创建新的`fiber树`，或者说`新fiber`

```js
// 创建一个新栈
function prepareFreshStack(root, renderLanes) {
  // 创建根节点的新fiber
  workInProgress = createWorkInProgress(root.current, null)

  // 把新的渲染优先级 赋值给 workInProgressRootRenderLanes
  workInProgressRootRenderLanes = renderLanes

  // 当前正在调度的跟节点 就是 根节点 div #root
  workInProgressRoot = root

  finishQueueingConcurrentUpdates() // 在工作循环之前完成更新队列的收集
}
```

> 打印一下 `workInProgress`

![createWorkInProgress](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/createWorkInProgress.jpg)

### `createWorkInProgress` 基于老的`fiber`和新的属性，创建新的`fiber`

```js {7-53}
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

    workInprogress.deletions = null;
  }

  workInprogress.child = current.child;
  workInprogress.memoizedProps = current.memoizedProps;
  workInprogress.memoizedState = current.memoizedState;
  workInprogress.updateQueue = current.updateQueue;
  workInprogress.sibling = current.sibling;
  workInprogress.index = current.index;
  workInprogress.ref = current.ref;
  workInprogress.flags = current.flags;
  workInprogress.lanes = current.lanes;
  workInprogress.childLanes = current.childLanes;

  return workInprogress;
}
```

## `performUnitOfWork` 执行工作单元

> 源码地址 [performUnitOfWork ｜ react-reconciler/src/ReactFiberWorkLoop.js](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactFiberWorkLoop.js#L2500)

- `current` 表示当前页面正在使用的 `Fiber 节点`，即 `workInProgress.alternate`

- `workInProgress` 表示当前正在构建的 `Fiber 节点`

::: tip `performUnitOfWork` 工作流程

- 调用 `beginWork` 函数，进入 `“递”` 阶段
  - 根据传入的 `Fiber 节点` 创建 `子 Fiber 节点`
- 调用 `completeUnitOfWork` 函数，进入 `“归”` 阶段
  - 调用 `completeWork` 函数对创建好的 `Fiber 节点` 进行处理
- 更新 `workInProgress` 指针，指向下一个 `Fiber 节点`
  :::

```js {5-21}
let workInProgress = null;

...

function performUnitOfWork(unitOfWork) {
  // 获取新的fiber对应的老fiber
  const current = unitOfWork.alternate;
  // 完成当前fiber的子fiber链表构建后
  const next = beginWork(current, unitOfWork, workInProgressRootRenderLanes);
  // 把待生效属性变成已生效
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // 如果没有子节点，表示当前fiber已经完成了
    completeUnitOfWork(unitOfWork);
  } else {
    // 如果有子节点，就让子节点成为下一个工作单元
    workInProgress = next;
  }
}
```

> `Fiber 树`的结构

![begin_work](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/begin_work.jpg)

::: tip `Fiber 树` 的构建

整个 `Fiber 树` 的构建是一个深度优先遍历，其中的两个重要变量 `workInProgress` 和 `current` 即之前说的 [Fiber 双缓存机制](/rsource/react/introduce.md#fiber-双缓存)

- `workInProgress` 和 `current` 都是一个指针
- `workInProgress` 表示当前正在构建的 `Fiber 节点`
- `current = workInProgress.alternate` （即 `fiber.alternate`）表示当前页面正在使用的 `Fiber 节点`
  - 初次构建时页面还未渲染，此时 `current = null`

在深度优先遍历中每个 `Fiber 节点` 都会经历两个阶段

- `“递”`阶段 `beginWork`
- `“归”`阶段 `completeWork`

这两个阶段共同完成了每一个 `Fiber 节点` 的创建, 所有 `Fiber 节点` 连接起来就是一棵 `Fiber 树`
:::

::: info 相关资料

- [render 阶段 流程](https://react.iamkasong.com/process/reconciler.html)

:::
