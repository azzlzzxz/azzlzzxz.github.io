# 数组系列

## 反转数组的方式和时间复杂度

### 双指针法

使用两个指针分别从数组的头和尾开始，逐一交换数组中的元素，直到两个指针相遇。

时间复杂度：`O(n)`，其中 `n` 是数组的长度。

```js
function reverseArray(arr) {
  let left = 0,
    right = arr.length - 1
  while (left < right) {
    ;[arr[left], arr[right]] = [arr[right], arr[left]]
    left++
    right--
  }
  return arr
}
```

### `reverse`

使用 `JavaScript` 的内置方法 `Array.prototype.reverse()`，返回原数组。

时间复杂度：`O(n)`

```js
const arr = [1, 2, 3, 4, 5]
arr.reverse()
```

### 递归

递归地交换数组的首尾元素。

时间复杂度：`O(n)`

```js
function reverseArrayRecursive(arr, start, end) {
  if (start >= end) return arr
  ;[arr[start], arr[end]] = [arr[end], arr[start]]
  return reverseArrayRecursive(arr, start + 1, end - 1)
}
```

## 扁平数组结构转`Tree`

```js
// 打平的数据内容
let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
]
```

> 输出结构

```js
;[
  {
    id: 1,
    name: '部门1',
    pid: 0,
    children: [
      {
        id: 2,
        name: '部门2',
        pid: 1,
        children: [],
      },
      {
        id: 3,
        name: '部门3',
        pid: 1,
        children: [
          // 结果 ...
        ],
      },
    ],
  },
]
```

- 不考虑性能实现，递归遍历查找

主要思路是提供一个递`getChildren`的方法，该方法递归去查找子集。

```js
/**
 * 递归查找，获取children
 */
const getChildren = (data, result, pid) => {
  for (const item of data) {
    if (item.pid === pid) {
      const newItem = { ...item, children: [] }
      result.push(newItem)
      getChildren(data, newItem.children, item.id)
    }
  }
}

/**
 * 转换方法
 */
const arrayToTree = (data, pid) => {
  const result = []
  getChildren(data, result, pid)
  return result
}
```

**从上面的代码我们分析，该实现的时间复杂度为`O(2^n)`。**

- 不用递归，也能搞定

主要思路是先把数据转成`Map`去存储，之后遍历的同时借助对象的引用，直接从`Map`找对应的数据做存储。

```js
function arrayToTree(items) {
  const result = [] // 存放结果集
  const itemMap = {} // map存储每个节点

  for (const item of items) {
    const id = item.id
    const pid = item.pid

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]['children'],
    }

    const treeItem = itemMap[id]

    if (pid === 0) {
      result.push(treeItem)
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      itemMap[pid].children.push(treeItem)
    }
  }
  return result
}
```

**从上面的代码我们分析，一次循环就搞定了，该实现的时间复杂度为`O(n)`，需要一个 Map 把数据存储起来，空间复杂度`O(n)`。**

## 数组去重

在 JavaScript 中，数组去重是一个常见的操作。你可以使用多种方式来去除数组中的重复项。下面介绍几种常见且有效的数组去重方法，详细解释其原理、实现以及时间复杂度。

### 使用 `Set`

`Set` 是 `ES6` 引入的集合类型，它只允许存储唯一的值。因此，可以通过将数组转换为 `Set` 来实现去重。

> 举个 🌰

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5]
const uniqueArr = [...new Set(arr)]
console.log(uniqueArr) // [1, 2, 3, 4, 5]
```

::: tip **解释：**

- `Set` 自动去除重复值，因为集合中的每个值都是唯一的。

- `new Set(arr)` 会返回一个 `Set` 对象，它包含了原数组中所有唯一的值。

- 使用扩展运算符 `...` 将 `Set` 对象转换回数组。

:::

**时间复杂度：**

- `Set` 的插入和查找都是 `O(1)`，遍历数组的时间复杂度是 `O(n)`，因此总的时间复杂度是 `O(n)`。

### 使用 `filter()` 和 `indexOf()`

`filter()` 方法可以用于返回满足条件的数组元素。配合 `indexOf()` 方法，可以检查元素在数组中的首次出现位置，以实现去重。

> 举个 🌰

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5]
const uniqueArr = arr.filter((item, index) => arr.indexOf(item) === index)
console.log(uniqueArr) // [1, 2, 3, 4, 5]
```

