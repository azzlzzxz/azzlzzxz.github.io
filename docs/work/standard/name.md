# 命名规范

命名规范是编程规范中最重要的一部分，它直接影响到代码的可读性和可维护性。

::: tip 常用的命名形式

- `camelCase` 小驼峰式命名法（首字母小写）
- `PascalCase` 大驼峰式命名法（首字母大写）
- `snake_case` 下划线命名法
- `kebab-case` 短横线命名法
- `UPPER_CASE` 大写命名法

:::

## 代码命名规范

### 变量命名

- 使用小驼峰命名法 `(camelCase)`：首字母小写，后面每个单词的首字母大写

```js
let myVariable = 'value'
let totalPrice = 100
```

- 变量名应该简洁明了，反映其实际用途或含义。避免使用无意义的名称，比如 `a`、`b`。
- 禁止使用 `JavaScript` 的保留关键字（如 `class`、`if`、`let` 等）作为变量名。

### 常量命名

- 使用 全大写字母和下划线分隔 `(UPPER_CASE_SNAKE_CASE)` 来命名常量。常量值在代码执行期间不会改变。

```js
const MAX_COUNT = 10
const API_URL = 'https://api.example.com'
```

### 函数命名

- 使用小驼峰命名法 `(camelCase)`：首字母小写，后面每个单词的首字母大写。函数名应该反映其功能或目的。

```js
function calculateTotal() {
  /* ... */
}
function fetchData() {
  /* ... */
}
```

### 类命名

- 使用大驼峰命名法 `(PascalCase)`：每个单词的首字母大写，用于定义类。

```js
class UserProfile {
  /* ... */
}
```

### 枚举命名

- 大驼峰式命名法 `(PascalCase)` 来命名枚举，枚举值应该反映其含义或含义，枚举的成员使用 全大写字母和下划线分隔。

```js
const Colors = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
}
```

### `Boolean` 变量命名

- 以 `is`、`has`、`can`、`should` 等开头，表示变量的布尔值状态。

```js
let isValid = true
let hasData = false
let canSubmit = true
```

### 对象命名

- 对象名称通常使用小写字母开头的小驼峰命名法

```js
const userProfile = {
  name: 'steins gate',
  age: 18,
}
```

- 如果对象名表示一种构造函数或类，应使用大驼峰 `(PascalCase)`，即每个单词的首字母都大写：

```js
function UserProfile(name, age) {
  this.name = name
  this.age = age
}

const user = new UserProfile('steins gate', 18)
```

- 对象 `key` 使用小驼峰式命名法

```js
const user = { userName: 'steinsgate' }
```

- 如果对象的内容代表一些不变的值（如配置或常量），对象名应使用 全大写字母和下划线分隔 `(UPPER_CASE_SNAKE_CASE)`：

```js
const API_SETTINGS = {
  BASE_URL: 'https://api.example.com',
  TIMEOUT: 5000,
  RETRY_COUNT: 3,
}
```

### `HTML` 标签属性命名规范

- `html` 标签属性使用短横线命名法。

```html
<div class="user-detail" data-index="0"></div>
```

### `CSS` 命名规范

- 类名使用短横线命名法。

```css
.user-info
```

- `ID` 使用小驼峰式命名法。

```css
#userInfo
```

-自定义变量使用短横线命名法。

```css
--main-color: #fff;
```

## 文件命名规范

- 项目名称使用短横线命名法。
- 文件夹名称使用短横线命名法。
- `html` / `css` / `md` / `js` / `ts` / `jsx` / `tsx` 文件使用短横线命名法。
- `React` / `Vue` 组件文件使用大写驼峰式命名法。
- 静态资源文件使用短横线命名法。
