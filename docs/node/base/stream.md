# Stream 流

## 可读流

文件基于流进行了封装，封装了基于文件的可读流和可写流。

```js
const fs = require('fs')
const path = require('path')
// 内部继承stream模块，并且基于fs.open fs.read fs.write fs.close方法
let rs = fs.createReadStream(path.resolve(__dirname, 'test.txt'), {
  flags: 'r', // 创建可读流的标识是 r ，读取文件
  encoding: null, // 编码默认是null（也就是buffer）
  autoClose: false, // 读取完毕后是否自动关闭文件
  start: 0, // 开始的位置 （包前又包后）字节数
  end: 4,
  highWaterMark: 2, // 一次读多少（如果不写默认是64 * 1024）
})
```

1. 发布订阅中出异常，走 error。
2. 可读流不一定是基于文件，文件流一定是基于文件。
3. rs 是可读流对象必须拥有 on('data')，on('end')（是因为 stream 继承了 eventEmitter），文件流就会添加两个方法：open、close。
4. 控制读取速率：rs.pause、rs.resume

```js
// 错误处理
rs.on('error', function (err) {
  console.log(err)
})
//文件打开后，内部去调 rs.emit('open')
rs.on('open', function (fd) {
  console.log(fd) // 文件描述符
})
let arr = []
// 默认一旦监听了on('data')方法，就会不停的触发
rs.on('data', function (chunk) {
  rs.pause() // 暂停
  arr.push(chunk)
})
setInterval(() => {
  rs.resume() // 恢复
}, 1000)
// 文件的开始到结束都读取完毕
rs.on('end', function () {
  console.log(Buffer.cocat(arr))
})
// 关闭文件
rs.on('close', function () {
  console.log('close')
})
```

1. 内部会 new ReadStream ，继承于 Readable 接口。
2. 内部会进行格式化。
3. 内部会默认打开文件，调用的是 ReadStream.prototype.read。
4. Readable.prototype.read --> ReadStream.prototype.\_read。
5. 如果你想基于 Readable 接口实现自己的可读流，你需要自己去实现一个\_read 方法，默认当我开始读取时会调用此方法。

```js
const { Readable } = require('stream')

class MyRead extends Readable {
  // 默认会调用Readable中的read方法
  _read() {
    this.push('ok') // push方法是Readable中提供的 只要我们调用push将结果放入 就可以触发 on('data事件')
    this.push(null) // 放入null的时候就结束了
  }
}
let mr = new MyRead()

mr.on('data', function (data) {
  console.log(data)
})
mr.on('end', function () {
  console.log('end')
})
mr.on('open', function () {
  console.log('open') // 这是个可读流，所以不会打印open
})

// 文件可读流 可读流 不是一样的  可读流就是继承可读流接口，并不需要用到fs模块
// 基于文件的可读流内部使用的是fs.open fs.close on('data') end
```

### 自己实现一个可读流

```js
const fs = require('fs')
const EventEmitter = require('event')
class ReadStream extends EventEmitter {
    constructor (path, options) {
        super()
        this.path = path
        this.flags = options.flags || 'r'
        this.encoding = options.encoding || null
        if (this.autoClose === 'undefined') {
            this.autoClose = true
        } else {
            this.autoClose = options.autoClose
        }
        this.start = options.start || 0
        this.end = options.end || undefined
        this.highWaterMark = options.highWaterMark || 64 * 1024
        this.open() // 默认触发打开文件
        this.offset = this.start // offset 可以根据每次读的位置发生变化（文件的偏移量）
        this.flowing = false // 默认是非流动模式（只有用户监听了data，flowing才变成true）
        this.on('newListener', function (type) {
            if (type === 'data') {
                this.flowing = true
                this.read() // 读文件
            }
        })
    }
    open () {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) return this.emit('error', err)
            this.fd = fd // 文件描述符
            this.emit('open', fd)
        })
    }
    pause () {
        this.flowing = false
    }
    resume () {
        if (!this.flowing) {
            this.flowing = true
            this.read()
        }
    }
    read () {
        // open是异步的，直接拿fd是取不到的
        // 所以用this.once订阅（只触发一次），当open函数调用 emit时说明fd肯定有了，只时候fd就能拿到了
        if(typeof this.fd !== 'number') {
            this.once('open', () => this.read())
        }
        const buffer = Buffer.alloc(this.highWaterMark)
        // 读多少为什么不能直接用highWaterMark？
        // 因为读到最后时highWaterMark有可能会读多：12345，highWaterMark = 2，第三次读应该读一个，如果用highWaterMark就会多读，所以进行比较谁小用谁
        // this.end - this.offset + 1：0+2+2 = 4，offset = 4,start-end:0-4是5个，所以要+1
        const howMuchToRead = this.end ? Math.min((this.end - this.offset + 1), this.highWaterMark) : this.highWaterMark
        fs.read(this.fd, buffer, 0, howMuchToRead, this.offset, (err, bytesRad) { // bytesRad:真正读取的个数
            if(bytesRead) {
                this.offset += bytesRead // 每次读到后就累加，方便下次继续读取
                // 发布data
                this.emit('data', buffer.slice(0, bytesRead)) // 给rs.on('data')的返回数据
                if (this.flowing) {
                  this.read()
                }
            } else {
                this.emit('end')
                if (this.autoClose) {
                    fs.close(this.fd, () => { // 关闭文件
                        this.emit('close')
                    })
                }
            }
        })
    }
}
module.exports = ReadStream
```

