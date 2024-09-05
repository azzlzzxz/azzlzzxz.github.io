# Nest 基础

## `nest` 介绍

`Nest (NestJS)` 是一个用于构建高效、可扩展的 `Node.js` 服务器端应用程序的框架。它使用渐进式 `JavaScript`，使用 `TypeScript` 构建并完全支持 `TypeScript`（但仍然允许开发人员使用纯 `JavaScript` 进行编码），并结合了 `OOP（面向对象编程）`、`FP（函数式编程）`和 `FRP（函数式反应式编程）`的元素。

在底层，`Nest`使用强大的 `HTTP` 服务器框架，如 `Express（默认`），并且也可以选择配置为使用 `Fastify！`

`Nest`提供了高于这些常见 `Node.js` 框架`（Express/Fastify）`的抽象级别，而且还直接向开发人员公开其 `API`。这使开发人员可以自由地使用可用于底层平台的无数第三方模块。

## `nest`相关命令

```sh
# 安装nest cli
npm i -g @nestjs/cli

# 创建新项目
npx nest new 项目名

# 生成module
nest generate module aaa

# 生成controller
nest genergate controller xxx

# 生成一个完整的模块代码
nest generate resource yyy

# 快速创建项目
nest new

# 快速生成各种代码
nest generate

# 使用 tsc 或者 webpack 构建代码
nest build

# 启动开发服务，支持 watch 和调试
nest start

# 打印 node、npm、nest 包的依赖版本
nest info
```

## `nest-cli.json` 配置

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "entryFile": "main",
  "generateOPtions": {
    "spec": false, // 是否生成测试文件
    "flat": false // 是否生成对应的目录
  },
  "compilerOptions": {
    "webpack": true, // 打包方式 webpack/tsc
    "watchAssets": false, // --watch 默认只是监听 ts、js 文件，加上 --watchAssets 会连别的文件一同监听变化，并输出到 dist 目录，比如 md、yml 等文件
    "assets": [
      // assets 是指定 nest build 的时候，把那些非 js、ts 文件也复制到 dist 目录下
      "**/*.css",
      { "include": "**/*.html", "exclude": "**/aaa.html", "watchAssets": true }
    ],
    "tsConfigPath": "tsconfig.build.json",
    "webpackConfigPath": "webpack.config.js",
    "deleteOutDir": true
  }
}
```

## 项目核心文件

```lua
src
 ├── app.controller.spec.ts
 ├── app.controller.ts
 ├── app.module.ts
 ├── app.service.ts
 └── main.ts
```

::: tip
| 文件名 | 文件概述 |
| ---------------------- | ------------------------------------------------------------- |
| `app.controller.ts` | 带有单个路由的基本控制器示例。 |
| `app.controller.spec.ts` | 对于基本控制器的单元测试样例。 |
| `app.module.ts` | 应用程序的根模块。 |
| `app.service.ts` | 带有单个方法的基本服务。 |
| `main.ts` | 应用程序入口文件。它使用 `NestFactory` 用来创建 `Nest` 应用实例。 |

:::

## 5 种 `Http` 数据传输方式

### 1 `url param`

`url param` 是 `url` 中的参数，`Nest` 里通过 :参数名 的方式来声明，然后通过 `@Param(参数名)` 的装饰器取出来注入到 `controller`

```js
@Controller('api/person')
export class PersonController {
  @Get(':id')
  urlParam(@Param('id') id: string) {
    return `received: id=${id}`
  }
}
```

`@Controller('api/person')` 的路由和 `@Get(':id')` 的路由会拼到一起，也就是只有 `/api/person/xxx` 的 `get` 请求才会走到这个方法。

### 2 `query`

`query` 是 `url` 中 ? 后的字符串，需要做 `url encode`。

在 `Nest` 里，通过 `@Query` 装饰器来取：

```js
@Controller('api/person')
export class PersonController {
  @Get('find')
  query(@Query('name') name: string, @Query('age') age: number) {
    return `received: name=${name},age=${age}`
  }
}
```

:::tip
注意，这个 `find` 的路由要放到 `:id` 的路由前面，因为 `Nest` 是从上往下匹配的，如果放在后面，那就匹配到 `:id` 的路由了。
:::

### 3 `form urlencoded`

`form urlencoded` 是通过 `body` 传输数据，其实是把 `query` 字符串放在了 `body` 里，所以需要做 `url encode`
用 `Nest` 接收的话，使用 `@Body` 装饰器，`Nest` 会解析请求体，然后注入到 `dto` 中。
`dto` 是 `data transfer object`，就是用于封装传输的数据的对象：

```js
export class CreatePersonDto {
  name: string
  age: number
}
```

```js
import { CreatePersonDto } from './dto/create-person.dto'

