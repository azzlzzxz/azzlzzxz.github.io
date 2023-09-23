# Events

## 介绍

1. node 是基于事件的，内部自己实现了一个发布订阅模式。
2. events 的常用事件：
   1. on，订阅事件。
   2. emit，发布事件。
   3. once，只触发一次，触发后删除。
   4. off，删除事件。
   5. newListener，用来监听用户绑定了那些事件。

```js
const EventEmitter = require('events')
function Girl() {}
// 定义一个类，让这个类继承 EventEmitter 原型上的方法
```

### 常用的继承原型方法：

- Object.create()
- Girl.prototype.**proto** = EventEmitter.prorotype
- Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype)
- exetends

```js
const util = require('util')
util.inherits(Girl, EventEmitter)//等价于Object.setPrototypeOf
let girl = new Girl()

girl.on('newListener', (type) => {
    console.log(type) // type是事件名
})
girl.on('Steins Gate', (a, b, c) => {
    console.log('success', a, b, c)
})
let eat = () => {
    console.log('OMG')
}
girl.once('Steins Gate', eat)
girl.off('Steins Gate', eat)

girl.emit('Steins Gate', 1, 2, 3)
'Steins Gate' 1 2 3

girl.emit('Steins Gate')
'Steins Gate' undefined undefined undefined
```

## 自己实现 EventEmitter

```js
function EventEmitter () {
    this._events = {}
}

// 订阅
EventEmitter.prototype.on = function (eventName, callback) {
    if (!this._events) {
        // this指向的是girl，girl上没有_events这个属性，就给她加一个没有原型的{}
        this.events = Object.create(null)
    }
    // 当前绑定的事件不是newListener事件，就触发newListener事件
    if (eventName !== 'newListener') {
        this.emit('newListener', eventName)
    }
    if (this._events[eventName]) {
        this._events[eventName].push(callback)
    } else {
        this._events[eventName] = [callback]
    }
}

// 发布
EventEmitter.prototype.emit = function (eventName, args) {
    if (!this._events) return
    this._events[callback].forEach(fn => fn(...args))
}

// 只触发一次
EventEmitter.prototype.once = function (eventName, callback) {
    const onlyOne = (args) => {
        callback(...args)
        // 当绑定后将自己删除掉
        this.off(eventName, callback)
    }
    onlyOne.l = callback // 用来标识这个callback是谁的
    this.on(eventName, onlyOne)
}

// 删除
EventEmitter.prototype.off = function (eventName, callback) {
    if (!this._events) return
    this._events[eventName].filter(fn => {
        return fn !== callback && fn.l !== callback（这样才能删除once的回调函数）
    })
}

module.exports = EventEmitter
```
