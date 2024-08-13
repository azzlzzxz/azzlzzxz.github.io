# Node

## `Nodejs` 的特点

`Node.js` 最大的特点就是使用 异步式 `I/O` 与 事件驱动 的架构设计。

对于高并发的解决方案，传统的架构是多线程模型，而 `Node.js` 使用的是 单线程 模型，对于所有 `I/O` 都使用非阻塞的异步式的请求方式，避免了频繁的线程切换。

异步式 `I/O` 是这样实现的：由于大多数现代内核都是多线程的，所以它们可以处理在后台执行的多个操作。

![node_async](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/node_async.jpg)

`Node.js` 在执行的过程中会维护一个事件队列，程序在执行时进入 事件循环 等待下一个事件到来。

当事件到来时，事件循环将操作交给系统内核，当一个操作完成后内核会告诉 `Nodejs`，对应的回调会被推送到事件队列，等待程序进程进行处理。

## `Nodejs` 的架构

![node](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/node_1.png)

`Node.js` 使用 `V8` 作为 `JavaScript` 引擎，使用高效的 `libev` 和 `libeio` 库支持事件驱动和异步式 `I/O`。

`Node.js` 的开发者在 `libev` 和 `libeio` 的基础上还抽象出了层 `libuv`。对于 POSIX1 操作系统，`libuv` 通过封装 `libev` 和 `libeio` 来利用 `epoll` 或 `kqueue`。在 `Windows` 下，`libuv` 使用了 `Windows` 的 `IOCP` 机制，以在不同平台下实现同样的高性能。

## `Nodejs` 的运行机制

![node_system](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/node_system.jpg)

1. `V8` 引擎解析 `JavaScript` 脚本。
2. 解析后的代码，调用 `Node API`。
3. `libuv` 库负责 `Node API` 的执行。它将不同的任务分配给不同的线程，形成一个 `Event Loop（事件循环）`，以异步的方式将任务的执行结果返回给 `V8` 引擎。
4. `V8` 引擎再将结果返回给用户

## `Node` 的一些概念

1. `node` 不是一门语言，其核心就是一个让 `JS` 运行在服务端的一个运行时（我们可以用 `JS` 来实现服务端，或工具）。
2. `JS` 有几部分组成：`BOM`、`DOM`、`ECMASCRIPT`。
3. `node` 中只能使用 `ECMASCRIPT` 语法本身（`node` 提供了内置模块可以帮助我们做系统级别的操作：`fs`，`http`...）+ `npm 包`。
4. `node` 做中间层是用来处理服务端返回的数据格式问题，并且还能解决跨域问题（后端是没有跨域的，跨域是浏览器做的限制）。
5. ssr 服务端渲染：`node` 可以解析 `react`、`vue` 语法渲染后返回给浏览器。
6. 前端打包工具 `webpack`、`rollup` 都是基于 `node` 实现的，前端可以用 `node` 来实现各种各样的工具。
7. `node` 做服务端是没什么优势的，刚开始是为了与 `web` 密切结合的。
8. `node` 的主线程是单线程。
9. `java 多线程`每次请求都开一个线程（引出线程池的概念），但是请求过多的话，也会浪费内存，`java 中的锁`：当多线程请求操作同一个资源时，是要一个一个来操作的，就是当一个在操作时，锁上，操作完毕后打开，依次往复。
   `java` 是通过时间切片进行并发操作的，时间切片也是有性能消耗的。

`java` 可以利用多线程实现加密、压缩、计算等 `cpu 密集型操作`。

10. `node` 高并发都是单线程异步的，`node` 本身有个 `libuv` 库，内部是用多线程实现异步的。

![java](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/java.png)

1.  `node` 没有锁的概念，就是一个主线程（内存消耗小），如果主线程工作量大就会有阻塞的问题，所以 `node` 不适合做 `cpu` 密集的操作，适合 `i/o(input/output，文件读写)`操作。
    `node` 可以开子进程，多个进程就可以充分利用 `cpu` 内核。

2.  异步非阻塞，同步阻塞（阻塞和非阻塞针对的是 调用方 异步同步指的是被调用方）

```lua
处理时，是异步的。
当前端请求-->node -->数据库
当前端请求--> | -->数据库
当数据库在处理时，node会去处理下一个请求，数据库处理完这个时，通知node，node再回来把数据返回去
```
