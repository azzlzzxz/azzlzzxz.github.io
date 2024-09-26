# 多节点的 DOM-DIFF

`DOM-DIFF`算法的整体逻辑会经历两轮遍历：

- 第一轮遍历：处理更新的节点

  - 如果 `key` 不同则直接结束本轮循环
  - 如果 `newChildren` 或 `oldFiber` 遍历完，结束本轮循环
  - `key` 相同而 `type` 不同，标记老的 `oldFiber` 为删除，继续循环
  - `key` 相同而 `type` 也相同，则可以复用老节 `oldFiber` 节点，继续循环

- 第二轮遍历：处理剩下的不属于更新的节点
  - `newChildren` 遍历完而 `oldFiber` 还有，遍历剩下所有的 `oldFiber` 标记为删除，`DIFF` 结束
  - `oldFiber` 遍历完了，而 `newChildren` 还有，将剩下的 `newChildren` 标记为插入，`DIFF` 结束
  - `newChildren` 和 `oldFiber` 都同时遍历完成，`DIFF` 结束
  - **<font color="#FF9D00">`newChildren` 和 `oldFiber` 都没有完成，则进行`节点移动`的逻辑(这部分是最复杂的)</font>**

> 流程图

![diff_move](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/dom-diff_move.jpg)

## `reconcileChildrenArray`

多节点的`DOM-DIFF`主要是在`reconcileChildrenArray`函数中实现的

- `resultingFirstChild`：返回的第一个`新fiber`节点

- `previousNewFiber`：上一个的`新的子fiber`
- `newIdx`：用来遍历新的`虚拟DOM`的索引
- `oldFiber`：第一个`老fiber`
- `nextOldFiber`：下一个`老fiber`
- `lastPlacedIndex`：上一个不需要移动的老`fiber`节点的索引
- `deleteChild`函数：把所有需要删除的`子fiber节点`，都放到`父fiber`的`deletions`属性里去

```js
function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
  let resultingFirstChild = null // 返回的第一个新节点
  let previousNewFiber = null // 上一个的新的子fiber
  let newIdx = 0 // 用来遍历新的虚拟DOM的索引
  let oldFiber = currentFirstChild // 第一个老fiber
  let nextOldFiber = null // 下一个老fiber
  let lastPlacedIndex = 0 // 上一个不需要移动的老节点的索引

  // 开始第一轮循环 如果老fiber有值，新的虚拟DOM也有值
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    //先暂存下一个老fiber
    nextOldFiber = oldFiber.sibling
    //试图更新或者试图复用老的fiber
    const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx])
    if (newFiber === null) {
      break
    }
    if (shouldTrackSideEffects) {
      //如果有老fiber,但是新的fiber并没有成功复用老fiber和老的真实DOM，那就删除老fiber,在提交阶段会删除真实DOM
      if (oldFiber && newFiber.alternate === null) {
        deleteChild(returnFiber, oldFiber)
      }
    }
    //指定新fiber的位置
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
    oldFiber = nextOldFiber
  }
  //新的虚拟DOM已经循环完毕
  if (newIdx === newChildren.length) {
    //删除剩下的老fiber
    deleteRemainingChildren(returnFiber, oldFiber)
    return resultingFirstChild
  }
  if (oldFiber === null) {
    // 挂载阶段走这里
    //如果老的 fiber已经没有了， 新的虚拟DOM还有，进入插入新节点的逻辑
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx])
      if (newFiber === null) continue
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
      //如果previousNewFiber为null，说明这是第一个fiber
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber //这个newFiber就是第一个子fiber
      } else {
        //否则说明不是第一个子fiber，就把这个newFiber添加上一个子节点后面
        previousNewFiber.sibling = newFiber
      }
      // 让newFiber成为最后一个或者说上一个子fiber
      previousNewFiber = newFiber
    }
  }
  // 开始处理移动的情况
  const existingChildren = mapRemainingChildren(returnFiber, oldFiber)
  //开始遍历剩下的虚拟DOM子节点
  for (; newIdx < newChildren.length; newIdx++) {
    const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx])
    if (newFiber !== null) {
      if (shouldTrackSideEffects) {
        //如果要跟踪副作用，并且有老fiber
        if (newFiber.alternate !== null) {
          existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key)
        }
      }
      //指定新的fiber存放位置 ，并且给lastPlacedIndex赋值
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber //这个newFiber就是第一个子fiber
      } else {
        //否则说明不是第一个子fiber，就把这个newFiber添加上一个子节点后面
        previousNewFiber.sibling = newFiber
      }
      //让newFiber成为最后一个或者说上一个子fiber
      previousNewFiber = newFiber
    }
  }
  if (shouldTrackSideEffects) {
    //等全部处理完后，删除map中所有剩下的老fiber
    existingChildren.forEach((child) => deleteChild(returnFiber, child))
  }
  return resultingFirstChild
}
```

