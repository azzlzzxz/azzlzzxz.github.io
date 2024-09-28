# HOC 高阶组件

`高阶组件（HOC）`是 `React` 中用于复用组件逻辑的一种高级技巧。`HOC` 自身不是 `React API` 的一部分，它是一种基于 `React` 的组合特性而形成的设计模式。

具体而言，**<font color="#FF9D00">高阶组件是参数为组件，返回值为新组件的函数</font>**。

组件是将 `props` 转换为 `UI`，而高阶组件是将组件转换为另一个组件。

你也可以把它理解成，就是一个高阶函数。

语法结构：

```ts
const EnhancedComponent = higherOrderComponent(WrappedComponent)
```

## 高阶组件的作用

- `代码复用、逻辑抽象`： `HOC` 可以将一些通用的业务逻辑抽取出来，在多个组件中重用，避免重复代码。例如权限控制、数据获取、条件渲染等。

- `跨组件操作`： 通过 `HOC` 可以在多个不相关的组件间共享功能或者行为。例如，某个全局的状态或者布局风格的注入。

- `渲染劫持`： `HOC` 可以通过在渲染时对组件进行包裹，来决定某个组件是否要渲染，以及渲染什么内容。

- `修改组件的 Props`： `HOC` 可以通过操控 `props` 来增强组件的行为。例如，在渲染某个组件之前为它传递一些特定的 `props`。

## 常用的高阶组件的两种方式

- 属性代理

属性代理，就是用组件包裹一层代理组件，在代理组件上，我们可以做一些，对源组件的代理操作。

```tsx
/* 使用函数组件实现高阶组件 */
function HOC(WrappedComponent) {
  return function Father(props) {
    const [state] = useState({ name :'Father' })

    return <WrappedComponent {...props} {...state} />
  }
}

/* 使用类组件实现高阶组件 */
function HOC(WrappedComponent) {
  return class Father extends React.Component {
    state = { name: 'Father' }
    render() {
      return <WrappedComponent {...this.props} {this.state} />
    }
  }
}
```

::: tip 优点

- 属性代理可以和业务组件低耦合，零耦合，对于条件渲染和`props`属性增强,只负责控制子组件渲染和传递额外的`props`就可以，所以无须知道，业务组件做了些什么。

- 可以完全隔离业务组件的渲染,相比反向继承，属性代理这种模式。可以完全控制业务组件渲染与否，可以避免反向继承带来一些副作用，比如生命周期的执行。

- 可以嵌套使用，多个`hoc`是可以嵌套使用的，而且一般不会限制包装`hoc`的先后顺序

:::

::: warning 缺点

- 一般无法直接获取业务组件的状态，如果想要获取，需要`ref`获取组件实例。

- 无法直接继承静态属性。如果需要继承需要手动处理，或者引入第三方库

:::

- 反向继承

反向继承和属性代理有一定的区别，在于包装后的组件继承了业务组件本身，所以我们我无须在去实例化我们的业务组件。当前高阶组件就是继承后，加强型的业务组件。

```js{2,3}
function HOC(WrappedComponent) {
  // 继承业务组件，而不是 React.Component
  return class H extends WrappedComponent {

  }
}
```

::: tip 优点

- 方便获取组件内部状态，比如`state`，`props` ,生命周期,绑定的事件函数等

- es6 继承可以良好继承静态属性。我们无须对静态属性和方法进行额外的处理

:::

::: warning 缺点

- 函数组件无法使用

- 和被包装的组件强耦合，需要知道被包装的组件的内部状态，具体是做什么

- 如果多个反向继承`hoc`嵌套在一起，当前状态会覆盖上一个状态。这样带来的隐患是非常大的，比如说有多个`componentDidMount`，当前`componentDidMount`会覆盖上一个`componentDidMount`。这样副作用串联起来，影响很大。

:::

## 如何编写高阶组件

### 强化`props`

高阶组件可以修改传递给子组件的 `props`，用于动态注入数据或控制组件的行为

```js
function Hoc(WrapComponent) {
  return function Index(props) {
    const [state, setState] = useState({ name: 'steins gate' })
    return <WrapComponent {...props} {...state} />
  }
}
```

### 条件渲染

这个 `HOC` 将根据某些条件（如 `props` 或 状态）决定是否渲染原始组件

```js
function Hoc(WrappedComponent) {
  return function Index(props) {
    const { shouldRender, fallback = null } = props

    if (shouldRender) {
      return <WrappedComponent {...props} />
    } else {
      return fallback
    }
  }
}
```

### 赋能组件

高阶组件还可以赋能组件，比如加一些额外生命周期，劫持事件，监控日志等等

```js
function HOC(Component) {
  const parentDidMount = Component.prototype.componentDidMount
  Component.prototype.componentDidMount = function () {
    console.log('劫持生命周期：componentDidMount')
    parentDidMount.call(this)
  }
  return class wrapComponent extends React.Component {
    render() {
      return <Component {...this.props} />
    }
  }
}

@HOC
class Index extends React.Component {
  componentDidMount() {
    console.log('———didMounted———')
  }
  render() {
    return <div>hello,world</div>
  }
}
```

::: info 相关资料

- [<u>「react 进阶」一文吃透 React 高阶组件(HOC)</u>](https://github.com/GoodLuckAlien/blogs/blob/028fc6dce405027a7048985d92cb505134090949/react/react-hoc.md)

:::
