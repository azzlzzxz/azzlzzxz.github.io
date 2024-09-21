# commitRoot

在 `render` 阶段完成更新后，会调用 `commitRoot(root)`（进入 `commit` 阶段）来提交更新

> 注意：目前代码还不涉及到优先级、DOM-Diff、并发渲染等功能，只是初次渲染时执行的

```js
// ReactFiberWorkLoop.js

function commitRoot(root) {
  const { finishedWork } = root

  // 判断子树里有没有副作用 （插入/更新等）
  const subtreeHasEffects = (finishedWork.subtreeFlags & MutionMask) !== NoFlags

  // 判断根fiber自己有没有副作用
  const rootHasEffect = (finishedWork.flags & MutionMask) !== NoFlags

  // 如果自己有副作用或子节点有副作用那就进行提交DOM操作
  if (subtreeHasEffects || rootHasEffect) {
    console.log('commitRoot', finishedWork.child)
  }

  // 等DOM变更后，root 的 current属性指向新fiber树
  root.current = finishedWork
}

/**
 * 根据虚拟DOM构建fiber树，要创建真实的DOM节点，还需要把真实的DOM节点插入容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root) {
  // 第一次渲染是以同步的方式渲染根节点，初次渲染的时候，都是同步的
  renderRootSync(root)

  // 开始进入提交阶段，就是执行副作用，修改真实DOM
  const finishedWork = root.current.alternate

  root.finishedWork = finishedWork
  commitRoot(root)
}
```

> 查看一下 commitRoot 的打印结果

![commitRoot_flags](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/commitRoot_flags.jpg)

```js
// ReactFiberWorkLoop.js

import { commitMutationEffectsOnFiber } from './ReactFiberCommitWork'

function commitRoot(root) {
  const { finishedWork } = root

  // 判断子树里有没有副作用 （插入/更新等）
  const subtreeHasEffects = (finishedWork.subtreeFlags & MutionMask) !== NoFlags

  // 判断根fiber自己有没有副作用
  const rootHasEffect = (finishedWork.flags & MutionMask) !== NoFlags

  // 如果自己有副作用或子节点有副作用那就进行提交DOM操作
  if (subtreeHasEffects || rootHasEffect) {
    // 提交的变更 副作用 在 fiber 上
    commitMutationEffectsOnFiber(finishedWork, root)
  }

  // 等DOM变更后，root 的 current属性指向新fiber树
  root.current = finishedWork
}
```

## `commitMutationEffectsOnFiber`

> 注意：这里先统一处理 HostRoot、HostComponent、HostText，后续在对此方法进行更改

`commitMutationEffectsOnFiber` 函数中会处理进行如下操作：

- 调用 `recursivelyTraverseMutationEffects` 函数 `递归遍历` `子 Fiber 树`
- 调用 `commitReconciliationEffects` 函数

```js
// ReactFiberCommitWork.js

import { MutationMask, Placement } from './ReactFiberFlags'
import { HostRoot, HostComponent, HostText, FunctionComponent } from './ReactWorkTags'
import {
  appendChild,
  insertBefore,
  commitUpdate,
} from 'react-dom-bindings/src/client/ReactDOMHostConfig'
import { Update } from './ReactFiberFlags'

/**
 * 遍历fiber树，执行fiber上的副作用 变更操作
 * @param {*} finishedWork fiber节点
 * @param {*} root 根节点
 */
export function commitMutationEffectsOnFiber(finishedWork, root) {
  const current = finishedWork.alternate // 当前fiber的老fiber
  const flags = finishedWork.flags
  switch (finishedWork.tag) {
    case FunctionComponent:
    case HostRoot:
    case HostText: {
      //先遍历它们的子节点，处理它们的子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork)
      //再处理自己身上的副作用
      commitReconciliationEffects(finishedWork)
      break
    }
    case HostComponent: {
      //先遍历它们的子节点，处理它们的子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork)
      //再处理自己身上的副作用
      commitReconciliationEffects(finishedWork)
      //处理DOM更新
      if (flags & Update) {
        //获取真实DOM
        const instance = finishedWork.stateNode
        //更新真实DOM
        if (instance !== null) {
          const newProps = finishedWork.memoizedProps
          const oldProps = current !== null ? current.memoizedProps : newProps
          const type = finishedWork.type
          // 原生组件的更新队列里放的是带生效的属性
          const updatePayload = finishedWork.updateQueue
          finishedWork.updateQueue = null
          if (updatePayload) {
            commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork)
          }
        }
      }
      break
    }
    default:
      break
  }
}
```

