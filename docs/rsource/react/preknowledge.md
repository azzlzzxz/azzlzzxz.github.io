# 前置知识

在解析`React`源码前，我们先了解一些前置知识

## 位运算符

**位运算** 是对二进制数字（比特位）进行操作的一组运算符，这些运算符在底层将数字作为 `32 位`有符号的整数进行处理，然后返回标准的数字。

### 常见的位运算符包括

- **按位与 `&`**

- **按位或 `|`**
- **按位异或 `^`**
- **按位非 `~`**
- **左移 `<<`**
- **有符号右移 `>>`**
- **无符号右移 `>>>`**

### 位运算的基本概念

位运算符直接在其操作数的二进制表示上进行操作。例如，数字 `5` 在二进制中表示为 `101`，数字 `3` 表示为 `011`。

### 按位与 (`&`)

按位与运算符将两个数字的每一位进行比较，**如果两位都为 1，则结果为 1，否则为 0**。

```js
let a = 5 // 二进制：101
let b = 3 // 二进制：011
let result = a & b // 结果为 1 (二进制：001)
console.log(result) // 输出 1
```

### 按位或 (`|`)

按位或运算符将两个数字的每一位进行比较，**如果两位中有至少一位为 1，则结果为 1，否则为 0**。

```js
let a = 5 // 二进制：101
let b = 3 // 二进制：011
let result = a | b // 结果为 7 (二进制：111)
console.log(result) // 输出 7
```

### 按位异或 (`^`)

按位异或运算符将两个数字的每一位进行比较，**如果两位相同则为 0，不同则为 1**。

```js
let a = 5 // 二进制：101
let b = 3 // 二进制：011
let result = a ^ b // 结果为 6 (二进制：110)
console.log(result) // 输出 6
```

### 按位非 (`~`)

按位非运算符是一个一元运算符，它对操作数的每一位进行反转（0 变成 1，1 变成 0）。

```js
let a = 5 // 二进制：00000000000000000000000000000101
let result = ~a // 结果为 -6 (二进制：11111111111111111111111111111010)
console.log(result) // 输出 -6
```

按位非将数字变成它的**负数减 1**。

### 左移 (`<<`)

左移运算符将一个数字的二进制位向左移动指定的位数，**右侧用 0 补位**。每次左移相当于乘以 2。

```js
let a = 5 // 二进制：101
let result = a << 1 // 结果为 10 (二进制：1010)

console.log(result) // 输出 10
```

### 有符号右移 (`>>`)

有符号右移运算符将一个数字的二进制位向右移动指定的位数，**左侧用符号位（正数为 0，负数为 1）补位**。右移相当于除以 2，忽略小数部分。

```js
let a = 5 // 二进制：101
let result = a >> 1 // 结果为 2 (二进制：10)
console.log(result) // 输出 2
```

### 无符号右移 (`>>>`)

无符号右移运算符将一个数字的二进制位向右移动指定的位数，**左侧用 0 补位**。无符号右移对于负数会将符号位也向右移动，结果会变成一个很大的正数。

```js
let a = -5
let result = a >>> 1 // 结果为 2147483645
console.log(result) // 输出 2147483645
```

### 使用场景

- **性能优化**：有时位运算符可以用于性能优化。例如，用 `<< 1` 替代乘以 2，用 `>> 1` 替代除以 2，运算速度会比直接乘除快。

## 带标签的`while`循环

带标识的 `while` 循环实际上是使用了 **标签语句`（label statement）`**。标签语句可以用来标识循环或代码块，然后我们可以通过 `break` 或 `continue` 语句结合标签名来控制跳出某个指定的循环，而不仅仅是最内层的循环。

### 标签语句的语法

```javascript
labelName: statement
```

其中 `labelName` 是标签的名字，`statement` 可以是任何有效的 `JavaScript` 语句，包括循环或条件语句。

### 带标签的 `while` 循环示例

```javascript
outerLoop: while (true) {
  console.log('进入外层循环')

  innerLoop: while (true) {
    console.log('进入内层循环')

    // 使用 continue 跳过当前内层循环的剩余部分，重新开始内层循环
    continue outerLoop
  }

  console.log('不会执行这行代码，因为已经跳到外层循环的开始')
}
```

在 👆 的示例中，`outerLoop` 是外层循环的标签。当执行到 `continue outerLoop` 时，内层循环的剩余部分会被跳过，直接跳到外层循环的开始。

### 使用 `break` 跳出指定循环

有时候我们希望直接跳出外层的循环，而不仅仅是当前循环，这时也可以使用标签。

