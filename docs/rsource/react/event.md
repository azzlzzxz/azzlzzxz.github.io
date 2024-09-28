# React 合成事件

`React 合成事件`是围绕浏览器原生事件充当跨浏览器包装器的对象,它们将不同浏览器的行为合并为一个 `API`,这样做是为了确保事件在不同浏览器中显示一致的属性。

接下来我们看看 `React` 是如何实现事件的注册、监听等功能的

## `main.jsx` 入口文件

```jsx {6,7,10,11}
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

function FunctionComponent() {
  return (
    <h1
      onClick={() => console.log('ParentBubble')}
      onClickCapture={() => console.log('ParentCapture')}
    >
      <span
        onClick={() => console.log('ChildBubble')}
        onClickCapture={() => console.log('ChildCapture')}
      >
        hello
      </span>
    </h1>
  )
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

## `createRoot`

`createRoot`函数里添加`listenToAllSupportedEvents`

```js {6,7}
import { listenToAllSupportedEvents } from 'react-dom-bindings/src/events/DOMPluginEventSystem'

export function createRoot(container) {
  const root = createContainer(container)

  // 监听所有的注册事件
  listenToAllSupportedEvents(container)

  return new ReactDOMRoot(root)
}
```

## `DOMPluginEventSystem （React事件监听系统入口文件）`

> React 事件监听系统 方法执行流程图

![react_event_method](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/react_event_method.jpg)

- `listenToAllSupportedEvents` 监听所有的注册事件

- `listenToNativeEvent` 通过 [<u>`addEventCaptureListener`&`addEventBubbleListener`</u>](#addeventcapturelistener-addeventbubblelistener) 来注册原生事件

- `dispatchEventForPluginEventSystem` 在[<u>`dispatchEvent`函数</u>](#dispatchevent)（也就是委托给容器的回调）中调用，此方法是透传参数用的，实际执行方法是`dispatchEventForPlugins`

- `dispatchEventForPlugins`里创建了两个变量：

  - `nativeEventTarget`：原生事件的`target`
  - `dispatchQueue`：派发事件的数组
  - 最后执行[<u>`SimpleEventPlugin 里的 extractEvents`</u>](#simpleeventplugin是-react-事件插件)

::: tip 这里的`dispatchQueue`为什么要是数组?

因为 React 事件系统里有很多插件， 比如`SimpleEventPlugin`、`ChangeEventPlugin`、`BeforeInputEventPlugin`等，他们都有可能有监听函数需要执行，也就是执行`SimpleEventPlugin 里的 extractEvents`方法，这时就会放到 `dispatchQueue` 里

:::

- `accumulateSinglePhaseListeners`函数：累加单阶段(捕获或冒泡阶段)的监听（这里的`listeners`为什么要是数组，因为`listeners`里的事件不仅仅是自己的，还有它的父亲和祖先身上的事件）

- `processDispatchQueue`函数：遍历`dispatchQueue`派发事件数组，执行`processDispatchQueueItemsInOrder`函数

- `processDispatchQueueItemsInOrder`函数：根据`inCapturePhase`判断事件是`捕获`还是`冒泡`，去执行`dispatchQueue[index]`里的`listeners（监听函数数组）`对应的`捕获/冒泡的监听函数`

- `executeDispatch`函数：执行监听函数

::: tip 合成事件实例上`currentTarget`是在不断的变化的

- `event nativeEventTarget`：它的是原始的事件源（当前执行操作的 `DOM` 节点），是永远不变的
- `event currentTarget`：当前的事件源，它是会随着事件回调的执行不断变化的
  :::

```js{15,34,49,70,80,104,113,121,150,162,187}
// react-dom-bindings/src/events/DOMPluginEventSystem

import { allNativeEvents } from './EventRegistry'
import * as SimpleEventPlugin from './plugins/SimpleEventPlugin'
// IS_CAPTURE_PHASE = 4 事件捕获标识
import { IS_CAPTURE_PHASE } from './EventSystemFlags'
import { createEventListenerWrapperWithPriority } from './ReactDOMEventListener'
import { addEventCaptureListener, addEventBubbleListener } from './EventListener'

// 把原生事件名称都放到 allNativeEvents 里
SimpleEventPlugin.registerEvents()

const listeningMarker = `_reactListening` + Math.random().toString(36).slice(2)

