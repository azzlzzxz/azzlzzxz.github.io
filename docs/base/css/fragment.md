<style>
.triangle {  
  width: 0;  
  height: 0;  
  border-left: 50px solid transparent;  
  border-right: 50px solid transparent;  
  border-bottom: 80px solid red;  
}
.triangle-linear {
  width: 100px;
  height: 120px;
  outline: 2px solid transparent;
  background-repeat: no-repeat;
  background-image: linear-gradient(32deg, orangered 50%, rgba(255, 255, 255, 0) 50%), linear-gradient(148deg, orangered 50%, rgba(255, 255, 255, 0) 50%);
  background-size: 100% 50%;
  background-position: top left, bottom left;
}
.triangle-cli-path{
  margin: 10px;
  width: 100px;
  height: 120px;
  background-color: red;
  clip-path: polygon(0 0, 0% 100%, 100% 50%);
}
.focus-border {
  overflow: hidden;
  width: 100px;
  height: 100px;
  border: 4px solid;
  border-radius: 10px;
  border-color: skyblue;
  -webkit-mask: conic-gradient(from -90deg at 40px 40px, red 90deg, transparent 0deg);
  -webkit-mask-position: -20px -20px;
}
</style>

# CSS 常用代码片段

## 绘制三角形

- 使用`border`绘制三角形

通过改变元素的`border`属性，可以创建一个三角形。

设置元素的`width`和`height`为`0`，然后调整四个边的`border`宽度，可以形成一个三角形

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 80px solid red;
}
```

::: details 展示

<div class="triangle"></div>

:::

- 使用`linear-gradient`绘制三角形

可以通过创建一个径向渐变来实现三角形的视觉效果。

将元素的`background-image`属性设置为渐变，并通过调整渐变的颜色和方向可以形成三角形

```css
.triangle {
  width: 100px;
  height: 120px;
  outline: 2px solid transparent;
  background-repeat: no-repeat;
  background-image: linear-gradient(32deg, orangered 50%, rgba(255, 255, 255, 0) 50%),
    linear-gradient(148deg, orangered 50%, rgba(255, 255, 255, 0) 50%);
  background-size: 100% 50%;
  background-position: top left, bottom left;
}
```

::: details 展示

<div class="triangle-linear"></div>

:::

- `clip-path`

`clip-path` 就是使用它来绘制多边形(或圆形、椭圆形等)并将其定位在元素内，浏览器不会绘制 `clip-path` 之外的任何区域

```css
.triangle {
  margin: 10px;
  width: 100px;
  height: 150px;
  background-color: red;
  clip-path: polygon(0 0, 0% 100%, 100% 50%);
}
```

::: details 展示

<div class="triangle-cli-path"></div>
:::

## 文本溢出

- 单行文本溢出

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

- 多行文本溢出

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
overflow: hidden;
```

::: tip 提示

- `-webkit-line-clamp`用来限制在一个块元素显示的文本的行数。 为了实现该效果，它需要组合其他的`WebKit`属性。

  - `display: -webkit-box;` 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示。

  - `-webkit-box-orient` 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式。

:::

## 相机聚焦框

```css
.focus-border {
  overflow: hidden;
  width: 100px;
  height: 100px;
  border: 4px solid;
  border-radius: 10px;

  /* 核心代码 */
  -webkit-mask: conic-gradient(from -90deg at 40px 40px, red 90deg, transparent 0deg);
  -webkit-mask-position: -20px -20px;
}
```

::: details 展示

<div class="focus-border"></div>

:::
