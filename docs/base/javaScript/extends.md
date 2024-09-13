# 继承

`JavaScript`中的继承主要是通过**原型链**实现的，而从 ES6 开始，引入了类（`class`）的语法糖，使得继承更加直观和易于理解。虽然语法上有了类的概念，但底层仍然依赖于原型继承机制。

## 基于原型的继承

在`JavaScript`中，所有的对象都有一个隐式的属性，称为 `[[Prototype]]`，我们可以通过 `__proto__` 来访问它（实际上 `__proto__` 是浏览器提供的非标准属性）。当我们试图访问一个对象的属性时，`JavaScript`会首先查找该对象自身的属性，如果找不到，则会沿着原型链继续查找。

### 原型链继承

JavaScript 的继承机制依赖于原型链。例如，如果一个对象的原型也有一个原型，那么当访问对象的属性时，JavaScript 会沿着原型链一直查找，直到找到属性或达到链的顶端（即 `Object.prototype`）。

在这种继承方式中，我们让子类的 `prototype` 指向父类的一个实例，从而使子类可以访问父类的属性和方法。

> 举个 🌰

```js
function Parent() {
  this.name = 'Parent'
  this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child() {}

Child.prototype = new Parent() // 子类的原型指向父类的实例

const child1 = new Child()
child1.getName() // 输出 'Parent'
```

::: info 特点

- 子类能够访问父类原型上的方法和属性。

- 所有实例共享父类的引用类型属性（例如数组、对象），导致一个实例修改属性会影响所有实例。
  :::

::: tip 缺点

- 引用类型属性共享：如果父类中有引用类型的属性，如数组或对象，子类的所有实例会共享这些属性，这可能会导致实例之间相互影响。

- 无法向父类构造函数传递参数：在继承时，无法向父类构造函数传递参数。
  :::

### 构造函数继承

构造函数继承的核心思想是，在子类的构造函数内部使用 `call` 或 `apply` 方法调用父类构造函数，从而使得子类能够继承父类的属性。构造函数继承只继承父类构造函数中的属性，不会继承父类原型上的方法

> 举个 🌰

```js
function Parent(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

function Child(name, age) {
  Parent.call(this, name) // 调用父类构造函数
  this.age = age
}

const child1 = new Child('Child1', 18)
console.log(child1.name) // 输出 'Child1'
console.log(child1.colors) // 输出 ['red', 'blue', 'green']

const child2 = new Child('Child2', 20)
child2.colors.push('black')
console.log(child1.colors) // ['red', 'blue', 'green']
console.log(child2.colors) // ['red', 'blue', 'green', 'black']
```

::: info 特点

- 通过 `Parent.call(this, name)` 这种方式，子类可以直接调用父类构造函数，并给父类构造函数传递参数。

- 子类的每个实例都会有独立的父类属性（包括引用类型属性），不会共享引用类型属性。
  :::

::: tip 优点

- 解决了引用类型属性共享的问题：每个实例都可以独立拥有父类中的引用类型属性（如数组、对象）。

- 可以向父类构造函数传递参数，灵活性更高。
  :::

::: tip 缺点

- 只能继承父类构造函数中的属性，无法继承父类原型上的方法。这意味着每个子类实例都有一份独立的父类属性副本，但没有办法访问父类的公共方法。

- 方法不能复用：由于没有继承父类的原型链，如果父类有公共的方法，这些方法不会被子类继承，需要手动在子类中定义。
  :::

### 组合继承（伪经典继承）

组合继承是原型链继承和构造函数继承相结合的一种模式。它既能够解决引用类型属性共享的问题，又能够保持对父类原型上方法的复用。

> 举个 🌰

```js
function Parent(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name) // 调用父类构造函数，解决引用类型属性共享问题
  this.age = age
}

Child.prototype = new Parent() // 继承父类的方法
Child.prototype.constructor = Child

const child1 = new Child('Child1', 18)
child1.getName() // 输出 'Child1'
console.log(child1.colors) // ['red', 'blue', 'green']

child1.colors.push('black')
console.log(child1.colors) // ['red', 'blue', 'green', 'black']

const child2 = new Child('Child2', 20)
console.log(child2.colors) // ['red', 'blue', 'green']
```

::: info 特点

- 通过 `Parent.call(this, name)` 调用父类构造函数，实现了对父类属性的独立拷贝，解决了引用类型属性共享的问题。

- 通过 `Child.prototype = new Parent()` 实现对子类原型链的继承，保证子类可以访问父类的原型方法。
  :::

::: tip 优点

- 解决了原型链继承中的引用类型属性共享问题。

- 通过组合使用构造函数继承和原型继承，使得每个实例都有自己独立的属性，同时共享父类的方法。
  :::

::: tip 缺点

- 父类构造函数被调用了两次，一次是在子类原型上，另一次是在子类构造函数中，可能会造成一定的性能浪费。
  :::

### 原型式继承

原型式继承是一种不使用构造函数的继承方式，它通过直接创建一个现有对象的副本来实现继承。这种方式适合于创建一个对象的浅拷贝

> 举个 🌰

```js
function createObject(o) {
  function F() {}
  F.prototype = o
  return new F()
}

const parent = {
  name: 'Parent',
  colors: ['red', 'blue', 'green'],
  getName: function () {
    console.log(this.name)
  },
}

const child = createObject(parent)
child.getName() // 输出 'Parent'
```

::: info

特点

- 这种继承方式适用于对象的浅拷贝。

- 通过将父类对象赋值给子类的原型，实现对父类属性和方法的继承。
  :::

::: tip 缺点

- 和原型链继承类似，引用类型的属性仍然会被共享，实例之间可能会相互影响。