## `recursivelyTraverseMutationEffects`

`recursivelyTraverseMutationEffects`函数：递归遍历处理`子Fiber树`

```js
// ReactFiberCommitWork.js

/**
 * 递归遍历处理变更的副作用
 * @param {*} root 根节点
 * @param {*} parentFiber 父fiber
 */
function recursivelyTraverseMutationEffects(root, parentFiber) {
  // 如果parentFiber父fiber有收集合并的副作用，那就处理递归处理子节点的副作用
  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber
    while (child !== null) {
      commitMutationEffectsOnFiber(child, root)
      child = child.sibling
    }
  }
}
```

## `commitReconciliationEffects`

`commitReconciliationEffects` 函数：处理 `自身fiber节点` 上 `Mutation` 副作用（插入）

```js
// ReactFiberCommitWork.js

// 处理自己身上的副作用
function commitReconciliationEffects(finishedWork) {
  const { flags } = finishedWork

  // 如果此fiber要执行插入操作的话
  if (flags & Placement) {
    // 进行插入操作，也就是把此fiber对应的真实DOM节点添加到父真实DOM节点上
    commitPlacement(finishedWork)

    // 把flags里的Placement删除
    finishedWork.flags & ~Placement
  }
}
```

## `commitPlacement`

`commitPlacement`函数：把此`fiber`的`真实DOM`插入到`父DOM`里

- 根据`parentFiber.tag`类型去执行不同的插入操作

```js
// ReactFiberCommitWork.js

/**
 * 把此fiber的真实DOM插入到父DOM里
 * @param {*} finishedWork
 */
function commitPlacement(finishedWork) {
  console.log('commitPlacement', finishedWork)

  const parentFiber = getHostParentFiber(finishedWork)

  switch (parentFiber.tag) {
    case HostRoot: {
      // 根fiber的真实DOM元素（div #root）
      const parent = parentFiber.stateNode.containerInfo

      // 获取最近的兄弟的真实DOM节点
      const before = getHostSibling(finishedWork)

      insertOrAppendPlacementNode(finishedWork, before, parent)

      break
    }
    case HostComponent: {
      const parent = parentFiber.stateNode
      const before = getHostSibling(finishedWork)
      insertOrAppendPlacementNode(finishedWork, before, parent)
      break
    }
    default:
      break
  }
}
```

> 查看一下 `commitPlacement` 的 `finishedWork`

![commitPlacement_finishedWork](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/commitPlacement_finishedWork.jpg)

### `getHostParentFiber`

`getHostParentFiber`函数：向上查找`父fiber`，直到找到的`fiber tag`类型是 `HostComponent（原生类型）` 或 `HostRoot（容器根节点类型）`

```js
// ReactFiberCommitWork.js

function isHostParent(fiber) {
  // fiber 的 tag 是原生节点类型或者是容器根节点
  return fiber.tag === HostComponent || fiber.tag == HostRoot // HostRoot: div#root
}

function getHostParentFiber(fiber) {
  let parent = fiber.return
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent
    }
    parent = parent.return
  }
  parent
}
```

### `getHostSibling`

`getHostSibling`函数：找到需要`插入的锚点`（也就是找到可以`插在它前面的那个fiber对应的真实DOM元素`）

