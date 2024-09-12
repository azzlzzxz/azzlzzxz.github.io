# TS 内置工具类型

::: tip
[<u>TypeScript 内置工具类型</u>](https://www.typescriptlang.org/docs/handbook/utility-types.html)
:::

## `Awaited<Type>` 获取 `Promise` 的返回值类型

`Awaited<Type>` 可以用来获取 `Promise` 的返回值类型

```ts
type Awaited<T> = T extends Promise<infer U> ? U : T
```

> 举个 🌰

```ts
type result = Awaited<Promise<string>>
// type result = string
```

## `Partial<Type>`可选

`Partial<Type>` 可以将传入的属性由非可选变为可选

```ts
type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

> 举个 🌰

```ts
type result = Partial<{ name: string; age: number }>
// type result = { name?: string; age?: number }
```

> 实现`Partial`递归

```ts
type DeepPartial<T> = {
  [U in keyof T]?: T[U] extends object ? DeepPartial<T[U]> : T[U]
}
```

```ts
  interface Company {
    id: number,
    name: string
  }

  interface Person {
    id: number,
    name: string,
    company: Company
  }

  type PartialPerson = DeepPartial<Person>

  let p: PartialPerson = {
    id: 1,
    name: 'steins gate',
    company: { // company 里的属性也变成可选的了
      ...
    }
  }
```

## `Required<Type>`必选

`Required<Type>` 可以将传入的属性由可选变为必选

```ts
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```

> 举个 🌰

```ts
type result = Required<{ name?: string; age?: number }>
// type result = { name: string; age: number }
```

## `Readonly<Type>`只读

`Readonly<Type>` 可以将传入的属性变为只读

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

> 举个 🌰

```ts
type result = Readonly<{ name: string; age: number }>
// type result = { readonly name: string; readonly age: number }
```

## `Record<Keys, Type>` 构造对象

`Record<Keys, Type>` 可以用来构造对象，第一个参数是属性名，第二个参数是属性值类型

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

> 举个 🌰

```ts
type result = Record<'name' | 'age', string>
// type result = { name: string; age: string }
```

## `Pick<Type, Keys>` 从对象中选取某些属性

`Pick<Type, Keys>` 可以用来选取对象中的某些属性组合成一个新类型，第一个参数是源对象，第二个参数是选取的属性名

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

> 举个 🌰

```ts
interface Person {
  name: string
  age: number
}

type result = Pick<Person, 'name'>
// type result = { name: string }
```

## `Exclude<UnionType, ExcludedMembers>` 从联合类型中排除某些成员

`Exclude<UnionType, ExcludedMembers>` 可以用来从联合类型`UnionType`中排除某些成员，`ExcludedMembers`(即取 `UnionType` 对于 `ExcludedMembers` 的差集）来构造一个新类型，第一个参数是源类型，第二个参数是排除的成员

```ts
type Exclude<T, U> = T extends U ? never : T
```

> 举个 🌰

```ts
type result = Exclude<'a' | 'b' | 'c', 'a'>
// type result = 'b' | 'c'
```

## `Omit<Type, Keys>` 从对象中排除某些属性

`Omit<Type, Keys>` 可以用来从对象中排除某些属性，第一个参数是源对象，第二个参数是排除的属性名

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

> 举个 🌰

```ts
interface Person {
  name: string
  age: number
  address: string
}

type result = Omit<Person, 'name' | 'age'>

let p: result = {
  address: 'china',
}
```

## `Extract<Type, Union>` 从类型中提取某些成员

`Extract<Type, Union>` 可以用来从类型`Type`中提取某些成员，`Union`(即取 `Type` 对于 `Union` 的交集）来构造一个新类型，第一个参数是源类型，第二个参数是提取的成员)

```ts
type Extract<T, U> = T extends U ? T : never
```

> 举个 🌰

```ts
type result = Extract<'a' | 'b' | 'c', 'a'>
// type result = 'a'
```

## `NonNullable<Type>` 从类型中排除 null 和 undefined

`NonNullable<Type>` 可以用来从类型`Type`中排除 null 和 undefined，来构造一个新类型，参数是源类型

```ts
type NonNullable<T> = T extends null | undefined ? never : T
```

> 举个 🌰

```ts
type result = NonNullable<string | number | undefined>
// type result = string | number
```

## `Parameters<Type>` 获取函数参数类型

`Parameters<Type>` 用于获取函数 `Type` 的参数类型组成的元组类型，返回值为一个元组类型，元组类型中包含函数参数类型

```ts
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never
```

> 举个 🌰

```ts
function add(a: number, b: number) {
  return a + b
}

type result = Parameters<typeof add>
// type result = [number, number]
```

## `ConstructorParameters<Type>` 获取构造函数参数类型

`ConstructorParameters<Type>` 用于获取构造函数 `Type` 的参数类型组成的元组类型，返回值为一个元组类型，元组类型中包含构造函数参数类型

```ts
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (
  ...args: infer P
) => any
  ? P
  : never
```

> 举个 🌰

```ts
class Person {
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

type result = ConstructorParameters<typeof Person>
// type result = [string, number]
```

## `ReturnType<Type>` 获取函数返回值类型

`ReturnType<Type>` 用于获取函数 `Type` 的返回值类型。

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```

> 举个 🌰

```ts
function add(a: number, b: number) {
  return a + b
}

type result = ReturnType<typeof add>
// type result = number
```

## `InstanceType<Type>` 获取构造函数实例类型

`InstanceType<Type>` 用于获取构造函数 `Type` 的实例类型。

```ts
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R
  ? R
  : any
```

> 举个 🌰

```ts
class Person {
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

type result = InstanceType<typeof Person>
// type result = Person
```

## `ThisParameterType<Type>` 获取函数的 `this` 参数类型

`ThisParameterType<Type>` 用于获取函数 `Type` 的 `this` 参数类型。

```ts
type ThisParameterType<T> = T extends (this: infer U, ...args: any) => any ? U : unknown
```

> 举个 🌰

```ts
function myFunction(this: { name: string }, age: number) {
  console.log(this.name, age)
}

type ThisType = ThisParameterType<typeof myFunction>
// type ThisType = { name: string }
```

## `OmitThisParameter<Type>` 移除函数的 `this` 参数

`OmitThisParameter<Type>` 用于移除函数 `Type` 的 `this` 参数。

```ts
type OmitThisParameter<T> = unknown extends ThisParameterType<T>
  ? T
  : T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T
```

> 举个 🌰

```ts
function myFunction(this: { name: string }, age: number) {
  console.log(this.name, age)
}

type result = OmitThisParameter<typeof myFunction>
// type result = (age: number) => void
```

## `ThisType<Type>` 设置 `this` 参数类型

`ThisType<Type>`它允许你在对象字面量中定义上下文的 `this` 类型。

值得注意的是，`ThisType<Type>` 并不会改变 `this` 的类型本身，它更多的是一种上下文指示符，用来为 `this` 提供更强的类型支持。但要使用 `ThisType`，你需要在 `tsconfig.json` 中启用 `noImplicitThis` 和 `strict` 选项。

```ts
type ThisType<T> = {}
```

> 举个 🌰

```ts
interface Person {
  name: string
  age: number
}

let personWithMethods: Person & ThisType<Person> = {
  name: 'steins gate',
  age: 18,

  greet() {
    console.log(`Hello, my name is ${this.name}`)
  },

  haveBirthday() {
    this.age++
    console.log(`I am now ${this.age} years old!`)
  },
}

// 设置上下文为 personWithMethods，并使用 this
personWithMethods.greet() // 输出: Hello, my name is steins gate
personWithMethods.haveBirthday() // 输出: I am now 19 years old!
```

## 字符串操作类型

### `Uppercase<StringType>` 将字符串转换为大写字母

```ts
type result = Uppercase<'steins gate'>
// 结果：'STEINS GATE'
```

### `Lowercase<StringType>` 将字符串转换为小写字母

```ts
type result = Lowercase<'STEINS GATE'>
// 结果：'steins gate'
```

### `Capitalize<StringType>` 将字符串的首字母转换为大写字母

```ts
type result = Capitalize<'steins gate'>
// 结果：'Steins gate'
```

### `Uncapitalize<StringType>` 将字符串的首字母转换为小写字母

```ts
type result = Uncapitalize<'Steins Gate'>
// 结果：'steins Gate'
```
