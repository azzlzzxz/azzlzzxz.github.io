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

解决方案：

- 使用 `setState` 的函数的形式，从参数拿到上次的 `state`，这样就不会形成闭包了，或者用 `useReducer`，直接 `dispatch action`，而不是直接操作 `state`，这样也不会形成闭包

- 把用到的 `state` 加到依赖数组里，这样 `state` 变了就会重新跑 `effect` 函数，引用新的 `state`

- 使用 `useRef` 保存每次渲染的值，用到的时候从 `ref.current` 取
