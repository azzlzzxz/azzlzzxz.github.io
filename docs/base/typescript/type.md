# TS 中的类型

## 联合类型

联合类型通常与  null  或  undefined  一起使用：

```ts
const sayHello = (name: string | undefined) => {
  /* ... */
}
```

例如，这里  name  的类型是  string | undefined  意味着可以将  string  或  undefined  的值传递给 sayHello  函数。

```js
sayHello('azzlzzxz')
sayHello(undefined)
```

通过这个示例，你可以凭直觉知道类型 A 和类型 B 联合后的类型是同时接受 A 和 B 值的类型。此外，对于联合类型来说，你可能会遇到以下的用法.

```ts
let num: 1 | 2 = 1
type EventNames = 'click' | 'scroll'
```

以上示例中的  1、2  或  'click'  被称为字面量类型，用来约束取值只能是某几个值中的一个。

## 可辨识联合类型

TypeScript 可辨识联合类型，也称为代数数据类型或标签联合类型。
它包含 3 个要点：

- 可辨识
- 联合类型
- 类型守卫

这种类型的本质是结合联合类型和字面量类型的一种类型保护方法。  
如果一个类型是多个类型的联合类型，且多个类型含有一个公共属性，那么就可以利用这个公共属性，来创建不同的类型保护区块。  
利用联合类型中得公共字段，来进行类型保护的一种技巧。

### 可辨识

可辨识要求联合类型中的每个元素都含有一个单例类型属性，比如:

```ts
enum CarTransmission {
  Automatic = 200,
  Manual = 300,
}

interface Motorcycle {
  vType: 'motorcycle' // discriminant
  make: number // year
}

interface Car {
  vType: 'car' // discriminant
  transmission: CarTransmission
}

interface Truck {
  vType: 'truck' // discriminant
  capacity: number // in tons
}
```

在上述代码中，我们分别定义了  Motorcycle、 Car  和  Truck  三个接口，在这些接口中都包含一个  vType  属性，该属性被称为可辨识的属性，而其它的属性只跟特性的接口相关。

### 联合类型

基于前面定义了三个接口，我们可以创建一个  Vehicle  联合类型：

```ts
type car = Motorcycle | Car | Truck
```

### 类型别名

类型别名用来给一个类型起个新名字：

```ts
type Message = string | string[]

let greet = (message: Message) => {
  // ...
}
```

interface 和 type 的区别：

1. 接口创建了一个新的名字，他可以在其他任意地方被调用，而类型别名并不创建新的名字，例如报错信息就不会使用别名。
2. 类型别名不能被 extends 和 implements，这时候我们应该尽量使用接口代替类型别名。
3. 当我们需要使用联合类型或元组类型的时候，类型别名会更合适。

## 交叉类型

交叉类型是多个类型合并为一个类型。  
这让我们可以吧现有的多种类型叠加到一起成为一种类型，它包含所需的所有类型特性。

```ts
interface A {
  name: string
}
interface B {
  age: number
  c: string
}
type C = A & B
let c: C = { name: 'czp', age: 10, c: 'dog' } // A,B的子类型
let a: A
let b: B

a = c
b = c

type AA = string | number
type BB = string | boolean
type CC = AA & BB //string
```

## 类型守卫

1. 类型守卫就是一些表达式，他们在编译的时候就能通过类型信息确保某个作用域变量的类型。
2. 类型守卫就是能通过关键字(typeof,instanceof,in)来缩小范围，判断出分支中的类型。
3. 类型保护与特性检测并不是完全不同，其主要思想是尝试检测属性、方法或原型，以确定如何处理值。目前主要有四种的方式来实现类型保护。

### in 关键字

```ts
interface User {
  name: string
  password: string
}
interface Info {
  name: string
  date: Date
}
type UserInfo = User | Info

function printUserInfo(val: UserInfo) {
  console.log('Name:' + val.name)
  if ('password' in val) {
    console.log('Password' + val.password)
  }
  if ('date' in val) {
    console.log('Date' + val.date)
  }
}
```

### typeof 关键字

typeof 类型守卫只支持两种形式：

1. typeof v === "typename"
2. typeof v !== "typename"
   "typename"必须是 number, string, boolean, symbol，但是 TS 不会阻止你与其他类型进行比较，其不回把这些表达式识别为类型守卫

```ts
function testType(value: string, data: string | number) {
  if (typeof data === 'number') {
    return Array(data + 1).join('') + value
  }
  if (typeof data === 'string') {
    return value + data
  }
  throw new Error(`Expected string or number, got '${data}'.`)
}
```

### instanceof 关键字

```ts
interface Padder {
  getPaddingString(): string
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(' ')
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value
  }
}

let padder: Padder = new SpaceRepeatingPadder(6)

if (padder instanceof SpaceRepeatingPadder) {
  // padder的类型收窄为 'SpaceRepeatingPadder'
}
```

### 自定义类型守卫的类型谓词

```ts
namespace c {
  interface Bird {
    leg: number //2
  }
  interface Dog {
    leg: number //4
  }

  // 类型谓词： parameterName is Type 那个参数是什么类型 ，parameter必须是函数的参数名
  function isBird(x: Bird | Dog): x is Bird {
    return x.leg === 2 // true  x is Bird 就是true
  }
  function getAnimal(x: Bird | Dog) {
    if (isBird(x)) {
      console.log(x)
    } else {
      console.log(x)
    }
  }
}
```

### null 保护

```ts
function getName(s: string | null) {
  // ts.config 设置strictNull: false
  return s.chartAt(0) // 不会报错

  // ts.config 设置strictNull: true
  return s.chartAt(0) // 报错
}
```

解决方法：

```ts
if (s === null) {
  return ''
}
```

```ts
s = s || ''
```

```ts
return s!.chartAt(0)
```

```ts
// 这种识别不了，回报错
function log() {
  s = s || ''
}
log()
return s.chartAt(0)
```

### 可选链

```ts
// 先检查属性是否存在，再访问属性上的运算符，符号为?
let a = { b: 2 }
let result = a?.b
// a?.b ===> a === null ? undefined : a.b
console.log(result)

let x = 'b'
a?.[x]
// a?.b() // 调方法
// a?.[x]()
```

## 类型推导

- 声明变量没有赋予值时默认变量是 any 类型

```ts
let name // 类型为any
name = 'steins gate'
name = 30
```

- 声明变量赋值时则以赋值类型为准

```ts
let name = 'steins gate' // name被推导为字符串类型
name = 30
```

## 类型推断

### 赋值推断

赋值时推断，类型从右像左流动,会根据赋值推断出变量类型。

```ts
let name = 'steins gate'
let age = 18
let boolean = true
```

### 返回值推断

自动推断函数返回值类型

```ts
function sum(a: string, b: string) {
  return a + b
}
sum('a', 'b')
```

### 函数推断

函数从左到右进行推断

```ts
type Sum = (a: string, b: string) => string
const sum: Sum = (a, b) => a + b
```

### 属性推断

可以通过属性值,推断出属性的类型

```ts
let person = {
  name: 'steins gate',
  age: 18,
}
let { name, age } = person
```

### 类型反推

可以使用`typeof`关键字反推变量类型。

```ts
let person = {
  name: 'steins gate',
  age: 18,
}
type Person = typeof person
```

### 索引访问操作符

```ts
interface IPerson {
  name: string
  age: number
  job: {
    address: string
  }
}
type job = IPerson['job']
```

### 类型映射

```ts
interface IPerson {
  name: string
  age: number
}
type MapPerson = { [key in keyof IPerson]: IPerson[key] }
```
