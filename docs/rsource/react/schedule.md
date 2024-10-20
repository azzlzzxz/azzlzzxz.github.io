# Scheduler 调度器

`Scheduler`他包含两个功能：

- 时间切片

- 优先级调度

## 时间切片

时间切片的本质是模拟实现[<u>requestIdleCallback</u>](/base/browser/api.md#requestidlecallback)

::: tip 那`React`为什么不使用 `requestIdleCallback` ？

- 浏览器兼容性
- 执行任务的帧空闲时间不可控
- 触发频率不稳定，受很多因素影响

基于以上原因，`React`实现了功能更完备的`requestIdleCallback` `polyfill`，这就是`Scheduler`
:::

`Scheduler`的时间切片功能是通过`task`（宏任务）实现的

最常见的`task`当属`setTimeout`了。但是有个`task`比`setTimeout`执行时机更靠前，那就是`MessageChannel`。

所以`Scheduler`将需要被执行的回调函数作为`MessageChannel`的回调执行。如果当前宿主环境不支持`MessageChannel`，则使用`setTimeout`。

## 优先级调度

`Scheduler`是独立于`React`的包，所以他的优先级也是独立于`React`的优先级的

`Scheduler`内部存在`5种`优先级([<u>源码地址 ｜ SchedulerPriorities 🚀</u>](https://github.com/azzlzzxz/react-source-code/blob/main/packages/scheduler/src/SchedulerPriorities.js)):

- `NoPriority = 0`：无优先级

- `ImmediatePriority = 1`：立刻执行优先级

- `UserBlockingPriority = 2`：用户阻塞操作优先级，例如：用户点击 ，用户输入等

- `NormalPriority = 3`：正常优先级

- `LowPriority = 4`：低优先级

- `IdlePriority = 5`：空闲优先级

### 优先级的意义

`Scheduler`对外暴露最重要的方法便是`unstable_scheduleCallback`。该方法用于以某个优先级注册回调函数

不同优先级意味着不同时长的任务过期时间：

- `IMMEDIATE_PRIORITY_TIMEOUT = -1`：立刻过期

- `USER_BLOCKING_PRIORITY_TIMEOUT = 250`：用户阻塞优先级 250 毫秒

- `NORMAL_PRIORITY_TIMEOUT = 5000`：正常优先级的过期时间 5 秒

- `LOW_PRIORITY_TIMEOUT = 10000`：低优先级过期时间 10 秒

- `IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt = 1073741823`：永不过期

```js
let timeout

// 任务的开始时间
const startTime = performance.now()

switch (priorityLevel) {
  case ImmediatePriority:
    timeout = IMMEDIATE_PRIORITY_TIMEOUT
    break
  case UserBlockingPriority:
    timeout = USER_BLOCKING_PRIORITY_TIMEOUT
    break
  case IdlePriority:
    timeout = IDLE_PRIORITY_TIMEOUT
    break
  case LowPriority:
    timeout = LOW_PRIORITY_TIMEOUT
    break
  case NormalPriority:
  default:
    timeout = NORMAL_PRIORITY_TIMEOUT
    break
}

// 任务过期时间
let expirationTime = startTime + timeout
```

可以看到，如果一个任务的优先级是`ImmediatePriority`，对应`IMMEDIATE_PRIORITY_TIMEOUT`为`-1`，那么

```js
let expirationTime = startTime - 1
```

则该任务的过期时间比当前时间还短，表示他已经过期了，需要立即被执行。

### 不同优先级任务的排序

优先级意味着任务的过期时间。设想一个大型 `React` 项目，在某一刻，存在很多不同优先级的任务，对应不同的过期时间。

同时，又因为任务可以被延迟，所以我们可以将这些任务按是否被延迟分为：

- 已就绪任务

- 未就绪任务

```js
if (typeof options === 'object' && options !== null) {
  var delay = options.delay
  if (typeof delay === 'number' && delay > 0) {
    // 任务被延迟
    startTime = currentTime + delay
  } else {
    startTime = currentTime
  }
} else {
  startTime = currentTime
}
```

`Scheduler`存在两个队列：

- `timerQueue`：保存未就绪任务

- `taskQueue`：保存已就绪任务

每当有新的未就绪的任务被注册，我们将其插入`timerQueue`并根据开始时间重新排列`timerQueue`中任务的顺序。

当`timerQueue`中有任务就绪，即`startTime <= currentTime`，我们将其取出并加入`taskQueue`。

::: tip `currentTime`

- 获取当前时间

```js
let currentTime = performance.now()
```

:::

取出`taskQueue`中最早过期的任务并执行他。

为了能在`O(1)复杂度`找到两个队列中时间最早的那个任务，`Scheduler`使用`最小堆`实现了优先级队列

---

**下面我们看看 React 是如何实现`Scheduler`的**

## `Scheduler.js`

- `push`、`peek`、`pop`方法均属于最小堆的方法

  - 关于最小堆的实现可以看[前置知识｜最小堆](/rsource/react/preknowledge.md#最小堆)

  - [<u>React 源码 最小堆的实现 ｜ SchedulerMinHeap.js</u>](https://github.com/azzlzzxz/react-source-code/blob/main/packages/scheduler/src/SchedulerMinHeap.js)

- `scheduleCallback`函数：按优先级执行任务

- `requestHostCallback`函数：通过`MessageChannel`，开始执行任务`performWorkUntilDeadline`

- `performWorkUntilDeadline`函数：从最小堆中依次取出优先级最高的任务循环执行，直到没有任务需要被执行

  - `workLoop`: 执行任务

  - `shouldYieldToHost`：判断是否需要放弃执行任务

> 流程图

![schedule_flow](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/schedule_flow.jpg)

### `scheduleCallback`

- 根据优先级，计算任务过期时间（**<font color="#FF4229">任务的过期时间 是一个 绝对值 不会改变</font>**）

- 创建一个任务

- 向任务最小堆里添加任务，排序的依据是过期时间（**<font color="#FF4229">严格按照 过期时间 进行调度</font>**）

::: tip 高优先级先执行，低优先级后执行

- 如果最小堆里的低优先级任务前面的高优先级任务都执行完毕了，这时又来了一个高优先级任务，该怎么执行？

还是 **`比较过期时间`**，即使来的是高优先级，如果`低优先级的任务的过期时间 比 高优先级的任务过期时间长`，就会`先执行这个 过期时间长的低优先级任务`

- 如果一个任务已经过期了，那么在执行过程中，是不能被打断的

:::

- 调用`requestHostCallback`开始执行任务

```js
function getCurrentTime() {
  return performance.now()
}

/**
 * 按优先级执行任务
 * @param {*} priorityLevel 优先级的级别
 * @param {*} callback
 */
function scheduleCallback(priorityLevel, callback) {
  // 获取当前的时候
  const currentTime = getCurrentTime()

  // 此任务的开时间
  const startTime = currentTime

  //超时时间
  let timeout

  //根据优先级计算过期的时间
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT // -1
      break
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT // 250 ms
      break
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT // 1073741823
      break
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT // 1000
      break
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT // 500
      break
  }
  //计算此任务的过期时间
  const expirationTime = startTime + timeout

  const newTask = {
    id: taskIdCounter++,
    callback, // 回调函数或者说任务函数
    priorityLevel, // 优先级别
    startTime, // 任务的开始时间
    expirationTime, // 任务的过期时间
    sortIndex: expirationTime, // 排序依据
  }

  // 向任务最小堆里添加任务，排序的依据是过期时间
  push(taskQueue, newTask)

  // flushWork执行工作，刷新工作，执行任务
  requestHostCallback(flushWork)

  return newTask
}
```

### `requestHostCallback`

- 缓存回调函数

- 通过`MessageChannel`这个宏任务，实现类似于`requestIdleCallback`

> 流程图

![scheduler_method](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/scheduler_method.jpg)

```js
const channel = new MessageChannel()
var port2 = channel.port2
var port1 = channel.port1

port1.onmessage = performWorkUntilDeadline

function requestHostCallback(flushWork) {
  //先缓存回调函数
  scheduleHostCallback = flushWork

  //执行工作直到截止时间
  schedulePerformWorkUntilDeadline()
}

// 开始执行任务队列中的任务
function flushWork(startTime) {
  return workLoop(startTime)
}

function schedulePerformWorkUntilDeadline() {
  port2.postMessage(null)
}
```

### `performWorkUntilDeadline`

- 执行任务循环，直到没有任务需要被执行

```js
function performWorkUntilDeadline() {
  if (scheduleHostCallback) {
    // 先获取开始执行任务的时间, 表示时间片的开始
    startTime = getCurrentTime()

    // 是否有更多的工作要做
    let hasMoreWork = true

    try {
      //执行workLoop，并判断有没有返回值
      hasMoreWork = scheduleHostCallback(startTime)
    } finally {
      // 执行完以后如果为true,说明还有更多工作要做
      if (hasMoreWork) {
        // 继续执行 workLoop
        schedulePerformWorkUntilDeadline()
      } else {
        scheduleHostCallback = null
      }
    }
  }
}
```

### `workLoop` 开始工作循环

- 从最小堆中取出优先级最高的的任务，开始执行工作循环

- 执行`scheduleCallback`函数，传入的`callback`回调函数，判断`callback`的返回是否是函数

  - 如果是函数，说明还有任务需要执行，`return true`，任务已经完成，则不需要再继续执行了，可以把此任务弹出`pop(taskQueue)`

  - 否则就直接把此任务弹出`pop(taskQueue)`

- 如果当前的任务执行完了，或者当前任务不合法，取出下一个任务执行`currentTask = peek(taskQueue)`

- 没有任何要完成的任务了 `return false`

```js
function workLoop(startTime) {
  let currentTime = startTime

  // 取出优先级最高的任务
  currentTask = peek(taskQueue)

  while (currentTask !== null) {
    // 如果此任务的过期时间小于当前时间，说明任务没有过期，并且需要放弃执行，时间片到期
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      // 跳出工作循环
      break
    }

    // 取出当前的任务中的回调函数 （scheduleCallback里的callback回调函数）
    const callback = currentTask.callback

    if (typeof callback === 'function') {
      currentTask.callback = null

      // 回调函数是否过期
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime

      // 执行工作，如果返回新的函数，则表示当前的工作没有完成
      const continuationCallback = callback(didUserCallbackTimeout)

      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback

        // 还有任务要执行
        return true
      }

      // 如果此任务已经完成，则不需要再继续执行了，可以把此任务弹出
      if (currentTask === peek(taskQueue)) {
        pop(taskQueue)
      }
    } else {
      pop(taskQueue)
    }

    // 如果当前的任务执行完了，或者当前任务不合法，取出下一个任务执行
    currentTask = peek(taskQueue)
  }

  // 如果循环结束还有未完成的任务，那就表示hasMoreWork=true
  if (currentTask !== null) {
    return true
  }

  // 没有任何要完成的任务了
  return false
}
```

### `shouldYieldToHost`

- `frameInterval`：`React`会在每一帧向浏览器申请`5ms`用于自己任务执行，如果`5ms`内没有完成，`React`就会放弃控制权，把控制权交还给浏览器

- `shouldYieldToHost`函数：通过过去的时间和`frameInterval`进行比较，来判断任务是否过期，跳出工作循环

```js
const frameInterval = 5

function shouldYieldToHost() {
  // 用当前时间减去开始的时间就是过去的时间
  const timeElapsed = getCurrentTime() - startTime

  //如果说经过的时间小于5ms，那就不需要放弃执行
  if (timeElapsed < frameInterval) {
    return false
  }

  // 否则就是表示5ms用完了，需要放弃执行
  return true
}
```

### `unstable_cancelCallback` 取消任务

- 在`workLoop`中，会判断`continuationCallback`是不是函数，不是的话直接出队

```js
function unstable_cancelCallback(task) {
  task.callback = null
}
```

::: tip 源码地址

实现`Scheduler`的相关代码我放在了[<u>13.scheduler 分支里了 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/13.scheduler)
:::

::: info 相关资料

- [Scheduler 的原理与实现](https://react.iamkasong.com/concurrent/scheduler.html)

:::