### 第一次循环干了什么

---

- 判断：如果`老fiber`有值，`新的虚拟DOM`也有值，开始第一轮循环

- 通过`updateSlot`函数去找，`能够复用的fiber节点`，如果找到了，**<font color="#FF9D00">立刻结束第一次循环</font>**，如果没找到就继续执行循环
- 如果需要跟踪副作用`（shouldTrackSideEffects = true）`：如果`老fiber`存在，`新fiber`没有替身`（newFiber.alternate === null）`，那说明我们是创建了个`新fiber`，而`不是复用老fiber`，所以我们要把`老fiber删除`（我们已经根据老的创建新的了，老的就没用了）
- 指定`新fiber`的位置
- 给`previousNewFiber`赋值：如果`previousNewFiber`为`null`，说明`newFiber`是第一个`fiber`，把如果`previousNewFiber`为`null`，说明`newFiber`是`第一个fiber`，把`resultingFirstChild`赋值给`resultingFirstChild`，否则`previousNewFiber.sibling = newFiber`

```js
for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
  //先暂存下一个老fiber
  nextOldFiber = oldFiber.sibling
  //试图更新或者试图复用老的fiber
  const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx])
  if (newFiber === null) {
    break
  }
  if (shouldTrackSideEffects) {
    //如果有老fiber,但是新的fiber并没有成功复用老fiber和老的真实DOM，那就删除老fiber,在提交阶段会删除真实DOM
    if (oldFiber && newFiber.alternate === null) {
      deleteChild(returnFiber, oldFiber)
    }
  }
  //指定新fiber的位置
  lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
  if (previousNewFiber === null) {
    resultingFirstChild = newFiber
  } else {
    previousNewFiber.sibling = newFiber
  }
  previousNewFiber = newFiber
  oldFiber = nextOldFiber
}
```

### 第二次循环干了什么

---

#### 判断`newChildren`是否执行完

- `newChildren` 遍历完`(newIdx === newChildren.length)`而 `oldFiber` 还有，遍历剩下所有的 `oldFiber` 标记为删除，`DIFF` 结束

```js
if (newIdx === newChildren.length) {
  //删除剩下的老fiber
  deleteRemainingChildren(returnFiber, oldFiber)
  return resultingFirstChild
}
```

#### 处理移动

- `newChildren` 和 `oldFiber` 都没有完成，则进行节点移动的逻辑

- `existingChildren` 存储剩下的 `oldFiber`

- 调用`updateFromMap`生成新 fiber：通过`新的虚拟DOM`的`key/index`去`existingChildren`里取对应的`fiber节点`，调用`updateElement`方法，生成新`fiber`

- 如果要跟踪副作用，并且`新fiber`的`alternate`存在(也就是`老fiber`)，则把`existingChildren`里的对应的`老fiber`删除

- 指定`新fiber`存放位置 ，并且给`lastPlacedIndex`赋值

- 等全部处理完后，删除`map`中所有剩下的`老fiber`

