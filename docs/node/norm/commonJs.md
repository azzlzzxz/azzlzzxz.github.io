# CommonJS 规范

## 1.概述

`Node` 应用由模块组成，采用 `CommonJS` 模块规范

每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

```js
// example.js
var x = 5
var addX = function (value) {
  return value + x
}
```

上面代码中，变量 `x` 和函数 `addX`，是当前文件 `example.js` 私有的，其他文件不可见。

如果想在多个文件分享变量，必须定义为 `global` 对象的属性。

```js
global.warning = true
```

上面代码的 `warning` 变量，可以被所有文件读取。==当然，这样写法是不推荐的==。

`CommonJS` 规范规定，==每个模块内部，`module` 变量代表当前模块==。这个变量是一个对象，它的 `exports` 属性（即 `module.exports`）是对外的接口。==加载某个模块，其实是加载该模块的 `module.exports` 属性。==

```js
var x = 5
var addX = function (value) {
  return value + x
}
module.exports.x = x
module.exports.addX = addX
```

上面代码通过 `module.exports` 输出变量 `x` 和函数 `addX`。

```js
var example = require('./example.js')

console.log(example.x) // 5
console.log(example.addX(1)) // 6
```

`CommonJS` 模块的特点如下：

1. 所有代码都运行在模块作用域，不会污染全局作用域。
2. 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。想要让模块再次运行，就必须清除缓存。
3. 模块的加载顺序，按照其在代码中出现的顺序。

## 2.`module` 对象

`Node` 内部提供一个 `Module` 构建函数。==所有模块都是 `Module` 实例。==

```js
function Module(id, parent) {
  this.id = id
  this.exports = {}
  this.parent = parent
  // ...
}
```

每个模块内部，都有一个 `module` 对象，代表当前模块。它有以下属性：

1. `module.id` 模块的识别符，通常是带有绝对路径的模块文件名。
2. `module.filename` 模块的文件明，带有绝对路径。
3. `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
4. `module.children` 返回一个数组，表示该模块要用到的其他模块。
5. `module.exports` 表示模块对外输出值。

```js
释例：
// example.js
var jquery = require('jquery');
exports.$ = jquery;
console.log(module);

{ id: '.',
  exports: { '$': [Function] },
  parent: null,
  filename: '/path/to/example.js',
  loaded: false,
  children:
   [ { id: '/path/to/node_modules/jquery/dist/jquery.js',
       exports: [Function],
       parent: [Circular],
       filename: '/path/to/node_modules/jquery/dist/jquery.js',
       loaded: true,
       children: [],
       paths: [Object] } ],
  paths:
   [ '/home/user/deleted/node_modules',
     '/home/user/node_modules',
     '/home/node_modules',
     '/node_modules' ]
}
```

如果在命令行下调用某个模块，比如 `node something.js` ，那么 `module.parent` 是 `null` 如果是在脚本中调用，比如 `require('something.js')`，那么那么 `module.parent` 就是调用它的模块。利用这一点，可以判断当前模块是否为入口脚本。

### 2.1 `module.exports` 属性

`module.exports` 属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取 `module.exports` 变量。

```js
var EventEmitter = require('events').EventEmitter
module.exports = new EventEmitter()

setTimeout(function () {
  module.exports.emit('ready')
}, 1000)

// 上面模块会在加载后1秒后，发出ready事件。其他文件监听该事件，可以写成下面这样。

var a = require('./a')
a.on('ready', function () {
  console.log('module a is ready')
})
```

### 2.1 `exports` 变量

为了方便，`Node` 为每个模块提供一个 `exports` 变量，指向 `module.exports`。这等同于每个模块头部，有一行这样的命令。

```js
var exports = module.exports
```

造成的结果是，在对外输出模块接口是，可以向 `exports` 对象添加方法。

```js
exports.area = function (r) {
  return Math.PI * r * r
}
```

:::tip
注意：不能直接将 `exports` 变量指向一个值，因为这样就等于切断了 `exports` 与 `module.exports` 的联系。
:::

```js
exports = function (x) {
  console.log(x)
}
```

==上面这样的写法是无效的，因为 `exports` 不再指向 `module.exports` 了。==

```js
exports.hello = function () {
  return 'hello'
}

