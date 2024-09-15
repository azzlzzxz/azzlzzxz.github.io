# Class

`ES6` 提供了更接近传统语言的写法，引入了 `Class`（类）这个概念，作为对象的模板。通过`class`关键字，可以定义类。

基本上，`ES6` 的`class`可以看作只是一个语法糖，它的绝大部分功能，`ES5` 都可以做到，新的`class`写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

## `constructor`方法

`constructor()`方法是类的默认方法，通过`new`命令生成对象实例时，自动调用该方法。一个类必须有`constructor()`方法，如果没有显式定义，一个空的`constructor()`方法会被默认添加

```js
class Person {}

// 等同于
class Person {
  constructor() {}
}
```

`constructor()`方法默认返回实例对象（即`this`），完全可以指定返回另外一个对象

```js
class Person {
  constructor() {
    return Object.create(null)
  }
}

new Person() instanceof Person
// false
```

👆 代码中，`constructor()`函数返回一个全新的对象，结果导致实例对象不是`Person`类的实例。

::: tip 注意 ⚠️

- 类必须使用`new`调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用`new`也可以执行

```js
class Person {
  constructor() {
    return Object.create(null)
  }
}

Person()
// TypeError: Class constructor Person cannot be invoked without 'new'
```

:::

## 类的实例对象

生成类的实例的写法，与 `ES5` 完全一样，也是使用`new`命令

```js
class Person {
  // ...
}

// 报错
const person1 = Person('steins gate')

// 正确
const person2 = new Person('steins gate')
```

在类中定义的方法会添加到 `class` 的原型中，因此所有实例共享这些方法。

类的属性和方法，除非显式定义在其本身（即定义在`this`对象上），否则都是定义在原型上（即定义在`class`上）

```js
class Person {
  constructor(name) {
    this.name = name
  }

  sayName() {
    console.log(this.name)
  }
}

const person1 = new Person('steins gate')
person1.sayName() // steins gate
```

### 实例属性的新写法