@Controller('api/person')
export class PersonController {
  @Post()
  body(@Body() createPersonDto: CreatePersonDto) {
    return `received: ${JSON.stringify(createPersonDto)}`
  }
}
```

前端代码使用 `post` 方式请求，指定 `content type` 为 `application/x-www-form-urlencoded`，用 `qs` 做下 `url encode`。

### 4 `json`

`json` 需要指定 `content-type` 为 `application/json`。
后端代码同样使用 `@Body` 来接收，不需要做啥变动。`form urlencoded` 和 `json` 都是从 `body` 取值，`Nest` 内部会根据 `content type` 做区分，使用不同的解析方式。

### 5 `form data`

`form data` 是用 -------- 作为 `boundary` 分隔传输的内容的。
`Nest` 解析 `form data` 使用 `FilesInterceptor` 的拦截器，用 `@UseInterceptors` 装饰器启用，然后通过 `@UploadedFiles` 来取。非文件的内容，同样是通过 `@Body` 来取。

```js
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { CreatePersonDto } from './dto/create-person.dto'

@Controller('api/person')
export class PersonController {
  @Post('file')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/',
    }),
  )
  body2(
    @Body() createPersonDto: CreatePersonDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files)
    return `received: ${JSON.stringify(createPersonDto)}`
  }
}
```

```bash
npm i -D @types/multer
```

前端代码使用 `axios` 发送 `post` 请求，指定 `content type` 为 `multipart/form-data`。

### 小结

我们用 `axios` 发送请求，使用 `Nest` 起后端服务，实现了 5 种 `http/https` 的数据传输方式：

其中前两种是 `url` 中的：

`url param：` `url` 中的参数，`Nest` 中使用 `@Param `来取。

` query：``url ` 中 ? 后的字符串，`Nest` 中使用`@Query`来取。

后三种是 `body` 中的：

`form urlencoded：` 类似 query 字符串，只不过是放在 `body` 中。`Nest` 中使用 `@Body` 来取，`axios` 中需要指定 `content type` 为 `application/x-www-form-urlencoded`，并且对数据用 `qs` 或者 `query-string` 库做 `url encode`。

`json：` `json` 格式的数据。`Nest` 中使用 `@Body` 来取，`axios` 中不需要单独指定 `content type`，`axios` 内部会处理。

`form data：`通过 ----- 作为 `boundary` 分隔的数据。主要用于传输文件，`Nest` 中要使用 `FilesInterceptor` 来处理其中的 `binary` 字段，用 `@UseInterceptors` 来启用，其余字段用 `@Body` 来取。`axios` 中需要指定 `content type` 为 `multipart/form-data`，并且用 `FormData` 对象来封装传输的内容。

## `Nest` 装饰器

- `@Module`： 声明 `Nest` 模块
- `@Controller`：声明模块里的 `controller`
  > 控制器的目的是接收应用的特定请求。路由机制控制哪个控制器接收哪些请求。通常，每个控制器有多个路由，不同的路由可以执行不同的操作。
- `@Injectable`：声明模块里可以注入的 `provider`
- `@Inject`：通过 `token` 手动指定注入的 `provider`，`token` 可以是 `class` 或者 `string`
- `@Optional`：声明注入的 `provider` 是可选的，可以为空
- `@Global`：声明全局模块
- `@Catch`：声明 `exception filter` 处理的 `exception` 类型
- `@UseFilters`：路由级别使用 `exception filter`
- `@UsePipes`：路由级别使用 `pipe`
- `@UseInterceptors`：路由级别使用 `interceptor`
- `@SetMetadata`：在 `class` 或者 `handler` 上添加 `metadata`
- `@Get`、`@Post`、`@Put`、`@Delete`、`@Patch`、`@Options`、`@Head`：声明 `get`、`post`、`put`、`delete`、`patch`、`options`、`head` 的请求方式
- `@Param`：取出 `url` 中的参数，比如 `/aaa/:id` 中的 `id`
- `@Query`: 取出 `query` 部分的参数，比如 `/aaa?name=xx` 中的 `name`
- `@Body`：取出请求 `body`，通过 `dto class` 来接收
- `@Headers`：取出某个或全部请求头
- `@Session`：取出 `session` 对象，需要启用 `express-session` 中间件
- `@HostParm`： 取出 `host` 里的参数
- `@Req`、`@Request`：注入 `request` 对象
- `@Res`、`@Response`：注入 `response` 对象，一旦注入了这个 Nest 就不会把返回值作为响应了，除非指定 `passthrough` 为 `true`
- `@Next`：注入调用下一个 `handler` 的 `next` 方法
- `@HttpCode`： 修改响应的状态码
- `@Header`：修改响应头
- `@Redirect`：指定重定向的 `url`
- `@Render`：指定渲染用的模版引擎
