# 排序

## 冒泡排序

重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来

::: tip 实现思路

- 比较相邻的元素，如果第一个比第二个大，就交换它们两个

- 对每一对相邻元素执行同样操作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数

:::

```js
function bubbleSort(arr) {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 相邻元素两两对比
        var temp = arr[j + 1] // 元素交换
        arr[j + 1] = arr[j]
        arr[j] = temp
      }
    }
  }
  return arr
}
```

## 选择排序

选择排序是一种简单直观的排序算法，它也是一种交换排序算法

::: tip 实现思路

- 在未排序序列中找到最小（大）元素，存放到排序序列的起始位置

- 从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。

- 重复第二步，直到所有元素均排序完毕

:::

```js
function selectionSort(arr) {
  var len = arr.length
  var minIndex, temp
  for (var i = 0; i < len - 1; i++) {
    minIndex = i
    for (var j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        // 寻找最小的数
        minIndex = j // 将最小数的索引保存
      }
    }
    temp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = temp
  }
  return arr
}
```

## 插入排序

插入排序是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入

::: tip 实现思路

- 把待排序的数组分成已排序和未排序两部分，初始的时候把第一个元素认为是已排好序的

- 从第二个元素开始，在已排好序的子数组中寻找到该元素合适的位置并插入该位置（如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面。）

- 重复上述过程直到最后一个元素被插入有序子数组中

:::

```js
function insertionSort(arr) {
  const len = arr.length
  let preIndex, current
  for (let i = 1; i < len; i++) {
    preIndex = i - 1
    current = arr[i]
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex]
      preIndex--
    }
    arr[preIndex + 1] = current
  }
  return arr
}
```

## 归并排序

归并排序是建立在归并操作上的一种有效的排序算法，将已有序的子序列合并，得到完全有序的序列，即先使每个子序列有序，再使子序列段间有序

::: tip 实现思路

- 分：把数组分成两半，再递归对子数组进行分操作，直至到一个个单独数字

- 合：把两个数合成有序数组，再对有序数组进行合并操作，直到全部子数组合成一个完整的数组

  - 合并操作可以新建一个数组，用于存放排序后的数组

  - 比较两个有序数组的头部，较小者出队并且推入到上述新建的数组中

  - 如果两个数组还有值，则重复上述第二步

  - 如果只有一个数组有值，则将该数组的值出队并推入到上述新建的数组中

:::

```js
function mergeSort(arr) {
  // 采用自上而下的递归方法
  const len = arr.length
  if (len < 2) {
    return arr
  }
  let middle = Math.floor(len / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle)

  return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
  const result = []

  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }

  while (left.length) result.push(left.shift())

  while (right.length) result.push(right.shift())

  return result
}
```

## 快速排序

快速排序是对冒泡排序算法的一种改进，基本思想是通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据比另一部分的所有数据要小

再按这种方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，使整个数据变成有序序列

::: tip 实现思路

- 从数组中挑出一个元素，称为"基准"（pivot）

- 重新排序数列，所有比基准值小的元素摆放在基准前面，所有比基准值大的元素摆在基准后面（相同的数可以到任何一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区操作

- 递归地把小于基准值元素的子数列和大于基准值元素的子数列排序

:::

```js
function quickSort(arr) {
  const rec = (arr) => {
    if (arr.length <= 1) return arr
    const left = []
    const right = []
    const mid = arr[0] // 基准元素
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < mid) {
        left.push(arr[i])
      } else {
        right.push(arr[i])
      }
    }
    return [...rec(left), mid, ...rec(right)]
  }
  return res(arr)
}
```

::: info 相关资料

- [<u>常见的排序有哪些</u>](https://vue3js.cn/interview/algorithm/sort.html#%E4%B8%80%E3%80%81%E6%98%AF%E4%BB%80%E4%B9%88)

:::
