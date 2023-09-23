# async&await

- Promise 中有很多问题，内部还是采用回调的方式，如果逻辑过多还是可能会导致回调地狱。
- 我们希望写的代码更像同步一些 --->generator。
- koa 1.0 用的是 generator koa2.0 用的是 async+await。

**generator（生成器）里的关键字：**

1. 代表 generator 函数（返回迭代器函数）（写在 function 与函数名之间）
2. yield 表示产出。
3. iterator.next()函数返回结果对象{value:表示下一个将要返回的值, done: 当没有可返回的数据时返回 true，预示着迭代结束,否则返回 false}

```js
function* gen() {
  // 根据指针向下执行 + switch-case来实现
  yield 1
  yield 2
  yield 3
  return 100
}
// 调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，
// 而是一个指向内部状态的指针对象，也就是遍历器对象（Iterator Object）
let it = gen() // iterator：迭代器
// 下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。
//换言之，Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行
console.log(it.next()) // {value:1,done:false}
console.log(it.next()) // {value:2,done:false}
console.log(it.next()) // {value:3,done:false}
console.log(it.next()) // {value:100,done:true}
```

简单实现下 generator

```js
function $gen(contxt) {
    switch(contxt.prev = context.next){ // 保证每次调完next，把next赋值给prev，走下个case
        case 0: context.next = 1 return 1
        case 1: context.next = 2 return 2
        case 2: context.next = 3 return 3
        case 3: context.stop() return 100
    }
}
let gen = function () {
    const context = {
        prev: 0, // 当前运行的
        next: 0, // 下一次要运行的
        done: false,// 是否完成运行
        stop () {
            this.done = true // 更改完成状态
        }
        return {
            next () {
                return {
                    value:$gen(context),
                    done: context.done
                }
            }
        }
    }
}
let it = gen();
console.log(it.next()) // {value:1,done:false}
console.log(it.next()) // {value:2,done:false}
console.log(it.next()) // {value:3,done:false}
console.log(it.next()) // {value:100,done:true}
```

**co 模块：自动执行 Generator 函数**

```js
const fs = require('fs').promises
function co(it) {
  //异步迭代采用函数的方式
  return new Promise((resolve, reject) => {
    function step(data) {
      let { value, done } = it.next(data)
      if (!done) {
        Promise.resolve(value).then((data) => {
          step(data) // 递归
        }, reject) // 失败了就reject
      } else {
        resolve(value) // 将最终结果抛出去
      }
    }
  })
}
function* read() {
  // switch - case => babel编译后就是把一个函数分成多个case 采用指针的方式向下移动
  let name = yield fs.readFile('name.txt', 'utf8')
  let age = yield fs.readFile(name, 'utf8')
  return age
}
co(read())
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(err)
  })
```

**async + await = generator + co**

```js
const fs = require('fs').promises
async read () {
    let name = await fs.readFile('name.txt', 'utf8')
    let age = await fs.readFile(name, 'utf8')
    return age
}
// async方法执行后返回的是一个promise
read().then(data => {
    console.log(data)
}).catch(err => {
    console.log(err)
})
```

async + await 就是 generator 的语法糖。

**Async / Await 如何通过同步的方式实现异步?**
<br />
Async/Await 就是一个自执行的 generate 函数。利用 generate 函数的特性把异步的代码写成“同步”的形式,第一个请求的返回值作为后面一个请求的参数,其中每一个参数都是一个 promise 对象。
