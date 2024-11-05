# CSS 基础知识

## `CSS` 语法规则

![css_rule](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/css_rule.jpg)

## `CSS` 三大特性

- 继承：即子类元素继承父类的样式。
- 优先级：是指不同类别样式的权重比较。
- 层叠：是说当数量相同时，通过层叠(后者覆盖前者)的样式执行。

## `CSS` 选择器

### 选择器种类

- 元素选择器

```css
p {
  color: red;
}
```

- 类选择器

```css
.class {
  color: red;
}
```

- ID 选择器

```css
#id {
  color: red;
}
```

- 属性选择器（属性选择器可以根据元素的属性及属性值来选择元素）

```css
*[title] {
  color: red;
}
```

- 后代选择器（后代选择器可以选择作为某元素后代的元素）

```css
h1 em {
  color: red;
}
```

- 子元素选择器（子元素选择器只能选择作为某元素子元素的元素）

```css
h1 > strong {
  color: red;
}
```

- 相邻兄弟选择器（相邻兄弟选择器可选择紧接在另一元素后的元素，且二者有相同父元素）

```css
h1 + p {
  margin-top: 50px;
}
```

- 伪元素选择器

伪元素即伪元素选择器，**是通过元素内部创造假的元素**，其不能匹配任何真实存在的 `html` 元素，使用双冒号（`::`）语法

> 由于旧版本的 `W3C` 规范没有做约束，所以在绝大多数的浏览器中都同时支持双冒号和单冒号的写法

::: details 常用的伪元素选择器

- [<u>`::before`</u>](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::before) 在选定元素的第一个子元素前插入内容
- [<u>`::after`</u>](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::after) 在选定元素的最后一个子元素后插入内容
  - 都默认为行内元素
  - 都需要 [<u>`content`</u>](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content) 属性配合（用于指定要插入的内容）
  - 都不能应用在替换元素上， 比如 `<img />` 或 `<br />` 元素
- [<u>`::first-line`</u>](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-line) 为块级元素第一行指定样式
  - 只能在块元素中使用（即 `display` 属性为这些值： `block`、`inline-block`、`table-cell`、`list-item` 或 `table-caption`）
- [<u>`::first-letter`</u>](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-letter) 为块级元素第一行的第一个字符指定样式
  - 只能在块元素中使用（同 `::first-line`）
- [<u>`::selection`</u>](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::selection) 为文档中被用户选中或处于高亮状态的部分指定样式
  - 仅这些样式可用：`color`、`background-color`、`cursor`、`caret-color`、`outline`、`text-decoration`、`text-emphasis-color`、`text-shadow`
- [<u>`::placeholder`</u>](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::placeholder) 为一个表单元素的占位文本指定样式

:::

- 伪类选择器

伪类即伪类选择器，**表示元素的某种状态**，使用单冒号（`:`）语法

::: details 常用的伪类选择器

- 用户行为伪类
  - [`:hover`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:hover) 手型经过伪类，鼠标经过时触发（主要使用在 `PC` 端，移动端也可以使用但消失不敏捷，体验不太好）
  - [`:active`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:active) 激活状态伪类，元素被点击时触发（主要用于点击反馈，键盘访问无法触发）
  - [`:focus`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus) 焦点伪类，元素处于聚焦状态时触发（其只能匹配特定的元素）
    - 非 `disabled` 状态的表单元素，如 `<input>`
    - 包含 `href` 属性的 `<a>` 元素
    - `＜area>` 元素（可以生效的 `CSS` 属性有限）
    - `<summary>` 元素
    - 设置了 `tabindex` 属性的普通元素
  - [`:focus-within`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus-within) 整体焦点伪类，在当前元素或其任意其子元素处于聚焦状态时触发
- `URL` 定位伪类
  - [`:link`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:link) 链接历史伪类，匹配页面上 `href` 属性没有被访问过的 `<a>` 元素
  - [`:any-link`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:any-link) 超链接伪类，匹配每一个有 `href` 属性的 `<a>`、`<area>` 或 `<link>` 元素
  - [`:target`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:target) 目标伪类，匹配锚点定位的元素（`url` 上 `hash` 值所对应的一个包含 `id` 选择器的元素）
- 输入状态伪类
  - [`:disabled`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:disabled) 禁用状态伪类，匹配被禁用的元素（主要是表单元素）
  - [`:read-only`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:read-only) 只读状态伪类，匹配输入框是否只读（只作用于 `<input>` 和 `<textarea>`）
  - [`:placeholder-shown`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:placeholder-shown) 占位符显示伪类，在 `<input>` 或 `<textarea>` 元素显示 `placeholder` 时生效
  - [`:default`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:default) 默认选项伪类，匹配处于默认状态下的表单元素
  - [`:checked`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:checked) 选中状态伪类，匹配任何处于选中状态的`<radio>`、`<checkbox>` 或 `select` 中的 `option` 元素
