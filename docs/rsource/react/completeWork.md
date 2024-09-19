# completeWork

`performUnitOfWork` 函数每次会调用 `beginWork` 来创建当前节点的子节点，如果当前节点没有子节点，则说明当前节点是一个叶子节点。在前面我们已经知道，当遍历到叶子节点时说明当前节点 `“递”` 阶段 的工作已经完成，接下来就要进入 `“归”` 阶段 ，即通过 `completeUnitOfWork` 执行当前节点对应的 `completeWork` 逻辑

## `completeUnitOfWork`

`completeUnitOfWork` 函数的作用是执行当前 `Fiber 节点`的 `completeWork` 逻辑，然后将 `workInProgress` 赋值为当前节点的`兄弟节点`或`父节点`

> 源码地址

```js
// ReactFiberWorkLoop.js

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork
  do {
    const current = completedWork.alternate
    const returnFiber = completedWork.return

    //执行此fiber 的完成工作,如果是原生组件的话就是创建真实的DOM节点
    completeWork(current, completedWork)

    //如果有兄弟节点，就构建兄弟节点对应的fiber子链表
    const siblingFiber = completedWork.sibling
    if (siblingFiber !== null) {
      workInProgress = siblingFiber
      return
    }

    //如果没有兄弟节点，说明这当前完成的就是父fiber的最后一个节点
    //也就是说一个父fiber,所有的子fiber全部完成了
    completedWork = returnFiber

    workInProgress = completedWork
  } while (completedWork !== null)
}
```

## `completeWork` 完成一个`fiber节点`

类似 `beginWork`，`completeWork` 也是根据 `fiber.tag` 来调用不同的处理逻辑

> 源码地址

```js
// ReactFiberCompleteWork.js

/**
 * 完成一个fiber节点
 * @param {*} current 老fiber
 * @param {*} workInProgress 新的构建的fiber
 */
export function completeWork(current, workInProgress) {
  const newProps = workInProgress.pendingProps
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress)
      break

    //如果完成的是原生节点的话
    case HostComponent:
      // 现在只是在处理创建或者说挂载新节点的逻辑，后面此处分进行区分是初次挂载还是更新
      const { type } = workInProgress

      // 创建真实DOM
      const instance = createInstance(type, newProps, workInProgress)

      //把自己所有的子节点都添加到自己的身上
      appendAllChildren(instance, workInProgress)

      // fiber 的 stateNode属性指向真实DOM
      workInProgress.stateNode = instance

      finalizeInitialChildren(instance, type, newProps)

      bubbleProperties(workInProgress)
      break

    case HostText:
      //如果完成的fiber是文本节点，那就创建真实的文本节点
      const newText = newProps
      //创建真实的DOM节点并传入stateNode
      workInProgress.stateNode = createTextInstance(newText)
      //向上冒泡属性
      bubbleProperties(workInProgress)
      break
  }
}
```

## `createTextInstance` 创建文本`DOM`元素

```js
// react-dom-bindings/src/client/ReactDOMHostConfig

export function createTextInstance(content) {
  return document.createTextNode(content)
}
```

## `createInstance` 创建真实`DOM`

`createInstance` 函数的作用是为 `Fiber 节点`创建对应的 `DOM` 节点

> 源码地址

```js
// react-dom-bindings/src/client/ReactDOMHostConfig

/**
 * 在原生组件初次挂载的时候，会通过此方法创建真实DOM
 * @param {*} type 类型 span
 * @param {*} props 属性
 * @param {*} internalInstanceHandle 它对应的fiber
 * @returns
 */
export function createInstance(type, props, internalInstanceHandle) {
  // 创建 DOM 节点
  const domElement = document.createElement(type)

  // 预先缓存fiber节点到DOM元素上
  precacheFiberNode(internalInstanceHandle, domElement)

  // 把属性直接保存到DOM元素上
  updateFiberProps(domElement, props)

  return domElement
}
```

### `precacheFiberNode` & `updateFiberProps`

```js
// react-dom-bindings/src/client/ReactDOMComponentTree

const randomKey = Math.random().toString(36).slice(2)
const internalInstanceKey = '__reactFiber$' + randomKey
const internalPropsKey = '__reactProps$' + randomKey

/**
 * 提前缓存fiber节点的实例到DOM节点上
 * @param {*} hostInst fiber实例
 * @param {*} node 真实DOM
 */
export function precacheFiberNode(hostInst, node) {
  node[internalInstanceKey] = hostInst
}

export function updateFiberProps(node, props) {
  node[internalPropsKey] = props
}
```

## `appendAllChildren`

