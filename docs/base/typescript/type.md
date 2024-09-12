# TS 中的类型

## 基础类型

### `number` 数字类型

和 `JavaScript` 一样，`TypeScript` 里的所有数字都是浮点数。这些浮点数的类型是 `number`。除了支持十进制和十六进制字面量，`TypeScript` 还支持 `ES6` 中引入的二进制和八进制字面量。

```ts
let decimalism: number = 20
let hexadecimal: number = 0x14
let binarySystem: number = 0b10100
let octalNumberSystem: number = 0o24
```

### `string` 字符串类型

```ts
let name: string = 'steins gate'
```

### `boolean` 布尔类型

布尔类型就是简单的 `true / false` 值

```ts
let isHave: boolean = true
```

### `bigint`

`bigint` 类型表示一个任意精度的整数，它可以用来处理超出 `JavaScript` `number` 类型范围的整数

```ts
let big: bigint = 20212021n
```

### `symbol`

`symbol` 类型表示独一无二的值，其必须通过 `Symbol` 函数生成，常用于创建对象属性的唯一标识符

```ts
let sym: symbol = Symbol('steins gate')
```

### `object`

`object` 类型表示非原始类型，也就是除 `boolean` `string` `number` `bigint` `symbol` `null` `undefined` 之外的类型。

使用 `object` 类型，就可以更好的表示像 `Object.create` 这样的 `API`

```ts
declare function create(o: object | null): void

create({ prop: 18 }) // OK
create(null) // OK

create(18) // Error
create('string') // Error
create(false) // Error
create(undefined) // Error
```

### `any`

在 `TypeScript` 中，任何类型都可以被归为 `any` 类型。这让 `any` 类型成为了类型系统的顶级类型（也被称作全局超级类型）

`TypeScript` 允许我们对  `any`  类型的值执行任何操作，而无需事先执行任何形式的检查

```ts
let notSure: any = 4

notSure.ifItExists() // okay, ifItExists might exist at runtime
notSure.toFixed() // okay, toFixed exists (but the compiler doesn't check)
```

::: warning
在许多场景下，`any`太宽松了，使用 `any` 类型，可以很容易地编写类型正确但在运行时有问题的代码。如果我们使用 `any` 类型，就无法使用 `TypeScript` 提供的大量的保护机制
:::

### `void`

在 `TypeScript` 中，可以用 `void` 表示没有任何返回值的函数

```ts
function warnUser(): void {
  console.warn('This is my warning message')
}
```

### `null` 和 `undefined`

在 `TypeScript` 中，可以使用 `null` 和 `undefined` 来定义这两个原始数据类型

```ts
let u: undefined = undefined
let n: null = null
```

默认情况下 `null` 和 `undefined` 是所有类型的子类型。就是说你可以把 `null` 和 `undefined` 赋值给 `number` 类型的变量。

当编译选项指定了 `--strictNullChecks`（开启严格空值检查模式）时，`null` 和 `undefined` 只允许赋值给自己或 `any` 类型的变量

### `unknown` 未知类型

`unknown` 类型用于描述一个我们还不知道其类型的变量，也是`any`的安全类型。

就像所有类型都可以赋值给  `any`，所有类型也都可以赋值给  `unknown`。这使得  `unknown`  成为 `TypeScript` 类型系统的另一种顶级类型

```ts
let value: unknown

value = true // OK
value = 42 // OK
value = 'Hello World' // OK
value = [] // OK
value = {} // OK
value = Math.random // OK
value = null // OK
value = undefined // OK
value = new TypeError() // OK
value = Symbol('type') // OK
```

> 对  `value`  变量的所有赋值都被认为是类型正确的。但是，当我们尝试将类型为  `unknown`  的值赋值给其他类型的变量时会发生什么？

```ts
let value: unknown

let value1: unknown = value // OK
let value2: any = value // OK
let value3: boolean = value // Error
let value4: number = value // Error
let value5: string = value // Error
let value6: object = value // Error
let value7: any[] = value // Error
let value8: Function = value // Error
```

**<font color="FF9D00">`unknown` 类型只能被赋值给 `any` 类型和 `unknown` 类型本身。</font>**

相比于 `any` 类型不会对变量进行任何检查，对于 `unknown` 类型的变量在执行大多数操作时必须进行相应的检查，因此 `unknown` 类型相对更加严格

### `never`

`never` 类型表示的是那些永不存在的值的类型

`never` 类型的主要用途

- 表示函数不会返回（例如抛出异常或无限循环）。

```ts
function throwError(message: string): never {
  throw new Error(message)
}
```

- 用作类型收窄的检查，确保某个条件分支不会执行（如 switch 的 default 分支）。

```ts
type Animal = 'dog' | 'cat'

function checkAnimal(animal: Animal) {
  switch (animal) {
    case 'dog':
      console.log("It's a dog")
      break
    case 'cat':
      console.log("It's a cat")
      break
    default:
      // 如果代码正常，永远不会到达这里
      const _exhaustiveCheck: never = animal
      break
  }
}
```

- 帮助进行类型检查，确保类型被正确处理。
- 类型推断中的不可能值，如联合类型的过滤

### 数组

在 `TypeScript` 中，数组类型声明有 `类型[]` 以及**泛型**两种形式

通过**类型 + 方括号**定义数组类型：

```ts
// 只允许存储 string 类型
const strArray: string[] = ['1', '2', '3']
// 只允许存储 number 类型
const numArray: number[] = [1, 2, 3]
```

通过**泛型**定义数组类型：

```ts
// 只允许存储 string 类型
const strArray: Array<string> = ['1', '2', '3']
// 只允许存储 number 类型
const numArray: Array<number> = [1, 2, 3]
```

### 元组 `Tuple`