- 文档树结构伪类
  - [`:root`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:root) 匹配文档树的根元素（`<html>`），其除了优先级更高之外其他与 `html` 选择器相同
  - [`:empty`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:empty) 匹配没有没有子元素的元素，子元素只可以是元素节点或文本（包括空格）
  - [`:first-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:first-child) 匹配一组兄弟元素中的第一个元素
  - [`:last-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:last-child) 匹配一组兄弟元素中的最后一个元素
  - [`:only-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:only-child) 匹配没有任何兄弟元素的元素
  - [`:nth-child()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-child) 匹配指定位置序号的元素
  - [`:nth-last-child()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-last-child) 从后面匹配指定位置序号的元素
  - [`:first-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:first-of-type) 匹配当前标签类型元素的第一个
  - [`:last-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:last-of-type) 匹配当前标签类型元素的最后一个
  - [`:only-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:only-of-type) 匹配唯一的标签类型元素
  - [`:nth-of-type()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-of-type) 匹配指定索引的当前标签类型元素
  - [`:nth-last-of-type()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-last-of-type) 从后面匹配指定索引的当前标签类型元素
- 逻辑组合伪类
  - [`:not`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not) 反选伪类（也可以叫反选伪类），匹配不符合一组选择器的元素
- 其他伪类
  - [`:fullscreen`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:fullscreen) 匹配当前处于全屏显示模式下的元素
  - [`:dir()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:dir) 方向伪类，匹配特定文字书写方向的元素

:::

::: tip 伪类与伪元素

- 伪类和伪元素是用来修饰不在文档树中的部分。
- 伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档树外的元素。
  :::

### `CSS`样式优先级

**`!important` > 行内样式 > ID 选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性**

### `CSS`优先级算法如何计算

**优先级就近原则，同权重情况下样式定义最近者为准，载⼊样式以最后载⼊的定位为准。**

## 继承

在`CSS`中，继承是指的是给父元素设置一些属性，后代元素会自动拥有这些属性。

### 常用继承属性

- 字体系列属性

```css
font:组合字体
font-family:规定元素的字体系列
font-weight:设置字体的粗细
font-size:设置字体的尺寸
font-style:定义字体的风格
font-variant:偏大或偏小的字体
```

- 文本系列属性

```css
text-indent：文本缩进
text-align：文本水平对刘
line-height：行高
word-spacing：增加或减少单词间的空白
letter-spacing：增加或减少字符间的空白
text-transform：控制文本大小写
direction：规定文本的书写方向
color：文本颜色
```

- 元素可见性

```css
visibility
```

- 表格布局属性

```css
caption-side：定位表格标题位置
border-collapse：合并表格边框
border-spacing：设置相邻单元格的边框间的距离
empty-cells：单元格的边框的出现与消失
table-layout：表格的宽度由什么决定
```

- 列表属性

```css
list-style-type：文字前面的小点点样式
list-style-position：小点点位置
list-style：以上的属性可通过这属性集合
```

- 引用

```css
quotes：设置嵌套引用的引号类型
```

- 光标属性

```css
cursor：箭头可以变成需要的形状
```

### 继承中比较特殊的

- `a`标签的字体颜色不能被继承

- `h1-h6`标签字体的大下也是不能被继承的

### 无继承的属性

- `display`

- 文本属性：`vertical-align`、`text-decoration`

- 盒子模型的属性：宽度、高度、内外边距、边框等

- 背景属性：背景图片、颜色、位置等

- 定位属性：浮动、清除浮动、定位`position`等

- 生成内容属性：`content`、`counter-reset`、`counter-increment`

- 轮廓样式属性：`outline-style`、`outline-width`、`outline-color`、`outline`

- 页面样式属性：`size`、`page-break-before`、`page-break-after`

## 盒模型

::: tip 什么是盒模型？

当对一个文档进行布局时，浏览器的渲染引擎会根据标准之一的 **`CSS` 基础框盒模型**（CSS basic box model），将所有元素表示为一个个矩形的盒子；`CSS` 决定这些盒子的大小、位置以及属性（如颜色、背景、边框尺寸等）

每个盒子（即盒模型）从外到内由这四个部分组成

- `margin` 外边距（不计入盒子的实际大小）
- `border` 边框
- `padding` 内边距
- `content` 内容

[CSS 基础框盒模型介绍 - CSS：层叠样式表 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)

:::

盒模型分为 **`W3C` 标准盒模型**和 **`IE` 盒模型**，其区别只有一个：**计算盒子实际大小（即总宽度/总高度）的方式不一样**

> 以宽度计算来举例

- `W3C` 标准盒模型（默认）
  - **盒子实际宽 = `width` + `padding` + `border`**
  - 其中 **`width` 只包含 `content`**（即内容区域的宽度）
  - **通过 `box-sizing: content-box;` 来设置为 `W3C` 标准盒模型**
- `IE` 盒模型
  - **盒子实际宽 = `width`**
  - 其中 **`width` = `content` + `border` + `padding`**
  - **通过 `box-sizing: border-box;` 来设置为 `IE` 盒模型**

|                                   `W3C` 标准盒模型                                   |                                  `IE` 盒模型                                   |
| :----------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
| ![W3C 标准盒模型](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/box-model-w3c.png) | ![IE 盒模型](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/box-model-ie.png) |

## `BFC`

> 先了解一些前置知识：格式化上下文（Formatting Context）

::: tip 前置知识：格式化上下文（Formatting Context）
格式化上下文（Formatting Context）即 `FC`，**是 `Web` 页面中一种特殊的渲染区域，并有一套渲染规则，它决定了其元素如何排列、定位，以及和其他元素的关系和相互作用**

在 `CSS` 中，每个元素都属于一个特定的格式化上下文。有一些元素自带格式化上下文，例如根元素（`html`）、块级元素、浮动元素、绝对定位元素等。其他元素则可以通过一些 `CSS` 属性来创建自己的格式化上下文，例如 `display: inline-block`、`overflow: hidden`、`float: left` 等。
:::

::: info 相关资料

- [Introduction to formatting contexts 格式化上下文简介 - CSS：层叠样式表 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flow_Layout/Intro_to_formatting_contexts)

- [块格式化上下文 | MDN](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/Guide/CSS/Block_formatting_context)

:::

`BFC` 即块级格式化上下文（Block Formatting Context），是 `Web` 页面中一种渲染模式，用于确定块级元素如何排列、定位和与其他元素交互，其相当于一个独立的容器，里面的元素和外部的元素相互不影响

### `BFC` 的布局规则

- `BFC` 内部的 `Box` 会在垂直方向，一个接一个的放置（**不会出现元素重叠**）
- `BFC` 中两个 `Box` 垂直方向的距离由 `margin` 决定
- **同一个 `BFC` 中两个相邻 `Box` 的垂直边距 `margin` 会发生重叠**，在不同的 `BFC` 中则不会发生重叠
- `BFC` 中每个子元素的左外边距（`margin-left`）与容器父元素的左边界相接触（`border-left`）
- `BFC` 中元素的布局不受外界的影响，也不会影响到外界的元素
  - 形成了 `BFC` 的区域**不会与浮动元素区域重叠**
  - **计算 `BFC` 的高度时，浮动元素也会参与计算**

### `BFC` 如何创建

- 根元素（`<html>`）
- 浮动元素：`float` 不为 `none`
- 绝对定位元素：`position` 为 `absolute` 或 `fixed`
- `display` 值为如下属性
  - `inline-block` 行内块元素
  - `flow-root` 块级元素盒
  - `table` 该行为类似于 `<table>` 元素
  - `table-cell` 该行为类似于 `<td>` 元素
  - `table-caption` 该行为类似于 `<caption>`
  - `table-row` 该行为类似于 `<tr>` 元素
  - `table-row-group` 该行为类似于 `<tbody>` 元素
  - `table-header-group` 该行为类似于 `<thead>` 元素
  - `table-footer-group` 该行为类似于 `<tfoot>` 元素
  - `inline-table` 内联表格
- `display` 值为 `flex` `inline-flex` `grid` `inline-grid` 的直接子元素，且它们本身都不是 `flex`、`grid`、 `table` 容器
- `contain` 值为 `layout`、`content` 或 `paint` 的元素
- `overflow` 不为 `visible` 和 `clip` 的块元素
- 多列容器：`column-count` 或 `column-width` 值不为 `auto`
- `column-span` 值为 `all`

### `BFC` 的应用场景

> 解决了什么问题

- 浮动元素高度塌陷
- 阻止元素被浮动元素覆盖
- 防止 `margin` 重叠（塌陷）
- 自适应布局

### 常见的格式化上下文

- `BFC`：块级格式化上下文（Block Formatting Context）
- `IFC`：行内格式化上下文（Inline Formatting Context）在 `IFC` 中元素会沿着基线对齐并按从左到右的顺序排列
- `TCFC`：表格单元格格式化上下文（Table Cell Formatting Context）在 `TCFC` 中表格的列宽会根据单元格的内容自动调整，而不会出现列宽不一致的情况
- `FFC`：弹性盒子格式化上下文（Flexbox Formatting Context）在 `FFC` 中弹性盒子元素可以按照自己的尺寸和顺序进行排列。
- `GFC`：网格格式化上下文（Grid Formatting Context）在 `GFC` 中网格元素可以按照网格的行和列进行排列

`FFC` 和 `GFC` 除布局之外规则与 `BFC` 块格式上下文类似，其容器中不存在浮动子元素，但排除外部浮动和阻止外边距重叠仍然有效

## `position` 属性

[position - CSS：层叠样式表 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)

`position` 属性用于指定一个元素在文档中的定位方式。

- **`static`**
  - 默认值，元素在文档中正常定位
  - 此时 `top`, `right`, `bottom`, `left` 和 `z-index` 属性无效
- **`relative`**
  - 相对定位，元素相对于其正常位置进行定位
  - 对 `table-*-group`, `table-row`, `table-column`, `table-cell`, `table-caption` 元素无效
- **`absolute`**
  - 绝对定位，元素相对于其最近的非 `static` 定位祖先元素进行定位
  - 可以设置外边距（margin）且不会与其他边距合并
- **`fixed`**
  - 固定定位，元素相对于浏览器窗口进行定位
  - **当元素祖先的 `transform`, `perspective`, `filter`, `backdrop-filter` 属性非 `none` 时，容器由视口改为该祖先**
- **`sticky`**
  - 粘性定位，元素根据正常文档流进行定位，但在偏移量达到阈值之前为相对定位，之后为固定定位
  - `sticky` 元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上

举个 🌰

```css
#one {
  position: sticky;
  top: 10px;
}
```

设置了以上样式的元素，在  `viewport`  视口滚动到元素  `top`  距离小于  `10px`  之前，元素为相对定位。之后，元素将固定在与顶部距离  `10px`  的位置，直到  `viewport`  视口回滚到阈值以下。

::: tip `sticky`注意 ⚠️

- 元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。
- 须指定  `top`, `right`, `bottom`  或  `left`  四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同。
- 偏移值不会影响任何其他元素的位置。该值总是创建一个新的层叠上下文`（stacking context）`。
- 一个  `sticky`元素会固定   在离它最近的一个拥有   滚动机制   的祖先上（当该祖先的  `overflow`  是  `hidden`, `scroll`, `auto`, 或  `overlay`时），即便这个祖先不是最近的真实可滚动祖先。

:::

## `flex`属性

`Flex` 是 `Flexible Box` 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性，指定容器 `display: flex` 即可，分为容器属性和元素属性。

### 容器的属性

- `flex-direction`：决定主轴的方向（即子 `item` 的排列方法）。

::: details `flex-direction`属性值

- `row` 表示从左向右排列
- `row-reverse` 表示从右向左排列
- `column` 表示从上向下排列
- `column-reverse` 表示从下向上排列
  :::

- `flex-wrap`：`Flex`项目都排在一条线（又称"轴线"）上。我们可以通过`flex-wrap`属性的设置，让`Flex`项目换行排列。

::: details `flex-wrap`属性值

- `nowrap`：所有`Flex`项目单行排列
- `wrap`：所有`Flex`项目多行排列，按从上到下的顺序
- `wrap-reverse`：所有`Flex`项目多行排列，按从下到上的顺序
  :::

- `flex-flow`：`flex-direction` 和 `flex-wrap` 的简写，默认值为`row nowrap`。

- `justify-content`：项目在主轴上的对其方式，水平主轴对齐方式。

::: details `justify-content`属性值

- `flex-start`：从启点线开始顺序排列
- `flex-end`：相对终点线顺序排列
- `center`：居中排列
- `space-between`：项目均匀分布，第一项在启点线，最后一项在终点线
- `space-around`：项目均匀分布，每一个项目两侧有相同的留白空间，相邻项目之间的距离是两个项目之间留白的和
- `space-evenly`：项目均匀分布，所有项目之间及项目与边框之间距离相等
  :::

- `align-items`：定义项目在交叉轴上的对齐方式。

::: details `align-items` 属性值

- `stretch`：交叉轴方向拉伸显示
- `flex-start`：项目按交叉轴起点线对齐
- `flex-end`：项目按交叉轴终点线对齐
- `center`：交叉轴方向项目中间对齐
- `baseline`：交叉轴方向按第一行文字基线对齐
  :::

- `align-content`：定义在交叉轴方向的对齐方式及额外空间分配。

::: details `align-content` 属性值

- `stretch`：拉伸显示
- `flex-start`：从启点线开始顺序排列
- `flex-end`：相对终点线顺序排列
- `center`：居中排列
- `space-between`：项目均匀分布，第一项在启点线，最后一项在终点线
- `space-around`：项目均匀分布，每一个项目两侧有相同的留白空间，相邻项目之间的距离是两个项目之间留白的和
  :::

### 项目的属性（元素的属性）

- `order`：`Flex`项目是按照在代码中出现的先后顺序排列的，然而`order`属性可以控制项目在容器中的排列顺序，顺序越小，排列越靠前，默认为 0。

- `flex-grow`：定义项目的放大比例，`flex-grow` 值是一个单位的正整数，表示放大的比例。默认为 0，即如果存在额外空间，也不放大，负值无效。

> 如果所有项目的`flex-grow`属性都为 1，则它们将等分剩余空间（如果有的话）。如果一个项目的`flex-grow`属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。

- `flex-shrink`：定义了项目的缩小比例，当空间不足的情况下会等比例的缩小，如果 定义个 `item` 的 `flow-shrink` 为 0，则为不缩小。

- `flex-basis`：定义项目在分配额外空间之前的尺寸，属性值可以是长度（`200px`，`10rem`等）或者关键字`auto`，它的默认值为`auto`，即项目的本来大小。

- `flex`：是 `flex-grow` 和 `flex-shrink`、`flex-basis` 的简写，默认值为 `0 1 auto`。

- `align-self`：定义项目的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`，`auto | flex-start | flex-end | center | baseline | stretch`。