- 不能向父类构造函数传递参数。
  :::

### 寄生式继承

寄生式继承是一种在原型式继承的基础上，进一步对继承的对象进行增强的继承方式。它的基本思路是通过创建一个新的对象来继承父对象，然后对这个对象进行扩展。

> 举个 🌰

```js
function createObject(o) {
  function F() {}
  F.prototype = o
  return new F()
}

function createNewObject(o) {
  const clone = createObject(o)
  clone.sayHello = function () {
    console.log('Hello')
  }
  return clone
}

const parent = {
  name: 'Parent',
  colors: ['red', 'blue', 'green'],
}

const child = createNewObject(parent)
child.sayHello() // 输出 'Hello'
```

::: info 特点

- 基于原型式继承的思路，创建一个副本，然后对副本进行增强，添加新的方法或属性。
  :::

::: tip 优点

- 可以通过返回新的对象，避免引用类型属性共享问题。
  :::

::: tip 缺点

- 和原型式继承一样，寄生式继承也无法避免引用类型属性的共享问题。

- 由于没有使用严格的构造函数继承，这种继承方式比较低效，无法复用方法。
  :::

### 寄生组合式继承

寄生组合式继承是 `JavaScript` 中最推荐的一种继承方式。它结合了组合继承的优点，并且避免了组合继承中调用父类构造函数两次的性能问题。它的核心思想是通过 原型链 实现方法继承，通过 构造函数 实现属性继承。

> 举个 🌰

```js
function Parent(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name) // 属性继承
  this.age = age
}

function inheritPrototype(child, parent) {
  const prototype = Object.create(parent.prototype) // 创建父类原型的副本
  prototype.constructor = child // 修正 constructor 指向
  child.prototype = prototype // 赋值给子类的原型
}

inheritPrototype(Child, Parent)

const child1 = new Child('Child1', 18)
child1.getName() // 输出 'Child1'
```

::: info 特点

- 只调用一次父类构造函数，避免了组合继承中的性能浪费。

- 子类的实例可以继承父类的属性（通过构造函数继承）和方法（通过原型链继承）。

- 通过 `Object.create()` 来创建父类原型的副本，避免直接修改父类的原型
  :::

::: tip 优点

- 高效且灵活：只调用一次父类构造函数，既能避免组合继承中的重复调用父类构造函数，又能保持对原型链的继承。

- 避免引用类型共享问题：通过构造函数继承父类的属性，保证每个实例有自己的副本。
  :::

::: tip 缺点

- 实现过程稍微复杂一些
  :::

## ES6 类继承

虽然 ES6 引入了 `class` 关键字来简化继承的语法，但它的底层实现仍然是基于原型链的。`class` 只是语法糖，使得继承的实现方式更加清晰。

### 基本类定义和继承

ES6 中的类定义可以通过 `class` 关键字来创建，并使用 `extends` 关键字来实现继承。`super` 关键字用于调用父类的构造函数或方法。

> 举个 🌰

```js
class Animal {
  constructor(name) {
    this.name = name
  }

  speak() {
    console.log(`${this.name} makes a noise.`)
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name) // 调用父类的构造函数
    this.breed = breed
  }

  speak() {
    console.log(`${this.name} barks.`)
  }
}

const labrador = new Dog('Buddy', 'Labrador')
labrador.speak() // 输出: "Buddy barks."
```

在 👆 的例子中：

- `Animal` 是一个基类（父类）。
- `Dog` 是 `Animal` 的子类，通过 `extends` 关键字实现继承。
- `super(name)` 调用了父类的构造函数，从而继承了 `name` 属性。
- `Dog` 重写了父类的 `speak` 方法。

### 静态方法继承

ES6 类可以定义静态方法（使用 `static` 关键字），静态方法不会被实例继承，而是直接由类调用。如果子类定义了静态方法，也可以通过 `super` 调用父类的静态方法。

> 举个 🌰

```js
class Animal {
  constructor(name) {
    this.name = name
  }

  static species() {
    return 'Generic Animal'
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }

  static species() {
    return super.species() + ' (Dog)'
  }
}

console.log(Animal.species()) // 输出: "Generic Animal"
console.log(Dog.species()) // 输出: "Generic Animal (Dog)"
```

在 👆 的例子中：

- `Animal` 和 `Dog` 都有静态方法 `species`。
- `Dog.species()` 通过 `super.species()` 调用了 `Animal` 的静态方法。

## ES6 类继承与原型继承的对比

| 特性         | 原型继承                                      | ES6 类继承                        |
| ------------ | --------------------------------------------- | --------------------------------- |
| 语法复杂度   | 需要显式地操作 `prototype` 和 `__proto__`     | 使用 `class` 和 `extends` 更直观  |
| 构造函数调用 | 使用 `call()` 或 `apply()` 来继承父类构造函数 | 使用 `super()` 来调用父类构造函数 |
| 方法定义     | 方法放在构造函数的 `prototype` 上             | 方法直接定义在 `class` 中         |
| 静态方法     | 在构造函数本身上定义                          | 使用 `static` 关键字              |
| 继承机制     | 通过原型链                                    | 通过 `class` 和 `extends`         |

## 总结

- **JavaScript 的继承**是基于原型链的，所有对象通过原型链进行属性和方法的继承。
- 在 ES5 中，继承是通过构造函数和 `prototype` 实现的，手动设置子类的原型为父类的原型。
- ES6 引入了 `class` 语法，使得继承的写法更加直观和类似其他面向对象语言，但本质上还是基于原型链的继承机制。
- `super` 关键字用于调用父类的构造函数和方法。
