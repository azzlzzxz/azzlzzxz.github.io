# 工程规范

## 项目结构

```sh
.
├── .vscode                           # VSCode 配置文件
├── public                            # 网站资源文件（favicon.ico index.html 等）
├── scripts                           # 脚本相关
├── src
│   ├── apis                          # api 接口
│   ├── assets                        # 静态资源
│   ├── components                    # 全局组件
│   ├── config                        # 项目配置文件
│   ├── constants                     # 常量
│   ├── hooks                         # 通用 hooks
│   ├── layout                        # 页面整体布局
│   ├── lib                           # 第三方或无业务依赖代码
│   ├── locales                       # i18n
│   ├── pages                         # 页面相关文件
│   │   ├── Home                      # 大驼峰规范 => 组件即是一个构造函数
│   │   │   ├── components            # 页面相关的子组件
│   │   │   ├── index.module.scss     # 根据应用的 CSS Scope 方案命名
│   │   │   └── index.tsx             # index 作为默认路径，视为根节点
│   │   └── App.tsx                   # 页面入口
│   ├── router                        # 页面路由
│   ├── store                         # 状态管理
│   ├── styles                        # 全局/基础样式
│   ├── types                         # TypeScript 类型声明
│   ├── utils                         # 工具函数
│   └── main.tsx                      # 应用启动入口
├── README.md                         # 当前项目的文档
├── package.json                      # 项目信息
└── tsconfig.json                     # TypeScript 配置文件
```

## ESLint

::: tip ESLint

- 使用 [ESLint](https://eslint.org) 对代码进行语法检查，从而实现代码风格统一。
- `ESLint` 是一个用于识别和报告在 `ECMAScript/JavaScript` 代码中发现的模式的工具，其目标是使代码更加一致并避免错误。
- `ESLint` 是完全插件化的。 每条规则都是一个插件，你可以在运行时添加更多。 你还可以添加社区插件、配置和解析。
  :::

## `.eslintrc` 配置文件示例

```js
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    // 在这里添加你的规则配置
  },
}
```

- `parser`：指定使用的解析器，这里使用 `@typescript-eslint/parser` 解析 `TypeScript` 代码。
- `plugins`：指定要使用的插件，这里使用了 `@typescript-eslint` 插件和 `react` 插件。
- `extends`：指定扩展的规则集，这里使用了一些推荐的规则集，包括 `eslint:recommended`、`plugin:@typescript-eslint/recommended` 和 `plugin:react/recommended`。
- `parserOptions`：解析器选项，包括指定 `ECMAScript` 版本、代码模块类型和启用 `JSX` 支持。
- `env`：指定代码运行的环境，这里设置了 `browser` 和 `node` 环境。
- `rules`：在这里可以添加自定义的规则配置，根据你的需求进行调整。

### `parserOptions`配置

- `ecmaVersion`：指定要解析的 `ECMAScript` 版本。例如，设置为 2021 表示解析 `ECMAScript` 2021 语法。默认值是 5。
- `sourceType`：指定要解析的代码的模块类型。可以是 `"script"`（普通脚本）或 `"module"`（`ECMAScript` 模块）。默认值是 `"script"`。
- `ecmaFeatures`：一个对象，用于启用或禁用特定的 `ECMAScript` 语言特性。常用的选项包括：
  - `jsx`：启用 `JSX` 语法支持。设置为 `true` 表示解析和处理 `JSX` 代码。
  - `globalReturn`：启用全局作用域下的 `return` 语句。默认情况下，`return` 语句只允许在函数内使用。
- `project`：指定 `TypeScript` 项目的 `tsconfig.json`文件路径。这个选项用于告诉 `ESLint` 使用 `TypeScript` 的配置文件来了解项目中的模块和类型信息。
- `extraFileExtensions`：一个数组，用于指定除了默认的文件扩展名之外的其他文件扩展名。这对于处理非标准的文件扩展名（如 `.vue`）或使用了不同的语言（如 `TypeScript` 的 `.ts` 或 `.tsx`）非常有用。

### `rules`配置

```json
{
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
  }
}
```

名称 `"semi"` 和 `"quotes"` 是 `ESLint` 中 [规则](https://eslint.nodejs.cn/docs/latest/rules) 的名称。 第一个值是规则的错误级别，可以是以下值之一：

- `"off"` 或 0 - 关闭规则
- `"warn"` 或 1 - 打开规则作为警告（不影响退出代码）
- `"error"` 或 2 - 打开规则作为错误（退出代码将为 1）

三个错误级别允许你对 `ESLint` 如何应用规则进行细粒度控制

### 使用配置注释

要使用配置注释在文件内配置规则，请使用以下格式的注释：

```js
/* eslint eqeqeq: "off", curly: "error" */
```

在此示例中，[eqeqeq](https://eslint.nodejs.cn/docs/latest/rules/eqeqeq) 被关闭，[curly](https://eslint.nodejs.cn/docs/latest/rules/curly) 被打开作为错误。 你还可以对规则严重性使用数字等价物：

```js
/* eslint eqeqeq: 0, curly: 2 */
```

此示例与上一个示例相同，只是它使用数字代码而不是字符串值。 `eqeqeq` 规则关闭，`curly` 规则设置为错误。
如果规则有其他选项，你可以使用数组字面语法指定它们，例如：

```js
/* eslint quotes: ["error", "double"], curly: 2 */
```

此注释指定
规则的 `“double”` 选项。 数组中的第一项始终是规则严重性（数字或字符串）。

## Prettier

> 使用 [Prettier](https://prettier.io) 对代码进行格式化，从而实现一致的编码风格

```js
module.exports = {
  // 每行代码的最佳长度，超出该长度则格式化
  printWidth: 100,
  // 一个缩进使用 2 个空格
  tabWidth: 2,
  // 缩进使用空格
  useTabs: false,
  // 语句末尾不添加分号
  semi: false,
  // 仅在必需时为对象的 key 添加引号
  quoteProps: 'as-needed',
  // 使用单引号
  singleQuote: true,
  // 在 jsx 中使用双引号
  jsxSingleQuote: false,
  // 不添加尾随逗号
  trailingComma: 'none',
  // 在对象花括号内的两旁添加空格 => { foo: bar }
  bracketSpacing: true,
  // HTML元素（包括 JSX 等）具有多个属性时，将结束标签右尖括号 ＞ 另起一行
  bracketSameLine: false,
  // 箭头函数仅有一个参数时，参数也添加括号 (x) => x
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 对所有文件进行格式化，而不是只对在开头含有特定注释（@prettier 或 @format）的文件进行格式化
  requirePragma: false,
  // 格式化的同时自动插入 @format 的特殊注释（表示该文件已被格式化）
  insertPragma: false,
  // 对 Markdown 文本换行不进行任何操作，保持原样
  proseWrap: 'preserve',
  // 对 HTML 全局空白不敏感
  htmlWhitespaceSensitivity: 'ignore',
  // 不对 vue 中的 script 及 style 标签进行缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf
  endOfLine: 'lf',
  // 自动格式化嵌入的代码内容
  embeddedLanguageFormatting: 'auto',
  // 不强制 html vue jsx 中的属性（具有多个时）单独占一行
  singleAttributePerLine: false,
}
```

- [Options | Prettier](https://prettier.io/docs/en/options.html)