- `align-items`：默认属性为 `auto`，表示继承父元素的 `align-items`。

### `flex: 1` 代表什么？

[`flex`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex) 是一个 `CSS` 简写属性，用于设置 `Flex` 项目如何增大或缩小以适应其 `Flex` 容器中可用的空间

::: tip `flex` 是 `flex-grow` `flex-shrink` `flex-basis` 属性的简写

- [flex-grow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-grow) 用于**设置 `flex` 项目的增长系数**
  - 负值无效
  - 初始值为 `0`
  - 省略时默认值为 `1`
- [flex-shrink](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-shrink) 用于**设置 `flex` 项目的收缩系数**（仅在默认 `width/height` 之和大于容器时生效）
  - 负值无效
  - 初始值为 `1`
  - 省略时默认值为 `1`
- [flex-basis](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-basis) 用于**设置 `flex` 项目在主轴方向上的初始大小**
  - 初始值为 `auto`
  - 省略时默认值为 `0`

:::

## 栅格布局（`Grid Layout`）

栅格布局主要由容器和项目组成：

- 容器（`Grid Container`）：应用了 `display: grid` 或 `display: inline-grid` 的元素。

- 项目（`Grid Items`）：容器内的直接子元素，每个项目可以定义它的大小、位置等。

...

::: info 相关资料