## 可写流

1. ws.write ：只能写入 string / buffer 类型，其内部是调用 fs.write。
2. ws.end： = ws.write 把 ok 写入后 ws.close 关闭文件了，后续可以调 end 方法，但文件已经关闭了就不能再写入了（end 里的参数就不会写入文件了）。
3. 文件可写流，会添加两个方法：ws.on('open') 、ws.on('close')。
4. flag（let flag = ws.write('1')）：
   1. 当前写入的大于等于 highWaterMark falg：false，小于 highWaterMark flag：true。
   2. （如果把所有的写操作放到链表的缓存区里，就会太大了，占用内存）flag 它是根据 highWaterMark 而形成的标尺，当读的时候超过了这个标尺，就会告诉你别读了，就不会浪费缓存空间。
   3. flag 主要是用来控制是否要继续读取：rs.pasue、rs.resume。
5. ws.on('drain')：抽干事件，当我们写入的内容达到预期或超出预期时会触发此方法（必须等到内容都写入文件中才执行）。

```js
const fs = require('fs')
const path = require('path')

const ws = fs.createWriteStream(path.resolve(__dirname, 'test.txt'), {
  flags: 'w',
  encoding: 'utf8',
  autoClose: true,
  highWaterMark: 2, // （安全线）水位线默认16k，但他并不会起到限制写进去多少的作用，写入的位数大于highWaterMark，也会被写入
})
let flag = ws.write('1') // 只能写入string / buffer类型，其内部是调用fs.write
ws.write('2')
ws.write('3')
ws.write('4')
console.log(flag) // 当前写入的大于等于highWaterMark falg：false，小于highWaterMark flag：true

ws.end('ok') // = ws.write 把ok写入后ws.close关闭文件了
ws.end() // 后续可以调end方法（传参数就会报错：write after end），但文件已经关闭了就不能再写入了（end里的参数就不会写入文件了）
```

**write 方法虽然是异步的但是写入的永远是 1234。**

**核心原则是将多个异步任务进行排队依次执行，（write 是异步，但是同一时间只能有一个来操作文件，其他的放入缓存区），（用链表实现的缓存区）。**

![write_stream](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/write_stream.jpg)

比较常见的数据结构有：数组、栈、队列、[链表](../../base/structure/linkList.md)、[树](../../base/structure/tree.md)。

为什么用链表实现缓存区而不用数组？因为用数组性能不好（用数组，每次取头部(shift)，其余的都需要往前移），而用链表（只需要改变指针的指向就可以了）。

用链表可以来实现栈或队列，性能好（取头部性能会高些）。

ws.on('drain')抽干事件：

```js
// 我只想用一个字节来实现写入10个数
const fs = require('fs')
const path = require('path')

const ws = fs.createWriteStream(path.resolve(__dirname, 'test.txt'), {
  highWaterMark: 1,
})

let i = 0
function write() {
  let flag = true
  while (i < 10 && flag) {
    flag = ws.write('' + i++)
  }
}

write() // 当第一个写进去，flag：false，停止了

ws.on('drain', function () {
  // 当我们的内容达到预期或超出预期就会触发此方法（但必须等内容写入文件中才执行）
  write() // 第一个写完了会触发此方法，再次写
})
```

