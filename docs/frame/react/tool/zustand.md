# Zustand

提到`React`的状态管理，大家可能首先想到的是 `redux`，但是`redux` 太繁琐了，近两年，`React` 社区出现了很多新的状态管理库，比如 `zustand`、`jotai`、`recoil` 等，都完全能替代 `redux`，而且更简单。

`zustand` 算是其中最流行的一个。

## `zustand` 是如何实现的

- `createStore` 创建 `store`

  - `setState`： 更新状态

  - `getState`： 获取状态

  - `subscribe`： 订阅状态变化，添加监听器

  - `destroy`： 销毁所有监听器

  - `replace`：这是 `zustand` 在 `set` 状态的时候默认是合并，你也可以传一个 `true` 改成替换

- `useStore`：定义外部 `store` ，`store` 变化以后会触发 `rerender`

  - `useSyncExternalStore`：`react` 的 `hook` 就是用来定义外部 `store` 的，`store` 变化以后会触发 `rerender`

  - `selector`：使用 `useXXXStore` 时，传入的回调函数

::: tip 举个 🌰

```js
const updateUserInfo = useUserStore((state) => state.updateUserInfo)
```

:::

- `create`：监听 `state` 的变化，变了之后，根据新旧 `state` 调用 `selector` 函数的结果，来判断是否需要重新渲染

```js
import { useSyncExternalStore } from 'react'

const createStore = (createState) => {
  let state
  const listeners = new Set()

  const setState = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial

    if (!Object.is(nextState, state)) {
      const previousState = state

      if (!replace) {
        state =
          typeof nextState !== 'object' || nextState === null
            ? nextState
            : Object.assign({}, state, nextState)
      } else {
        state = nextState
      }
      listeners.forEach((listener) => listener(state, previousState))
    }
  }

  const getState = () => state

  const subscribe = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const destroy = () => {
    listeners.clear()
  }

  const api = { setState, getState, subscribe, destroy }

  state = createState(setState, getState, api)

  return api
}

function useStore(api, selector) {
  function getState() {
    return selector(api.getState())
  }

  return useSyncExternalStore(api.subscribe, getState)
}

export const create = (createState) => {
  const api = createStore(createState)

  const useBoundStore = (selector) => useStore(api, selector)

  Object.assign(useBoundStore, api)

  return useBoundStore
}
```

::: info 相关资料

- [<u>zustand 官网</u>](https://zustand-demo.pmnd.rs/)

- [<u>zustand 源码</u>](https://github.com/pmndrs/zustand)

:::