- [<u>网格布局 | MDN</u>](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_grid_layout)

- [<u>阮一峰 ｜ CSS Grid 网格布局教程</u>](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

:::

## 实现垂直水平居中

### `text-align` + `line-height`

> 只能**在行内内容在一行时使用**（换行了就 🙅），同时还需要**知道高度的具体值**

```css
.parent {
  height: 150px;
  /* 行高的值要与 height 一致 */
  line-height: 150px;
  text-align: center;
}
.child {
  /* 如果子元素是块级元素需要改为行内或行内块级才能生效 */
  display: inline-block;
  vertical-align: middle;
}
```

### `absolute + transform`

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  left: 50%;
  top: 50%;
  tansform: translate(-50%, -50%);
}
```

### `display: table-cell`

```css
.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```

### `flex`

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### `flex + margin`

```css
.parent {
  display: flex;
}
.child {
  margin: auto;
}
```

### `grid`

```css
.parent {
  display: grid;
}
.child {
  justify-self: center;
  align-self: center;
}
```

### `grid + margin`

```css
.parent {
  display: grid;
}
.child {
  margin: auto;
}
```

## 清楚浮动

### ⽗级 `div` 定义 `height`

父级`div`手动定义`height`，就解决了父级`div`无法自动获取到高度的问题

**缺点：只适合高度固定的布局，要给出精确的高度，如果高度和父级`div`不一样时，会产生问题。**

### 浮动元素后面添加一个加空 `div` 标签 设置 `clear:both`

`clear`属性有三个值

- `left` 清除前面的左浮动元素带给我的影响。
- `right` 清除前面的右浮动元素带给我的影响。
- `both` 同时清除前面的左右浮动元素带给我的影响. 一般情况下选择这个值比较方便。

`clear` 属性的原理就是给这个标签，添加 `margin-top` 让该元素的上外边距与浮动元素高度最高的相等，此时父盒子的高度就会被撑开，当然你也不在标签里面添加任何内容。

### 给父级设置`overflow:hidden`

**缺点：当文本过长，且包含过长英文时，会出现英文文本被隐藏的情况。**

### 给父级增加定位`absolute`

**缺点：`position:absolute`也会脱离文档流，影响了整体布局。**

### 给⽗级 `div` 设置伪元素 `:after`

```css
.clear:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
```

## `link` 和 `@import` 加载样式的区别

[`<link>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link) 是一个 `HTML` 标签，其规定了当前文档与外部资源的关系，不仅可以加载 `CSS` 文件，还可以定义 `RSS`、`rel` 连接属性等。

