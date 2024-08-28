# 接口

接口可以在面向对象编程中表示行为的抽象，也可以描述对象的形状。 接口的作用就是为这些类型命名。 (接口中不能含有具体的实现逻辑)

## 描述对象的形状

```typescript
interface Speakable {
  name: string
  speak(): void
}

let speakMan: Speakable = {
  name: 'czp',
  speak() {},
}
```

## 对象接口

```ts
interface IMessage {
  readonly name: string
  height: string
}
interface IMessage {
  age?: number
  hooby: 'book' | 'movement'
}
const tomato: IMessage = {
  name: 'steins gate',
  height: '180',
  hooby: 'book',
}
tomato.name = 'Steel chain' // 仅读属性不能进行修改
```

> ？标识的属性为可选属性, readOnly 标识的属性则不能修改。多个同名的接口会自动合并

```ts
const tomato: IMessage = {
  name: 'steins gate',
  height: '180',
  hooby: 'book',
  type: 'Humans',
} as IMessage // 多余的属性可以使用类型断言
```

## 函数接口参数

```ts
const fullName = ({ firstName, lastName }: { firstName: string; lastName: string }): string => {
  return firstName + lastName
}
```

> 我们可以约束函数中的参数，但是类型无法复用

```ts
interface IFullName {
  firstName: string
  lastName: string
}

const fullName = ({ firstName, lastName }: IFullName): string => {
  return firstName + lastName
}
```

> 我们可以通过接口进行描述

## 函数类型接口

通过接口限制函数的参数类型和返回值类型

```ts
interface IFullName {
  firstName: string
  lastName: string
}

interface IFn {
  (obj: IFullName): string
}

const fullName: IFn = ({ firstName, lastName }) => {
  return firstName + lastName
}
```

## 函数混合类型

```ts
interface ICounter {
  (): number // 限制函数类型
  count: 0 // 限制函数上的属性
}
let fn: any = () => {
  fn.count++
  return fn.count
}
fn.count = 0
let counter: ICounter = fn
console.log(counter()) // 1
console.log(counter()) // 2
```

## 任意属性、可索引接口

```ts
interface Person {
  name: string
  [key: string]: any
}
let p: Person = {
  name: 'steins gate',
  age: 29,
  [Symbol()]: '炼金术士',
}
```

> 任意属性可以对某一部分必填属性做限制，其余的可以随意增减

```ts
interface IArr {
  [key: number]: any
}
let p: IArr = {
  0: '1',
  1: '2',
  3: '3',
}
let arr: IArr = [1, 'a', 'b']
```

> 可索引接口可以用于标识数组

## 类接口

抽象类和接口的区别：抽象类中可以包含具体方法实现，接口中不能包含实现。

```ts
interface Speakable {
  name: string
  speak(): void
}
interface ChineseSpeakable {
  speakChinese(): void
}
class Speak implements Speakable, ChineseSpeakable {
  name!: string
  speak() {}
  speakChinese() {}
}
```

**<font color="FF9D00">一个类可以实现多个接口，在类中必须实现接口中的方法和属性。</font>**

## 接口继承

```ts
interface Speakable {
  speak(): void
}
interface SpeakChinese extends Speakable {
  speakChinese(): void
}
class Speak implements SpeakChinese {
  speakChinese(): void {
    throw new Error('Method not implemented.')
  }
  speak(): void {
    throw new Error('Method not implemented.')
  }
}
```