export function listenToAllSupportedEvents(rootContainerElement) {
  // 根容器监听，也就是div#root只监听一次
  if (!rootContainerElement[listeningMarker]) {
    rootContainerElement[listeningMarker] = true

    // 遍历所有的原生的事件比如click,进行监听
    allNativeEvents.forEach((domEventName) => {
      listenToNativeEvent(domEventName, true, rootContainerElement)
      listenToNativeEvent(domEventName, false, rootContainerElement)
    })
  }
}

/**
 * 注册原生事件
 * @param {*} domEventName 原生事件 click
 * @param {*} isCapturePhaseListener 是否是捕获阶段 true false
 * @param {*} target 目标DOM节点 也就是 div#root 容器节点
 */
export function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
  let eventSystemFlags = 0 // 默认是 0 指的是冒泡  4 是捕获
  if (isCapturePhaseListener) {
    eventSystemFlags |= IS_CAPTURE_PHASE
  }
  addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener)
}

/**
 *
 * @param {*} targetContainer 目标容器
 * @param {*} domEventName dom事件名
 * @param {*} eventSystemFlags 事件标识
 * @param {*} isCapturePhaseListener 是否是捕获
 */
function addTrappedEventListener(
  targetContainer,
  domEventName,
  eventSystemFlags,
  isCapturePhaseListener,
) {
  // 监听函数
  const listener = createEventListenerWrapperWithPriority(
    targetContainer,
    domEventName,
    eventSystemFlags,
  )
  if (isCapturePhaseListener) {
    // 增加事件捕获监听
    addEventCaptureListener(targetContainer, domEventName, listener)
  } else {
    // 增加事件冒泡监听
    addEventBubbleListener(targetContainer, domEventName, listener)
  }
}

export function dispatchEventForPluginEventSystem(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer,
) {
  dispatchEventForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer)
}

function dispatchEventForPlugins(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer,
) {
  const nativeEventTarget = getEventTarget(nativeEvent)
  //派发事件的数组
  const dispatchQueue = []
  // 提取事件
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer,
  )

  processDispatchQueue(dispatchQueue, eventSystemFlags);
}

function processDispatchQueue(dispatchQueue, eventSystemFlags) {
  //判断是否在捕获阶段
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  for (let i = 0; i < dispatchQueue.length; i++) {
    const { event, listeners } = dispatchQueue[i];
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
  }
}

function executeDispatch(event, listener, currentTarget) {
  // 合成事件实例currentTarget是在不断的变化的
  // event nativeEventTarget 它的是原始的事件源，是永远不变的
  // event currentTarget 当前的事件源，它是会随着事件回调的执行不断变化的
  event.currentTarget = currentTarget;
  listener(event);
}

function processDispatchQueueItemsInOrder(event, dispatchListeners, inCapturePhase) {
  if (inCapturePhase) {//dispatchListeners[子，父]
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const { listener, currentTarget } = dispatchListeners[i];
      if (event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
    }
  } else {
    for (let i = 0; i < dispatchListeners.length; i++) {
      const { listener, currentTarget } = dispatchListeners[i];
      if (event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
    }
  }
}

function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags,
  targetContainer,
) {
  SimpleEventPlugin.extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer,
  )
}

// 累加单阶段监听
export function accumulateSinglePhaseListeners(
  targetFiber,
  reactName,
  nativeEventType,
  isCapturePhase,
) {
  const captureName = reactName + 'Capture'
  const reactEventName = isCapturePhase ? captureName : reactName
  const listeners = []
  let instance = targetFiber
  while (instance !== null) {
    const { stateNode, tag } = instance // stateNode 当前的执行回调的DOM节点
    if (tag === HostComponent && stateNode !== null) {
      // 获取fiber节点上props属性中的监听事件
      const listener = getListener(instance, reactEventName)
      console.log('listener', listener)
      if (listener) {
        listeners.push(createDispatchListener(instance, listener, stateNode))
      }
    }
    instance = instance.return // 找完自己的就向上找父亲、祖先的监听事件
  }
  return listeners
}

function createDispatchListener(instance, listener, currentTarget) {
  return { instance, listener, currentTarget }
}
```

### `getListener`

- `getListener`函数：获取此`fiber`上对应的回调函数，在其`props`上获取
- [<u>`getFiberCurrentPropsFromNode`方法请看这里</u>](#getclosestinstancefromnode)

```js
import { getFiberCurrentPropsFromNode } from '../client/ReactDOMComponentTree'

