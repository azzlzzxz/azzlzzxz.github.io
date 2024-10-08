# 更新队列

## 初始化更新队列

> 每个 `Fiber` 上都可能会有更新队列，存放它的更新（不同类型的 `Fiber`，存放的更新都不一样）。

```js {4}
// ReactFiberClassUpdateQueue

// 创建初始化更新队列
export function initializeUpdateQueue(fiber) {
  // 创建一个新的更新队列
  const queue = {
    // ... 省略代码
    shared: {
      pending: null, // pending是循环链表
    },
  }
  fiber.updateQueue = queue
}
```

在 `createFiberRoot` 中调用 `initializeUpdateQueue` 进行初始化

```js {16}
// ReactFiberRoot.js

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo)

  // HostRoot指的是根节点div #root 的Fiber节点
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

![initializeUpdateQueue](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/initializeUpdateQueue.png)

## `root.render()`

当初始化工作完成以后，会调用 `updateContainer` 开启更新

```js {13-16}
// ReactDOMRoot.js

import { createContainer, updateContainer } from 'react-reconciler/src/ReactFiberReconciler'

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}

// root.render()
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot
  updateContainer(children, root)
}

export function createRoot(container) {
  // container ---> div #root
  const root = createContainer(container) // ---> 创建FiberRootNode

  return new ReactDOMRoot(root)
}
```

## `updateContainer` 更新容器

- 创建 `update` 对象
- 将 `update` 对象添加到 `fiber` 的 `updateQueue` 中
- 调用 `scheduleUpdateOnFiber` 开启更新

```js {17}
// ReactFiberReconciler.js

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
export function updateContainer(element, container) {
  // 获取当前根fiber (HostRootFiber)
  const current = container.current

  // 创建更新
  const update = createUpdate()

  // payload是要更新的虚拟DOM
  update.payload = { element }

  // 将update（更新对象）插入到当前fiber的更新队列中，返回根节点
  const root = enqueueUpdate(current, update)
  console.log(root)

  scheduleUpdateOnFiber(root)
}
```

> 打印 `root`

![enqueueUpdate](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/enqueueUpdate.jpg)

### `createUpdate` 创建更新

```js {8}
// ReactFiberClassUpdateQueue.js

export function initializeUpdateQueue (fiber){
  ...
}

// 创建更新
export function createUpdate() {
  const update = { tag: UpdateState };
  return update;
}
```

### `enqueueUpdate` 插入更新

![updateQueue](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/updateQueue.jpg)

```js {12}
// ReactFiberClassUpdateQueue.js

export function initializeUpdateQueue (fiber){
  ...
}

export function createUpdate (fiber){
  ...
}

// 插入更新
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
  // pending指向最后一个更新，最后一个更新的next指向第一个更新，形成了一个单项循环链表
  updateQueue.shared.pending = update;

  // 返回跟节点，从当前fiber一直到跟节点
  return markUpdateLaneFromFiberToRoot(fiber);
}
```

### `markUpdateLaneFromFiberToRoot`(找根节点)

```js
// ReactFiberConcurrentUpdates.js

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
