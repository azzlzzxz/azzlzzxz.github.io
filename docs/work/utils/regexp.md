# 常用的正则

> 记录开发中的一些常用正则

## 验证

### 是否是金额（精确到分）

```js
const MONEY_PATTERN = /^(0|([1-9]\d*))(\.\d{1,2})?$/
```

> 更严格

```js
const MONEY_PATTERN =
  /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
```

### 是否是手机号

```js
const MOBILE_PATTERN = /^1\d{10}$/
```

```js
const MOBILE_PATTERN = /^1[3-9]\d{9}$/
```

### 是否是邮箱号

```js
const EMAIL_PATTERN = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
```

> 更严格的邮箱正则 —— [参考 MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/email#%E5%9F%BA%E6%9C%AC%E9%AA%8C%E8%AF%81)

```js
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
```

### 是否是 QQ 号

```js
const QQ_NUMBER_PATTERN = /^[1-9]{1}\d{4,11}$/
```

### 是否是链接地址

```js
const URL_PATTERN =
  /^(https|http):\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
```

### 是否是身份证号码

```js
const ID_CARD_NUMBER_PATTERN =
  /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
```

### 是否是 16 进制颜色

```js
const HEX_COLOR_PATTERN = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
```

## 格式相关

### 隐藏手机号中间 4 位

```js
const pattern = /(\d{3})\d{4}(\d{4})/
```

> 举 🌰 ：

```js
'15512341234'.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
```

### 数字千分位格式化

```js
const pattern = /(\d)(?=(\d{3})+\.)/g
```

> 举 🌰 ：

```js
'5201314.1314'.replace(/(\d)(?=(\d{3})+\.)/g, '$1,') // '5,201,314.1314'
```

**保留两位小数**：

```js
const pattern = /(\d)(?=(\d{3})+\.)/g
```

> 举 🌰 ：

```js
;(5201314.1314).toFixed(2).replace(/\B(?=(\d{3})+\b)/g, ',') // '5,201,314.13'
```

::: tip

[<u>JS 正则表达式完整教程</u>](https://juejin.cn/post/6844903487155732494)
[<u>JS 正则迷你书</u>](https://github.com/qdlaoyao/js-regex-mini-book)

:::