`appendAllChildren` 函数会遍历传入的 `workInProgress` 的子节点，并将这些子节点的 `stateNode` 插入到父节点中，简单来说就是把自己所有的子节点都添加都自己身上。

```js
// ReactFiberCompleteWorks.js

/**
 * 把当前的完成的fiber所有的子节点对应的真实DOM都挂载到自己父parent真实DOM节点上
 * @param {*} parent 当前完成的fiber真实的DOM节点
 * @param {*} workInProgress 完成的fiber
 */
function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child

  while (node) {
    //如果子节点类型是一个原生节点或者是一个文件节点
    if (node.tag === HostComponent || node.tag === HostText) {
      // 把子节点都挂到父节点身上
      appendInitialChild(parent, node.stateNode)
    } else if (node.child !== null) {
      //如果第一个子节点不是一个原生节点，说明它可能是一个函数组件等虚的节点
      node = node.child
      continue
    }

    if (node === workInProgress) {
      return
    }

    //如果当前的节点没有兄弟节点
    while (node.sibling === null) {
      // 一直找到父fiber或者node.return为null，循环结束
      if (node.return === null || node.return === workInProgress) {
        return
      }
      //回到父节点
      node = node.return
    }

    node = node.sibling
  }
}
```

### `appendInitialChild`

`appendInitialChild`函数是把`子节点`的`真实DOM`，添加到`父节点`下面

```js
export function appendInitialChild(parent, child) {
  parent.appendChild(child)
}
```

## `finalizeInitialChildren`

`finalizeInitialChildren` 函数会调用 `setInitialProperties` 来进行属性和事件的设置，然后根据 `DOM 节点`的类型来判断是否需要聚焦

```js
// react-dom-bindings/src/client/ReactDOMHostConfig

function finalizeInitialChildren(domElement, type, props, rootContainerInstance, hostContext) {
  // 属性和事件的设置
  setInitialProperties(domElement, type, props, rootContainerInstance)

  // 是否需要聚焦
  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus
    case 'img':
      return true
    default:
      return false
  }
}
```

### `setInitialProperties`

`setInitialProperties` 函数用于设置 `DOM 节点`的属性以及事件监听

```js
// react-dom-bindings/src/client/ReactDOMComponent

import { setValueForStyles } from './CSSPropertyOperations'
import setTextContent from './setTextContent'
import { setValueForProperty } from './DOMPropertyOperations'

const STYLE = 'style'
const CHILDREN = 'children'

function setInitialDOMProperties(tag, domElement, nextProps) {
  for (const propKey in nextProps) {
    if (nextProps.hasOwnProperty(propKey)) {
      const nextProp = nextProps[propKey]
      if (propKey === STYLE) {
        setValueForStyles(domElement, nextProp)
      } else if (propKey == CHILDREN) {
        if (typeof nextProp === 'string') {
          setTextContent(domElement, nextProp)
        } else if (typeof nextProp === 'number') {
          setTextContent(domElement, `${nextProp}`)
        }
      } else if (nextProp !== null) {
        setValueForProperty(domElement, propKey, nextProp)
      }
    }
  }
}
export function setInitialProperties(domElement, tag, props) {
  setInitialDOMProperties(tag, domElement, props)
}
```

#### `setValueForStyles` 为`DOM元素`处理`CSS Style样式`

```js
export function setValueForStyles(node, styles) {
  const { style } = node //styles = { color: "red" }

  for (const styleName in styles) {
    if (styles.hasOwnProperty(styleName)) {
      const styleValue = styles[styleName]
      style[styleName] = styleValue
    }
  }
}
```

#### `setTextContent` 为`DOM元素`添加文本内容

```js
function setTextContent(node, text) {
  node.textContent = text
}

export default setTextContent
```

#### `setValueForProperty`

`setValueForProperty` 为`DOM元素`添加/删除属性等操作

```js
export function setValueForProperty(node, name, value) {
  if (value === null) {
    node.removeAttribute(name)
  } else {
    node.setAttribute(name, value)
  }
}
```

## `bubbleProperties` 冒泡函数

`bubbleProperties`函数的作用是把`当前fiber节点`的`所有子节点`的`副作用合并`挂载到自身上

```js
function bubbleProperties(completedWork) {
  let subtreeFlags = NoFlags
  // 遍历当前fiber的所有子节点，把所有的子节的副作用，以及子节点的子节点的副作用全部合并
  let child = completedWork.child

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags
    child = child.sibling
  }

  completedWork.subtreeFlags = subtreeFlags
}
```

> 举个 🌰

![bubbleProperties](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/bubbleProperties.jpg)
