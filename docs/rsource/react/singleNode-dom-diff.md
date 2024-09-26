# DOM-DIFF

`DOM DIFF` 的三个规则:

- 只对同级元素进行比较，不同层级不对比

- 不同的类型对应不同的元素

- 可以通过 `key` 来标识同一个节点

::: tip 那什么是`DOM-DIFF`呢?

- 可以看下[<u>React 官网对 DOM-DIFF 的介绍</u>](https://zh-hans.legacy.reactjs.org/docs/reconciliation.html#the-diffing-algorithm)

:::

::: tip 一个`DOM节点`在某一时刻最多会有`4个节点`和他相关

- `current Fiber`

  如果该`DOM节点`已在页面中，`current Fiber`代表该`DOM节点`对应的`Fiber节点`

---

- workInProgress Fiber

  如果该`DOM节点`将在本次更新中渲染到页面中，`workInProgress Fiber`代表该`DOM节点`对应的`Fiber节点`

---

- `DOM节点`本身

---

- `JSX对象`

  即`ClassComponent`的`render方法`的返回结果，或`FunctionComponent`的调用结果。`JSX对象`中包含描述`DOM节点`的信息

---

`Diff算法`的本质是`对比1和4，生成2`
:::

`DOM-DIFF`分为两类：

- 单节点的`DOM-DIFF`

- 多节点的`DOM-DIFF`([<u>多节点的 DOM-DIFF 实现 请看这里 🚀</u>](/rsource/react/multiNode-dom-diff.md))

---

**下面我们开始介绍`React`对`单节点DOM-DIFF`的处理和实现**

## `reconcileChildFibers`

处理`DOM-DIFF`的入口函数是`reconcileChildFibers`，该函数会根据传入的`newChild`（`新的子虚拟DOM`即`JSX对象`）类型调用不同的处理函数。

```js{1,3,5-12,14-17,19-22,28}
function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {

  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // object类型，可能是 REACT_ELEMENT_TYPE(react元素) 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
        return placeSingleChild(
          // 协调单节点
          reconcileSingleElement(returnFiber, currentFirstChild, newChild)
        );
      // // ...省略其他case
    }
  }

  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 调用 reconcileSingleTextNode 处理
    // ...省略
  }

  // 一些其他情况调用处理函数
  // ...省略

  // 以上都没有命中，删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

## 单节点的`DOM-DIFF`

> 流程图

![single-dom-diff](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/single-dom-diff.jpg)

### 单节点（key 相同，type(类型)相同）

> 流程图

![all_equal](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/all_equal.jpg)

#### `reconcileSingleElement`

- `reconcileSingleElement`函数：单节点的 DOM-DIFF 处理函数，如果 key 和 type 都相同，那么调用`deleteRemainingChildren`和`useFiber`

  - `useFiber`函数：`克隆fiber节点`
  - `deleteRemainingChildren`：删除`从currentFirstChild之后所有的fiber节点`

```js
function useFiber(fiber, pendingProps) {
  const clone = createWorkInProgress(fiber, pendingProps)
  clone.index = 0
  clone.sibling = null
  return clone
}

/**
 *
 * @param {*} returnFiber 根fiber div#root对应的fiber
 * @param {*} currentFirstChild 老的虚拟DOM对应的fiber
 * @param {*} element 新的虚拟DOM对象
 * @returns 返回新的第一个子fiber
 */
function reconcileSingleElement(returnFiber, currentFirstChild, element) {
  const key = element.key
  let child = currentFirstChild
  while (child !== null) {
    //判断此老fiber对应的key和新的虚拟DOM对应的key是否一样
    if (child.key === key) {
      //判断老fiber对应的类型和新虚拟DOM元素对应的类型是否相同
      if (child.type === element.type) {
        deleteRemainingChildren(returnFiber, child.sibling)
        //如果key一样，类型也一样，则认为此节点可以复用
        const existing = useFiber(child, element.props)
        // 复用ref
        existing.ref = element.ref
        existing.return = returnFiber
        return existing
      }
    }
    child = child.sibling
  }
  // 在初次挂载时，那么老节点currentFirstFiber肯定是没有的，所以可以根据虚拟DOM创建fiber节点
  const created = createFiberFromElement(element)
  created.ref = element.ref
  created.return = returnFiber
  return created
}
```

#### `deleteRemainingChildren`

- `deleteRemainingChildren`函数：删除`从currentFirstChild之后所有的fiber节点`

```js
// 删除从currentFirstChild之后所有的fiber节点
function deleteRemainingChildren(returnFiber, currentFirstChild) {
  if (!shouldTrackSideEffects) return // 不需要跟踪副作用直接return

  let childToDelete = currentFirstChild
  while (childToDelete !== null) {
    deleteChild(returnFiber, childToDelete)
    childToDelete = childToDelete.sibling
  }
  return null
}
```

#### 执行提交更新

- [<u>点击直达 提交更新 🚀</u>](#提交更新)

#### 执行结果

```jsx
import * as React from './react'
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'
function FunctionComponent() {
  const [number, setNumber] = React.useState(0)

  return number === 0 ? (
    <div key="title1" id="title1" onClick={() => setNumber(number + 1)}>
      title
    </div>
  ) : (
    <div key="title1" id="title2" onClick={() => setNumber(number + 1)}>
      title2
    </div>
  )
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

> key 相同，type 相同，就复用老 fiber，执行属性更新就可以了

![dom_diff_all_equal](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/dom_diff_all_equal.gif)

### 单节点（key 不同，type(类型)相同）

> 流程图

![key_no_equal](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/key_no_equal.jpg)

#### reconcileSingleElement

- `key 不同`直接`删除当前fiber`，执行`deleteChild`函数，继续执行查找

```js {7-9}
function reconcileSingleElement(returnFiber, currentFirstChild, element) {
  const key = element.key
  let child = currentFirstChild
  while (child !== null) {
    if (child.key === key) {
      // ...省略代码
    } else {
      deleteChild(returnFiber, child)
    }
    child = child.sibling
  }

  const created = createFiberFromElement(element)
  created.ref = element.ref
  created.return = returnFiber
  return created
}
```

#### `deleteChild`

- `deleteChild`函数：把所有需要删除的`子fiber节点`，都放到`父fiber`的`deletions`属性里去

```js
/**
 * @param {*} returnFiber 父fiber
 * @param {*} childToDelete 将要删除的子fiber
 */
function deleteChild(returnFiber, childToDelete) {
  if (!shouldTrackSideEffects) return
  const deletions = returnFiber.deletions
  if (deletions === null) {
    returnFiber.deletions = [childToDelete]
    returnFiber.flags |= ChildDeletion
  } else {
    returnFiber.deletions.push(childToDelete)
  }
}
```

#### 执行提交更新

- [<u>点击直达 提交更新 🚀</u>](#提交更新)

#### 执行结果

```jsx
import * as React from './react'
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

function FunctionComponent() {
  const [number, setNumber] = React.useState(0)
  return number === 0 ? (
    <div onClick={() => setNumber(number + 1)} key="title1" id="title">
      title
    </div>
  ) : (
    <div onClick={() => setNumber(number + 1)} key="title2" id="title2">
      title2
    </div>
  )
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

> 删除当前 fiber 节点，生成新节点

![key_no_equal](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/key_no_equal.gif)

### 单节点（key 相同，type(类型)不同）

> 流程图

![type_no_equal](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/type_no_equal.jpg)

#### reconcileSingleElement

- `key 相同` `type不同` `删除所有老fiber`，生成`新fiber`
- `deleteRemainingChildren`：[<u>点击直达 deleteRemainingChildren 函数 🚀</u>](#deleteremainingchildren)

```js {8-11}
function reconcileSingleElement(returnFiber, currentFirstChild, element) {
  const key = element.key
  let child = currentFirstChild
  while (child !== null) {
    if (child.key === key) {
      if (child.type === element.type) {
        // ...省略代码
      } else {
        //如果找到一key一样老fiber,但是类型不一样，不能复用此老fiber,把剩下的全部删除
        deleteRemainingChildren(returnFiber, child)
      }
    } else {
      // ...省略代码
    }
    child = child.sibling
  }

  const created = createFiberFromElement(element)
  created.ref = element.ref
  created.return = returnFiber
  return created
}
```

#### 执行提交更新

- [<u>点击直达 提交更新 🚀</u>](#提交更新)

#### 执行结果

```jsx
import * as React from './react'
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

function FunctionComponent() {
  const [number, setNumber] = React.useState(0)
  return number === 0 ? (
    <div onClick={() => setNumber(number + 1)} key="title1" id="title1">
      title1
    </div>
  ) : (
    <p onClick={() => setNumber(number + 1)} key="title1" id="title1">
      title1
    </p>
  )
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

![type_no_qrual_render](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/type_no_qrual_render.gif)

### 原来有多个节点现在只有一个节点

- 原来多个节点，现在只有一个节点,删除多余节点

```jsx
function FunctionComponent() {
  const [number, setNumber] = React.useState(0)
  return number === 0 ? (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="A">A</li>
      <li key="B" id="B">
        B
      </li>
      <li key="C">C</li>
    </ul>
  ) : (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="B" id="B2">
        B2
      </li>
    </ul>
  )
}
```

![more_to_one_diff](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/more_to_one_diff.gif)

## 提交更新

`commitMutationEffectsOnFiber`函数作为提交副作用的入口函数，根据`finishedWork.tag`来处理不同`fiber`类型的提交更新

- 在调用`recursivelyTraverseMutationEffects`时处理子节点的副作用
- 在调用`commitReconciliationEffects`时处理自身上的副作用

```js
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

### `recursivelyTraverseMutationEffects`

- `recursivelyTraverseMutationEffects`函数：
  - 先把需要删除的`fiber节点`，从`父fiber`上删除
  - 再从`父fiber`上收集副作用，递归处理副作用

```js
/**
 * 递归遍历处理变更的副作用
 * @param {*} root 根节点
 * @param {*} parentFiber 父fiber
 */
function recursivelyTraverseMutationEffects(root, parentFiber) {
  // 先把父fiber上该删除的节点都删除
  const deletions = parentFiber.deletions
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i]
      commitDeletionEffects(root, parentFiber, childToDelete)
    }
  }
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

### `commitDeletionEffects` 提交删除副作用

- `commitDeletionEffects`函数：在找到找到真实的 DOM 之后，执行`commitDeletionEffectsOnFiber`

```js
let hostParent = null

/**
 * 提交删除副作用
 * @param {*} root 根节点
 * @param {*} returnFiber 父fiber
 * @param {*} deletedFiber 删除的fiber
 */
function commitDeletionEffects(root, returnFiber, deletedFiber) {
  let parent = returnFiber
  //一直向上找，找到真实的DOM节点为此
  findParent: while (parent !== null) {
    switch (parent.tag) {
      case HostComponent: {
        hostParent = parent.stateNode
        break findParent
      }
      case HostRoot: {
        hostParent = parent.stateNode.containerInfo
        break findParent
      }
    }
    parent = parent.return
  }
  commitDeletionEffectsOnFiber(root, returnFiber, deletedFiber)
  hostParent = null
}
```

#### `commitDeletionEffectsOnFiber`

- `commitDeletionEffectsOnFiber`函数：根据需要删除的 fiber 的 tag 类型，执行不同的操作
  - `recursivelyTraverseDeletionEffects`：递归遍历子节点的删除
  - `removeChild`：删除`真实DOM`节点

```js
/**
 * @param {*} finishedRoot 完成的根节点
 * @param {*} nearestMountedAncestor 最近的挂载的祖先
 * @param {*} deletedFiber 需要删除的fiber
 */
function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
  switch (deletedFiber.tag) {
    case HostComponent:
    case HostText: {
      //当要删除一个节点的时候，要先删除它的子节点
      recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber)
      //再把自己删除
      if (hostParent !== null) {
        removeChild(hostParent, deletedFiber.stateNode)
      }
      break
    }
    default:
      break
  }
}
```

#### `recursivelyTraverseDeletionEffects`

- `recursivelyTraverseDeletionEffects`函数：遍历执行子节点的删除

```js
function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
  let child = parent.child
  while (child !== null) {
    commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, child)
    child = child.sibling
  }
}
```

#### `removeChild` 删除节点

```js
export function removeChild(parentInstance, child) {
  parentInstance.removeChild(child)
}
```

::: tip 源码地址

实现`单节点de DOM-DIFF`的相关代码我放在了[<u>9.single-dom-diff 分支里了 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/9.single-dom-diff)
:::