```js
// 开始处理移动的情况
const existingChildren = mapRemainingChildren(returnFiber, oldFiber)

//开始遍历剩下的虚拟DOM子节点
for (; newIdx < newChildren.length; newIdx++) {
  const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx])

  if (newFiber !== null) {
    if (shouldTrackSideEffects) {
      // 如果要跟踪副作用，并且有老fiber
      if (newFiber.alternate !== null) {
        existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key)
      }
    }

    // 指定新的fiber存放位置 ，并且给lastPlacedIndex赋值
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)

    if (previousNewFiber === null) {
      resultingFirstChild = newFiber //这个newFiber就是第一个子fiber
    } else {
      //否则说明不是第一个子fiber，就把这个newFiber添加上一个子节点后面
      previousNewFiber.sibling = newFiber
    }

    //让newFiber成为最后一个或者说上一个子fiber
    previousNewFiber = newFiber
  }
}

if (shouldTrackSideEffects) {
  // 等全部处理完后，删除map中所有剩下的老fiber
  existingChildren.forEach((child) => deleteChild(returnFiber, child))
}
```

## `updateSlot`

- `updateSlot`函数：如果`老fiber`的`key`和`新的虚拟DOM`的`key`相同，则执行`updateElement`方法进入更新元素逻辑

```js
function updateSlot(returnFiber, oldFiber, newChild) {
  const key = oldFiber !== null ? oldFiber.key : null
  if (newChild !== null && typeof newChild === 'object') {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE: {
        //如果key一样，进入更新元素的逻辑
        if (newChild.key === key) {
          return updateElement(returnFiber, oldFiber, newChild)
        }
      }
      default:
        return null
    }
  }
  return null
}
```

### `updateElement`

