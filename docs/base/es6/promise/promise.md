# Promise 原理

## `Promise` 解决的问题

- 异步并发问题`（Promise.all）`
- 解决回调地狱（链式操作）
- 错误处理十分方便`（catch 方法）`
- 缺陷：依然是基于回调函数的，进化版：`generator + co`---> `async + await`

## `Promise` 实现步骤

- `Promise` 是一个类，类中的构造函数需要传入一个 `executor`，默认会执行。

- `executor` 里有两个参数分别是 `resolve`、`reject`。
- 默认创建一个 `Promise` 的状态就是 `pending`、`fulfilled`、`rejected`三种状态。
- 调用成功和失败时，需要传入成功和失败的原因。
- `Promise` 的状态一旦确定就不能改变 **（如果成功了就不会失败）**。
- 每一个 `Promise` 实例都有 `then` 方法。
- 如果抛出异常，按失败来处理。

### 先简单实现一个同步状态的 `promise`

> 举个 🌰

```javascript
const Promise = require('./promise.js')

let p = new Promise((resolve, reject) => {
  resolve('成功')
})

p.then(
  (data) => {
    // 成功的回调 onFulfilled
    console.log('success', data)
  },
  (reason) => {
    // 失败的回调 onRejected
    console.log('error', reason)
  },
)
```

> 实现同步的 promise

```js
const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
}

class Promise {
  // 类中的构造函数会传入一个executor
  constructor(executor) {
    this.status = STATUS.PENDING
    this.value = undefined
    this.reason = undefined

    // executor的参数resolve函数
    const resolve = (val) => {
      if (this.status == STATUS.PENDING) {
        this.status = STATUS.FULFILLED
        this.value = val
      }
    }

    //executor的参数reject函数
    const reject = (reason) => {
      if (this.status == STATUS.PENDING) {
        this.status = STATUS.REJECTED
        this.reason = reason
      }
    }

    try {
      // executor会默认执行
      executor(resolve, reject)
    } catch (e) {
      // 出错走失败逻辑
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value

    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    if (this.status === STATUS.FULFILLED) onFulfilled(this.value)

    if (this.status === STATUS.REJECTED) onRejected(this.reason)
  }
}

module.exports = Promise
```

👆 那个 `promise` 无法解决异步问题（`promise` 里放定时器）。

这时就需要把 then 里的 `onFulfilled` 和 `onReject` 函数存起来，当 `Promise` 走 `resolve` 和 `rejected` 时才调用，利用订阅发布模式

### 再实现一个异步状态的 `promise`

> 举个 🌰

```js
let p = new Promise((resolve, rejected) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})

p.then(
  (data) => {
    console.log(data)
  },
  (error) => {
    console.log(error)
  },
)
```

> 实现一个异步的 promise

```js
const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
}
class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING
    this.value = undefined
    this.reason = undefined

    // 存放成功的回调
    this.onResolveCallbacks = []
    // 存放失败的回调
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      this.value = value
      this.status = STATUS.FULFILLED

      // 在promise状态确定下来时候就依次执行，数组里的函数（也就是发布）
      this.onResolveCallbacks.forEach((fn) => fn())
    }

    const reject = (reason) => {
      this.reason = reason
      this.status = STATUS.REJECTED

      this.onRejectedCallbacks.forEach((fn) => fn())
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    if (this.status === STATUS.FULFILLED) onFulfilled(this.value)
    if (this.status === STATUS.REJECTED) onRejected(this.reason)

    if (this.status === STATUS.PENDING) {
      // promise的状态处于pending，需要等promise的状态确定下来，再走then的onFulfilled/onRejected方法，
      // 所以需要把onFulfilled/onRejected，存到数组里，这里就是订阅
      this.onResolveCallbacks.push(() => {
        onFulfilled(this.value)
      })

      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}
```

## `promise` 链式调用

- 如果 `then` 方法中（成功或失败），返回的不是一个 `promise`，那么会将 `then` 的返回值出递给外层下一个 `then` 的成功的结果。

- 如果 `then` 方法出错、抛出异常，则会走外层下一个 `then` 方法的失败。

