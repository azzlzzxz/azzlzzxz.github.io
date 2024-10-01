# Node

`Node` 不是一门语言，其核心就是一个让 `JS` 运行在服务端的一个运行时。

`Node.js` 最大的特点就是使用 异步式 `I/O` 与 事件驱动 的架构设计。

对于高并发的解决方案，传统的架构是多线程模型，而 `Node.js` 使用的是 单线程 模型，对于所有 `I/O` 都使用非阻塞的异步式的请求方式，避免了频繁的线程切换。

异步式 `I/O` 是这样实现的：由于大多数现代内核都是多线程的，所以它们可以处理在后台执行的多个操作。

![node_async](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/node_async.jpg)

`Node.js` 在执行的过程中会维护一个事件队列，程序在执行时进入 事件循环 等待下一个事件到来。

当事件到来时，事件循环将操作交给系统内核，当一个操作完成后内核会告诉 `Nodejs`，对应的回调会被推送到事件队列，等待程序进程进行处理。

## `Nodejs` 的架构

![node](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/node_1.png)

`Node.js` 使用 `V8` 作为 `JavaScript` 引擎，使用高效的 `libev` 和 `libeio` 库支持事件驱动和异步式 `I/O`。

`Node.js` 的开发者在 `libev` 和 `libeio` 的基础上还抽象出了层 `libuv`。对于 `POSIX1` 操作系统，`libuv` 通过封装 `libev` 和 `libeio` 来利用 `epoll` 或 `kqueue`。在 `Windows` 下，`libuv` 使用了 `Windows` 的 `IOCP` 机制，以在不同平台下实现同样的高性能。

## `Nodejs` 的运行机制

![node_system](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/node_system.jpg)

1. `V8` 引擎解析 `JavaScript` 脚本。

2. 解析后的代码，调用 `Node API`。

3. `libuv` 库负责 `Node API` 的执行。它将不同的任务分配给不同的线程，形成一个 `Event Loop（事件循环）`，以异步的方式将任务的执行结果返回给 `V8` 引擎。

4. `V8` 引擎再将结果返回给用户
