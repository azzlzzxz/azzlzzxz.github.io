# useRef

`useRef` 是一个 `React Hook`，它能帮助引用一个不需要渲染的值

语法结构

```js
const ref = useRef(initialValue)
```

---

接下来我们来看看`React`是如何实现`useRef`这个`hook`的

## `main.jsx` 入口文件举例

```js
import * as React from './react'
import { createRoot } from 'react-dom/src/client/ReactDOMRoot'

function FunctionComponent() {
  const btnRef = React.useRef()

  React.useEffect(() => {
    console.log('btnRef1', btnRef.current)
  }, [])

  return (
    <div>
      <button ref={btnRef}>btn1</button>
      <button ref={(instance) => console.log('btnRef2', instance)}>btn2</button>
    </div>
  )
}

let element = <FunctionComponent />

const root = createRoot(document.getElementById('root'))

root.render(element)
```

## 在`react`文件夹里导出`useState`

```js
export {
  // ....省略其他
  useRef,
} from './src/React'
```

- 在`ReactHook`里添加`useRef`

```js
// react/src/ReactHook.js

export function useRef(initialValue) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useRef(initialValue)
}
```

## `ReactFiberFlags`

```js
export const Ref = 0b00000000000000000100000000
export const MutationMask = Placement | Update | ChildDeletion | Ref
```

## `ReactFiberHooks`

- 在`HooksDispatcherOnMount`里添加`useRef: mountRef`

- 在`HooksDispatcherOnUpdate`里添加`useRef: updateRef`

```js
const HooksDispatcherOnMount = {
  // ...
  useRef: mountRef,
}
const HooksDispatcherOnUpdate = {
  // ...
  useRef: updateRef,
}

function mountRef(initialValue) {
  const hook = mountWorkInProgressHook()
  const ref = {
    current: initialValue,
  }
  hook.memoizedState = ref
  return ref
}

function updateRef() {
  const hook = updateWorkInProgressHook()
  return hook.memoizedState
}
```

## `completeWork`完成阶段

- `markRef`：给当前的`fiber`树，标识`Ref`副作用

```js{13,19,28-30}
export function completeWork(current, workInProgress) {
  // ... 省略代码

  switch (workInProgress.tag) {
    // ... 省略代码

    case HostComponent:
      // 更新
      if (current !== null && workInProgress.stateNode !== null) {
        // ... 省略代码

        if (current.ref !== workInProgress.ref !== null) {
          markRef(workInProgress);
        }
      } else { // 挂载
        // ... 省略代码

        if (workInProgress.ref !== null) {
          markRef(workInProgress);
        }
      }
    break;

    // ... 省略代码
  }
}

function markRef(workInProgress) {
  workInProgress.flags |= Ref;
}
```

## `commitMutationEffectsOnFiber` 执行副作用 处理`DOM`

- `commitAttachRef`函数：给有`Ref`标识的副作用的`fiber`，的`ref`，赋予真实 DOM

  - `ref === "function"`：`ref(instance)`

  - `ref !== "function"`：`ref.current = instance;`

```js{11,21-31}
export function commitMutationEffectsOnFiber(finishedWork, root) {
  // ... 省略代码

  switch (finishedWork.tag) {
    // ... 省略代码

    case HostComponent: {
      // ... 省略代码

      if (flags & Ref) {
        commitAttachRef(finishedWork);
      }

      // ... 省略代码
    }

    // ... 省略代码
  }
}

function commitAttachRef(finishedWork) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;
    if (typeof ref === "function") {
      ref(instance);
    } else {
      ref.current = instance;
    }
  }
}
```

## `ReactChildFiber`

- 在进行`fiber节点`复用和创建新的`fiber`时，需要复用`ref`

> 例如：`reconcileSingleElement`方法，当然其他方法在遇到复用和创建时，都需要加上`ref`

```js{9-11,23-25}
function reconcileSingleElement(returnFiber, currentFirstChild, element) {
  // ... 省略代码

  while (child !== null) {
    if (child.key === key) {
      if (child.type === element.type) {
        // ... 省略代码

        const existing = useFiber(child, element.props);
        existing.ref = element.ref;
        existing.return = returnFiber;

        return existing;
      } else {
        // ... 省略代码
      }
    } else {
      // ... 省略代码
    }
    // ... 省略代码
  }

  const created = createFiberFromElement(element);
  created.ref = element.ref;
  created.return = returnFiber;

  return created;
}
```

## 渲染

我们看一下`main.jsx`，运行的结果

![useRef_render](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/useRef_render.jpg)

::: tip 源码地址

实现`useRef`的相关代码我放在了[<u>17.useRef 分支里了 点击直达 🚀</u>](https://github.com/azzlzzxz/react-code/tree/17.useRef)
:::
