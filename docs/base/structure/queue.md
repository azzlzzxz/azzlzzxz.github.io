# 队列

队列是一种先进先出 (`FIFO`) 的结构，在一端添加元素，在另一端删除元素

- 入队（`Enqueue`） ：向队尾添加元素。

- 出队（`Dequeue`） ：从队头移除元素。

- 查看队头元素（`Front`） ：查看队头元素，但不移除。

- 查看队尾元素（`Rear`） ：查看队尾元素，但不移除。

- 判空（`isEmpty`） ：检查队列是否为空。

- 获取队列大小（`Size`） ：获取队列中元素的数量。

> 简单实现一个队列

```js
class BaseQueue {
  queueData = []

  // 入队
  enqueue(elem) {
    this.queueData.push(elem)
  }

  // 出队
  dequeue() {
    const delElem = this.queueData.shift()
    return delElem
  }

  // 查看队头元素
  front() {
    return this.queueData[0]
  }

  // 查看队尾元素
  rear() {
    return this.queueData[this.queueData.length - 1]
  }

  isEmpty() {
    return this.queueData.length === 0
  }

  size() {
    return this.queueData.length
  }
}
```

::: tip 应用场景

- [<u>React 更新队列 🚀</u>](/rsource/react/updateQueue.md)

:::
