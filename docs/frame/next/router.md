# Next 路由相关知识

`Next.js` 有两套路由解决方案，`v13.4` 之前的方案称之为`“Pages Router”`，目前的方案称之为`“App Router”`，两套方案目前是兼容的，都可以在 `Next.js` 中使用。

## 文件路由系统（`Pages Router`）

`Next.js` 的路由基于的是文件系统，也就是说，一个文件就可以是一个路由。

你在 `pages` 目录下创建一个 `index.js` 文件，它会直接映射到 `/` 路由地址

```jsx
// pages/index.js
import React from 'react'
export default () => <h1>Hello Next</h1>
```

在 `pages` 目录下创建一个 `about.js` 文件，它会直接映射到 `/about` 路由地址

```jsx
// pages/about.js
import React from 'react'
export default () => <h1>About Next</h1>
```

> 结构

```sh
└── pages
    ├── index.js
    ├── about.js
```

这种方式有一个弊端，那就是 `pages` 目录的所有 `js` 文件都会被当成路由文件，这就导致比如组件不能写在 `pages` 目录下

## `App Router`

### 定义路由

文件夹被用来定义路由。每个文件夹都代表一个对应到 `URL` 片段的路由片段。创建嵌套的路由，只需要创建嵌套的文件夹。

> 嵌套路由 目录对应路由 `dashboard/create`

```sh
└── app
  ├── dashboard
    ├── create
```

### 定义页面（`Pages`）

如何保证这个路由可以被访问，你需要创建一个特殊的名为 `page.js` 的文件，放在对应的路由文件夹下。

```sh
└── app
  ├—— page.js / page.jsx / page.tsx
  ├── dashboard
    ├—— page.js
    ├── create
      ├—— page.js
```

::: tip 对应关系

- `app/page.js` 对应路由 `/`

- `app/dashboard/page.js` 对应路由 `/dashboard`

- `app/dashboard/create/page.js` 对应路由`/dashboard/create`

:::

### 定义布局（`Layouts`）

布局是指多个页面共享的 `UI`。在导航的时候，布局会保留状态、保持可交互性并且不会重新渲染，比如用来实现后台管理系统的侧边导航栏。

```sh
└── app
  ├—— layout.js
  ├—— page.js
  ├── dashboard
    ├—— layout.js
    ├—— page.js
    ├── create
      ├—— page.js
```

::: tip 注意

- `app/layout.js` 是最顶层的布局，也就是根布局，它会应用于所有的路由

  - 根布局必须包含 `html` 和 `body`标签，其他布局不能包含这些标签

  - 默认根布局是服务端组件，且不能设置为客户端组件

- 布局支持嵌套，`app/dashboard/create/page.js` 会使用 `app/layout.js` 和 `app/dashboard/layout.js` 两个布局中的内容

- 同一文件夹下如果有 `layout.js` 和 `page.js`，`page` 会作为 `children` 参数传入 `layout`。也就是，`layout` 会包裹同层级的 `page`

```jsx
// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <section>
      <nav>nav</nav>
      {children}
    </section>
  )
}
```

:::

### 定义模版（`Templates`）

模板类似于布局，它也会传入每个子布局或者页面。但不会像布局那样维持状态

```sh
└── app
  ├—— layout.js
  ├—— page.js
  ├—— template.js
```

> `app/template.js`

```jsx
// app/template.js
export default function Template({ children }) {
  return <div>{children}</div>
}
```

> 输出效果

```jsx
<Layout>
  {/* 模板需要给一个唯一的 key */}
  <Template key={routeParam}>{children}</Template>
</Layout>
```

::: tip 注意

- 同层的`layout` 会包裹 `template`，`template` 又会包裹 `page`

- 切换路由时，`template` 会被重新渲染，但 `layout` 不会（也就是说`layout`可以保持状态）

:::

### 定义加载（`Loading UI`）

```sh
└── app
  ├—— layout.js
  ├── dashboard
    ├—— layout.js
    ├—— loading.js <-- Loading UI -->
    └── page.js
```

`loading.js` 的实现原理是将 `page.js` 和下面的 `children` 用 `<Suspense>` 包裹。

