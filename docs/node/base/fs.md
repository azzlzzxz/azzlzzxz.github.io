# FS

## 文件

1. `fs`、`fileSystem`：和文件、文件夹相关的方法都在这里。
2. 里面的方法一般都有两种类型：同步、异步（没有 `Sync`）。
3. 文件读写：
   1. 如果我们是读取文件，读到的结果默认都是 `buffer` 类型。
   2. 写入的时候，会清空文件内容，并且以 `utf8` 格式类型写入。

```js
const fs = require('fs')
const path = require('path')

// 使用path.resolve（绝对路径）：运行时如果用相对路径，会以process.cwd()来切换路径，可能会导致不同路径下运行结果不同
fs.readFile(path.resolve(__dirname, '3.fs.js'), function (err, data) {
  // 读取图片时，采用utf8编码，会导致乱码
  fs.writeFile(path.resolve(__dirname, 'xxx.js'), data, function () {
    console.log('copy success')
  })
})
```

1. 文件读取的内容会放到内存中。
2. 如果文件过大会浪费内存。
3. 文件过大会导致淹没内存，所以大型文件不能采用这种方式来进行操作（判断标准：`64k`，`64k` 以上的文件做拷贝操作时就尽量不要用 `readFile` 来实现）。

4. 如何实现读一点，就写一点？
   1. 手动控制读写文件：`fs.open`、`fs.read`、`fs.write`、`fs.close`。
   2. 它们的参照物是内存：
      1. 要将一个文件内容 读取到内存 其实是做了写的操作。
      2. 向文件中写入，其实做了读的操作。

```js
fs.open('./xxx.js', 'r', function (err, fd) {
  // fd：file discriptor 类型是数字 windows系统从3开始递增，mac：22开始递增
  // 文件描述符  写入到的buffer  从buffer的哪个位置开始些  写入的个数  从文件的哪个位置开始读取
  fs.read(fd, buffer, 0, 3, 0, function (err, bytesRead) {
    // 真实的读取到的个数
    console.log(bytesRead)
    fs.close(fd, () => {
      console.log('完成')
    })
  })
})
```

```js
const buffer = Buffer.from('珠峰')

// node中采用了流的方式简化了这坨代码  解耦 发布订阅模式 来做解耦操作
function copy(source, target, cb) {
  const BUFFER_LENGTH = 3
  let read_position = 0
  let write_position = 0
  const buffer = Buffer.alloc(BUFFER_LENGTH)
  // flags:r => read  w=>write  a = append
  fs.open(source, 'r', function (err, rfd) {
    fs.open(target, 'w', function (err, wfd) {
      function next() {
        fs.read(rfd, buffer, 0, BUFFER_LENGTH, read_position, function (err, bytesRead) {
          // bytesRead：读取到的实际个数
          if (err) return cb(err)
          if (bytesRead) {
            // 读出来在写进去
            fs.write(wfd, buffer, 0, bytesRead, write_position, function (err, written) {
              read_position += bytesRead
              write_position += bytesRead
              next()
            })
          } else {
            fs.close(rfd, () => {})
            fs.close(wfd, () => {})
            cb()
          }
        })
      }
      next()
    })
  })
}

copy('./3.fs.js', './xxx.js', function () {
  console.log('copy success')
})
```

## 文件夹

### 如何创建文件夹

创建目录前，要先保证父目录的存在

```js
// 正确
fs.mkdir('a', (err) => {})
fs.mkdir('a/b', (err) => {})
```

```js
// 错误
fs.mkdir('c/d', (err) => {})
```

### 如何删除文件夹

删除目录时，要保证目录中的内容是空的。

```js
fs.rmdir('a/b', (err) => {})
fs.rmdir('a', (err) => {})
```

### 如何判断是否是文件夹还是文件

```js
const fs = require('fs')
const path = require('path')

// 读取目录中的内容
fs.readdir('a', (err, dirs) => {
  // 读取的结果只有儿子一层
  dirs = dirs.map((item) => {
    let p = path.join('a', item)
    // fs.stat可以判断文件类型（文件夹 / 文件）
    fs.stat(p, (err, stat) => {
      // 文件不存在就会报错
      stat.isDirectory() // isDirectory判断p是不是文件夹，返回boolen
      if (stat.isFile()) {
        // isFile判断p是不是文件，返回boolen
        fs.unlink(p, () => {}) // unlink 删除p（如果是文件，就可以用unlink直接删除）
      }
    })
  })
  return p
})
```

### 异步删除文件夹

![fs_async1](image/fs_async1.png)

![fs_async2](image/fs_async2.png)

#### 异步串行方式删除，儿子一个一个删除，再删除父亲，后序遍历。

递归删除

```js
function rmdir(dir, cb) {
  // 第二次参数是(a/b, next)
  fs.stat(dir, (err, statObj) => {
    if (statObj.isFile()) {
      //如果是文件，就直接删除
      fs.unlink(dir, cb)
    } else {
      // 文件夹
      // 读取文件夹的内容
      fs.readdir(dir, (err, dirs) => {
        // 拼接
        dirs = dirs.map((item) => {
          path.join(dir, item)
        })
        // 先删除儿子，再删除父亲
        let idx = 0
        function next() {
          if (idx === dirs.length) fs.rmdir(dir, cb) //第二次时，把b删了触发回调函数next
          // 先拿b
          let currentDir = dirs[idx++]
          // b和next方法放进去递归
          rmdir(currentDir, next)
        }
        next()
      })
    }
  })
}

// 递归先考虑两层
rmdir('a', (err) => {
  console.log('删除成功')
})
```

#### 异步并行方式删除，儿子删，儿子都删完了通知父亲删除，类似 `Promise.all`。

```js
function rmdir(dir, cb) {
  fs.stat(dir, (err, statObj) => {
    if (statObj.isFile()) {
      fs.rmdir(dir, cb)
    } else {
      fs.readdir(dir, (err, dirs) => {
        dirs = dirs.map((item) => {
          path.join(dir, iten)
        })
        if (dir.length === 0) {
          return fs.rmdir(dir, cb)
        }
        // 并发删除儿子，儿子删除完毕，通知父亲
        let idx = 0
        function done() {
          if (idx++ === dir.length) fs.rmdir(dir, cb)
        }
        for (let i = 0; i < dirs.length; i++) {
          let dir = dir[i]
          rmdir(dir, done)
        }
      })
    }
  })
}
```
