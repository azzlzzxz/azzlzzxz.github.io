# 基础 API

## `Global`

1. node 中的全局变量是 `global`。

2. 浏览器中的 `this` 是指代的是 `window（`浏览器中是没有 `global` 的可以理解为 `window` 代理了 `global`），服务端中的 `this` 指代的都是 `global`。
3. 当我们在文件中访问 `this` 时，内部被更改了，所以返回的不是 `global`，而是 `module.exports`。
4. `setInterval`、`clearInterval`、`setTimeout`、`clearTimeout`、`setImmediate`、`clearImmediate`、`queueMicrotask`、`process`、`buffer` 这些是全局变量（就是直接在文件中不需要声明就能直接访问的），他们都是挂在 `global` 上的，`global.xxx`。
5. `reqiure`、`module`、`exports`、`__dirname`、`__filename` 也叫全局变量，但实际上不是他们只存在于模块的作用域中，他们不在 `global` 上。

```js
console.log(this) // {} 所以返回的是空对象
```

```js
function a() {
    console.log(this) // this指向调用a函数的
}
a()
Object [global] {
  global: [Circular *1],
  clearInterval: [Function: clearInterval],
  clearTimeout: [Function: clearTimeout],
  setInterval: [Function: setInterval],
  setTimeout: [Function: setTimeout] {
    [Symbol(nodejs.util.promisify.custom)]: [Function (anonymous)]
  },
  queueMicrotask: [Function: queueMicrotask],
  clearImmediate: [Function: clearImmediate],
  setImmediate: [Function: setImmediate] {
    [Symbol(nodejs.util.promisify.custom)]: [Function (anonymous)]
  }
}
```

## `process` 进程对象

- `process` 中常用的变量有：`platform`、`cwd`、`env`、`argv`、`nextTick`。

- `process.platform` 用途：根据不同平台操作系统文件的。

```lua
console.log(process.platform)
win32  windows系统
drawin linux系统
```

- `process.cwd()`用途：可以获取当前执行 `node` 命令的目录，可以找到当前目录下的某个文件。

`process.cwd()`获取的路径是可以改变的，`__dirname` 是不变的。

```lua
console.log(process.cwd())
/Users/xinxu/Desktop/node-master
```

- `process.env` 用途：根据不同的环境变量做配置（`webpack` 环境配置）

`cross-env` 这是一个第三方模块，用于区分环境。

如果 `windows` 系统可以用 `set xxx=xxx`，`mac` 用 `export xxx=xxx`

```js
if (process.env.NODE_ENV === 'production') {
  console.log('生产环境')
} else {
  console.log('开发环境')
}
console.log(process.env.A) // 123 // 当前系统环境变量
```

![process_env](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/process_env.png)

- `process.argv` 用途：运行代码时传入参数，可以获取到当前用户传的所有参数 `--port(简写：-p)`，`--config`

```js
console.log(process.argv)
// 第一个指代的是node的执行文件，node.exe
// 第二个指代的是当前执行文件
```

![process_argv](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/process_argv.png)

```js
// 那如何取出用户传入的参数呢
process.argv.slice(2).reduce((memo, current, index, arr) => {
  //[--port, 3000, --config, a.js] 对数组进行收敛
  if (current.startWith('--')) {
    memo[current.slice(2)] = arr[index + 1]
  }
  return memo
}, {})
// => {port:3000,config:a.js}
```

[commnder](https://www.npmjs.com/package/commander)这个 `npm` 包可以解决，解析用户传参，就不需要手写数组收敛。

```js
const program = require('commander')
program.parse(process.argv)
```

![commnder](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/commnder.png)

```js
const program = require('commander') // 解析用户传递的参数
program.name('zf')
program.usage('[options]')
program.option('-p, --port <v>', 'set server port') // <v>表示-p --port 后面有参数
program.parse(process.argv)
```

![zf](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/zf.png)

```js
const program = require('commander')
program.name('zf')
program.usage('[options]')
program.option('-p, --port <v>', 'set server port') // <v>表示-p --port 后面有参数
program.parse(process.argv)
console.log(program.port) // 3000
```

![process_port](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/process_port.png)

### `commander` 识别一些命令

```js
const program = reuqire('commander')
program.name('zf')
program.usage('[options]')
program.command('rm').action(() => {
  console.log('删除')
})
program.prase(process.argv)
```

![commander_rm](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/commander_rm.png)

## `child_process`

`child_process` 是一个模块，可以创建子进程，可以执行命令。

### `child_process.exec`

`exec` 是一种简便的方法，用来运行命令并获取完整的标准输出和标准错误的结果。它适合执行一些简单的命令

```js
const { exec } = require('child_process')

// 执行 npm install 命令
exec('npm install', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`标准错误: ${stderr}`)
    return
  }
  console.log(`标准输出: ${stdout}`)
})
```

在 👆 的代码中，我们通过 `exec` 执行了 `npm install` 命令，并在回调函数中处理输出和可能出现的错误。

### `child_process.spawn`

`spawn` 是一种更底层的方法，适合执行长时间运行的进程或需要实时处理输出的情况。它不会缓存所有的输出，因此适合需要处理大量数据的情况

```js
const { spawn } = require('child_process')

// 执行 npm install 命令
const npmInstall = spawn('npm', ['install'])

// 监听标准输出
npmInstall.stdout.on('data', (data) => {
  console.log(`输出: ${data}`)
})

// 监听标准错误输出
npmInstall.stderr.on('data', (data) => {
  console.error(`错误: ${data}`)
})

// 监听进程结束
npmInstall.on('close', (code) => {
  console.log(`子进程退出，退出码 ${code}`)
})
```

### `child_process.execFile`

`execFile` 是一种更简单的方法，适合执行可执行文件的名称或路径。它与 `exec` 的主要区别在于，`execFile` 会直接调用本地文件，而 `exec` 则是执行一个命令。

```js
const { execFile } = require('child_process')

execFile('npm', ['install'], (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`标准错误: ${stderr}`)
    return
  }
  console.log(`标准输出: ${stdout}`)
})
```

## `path`

```js
const path = require('path') // 处理路径的

// 默认解析的路径是以process.cwd()为基准，但是process.chdir是能够更改的
// __dirname 是文件所在的目录 不能更改
path.resolve(__dirname, 'note.md') // 你给我个相对路径，我还你个绝对路径，有拼接功能

path.join(__dirname, 'note.md') // 只是简单的拼接

// 如果遇到 / 的路径，resolve会认为是根路径，join则是拼接在一起
console.log(path.resolve(__dirname, '/')) // /

console.log(path.join(__dirname, '/')) // /Users/xinxu/Desktop/node-master/6.node/

path.extname('a.min.js') // .js 取后缀名

path.relative('a', 'a/a.js') // a.js 去掉相同的部分

path.dirname(__dirname) // path.dirname = __dirname
```

## `vm`

```js
const vm = require('vm')
let a = 1
const log = `console.log(a)`

eveal(log) // 1
//eveal执行时会查找上下文，所以eveal是不干净的，如果其他文件模块里也有a，那么eval在查找上下文时会出现问题

let fn = new Function(log)
fn() //  a is not defined
// new Function是可以产生一个执行环境，不依赖于外层作用域，必须包一层函数，模版引擎中会使用new Function + with

vm.runInThisContext(log) // a is not defined
// 让字符串直接执行，并在沙箱环境中
```
