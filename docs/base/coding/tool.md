# 工具方法系列

## `debounce` 防抖函数

::: tip `debounce`

- 作用： 一个函数在一段时间内多次触发都只执行最后一次

- 原理： 利用定时器，在函数第一次执行时设定一个定时器，再次调用时如果已经设定过定时器就清空之前的定时器并设定一个新的定时器，当定时器结束后执行传入的回调函数

- 应用： 搜索输入框获取用户输入的结果

:::

::: info 实现防抖函数

```js
function debounce(fn, wait) {
  // 通过闭包缓存定时器 id
  let timer = null

  return function (...args) {
    // 如果定时器已经存在，清除定时器
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    // 设定定时器，定时器结束后执行传入的回调函数 fn
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}
```

:::

## `throttle` 节流函数

::: tip `throttle`

- 作用： 函数节流指指的是在一段时间内只允许函数执行一次 (例如 `3` 秒执行一次那么在函数第一次调用后的 `3` 秒内后面的函数调用将被忽略)

- 原理： 利用时间戳来判断，记录上次执行的时间戳，在每次触发事件时判断当前时间是否大于上次执行的时间 + 设置的间隔 ，如果是则执行回调并更新上次执行的时间戳

- 应用： 降低 `scroll resize` 事件的触发频率

:::

::: info 实现节流函数

```js
function throttle(fn, wait) {
  // 通过闭包缓存上一次的调用时间 (默认为 0)
  let lastCallTime = 0
  return function () {
    const now = Date.now()
    // 判断当前调用时间和上次调用时间的差值是否大于 wait
    if (now - lastCallTime >= wait) {
      // 更新调用时间
      lastCallTime = now
      // 执行回调函数
      fn.apply(this, arguments)
    }
  }
}
```

:::