- 如果 `then` 返回的是个 `promise`，则会用 `promise` 的成功或失败，来走外层 `then` 的成功或失败。

::: warning 什么时候会当前的 `then` 走完会走下一个 `then` 的失败

- `then` 出错就失败。

- 返回的 `promise` 出错或失败，就走下个 `then` 的失败，其他一律走下个 `then` 的成功。
  :::

::: tip `then` 方法为什么能够链式调用

- 因为每次调用 `then` 方法都会返回一个新的 `promise`，才能保证状态一直改变（当上层的 `promise` 失败时，之后会走 `then` 方法的失败 `onRejected`，返回新的 `promise` 会走下个 `then` 的成功 `onFulfilled`）

- `catch` 就是 `then` 方法的别名，没有成功只有失败（找最近的优先处理，处理不了就向下找），也就是说 `promise` 失败，会先走 `then` 的 `onRejected` 方法返回失败的值，如果找不到，就会走 `catch`。

:::

### `Promise` 链式调用原理一：`then` 同步状态，返回的是 `promise`

> 举个 🌰

```js
const Promise = require('./promise.js')

function read(...args) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

let p = read('name.txt', 'utf8')

let promise2 = p.then(
  (data) => {
    return 100
    // throw new Error()
  },
  (err) => {
    return 200
  },
)

promise2.then(
  (data) => {
    console.log(data)
  },
  (err) => {
    console.log('err', err)
  },
)
```

> then 同步状态，返回的是 promise

```js
const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
}
class Promise {
  constructor(executor) {
    this.status = 'PENDING'
    this.value = undefined
    this.reason = undefined
    this.onResolveCallbacks = []
    this.onRejectCallbacks = []

    const resolve = (val) => {
      // 最外层的promise状态
      this.status = STATUS.FULFILLED
      this.value = val
      this.onResolveCallbacks.forEach((fn) => fn())
    }

    const reject = (reason) => {
      this.status = STATUS.REJECTED
      this.reason = reason
      this.onRejectCallbacks.forEach((fn) => fn())
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        // 上层promise成功
        try {
          // 走then方法成功，返回的不是promise
          let x = onFulfilled(this.value)
          // 会将值传给外层下一个then的成功结果里
          resolve(x)
        } catch (e) {
          // then成功方法执行时抛出异常
          reject(e) // 会将异常传给外层下一个then的失败结果里
        }
      }

      if (this.status === STATUS.REJECTED) {
        // 上层promise失败
        try {
          // 走then方法失败，返回的不是promise
          let x = onRejected(this.reason)
          // 会将值传给外层then方法的成功里
          resolve(x)
        } catch (e) {
          // 走then方法失败，抛异常
          reject(e) // 会将异常传给外层then的失败结果里
        }
      }

      if (this.status === STATUS.PENDING) {
        this.onResolveCallbacks.push(() => {
          try {
            let x = onFulfilled(this.value)
            resolve(x)
          } catch (e) {
            reject(e)
          }
        })

        this.onRejectCallbacks.push(() => {
          try {
            let x = onRejected(this.reason)
            resolve(x)
          } catch (e) {
            reject(e)
          }
        })
      }
    })

    return promise2 // promise调用then方法会生成新的promise
  }
}
```

### `Promise` 链式调用原理二：`then` 异步状态，返回的是 `promise`

> 举个 🌰

```js
function read (...args) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

let p = read('name.txt','utf8')

// 判断返回值和promise2的关系，这个返回值决定promise2的成功还是失败
let promise2 = p.then((data)=>{
  // 判断当前成功/失败返回的是不是一个promise
  return new Promise((resolve, reject) => {
    resolve(return new Promise((resolve, reject) => {
      resolve(return new Promise((resolve, reject) => {
        resolve(return new Promise((resolve, reject) => {
            setTimeOut(()=>{
                resolve('ok')
            }, 1000)
        }))
      }))
    }))
  })
})

promise2.then((data)=>{
  console.log(data)
}, err => {
  console.log('err', err)
})
```