/**
 * 获取此fiber上对应的回调函数
 * @param {*} inst
 * @param {*} registrationName
 */
export default function getListener(inst, registrationName) {
  const { stateNode } = inst
  if (stateNode === null) return null
  const props = getFiberCurrentPropsFromNode(stateNode)
  if (props === null) return null
  const listener = props[registrationName] // props.onClick
  return listener
}
```

## `allNativeEvents`

`allNativeEvents`：就是一个`Set`数据结构，里面放着原生事件的名称

```js {3,21}
// react-dom-bindings/src/events/EventRegistry

export const allNativeEvents = new Set()
/**
 * 注册两个阶段(捕获和冒泡)的事件
 * 当我在页面中触发click事件的时候，会走事件处理函数
 * 事件处理函数需要找到DOM元素对应的要执行React事件 onClick onClickCapture
 * @param {*} registrationName React事件名 onClick
 * @param {*} dependencies 原生事件数组 [click]
 */
export function registerTwoPhaseEvent(registrationName, dependencies) {
  // 注册冒泡事件的对应关系
  registerDirectEvent(registrationName, dependencies)

  // 注册捕获事件的对应的关系
  registerDirectEvent(registrationName + 'Capture', dependencies)
}

export function registerDirectEvent(registrationName, dependencies) {
  for (let i = 0; i < dependencies.length; i++) {
    allNativeEvents.add(dependencies[i]) // click
  }
}
```

## `SimpleEventPlugin`是 `React` 事件插件

- `registerSimpleEvents`函数：直接通过此插件暴露出去
- `extractEvents`函数：把要执行的回调函数添加到`dispatchQueue`中

```js {6-56}
// react-dom-bindings/src/events/plugins/SimpleEventPlugin.js

import { registerSimpleEvents } from '../DOMEventProperties'
import { SyntheticMouseEvent } from '../SyntheticEvent';

/**
 * 把要执行回调函数添加到dispatchQueue中
 * @param {*} dispatchQueue 派发队列，里面放置我们的监听函数
 * @param {*} domEventName DOM事件名 click
 * @param {*} targetInst 目标fiber
 * @param {*} nativeEvent 原生事件
 * @param {*} nativeEventTarget 原生事件源
 * @param {*} eventSystemFlags  事件系统标题 0 表示冒泡 4表示捕获
 * @param {*} targetContainer  目标容器 div#root
 */
function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget, //click => onClick
  eventSystemFlags,
  targetContainer,
) {
  const reactName = topLevelEventsToReactNames.get(domEventName) // map click => onClick

  // 合成事件的构建函数
  let SyntheticEventCtor;
  // 根据domEventName来构建合成事件，这里只列举click事件
  switch (domEventName) {
    case 'click':
      SyntheticEventCtor = SyntheticMouseEvent;
      break;
    ...
    default:
      break;
  }

  const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0 // 是否是捕获阶段
  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    isCapturePhase,
  )

  // 如果有要执行的监听函数的话 listeners=[onClickCapture,onClickCapture]=[ChildCapture,ParentCapture]
  const event = new SyntheticEventCtor(reactName, domEventName, null, nativeEvent, nativeEventTarget);

  dispatchQueue.push({
    event,// 合成事件实例
    listeners// 监听函数数组
  });
}

export { registerSimpleEvents as registerEvents, extractEvents }
```

### `createSyntheticEvent` 创建合成事件

> 源码地址 [createSyntheticEvent | react-dom-bindings/src/events/SyntheticEvent.js](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-dom-bindings/src/events/SyntheticEvent.js#L31)

- `createSyntheticEvent`函数是`React 合成事件的核心代码`

- `SyntheticBaseEvent`函数是合成事件的基类，根据传入`createSyntheticEvent`方法中的参数，来合成不同的合成事件，👇 的代码就是创建点击事件的合成事件。

- `xxxinterface`:是合成事件的接口，里面有原生事件的属性，例如：`MouseEventInterface`、`DragEventInterface` 等。

> 源码地址 [MouseEventInterface | react-dom-bindings/src/events/SyntheticEvent.js](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-dom-bindings/src/events/SyntheticEvent.js#L192C7-L192C26)

```js {17-53}
import assign from 'shared/assign'

function functionThatReturnsTrue() {
  return true
}
function functionThatReturnsFalse() {
  return false
}

const MouseEventInterface = {
  clientX: 0,
  clientY: 0,
}