元组`（Tuple）`类型表示一个固定长度的数组，并且已知每项所对应的类型

当对元组类型的数据进行 **越界访问** 或 **分配错误的类型值** 时，`TypeScript` 将报错提示

```ts
const tuple: [string, number] = ['hello', 0]

console.log(tuple[2]) // Error
tuple[0] = 10 // Error
```

### 枚举 `Enum`

`enum` 类型是对 `JavaScript` 标准数据类型的一个补充。

```ts
enum Color {
  Red,
  Green,
  Blue,
}
const c: Color = Color.Green
```

默认情况下，从 `0` 开始为元素编号。你也可以手动的指定成员的数值。例如，我们将上面的例子改成从 `1` 开始编号：

```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}
const c: Color = Color.Green
```

或者全部都采用手动赋值：

```ts
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}
const c: Color = Color.Green
```

枚举类型提供的一个便利是你可以由枚举的值得到它的名字。例如，我们知道数值为 `2`，但是不确定它映射到 `Color` 里的哪个名字，我们可以查找相应的名字：

```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}
const colorName: string = Color[2]

console.log(colorName) // 'Green' 因为上面代码里它的值是 2
```

::: tip 枚举总结

- 都没有初始值时，默认是从 `0` 开始自增
- 当第一个成员初始化赋值为 `10` 时，后面的成员从 `10` 开始增长
- 数字类型的枚举可以映射，字符串类型的枚举不可以映射
  - 当一个枚举都为数字类型时，被赋值的变量可以取超出枚举值的数值
  - 当一个枚举都为字符串类型时，被赋值的变量只能取枚举成员
- 如果第 n 个成员赋值为 `string` 类型时，则 `n` 只后的成员都需要初始化
- `const` 声明的枚举是常量枚举，会在编译后被移除
- 常量枚举会在编译时直接计算出结果，计算类型的枚举会在运行时计算出结果
- 不建议数字类型和字符串枚举混用

:::

## 可辨识联合类型

`TypeScript` 可辨识联合类型，也称为代数数据类型或标签联合类型。

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

在上述代码中，我们分别定义了  `Motorcycle`、 `Car`  和 `Truck` 三个接口，在这些接口中都包含一个  `vType`  属性，该属性被称为可辨识的属性，而其它的属性只跟特性的接口相关。

### 联合类型

联合类型通常与 `null` 或 `undefined` 一起使用：

```ts
const sayHello = (name: string | undefined) => {
  /* ... */
}
```

例如，这里`name`的类型是`string | undefined`意味着可以将`string`或`undefined`的值传递给`sayHello`函数。

```js
sayHello('azzlzzxz')
sayHello(undefined)
```

通过这个示例，你可以凭直觉知道类型 `A` 和类型 `B` 联合后的类型是同时接受 `A` 和 `B` 值的类型。此外，对于联合类型来说，你可能会遇到以下的用法.

```ts
let num: 1 | 2 = 1
type EventNames = 'click' | 'scroll'
```

以上示例中的  `1、2`  或  `'click'`  被称为字面量类型，用来约束取值只能是某几个值中的一个。

### 类型别名

类型别名用来给一个类型起个新名字：

```ts
type Message = string | string[]

let greet = (message: Message) => {
  // ...
}
```

`interface` 和 `type` 的区别：

1. 接口创建了一个新的名字，他可以在其他任意地方被调用，而类型别名并不创建新的名字，例如报错信息就不会使用别名。
2. 类型别名不能被 `extends` 和 `implements`，这时候我们应该尽量使用接口代替类型别名。
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
2. 类型守卫就是能通过关键字(`typeof`，`instanceof`，`in`)来缩小范围，判断出分支中的类型。
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

### `typeof` 关键字

`typeof` 类型守卫只支持两种形式：

1. `typeof v` === `"typename"`
2. `typeof v` !== `"typename"`
   `"typename"`必须是 `number`, `string`, `boolean`, `symbol`，但是 `TS` 不会阻止你与其他类型进行比较，其不回把这些表达式识别为类型守卫

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

### `null` 保护

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

- 声明变量没有赋予值时默认变量是 `any` 类型

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

## 条件类型

条件类型类似于 `JavaScript` 中的三元表达式

```ts
type IsBoolean<T> = T extends boolean ? true : false

type res1 = IsBoolean<string> // false
type res2 = IsBoolean<true> // true
```

### 分布式条件类型

分布式条件类型是条件类型的一个特征，但是分布式有条件类型是有前提的，条件类型里待检查的类型必须是裸类型，对联合类型应用 `extends` 时，会遍历联合类型成员并一一应用该条件类型

```ts
type Exclude<T, U> = T extends U ? never : T

type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'c'> // "b"
```

### `infer`

`infer` 是一个关键字，主要用于条件类型，它允许你在条件类型中推断`（infer）`某个泛型的类型，它会在类型未推导时进行占位，等到真正推导成功后再返回正确的类型

`infer` 一般用于以下形式的条件类型

```ts
T extends SomeType<infer U> ? X : Y
```

这里的 `infer U` 表示在满足 `T extends SomeType<X>`的前提下，推断出 `U` 的类型。`U` 就是推断出来的类型变量

以 `ReturnType<T>` 为例来获取函数返回类型

```ts
type ReturnType<T> = T extends (...args: any) => infer R ? R : any

const add = (a: number, b: number): number => a + b

type Result = ReturnType<typeof add>
// Result: number
```

- 声明泛型变量 `T` 表示一个函数类型
- 声明占位变量 `R`，此时并不确定函数具体返回类型
- 若 `T` 类型为函数类型，则根据函数类型上下文推导出 `R` 具体类型并返回，否则则返回 `any` 类型
- 在上述例子中，`add` 即为返回 `number` 类型的函数，由此推断出 `R` 为 `number`
