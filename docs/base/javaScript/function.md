# 函数式编程

## 纯函数

- 对于相同的输入，总是会得到相同的输出
- 在执行过程中没有语义上可观察的副作用

:::tip
输入只能够以参数形式传入，输出只能够以返回值形式传递，除了入参和返回值之外，不以任何其它形式和外界进行数据交换的函数。
:::

### 副作用

函数副作用指当调用函数时，除了返回可能的函数值之外，还对主调用函数产生附加的影响

> 如果一个函数除了计算之外，还对它的执行上下文、执行宿主等外部环境造成了一些其它的影响，那么这些影响就是所谓的”副作用”。

## 函数的`纯`与`不纯`

`纯`的本质——有且仅有【显式数据流】

### 显示数据流

纯函数：输入输出数据流全是显式`（Explicit）`的函数

显示数据流：显式数据流意味着函数除了入参和返回值之外，不以任何其它形式与外界进行数据交换。

`不纯`的元凶——隐式数据流，代表着函数和外界存在数据交换。

## 函数是一等公民

> 如果一门编程语言将函数当做一等公民对待，那么这门语言被称作“拥有头等函数

- 可以被当作参数传递给其他函数
- 可以作为另一个函数的返回值
- 可以被赋值给一个变量

## 不可变的值，可变的引用内容

值类型的数据无法被修改，像数字类型这样，自创建起就无法再被修改的数据，我们称其为`不可变数据`。

```js
let a = 1
let b = a

// true
a === b

b = 2

// false
a === b
```

创建后仍然可以被修改的数据，我们称其为`可变数据`。

```js
const a = {
  name: 'xiuyan',
  age: 30,
}

const b = a

// true
a === b

b.name = 'youhu'

// true
a === b
```

## 如何实现不可变数据

要想写出好的函数式代码，就需要确保数据的不可变性。

### const

`const` 只能够保证值类型数据的不变性，却不能够保证引用类型数据的不变性。

```js
const price = 10

price = 20 // Uncaught TypeError: Assignment to constant variable.
```

`const` 生下来就是专门阻止你做 `reassign` 这个动作的，但对于引用类型来说，就算堵住了 `reassign`，也不影响我们修改数据的内容，因此，对于存储值类型数据的变量来说，`const` 确实能够确保其内容的不变性。

```js
const my = {
  name: 'steins gate',
  age: 28,
}

// 这一行不会报错
me.age = 18

console.log(my)
```

### 拷贝

拷贝的目的：确保外部数据的只读性。

对于函数式编程来说，函数的外部数据是只读的，函数的内部数据则是可写的。

对于一个函数来说，”外部数据“可以包括全局变量、文件系统数据、数据库数据、网络层数据等。有且仅有这些外部数据，存在【只读】的必要。

> 注：由于纯函数只能通过参数获取数据，因此如果需要使用外部数据，就必须将其作为参数传递给函数。

### Immutable.js

持久化数据结构的精髓同样在于“数据共享”。

数据共享意味着将“变与不变”分离，确保只有变化的部分被处理，而不变的部分则将继续留在原地、被新的数据结构所复用。

不同的是，在 git 世界里，这个“变与不变”的区分是文件级别的；而在 Immutable.js 的世界里，这个“变与不变”可以细化到数组的某一个元素、对象的某一个字段。

举个 🌰：

```js
const dataA = Map({
  do: 'coding',
  age: 333,
  from: 'a',
  to: 'b',
})
```

```js
// 使用 immutable 暴露的 Api 来修改 baseMap 的内容
const dataB = dataA.set({
  age: 33.3,
})
```

![Immutable](images/Immutable.jpg)