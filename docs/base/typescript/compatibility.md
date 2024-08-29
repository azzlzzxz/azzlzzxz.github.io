# TS 的兼容性

TS 中的兼容性，主要看结构是否兼容。

## 基本数据类型的兼容性

```ts
let num: string | number
let str: string = 'sxx'
num = str
```

```ts
let num2: {
  toString(): string
}
let str2: string = 'zz'
num2 = str2
```

## 接口兼容性

如果传入的变量和声明的类型不匹配，TS 就会进行兼容性检查，就是说只要目标类型中声明的属性变量在源类型中都存在就是兼容的。

```ts
interface IAnimal {
  name: string
  age: number
}
interface IPerson {
  name: string
  age: number
  address: string
}
let animal: IAnimal
let person: IPerson = {
  name: 'steins gate',
  age: 29,
  address: '休斯顿',
}
animal = person
```

> 接口的兼容性，只要满足接口中所需要的类型即可！

## 函数兼容性

- 比较参数
  赋值函数的参数要少于等于被赋值的函数，与对象相反。

```ts
type Func = (a: number, b: number) => void
let sum: Func

function f1(a: number, b: number): void {}
sum = f1

// 少一个参数可以
function f2(a: number): void {}
sum = f2

//少两个参数也可以
function f3(): void {}
sum = f3

//多一个不行 因为多的那个参数接收不到
function f4(a: number, b: number, c: number): void {}

// sum = f4
```

- 比较返回值

```ts
type sum1 = () => string | number
type sum2 = () => string

let fn1: sum1
let fn2!: sum2
fn1 = fn2
```

## 类的兼容性

```ts
class Person {
  name: string = 'steins gate'
  age: number = 18
}
class Person1 {
  name: string = 'steins gate'
  age: number = 19
}
let person: Person = new Person1()
```

> 这里要注意的是，只要有 private 或者 protected 关键字类型就会不一致；但是继承的类可以兼容。

```ts
class Father {
  protected name: string = 'steins gate'
  age: number = 18
}
class Child extends Father {}
let child: Father = new Child()
```

## 泛型兼容性

```ts
interface I<T> {}

let obj1: I<string>

let obj2!: I<number>

obj1 = obj2
```

## 枚举的兼容性

```ts
enum USER1 {
  role = 1,
}
enum USER2 {
  role = 1,
}
let user1!: USER1
let user2!: USER2

user1 = user2 // 错误语法
```

> 不同的枚举类型不兼容
