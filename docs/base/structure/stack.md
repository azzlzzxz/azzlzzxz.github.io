# 栈

栈是一种先进后出 (`LIFO`) 的结构，只能在一端（栈顶）进行添加和删除操作

- `push`：入栈操作，向栈顶添加元素

- `pop`：出栈操作，从栈顶移除元素
- `peek`：查看栈顶元素，但不移除
- `isEmpty`：检查栈是否为空

- `clear`：移除栈里的所有元素

- `size`：获取栈中元素的数量

> 简单实现一个栈结构

```js
class Stack {
  constructor() {
    this.items = []
  }

  /**
   * 添加一个（或几个）新元素到栈顶
   * @param {*} element 新元素
   */
  push(element) {
    this.items.push(element)
  }

  /**
   * 移除栈顶的元素，同时返回被移除的元素
   */
  pop() {
    return this.items.pop()
  }

  /**
   * 返回栈顶的元素，不对栈做任何修改（这个方法不会移除栈顶的元素，仅仅返回它）
   */
  peek() {
    return this.items[this.items.length - 1]
  }

  /**
   * 如果栈里没有任何元素就返回true，否则返回false
   */
  isEmpty() {
    return this.items.length === 0
  }

  /**
   * 移除栈里的所有元素
   */
  clear() {
    this.items = []
  }

  /**
   * 返回栈里的元素个数。这个方法和数组的length属性很类似
   */
  size() {
    return this.items.length
  }
}
```

::: tip 应用场景

- 函数调用栈：用于保存函数调用过程中的局部变量和返回地址。

- 浏览器历史记录：浏览器使用栈来存储访问过的页面，可以通过后退按钮回到上一个页面。

- 撤销操作：编辑器和图形软件使用栈来实现撤销操作

:::
