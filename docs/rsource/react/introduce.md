# Fiber

## 为什么要有`Fiber`？

::: tip 前置知识

- `JavaScript`是单线程的，而浏览器是多进程的（每个进程有可能包含多个线程）

浏览器是多进程的，其中的渲染进程要处理包括 `事件系统`、`定时器/延时器`、`网络请求`、`GUI 渲染线程`（`GUI` 负责页面的布局和绘制） 等各种线程任务，而`JavaScript`的线程是可以操作`DOM`的，这就使得`JavaScript`线程和浏览器的`GUI 渲染线程`存在互斥的问题。

如果 `GUI 渲染线程` 和 `JavaScript` 线程同时工作，会导致页面的渲染难以预测，例如：染线程刚绘制好的一段文字，`JavaScript` 线程可能会将其修改为其他文字，这样页面可能会渲染混乱、样式错乱、甚至导致页面崩溃

- `JavaScript` 线程会阻塞浏览器渲染

当下主流浏览器的刷新频率为 `60Hz`，即每 `16.6ms（1000ms / 60Hz）`浏览器就会刷新一次，而在这 `16.6ms` 内，需要执行`JavaScript` 脚本、渲染线程也会执行，同时在互斥的机制下，如果 `JavaScript` 长时间的占据主线程，就会导致 **渲染层面的更新就不得不长时间地等待，界面长时间不更新，带给用户的体验就是所谓的“卡顿”**。
:::

在 `React 16` 之前，`React` 使用的是基于 `栈递归` 的协调算法，这种算法会在一次渲染过程中递归遍历整个组件树，并且`不会被打断`，这种递归的方式会带来性能上的瓶颈，尤其是在组件树很大时，渲染时间就会变长，导致浏览器出现卡顿。

`Fiber` 是 `React 16` 引入的一种新的协调算法，用于解决 `React` 在复杂 `UI` 渲染时的性能问题。

**<font color="FF9D00">将递归的无法中断的更新重构为异步的可中断更新</font>**

## 什么是 `Fiber`？

- `Fiber` 作为架构

在旧的架构中，`Reconciler（协调器）` 采用递归的方式执行，无法中断，节点数据保存在递归的调用栈中，被称为 `stack reconciler`。

在新的架构中，`Reconciler` 是基于 `Fiber` 实现的，节点数据保存在 `Fiber` 中，被称为 `Fiber reconciler`。

- `Fiber` 作为静态数据结构

每个`Fiber 节点` 对应一个 `React.element`，保存了该组件的类型`（函数组件 / 类组件 / 原生组件）`、对应的`DOM`节点等信息。

::: info `Fiber` 作为静态数据结构

- React 目前的做法是使用链表, 每个虚拟节点内部表示为一个 `Fiber`
- 从顶点开始遍历
- 如果有第一个儿子，先遍历第一个儿子
- 如果没有第一个儿子，标志着此节点遍历完成
- 如果有弟弟遍历弟弟
- 如果有没有下一个弟弟，返回父节点标识完成父节点遍历，如果有叔叔遍历叔叔
- 没有父节点遍历结束

:::

- `Fiber` 作为动态工作单元

`Fiber` 保存着节点的动态信息，包括本次更新中改变的状态、节点更新信息、节点更新优先级、副作用标签等。

每次执行完一个执行单元, `React` 就会检查现在还剩多少时间，如果没有时间就将控制权让出去。

![fiber_task](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/fiber_task.jpeg)

::: tip `Fiber Reconciler` 的作用

- 能够把可中断的任务切片处理。
- 能够调整优先级，重置并复用任务。
- 能够在父元素与子元素之间交错处理，以支持 React 中的布局。
- 能够在 `render()` 中返回多个元素。
- 更好地支持错误边界。