```js
// ReactFiberCommitWork.js

/**
 * 找到要插入的锚点
 * 找到可以插在它的前面的那个fiber对应的真实DOM
 * @param {*} fiber
 */
function getHostSibling(fiber) {
  let node = fiber

  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null
      }
      node = node.return
    }

    node = node.sibling

    //如果弟弟不是原生节点也不是文本节点，进入循环
    while (node.tag !== HostComponent && node.tag !== HostText) {
      //如果此节点是一个将要插入的新的节点，找它的兄弟节点
      if (node.flags & Placement) {
        continue siblings // 那就继续执行 外层 siblings 的 while 循环
      } else {
        node = node.child
      }
    }

    if (!(node.flags & Placement)) {
      return node.stateNode
    }
  }
}
```

> 举个 🌰

![getHostSibling-1](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/getHostSibling-1.jpg)

### `insertOrAppendPlacementNode`

`insertOrAppendPlacementNode`函数：递归遍历，把子节点对应的真实 DOM 插入到父节点 DOM 中

```js
// ReactFiberCommitWork.js

import { appendChild, insertBefore } from 'react-dom-bindings/src/client/ReactDOMHostConfig'
/**
 * 把子节点对应的真实DOM插入到父节点DOM中
 * @param {*} node 将要插入的fiber节点
 * @param {*} parent 父真实DOM节点
 */
function insertOrAppendPlacementNode(node, before, parent) {
  const { tag } = node

  // 判断此fiber对应的节点是不是真实DOM节点
  const isHost = tag === HostComponent || tag === HostText

  // 如果是的真实DOM节点话直接插入
  if (isHost) {
    const { stateNode } = node

    if (before) {
      insertBefore(parent, stateNode, before)
    } else {
      appendChild(parent, stateNode)
    }
  } else {
    // 如果node不是真实的DOM节点，获取它的第一个子节点
    const { child } = node

    // 如果存在子节点
    if (child !== null) {
      // 把第一个子节点添加到父亲DOM节点里面去
      insertOrAppendPlacementNode(child, before, parent)

      let { sibling } = child

      // 如果存在兄弟节点
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent)

        sibling = sibling.sibling
      }
    }
  }
}
```

#### `insertBefore` & `appendChild`

- 插入和添加`真实DOM`节点

```js
export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child)
}

/**
 *
 * @param {*} parentInstance 父DOM节点
 * @param {*} child 子DOM节点
 * @param {*} beforeChild 插入到谁的前面，它也是一个DOM节点
 */
export function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild)
}
```

## `commitUpdate`

`commitUpdate`函数：提交更新操作

- `updateProperties`：更新`DOM`上的属性
- `updateFiberProps`：更新`props`

```js
export function commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
  updateProperties(domElement, updatePayload, type, oldProps, newProps)
  updateFiberProps(domElement, newProps)
}
```

### `updateProperties`

```js
// react-dom-bindings/src/ReactDOMHostConfig.js

export function updateProperties(domElement, updatePayload) {
  updateDOMProperties(domElement, updatePayload)
}

function updateDOMProperties(domElement, updatePayload) {
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i]
    const propValue = updatePayload[i + 1]
    if (propKey === STYLE) {
      setValueForStyles(domElement, propValue)
    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue)
    } else {
      setValueForProperty(domElement, propKey, propValue)
    }
  }
}
```

## 页面渲染

至此整个渲染流程就结束了，页面上能够展示出我们最开始写在`main.jsx`里的`elememt`了

```js
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

let element = (
  <h1>
    Hello, <span style={{ color: 'red' }}>world</span>
  </h1>
)

const root = createRoot(document.getElementById('root'))

root.render(element)
```

![render_show](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/render_show.jpg)

::: tip 源码地址

整个`React 18.2.0`挂在阶段的渲染流程的源码解析的我放在了[<u>4.commitRoot 分支里 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/4.commitRoot)这里。
:::