// 创建合成事件
function createSyntheticEvent(inter) {
  /**
   * 合成事件的基类
   * @param {*} reactName React属性名 onClick
   * @param {*} reactEventType click
   * @param {*} targetInst 事件源对应的fiber实例
   * @param {*} nativeEvent 原生事件对象
   * @param {*} nativeEventTarget 原生事件源 span 事件源对应的那个真实DOM
   */
  function SyntheticBaseEvent(
    reactName,
    reactEventType,
    targetInst,
    nativeEvent,
    nativeEventTarget,
  ) {
    this._reactName = reactName
    this.type = reactEventType
    this._targetInst = targetInst
    this.nativeEvent = nativeEvent
    this.target = nativeEventTarget

    // 把此接口上对应的属性从原生事件上拷贝到合成事件实例上
    for (const propName in inter) {
      if (!inter.hasOwnProperty(propName)) {
        continue
      }
      this[propName] = nativeEvent[propName]
    }

    // 是否已经阻止默认事件
    this.isDefaultPrevented = functionThatReturnsFalse

    // 是否已经阻止继续传播
    this.isPropagationStopped = functionThatReturnsFalse

    return this
  }

  // 浏览器兼容性处理
  assign(SyntheticBaseEvent.prototype, {
    preventDefault() {
      const event = this.nativeEvent
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false
      }
      this.isDefaultPrevented = functionThatReturnsTrue
    },
    stopPropagation() {
      const event = this.nativeEvent
      if (event.stopPropagation) {
        event.stopPropagation()
      } else {
        event.cancelBubble = true
      }
      this.isPropagationStopped = functionThatReturnsTrue
    },
  })

  return SyntheticBaseEvent
}

export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface)
```

## `registerSimpleEvents`

- `registerSimpleEvents`函数：把原生事件名和处理函数的名字进行映射或者说绑定

- `simpleEventPluginEvents`是包含所有原生事件名称的数组，这里只列举了 `click`

> 源码地址 [simpleEventPluginEvents | react-dom-bindings/src/events/DOMEventProperties.js](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-dom-bindings/src/events/DOMEventProperties.js#L37)

```js {23-30}
// react-dom-bindings/src/events/DOMEventProperties.js

import { registerTwoPhaseEvent } from './EventRegistry'

const simpleEventPluginEvents = ['click']

export const topLevelEventsToReactNames = new Map()

/**
 * onClick在哪里可以取到： 在 createInstance 方法里的
 * function updateFiberProps(domElement, props) { node[internalPropsKey] = props }
 * 真实DOM元素[internalPropsKey] = props props.onClick
 * @param {*} domEventName
 * @param {*} reactName
 */
function registerSimpleEvent(domEventName, reactName) {
  //把原生事件名和处理函数的名字进行映射或者说绑定，click => onClick
  topLevelEventsToReactNames.set(domEventName, reactName)

  registerTwoPhaseEvent(reactName, [domEventName]) //'onClick' ['click']
}

export function registerSimpleEvents() {
  for (let i = 0; i < simpleEventPluginEvents.length; i++) {
    const eventName = simpleEventPluginEvents[i] // click
    const domEventName = eventName.toLowerCase() // click
    const capitalizeEvent = eventName[0].toUpperCase() + eventName.slice(1) // Click
    registerSimpleEvent(domEventName, `on${capitalizeEvent}`) // click, onClick
  }
}
```

## `createEventListenerWrapperWithPriority`

`createEventListenerWrapperWithPriority`函数：就是创建，派发离散的事件的的监听函数

- 离散事件：不会连续触发的事件，例如：点击事件
- 连续事件：会连续触发的事件，例如：滚动事件
- 此函数把参数一直透传下去，实际执行的方法是`dispatchEvent`

```js {7-15}
// react-dom-bindings/src/events/ReactDOMEventListener.js

import getEventTarget from './getEventTarget'
import { getClosestInstanceFromNode } from '../client/ReactDOMComponentTree'
import { dispatchEventForPluginEventSystem } from './DOMPluginEventSystem'

export function createEventListenerWrapperWithPriority(
  targetContainer,
  domEventName,
  eventSystemFlags,
) {
  const listenerWrapper = dispatchDiscreteEvent

  return listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer)
}

/**
 * 派发离散的事件的的监听函数
 * @param {*} domEventName 事件名 (click)
 * @param {*} eventSystemFlags 阶段 0 冒泡 4 捕获
 * @param {*} container 容器(div#root)
 * @param {*} nativeEvent 原生的事件
 */
