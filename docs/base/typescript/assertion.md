# 断言

## 类型断言

可以用来手动指定一个值的类型。

### 尖括号语法

```ts
let someValue: any = 'this is a string'
let strLength: number = (<string>someValue).length
```

### as 语法

```ts
let someValue: any = 'this is a string'
let strLength: number = (someValue as string).length
```

## 非空断言

在上下文中当类型检查无法断定类型时，!后缀操作符可以用于断言操作对象是非 null 和非 undefined 类型，具体而言，x!将从 x 值域中排除 null 和 undefined

### 忽略 undefined 和 null 类型

```ts
function ignoreFunc(maybeString: string | undefined | null) {
  // Type 'string | null | undefined' is not assignable to type 'string'.
  // Type 'undefined' is not assignable to type 'string'.
  const onlyString: string = maybeString // Error

  const const ignoreUndefinedAndNull: string = maybeString!; // Ok
}
```

### 调用函数时忽略 undefined 类型

```ts
type num = () => number
function ignoreFunc(countFn: num | undefined) {
  // Object is possibly 'undefined'.(2532)
  // Cannot invoke an object which is possibly 'undefined'.
  const numOne = countFn() // Error

  const numTwo = countFn!() // OK
}
```

因为!非空断言操作符会从编译生成的 JavaScript 代码中移除，所以在实际使用的过程中，要特别注意。比如下面这个例子：

```ts
const a: number | undefined = undefined
const b: number = a!
console.log(b)
```

以上 TS 代码会编译生成一下 ES5 代码：

```ts
'use strict'
const a = undefined
const b = a
console.log(b)
```

虽然在 TS 代码中，我们使用了非空断言，使得 const b: number = a!; 语句可以通过 TS 类型检查器的检查。但在生成的 ES5 代码中，! 非空断言操作符被移除了，所以在浏览器中执行以上代码，在控制台会输出 undefined

### 确定赋值断言

确定赋值断言，即允许在实例属性和变量声明后面放置一个 !  号，从而告诉 TS 该属性会被明确地赋值。为了更好地理解它的作用，我们来看个具体的例子：

```ts
let x: number

initialize()

console.log(2 * x) // Error Variable 'x' is used before being assigned.

function initialize() {
  x = 10
}
```

很明显该异常信息是说变量 x 在赋值前被使用了，要解决该问题，我们可以使用确定赋值断言：

```ts
let x!: number

initialize()

console.log(2 * x) // 20

function initialize() {
  x = 10
}
```

通过  let x!: number;  确定赋值断言，TS 编译器就会知道该属性会被明确地赋值。