- `updateElement`函数：如果`老fiber`节点存在`（!== null）`：判断`老fiber`的`type`和`新的虚拟DOM`的`type`是否一样
  - `type相同`：则调用`useFiber`函数，复用`老fiber`
  - `type不同`：则调用[<u>`createFiberFromElement`</u>](/rsource/react/beginWork.md#createfiberfromelement)，根据`新的虚拟DOM创建一个新的fiber`

```js
function updateElement(returnFiber, current, element) {
  const elementType = element.type
  if (current !== null) {
    //判断是否类型一样，则表示key和type都一样，可以复用老的fiber和真实DOM
    if (current.type === elementType) {
      const existing = useFiber(current, element.props)
      existing.ref = element.ref
      existing.return = returnFiber
      return existing
    }
  }
  const created = createFiberFromElement(element)
  created.ref = element.ref
  created.return = returnFiber
  return created
}
```

### `userFiber`

```js
function useFiber(fiber, pendingProps) {
  const clone = createWorkInProgress(fiber, pendingProps)
  clone.index = 0
  clone.sibling = null
  return clone
}
```

## `placeChild`

- 指定`新的fiber`在`新的fiber树`里的索引

- 如果不需要跟踪副作用，直接返回`lastPlacedIndex`(上一个不需要移动的老节点的索引)
- 如果`老fiber`存在，则判断`老fiber`的索引是否`小于lastPlacedIndex`，如果小于，则`老fiber`对应的`DOM节点`需要`移动`，否则返回`老fiber`的索引

```js
function placeChild(newFiber, lastPlacedIndex, newIdx) {
  // 指定新的fiber在新的fiber树里的索引
  newFiber.index = newIdx
  // 如果不需要跟踪副作用
  if (!shouldTrackSideEffects) {
    return lastPlacedIndex
  }
  // 获取它的老fiber
  const current = newFiber.alternate
  // 如果有，说明这是一个更新的节点，有老的真实DOM。
  if (current !== null) {
    const oldIndex = current.index
    // 如果找到的老fiber的索引比lastPlacedIndex要小，则老fiber对应的DOM节点需要移动
    if (oldIndex < lastPlacedIndex) {
      newFiber.flags |= Placement
      return lastPlacedIndex
    } else {
      return oldIndex
    }
  } else {
    // 如果没有，说明这是一个新的节点，需要插入
    newFiber.flags |= Placement
    return lastPlacedIndex
  }
}
```

## `mapRemainingChildren`

- `mapRemainingChildren`函数：创建一个`map`，从当前第一个`老fiber`开始，`递归`向`map`里添加`(fiber.key或fiber.index, fiber节点)`，并把这个`map`返回赋给`existingChildren`

```js
function mapRemainingChildren(returnFiber, currentFirstChild) {
  const existingChildren = new Map()
  let existingChild = currentFirstChild
  while (existingChild != null) {
    //如果有key用key,如果没有key使用索引
    if (existingChild.key !== null) {
      existingChildren.set(existingChild.key, existingChild)
    } else {
      existingChildren.set(existingChild.index, existingChild)
    }
    existingChild = existingChild.sibling
  }
  return existingChildren
}
```

## `updateFromMap`

- `updateFromMap` 函数：判断新的虚拟 DOM 节点是文本节点还是对象
  - 文本节点：从`existingChildren`这个`剩余的老fiber` 的`map 数据`里取，`newIndex`对应的`fiber`节点，调用`updateTextNode`方法生成新的`fiber`
  - 对象：则判断`newChild`的`$$typeof`是否是`REACT_ELEMENT_TYPE`，如果是，则通过`新的虚拟DOM`的`key/index`去`existingChildren`这个`剩余的老fiber` 的`map 数据`里取对应的`fiber`节点，调用`updateElement`方法，生成`新fiber`

```js
function updateFromMap(existingChildren, returnFiber, newIdx, newChild) {
  if ((typeof newChild === 'string' && newChild !== '') || typeof newChild === 'number') {
    const matchedFiber = existingChildren.get(newIdx) || null
    return updateTextNode(returnFiber, matchedFiber, '' + newChild)
  }
  if (typeof newChild === 'object' && newChild !== null) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE: {
        const matchedFiber =
          existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null
        return updateElement(returnFiber, matchedFiber, newChild)
      }
    }
  }
}
```

### `updateTextNode`

- [<u>createFiberFromText 请看这里 🚀</u>](/rsource/react/beginWork.md#createfiberfromtext-创建文本类型的-fiber)

```js
function updateTextNode(returnFiber, current, textContent) {
  if (current === null || current.tag !== HostText) {
    const created = createFiberFromText(textContent)
    created.return = returnFiber
    return created
  } else {
    const existing = useFiber(current, textContent)
    existing.return = returnFiber
    return existing
  }
}
```

## 渲染

```jsx
import * as React from './react'
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

function FunctionComponent() {
  console.log('FunctionComponent')
  const [number, setNumber] = React.useState(0)

  return number === 0 ? (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="A">A</li>
      <li key="B" id="b">
        B
      </li>
      <li key="C">C</li>
      <li key="D">D</li>
      <li key="E">E</li>
      <li key="F">F</li>
    </ul>
  ) : (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="A">A2</li>
      <li key="C">C2</li>
      <li key="E">E2</li>
      <li key="B" id="b2">
        B2
      </li>
      <li key="G">G</li>
      <li key="D">D2</li>
    </ul>
  )
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

![dom-diff-move-render](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/dom-diff-move-render.gif)

```sh
# 打印结果
FunctionComponent
自己有更新和子元素有删除 HostComponent ul {children: Array(6), onClick: ƒ}
HostComponent li {children: 'F'}
更新 HostComponent li {children: 'A2'}
更新 HostComponent li {children: 'C2'}
更新 HostComponent li {children: 'E2'}
移动并更新 HostComponent li {id: 'b2', children: 'B2'}
插入 HostComponent li {children: 'G'}
移动并更新 HostComponent li {children: 'D2'}
```

> 我们结合打印的结果再来看一下这张图

![diff_move](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/dom-diff_move.jpg)

::: tip 源码地址

实现`多节点de DOM-DIFF`的相关代码我放在了[<u>10.multiNode-dom-diff 分支里了 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/10.multiNode-dom-diff)
:::
