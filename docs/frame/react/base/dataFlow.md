# 数据在 React 组件中的流动

`React` 是数据驱动视图，即视图会随着数据的变化而变化

## `React`的设计思想

- 组件化

每个组件都符合开放封闭原则，封闭是针对渲染工作流来说的，指的是组件内部的状态都由自身维护，只处理内部的渲染逻辑。开放是针对组件通信来说的，指的是不同组件可以通过`props`（单项数据流）进行数据交互。

- 数据驱动视图

通过上面这个公式得出，如果要渲染界面，不应该直接操作`DOM`，而是通过修改数据，数据驱动视图更新。

- 虚拟`DOM`

由浏览器的渲染流水线可知，`DOM`操作是一个昂贵的操作，很耗性能，因此产生了虚拟`DOM`。虚拟`DOM`是对真实`DOM`的映射，React 通过新旧虚拟`DOM`对比，得到需要更新的部分，实现数据的增量更新

## 单向数据流

**`React` 是基于 `props` 的单向数据流**，指**当前组件的 `state` 以 `props` 的形式流动时，只能流向组件树中比自己层级更低的组件**，即流动是单向的，只能从父组件流向子组件，而不能从子组件流向父组件

## `state` 和 `props` 的区别

> `state` 和 `props` 都是组件的数据来源，但它们有以下区别：

- `state` 是可变的，是组件内部维护的一组用于反映组件 `UI` 变化的状态集合
- `props` 是组件的只读属性，组件内部不能直接修改，只能通过外部传入新的 `props` 来更新组件

即：**`state` 是组件对内的接口，`props` 是组件对外的接口**

## 组件通信

在 `React` 中，组件之间的通信主要有以下几种：

- 父组件向子组件通信
- 子组件向父组件通信
- 兄弟组件通信
- 父组件向后代组件通信
- 无关组件通信

### 父组件向子组件通信

利用 `React` 单向数据流通过 `props` 进行传递通信

```jsx
// 父组件
function Father() {
  return <Child name="steinsGate" />
}

// 子组件
function Child(props) {
  return <div>{props.name}</div>
}
```

### 子组件向父组件通信

通过 `props` 传递回调函数进行通信

> 子组件通过调用父组件传递过来的回调函数来向父组件通信

```jsx
// 子组件
function Child(props) {
  return <button onClick={() => props.onClick('我是子组件的数据')}>传递数据给父组件</button>
}

// 父组件
function Father() {
  const handleClick = (data) => {
    console.log(data) // 点击后会输出：我是子组件的数据
  }

  return <Child onClick={handleClick} />
}
```

### 兄弟组件通信

通过父组件中转数据的方式进行通信，即**兄弟组件之间的通信需要将数据提升到它们的共同父组件中进行管理**

`兄弟 1 → 兄弟 2` 会变成 `兄弟 1 → 父组件`（子父通信）和 `父组件 → 兄弟 2`（父子通信）

```jsx
// 兄弟组件
function Brother1(props) {
  return <div>{props.name}</div>
}

function Brother2(props) {
  return <button onClick={() => props.onClick('azzlzzxz')}>传递数据给兄弟组件</button>
}

// 父组件
function Father() {
  const [name, setName] = useState('steinsGate')

  const handleClick = (data) => {
    setName(data)
  }

  return (
    <>
      <Brother1 name={name} />
      <Brother2 onClick={handleClick} />
    </>
  )
}
```

### 父组件向后代组件通信和无关组件通信

> 父组件向后代组件通信不使用 `props` 传递数据，当层层传递 `props` 时会造成组件之间的耦合，不利于组件的复用，而且会造成组件之间的数据流动不可控

常见的解决方案有以下几种：

- 使用 `React` 的 `Context`([<u>React 官方文档 | 使用 Context 深层传递参数</u>](https://zh-hans.react.dev/learn/passing-data-deeply-with-context)) 进行通信
- 使用发布订阅模式进行通信
  - [event-emitter](https://github.com/medikoo/event-emitter)
  - [mitt](https://github.com/developit/mitt)
- 使用第三方状态管理库进行通信
  - [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
  - [Redux](https://cn.redux.js.org)
  - [Mobx](https://zh.mobx.js.org)

**使用 `React` 的 `Context` 进行通信**

```jsx
// 创建 Context
const Context = React.createContext()

// 子组件
function Child() {
  const { name } = useContext(Context)

  return <div>{name}</div>
}

// 父组件
function Father() {
  return (
    <Context.Provider value={{ name: 'steinsGate' }}>
      <Child />
    </Context.Provider>
  )
}
```
