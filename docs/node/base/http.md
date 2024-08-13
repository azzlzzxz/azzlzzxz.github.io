# Http

## `http` 模块的基本用法

```js
const http = require('http')
const url = require('url') // 解析请求路径

let server = http.createServer((req, res) => {
  // 创建服务
  // 请求部分
  console.log(req.method) // 客户端请求方法，默认都是大写
  console.log(req.url) // 打印出来的是 /后面 #前面的路径
  // 如果希望获取？后面的参数 并转成 ---> query:{a: 1, b: 2} 这种格式，就要用url.parse
  let { pathname, query } = url.parse(req.url, true) //ture表示把查询参数变成一个对象结果
  console.log(pathname, query)
  console.log(req.headers) // 所有的请求头信息 所有的key都是小写

  // 客户端数据获取
  // req是一个可读流
  let arr = [] // 前端传递的数据可能是二进制所以要用buffer合并是最合理的
  req.on('data', function (chunk) {
    arr.push(chunk)
  })
  // 如果流中的数据为空，内部会调用push(null)，只要调用了push，就一定会触发end事件
  req.on('end', function () {
    // 如果没有数据也会触发end方法
    console.log('end', Buffer.concat(arr).toString())
  })

  // 响应部分
  // 响应行、响应头、响应体 按顺序设置，顺序不能变化
  // res 是一个可写流，就有 write、end方法
  res.statusCode = 200 // 设置状态码
  res.statusMessage = 'no status' // 自定义状态短语
  res.setHeader('a', 1) // 设置响应头
  // 分段响应 Transfer-Encoding:chunkeds（传输的数据是代码块）(分段写有这个属性)
  res.write()
  res.end('ok') // 标识响应结束
})

let port = 4000 // 端口尽量使用3000以上
server.listen(port, function () {
  console.log(`server start ${port}`)
})

// 端口被占用，自动累加重启
server.on('error', function (err) {
  if (err.errno === 'EADDRINUSE') {
    server.listerm(++port)
  }
})
// curl -v 显示详细信息
// curl -X 指定方法
// curl -d 指定数据
// curl -h 指定头
```

![http](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/http.png)

![http_console](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/http_console.png)

服务端代码改变后必须要重新执行：可以使用 `nodemon（监控文件变化，重启服务）`

```sh
# 安装
npm install nodemon -g

# 使用
nodemon + 文件名运行
```

## 实现一个静态服务

1. 服务器返回静态文件。
2. 服务器返回数据。

```js
const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs').promises
const { createReadStream } = require('fs')
const mime = require('mime')

// 写node代码 慢慢的就会放弃回调的方式 =》 aysnc + await + promise

class StaticServer {
  async handleRequest(req, res) {
    const { pathname } = url.parse(req.url, true) // （静态文件）根据路径返回对应的资源
    let filePath = path.join(__dirname, pathname) // /note.md

    // 浏览器根据心情发送的图标favicon.ico（有可能找不到）
    // 需要看你访问的是不是文件夹
    try {
      let statObj = await fs.stat(filePath) //用异步，不能用同步：同时访问多个路径时，单线程，会阻塞
      if (statObj.isFile()) {
        // mime 可以根据文件后缀来识别 是什么类型的
        res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8')
        createReadStream(filePath).pipe(res) // res 是一个可写流 可读流.pipe(可写流) pipe会调end的

        // 这种方式是都读到内存中，再去返回，不好浪费内存
        // let data = await fs.readFile(filePath);
        // res.end(data);
      } else {
        // 文件夹
        filePath = path.join(filePath, 'index.html')
        await fs.access(filePath) // 异步方法 不存在会报错（判断文件是否能访问）
        res.setHeader('Content-Type', 'text/html;charset=utf-8')
        createReadStream(filePath).pipe(res)
      }
    } catch (e) {
      // 处理异常
      this.sendError(e, req, res)
    }
  }
  sendError(e, req, res) {
    console.log(e)
    res.statusCode = 404
    res.end('Not Found')
  }
  start(...args) {
    // http.createServer回调里的this指的是server，所以要bind，让this指向StaticServer的实例
    const server = http.createServer(this.handleRequest.bind(this))
    // 解决this 指向可以采用箭头函数 / 使用bind来实现
    server.listen(...args)
  }
}

new StaticServer().start(3000, function () {
  console.log(`server start 3000`)
})
```