> then 异步状态，返回的是 promise

```js
const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
}

function nextTick(callback) {
  if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
    process.nextTick(callback)
  } else {
    const observer = new MutationObserver(callback)

    const textNode = document.createTextNode('1')

    observer.observe(textNode, {
      characterData: true,
    })

    textNode.data = '2'
  }
}

class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolveCallbacks = []
    this.onRejectCallbacks = []

    const resolve = (val) => {
      this.status = STATUS.FULFILLED
      this.value = val
      // 执行成功回调
      this.onResolveCallbacks.forEach((fn) => fn())
    }

    const reject = (reason) => {
      this.status = STATUS.REJECTED
      this.reason = reason
      // 执行失败回调
      this.onRejectCallbacks.forEach((fn) => fn())
    }
    // executor会默认执行
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    // 2.2.7规范 then 方法必须返回一个新的 promise 对象
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        /**
         * 为什么这里要加定时器setTimeout？
         * 2.2.4规范 onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用 注1
         * 这里的平台代码指的是引擎、环境以及 promise 的实施代码。
         * 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
         * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
         */
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              // 2.2.7.3规范 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
              resolve(this.value)
            } else {
              // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)，即运行resolvePromise()
              let x = onFulfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            }
          } catch (e) {
            // 2.2.7.2规范 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒绝原因 e
            reject(e) // 捕获前面onFulfilled中抛出的异常
          }
        })
      }

      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              // 2.2.7.4规范 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的拒绝原因
              reject(this.reason)
            } else {
              let x = onRejected(this.reason)
              resolvePromise(x, promise2, resolve, reject)
            }
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.status === STATUS.PENDING) {
        // pending 状态保存的 onFulfilled() 和 onRejected() 回调也要符合 2.2.7.1，2.2.7.2，2.2.7.3 和 2.2.7.4 规范
        this.onResolveCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onFulfilled !== 'function') {
                resolve(this.value)
              } else {
                let x = onFulfilled(this.value)
                resolvePromise(x, promise2, resolve, reject)
              }
            } catch (e) {
              reject(e)
            }
          })
        })

        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== 'function') {
                reject(this.reason)
              } else {
                let x = onRejected(this.reason)
                resolvePromise(x, promise2, resolve, reject)
              }
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })

    return promise2
  }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(x, promise2, resolve, reject) {
  // 2.3.1规范 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  if (x === promise2) {
    // 如果promise2 === x，会导致循环引用，自己等自己执行完成
    throw new TypeError('出错了')
  }

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 2.3.3 如果 x 为对象或函数
    try {
      // 2.3.3.1 把 x.then 赋值给 then
      var then = x.then
    } catch (e) {
      // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(e)
    }

    /**
     * 2.3.3.3
     * 如果 then 是函数，将 x 作为函数的作用域 this 调用。
     * 传递两个回调函数作为参数，
     * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
     */
    if (typeof then === 'function') {
      // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
      let called = false // 避免多次调用
      try {
        // 防止取多次
        then.call(
          x,
          // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            if (called) return
            called = true
            // 递归解析成功后的值，知道他是一个普通值为止
            resolvePromise(y, promise2, resolve, reject)
          },
          // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
            if (called) return
            called = true
            reject(r)
          },
        )
      } catch (e) {
        /**
         * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
         * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
         */
        if (called) return
        called = true

        // 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
        reject(e)
      }
    } else {
      // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x)
    }
  } else {
    // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
    return resolve(x)
  }
}
```

### `promise.then` 方法中的 `onFulfilled` 和 `onRejected` 是可选参数，没有传就忽略他

> 举个 🌰

```js
// 这种情况是如何实现的
let p = new Promise((resolve, reject) => {
  resolve('ok')
})
  .then()
  .then()
  .then()
  .then((data) => {
    console.log(data) // ok
  })
```

> resolvePromise 的实现