function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
  dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent)
}
```

### `dispatchEvent`

`dispatchEvent`函数：就是委托给容器的回调，当容器`(#root)`在捕获或者说冒泡阶段处理事件的时候会执行此函数

```js
/**
 * 此方法就是委托给容器的回调，当容器(#root)在捕获或者说冒泡阶段处理事件的时候会执行此函数
 * @param {*} domEventName  事件名称 (click)
 * @param {*} eventSystemFlags  事件阶段标识
 * @param {*} container 容器(div#root)
 * @param {*} nativeEvent 原生的事件
 */
export function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  console.log('dispatchEvent', domEventName, eventSystemFlags, targetContainer, nativeEvent)

  // 获取事件源，它是一个真实DOM
  const nativeEventTarget = getEventTarget(nativeEvent)
  // 从真实的DOM节点上获取它对应的fiber节点
  const targetInst = getClosestInstanceFromNode(nativeEventTarget)

  dispatchEventForPluginEventSystem(
    domEventName, //click
    eventSystemFlags, //0 4
    nativeEvent, //原生事件
    targetInst, //此真实DOM对应的fiber
    targetContainer, //目标容器
  )
}
```

> 在点击 `hello` 后，我们来看一下 `dispatchEvent` 的打印结果

![event_dispatchEvent](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/event_dispatchEvent.jpg)

::: tip 为什么要在`dispatchEvent`函数里去找`targetInst(真实DOM节点对应的fiber节点)`

- 为了事件的冒泡和捕获

当你点击`span`时，不仅仅是它走自身的事件，是需要向下捕获和向上冒泡的，这时我们就需要通过`fiber树`来找到这个`span`的父亲、祖先上的属性
:::

### `getEventTarget`

```js
function getEventTarget(nativeEvent) {
  const target = nativeEvent.target || nativeEvent.srcElement || window
  return target
}

export default getEventTarget
```

### `getClosestInstanceFromNode`

::: tip `getFiberCurrentPropsFromNode`方法为什么能够获取到真实`DOM`上的`props`属性

在通过`fiber`创建`真实DOM`的方法里，也就是`createInstance`方法，调用了`updateFiberProps`方法把`props`通过唯一标识`internalPropsKey`，放到了`DOM`里面去

```js {16,17}
// react-dom-bindings/src/client/ReactDOMHostConfig.js

/**
 * 在原生组件初次挂载的时候，会通过此方法创建真实DOM
 * @param {*} type 类型 span
 * @param {*} props 属性
 * @param {*} internalInstanceHandle 它对应的fiber
 * @returns
 */
export function createInstance(type, props, internalInstanceHandle) {
  const domElement = document.createElement(type)

  //预先缓存fiber节点到DOM元素上
  precacheFiberNode(internalInstanceHandle, domElement)

  //把属性直接保存在domElement的属性上
  updateFiberProps(domElement, props)

  return domElement
}
```

:::

```js {7-18}
// react-dom-bindings/src/client/ReactDomComponentTree.js

const randomKey = Math.random().toString(36).slice(2)
const internalInstanceKey = '__reactFiber$' + randomKey
const internalPropsKey = '__reactProps$' + randomKey

/**
 * 从真实的DOM节点上获取它对应的fiber节点
 * @param {*} targetNode
 */
export function getClosestInstanceFromNode(targetNode) {
  const targetInst = targetNode[internalInstanceKey]
  if (targetInst) {
    return targetInst
  }
  return null
  //如果真实DOM上没有fiber,就不要返回undefined,而是要返回null
}

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

export function getFiberCurrentPropsFromNode(node) {
  return node[internalPropsKey] || null
}
```

## `addEventCaptureListener` & `addEventBubbleListener`

- `addEventCaptureListener`函数：向目标容器绑定捕获事件
- `addEventBubbleListener`函数：向目标容器绑定冒泡事件

```js
export function addEventCaptureListener(target, eventType, listener) {
  target.addEventListener(eventType, listener, true)
  return listener
}

export function addEventBubbleListener(target, eventType, listener) {
  target.addEventListener(eventType, listener, false)
  return listener
}
```

## 点击事件触发

我们看一下点击`hello`之后的打印结果

![react_event_result](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/react_event_result.gif)

::: tip 源码地址

实现`React 合成事件`的相关代码我放在了[<u>6.event 分支里了 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/6.event)
:::