## 实现一个 `http-server` 工具

要实现 `http-server` 命令行工具，就需要把它写成一个 `npm` 包，发布上去。

![server_fs](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/server_fs.png)

```sh
# 生成package.json
npm init -y
```

```json
// package.json
{
  "name": "zs-server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    // 配置指令
    "zs": "./bin/www.js",
    "zs-server": "./bin/www.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^4.1.0",
    "commander": "^6.1.0",
    "ejs": "^3.1.5",
    "mime": "^2.4.6"
  }
}
```

执行 `npm link` 把 `bin` 里的指令做成全局的链接，方便测试。

![npm_link](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/npm_link.png)

```js
// util.js
function forEachObj(obj, cb) {
  Object.entries(obj).forEach(([key, value]) => {
    cb(value, key)
  })
}

exports.forEachObj = forEachObj
```

```js
// bin/www.js
// node环境执行脚本
#! /usr/bin/env node

const program = require('commander');
const config = require('./serverConfig');
const { forEachObj } = require('../util.js')

program.name('fh')

// 设置options
forEachObj(config, val => {
    program.option(val.option, val.descriptor)
});

// 发布订阅 用户调用--help时会触发此函数
program.on('--help', function() {
    console.log('\r\nExamples:');
    forEachObj(config, val => {
        console.log('  ' + val.usage)
    });
})

// --port 3000  --directory d:  --cache
program.parse(process.argv); // 格式化用户输入

// 根据用户输入生成配置，用户输入了就用用户输入，没有输入就用默认值
const finalConfig = {}
forEachObj(config, (value, key) => {
    finalConfig[key] = program[key] || value.default
});

// 1.解析用户参数
// 2.开启服务
const Server = require('../src/index');
let server = new Server(finalConfig); // 传入开启服务的必备参数
server.start(); // 开启服务
```

![server_port](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/server_port.png)

![server_help](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/server_help.png)

```js
// bin/serverConfig.js
// 配置文件(管理识别用户输入的指令)
module.exports = {
  port: {
    // 格式是自己定义的，方便去迭代
    option: '-p,--port <v>', // program.option('-p,--port<val>','xxx')
    descriptor: 'set you server port',
    usage: 'zs --port 3000',
    default: 8080,
  },
  directory: {
    option: '-d,--directory <v>', // program.option('-p,--port<val>','xxx')
    descriptor: 'set you server start directory',
    usage: 'zs --direactory D:',
    default: process.cwd(),
  },
}
```