```javascript
outerLoop: while (true) {
  console.log('外层循环')

  innerLoop: while (true) {
    console.log('内层循环')

    // 使用 break 结束外层循环
    break outerLoop
  }

  console.log('这行代码永远不会执行')
}

console.log('循环结束')
```

在 👆 例子中，`break outerLoop` 会立即结束外层循环 `outerLoop`，所以后面的 `console.log` 都不会执行。

### 总结

- **标签语句**（`label`）可以为循环或代码块加一个标识。

- 可以通过 `break labelName` 跳出带标签的循环，也可以用 `continue labelName` 跳到指定标签标识的循环的下一次迭代。
- 标签在嵌套循环中非常有用，特别是当我们想控制跳出特定层级的循环时。

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

## 最小堆

最小堆是一种特殊的**二叉堆**数据结构，它满足以下性质：

- **完全二叉树**：最小堆是一棵完全二叉树，即除了最后一层，所有的层都被完全填满，且节点是从左到右填充的。

- **堆的性质**：在最小堆中，每个节点的值都小于或等于其左右子节点的值。因此，根节点（即树的顶部节点）的值是整个堆中最小的值。

最小堆常用于实现优先级队列、最短路径算法等。

### 最小堆的特性

-**插入操作**：当新元素插入时，它被放在树的最后一层，然后通过`向上调整`操作来恢复堆的性质。

- **删除最小值操作**：删除最小值时，根节点会被删除，然后将树的最后一个节点移到根节点的位置，并通过`向下调整`操作来恢复堆的性质。

- **查找最小值**：在最小堆中，最小值总是位于堆的根节点，因此查找最小值的时间复杂度为 `O(1)`。

### 最小堆的实现

最小堆可以使用数组来实现，对于给定的节点在数组中的索引 `i`，它的父节点和子节点的索引可以通过以下公式计算：

- 父节点索引：`(i - 1) // 2`
- 左子节点索引：`2 * i + 1`
- 右子节点索引：`2 * i + 2`

### 最小堆的时间复杂度

- **插入**：`O(log n)`，因为插入元素时需要进行上浮操作，最坏情况下会移动到根节点。
- **删除最小值**：`O(log n)`，删除最小值后需要进行下沉操作，最坏情况下会移动到叶子节点。
- **查找最小值**：`O(1)`，因为最小值总是位于堆的根节点。

## `MessageChannel`

[<u>MessageChannel | MDN 介绍</u>](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel)

由于 `requestIdleCallback` 的兼容性问题，所以目前`React`利用 `MessageChannel`模拟了`requestIdleCallback`，将回调延迟到绘制操作之后执行。

`MessageChannel` 是 `Web API` 中的一部分，提供了一种在不同的浏览上下文（如不同的 `window`、`iframe`、`worker` 等）之间传递消息的方式。它允许两个独立的环境之间建立一个双向通信通道，使用 `MessageChannel` 的两个 `MessagePort` 对象来发送和接收消息。

### `MessageChannel` 的构成

- **`MessageChannel`**：这是主要的对象，用来创建一个新的消息通道。

- **`MessagePort`**：当你创建一个 `MessageChannel` 对象时，它会生成两个 `MessagePort` 对象。两个端口对象可以分别发送和接收消息。它们通过 `postMessage` 方法发送消息，使用 `onmessage` 事件处理程序接收消息。

- **`postMessage`**：使用 `postMessage` 方法发送消息到另一端的 `MessagePort`。

- **`onmessage`**：用于接收消息的事件处理程序。

> 举个例子 🌰

```javascript
// 创建一个新的 MessageChannel 实例
const channel = new MessageChannel()

// 获取两个 MessagePort
const port1 = channel.port1
const port2 = channel.port2

// 监听 port1 的消息
port1.onmessage = function (event) {
  console.log('Message received at port1:', event.data)
}

// 监听 port2 的消息
port2.onmessage = function (event) {
  console.log('Message received at port2:', event.data)
}

// 使用 postMessage 发送消息
port1.postMessage('Hello from port1!')
port2.postMessage('Hello from port2!')
```

> 输出

```sh
Message received at port1: Hello from port2!
Message received at port2: Hello from port1!
```

### 主要特点

- **双向通信**：每个 `MessagePort` 可以同时发送和接收消息。
- **跨上下文**：可以在不同的浏览器上下文之间（如 `window`、`iframe`、`web worker`）进行通信。
- **无副作用的通信**：与 `DOM` 没有直接的关系，消息传递机制是独立的，避免了性能开销。
