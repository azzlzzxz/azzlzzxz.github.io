# 查找

## 二分查找

二分查找算法，也称折半搜索算法，是一种在有序数组中查找某一特定元素的搜索算法

搜索过程从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜索过程结束

如果特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找，而且跟开始一样从中间元素开始比较

这种搜索算法每一次比较都使搜索范围缩小一半

::: tip 特性

- 存储在数组中

- 有序排序

:::

> 示图

![binary_search](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/binary_search.jpg)

### 数据有序的，不存在重复项

```js
function binarySearch(arr, target) {
  if (arr.length <= 1) return -1
  // 低位下标
  let lowIndex = 0
  // 高位下标
  let highIndex = arr.length - 1

  while (lowIndex <= highIndex) {
    // 中间下标
    const midIndex = Math.floor((lowIndex + highIndex) / 2)

    if (target < arr[midIndex]) {
      highIndex = midIndex - 1
    } else if (target > arr[midIndex]) {
      lowIndex = midIndex + 1
    } else {
      // target === arr[midIndex]
      return midIndex
    }
  }
  return -1
}
```

### 数据有序的，存在重复项

- `midIndex` 为 `0` 或者前一个数比 `target` 小那么就找到了第一个等于给定值的元素，直接返回

```js
function BinarySearchFirst(arr, target) {
  if (arr.length <= 1) return -1
  // 低位下标
  let lowIndex = 0
  // 高位下标
  let highIndex = arr.length - 1

  while (lowIndex <= highIndex) {
    // 中间下标
    const midIndex = Math.floor((lowIndex + highIndex) / 2)
    if (target < arr[midIndex]) {
      highIndex = midIndex - 1
    } else if (target > arr[midIndex]) {
      lowIndex = midIndex + 1
    } else {
      // 当 target 与 arr[midIndex] 相等的时候，如果 midIndex 为0或者前一个数比 target 小那么就找到了第一个等于给定值的元素，直接返回
      if (midIndex === 0 || arr[midIndex - 1] < target) return midIndex
      // 否则高位下标为中间下标减1，继续查找
      highIndex = midIndex - 1
    }
  }
  return -1
}
```

::: tip 应用场景

- [<u>React-window 实现查找开始显示条目的索引</u>](https://github.com/azzlzzxz/react-window/blob/f6100f2b397366bbc65ffe6d469fa00fd558d624/src/react-window/VariableSizeList.js#L67)

- [<u>React-window 源码 实现查找开始显示条目的索引</u>](https://github.com/bvaughn/react-window/blob/8736ede0090a9652b81b7933affc52a26fe4d744/src/VariableSizeList.js#L90)

:::
