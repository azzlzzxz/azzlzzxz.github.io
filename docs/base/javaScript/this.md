# this

`this` 的值取决于**函数的调用方式**，而不是它在代码中的位置。因此`this` 的指向在不同的上下文中会有所不同。

## 默认绑定

在全局执行上下文（即不在任何对象或函数内部），`this` 通常指向全局对象：

- 在浏览器中，全局对象是 `window`。
- 在 Node.js 中，全局对象是 `global`。

> 举个 🌰

```js
function showThis() {
  console.log(this)
}
showThis() // 在浏览器中输出 window, 在 Node.js 中输出 global
```

当 `this` 处于非严格模式下且没有明确的调用上下文时，它会指向全局对象。如果是严格模式（`use strict`），`this` 会是 `undefined`。

> 举个 🌰

```js
'use strict'

function showThis() {
  console.log(this)
}
showThis() // 输出 undefined
```

## 隐式绑定

当一个方法作为对象的属性调用时，`this` 会被隐式绑定到该对象。也就是说，`this` 指向调用该方法的对象。

> 举个 🌰

```js
const person = {
  name: 'steins gate',
  greet: function () {
    console.log(this.name)
  },
}

person.greet() // 输出 'steins gate'，this 指向 person 对象
```

在 👆 的代码中，`greet()` 是通过 `person` 对象调用的，因此 `this` 会指向 `person`。

## 显式绑定

通过 `call()`、`apply()` 或 `bind()` 可以显式地绑定 `this` 到某个对象。这三者的区别在于：

- `call()`：传入的第一个参数作为 `this` 的指向，其余参数作为函数的参数传入。
- `apply()`：与 `call()` 类似，但第二个参数是数组，表示传给函数的参数。
- `bind()`：返回一个新的函数，并永久地将 `this` 绑定到指定对象。

> 举个 🌰

```js
function greet() {
  console.log(this.name)
}

const person1 = { name: 'steins gate' }
const person2 = { name: 'azzlzzxz' }

greet.call(person1) // 输出 'steins gate'
greet.apply(person2) // 输出 'azzlzzxz'

const greetPerson1 = greet.bind(person1)
greetPerson1() // 输出 'steins gate'
```

## 箭头函数中的 `this`

[箭头函数中的 `this`指向 请看 🚀](/base/es6/arrowFn.md)

## 构造函数中的 `this`

当使用构造函数（即通过 `new` 关键字调用函数）时，`this` 会指向新创建的对象。

> 举个 🌰

```js
function Person(name) {
  this.name = name
}

const person1 = new Person('steins gate')
console.log(person1.name) // 输出 'steins gate'
```

在这种情况下，`this` 指向通过 `new` 创建的新对象 `person1`。

## DOM 事件处理函数中的 `this`

在事件处理函数中，`this` 通常指向**触发事件的 DOM 元素**。

> 举个 🌰

```js
const button = document.querySelector('button')
button.addEventListener('click', function () {
  console.log(this) // 指向被点击的 button 元素
})
```

不过，如果使用箭头函数作为事件处理程序，`this` 会指向定义该箭头函数时的上下文，而不是触发事件的元素。

> 举个 🌰

```javascript
const button = document.querySelector('button')
button.addEventListener('click', () => {
  console.log(this) // 指向外部作用域的 this，而非按钮
})
```

## 总结

- `this` 的指向是在**调用**时确定的，而不是在定义时。
- **默认绑定**：在全局作用域中，`this` 指向全局对象（非严格模式）。
- **隐式绑定**：当一个函数作为对象的方法调用时，`this` 指向该对象。
- **显式绑定**：使用 `call()`、`apply()` 或 `bind()` 显式指定 `this`。
- **箭头函数**：没有自己的 `this`，它继承自定义时所在的上下文。
- **构造函数**：使用 `new` 关键字调用函数时，`this` 指向新创建的对象。
