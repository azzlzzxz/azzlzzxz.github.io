# 装饰器

## 类装饰器

类装饰器在类声明之前声明，用来监视、修改和替换类的定义。

```ts
function addNameEat(constructor: Function) {
  // 当拿一个函数装饰类时，参数就是类的构造函数
  constructor.prototype.name = 'sxx'
  constructor.prototype.age = function () {}
}

@addNameEat
class Person {
  // 对修饰器的实验支持功能在将来的版本中可能更改。
  // 在 "tsconfig" 或 "jsconfig" 中设置 "experimentalDecorators" 选项以删除此警告。
  name: string
  eat: Function
  constructor() {}
}

let p: Person = new Person()
console.log(p.name)
p.eat()
```

## 类装饰器工厂(装饰器模式)

```ts
function addNameEatFactory(name: string) {
  return function (x: Function) {
    x.prototype.name = name
    x.prototype.age = function () {}
  }
}

@addNameEatFactory('handsome') // 当想通过装饰器传参，可以使用类装饰器工厂
class Person {
  name: string
  eat: Function
  constructor() {}
}

let p: Person = new Person()
console.log(p.name)
p.eat()
```

## 替换类

```ts
// 可以多，但不能少（ts核心）
// ts目标类型安全
namespace c {
  function replaceClass(constructor: Function) {
    return class {
      // 返回新的类来替换老的类
      name: string
      eat: Function
      age: number // 新增属性是可以的，但是不能缺少原来类所有的属性
      constructor() {}
    }
  }

  @replaceClass
  class Person {
    name: string
    eat: Function
    constructor() {}
  }

  let p: Person = new Person()
  console.log(p.name)
}
```

## 属性装饰器(装饰属性、装饰方法)

1. 属性装饰器在运行时可能会被当作函数被调用，它可能传入以下参数:
   `target` 如果装饰的是实例属性的话，`target` 是构造函数的原型
   `propertyKey`

```ts
function upperCase(target: any, propertyKey: string) {
  console.log(target, propertyKey, target[propertyKey])
  let value = target[propertyKey]
  const getter = () => value
  const setter = (newValue: string) => (value = newValue.toUpperCase())
  if (delete target[propertyKey]) {
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true, //可枚举
      configurable: true, //可配置
    })
  }
}

//target 如果装饰的是静态属性的话，target是构造函数本身
function staticPropertyDecorator(target: any, propertyKey: string) {
  console.log(target, propertyKey)
}

// PropertyDescriptor 属性描述器
function noEnumerable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log(target, propertyKey)
  descriptor.enumerable = false // 变成不可枚举
}

function toNumber(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  let oldMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    args = args.map((item) => parseFloat(item))
    return oldMethod.apply(this, args)
  }
}

class Person {
  @upperCase
  name: string = 'sxx' // 实例属性
  @staticPropertyDecorator
  static age: number = 26 // 静态属性
  @noEnumerable
  getName() {
    // 实例方法
    console.log(this.name)
  }
  @toNumber
  sum(...args: any[]) {
    // 实例方法
    return args.reduce((accu: number, item: number) => accu + item, 0)
  }
}

let p = new Person()
console.log(p.name)
console.log(p.sum('1', '2', '3')) // 不使用装饰器，sum返回0123
```

## 参数装饰器

1. 用处，在 `IOC` 容器里大放异彩，`Nest.js` 大量用到了参数装饰器

```ts
// target 静态成员就是构造函数，非静态成员就是构造函数的原型 methodName 方法名称 paramIndex参数索引
function addAge(target: any, methodName, paramIndex: number) {
  console.log(target, methodName, paramIndex)
  target.age = 10
}

class Person {
  age: number
  login(username: string, @addAge password: string) {
    console.log(this.age, username, password)
  }
}

let p = new Person()
p.login('1', '2')
```

## 装饰器的执行顺序

执行顺序规律:

1. 类装饰器最后执行，后写的类装饰器先执行
2. 方法装饰器和参数中的装饰器，先执行参数装饰器（位置靠后的参数装饰器先执行），再执行方法装饰器
3. 方法和属性装饰器，先走属性装饰器

规律：一般从内往外执行 （先内后外）
类比 `react componentDidMount` 先上后下 先内后外

```ts
function ClassDecorator1() {
  return function (target: any) {
    console.log('ClassDecorator1')
  }
}

function ClassDecorator2() {
  return function (target: any) {
    console.log('ClassDecorator2')
  }
}

function PropertyDecorator(name: string) {
  return function (target: any, propertyKey: string) {
    console.log('PropertyDecorator', propertyKey, name)
  }
}

function MethodDecorator() {
  return function (target: any, propertyKey: string) {
    console.log('MethodDecorator', propertyKey)
  }
}

function ParameterDecorator() {
  return function (target: any, methodName, index: number) {
    console.log('ParameterDecorator', methodName, index)
  }
}

@ClassDecorator1()
@ClassDecorator2()
class Person {
  @PropertyDecorator('name')
  name: string = ''
  @PropertyDecorator('age')
  age: number = 10
  @MethodDecorator()
  hello(@ParameterDecorator() p1: string, @ParameterDecorator() p2: string) {}
}
```
