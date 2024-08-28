# 泛型

## 制定函数参数类型

- 单个泛型

```ts
const getArray = <T>(times: number, val: T): T[] => {
  let result: T[] = []
  for (let i = 0; i < times; i++) {
    result.push(val)
  }
  return result
}
getArray(3, 3) // 3 => T => number
```

- 多个泛型

```ts
function swap<T, K>(tuple: [T, K]): [K, T] {
  return [tuple[1], tuple[0]]
}
console.log(swap(['a', 'b']))
```

## 函数标注的方式

- 类型别名

```ts
type TArray = <T, K>(tuple: [T, K]) => [K, T]
const getArray: TArray = <T, K>(tuple: [T, K]): [K, T] => {
  return [tuple[1], tuple[0]]
}
```

> 可以使用类型别名，但是类型别名不能被继承和实现。一般联合类型可以使用类型别名来声明

```ts
interface IArray {
  <T, K>(typle: [T, K]): [K, T]
}
const getArray: IArray = <T, K>(tuple: [T, K]): [K, T] => {
  return [tuple[1], tuple[0]]
}
```

## 泛型接口

```ts
interface ISum<T> {
  // 这里的T是使用接口的时候传入
  <U>(a: T, b: T): U // 这里的U是调用函数的时候传入
}
let sum: ISum<number> = (a: number, b: number) => {
  // 返回一个字符串
  return 'Result' as any
}

// 在调用这个函数时指定了泛型 U 为 string，并且该函数返回值的类型为 string。
let result = sum<string>(1, 2)
console.log(result) // 输出: "Result" (类型为string)
```

## 默认泛型

```ts
interface IName<T = string> {
  name: T
}
type I = IName
let name1: I = { name: 'zf' }
```

## 类中的泛型

```ts
class MyArray<T> {
  // T => number
  arr: T[] = []
  add(num: T) {
    this.arr.push(num)
  }
  getMaxNum(): T {
    let arr = this.arr
    let max = arr[0]
    for (let i = 1; i < arr.length; i++) {
      let current = arr[i]
      current > max ? (max = current) : null
    }
    return max
  }
}
let myArr = new MyArray<number>()
myArr.add(3)
myArr.add(1)
myArr.add(2)
console.log(myArr.getMaxNum())
```

## 泛型约束

- 泛型必须包含某些属性

```ts
interface IWithLength {
  length: number
}
function getLen<T extends IWithLength>(val: T) {
  return val.length
}
getLen('hello')
```

```ts
const sum = <T extends number>(a: T, b: T): T => {
  return (a + b) as T
}
let r = sum<number>(1, 2)
```

- 返回泛型中指定属性

```ts
const getVal = <T, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key]
}
```
