# 模块和命名空间

## 全局模块

1. 在默认情况下，当你开始一个新的 `ts` 文件中写代码是，它处于全局命名空间中。
2. 使用全局变量空间是危险的，因为它会与文件内的代码命名冲突，我们推荐使用文件模块 。

## 文件模块

文件模块也被称为外部模块，如果在你的`ts`文件的跟级别位置含有`important`或`export`，那么它会在这个文件中创建一个本地的作用域。

```ts
// a.ts导出
export default 'steins gate'

// index.ts导入
import name from './a'
```

## 命名空间

命名空间可以用于组织代码，避免文件内命名冲突

```ts
export namespace people {
  export class Person {
    eat() {
      console.log('person')
    }
  }
}
export namespace work {
  export class Person {
    eat() {
      console.log('work person')
    }
  }
}

let person_of_people = new people.Person()
person_of_people.eat()

let person_of_work = new work.Person()
person_of_work.eat()
```

命名空间嵌套

```ts
export namespace people {
  export class Person {
    eat() {
      console.log('people person')
    }
  }
  export namespace sleep {
    export const name = 'sleep'
  }
}
console.log(people.sleep.name)
```