```js
// src/index.js
const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const { createReadStream, readFileSync } = require('fs');
const url = require('url');
const crypto = require('crypto')
// 模板引擎  ejs
const ejs = require('ejs'); // 模板引擎 nunjucks handlebar underscore 。。。。。
const mime = require('mime');
const chalk = require('chalk'); // 粉笔话颜色的（命令行显示不同的颜色）

class Server {
    constructor (options) {
        this.port = options.port
        this.directory = options.directory
        // 启服务的时候就拿到模版，同步读更快一些
        this.template = readFileSync(path.resolve(__dirname, 'render.html'), 'utf8')
    }
    handleRequest (req, res) {
        let { pathname } = url.parse(req.url, true) // 获取路径
        pathname = decodeURIComponent(pathname) // 路径可能是中文，需要解析它，防止读文件读不到
        let filePath = path.join(this.directory, pathname);
        try {
            let statObj = await fs.stat(filePath)
            if (statObj.isFile()) {
                this.sendFile(req, res, statObj, filePath)
            } else {
                // 需要列出文件夹中内容
                let dirs = await fs.readdir(filePath); // fs-extra
                // 文件访问的路径 采用绝对路径 尽量不要采用./ ../路径
                dirs = dirs.map(item => ({ // 当前根据文件名产生目录和href
                    dir: item,
                    href: path.join(pathname, item)
                }))
                // ejs渲染语法 ejs.render(模版, 渲染的数据, { async: true }) async是把它变成promise
                let result = await ejs.render(this.template, { dirs }, { async: true });
                res.setHeader('Content-Type', 'text/html;charset=utf-8')
                res.end(result);
            }
        } catch (e) {
            this.sendError(req, res, e);
        }
    }
    sendError(req, res, e) {
        res.statusCode = 404;
        res.end(`Not Found`);
    }
    cache(req, res, statObj, filePath) {
        // 设置缓存， 默认强制缓存10s  10s内部不在像服务器发起请求 （首页不会被强制缓存） 引用的资源可以被强制缓存

        //老版本 http1.0
        res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString()); // header里不能放对象类型，需要转成字符串

        //新版本 http1.1

        // no-cache 表示每次都像服务器发请求（浏览器缓存了）
        // no-store 表示浏览器不进行缓存
        // res.setHeader('Cache-Control', 'max-age=10'); // 强制缓存 每10s后访问一次缓存

        res.setHeader('Cache-Control', 'no-cache'); // http1.1新浏览器都识别cache-control
        // 过了10s “文件变还是没变” 如果没变可以不用返回文件 告诉浏览器找缓存 缓存里就是最新的，变了就重新返回
        // 协商缓存 商量一下 是否需要给最新的如果不需要返回内容 直接给304状态码 表示找缓存即可

        // 默认先走强制缓存，10s 内不会发送请求到服务器中采用浏览器缓存，但是10s后在次发送请求。后端要进行对比
        // 1) 文件没有变化 直接返回304 即可，浏览器会去缓存中查找文件。之后的10s中还是会走缓存
        // 2)文件变化了返回最新的，之后的10s中还是会走缓存 不停的循环


        // 看文件是否变化

        // 1. 根据修改时间来判断文件是否修改了  **304**服务端设置
        let ifModifiedSince = req.headers['if-modified-since'] // if-modified-since 客户端带过来的
        let ctime = statObj.ctime.toGMTString(); // changetime 文件修改时间

        // 2.根据文件摘要来判断文件是否被修改
        let ifNoneMatch = req.headers['if-none-match'] // if-none-match 客户端带过来的
        let etag = crypto.createHash('md5').update( readFileSync(filePath)).digest('base64')

        // 服务器设置好的
        res.setHeader('Last-Modified',ctime); // 缺陷：1、如果文件没变 修改时间改了呢 2、1s内多次改了文件
        res.setHeader('Etag',etag)

        if(ifModifiedSince != ctime){ // 如果前端传递过来的最后修改时间和我的 ctime时间一样 ，文件没有被更改过
            return false
        }
        if(ifNoneMatch !== etag){ // 可以用开头 加上总字节大小生产etag
            return false;
        }
        // 采用指纹Etag  - 根据文件产生一个唯一的标识 是md5戳（根据文件产生一个摘要值）

        return true;
    }
    sendFile(req, res, statObj, filePath) {
        if (this.cache(req, res, statObj, filePath)) {
            res.statusCode = 304; // 协商缓存是包含首次访问的资源的
            return res.end();
        }
        // 发送文件 通过流的方式
        res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8');
        createReadStream(filePath).pipe(res);
    }
    start () {
        let server = http.createServer(this.handleRequest.bind(this))
        server.listen(this.port, () => {
            // ${path.relative(process.cwd(),this.directory) 取相对路径以process.cwd为基准
            console.log(`${chalk.yellow('Starting up zf-server:')} ./${path.relative(process.cwd(),this.directory) }`);// 要以当前目录去启服务
            console.log(`http://localhost:${chalk.green(this.port)}`)
        })
    }
}
module.exports = Server
```
