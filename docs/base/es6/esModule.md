# 模块化

::: tip 什么是模块化?

模块化`（Modularity）`是一种软件设计原则，指将一个大的系统或程序分解为相对独立、可管理的小部分（模块），这些模块可以各自独立开发、测试、维护，并可以组合在一起形成更大的系统。

模块化的优点：

- 提高代码复用性
- 便于维护和更新
- 增强可扩展性
- 避免命名空间的冲突
- 更好的分离，实现按需加载
  :::

目前前端主流的模块规范是

- [<u>CommonJS</u>](/node/norm/commonJs.md)
- ESModule
- AMD
- CMD
- UMD

## `ESModule`

`ESModule` 是 `ES6` 在语言标准的层面上实现的模块功能，主要由 `export` 和 `import` 构成

- `export` 命令用于规定模块的对外接口
- `import` 命令用于输入其他模块提供的功能

一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。

### `ESModule` 与 `CommonJS` 的区别

- `CommonJS` 是动态语法可以写在判断里，`ESModule` 静态语法只能写在顶层

- `CommonJS` 模块输出的是一个值的拷贝，`ESModule`输出的是值的引用。

  - `CommonJS` 模块一旦输出一个值模块内部的变化就影响不到这个值
  - `ESModule` 模块在 `JavaScript` 引擎对脚本静态分析时，遇到模块加载命令 `import`，就会生成一个只读引用，等到脚本真正执行时再根据这个只读引用到被加载的那个模块里面去取值(`ESModule` 是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块)

- `CommonJS` 模块是运行时加载，`ESModule`是编译时输出接口。
  - `CommonJS` 加载的是一个对象（即 `module.exports` 属性），该对象只有在脚本运行完才会生成
  - `ESModule` 不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成
- `CommonJS` 模块的`require()`是同步加载模块，`ESModule`的`import`命令是异步加载，有一个独立的模块依赖的解析阶段

- 顶层的 `this` 指向不同
  - `CommonJS` 模块中的顶层 `this` 指向模块本身
  - `ESModule` 模块中的顶层 `this` 指向 `undefined`

::: tip 相关资料

- [阮一峰 ES6 模块与 CommonJS 模块的差异](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)
- [阮一峰 ES6 模块](https://es6.ruanyifeng.com/#docs/module)
- [JavaScript 模块 --MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)
- [export --MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)
- [import --MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)
  :::
