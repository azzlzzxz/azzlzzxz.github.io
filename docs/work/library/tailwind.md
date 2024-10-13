# TailwindCss

::: info 相关资料

- [<u>TailwindCss 中文文档</u>](https://www.tailwindcss.cn/)

- [<u>TailwindCss 英文文档</u>](https://tailwindcss.com/)

:::

## 为什么选择 `TailWindCss`

- 快速开发

  - 内置实用程序类：`Tailwind` 提供了大量的功能类，例如 `flex`、`px-4`、`mt-2`、`text-center` 等。你可以直接在 `HTML` 中使用这些类名，从而快速构建 `UI`，而无需编写自定义样式。

  - 减少自定义 `CSS`：大多数情况下你不需要写自定义样式，因为 `Tailwind` 提供了足够的内置类。这加快了开发速度并简化了代码。

- 避免 `CSS` 冲突

  - 局部化样式

  - 命名冲突最小化

- 小的生产环境 `CSS` 文件

  `Tailwind` 提供了自动的`“按需加载”`功能，生产环境的 `CSS` 文件仅包含页面中实际使用到的样式。

- 一致性强

  - 设计系统的约束：`Tailwind` 内置的样式基于统一的设计系统，如颜色、间距、字体大小等。这意味着整个应用在风格上非常一致，即使由不同的开发人员编写。

  - 响应式设计：`Tailwind` 内置响应式工具类，如 `sm:`、`md:`、`lg:` 等，使得在不同设备上快速实现响应式设计变得非常容易。

## 安装

通过 `npm` 安装 `tailwindcss`，然后创建你自己的 `tailwind.config.js` 配置文件。

```sh
npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init
```

## 配置

- `postcss.config.js` 配置

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- `tailwind.config.js` 配置

```js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- 将加载 `Tailwind` 的指令添加到你的 `CSS` 文件中

在你的主 `CSS` 文件中通过 `@tailwind` 指令添加每一个 `Tailwind` 功能模块。

```js
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## `jit` 模式

`TailwindCss v3` 版本后默认使用 `mode: jit`（`Just In Time`）

::: tip 优点

- **即时生成样式**

在 `JIT` 模式下，`Tailwind` 会根据你在项目中实际使用的类名即时生成 `CSS`。传统的编译器会预生成大量可能用到的 `CSS` 类，但 `JIT` 只生成你当前项目需要的类，大幅减少了生成的文件大小。

- **更快的构建速度**

在开发过程中，`JIT` 模式可以根据需要即时生成新的样式类，避免了每次修改代码后进行完整的编译。这使得开发过程中样式的热加载和响应速度非常快，构建时间显著缩短。

- **更小的 `CSS` 文件**

通过按需生成 `CSS` 类，`JIT` 生成的文件体积更小。仅会在生产环境中包含实际使用的 `CSS` 类，从而减少了无用代码的数量，大大降低了生成的 `CSS` 文件的大小。

- **任意值支持**

`JIT` 模式支持任意值语法，这意味着你可以在 `Tailwind` 类名中直接使用任何自定义的数值，比如颜色、间距、宽高等，而不需要提前配置。它允许开发者自由灵活地调整样式，不再局限于预定义的 `Tailwind` 配置。

```html
<div class="w-[38rem] h-[500px] bg-[#123456]"></div>
```

在 `JIT` 模式下，这类自定义的样式会即时生成，提供极大的自由度和可扩展性。

- **所有变体都可用**

`JIT` 模式使所有的 `Tailwind` 变体类都可以直接使用，而不需要提前在配置文件中启用。例如，响应式变体、悬停、焦点、活动等伪类都可以即时使用，并生成对应的样式，无需手动配置这些变体，它们会自动生成并生效。

```html
<div class="hover:bg-blue-500 sm:bg-green-500 focus:ring"></div>
```

:::