```js
const STATUS = { PENDING: 'PENDING', FULFILLED: 'FULFILLED', REJECTED: 'REJECTED' }

function resolvePromise(x, promise2, resolve, reject) {
  if (x === promise2) {
    reject(new TypeError('出错了'))
  }

  // 如果x是对象
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called
    try {
      let then = x.then
      // then是个函数，x就是promise
      if (typeof then === 'function') {
        // 根据x的状态判断promise2状态
        then.call(
          x,
          function (y) {
            if (called) return
            called = true
            resolvePromise(y, promise2, resolve, reject)
          },
          function (r) {
            if (called) return
            called = true
            reject(r)
          },
        )
      } else {
        // then不是函数，就是个普通对象
        resolve(x)
      }
    } catch (e) {
      // 取then方法是出错
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // x是普通值
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    this.status = 'PENDING'
    this.value = undefined
    this.reason = undefined
    this.onResolveCallbacks = []
    this.onRejectCallbacks = []
    const resolve = (val) => {
      this.status = STATUS.FULFILLED
      this.value = val
      this.onResolveCallbacks.forEach((fn) => fn())
    }
    const reject = (reason) => {
      this.status = STATUS.REJECTED
      this.reason = reason
      this.onRejectCallbacks.forEach((fn) => fn())
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    // 看onFulfilled是不是函数，是：就是传参了就直接用onFulfilled，不是：就给他补充上去成功的回调
    typeof onFulfilled === 'function' ? onFulfilled : (data) => data
    typeof onRejected === 'function'
      ? onRejected
      : (err) => {
          throw err
        }
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(x, promise2, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.value)
            resolvePromise(x, promise2, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === STATUS.PENDING) {
        setTimeout(() => {
          this.onResolveCallbacks.push(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        }, 0)

        setTimeout(() => {
          this.onRejectCallbacks.push(() => {
            try {
              let x = onRejected(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        }, 0)
      }
    })

    return promise2
  }
}

// promise测试时调用此方法
Promise.deferred = function () {
  let result = {}
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

module.exports = Promise
```

## `Promise.resolve`

`Promise.resolve()`是一个静态方法：（类直接调用）

- 可以理解为，一个帮我们创建成功的 `Promise`。
- `Promise.resolve()`，可以等待一个 `promise` 执行完成。

## `Promise.reject`

`Promise.reject()`是一个静态方法：直接报错。

```js
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok')
  }, 1000)
})
Promise.resolve(p).then((data) => {
  console.log(data) // 1秒后打印ok
})
Promise.reject(p).catch((data) => {
  console.log(data)
})
```

```js
const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
}
function resolvePromise(x, promise2, resolve, reject) {
  if (x === promsie2) {
    return new TypeError('出错了')
  }
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          function (y) {
            if (called) return
            called = true
            resolvePromise(y, promise2, resolve, reject)
          },
          function (r) {
            if (called) return
            called = true
            reject(r)
          },
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}
class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolveCallbacks = []
    this.onRejectCallbacks = []
    const resolve = (val) => {
      if (val instanceof Promise) {
        // 是promise 就继续递归解析
        val.then(resolve, reject)
      }
      if (this.status === STATUS.PENDING) {
        this.value = val
        this.status = STATUS.FULFILLED
        this.onResolveCallbacks.forEach((fn) => fn())
      }
    }
    const reject = (reason) => {
      this.reason = reason
      this.status = STATUS.REJECTED
      this.onRejectCallbacks.forEach((fn) => fn())
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    let promise2 = new Promsie((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(x, promise2, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.value)
            resolvePromise(x, promise2, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === STATUS.PENDING) {
        setTimeout(() => {
          this.onResolveCallbacks.push(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        }, 0)
        setTimeout(() => {
          this.onRejectCallbacks.push(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        }, 0)
      }
    })
    return promise2
  }
  catch(err) {
    // catch就是then的简写，只有失败没有成功
    return this.then(null, err)
  }
  static resolve(value) {
    return new Promsie((resolve, reject) => {
      resolve(value)
    })
  }
  static reject(reason) {
    return new Promsie((resolve, reject) => {
      reject(reason)
    })
  }
}
```

::: info 相关资料

- [<u>Promise 文档规范</u>](https://promisesaplus.com)

:::
