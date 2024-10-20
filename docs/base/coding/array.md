# 数组系列

## 反转数组的方式和时间复杂度

- 双指针法

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

- `reverse`

使用 `JavaScript` 的内置方法 `Array.prototype.reverse()`，返回原数组。

时间复杂度：`O(n)`

```js
const arr = [1, 2, 3, 4, 5]
arr.reverse()
```

- 递归

递归地交换数组的首尾元素。

时间复杂度：`O(n)`

```js
function reverseArrayRecursive(arr, start, end) {
  if (start >= end) return arr
  ;[arr[start], arr[end]] = [arr[end], arr[start]]
  return reverseArrayRecursive(arr, start + 1, end - 1)
}
```