```js
const fs = require('fs')
const path = require('path')

const ws = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), {
  highWaterMark: 2,
})

let flag = ws.write('s')
console.log(flag) // true

flag = ws.write('x')
console.log(flag) // false

ws.on('drain', function () {
  // 第一次写入s没达到预期，把x放到缓存区里了，s写完再写x，x写完后达到预期了并且消耗掉，触发drain事件
  console.log('干了')
})

setTimeout(() => {
  flag = ws.write('x')
  console.log(flag) // true
}, 1000)
```

createWriteStream 内部流程：

1. 格式化传入数据，默认需要打开文件。
2. 用户调用 write 方法时，Writable 接口实现了 write 方法，并且内部会调用\_write 方法，\_write 方法里是 fs.write.
3. 看是否达到预期(没有达到预期就可以继续写)，并且区分是第一次写入，还是后续写入（存到缓存区里）。

```js
const { Writable } = require('stream')

class MyWrite extends Writable {
  _write(chunk, encoding, cb) {
    // 第一个写完后怎么通知第二个去写？
    cb() // 这里调完回调后，才会写入第二个
    // 这里的cb和write里的回调函数不是一个
  }
}

let mw = new MyWrite()

mw.write('ok', function () {
  console.log('ok')
})

mw.write('ab')
```

### 自己实现下可写流：

```js
const fs = require('fs')
const EventEmitter = require('events')
const Queue = require('./Queue')

class writeStream extends EventEmitter {
  constructor(path, options) {
    super()
    this.path = path
    this.flags = options.flags || 'w'
    if (options.autoClose === 'undefined') {
      this.autoClose = true
    } else {
      this.autoClose = options.autoClose
    }
    this.encoding = options.encoding || 'utf8'
    this.highWaterMark = options.highWaterMark || 16 * 1024
    this.open()
    // 要判断第一次写入还是第二次写入
    this.writing = false // 用来描述当前是否有正在写入的操作
    this.offset = 0 // 文件偏移量，每次写入时的偏移量
    this.len = 0 // 需要统计的长度，每次写都要累加
    this.needDrain = false // 默认是否触发drain事件
    this.cache = new Queue() // 用来实现缓存
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) return this.emit('error', err)
      this.fd = fd
      this.emit('open', fd)
    })
  }
  write(chunk, encoding = this.encoding, cb = () => {}) {
    // 用户调用的write方法
    // 判断是真的写入，还是放到缓存中
    // 用户调用write时，写入的数据可能是 string 或 buffer
    // 需要把数据统一成buffer
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    // 每次写入是都要记录长度
    this.len += chunk.length
    let ret = this.len < this.highWaterMark // true 能继续写，false 达到/超过预期了
    if (!ret) {
      // 达到或超过预期了
      this.needDrain = true
    }
    if (this.writing) {
      //如果当前数据正在写入，就先存起来，稍后再写入
      this.cache.offer({
        chunk,
        encoding,
        cb,
      })
    } else {
      // 如果当前数据没有写入，就调用_write，去写入
      this.writing = true // 标识正在写入
      this._write(chunk, encoding, () => {
        cb() // 用户本来的回调先执行
        this.clearBuffer() // 清空缓存区
      })
    }
    return ret // 这个就是调write的返回值
  }
  clearBuffer() {
    // 多个异步并发，可以靠队列来实现，依次清空
    let data = this.cache.poll()
    if (data) {
      // 缓存区有值，要继续写入
      const { chunk, encoding, cb } = data
      this._write(chunk, encoding, () => {
        cb() // 用户本来的回调
        this.clearBuffer() // 缓存区里有多个，递归再去清空
      })
    } else {
      // 缓存区没值了
      this.writing = false //缓存里的也写入了
      if (this.needDrain) {
        // 看是否需要触发drain事件
        this.needDrain = false
        this.emit('drain')
      }
    }
  }
  _write(chunk, encoding, cb) {
    // 真实的写入操作，fs.write ---源码中的 doWrite
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this._write(chunk, encoding, cb))
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
      this.len -= written // 写完一个len少一个，len是写入所有的长度
      this.offset += written
      cb() // 写完一个，要清空缓存区的写入操作
    })
  }
}

module.exports = writeStream
```

## Pipe

最终目的是，可读流、可写流搭配使用实现读一点写一点。

```js
const ReadStream = require('./ReadStream')
const WriteStream = require('./WriteStream')

let rs = new ReadStream('./test.txt', { highWaterMark: 4 });
let ws = new WriteStream('./copy.txt', { highWaterMark: 1 });

// 读一点，写一点
rs.on('data', function (chunk) {
    let flag = ws.write(chunk)
    if (!flag) {
        rs.pause()
    }
})
ws.on('drain', function () {
    rs.resume()
})

----> 等价于
// 把可读流的数据导给可写流
// 拷贝功能是异步的，内部用的是发布订阅模式
rs.pipe(ws);
// 这个pipe方法就是属于可读流的
```