```jsx
<Layout>
  <Suspense fallback={<Loading />}>
    <Page />
  </Suspense>
</Layout>
```

> 实现 `loading` 效果 🌰 一： 用 `React` 的 `use` 函数

```jsx
// /dashboard/page.js
import { use } from 'react'

async function getData() {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return {
    message: 'Hello, Dashboard!',
  }
}

export default function Page() {
  const { message } = use(getData())
  return <h1>{message}</h1>
}
```

> 🌰 二：由于`page.js`导出了一个 `async` 函数

```jsx
// app/dashboard/page.js
async function getData() {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return {
    message: 'Hello, Dashboard!',
  }
}
export default async function DashboardPage(props) {
  const { message } = await getData()
  return <h1>{message}</h1>
}
```

### 定义错误处理（`Error Handling`）

```sh
└── app
  ├—— layout.js
  ├── dashboard
    ├—— layout.js
    ├—— loading.js
    ├—— error.js <-- 错误处理页面 -->
    └── page.js
```

同理，其实现借助了 `React` 的 `Error Boundary` 功能。简单来说，就是给 `page.js` 和 `children` 包了一层 `ErrorBoundary`

```jsx
<Layout>
  <ErrorBoundary fallback={<Error />}>
    <Page />
  </ErrorBoundary>
</Layout>
```

> `dashboard/error.js`

```jsx
'use client' // 错误组件必须是客户端组件

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something wrong!</h2>
      <button
        onClick={
          // 尝试恢复
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

::: tip 注意

- `Next.js` 会在 `error.js` 导出的组件中，传入 `reset` 函数，帮助尝试从错误中恢复。该函数会触发重新渲染错误边界里的内容。如果成功，会替换展示重新渲染的内容。

- `Next.js` 提供了 `global-error.js`文件，使用它时，需要将其放在 `app` 目录下。

  - `global-error.js`会包裹整个应用，而且当它触发的时候，它会替换掉根布局的内容。所以，`global-error.js` 中也要定义 `<html>` 和 `<body>` 标签。

```jsx
'use client'
// app/global-error.js
export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

- `global-error.js` 用来处理根布局和根模板中的错误，`app/error.js` 建议还是要写的

:::

### 定义 `404` 页面（`404 Page`）

当该路由不存在的时候展示的内容

`Next.js` 项目默认的 `not-found` 效果，如果你要替换这个效果，只需要在 `app` 目录下新建一个 `not-found.js`

```sh
└── app
  ├—— layout.js
  ├—— not-found.js
```

> `app/not-found.js`

```jsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <p>大事不妙啦！你访问的页面被弄丢了</p>
      <Link href="/">返回</Link>
    </div>
  )
}
```

::: tip 触发情况

- 当组件抛出了 `notFound` 函数的时候

- 当路由地址不匹配的时候

:::

所以 `app/not-found.js` 可以修改默认 `404` 页面的样式。但是，如果 `not-found.js`放到了任何子文件夹下，它只能由 `notFound` 函数手动触发。

> 举个 🌰

```jsx
// /dashboard/create/page.js
import { notFound } from 'next/navigation'

export default function Page() {
  notFound()

  return <h1>Hello, Create</h1>
}
```

::: tip 注意

- 执行 `notFound` 函数时，会由最近的 `not-found.js` 来处理。但如果直接访问不存在的路由，则都是由 `app/not-found.js` 来处理

:::

### `App Router` 目录结构

```sh
src/
└── app
    ├── page.js
    ├── layout.js
    ├── template.js
    ├── loading.js
    ├── error.js
    └── not-found.js
    ├── dashboard
    │   └── page.js
    └── more
        └── page.js
```

## 动态路由

有的时候，并不能提前知道路由的地址，例如：根据 `URL` 中的 `id` 参数展示该 `id` 对应的内容

### `[folderName]`

使用动态路由，你需要将文件夹的名字用方括号括住，比如 `[id]` 这个路由的名字会作为 `params prop` 传给布局、页面、路由处理程序、以及 `generateMetadata` 函数。

