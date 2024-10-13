# useMemo & useCallback

## 公共方法

### `areHookInputsEqual`

新和老的两个依赖数组的比对是否一样，如果发现任何不相等的元素，函数将返回 `false`。否则，返回 `true`。

```js
function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) return null
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue
    }
    return false
  }
  return true
}
```

## `useMemo`

- `useMemo` 是一个 `React Hook`，它在每次重新渲染的时候能够缓存计算的结果

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

### `mount` 阶段

```js
const HooksDispatcherOnMount = {
  useMemo: mountMemo, // useMemo 挂载时的执行函数
}
```

#### `mountMemo`

> 源码地址 [<u>mountMemo | react-reconciler/src/ReactFiberHooks.old.js</u>](https://github.com/azzlzzxz/react-v18.2.0/blob/75de845d69876d84a4a8b226c5f2e6203328b8ee/packages/react-reconciler/src/ReactFiberHooks.old.js#L1904)

`nextCreate`： `useMemo` 的缓存回调函数的执行结果

```js
function mountMemo(nextCreate, deps) {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const nextValue = nextCreate()
  hook.memoizedState = [nextValue, nextDeps]
  return nextValue
}
```

### `update` 阶段

```js
const HooksDispatcherOnUpdate = {
  useMemo: updateMemo, // useMemo 更新时的执行函数
}
```

#### `updateMemo`

> 源码地址 [<u>updateMemo | react-reconciler/src/ReactFiberHooks.old.js</u>](https://github.com/azzlzzxz/react-v18.2.0/blob/75de845d69876d84a4a8b226c5f2e6203328b8ee/packages/react-reconciler/src/ReactFiberHooks.old.js#L1915)

通过`areHookInputsEqual`决定是否需要重新计算值。如果依赖项数组相等，`useMemo`将返回上一次计算的值；否则，它将执行 `nextCreate` 函数并返回一个新的值。

```js
function updateMemo(nextCreate, deps) {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const prevState = hook.memoizedState
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1]
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0]
      }
    }
  }
  const nextValue = nextCreate()
  hook.memoizedState = [nextValue, nextDeps]
  return nextValue
}
```

## `useCallback`

- `useCallback` 是一个允许你在多次渲染中缓存函数的 `React Hook`

```js
const cachedFn = useCallback(fn, dependencies)
```

### `mount` 阶段

```js
const HooksDispatcherOnMount = {
  useCallback: mountCallback, // useCallback 挂载时的执行函数
}
```

#### `mountCallback`

> 源码地址 [<u>mountCallback | react-reconciler/src/ReactFiberHooks.old.js</u>](https://github.com/azzlzzxz/react-v18.2.0/blob/75de845d69876d84a4a8b226c5f2e6203328b8ee/packages/react-reconciler/src/ReactFiberHooks.old.js#L1881)

```js
function mountCallback(callback, deps) {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  hook.memoizedState = [callback, nextDeps]
  return callback
}
```

### `update` 阶段

```js
const HooksDispatcherOnUpdate = {
  useCallback: updateCallback, // useCallback 更新时的执行函数
}
```

#### `updateCallback`

> 源码地址 [<u>updateCallback | react-reconciler/src/ReactFiberHooks.old.js</u>](https://github.com/azzlzzxz/react-v18.2.0/blob/75de845d69876d84a4a8b226c5f2e6203328b8ee/packages/react-reconciler/src/ReactFiberHooks.old.js#L1888)

```js
function updateCallback(callback, deps) {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const prevState = hook.memoizedState
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1]
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0]
      }
    }
  }
  hook.memoizedState = [callback, nextDeps]
  return callback
}
```

## `memo`

在 `memo` 的实现中，有一个关键函数 `updateMemoComponent`，它用于更新 `memo` 组件。

### `updateMemoComponent`

> 源码地址 [<u> updateMemoComponent | react-reconciler/src/ReactFiberBeginWork.js</u>](https://github.com/azzlzzxz/react-v18.2.0/blob/75de845d69876d84a4a8b226c5f2e6203328b8ee/packages/react-reconciler/src/ReactFiberBeginWork.old.js#L452)

- `updateMemoComponent` 函数首先检查当前组件是否具有上一次的属性 `prevProps`。

  - 如果存在，它将获取 `memo` 组件的比较函数 `compare`。

  - 如果没有提供比较函数，`React` 将使用默认的浅比较函数 `shallowEqual`。

- `React` 使用比较函数来检查上一次的属性 `prevProps` 是否与新的属性 `nextProps` 相等。

  - 如果相等，`React` 将调用 `bailoutOnAlreadyFinishedWork` 函数来阻止组件重新渲染。

  - 否则，它将继续渲染组件并返回结果。

```js
function updateMemoComponent(
  current,
  workInProgress,
  Component,
  nextProps,
  updateLanes,
  renderLanes,
) {
  const currentChild = ((current.child: any): Fiber) // This is always exactly one child
  const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(current, renderLanes)
  if (!hasScheduledUpdateOrContext) {
    // This will be the props with resolved defaultProps,
    // unlike current.memoizedProps which will be the unresolved ones.
    const prevProps = currentChild.memoizedProps
    // Default to shallow comparison
    let compare = Component.compare
    compare = compare !== null ? compare : shallowEqual
    if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
    }
  }
}
```

### `bailoutOnAlreadyFinishedWork`

> 源码地址 [<u> bailoutOnAlreadyFinishedWork | react-reconciler/src/ReactFiberBeginWork.js</u>](https://github.com/azzlzzxz/react-v18.2.0/blob/75de845d69876d84a4a8b226c5f2e6203328b8ee/packages/react-reconciler/src/ReactFiberBeginWork.old.js#L3351)

`bailoutOnAlreadyFinishedWork` 函数首先复用上一次的依赖项，然后，它检查子组件是否有任何待处理的工作，如果没有，返回 `null`，从而阻止组件重新渲染。

```js
function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
  if (current !== null) {
    // Reuse previous dependencies
    workInProgress.dependencies = current.dependencies
  }

  // ...some code

  // Check if the children have any pending work.
  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    if (enableLazyContextPropagation && current !== null) {
      // Before bailing out, check if there are any context changes in the children.
      lazilyPropagateParentContextChanges(current, workInProgress, renderLanes)
      if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
        return null
      }
    } else {
      return null
    }
  }

  // ...some code
}
```