[<u>Fiber Reconciler - React 官网</u>](https://zh-hans.legacy.reactjs.org/docs/codebase-overview.html#fiber-reconciler)
:::

## `Fiber`的数据结构

`Fiber` 上有 `DOM`、状态数据、副作用等标识

> 源码地址 [<u>`function FiberNode`</u>](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactFiber.js#L136)

```js
/**
 *
 * @param {*} tag  fiber 类型：函数组件（0）、类组件（1）、原生标签（5）
 * @param {*} pendingProps 新属性，等待处理或生效的属性
 * @param {*} key 唯一标识
 */

function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
): Fiber {
  const fiber: Fiber = {
    /*! --------------- 作为静态数据结构 --------------- */
    tag, // Fiber 对应组件的类型
    key, // key
    elementType: null, // 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
    type: null, // fiber类型，来自于虚拟DOM节点的type：div、span、p

    // 每个虚拟DOM --> fiber节点 --> 真实DOM
    stateNode: null, // // 此fiber对应的真实DOM节点

    // 用于连接其他Fiber节点形成Fiber树
    return: null, // 指向父级 Fiber 节点
    child: null, // 指向第一个子 Fiber 节点
    sibling: null, // 指向下一个兄弟 Fiber 节点
    index: 0,

    ref: null,
    refCleanup: null,

    /*! --------------- 作为动态工作单元 --------------- */
    // 虚拟DOM会提供pendingProps，用来创建Fiber节点的属性
    pendingProps, // 等待生效的属性
    memoizedProps: null, // 已经生效的属性

    // 每个Fiber 身上可能还有更新队列
    updateQueue: null,

    memoizedState: null, // Fiber 状态
    dependencies: null,
    mode,

    // Effects 副作用相关属性
    flags: NoFlags, // 副作用的标识，标识对此Fiber节点进行何种操作（二进制增删改操作）
    subtreeFlags: NoFlags, // 子节点对应的副作用标识
    deletions: null,

    // 调度优先级相关
    lanes: NoLanes,
    childLanes: NoLanes,

    // 指向该 Fiber 节点对应的双缓存 Fiber 节点
    alternate: null,
  };

  ...

  return fiber;
}
```

## `Fiber` 双缓存

::: tip 双缓存

当我们用 `canvas` 绘制动画时，每一帧绘制前都会调用 `ctx.clearRect` 清除上一帧的画面，如果当前帧画面计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。

为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。

双缓存技术是在内存或显存中开辟一块与屏幕一样大小的储存空间，作为缓存屏幕。将下一帧要显示的图像绘制到这个缓存屏幕上，在显示的时候将虚拟屏幕中的数据复制到可见区域里去。

![double_buffering](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/double_buffering.jpg)
:::

**<font color="#FF9D00">`React` 使用双缓存来完成 `Fiber` 树的构建和替换 ---> 对应着 `DOM` 树的创建和更新</font>**

### 双缓存 `Fiber` 树

在 `React` 中最多会同时存在两个 `Fiber树`

- 当前屏幕上显示内容对应的 `Fiber树`称为 `current Fiber树`

- 正在内存中构建的 `Fiber树`称为 `workInProgress Fiber树`

`React` 应用的根节点通过使 `current` 指针在不同 `Fiber树` 的 `rootFiber`间切换来完成 `current Fiber树`指向的切换

当 `workInProgress Fiber树`构建完成交给 `Renderer` 渲染在页面上后，应用跟节点的 `current` 指针指向 `workInProgress Fiber树`，此时 `workInProgress Fiber树` 就变成 current Fiber 树。

每次状态更新都会产生新的 `workInProgress Fiber树`，通过`current` 与 `workInProgress` 的替换，完成`DOM`更新。

![fiber_tree_double](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/fiber_tree_double.jpg)

::: tip

- `current Fiber 树` 中的 `Fiber 节点` 被称为 `current fiber`
- `workInProgress Fiber 树` 中的 `Fiber 节点` 被称为 `workInProgress fiber`
- `current Fiber 树` 中的 `Fiber 节点` 都有 `alternate` 属性指向 `workInProgress Fiber 树` 中对应的 `Fiber 节点`

```js
currentFiber.alternate === workInProgressFiber
workInProgressFiber.alternate === currentFiber
```

:::

![双缓存](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/react_fiber_%E5%8F%8C%E7%BC%93%E5%AD%98.jpg)

::: tip 相关资料

- [<u>React 技术揭秘</u>](https://react.iamkasong.com/process/doubleBuffer.html)

:::
