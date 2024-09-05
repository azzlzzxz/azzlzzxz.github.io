# ESLint 插件开发

`ESLint` 插件是给 `ESLint` 添加额外的规则和插件选项的扩展。插件让你可以自定义 `ESLint` 配置来强制执行不包括在 `ESLint` 核心包中的规则。插件也可以提供额外的环境、自定义处理器和配置。

## 插件命名

每个插件都是以 `eslint-plugin-<plugin-name>` 为名的 `npm` 模块，例如 `eslint-plugin-jquery`。你也可以使用 `@<scope>/eslint-plugin-<plugin-name>` 格式的范围包，如 `@jquery/eslint-plugin-jquery`以及 `@<scope>/eslint-plugin`，如 `@jquery/eslint-plugin`。

## 创建插件

::: tip

- [ESLint 创建插件文档](https://zh-hans.eslint.org/docs/latest/extend/plugins)
- [Yeoman 生成器](https://www.npmjs.com/package/generator-eslint) - 官方推荐使用的创建器
  :::

### 安装脚手架依赖

```sh
npm i -g yo

npm i -g generator-eslint
```

### 使用脚手架创建`Plugin`和`Rule`

```sh
yo eslint:plugin

yo eslint:rule
```

### 文件目录介绍

- `lib/rules` 文件夹下写规则（这里编写我们自定义的`eslint`的规则）
- `lib/index.js` 规则导出及配置项
- `tests/lib/rules` 文件夹下写测试

![eslint](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/eslint.jpg)

## 编写插件规则

::: tip

[ESLint 自定义规则文档](https://zh-hans.eslint.org/docs/latest/extend/custom-rules)
:::

自定义规则的基础格式：

```js
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Description of the rule',
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    return {
      // 回调函数
    }
  },
}
```

### `meta`包含规则的元数据

- `type`：表示规则的类型，是 `"problem"`、`"suggestion"` 或 `"layout"` 其中之一。

  - `"problem"` 该规则正在识别将导致错误或可能导致混乱行为的代码。
  - `"suggestion"` 表示规则是一个建议。
  - `"layout"` 该规则主要关心的是空白、分号、逗号和括号，所有决定代码外观的部分，而不是代码的执行方式。这些规则对代码中没有在 `AST` 中指定的部分起作用。

- `docs`：用于提供规则的文档信息

  - `description`：规则的简要描述。
  - `recommended`：表示在[配置文件](https://zh-hans.eslint.org/docs/latest/use/configure/configuration-files#%E6%89%A9%E5%B1%95%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6) 中是否使用 `"extends"`: `"eslint:recommended"` 属性启用该规则。
  - `url`：规则的详细文档 `URL`

> 在自定义规则或插件中，你可以省略 `docs` 或在其中包含你需要的任何属性。

- `fixable`：一个字符串或布尔值，表示规则是否可自动修复。如果为字符串 `"code"`，表示规则可以自动修复代码。如果为布尔值 `true`，表示规则可以自动修复，但修复可能会有副作用。如果为布尔值 `false`，表示规则不可自动修复

::: tip
`fixable` 属性对于可修复规则是强制性的。如果没有指定这个属性，`ESLint` 将在规则试图产生一个修复时抛出一个错误。如果规则不是可修复的，则省略 `fixable` 属性。
:::

- `hasSuggestions`：指定规则是否可以返回建议（如果省略，默认为 `false`）。

::: tip

`hasSuggestions` 属性对于提供建议的规则来说是强制性的。如果这个属性没有设置为 `true`，`ESLint` 将在规则试图产生建议时抛出一个错误。如果规则不提供建议，省略 `hasSuggestions` 属性。
:::

- `schema`：用于定义规则的配置选项。它可以是一个数组，每个数组项定义一个配置选项。每个配置选项包含以下字段：
  - `enum`：一个数组，表示配置选项的可选值。
  - `type`：配置选项的类型，可以是 `"string"`、`"number"`、`"boolean"`、`"array"`、`"object"` 等。
  - `default`：配置选项的默认值。

> [schema 完整配置](https://zh-hans.eslint.org/docs/latest/extend/custom-rules#%E9%80%89%E9%A1%B9%E6%A8%A1%E5%BC%8F)

- `deprecated`：表示该规则是否已经被废弃。如果规则没有被废除，你可以省略 `deprecated` 属性。

- `replacedBy`：如果是被废弃的规则，指定替代规则。

### `create`

`create`返回一个对象，该对象具有 `ESLint` 调用的方法，在遍历 `JavaScript` 代码的抽象语法树（由 `ESTree` 定义的 `AST`）时 `visit` 节点。

#### `context`上下文对象

> [`context`上下文对象完整配置](https://zh-hans.eslint.org/docs/latest/extend/custom-rules#%E4%B8%8A%E4%B8%8B%E6%96%87%E5%AF%B9%E8%B1%A1)

这里是一些常用的属性：

- `context.sourceCode`：`SourceCode` 对象，可以用它来处理传递给 `ESLint` 的源代码。

> [sourceCode 完整配置](https://zh-hans.eslint.org/docs/latest/extend/custom-rules#%E8%AE%BF%E9%97%AE%E6%BA%90%E4%BB%A3%E7%A0%81)

- `context.options`：此规则[配置选项](https://zh-hans.eslint.org/docs/latest/use/configure/rules)的数组。
- `context.getSourceCode()`：返回一个 `SourceCode` 对象，该对象包含有关源代码的信息，如原始代码、行和列等。
- `context.report()`：用于在代码中生成错误或警告。
  - `message`：问题信息。
  - `node`：（可选的 `object`）与问题有关的 `AST` 节点。如果存在并且没有指定 `loc`，那么该节点的起始位置将作为问题的位置。
  - `loc`：（可选的 `object`）一个指定问题位置的对象。如果同时指定了 `loc` 和 `node`，那么将使用 `loc` 而不是 `node` 的位置。
  - `fix(fixer)`：（可选的 `function`）一个应用修复的函数，以解决这个问题。

> [report 完整配置](https://zh-hans.eslint.org/docs/latest/extend/custom-rules#%E6%8A%A5%E5%91%8A%E9%97%AE%E9%A2%98)

## 单元测试

`ESLint` 提供了 `RuleTester` 实用工具，以方便为规则编写测试。

> [RuleTester 完整配置](https://zh-hans.eslint.org/docs/latest/integrate/nodejs-api#ruletester)

`ruleTester.run` 是 `eslint-plugin-rules` 包中提供的一个方法，用于对 `ESLint` 规则进行单元测试。它是对 `ESLint` 内置的 `RuleTester` 类的封装，并提供了更简洁的语法和更方便的断言方式。

`RuleTester` 类是 `ESLint` 提供的一个辅助工具，用于编写和运行规则的单元测试。它提供了一组方法来模拟代码的解析和检测过程，并验证规则是否正确地应用于代码。 `ruleTester.run` 方法是 `RuleTester` 类的一个实例方法，用于运行规则的单元测试。它接受三个参数：

- `ruleName`：规则的名称，用于标识测试结果。
- `rule`：要测试的规则对象。
- `tests`：一个包含 `valid` 和 `invalid` 属性的对象，用于指定测试用例。

在运行 `ruleTester.run` 方法时，它会自动运行规则并比较实际的错误结果与预期的错误结果。如果实际结果与预期结果不匹配，测试将失败并显示错误信息。 `ruleTester.run` 方法的封装简化了编写规则测试的过程，提供了更直观和简洁的语法，使得编写和运行规则测试变得更加方便和易于理解。

## 写一个`ESLint`规则

我们`react`在日常开发中，写`className`时有可能会在前后或类名与属性之间多出空格影响代码美观，我们可以通过编写`ESLint`规则来修复这个问题。

### 找到你想要约束的代码的`AST`节点

> AST 在线预览 [AST explorer](https://astexplorer.net/)

![eslint_ast](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/eslint_ast.jpg)

### 编写规则

```js
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '解决 className 中间有多余的空格',
    },
    fixable: 'code',
    messages: {
      space: 'className 中间有多余的空格',
    },
    schema: [
      {
        enum: ['always', 'never'],
      },
    ],
  },

  create: function (context) {
    return {
      // 在这个规则中，主要处理 JSXAttribute 节点，它表示 JSX 中的属性
      JSXAttribute: (node) => {
        // 这一行判断当前处理的 JSX 属性是否是 className，如果不是，则直接跳过
        if (node.name.name !== 'className') return
        // 获取 className 属性的值节点
        const classNameValueNode = node.value
        // 获取属性值对应的源码文本
        const text = context.getSourceCode(classNameValueNode).text
        // 提取实际的属性值
        let textValue = classNameValueNode?.value
        // 获取属性值的源码范围，用 start 和 end 分别表示属性值在源码中的起始位置和结束位置
        let [start, end] = classNameValueNode.range
        // 如果 className 属性的值是一个 JSX 表达式容器，那么执行以下操作
        if (node.value.type === 'JSXExpressionContainer') {
          // 调整 start 和 end，以排除 JSX 表达式容器的 {} 符号，只取实际表达式内容的范围
          start += 2
          end -= 2

          // 从源码文本中提取出实际的表达式内容
          textValue = text.slice(start, end)

          // 恢复为完整的表达式内容范围
          start -= 1
          end += 1
        }
        // 正则表达式用于匹配 className 属性值中多余的空
        const reg = /((?<=\S)([ ]{2,})(?=\S))|((?<=[\w\]\}])(\s{2,})(?=\w))/g

        // 如果 className 的属性值中有符合正则的多余空格，或者在值的开头或结尾存在多余的空格
        if (reg.test(textValue) || /^ +| +$/.test(textValue)) {
          // 去掉开头和结尾的空格，并将符合正则的多余空格替换为单个空格。生成新的文本 newText
          const newText = textValue.trim().replace(reg, ' ')

          context.report({
            // 指定问题节点
            node: classNameValueNode,
            // 错误/警告提示信息
            messageId: 'space',
            // 修复
            fix(fixer) {
              return [fixer.replaceTextRange([start + 1, end - 1], newText)]
            },
          })
        }
      },
    }
  },
}
```
