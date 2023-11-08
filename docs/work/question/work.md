# 问题/解决方式记录

## import 引入的方法 is not a function

:::tip
问题描述：
项目开发中遇到模块导入后使用其中的方法，报错 ❗️

```js
import { a, b, c } from 'z'

a.sum()
```

改成这样就不报错 😱

```js
import { b, c } from 'z'
import { a } from 'z'

a.sum()
```

:::

`引用一段话来描述这个问题：`

**<font color="FF9D00">ES6 模块是动态引用，如果使用 import 从一个模块加载变量（即 import foo from 'foo'），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。</font>**
