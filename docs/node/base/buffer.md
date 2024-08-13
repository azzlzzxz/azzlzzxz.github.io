# Buffer

## 前端自己的二进制变量 `arrayBuffer`

`arrayBuffer` 可以来操作二进制。

```js
// 创建一个空间，就的申请这个空间的大小
// 创建了一个ArrayBuffer，它有4位（4单位：字节）
const arrayBuffer = new ArrayBuffer(4)
console.log(arrayBuffer)
```

![array_buffer](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/array_buffer.png)

1. 开头字母 I 和 U 的区别：有无符号位，U 代表无符号位，I 代表有符号位。
2. Int8、Int16、Int32 的区别：分别代表单字节、双字节、四字节。

拿到的 `arrayBuffer` 是不能读取和操作的，只是声明，想操作它，据需要创建一个视图去读取 `arrayBuffer` 里的数据。

**`Uint8Array`、`Uint16Array`、`Uint32Array` 展现方式是不同的，但是结果是一样的。**

```js
const arrayBuffer = new ArrayBuffer(4)
// 数组里有4个，每个能放8个位，Uint8Array的8代表8位

let x = Uint8Array(arrayBuffer) // 4 * 8的

x[0] = 1
x[1] = 255 // 如果大于255，例如：256就显示0（每255循环），257就是1
console.log(x) // [1, 255, 0, 0]
// ===>二进制是从有往左 0 ，0，11111111，00000001

let x2 = Uint16Array(arrayBuffer) // 16 * 2
// 0 ，1111111100000001（两个组成一个）
console.log(x2) // [65281, 0]

let x3 = Uint32Array(arrayBuffer) // 32 * 1
console.log(x3) // [65281] （四个组成一个）
```

![buffer](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/buffer.png)

## `node` 中的 `Buffer`

`node` 中的 `buffer` 表示用的是 2 进制，但是展现的方式是 16 进制（2 进制太长了）。

16 进制 0xff = 2 进制 11111111 = 10 进制 255（不同进制可以表示同一个数）。

`JS` 中有进制转换方法不需要自己转换：

```js
// 任意进制转10进制
parseInt('11111111', 2) // 255

// 任意进制转任意进制
console.log((255.0).toString(16)) // ff
// 为什么用255.0.toString()
// js可以识别浮点类型如果写255.toString()，会把toString识别错误所以是255.0.toString()
```

**经典面试题：**

0.1 + 0.2 !== 0.3

计算机里存的不是 0.1，是二进制，要把 0.1，0.2 转成二进制。

将小数转化成二进制：乘 2 取整

```lua
0.1 * 2 = 0.2    0
0.2 * 2 = 0.4    0
0.4 * 2 = 0.8    0
0.8 * 2 = 1.6    1  ==> 0.6
0.6 * 2 = 1.2    1  ==> 0.2

...无限循环下去

不能用有限的内存记录无限的数，所以会进1，所以0.1在存进电脑里就会大一些。
```

## `base64` 是如何转换出来的

`base64` 可以用来数据传递、替代 `url`。（就像数据传递时不能传中文，就需要转成 `base64` 进行传递）

`node` 不支持 `gbk`，只支持 `utf8`。

```js
let r = Buffer.from('珠')
console.log(r) //  e7 8f a0 (16进制，3 * 8) buffer里放的是2进制，展示16进制

console.log(0xe7.toString(2));
console.log(0x8f.toString(2));
console.log(0xa0.toString(2));
--->
11100111 10001111 10100000    3 * 8

// 那怎么转成base64呢？就是把 3字节 * 8位 拆成 4字节 * 6位（补0变成8位）
```

**所以 base64 有个缺陷就是转化结果比以前大 1/3（所以 base64，不要用来转换大文件）**

```js
---> 111001 111000 111110 100000 4*6 （字节最大是6个1，也就是63，不可能大于64，所以叫base64）
console.log(parseInt('111001', 2)) // 57
console.log(parseInt('111000', 2))// 56
console.log(parseInt('111110', 2)) // 62
console.log(parseInt('100000', 2)) // 32

base64需要取特定的地方去取值

let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
str+=str.toLowerCase();
str+='0123456789+/';

console.log(str[57] + str[56] + str[62] + str[32]); // 54+g(这个就是 珠 --> base64编码)
```

```js
// 用法
Buffer.from('珠').toString('base64') // 54+g
Buffer.from('a') // <Buffer 61> 不够补0，缺少四位用=号去拼
```

## `Buffer` 基本用法

`buffer` 用来表示当前内存的信息，因为内存里放的都是二进制，所以用 `buffer` 来表现。

### `Buffer` 声明方式

固定大小、声明出来不能随意改变。

```js
let buffer = Buffer.alloc(6) // 6：字节数 （默认后端声明的大小数量，都是字节数）
// 创建buffer
let buffer1 = Buffer.from('明年加油')
let buffer2 = Buffer.from([0x01, 2, 3, 0x64])
```

### `buffer` 的长度

`buffer` 的长度是字节数目的长度

```js
let buffer = Buffer('时')
console.log(buffer.length) // 3
```

### 更改 `buffer`

想更改 `buffer`，可以通过索引，但是想更改 `buffer` 的大小，是无法更改的，可以通过声明一个新空间将结果拷贝进去。

`buffer` 提供了两个方法：`copy`、`concat`。

```js
let buffer = Buffer.alloc(12)
let buffer1 = Buffer.from('明年')
let buffer2 = Buffer.from('加油')
```

#### `copy`

对应的参数（要复制到的 `buffer`，`buffer` 内开始写入的位置，`buffer1` 的开始复制位置，`buffer1` 停止复制位置）

```js
buffer1.copy(buffer, 0, 0, 6)
buffer2.copy(buffer, 6, 0, 6)
Buffer.prototype.copy = function (target, targetStart, sourceStart = 0, sourceEnd = this.length) {
  for (let i = sourceStart; i < sourceEnd; i++) {
    target[targetStart++] = this[i]
  }
}
```

#### `concat`

```js
const newBuffer = buffer.concat([buffer1, buffer2], 100)
// 100这个参数是指定新buffer的长度，如果不传，默认取数组内buffer长度的总和
Buffer.prototype.concat = function (
  bufferList,
  length = bufferList.reduce((a, b) => a + b.length, 0),
) {
  let buf = Buffer.alloc(length)
  let offset = 0
  bufferList.forEach((bufItem) => {
    bufItem.copy(buf, offset)
    offset += bufItem.length
  })
  return buf.slice(0, offset)
}
```

### `isBuffer` 判断是否是 `buffer`
