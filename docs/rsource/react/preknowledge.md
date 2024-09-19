# 前置知识

在解析`React`源码前，我们先了解一些前置知识

## 位运算符

## 有标识的`while`循环

## 事件委托（代理）

从`React 17.0.0`开始, `React` 不会再将事件处理添加到 `document` 上, 而是将事件处理添加到渲染 `React` 树的根 `DOM` 容器中

![react_17_delegation_authority](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/react_17_delegation_authority.png)

图中清晰的展示了`v17.0.0`的改动, 无论是在`document`还是根 `DOM` 容器上监听事件, 都可以归为[<u>事件委托(代理)</u>](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events)

### 那什么是事件委托呢？

事件委托是把原本需要绑定在子元素的事件委托给父元素，让父元素负责事件监听，事件委托是利用事件冒泡来实现的

::: tip 优点

- 可以大量节省内存占用，减少事件注册
- 当新增子对象时无需再次对其绑定
  :::

![react_event_entrust](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react/react_event_entrust.jpg)
