# Promise 方法

## `Promise.all` 实现原理

```js
const fs = require('fs')
const getName = fs.readFile('name.txt', 'utf8')
const getAge = fs.readFile('age.txt', 'utf8')
Promise.all([1, getName, getAge, 2]).then((data) => {
  console.log(data)
})
```

`Promise.all` 方法返回的是一个 `promise`，其中一个失败就真的失败了

::: tip times 做计数器的原因

- `[1,getName,getAge,2]`循环走到`2`，那么`getName`，`getAge`是`empty`，因为是异步的，所以不能用`result.length === promises.length`作为判断条件
  :::

```js
// 判断是不是promise
function isPromise(val) {
  return val && typeof val.then === 'function'
}

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let result = []
    let times = 0
    //做计数器的原因是：[1,getName,getAge,2]循环走到2，那么getName,getAge是empty，因为是异步的，所以不能用result.length === promises.length作为判断条件
    function processData(i, val) {
      result[i] = val
      if (times++ === promises.length) {
        resolve(result)
      }
    }

    for (let i = 0; i < promises.length; i++) {
      if (isPromise(promises[i])) {
        promises[i].then((data) => {
          processData(i, data)
        }, reject)
      } else {
        processData(i, promises[i])
      }
    }
  })
}
```

## `Promise.race` (赛跑 采用跑的快的作为结果)

```js
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok')
  }, 1000)
})
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('no ok')
  }, 2000)
})
Promise.race([p1, p2, 1])
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(err)
  })
```

`Promise.race` 实现原理

```js
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      let currentVal = promises[i]
      if (currentVal && typeof currentVal.then === 'function') {
        currentVal.then(resolve, reject)
      } else {
        resolve(currentVal)
      }
    }
  })
}
```

## `Promise.finally`

```js
// Promise.prototype.finally 也是相当于then 最终的  不是try  catch  finally
Promise.prototype.finally = function (callback) {
  return this.then(
    (data) => {
      // this指向Promise.reject(123)
      // 让函数执行 内部会调用方法，如果方法是promise需要等待他完成
      return Promise.resolve(callback()).then(() => data)
    },
    (err) => {
      return Promise.resolve(callback()).then(() => {
        throw err
      })
    },
  )
}
Promise.reject(123)
  .finally((data) => {
    // 这里传入的函数 无论如何都会执行
    console.log('finally')
    // finally 可以返回一个promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('ok')
      }, 5000)
    })
  })
  .then(
    (data) => {
      console.log('s:' + data)
    },
    (err) => {
      console.log('e:' + err)
    },
  )
```

## `PromisifyAll`

```js
const fs = require('fs')
const util = require('util') // 内置模块  node中内置了promisify
// bluebird promise库 promisify promisifyAll
function promisify(fn) {
  // 高阶函数  fs.readFile
  return function (...args) {
    // node.md  ,'utf8'
    return new Promise((resolve, reject) => {
      fn(...args, function (err, data) {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }
}
```

```js
function promisifyAll(target) {
  // 这个方法不内置
  // Object.keys  Object.defineProperty  Reflect.defineProperty
  Reflect.ownKeys(target).forEach((key) => {
    if (typeof target[key] === 'function') {
      target[key + 'Async'] = util.promisify(target[key])
    }
  })
  return target
}
let obj = promisifyAll(fs)
obj.readFileAsync('note.md', 'utf8').then((data) => {
  console.log(data)
})
```

```js
fs.readFile('note.md', 'utf8', function (params) {})

fs.readFile().then()

// 把一些异步的api 转化成了promise的方式  （只针对node写法）

const readFile = promisify(fs.readFile) // 怎么将node的api 转化成promise api
readFile('note.md', 'utf8').then((data) => {
  console.log(data)
})
```

## `abort：Promise` 超时处理

```js
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功了')
  }, 3000)
})
function warp(p1) {
  // p1是用户的，我再内部在构建一个promise 和 用户传入的组成一队
  let abort
  let p2 = new Promise((resolve, reject) => {
    //p1先跑完的情况下 p2就是空的promise 没有任何含义
    abort = reject
  })
  let newP = Promise.race([p1, p2])
  newP.abort = abort
  return newP
}
let p2 = warp(p1)
p2.then((data) => {
  console.log(data)
}).catch((err) => {
  console.log(err)
})
setTimeout(() => {
  // 如果超过两秒就让这个promise失败掉
  p2.abort()
}, 2000)
```

## `Promise.allSettled`

`Promise.allSettled()` 方法接受一个 可迭代对象（通常是一个数组），并返回一个新的 `Promise`。

这个新 `Promise` 会在所有输入的 `Promise` 都 已解决或已拒绝 时完成。返回的结果是一个数组，数组中的每个元素都是一个对象，表示对应的 `Promise` 的状态

::: tip 实现思路

- 它返回一个新的 `Promise`，这个 `Promise` 会在所有的输入 `Promise` 都 `settled`（无论是成功还是失败）时完成。

- 对于每个输入 `Promise`，都会调用它的 `then` 和 `catch` 方法，来捕获它们的结果或错误。

- 最终把所有结果组合成一个数组，返回这个数组。

:::

```js
Promise.allSettled = function (promises) {
  // 返回一个新的 Promise
  return new Promise((resolve, reject) => {
    // 检查传入的是否是可迭代对象
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an iterable'))
    }

    const results = [] // 用于存储每个 Promise 的结果
    let completedPromises = 0 // 记录已 settled 的 Promise 数量

    // 遍历所有的 Promise
    promises.forEach((promise, index) => {
      // 将每个 promise 包装为一个 settled 处理器
      Promise.resolve(promise)
        .then((value) => {
          results[index] = { status: 'fulfilled', value }
        })
        .catch((reason) => {
          results[index] = { status: 'rejected', reason }
        })
        .finally(() => {
          completedPromises += 1 // 每完成一个 Promise 递增

          // 当所有的 Promise 都 settled 后，resolve 返回结果数组
          if (completedPromises === promises.length) {
            resolve(results)
          }
        })
    })

    // 处理空的 Promise 数组
    if (promises.length === 0) {
      resolve(results)
    }
  })
}
```