```sh
src/
└── app
    ├── layout.js
    ├── activity
      ├── [id]
        ├── page.js
```

```jsx
// app/activity/[id]/page.js
export default function Page({ params }) {
  return <div>Activity: {params.id}</div>
}
```

当你访问 `/activity/1` 的时候，`params` 的值为 `{ id: '1' }`。

### `[...folderName]`

在命名文件夹的时候，如果你在方括号内添加省略号，比如 `[...folderName]`，这表示捕获所有后面所有的路由片段。

也就是说，`app/activity/[...ids]/page.js` 会匹配 `/activity/create`，也会匹配 `/activity/create/from`、`/activity/create/from/input`等等

```jsx
// app/activity/[...ids]/page.js
export default function Page({ params }) {
  return <div>My Activity: {JSON.stringify(params)}</div>
}
```

::: tip 注意

- 当你访问 `/activity/a` 的时候，`params` 的值为 `{ ids: ['a'] }`。

- 当你访问 `/activity/a/b` 的时候，`params` 的值为 `{ ids: ['a', 'b'] }`。

- 当你访问 `/activity/a/b/c` 的时候，`params` 的值为 `{ ids: ['a', 'b', 'c'] }`

:::

### `[[...folderName]]`

在命名文件夹的时候，如果你在双方括号内添加省略号，比如 `[[...folderName]]`，这表示可选的捕获所有后面所有的路由片段

它与上一种的区别就在于，不带参数的路由也会被匹配（就比如 `/activity`）

当你访问 `/activity`的时候，`params` 的值为 `{}`

## 路由组

在 `app` 目录下，文件夹名称通常会被映射到 `URL` 中，但你可以将文件夹标记为路由组，阻止文件夹名称被映射到 `URL` 中

### 按逻辑分组

将路由按逻辑分组，但不影响 `URL` 路径

```sh
└── app
    ├── layout.js
    ├── (activity)
      └── create
        └── page.js
    ├── (commodity)
      └── account
        └── page.js
```

`URL` 中省略了带括号的文件夹（上图中的(`activity`)和(`commodity`)）

### 创建不同布局

借助路由组，即便在同一层级，也可以创建不同的布局

```sh
└── app
    ├── layout.js
    ├── (activity)
      ├── layout.js
      └── create
        └── page.js
    ├── goods
      └── page.js
```

在 👆 例子中，`/create` 、`/goods` 都在同一层级，但是 `/create` 使用的是 `/app/(activity)/layout.js`布局和 `app/layout.js` 布局，而`/goods` 使用的是 `app/layout.js`

### 创建多个根布局

```sh
└── app
    ├── (activity)
      ├── layout.js
      └── ...
    ├── (goods)
      ├── layout.js
      └── ...
```

创建多个根布局，你需要删除掉 `app/layout.js` 文件，然后在每组都创建一个 `layout.js` 文件。创建的时候要注意，因为是根布局，所以要有 `<html>` 和 `<body>` 标签

::: tip 注意

- 路由组的命名除了用于组织之外并无特殊意义。它们不会影响 `URL` 路径。

- 注意不要解析为相同的 `URL` 路径。举个例子，因为路由组不影响 `URL` 路径，所以 `(activity)/about/page.js` 和 `(goods)/about/page.js` 都会解析为 `/about`，这会导致报错。

- 创建多个根布局的时候，因为删除了顶层的 `app/layout.js` 文件，访问 `/` 会报错，所以`app/page.js`需要定义在其中一个路由组中。

- 跨根布局导航会导致页面完全重新加载，就比如使用 `app/(activity)/layout.js` 根布局的 `/create` 跳转到使用 `app/(goods)/layout.js` 根布局的 `/group` 会导致页面重新加载（`full page load`）。

:::

## 平行路由

平行路由可以使你在同一个布局中同时或者有条件的渲染一个或者多个页面（类似于 `Vue` 的插槽功能）。

平行路由的使用方式是将文件夹以 `@`作为开头进行命名

### 条件渲染

```sh
└── app
    ├── layout.js
    └── page.js
    ├── @activity
      └── page.js
    ├── @goods
      └── page.js
```