[`@import`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@import) 是一个 `CSS` 语法规则，用于从其他样式表导入样式规则。

::: tip `link` 和 `@import` 加载样式的区别

- 从属关系
  - `<link>` 是一个 `HTML` 标签，只能出现在 `<head>` 标签中
  - `@import` 是一个 `CSS` 语法规则，只能在 `<style>` 标签和 `CSS` 文件中使用
- 应用范围
  - `<link>` 标签用于链接各种类型的外部资源
    - 加载 `CSS`：`<link rel="stylesheet" href="/index.css" />`
    - 加载网站图标（`favicon`）：`<link rel="icon" href="favicon.ico" />`
    - `DNS` 预解析：`<link rel="dns-prefetch" href="https://azzlzzxz.github.io">`
  - `@import` 只能用于引入 `CSS`
- 加载顺序
  - `<link>` 会在浏览器加载页面时同时加载（多个 `<link>` 会并行加载）
  - `@import` 会在浏览器解析到 `CSS` 中的 `@import` 时再加载（多个 `@import` 会串行加载）
- `DOM` 可控性
  - `<link>` 可以通过 `JavaScript` 操作 `DOM` 进行插入
  - `@import` 没有 `DOM` 接口，无法通过 `JavaScript` 操作

:::

## 媒体查询

> [媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries/Using_media_queries)是利用浏览器的媒体类型和特性，对目标媒体（通常为桌面、平板等的显示器、移动设备等）的种类、尺寸、分辨率和支持的颜色深度等特性进行查询，从而根据这些特性设置相应的样式，进而决定其渲染的具体效果。

媒体查询的核心由两个部分组成：媒体类型和媒体特性。

### 媒体类型

- `all` 匹配所有设备，默认。
- `print` 匹配打印机和用于再现打印显示的设备，例如在`“打印预览”`中显示文档的 `Web` 浏览器。
- `screen` 匹配所有与打印不匹配的设备。

### 媒体特性