```js
const fs = require('fs')
const EventEmitter = require('event')
class ReadStream extends EventEmitter {
    constructor (path, options) {
        super()
        this.path = path
        this.flags = options.flags || 'r'
        this.encoding = options.encoding || null
        if (this.autoClose === 'undefined') {
            this.autoClose = true
        } else {
            this.autoClose = options.autoClose
        }
        this.start = options.start || 0
        this.end = options.end || undefined
        this.highWaterMark = options.highWaterMark || 64 * 1024
        this.open() // 默认触发打开文件
        this.offset = this.start // offset 可以根据每次读的位置发生变化（文件的偏移量）
        this.flowing = false // 默认是非流动模式（只有用户监听了data，flowing才变成true）
        this.on('newListener', function (type) {
            if (type === 'data') {
                this.flowing = true
                this.read() // 读文件
            }
        })
    }
    // 管道
    pipe (ws) {
        this.on('data', (chunk) => {
            let flag = ws.write(chunk)
            if (!flag) {
                this.pause()
            }
        })
        ws.on('drain', function () {
            this.resume()
        })
    }
    open () {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) return this.emit('error', err)
            this.fd = fd // 文件描述符
            this.emit('open', fd)
        })
    }
    pause () {
        this.flowing = false
    }
    resume () {
        if (!this.flowing) {
            this.flowing = true
            this.read()
        }
    }
    read () {
        // open是异步的，直接拿fd是取不到的
        // 所以用this.once订阅（只触发一次），当open函数调用 emit时说明fd肯定有了，只时候fd就能拿到了
        if(typeof this.fd !== 'number') {
            this.once('open', () => this.read())
        }
        const buffer = Buffer.alloc(this.highWaterMark)
        // 读多少为什么不能直接用highWaterMark？
        // 因为读到最后时highWaterMark有可能会读多：12345，highWaterMark = 2，第三次读应该读一个，如果用highWaterMark就会多读，所以进行比较谁小用谁
        // this.end - this.offset + 1：0+2+2 = 4，offset = 4,start-end:0-4是5个，所以要+1
        const howMuchToRead = this.end ? Math.min((this.end - this.offset + 1), this.highWaterMark) : this.highWaterMark
        fs.read(this.fd, buffer, 0, howMuchToRead, this.offset, (err, bytesRad) { // bytesRad:真正读取的个数
            if(bytesRead) {
                this.offset += bytesRead // 每次读到后就累加，方便下次继续读取
                // 发布data
                this.emit('data', buffer.slice(0, bytesRead)) // 给rs.on('data')的返回数据
                if (this.flowing) {
                  this.read()
                }
            } else {
                this.emit('end')
                if (this.autoClose) {
                    fs.close(this.fd, () => { // 关闭文件
                        this.emit('close')
                    })
                }
            }
        })
    }
}
module.exports = ReadStream
```

## 双工流

双工流：能读也能写，既继承了可读流又继承了可写流（这里的读和写可以没什么关系）。

```js
const { Duplex, Readable, Writable } = require('stream')

class MyDuplex extends Duplex {
  _read() {
    this.push('sxx')
    this.push(null) // 读完
  }
  _write(chunk, encoding, cb) {
    console.log(chunk)
    cb() //  写完
  }
}
let md = new MyDuplex()
md.on('data', function (chunk) {
  console.log(chunk)
})
md.write('20k')
```

## 转化流

```js
const { Transform } = require('stream')
class MyTransform extends Transform {
     _transform (chunk, encoding, cb) {
        // 这里可以调用push方法
        this.push(chunk.toString().toUpperCase());
        cb()
    }
}
let my = new MyTransfrom();
// 标准输出
process.stdout.write('ok'); // ===> console.log() 可写流
// 错误输出
process.stderr.write('err');

// 可读流
// 脚手架用户命令行输入的实现
process.stdin.on('data',function (chunk) { // 监控用户输入内容
    process.stdout.write(chunk);// 输出消息
})
---> 简化写法
process.stdin.pipe(process.stdout)
---> 希望把用户输入的进行加密再显示（在转化流里处理加密）
process.stdin.pipe(my).pipe(process.stdout)
```