在 👆 中就定义了两个插槽 `@activity` 和 `@goods`，插槽会作为 `props` 传给共享的父布局，`app/layout.js` 从 `props` 中获取了 `@activity` 和 `@goods` 两个插槽的内容，并将其与 `children` 并行渲染

> `app/layout.js`

```jsx
export default function Layout({ children, activity, goods }) {
  return (
    <>
      {children}
      {isLog ? activity : goods}
    </>
  )
}
```

`children prop` 其实就是一个隐式的插槽，`/app/page.js`相当于 `app/@children/page.js`

### 独立路由处理

平行路由可以让你为每个路由定义独立的错误处理和加载界面

```sh
└── app
    ├── layout.js
    └── page.js
    ├── @activity
      ├── loading.js
      ├── error.js
      └── page.js
```

### 子导航

平行路由跟路由组一样，不会影响 `URL`，所以 `/@activity/create/page.js` 对应的地址是 `/create`，/`@activity/modify/page.js` 对应的地址是 `/modify`，你可以导航至这些路由

```sh
└── app
    ├── layout.js
    └── page.js
    ├── @activity
      ├── create
        └── page.js
      └── modify
        └── page.js
```

当导航至这些子页面的时候，子页面的内容会取代 `/@activity/page.js` 以 `props` 的形式注入到布局中

```jsx
// app/layout.js
import Link from 'next/link'

export default function RootLayout({ children, activity }) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/">Home</Link>
          <br />
          <Link href="/create">Create</Link>
          <br />
          <Link href="/modify">Modify</Link>
        </nav>
        <h1>root layout</h1>
        {activity}
        {children}
      </body>
    </html>
  )
}
```

### `default.js`

```sh
└── app
    ├── layout.js
    └── page.js
    ├── @activity
      └── create
        └── page.js
    ├── @goods
      └── page.js
```

- 如果是软导航（`Soft Navigation`，比如通过 `<Link />` 标签），在导航时，`Next.js` 将执行部分渲染，更改插槽的内容，如果它们与当前 `URL` 不匹配，维持之前的状态

- 如果是硬导航（`Hard Navigation`，比如浏览器刷新页面），因为 `Next.js` 无法确定与当前 `URL` 不匹配的插槽的状态，所以会渲染 `404` 错误

这就带来了一个问题，当刷新页面时，`app/@activity/create/page.js` 也就是 `/create` 会匹配不到，导致显示`404`

因为当你访问 `/create` 的时候，读取的不仅仅是 `app/@activity/create/page.js`，还有 `app/@goods/create/page.js` 和 `app/create/page.js`。

为了解决这个问题，`Next.js` 提供了 `default.js`。当发生硬导航的时候，`Next.js` 会为不匹配的插槽呈现 `default.js` 中定义的内容，如果 `default.js` 没有定义，再渲染 `404` 错误。

```sh
└── app
    ├── default.js
    ├── layout.js
    └── page.js
    ├── @activity
      └── create
        └── page.js
    ├── @goods
      ├── default.js
      └── page.js
```

## 路由拦截

拦截路由允许你在当前路由拦截其他路由地址并在当前路由中展示内容

::: info 可以看看这个网站的效果

- [<u>dribbble.com</u>](https://dribbble.com/following)

:::

在 `Next.js` 中，实现拦截路由需要你在命名文件夹的时候以 `(..)` 开头，其中：

- `(.)` 表示匹配同一层级

- `(..)` 表示匹配上一层级

- `(..)(..)` 表示匹配上上层级

- `(...)` 表示匹配根目录

::: tip 注意

- 这个匹配的是路由的层级而不是文件夹路径的层级，就比如路由组、平行路由这些不会影响 `URL` 的文件夹就不会被计算层级

:::

```sh
└── app
    ├── layout.js
    ├── page.js
    ├── feed
    │  ├── layout.js
    │  └── (..)photo
    │    └── [id]
    │      └── page.js
    ├── photo
      └── [id]
        └── page.js
```

`/feed/(..)photo`对应的路由是 `/feed/photo`，要拦截的路由是 `/photo`，两者只差了一个层级，所以使用 `(..)`
