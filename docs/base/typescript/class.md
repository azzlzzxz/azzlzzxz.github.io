# 类

## 定义存取器

TS 里可以通过存取器来改变一个类中属性的读取和赋值操作

```ts
class User {
  myName: string
  constructor(myName: string) {
    this.myName = myName
  }

  // ---> 等价于

  constructor(public myName: string) {
    this.myName = myName
  }

  get name() {
    return this.myName
  }

  set name(val) {
    this.myName = val
  }
}

let user = new User('ws') // ws 给了constructor
user.name = 'steins' // steins 给了set
console.log(user.name) // get方法
```

## readonly 只读

```ts
class Animal {
  public readonly name: string
  constructor(name: string) {
    // public readonly 的属性只能在constructor里赋值
    this.name = name
  }
  changeName(name: string) {
    // this.name = name //无法分配到 "name" ，因为它是只读属性。
  }
}
```

## 继承

```ts
class Person {
  name: string
  age: string
  constructor(name: string, age: string) {
    this.name = name
    this.age = age
  }
  getName(): string {
    return this.name
  }
  setName(name: string): void {
    this.name = name
  }
}

class Student extends Person {
  stuNo: number
  constructor(name: string, age: string, stuNo: number) {
    super(name, age)
    this.stuNo = stuNo
  }
  getStuNo() {
    return this.stuNo
  }
}

let s1 = new Student('czp', '11', 1)
console.log(s1.getStuNo()) // 1
console.log(s1.name) // 'czp'
```

## 类里的修饰符

1. public(公共) 自己的子类和其他类都能访问。
2. protected(受保护的) 自己和自己子类能访问，其他类不能访问。
3. private(私有的) 自己能访问，子类和其他类不能访问。

```ts
class Father {
  static fatherName: string = 'fatherName'
  toString() {
    console.log('father')
  }
  public name: string // public(公共) 自己的子类和其他类都能访问
  protected age: number // protected(受保护的) 自己和自己子类能访问，其他类不能访问
  private money: number // private(私有的) 自己能访问，子类和其他类不能访问
  constructor(name: string, age: number, money: number) {
    this.name = name
    this.age = age
    this.money = money
  }
  getName(): string {
    return this.name
  }
}

class Child extends Father {
  static childName: string = 'childName'
  constructor(name: string, age: number, money: number) {
    super(name, age, money)
  }
  toString() {
    //子类的方法可以和父类方法重名，但子类方法回覆盖父类方法
    // 父类调用不了子类方法，子类可以调用父类方法
    super.toString() //调用父类的toString方法
    console.log('child')
  }
  desc() {
    console.log(this.age)
    // console.log(this.money) // 属性“money”为私有属性，只能在类“Father”中访问。
  }
}

let father = new Father('szy', 26, 100)
let child = new Child('czp', 25, 12)
console.log(child.name) // 'czp'
console.log(father.name) // 'szy'

// child.age //属性“age”受保护，只能在类“Father”及其子类中访问。

child.desc() // 25
Child.fatherName // 静态属性给了类
console.log(Child.fatherName) // fatherName
child.toString() // father child
father.toString() // father
```

## export

```ts
export {}
// exports.__esModule = true;  表示当前是一个es6模块

// Person标识符重复：因为声明的person是全局的类
// 别的ts文件里也有 ，在ts文件中加export{},会使ts认为这个文件是一个模块，这样就不会报错
class Person {
  name: string = 'sxx'
  getName(): void {
    // console.log(this.name)
  }
}

// 类就是语法糖最后编译还是函数

let p1 = new Person()
p1.name = 'sxx'
p1.getName()
```

## 类的 TS 转 JS

```ts
// ts
export {}

class Father {}

class Child extends Father {}
```

```js
'use strict'
var __extends =
  (this && this.__extends) ||
  (function () {
    // 继承静态属性
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b
          }) ||
        function (d, b) {
          for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]
        }
      return extendStatics(d, b)
    }
    return function (d, b) {
      extendStatics(d, b)
      function __() {
        this.constructor = d
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
    }
  })()

// --->

var extendStatics = function (Child, Father) {
  extendStatics = function (Child, Father) {
    for (var p in Father) if (Object.prototype.hasOwnProperty.call(Father, p)) Child[p] = Father[p]
  }
  return extendStatics(Child, Father)

  // --->

  for (var p in Father) {
    Child[p] = Father[p]
  }
}
var __extends = function (Child, Father) {
  extendStatics(Child, Father) // 把father的静态属性都拷贝到Child身上

  function __() {
    this.constructor = Child
  }
  Child.prototype =
    Father === null ? Object.create(Father) : ((__.prototype = Father.prototype), new __())

  // --->

  function Temp() {
    this.constructor = Child
  }
  // 原型继承
  let temp = new Temp()
  temp.prototype = Father.prototype
  Child.prototype = temp
}

var Father = /** @class */ (function () {
  function Father() {}
  return Father
})()

// --->

function Father() {}

var Child = /** @class */ (function (_super) {
  __extends(Child, _super)
  function Child() {
    return (_super !== null && _super.apply(this, arguments)) || this
  }
  return Child
})(Father)

// --->

__extends(Child, Father)

function Child() {
  return (Father !== null && Father.apply(this, arguments)) || this
}

// --->

function Child(...args) {
  return Father(...args)
}

return Child
```

## 抽象类

1. 抽象描述的是一种抽象的概念，无法被实例化，只能继承。
2. 抽象方法不能在抽象类中实现，只能在抽象类的具体子类中实现，且必须实现。

```ts
abstract class Animal {
  //抽象类 abstract
  name: string
  abstract speak(): void // 抽象方法
}

class Cat extends Animal {
  speak(): void {
    // 抽象方法实现
    console.log('111')
  }
}

class Dog extends Animal {
  speak(): void {
    console.log('222')
  }
}
```

### 抽象类 vs 接口

1. 不同类之间共有的属性或方法，可以抽象成一个接口。
2. 而抽象类是提供其他类继承的基类，抽象类不允许被实例话，抽象类中的抽象方法必须在子类中实现。
3. 抽象类本质是一个无法被实例化的类，其中能够实现方法和初始化属性，而接口仅能用于描述，既不提供方法的实现，也不为属性进行初始化。
4. 一个类可以继承一个类或抽象类，但可以实现多个接口。
5. 抽象类也可以实现接口
