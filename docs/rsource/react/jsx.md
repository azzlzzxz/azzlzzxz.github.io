# JSX

> 源码地址 [<u>JSX | react/src/jsx/ReactJSXElement.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react/src/jsx/ReactJSXElement.js#L535)

## `ReactElement`

- `ReactElement`：这就是`React元素`，也被称为`React节点`或者`虚拟DOM`

> 源码地址 [<u>ReactElement | react/src/jsx/ReactJSXElement.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react/src/jsx/ReactJSXElement.js#L224)

```js
function ReactElement(type, key, ref, props) {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type, // h1 span dom类型
    key, // 唯一标识
    ref, // 是用来获取真实DOM的
    props, // 属性 例如：className、style、children、id等
    // ...
  }
}
```

- `REACT_ELEMENT_TYPE`

```js
// 表示此虚拟DOM的类型是一个React元素
export const REACT_ELEMENT_TYPE = Symbol.for('react.element')
```

## `jsxDEV`

- `React 17`以前老版的转换函数中`key` 是放在`config`里的,第三个参数放`children`

- `React 17`之后新版的转换函数中`key`是在第三个参数中的，`children`是放在`config`里的

  - `propName`：属性名

  - `props`：属性对象

  - `key`：每个虚拟 DOM 都有一个可选的 key 属性，用来区分一个父节点下的不同子节点

  - `ref`：可以通过它实现获取真实 DOM 的操作

```js
export function jsxDEV(type, config, maybeKey) {
  let propName
  const props = {}
  let key = null
  let ref = null

  if (typeof maybeKey !== 'undefined') {
    key = maybeKey
  }

  if (hasVaidRef(config)) {
    // 判断是否有ref属性
    ref = config.ref
  }

  for (propName in config) {
    if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
      props[propName] = config[propName]
    }
  }

  return ReactElement(type, key, ref, props)
}
```

### `RESERVED_PROPS`保留属性

```js
// 保留的属性,不会放到props上
const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
}
```