::: tip **解释：**

- `arr.indexOf(item)` 返回数组中 `item` 的首次出现位置。

- `filter()` 只保留那些当前索引等于 `indexOf(item)` 的元素，去除后面重复出现的元素。

:::

**时间复杂度：**

- 对每个元素调用 `indexOf()`，其时间复杂度是 `O(n)`，整体复杂度是 `O(n^2)`，因为 `filter()` 要遍历数组，每次查找时都要遍历整个数组。

### 使用 `reduce()` 和 `includes()`

`reduce()` 可以用于累积操作，将数组中的元素逐一放入新的数组，配合 `includes()` 方法可以避免将重复的元素放入结果数组。

> 举个 🌰

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5]
const uniqueArr = arr.reduce((acc, curr) => {
  if (!acc.includes(curr)) {
    acc.push(curr)
  }
  return acc
}, [])
console.log(uniqueArr) // [1, 2, 3, 4, 5]
```

::: tip**解释：**

- `reduce()` 方法逐个遍历数组元素，`acc` 是累积器，`curr` 是当前元素。

- 每次迭代检查累积器数组 `acc` 中是否包含当前元素 `curr`，如果不存在则将其添加到 `acc` 中。

:::

**时间复杂度：**

- `includes()` 方法的时间复杂度是 `O(n)`，每次插入元素时都要遍历数组，因此总的时间复杂度为 `O(n^2)`。

### 使用 `Map` 进行键值对的存储

`Map` 是 ES6 引入的键值对集合，可以利用它的键的唯一性来去重。

> 举个 🌰

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5]
const map = new Map()
const uniqueArr = arr.filter((item) => !map.has(item) && map.set(item, true))
console.log(uniqueArr) // [1, 2, 3, 4, 5]
```

::: tip **解释：**

- `Map` 对象的 `has()` 方法用于检查某个键是否存在。

- 如果 `Map` 中不存在当前元素，则将其插入 `Map`，并通过 `filter()` 返回唯一值。

:::

**时间复杂度：**

- `Map` 的插入和查找时间复杂度是 `O(1)`，遍历数组的时间复杂度是 `O(n)`，因此总时间复杂度是 `O(n)`。

### 使用 `forEach()` 和对象属性

利用对象的键是唯一的这一特性，可以创建一个对象来存储数组元素，并通过对象属性来去重。

> 举个 🌰

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5]
const uniqueObj = {}
const uniqueArr = []
arr.forEach((item) => {
  if (!uniqueObj[item]) {
    uniqueObj[item] = true
    uniqueArr.push(item)
  }
})
console.log(uniqueArr) // [1, 2, 3, 4, 5]
```

::: tip **解释：**

- 创建一个空对象 `uniqueObj`，用来记录数组中出现过的元素。

- `forEach()` 遍历数组，如果对象中不存在该元素作为键，则将其添加到对象中，并将元素添加到 `uniqueArr`。

:::

**时间复杂度：**

- 插入对象的属性和查找对象的属性的时间复杂度都是 `O(1)`，遍历数组的时间复杂度是 `O(n)`，因此总时间复杂度是 `O(n)`。

### `ES5` 实现

在 `ES5` 及之前的 `JavaScript` 版本中，你可以使用嵌套循环的方式实现去重。

> 举个 🌰

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5]
const uniqueArr = []
for (let i = 0; i < arr.length; i++) {
  if (uniqueArr.indexOf(arr[i]) === -1) {
    uniqueArr.push(arr[i])
  }
}
console.log(uniqueArr) // [1, 2, 3, 4, 5]
```

::: tip **解释：**

- 通过嵌套循环（或者使用 `indexOf`）来检查是否已经存在元素，来决定是否将该元素添加到结果数组中。

:::

**时间复杂度：**

- 外层循环是 `O(n)`，`indexOf()` 查找是 `O(n)`，总时间复杂度是 `O(n^2)`。