module.exports = 'Hello world'
```

上面代码，`hello` 函数是无法对外输出的，因为 `module.esports` 被重制了。
这意味着，如果一个模块的对外接口，就是一个单一的值，就不能用 `exports` 输出，只能使用 `module.exports` 输出

```js
module.exports = function (x) {
  console.log(x)
}
```

如果觉得，`exports` 与 `module.exports` 之间的区别很难分清，一个简单的处理方法，就是放弃使用 exports，只使用 `module.exports`。

## 3.`AMD` 规范与 `CommonJS` 规范的兼容性

==`CommonJS` 规范加载模块是同步的==，也就是说，只有加载完成，才能执行后面的操作。

==`AMD` 规范则是异步加载模块，允许指定回调函数。==

由于 `Node.js` 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载比较快，不用考虑非同步加载方式，所以 `CommonJS` 规范比较适用。

但是，如果是浏览器环境，要从服务器加载模块，这是就必须是异步模式，因此浏览器端一般采用 `AMD` 规范。

`AMD` 规范使用 `define` 方法定义模块：

```js
define(['package/lib'], function (lib) {
  function foo() {
    lib.log('hello sxx')
  }
  return {
    foo: foo,
  }
})
```

`AMD` 规范允许输出的模块兼容 `CommonJs` 规范，这时 `define` 方法需要写成这样：

```js
define(function (require, exports, module) {
  var someModule = require('someModule')
  var anotherModule = require('anotherModule')
  someModule.doTehAwesome()
  anotherModule.doMoarAwesome()

  exports.asplode = function () {
    someModule.doTehAwesome()
    anotherModule.doMoarAwesome()
  }
})
```

## 4.`require` 命令

### 4.1 基本用法

`Node` 使用 `CommonJS` 模块规范，内置的 `require` 命令用于加载模块文件。

`require` 命令的基本功能是，读入并执行一个 `JS` 文件，然后返回该模块的 `exports` 对象。如果没有发现指定模块，会报错。

```js
// example.js
var invisible = function () {
  console.log('invisible')
}

exports.message = 'hi'

exports.say = function () {
  console.log(message)
}

// 运行下面的命令，可以输出exports对象。

var example = require('./example.js')
example
// {
//   message: "hi",
//   say: [Function]
// }
```

如果模块输出的是一个函数，那就不能定义在 `exports` 对象上，而要定义在 `module.exports` 变量上面。

```js
module.exports = function () {
  console.log('hello world')
}

