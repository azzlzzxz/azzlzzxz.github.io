# 模版字符串

模板字符串`（template string）`是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

- 普通字符串

```js
;`my name is steins gate`
```

- 多行字符串

使用模板字符串表示多行字符串时，所有的空格和缩进都会被保留在输出之中。

```js
;`my name is steins gate
 from china`
```

- 字符串中嵌入变量

```js
let name = 'steins gate'`my name is ${name}`
```

- 如果在模板字符串中需要使用反引号，则前面要用反斜杠转义

```js
let greet = `\`Hi\` World!`
```

- 运算符

模板字符串中的运算符与普通字符串中的运算符一样，都是`+`

```js
let name = 'steins gate'
let age = 18`my name is ${name} and i am ${age} years old`
```

- 标签模版

模板字符串的功能它可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串，这被称为`“标签模板”`功能`（tagged template）`

```js
alert`hello`
// 等同于
alert('hello')
```