> [媒体特性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media#%E5%AA%92%E4%BD%93%E7%89%B9%E6%80%A7)`（media feature`）描述了浏览器、输出设备或环境的具体特征。媒体特性表达式是完全可选的，其用于测试这些特征是否存在以及它们的值。每个媒体特性表达式都必须用括号括起来。

常用媒体特性：

- `width`：视口（包括纵向滚动条）的宽度。
- `height`：视口高度。
- `orientation`：屏幕`（viewport）`方向，`portrait`: 纵向，`landscape`: 横向。

### 逻辑运算符

[逻辑运算符](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media#%E9%80%BB%E8%BE%91%E8%BF%90%E7%AE%97%E7%AC%A6)` （logical operator）``not `、`and`、`only` 和 `or` 可用于联合构造复杂的媒体查询，你还可以通过用逗号分隔多个媒体查询，将它们组合为一个规则。

- `and` ：用于将多个媒体查询规则组合成单条媒体查询，当每个查询规则都为真时则该条媒体查询为 `true`，它还用于将媒体功能与媒体类型结合在一起。

```css
@media (min-width: 800px) and (orientation: portrait) { 
  ...
}
```

- `not` ：用于否定媒体查询，如果不满足这个条件则返回 `true`，否则返回 `false`。如果出现在以逗号分隔的查询列表中，它将仅否定应用了该查询的特定查询。如果使用 `not` 运算符，则还必须指定媒体类型。

- `only`： 仅在整个查询匹配时才用于应用样式，并且对于防止较早的浏览器应用所选样式很有用。当不使用`only`时，旧版本的浏览器会将  `screen and (max-width: 500px)`简单地解释为  `screen`，忽略查询的其余部分，并将其样式应用于所有`screen`。如果使用`only`运算符，则还必须指定媒体类型。通过它让选中的样式在老式浏览器中不被应用。

```css
/* 在老式浏览器中被解析为@media only，因为没有一个叫only的设备，所以实际上老式浏览器不会应用样式。*/
@media only screen and (max-width: 500px) {
  ...;
}

/* 在老式浏览器中被解析为@media screen，样式应用于所有screen。*/
@media screen and (max-width: 500px) {
  ...;
}
```

`only`关键字可防止不支持带有媒体功能的媒体查询的旧版浏览器应用给定的样式，它对现代浏览器没有影响。

- `,（逗号）` ：逗号用于将多个媒体查询合并为一个规则。逗号分隔列表中的每个查询都与其他查询分开处理。因此，如果列表中的任何查询为`true`，则整个媒体查询语句返回`true`。

- `or`： 等价于`,`运算符。

```css
@media (min-width: 500px) or (orientation: landscape) { 
  ...
}

/* 等价于 */

@media (min-width: 500px), (orientation: landscape) { 
  ...
}
```

### 使用媒体查询

- 使用`@media`在样式表中指定媒体类型和媒体特性。

```css
@media screen and (color) {
  ...;
}
```

- 使用`@import`在样式表中指定媒体类型和媒体特性。

```css
@import url(app.css) screen and (color);
```

- 使用`media`属性在`<style>`、`<link>`、`<source>`或其他元素中指定媒体类型和媒体特性。

```css
<link rel="stylesheet" media="screen and (min-width:500px)" href="example.css" />
```

### 设备屏幕宽度常用断点

> 设备屏幕设备尺寸很多，一般写断点时以 `Apple` 设备的屏幕尺寸为标准

- `min-width` 表示移动端优先
  - 样式默认在所有屏幕尺寸下都有效
  - 常用于先写移动端的场景
- `max-width` 表示 `PC` 端优先
  - 样式默认在指定屏幕尺寸下有效
  - 常用于先写 `PC` 端的场景

#### 移动端

```css
/* iPhone 4 / 5 等 */
@media (min-width: 320px) {
}

/* iPhone 6 - 8 / X / XS 等 */
@media (min-width: 375px) {
}

/* iPhone 6 - 8 Plus / XR 等 */
@media (min-width: 414px) {
}

/* 常用断点（无特定机型） */
@media (min-width: 640px) {
}

/* iPad mini 等 */
@media (min-width: 768px) {
}

/* 常用断点（无特定机型） */
@media (min-width: 960px) {
}

/* iPad Pro 12.9 */
@media (min-width: 1024px) {
}
```

#### PC 端

```css
@media (max-width: 1280px) {
}

@media (max-width: 1366px) {
}

@media (max-width: 1440px) {
}

@media (max-width: 1920px) {
}

@media (max-width: 2560px) {
}
```

## `px`&`rem`&`vw`&`em`

> 先了解一下前置知识：像素和视口

::: tip 前置知识：像素和视口

- 像素

像素是网页布局的基础，一个像素表示了计算机屏幕所能显示的最小区域，像素分为两种类型：`CSS`像素和物理像素。

---

- `CSS` 像素`（CSS Pixel）`

`CSS` 像素是网页布局中的逻辑单位，它用于定义页面的尺寸、边距、字体大小等。`CSS` 像素的大小由浏览器计算，通常是根据设备分辨率和屏幕密度来调整的。

特点：

- 在 `CSS` 中定义的尺寸单位是相对于 `CSS` 像素的。例如 `width: 100px;` 中的 `100px` 是指 `CSS` 像素。
- `CSS` 像素是一种抽象单位，它并不直接与设备的物理像素相对应。在高分辨率的设备上，多个物理像素可能会映射为一个 `CSS` 像素

---

- 物理像素`（Device Pixel）`

物理像素是指设备屏幕上的最小显示单位。屏幕由无数个物理像素组成，每个物理像素是屏幕上的一个点。

特点：

- 物理像素的数量是固定的，取决于设备的分辨率。例如，`1920x1080` 的屏幕有 `1920` 个水平像素和 `1080` 个垂直像素。
- 高分辨率设备（如 `Retina` 显示屏）的物理像素密度非常高，单个 `CSS` 像素可能会由多个物理像素表示。

---

| 名称       | `CSS`像素                              | 物理像素                         |
| :--------- | :------------------------------------- | :------------------------------- |
| 定义       | 用于布局的逻辑单位                     | 设备屏幕上显示的实际像素         |
| 大小       | 取决于设备像素比和屏幕密度             | 固定，取决于设备的分辨率         |
| 设备相关性 | 与设备无直接关系                       | 完全取决于设备的物理属性         |
| 映射       | 高分辨率设备中，多个物理像素映射为一个 | 每个物理像素是不可再分的最小单位 |

---

- 设备像素比`（Device Pixel Ratio，DPR）`

设备像素比`（DRP）`是物理像素与 `CSS` 像素之间的比例，它表示一个 `CSS` 像素对应的物理像素数量

**设备像素比 = 物理像素 / CSS 像素**

特点:

- 设备像素比的值由设备决定。在普通分辨率的设备上，`DRP` 通常为 `1`，即 `1` 个 `CSS` 像素等于 `1` 个物理像素。
- 在高分辨率设备上，`DRP` 通常大于 `1`，意味着 `1` 个 `CSS` 像素等于多个物理像素。例如，`DRP` = `2` 表示 `1` 个 `CSS` 像素有`2`个物理像素的宽度和 `2` 个物理像素的高度，等于 `2x2 = 4` 个物理像素。

---

- 视口

广义的视口，是指浏览器显示内容的屏幕区域，狭义的视口包括了布局视口、视觉视口和理想视口。

---

- 布局视口`（layout viewport）`

布局视口定义了`pc`网页在移动端的默认布局行为，因为通常`pc`的分辨率较大，布局视口默认为`980px`。也就是说在不设置网页的`viewport`的情况下，`pc`端的网页默认会以布局视口为基准，在移动端进行展示。因此我们可以明显看出来，默认为布局视口时，根植于`pc`端的网页在移动端展示很模糊。

---

- 视觉视口`（visual viewport）`

视觉视口指的是用户在设备屏幕上实际可见的内容区域。

它是浏览器在屏幕上显示网页时，用户能够看到的部分，如果用户在浏览器中缩放或滚动页面，视觉视口的大小或位置会发生改变。缩放时，视觉视口会变小，从而让用户看到更多网页的细节，因此视觉视口不会影响布局视口的宽度和高度。

---

- 理想视口`（ideal viewport）`

理想视口是指一个网页在移动设备上以最合适的大小显示的状态。在这个视口下，网页无需缩放即可适合屏幕宽度，用户能够清晰地查看内容且不需要水平滚动。理想视口的宽度等于设备的物理像素宽度。

- 理想视口与设备的物理像素密度有关。移动设备通常会有一个理想视口宽度（通过 `device-width` 来设置），确保网页内容在该设备上以适当的比例和大小显示。
- 可以通过 `meta`标签来设置理想视口，让网页在移动设备上自然适配屏幕。

```html
<meta
  id="viewport"
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no"
/>
```

:::

在`CSS`单位中，可以分为长度单位、绝对单位

| `CSS`单位    |                                        |
| :----------- | :------------------------------------- |
| 相对长度单位 | em、ex、ch、rem、vw、vh、vmin、vmax、% |
| 绝对长度单位 | cm、mm、in、px、pt、pc                 |

### `px`

`px`，表示像素，所谓像素就是呈现在我们显示器上的一个个小点，每个像素点都是大小等同的，所以像素为计量单位被分在了绝对长度单位中。

有些人会把`px`认为是相对长度，原因在于在移动端中存在设备像素比，`px`实际显示的大小是不确定的。

在`PC`端，通常情况下浏览器的布局视口宽度是 `980px`

```md
1 CSS 像素 = 750 物理像素 / 980 布局视口宽度 = 0.76px
```

这意味着在`PC`端，`1`个`CSS`像素大约对应`0.76`个物理像素，因此网页上的内容显示可能会稍微缩小。

对于`iPhone6`，布局视口的宽度为 `375px`。

```md
1 CSS 像素 = 750 物理像素 / 375 布局视口宽度 = 2px
```

​
这意味着在`iPhone6上`，`1`个`CSS`像素对应`2`个物理像素，因此网页内容会显示得更大和清晰（因为更多物理像素用于表示同样的`CSS`像素）。

在`PC`端，由于布局视口宽度较大`（980px）`，`CSS`像素对应的物理像素数量较少（`1`个`CSS`像素 ≈ `0.76`个物理像素），网页的显示相对较小。
在`iPhone6`上，布局视口较小`（375px）`，`1`个`CSS`像素对应的物理像素更多（`1`个`CSS`像素 = `2`个物理像素），网页的显示相对较大。

### `em`

`em`是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的通常默认字体尺寸`（1em = 16px）`。

为了简化  `font-size`  的换算，我们可以在`css`中的  `body`  选择器中声明`font-size= 62.5%`，这就使 `em` 值变为  `16px*62.5% = 10px`
这样  `12px = 1.2em`, `10px = 1em`, 也就是说只需要将你的原来的`px`  数值除以 `10`，然后换上`em`作为单位就行了

特点：

- `em` 的值并不是固定的
- `em` 会继承父级元素的字体大小
- `em` 是相对长度单位。相对于当前对象内文本的字体尺寸。

### `rem`

`rem`相对单位，相对的只是`HTML`根元素`font-size`的值。

使用`rem`可以很方便的修改所有元素尺寸，每当需要修改时，只需要修改`html`这个根元素的`font-size`即可。用了`rem`的元素会跟随着发生变化。

#### 项目配置

- 安装 postcss-pxtorem

```sh
npm install postcss-pxtorem --save-dev
```

- 配置 postcss-pxtorem

> 在目录文件下增加`postcss.config.js`并添加相关配置

```js
module.exports = {
  'plugins': {
    ...
    'postcss-pxtorem': {
      rootValue: 16, // rem 相对于 px 转换的基准值
      propList: ['*'], // 需要转换的 CSS 属性，* 表示全部
      unitPrecision: 3, // 转换后的小数位数
      exclude: (e) => { // 排除某些文件
        ...
      }
    }
  }
}
```

- 增加适配`js`，动态计算`font-szie`

```js
//基准大小
const baseSize = 16

//设置 rem 函数
function setRem() {
  //当前页面宽度相对于1920宽的缩放比例, 可根据自己需要修改
  const scale = document.documentElement.clientWidth / 1920
  //设置页面根节点字体大小, 字体大小最小为12
  let fontSize = baseSize * Math.min(scale, 2) > 12 ? baseSize * Math.min(scale, 2) : 12
  document.documentElement.style.fontSize = fontSize + 'px'
}

//初始化
setRem()

//改变窗口大小重新设置rem
window.onresize = function () {
  setRem()
}
```

### `vw、vh`

`vw`就是根据窗口的宽度，分成 100 等份，`100vw`就表示满宽，`50vw`就表示一半宽。（`vw` 始终是针对窗口的宽），同理，`vh`则为窗口的高度

这里的窗口分成几种情况：

- 在桌面端，指的是浏览器的可视区域。
- 移动端指的就是布局视口。

| 单位 | 含义                               |
| :--- | :--------------------------------- |
| vw   | 相对于视窗的宽度，视窗宽度是 100vw |
| vh   | 相对于视窗的高度，视窗高度是 100vh |
| vmin | vw 和 vh 中的较小值                |
| vmax | vw 和 vh 中的较大值                |

#### `vw`单位换算

如果要将`px`换算成`vw`单位，只要确定视图的窗口大小（布局视口），如果我们将布局视口设置成分辨率大小，比如对于`iphone6/7` `375*667`的分辨率，那么`px`可以通过如下方式换算成`vw`

```md
1px = （1/375）\* 100 vw
```

也可以通过`postcss`的相应插件，预处理`css`做一个自动的转换，[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)可以自动将`px`转化成`vw`。

`postcss-px-to-viewport`的默认参数为：

```js
{
  unitToConvert: 'px', // 需要转换的单位，默认为"px"
  viewportWidth: 320, // 设计稿的视口宽度
  unitPrecision: 5, // 单位转换后保留的精度
  propList: ['*'], // 能转化为vw的属性列表
  viewportUnit: 'vw', // 希望使用的视口单位
  fontViewportUnit: 'vw', // 字体使用的视口单位
  selectorBlackList: [], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位
  minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
  mediaQuery: false, // 媒体查询里的单位是否需要转换单位
  replace: true, // 是否直接更换属性值，而不添加备用属性
  exclude: undefined, // 忽略某些文件夹下的文件或特定文件
  include: undefined, // 只有匹配到的文件才会被转换
  landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
  landscapeUnit: 'vw', // 横屏时使用的单位
  landscapeWidth: 568 // 横屏时使用的视口宽度
}
```

## 移动端`1px`问题

在高分辨率的设备上，`1px` 显得过于`“粗”`而不是我们想象的那样细。这是因为不同设备的屏幕分辨率和物理像素比例不同。

通常移动设备屏幕的物理像素与逻辑像素之间存在一个缩放比例（`device pixel ratio, DPR`），这个比例通常大于 `1`（如 `Retina` 屏的 `DPR` 为 `2` 或更高）。这导致了移动设备上 `1px` 实际显示出来的效果会比设计上预期的`“粗”`，并不是`“1个物理像素`”的效果。

> 举个 🌰

- `iPhone 6/7/8` 的屏幕分辨率为 `750x1334`，设备宽度为 `375px`，`DPR` 为 `2`(`1` 个逻辑像素等于 `2` 个物理像素)。因此，`1px` 在这个设备上会显示为 `2` 个物理像素。

- `iPhone 11/12`等，`DPR` 为 `3`，`1px` 显示为 `3` 个物理像素

### 如何解决

- 使用 CSS 媒体查询 (媒体查询配合 DPR)

```css
.border-1px {
  border: 0.5px solid #000;
}

@media screen and (-webkit-min-device-pixel-ratio: 2),
  screen and (min--moz-device-pixel-ratio: 2),
  screen and (-o-min-device-pixel-ratio: 2/1),
  screen and (min-device-pixel-ratio: 2) {
  .border-1px {
    border: 0.5px solid #000; /* 针对高 DPR 设备的 1px */
  }
}
```

这种方式通过检测 `DPR`，为高分辨率设备提供 `0.5px` 的边框，从而使其接近 `1px` 的效果。

- 使用 `transform` 进行缩放

通过 `transform` 的缩放可以让实际的 `1px` 在视觉上保持较细的效果

```css
.border-1px {
  position: relative;
}

.border-1px::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: 1px solid #000;
  transform: scale(0.5);
  transform-origin: 0 0;
}
```