require('./example2.js')()
// 上面代码中，require命令调用自身，等于是执行module.exports，因此会输出 hello world。
```

### 4.2 加载规则

`require` 命令用于加载文件，后缀名默认为 `.js`

```js
var foo = require('foo')
//  等同于
var foo = require('foo.js')
```

根据参数的不同格式，`require` 命令去不同路径寻找模块文件。

（1）如果参数字符串以`/`开头，则表示加载的是一个位于绝对路径的模块文件。比如，`require('/home/marco/foo.js')`将加载`/home/marco/foo.js`。

（2）如果参数字符串以`./`开头，则表示加载的是一个位于相对路径（跟当前执行脚本的位置相比）的模块文件。比如，`require('./circle')`将加载当前脚本同一目录的 `circle.js`。

（3）如果参数字符串不以`./`或`/`开头，则表示加载的是一个默认提供的核心模块（位于 `Node` 的系统安装目录中），或者一个位于各级 `node_modules` 目录的已安装模块（全局安装或局部安装）。

举例来说，脚本`/home/user/projects/foo.js` 执行了 `require('bar.js')`命令，`Node` 会依次搜索以下文件。

> `/usr/local/lib/node/bar.js`
>
> `/home/user/projects/node_modules/bar.js`
>
> `/home/user/node_modules/bar.js`
>
> `/home/node_modules/bar.js`
>
> `/node_modules/bar.js`

这样设计的目的是，使得不同的模块可以将所依赖的模块本地化。

（4）如果参数字符串不以`./`或`/`开头，而且是一个路径，比如 `require('example-module/path/to/file')`，则将先找到 `example-module` 的位置，然后再以它为参数，找到后续路径。

（5）如果指定的模块文件没有发现，`Node`会尝试为文件名添加`.js`、`.json`、`.node` 后，再去搜索。`.js`件会以文本格式的 `JavaScript` 脚本文件解析，`.json` 文件会以 `JSON` 格式的文本文件解析，`.node` 文件会以编译后的二进制文件解析。

（6）如果想得到 `require` 命令加载的确切文件名，使用 `require.resolve()`方法

### 4.3 目录的加载规则

通常，我们会把相关的文件会放在一个目录里面，便于组织。这时，最好为该目录设置一个入口文件，让 `require` 方法可以通过这个入口文件，加载整个目录。

在目录中放置一个 `package.json` 文件，并且将入口文件写入 `main` 字段。

> 举个 🌰

```json
{ "name": "some-library", "main": "./lib/some-library.js" }
```

`require` 发现参数字符串指向一个目录以后，会自动查看该目录的 `package.json` 文件，然后加载 `main` 字段指定的入口文件。

如果 `package.json` 文件没有 `main` 字段，或者根本就没有 `package.json` 文件，则会加载该目录下的 `index.js` 文件或 `index.node` 文件。

### 4.4 模块缓存

第一次加载某个模块时，`Node` 会缓存该模块，以后再加载该模块，就直接从缓存取出该模块的`module.exports` 属性。

```js
require('./example.js')
require('./example.js').message = 'hello'
require('./example.js').message
// "hello"
```

👆 代码中，连续三次使用 `require` 命令，加载同一个模块。第二次加载的时候，为输出的对象添加了一个 `message` 属性。

但是第三次加载的时候，这个 `message` 属性依然存在，这就证明 `require` 命令并没有重新加载模块文件，而是输出了缓存。

如果想要多次执行某个模块，可以让该模块输出一个函数，然后每次 `require` 这个模块的时候，重新执行一下输出的函数。

所有缓存的模块保存在 `require.cache` 之中，如果想删除模块的缓存，可以像这样写。

```js
// 删除指定模块的缓存
delete require.cache[moduleName]

// 删除所有模块的缓存
Object.keys(require.cache).forEach(function (key) {
  delete require.cache[key]
})
```

::: tip 注意

缓存是根据绝对路径识别模块的，如果同样的模块名，但是保存在不同的路径，`require` 命令还是会重新加载该模块

:::

### 4.5 模块的循环加载

如果发生模块的循环加载，即 `A` 加载 `B`，`B` 又加载 `A`，则 `B` 将加载 `A` 的不完整版本

```js
// a.js
exports.x = 'a1'
console.log('a.js ', require('./b.js').x)
exports.x = 'a2'

// b.js
exports.x = 'b1'
console.log('b.js ', require('./a.js').x)
exports.x = 'b2'