[<u>ES2022</u>](https://github.com/tc39/proposal-class-fields)规定了一种新写法。实例属性现在除了可以定义在`constructor()`方法里面的`this`上面，也可以定义在类内部的最顶层

```js
class Pesron {
  constructor() {
    this.name = 'steins gate'
  }
}
// 等同于
class Person {
  name = 'steins gate'
}
```

::: tip 注意 ⚠️

新写法定义的属性是实例对象自身的属性，而不是定义在实例对象的原型上面
:::

## `get` & `set`

与 `ES5` 一样，在`“类”`的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```js
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter'
  }
  set prop(value) {
    console.log('setter: ' + value)
  }
}

let inst = new MyClass()

inst.prop = 123
// setter: 123

inst.prop
// 'getter'
```

## 属性表达式

类的属性名，可以采用表达式

```js
let methodName = 'getAName';

class Person {
  constructor(name) {
    ...
  }

  [methodName]() {
    ...
  }
}
```

## `Class`表达式

类也可以使用表达式的形式定义

```js
const MyClass = class Me {
  getClassName() {
    return Me.name
  }
}
```

👆 代码使用表达式定义了一个类。需要注意的是，这个类的名字是`Me`，但是`Me`只在 `Class` 的内部可用，指代当前类。在 `Class` 外部，这个类只能用`MyClass`引用。

```js
let person = new MyClass()
person.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```

如果类的内部没用到的话，可以省略`Me`

```js
const MyClass = class {
  /* ... */
}
```

采用 `Class` 表达式，可以写出立即执行的 `Class`

```js
let person = new (class {
  constructor(name) {
    this.name = name
  }

  sayName() {
    console.log(this.name)
  }
})('steins gate')

person.sayName() // steins gate
```

## 静态方法&静态属性

### 静态方法

::: 什么是静态方法?

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为`“静态方法”`
:::

> 举个 🌰

```js
class Person {
  static getName() {
    return 'steins gate'
  }
}

Person.getName() // 'steins gate'

const person = new Foo()
person.getName()
// TypeError: person.getName is not a function
```

#### 如果静态方法包含`this`关键字，这个`this`指的是类，而不是实例

```js
class Person {
  static getName() {
    this.getToName()
  }
  static getToName() {
    console.log('steins gate')
  }
}

Person.getName() // steins gate
```

#### 静态方法可以与非静态方法重名

```js
class Person {
  static getName() {
    return 'static steins gate'
  }
  getName() {
    return 'steins gate'
  }
}

Person.getName() // static steins gate

const person = new Person()
person.getName() // steins gate
```

#### 父类的静态方法，可以被子类继承

```js
class Person {
  static getName() {
    return 'steins gate'
  }
}

class MY extends Person {}

MY.getName() // 'steins gate'
```

#### 静态方法也是可以从`super`对象上调用的

```js
class Person {
  static getName() {
    return 'steins gate'
  }
}

class MY extends Person {
  static getMyName() {
    return super.getName() + ' is my name'
  }
}

MY.getMyName() // 'steins gate is my name'
```

### 静态属性

静态属性指的是 `Class` 本身的属性，即`Class.propName`，**而不是定义在实例对象（`this`）上的属性**

```js
class Person {}

Person.name = 'steins gate'
```

```js
class Person {
  static name = 'steins gate'
}
```

::: tip 注意 ⚠️

- 父类的静态属性和静态方法，也会被子类继承

```js
class A {
  static hello() {
    console.log('hello world')
  }
}

class B extends A {}

B.hello() // hello world
```

- 静态属性是通过浅拷贝实现继承的

```js {1,5,10,11}
class A {
  static foo = 100
}
class B extends A {
  constructor() {
    super()
    B.foo--
  }
}

const b = new B()
B.foo // 99
A.foo // 100
```

当属性是个引用类型时

```js {2,8,13,14}
class A {
  static foo = { n: 100 }
}

class B extends A {
  constructor() {
    super()
    B.foo.n--
  }
}

const b = new B()
B.foo.n // 99
A.foo.n // 99
```

:::

## 私有方法&私有属性

[<u>ES2022</u>](https://github.com/tc39/proposal-class-fields)为`class`添加了私有属性，方法是在属性名之前使用`#`表示，私有属性只能在类的内部访问，外部无法访问

```js
class BankAccount {
  #balance = 0 // 私有字段

  constructor(initialBalance) {
    this.#balance = initialBalance
  }

  #logTransaction(amount) {
    // 私有方法
    console.log(`Transaction of amount: ${amount}`)
  }

  deposit(amount) {
    this.#balance += amount
    this.#logTransaction(amount)
  }

  getBalance() {
    return this.#balance
  }
}

const account = new BankAccount(1000)

account.#balance // SyntaxError
account.#logTransaction(500) // SyntaxError

account.deposit(500)

console.log(account.getBalance()) // 1500
```

::: tip 注意 ⚠️

- 子类无法继承父类的私有属性和私有方法，或者说，私有属性或私有方法只能在定义它的 class 里面使用

```js
class Foo {
  #p = 1
  #m() {
    console.log('hello')
  }
}

class Bar extends Foo {
  constructor() {
    super()
    console.log(this.#p) // 报错
    this.#m() // 报错
  }
}
```

:::

## `in` 运算符

`in` 运算符用于判断一个属性是否属于一个对象，或者一个属性是否定义在某个对象上，或者存在于某个对象原型链上。

`ES2022` 改进了`in`运算符，使它也可以用来判断私有属性

```js
class C {
  #brand

  static isC(obj) {
    if (#brand in obj) {
      // 私有属性 #brand 存在
      return true
    } else {
      // 私有属性 #foo 不存在
      return false
    }
  }
}
```

## 静态块

`ES2022` 引入了静态块`（static block）`，允许在类的内部设置一个代码块，在类生成时运行且只运行一次，主要作用是对静态属性进行初始化。以后，新建类的实例时，这个块就不运行了。

```js
class C {
  static x = 234;
  static y;
  static z;
}

try {
  const obj = doSomethingWith(C.x);
  C.y = obj.y
  C.z = obj.z;
} catch {
  C.y = ...;
  C.z = ...;
}
```

使用静态块

```js
class C {
  static x = ...;
  static y;
  static z;

  static {
    try {
      const obj = doSomethingWith(this.x);
      this.y = obj.y;
      this.z = obj.z;
    }
    catch {
      this.y = ...;
      this.z = ...;
    }
  }
}
```

👆 代码中，类的内部有一个 `static` 代码块，这就是静态块。它的好处是将静态属性`y`和 z`的初始化逻辑，写入了类的内部，而且只运行一次。

::: tip 注意 ⚠️

- 每个类允许有多个静态块，每个静态块中只能访问之前声明的静态属性。另外，静态块的内部不能有`return`语句。

- 静态块内部可以使用类名或`this`，指代当前类。

:::
