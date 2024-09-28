# Hooks 相关知识

## `Hooks` 要遵守的规则

- 只在函数最顶层调用 `Hooks`

不要在循环、条件或嵌套函数中调用 `Hooks`。确保每次组件渲染时 `Hooks` 的调用顺序一致。这是因为 `React` 依赖于 `Hooks` 的调用顺序来管理组件的内部状态

- 只在 `React` 函数组件中调用 `Hooks`

不要在普通的 `JavaScript` 函数中调用 `Hooks`。`Hooks` 只能在 `React` 的函数组件或自定义的 `Hook（函数名以` `use` 开头）中调用

## setState 是同步还是异步

`setState` 在类组件中是 `this.setState` 方法，在函数组件中是 `useState` 返回值的修改函数 `setState` 用于变更状态，触发组件重新渲染，更新视图 `UI`

- 关于`useState`的实现可以看这里 [<u>React 18.2 | useState 实现 🚀</u>](/rsource/react/useState.md)

### 在 `React 18` 之前

在 `React 18` 之前，只要在 `React` 可以控制的地方，`setState` 的执行都是异步的，比如在 `React` 生命周期事件和合成事件中，都会走合并操作，延迟更新的策略

而在 `React` 无法控制的地方，如监听原生事件和异步调用的地方，`setState` 的执行都是就是同步的。比如在 `addEventListener`、`setTimeout`、`Promise` 等的回调函数中

### 在 `React 18` 之后

在 `concurrent` 模式下，由于默认启用了并发更新，所以 `setState` 的执行都是异步的，即不管是在 `React` 可以控制的地方还是无法控制的地方，默认都会走合并操作，延迟更新的策略

::: tip `setState` 为什么是异步的？

- 性能优化、减少渲染次数

从源码的角度分析，在执行任务调度之前，回去判断当前正在更新的 lane 优先级和老的更新优先级做对比，如果优先级一样就开启了批处理，就不需要再次调度新任务执行更新了。（源码地址 [<u>批处理</u>](https://github.com/azzlzzxz/react-v18.2.0/blob/75de845d69876d84a4a8b226c5f2e6203328b8ee/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L715)）

- 保持内部一致性

:::

## 闭包陷阱

闭包陷阱就是 `effect` 函数等引用了 `state`，形成了闭包，但是并没有把 `state` 加到依赖数组里，导致执行 `effect` 时用的 `state` 还是之前的。

> 举个 🌰

```tsx
import { useEffect, useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setInterval(() => {
      console.log(count)
      setCount(count + 1)
    }, 1000)
  }, [])

  return <div>{count}</div>
}

export default App
```

![hook_trap](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/hook_trap.gif)

可以看到，`setCount` 时拿到的 `count` 一直是 `0`

**解决方案：**

- 使用 `setState` 的函数的形式，从参数拿到上次的 `state`，这样就不会形成闭包了，或者用 `useReducer`，直接 `dispatch action`，而不是直接操作 `state`，这样也不会形成闭包

- 把用到的 `state` 加到依赖数组里，这样 `state` 变了就会重新跑 `effect` 函数，引用新的 `state`

- 使用 `useRef` 保存每次渲染的值，用到的时候从 `ref.current` 取

## `useMemo`和`useCallback`

先来看看`React`自己对这两个`hook`的定义：

- [<u>`useMemo`</u>](https://zh-hans.react.dev/reference/react/useMemo)：`useMemo` 是一个 `React Hook`，它在每次重新渲染的时候能够缓存计算的结果。

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

- [<u>`useCallback`</u>](https://zh-hans.react.dev/reference/react/useCallback)：`useCallback` 是一个允许你在多次渲染中缓存函数的 `React Hook`。

```js
const cachedFn = useCallback(fn, dependencies)
```

这也就是为什么使用他们的原因**<font color="#FF9D00">缓存</font>**

在每次重渲染之间缓存数据。如果一个值或函数被包裹在这两个 `hooks` 中，`react` 就会在首次渲染时缓存这个值或函数。在接下来的每次重渲染时，都会返回这个缓存的值。如果不使用它们，所有非原始类型的值，如 `array`、`object`，或 `function`，都会在每一次重渲染时被彻底重新创建。

> 举个 🌰

```js
const Component = () => {
  const a = { test: 1 }

  useEffect(() => {}, [a])
}
```

`a` 是 `useEffect` 依赖。在每次重新渲染`Component`时，`React` 都会将其与之前的值进行比较。`a` 是在 `Component` 中定义的对象，这意味着在每次重新渲染时，它都会从头开始重新创建。因此，比较`重渲染之前`的 `a` 和 `重渲染之后`的 `a`，结果都会是 `false`，所以被 `useEffect` 包裹的函数也将会在每次重渲染的过程中触发调用。

这时候用`useMemo`或`useCallback`，把它缓存起来，就可以很好的进行优化，只有在依赖项确实发生变化的时候才会触发回调。

**但是，`useMemo`和`useCallback`，只有在重渲染的过程中才有用。在初始渲染过程中，它们会让 `React` 做很多额外的工作，也就意味着你的应用在初始渲染过程中会[稍稍更慢]一些**

### 不要滥用 `useMemo`或`useCallback`

首先一个组件什么时候会重新渲染自己？

- 当 `state` 或者 `prop` 发生变化的时候，组件就会重渲染自己

- 当组件的父组件重渲染，也就是说，当一个组件重渲染它自己的时候，它也会同时重渲染它的 `children`

那我们就可以知道，`useMemo`和`useCallback`作用于 `prop` 并不能避免组件重渲染，只有当每一个 `prop` 都被缓存，且组件本身也被缓存的情况下，重渲染才能被避免。

如果组件代码里有以下情形，我们可以毫无心理负担地删掉 `useMemo` 和 `useCallback`：

- 它们作为属性直接或通过依赖链传递给 `DOM` 元素

- 它们被作为 `props`，直接或通过依赖链传递到某个未被缓存的组件上

- 它们被作为 `props`，直接或通过一系列依赖项传递给至少有一个 prop 未缓存的组件

::: info 相关资料

- [<u>如何使用 Memo 和 useCallback</u>](https://www.developerway.com/posts/how-to-use-memo-use-callback#part4)

- [<u>「好文翻译」为什么你可以删除 90% 的 useMemo 和 useCallback</u>](https://juejin.cn/post/7251802404877893689)

:::
