# 函数

## 函数定义

```ts
// (name: string)定义参数
// :void 定义返回值（没有返回值用void）
function hello(name: string): void {
  console.log('hello', name)
}
hello('Steins Gate')
```

## 函数表达式

```ts
type GetName = (firstName: string, lastName: string) => string
const getName: GetName = function (firstName: string, lastName: string): string {
  return firstName + lastName
}

type GetName1 = (firstName: string, lastName: string) => void
const getName1: GetName1 = function (firstName: string, lastName: string): void {}
```

## 可选参数

```ts
// ？表示可选，age这个参数可传可不传
function print(name: string, age?: number): void {
  console.log(name, age)
}

print('Steins Gate', 18)
```

## 默认参数

```ts
// method: string = 'GET'   GET是method的默认参数
function ajax(url: string, method: string = 'GET'): void {
  console.log(url, method)
}
ajax('/')
```

## 剩余参数

```ts
function sum(...numbers: number[]) {
  return numbers.reduce((val, item) => val + item, 0)
}
console.log(sum(1, 2, 3))
```

## 函数重载(overload)

函数重载其实就是： 多个函数函数名相同，函数的参数类型、顺序、个数不同，注意函数重载与返回值类型无关

```ts
// 一个函数有很多传参的方式
let obj: any = {}
//如果穿的val是一个字符串复制给obj.name  如果是数字复制给obj.age

// 函数声明和函数实现要紧密的连在一起
function attr(val: string): void // 函数声明
function attr(val: number): void
function attr(val: any): void {
  // 函数实现
  if (typeof val === 'string') {
    obj.name = val
  } else if (typeof val === 'number') {
    obj.age = val
  }
}
attr('Steins Gate')
attr(12)
// attr(true) // 报错
```

```ts
function add1(a: string | number, b: string | number): void {}

add1('a', 'b')
add1(1, 2)
add1(1, 'b') // 约束不了a,b的传参只能同时是string｜number

// 控制a，b只能是string或number
function add(a: string, b: string): void
function add(a: number, b: number): void
function add(a: string | number, b: string | number): void {}

add('a', 'b')
add(1, 2)
// add(1,'b') //报错
```

## 函数重写

子类重写继承父类的方法

```ts
class Father {
  static fatherName: string = 'fatherName'
  toString() {
    console.log('father')
  }
}

class Child extends Father {
  static childName: string = 'childName'

  //子类的方法可以和父类方法重名，但子类方法回覆盖父类方法
  // 父类调用不了子类方法，子类可以调用父类方法
  toString() {
    super.toString() //调用父类的toString方法
    console.log('child')
  }
}
```

## 函数的协变与逆变