// main.js
console.log('main.js ', require('./a.js').x)
console.log('main.js ', require('./b.js').x)
// 上面代码是三个JavaScript文件。其中，a.js加载了b.js，而b.js又加载a.js。这时，Node返回a.js的不完整版本，所以执行结果如下。
```

> 输出

```bash
$ node main.js
b.js  a1
a.js  b2
main.js  a2
main.js  b2
```

修改 `main.js`，再次加载 `a.js` 和 `b.js`

```js
// main.js
console.log('main.js ', require('./a.js').x)
console.log('main.js ', require('./b.js').x)
console.log('main.js ', require('./a.js').x)
console.log('main.js ', require('./b.js').x)
// 执行上面代码，结果如下。
```

> 输出

```bash
$ node main.js
b.js  a1
a.js  b2
main.js  a2
main.js  b2
main.js  a2
main.js  b2
```

上面代码中，第二次加载 `a.js` 和 `b.js` 时，会直接从缓存读取 `exports` 属性，所以 `a.js` 和 `b.js` 内部的 `console.log` 语句都不会执行了。

### 4.6 `require.main`

`require` 方法有一个 `main` 属性，可以用来判断模块是直接执行，还是被调用执行。

直接执行的时候`（node module.js）`，`require.main` 属性指向模块本身

```js
require.main === module
// true
```

调用执行的时候（通过 `require` 加载该脚本执行），上面的表达式返回 `false`。

### 总结

- **同步加载**：`require` 是同步执行的，模块在加载完成后返回结果。如果模块较大，可能会阻塞事件循环。

- **运行时加载**：在 `Node.js` 中，模块是在运行时加载的。这意味着当程序运行时，`require` 函数会从磁盘上读取模块文件，并执行该文件。

- **缓存机制**：一旦模块被加载后，它会被缓存。如果你多次 `require` 同一个模块，`Node.js` 不会重新加载它，而是直接从缓存中获取。

- **支持动态路径**：`require` 支持动态路径，如通过变量拼接路径来加载模块。

## 5.模块的加载机制

`CommonJS` 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

请看下面这个例子。

```js
// lib.js
var counter = 3
function incCounter() {
  counter++
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
}
```

上面代码输出内部变量 `counter` 和改写这个变量的内部方法 `incCounter`，然后，加载上面的模块

```js
// main.js
var counter = require('./lib').counter
var incCounter = require('./lib').incCounter

console.log(counter) // 3
incCounter()
console.log(counter) // 3
```

`上面代码说明，counter` 输出以后，`lib.js` 模块内部的变化就影响不到 `counter` 了。

### 5.1 `require` 的内部处理流程

`require` 命令是 `CommonJS` 规范之中，用来加载其他模块的命令。它其实不是一个全局命令，而是指向当前模块的 `module.require` 命令，而后者又调用 `Node` 内部命令 `Module._load`。

```js
Module._load = function (request, parent, isMain) {
  // 1. 检查 Module._cache，是否缓存之中有指定模块
  // 2. 如果缓存之中没有，就创建一个新的Module实例
  // 3. 将它保存到缓存
  // 4. 使用 module.load() 加载指定的模块文件，
  //    读取文件内容之后，使用 module.compile() 执行文件代码
  // 5. 如果加载/解析过程报错，就从缓存删除该模块
  // 6. 返回该模块的 module.exports
}
```

上面的第 `4` 步，采用 `module.compile()`执行指定模块的脚本，逻辑如下。

```js
Module.prototype._compile = function (content, filename) {
  // 1. 生成一个require函数，指向module.require
  // 2. 加载其他辅助方法到require
  // 3. 将文件内容放到一个函数之中，该函数可调用 require
  // 4. 执行该函数
}
```

上面的第 `1` 步和第 `2` 步，`require`函数及其辅助方法主要如下。

1. `require():`加载外部模块
2. `require.resolve()：`将模块名解析到一个绝对路径
3. `require.main：`指向主模块
4. `require.cache：`指向所有缓存的模块
5. `require.extensions：`根据文件的后缀名，调用不同的执行函数

一旦 `require` 函数准备完毕，整个所要加载的脚本内容，就被放到一个新的函数之中，这样可以避免污染全局环境。

该函数的参数包括 `require`、`module、exports`，以及其他一些参数。

```js
;(function (exports, require, module, __filename, __dirname) {
  // YOUR CODE INJECTED HERE!
})
```

`Module._compile` 方法是同步执行的，所以 `Module._load` 要等它执行完成，才会向用户返回 `module.exports` 的值。
