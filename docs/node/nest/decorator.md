# 装饰器

## `Nest` 装饰器

Nest 装饰器本质上是一些带有特殊功能的函数。它们可以用来声明模块、控制器、路由，也可以从请求中取出参数。

下面的示例以 `Person` 资源为例，代码中的注释说明了每个装饰器的作用。

## 模块与依赖注入

### `@Module`

用来声明一个模块。模块负责组织控制器和 provider。

```ts
import { Module } from '@nestjs/common'

@Module({
  controllers: [PersonController], // 当前模块提供的控制器
  providers: [PersonService], // 当前模块提供的服务
})
export class PersonModule {}
```

### `@Controller`

声明控制器，并设置路由的公共前缀。

```ts
import { Controller, Get } from '@nestjs/common'

@Controller('person') // 所有路由都会以 /person 开头
export class PersonController {
  @Get()
  findAll() {
    return ['张三', '李四']
  }
}
```

### `@Injectable`

声明一个可以被 Nest 依赖注入的 provider，通常用于 service。

```ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class PersonService {
  findOne(id: string) {
    return { id, name: '张三' }
  }
}
```

### `@Inject`

通过 token 手动指定要注入的 provider，适合注入字符串 token 或自定义实现。

```ts
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class PersonService {
  constructor(
    @Inject('DATABASE') private readonly database: any, // 根据 token 找到数据库实例
  ) {}
}
```

对应的模块配置：

```ts
@Module({
  providers: [PersonService, { provide: 'DATABASE', useValue: { connected: true } }],
})
export class PersonModule {}
```

### `@Optional`

声明某个依赖是可选的。找不到该 provider 时，参数值会是 `undefined`，不会直接报错。

```ts
import { Injectable, Optional } from '@nestjs/common'

@Injectable()
export class PersonService {
  constructor(
    @Optional() private readonly cache?: any, // 没有注册 CACHE 时也可以正常启动
  ) {}
}
```

### `@Global`

将模块声明为全局模块。该模块导出的 provider 可以在其他模块中直接使用。

```ts
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  providers: [PersonService],
  exports: [PersonService], // 必须导出，其他模块才能注入
})
export class SharedModule {}
```

## 请求处理与异常

### `@Catch` 与 `@UseFilters`

`@Catch` 声明 filter 要处理的异常类型，`@UseFilters` 将 filter 应用到控制器或某个路由。

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
  UseFilters,
} from '@nestjs/common'

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    response.status(404).json({ message: '资源不存在' })
  }
}

@Controller('person')
export class PersonController {
  @Get(':id')
  @UseFilters(NotFoundFilter) // 只对当前接口生效
  findOne() {
    throw new NotFoundException()
  }
}
```

### `@UsePipes`

为控制器或路由启用 pipe，常用于参数转换和数据校验。

```ts
import { ParseIntPipe, UsePipes } from '@nestjs/common'

@Get(':id')
@UsePipes(ParseIntPipe) // 将字符串参数转换并校验为整数
findOne(@Param('id') id: number) {
  return { id }
}
```

### `@UseInterceptors`

为路由启用 interceptor，可以在请求前后统一处理日志、响应格式等逻辑。

```ts
import { UseInterceptors } from '@nestjs/common'
import { LoggingInterceptor } from './logging.interceptor'

@Get()
@UseInterceptors(LoggingInterceptor) // 执行接口前后记录日志
findAll() {
  return ['张三', '李四']
}
```

### `@SetMetadata`

给控制器或路由添加 metadata，常和自定义 guard 配合实现权限控制。

```ts
import { SetMetadata } from '@nestjs/common'

@SetMetadata('roles', ['admin']) // 表示该接口只允许 admin 角色访问
@Get('users')
findUsers() {
  return []
}
```

## 路由方法

### `@Get`、`@Post`、`@Put`、`@Delete`、`@Patch`、`@Options`、`@Head`

这些装饰器用于声明 HTTP 请求方法，也可以接收路由路径参数。

```ts
@Controller('person')
export class PersonController {
  @Get() // GET /person
  findAll() {}

  @Post() // POST /person
  create(@Body() body: any) {}

  @Put(':id') // PUT /person/1
  update(@Param('id') id: string) {}

  @Patch(':id') // PATCH /person/1，只修改部分字段
  patch(@Param('id') id: string) {}

  @Delete(':id') // DELETE /person/1
  remove(@Param('id') id: string) {}

  @Options() // OPTIONS /person
  options() {}

  @Head() // HEAD /person，只返回响应头
  head() {}
}
```

## 获取请求数据

### `@Param`

获取 URL 路径中的动态参数，例如 `/person/100` 中的 `100`。

```ts
@Get(':id')
findOne(@Param('id') id: string) {
  return { id }
}
```

### `@Query`

获取 URL 中 `?` 后面的查询参数，例如 `/person?name=张三`。

```ts
@Get()
findByName(@Query('name') name: string) {
  return { name }
}
```

### `@Body`

获取请求体中的数据，常用于接收 JSON 或 DTO。

```ts
@Post()
create(@Body() body: { name: string; age: number }) {
  return `新增用户：${body.name}`
}
```

### `@Headers`

获取请求头。传入名称时获取单个请求头，不传参数时获取全部请求头。

```ts
@Get('token')
getToken(@Headers('authorization') token: string) {
  return { token }
}
```

### `@Session`

获取 session 对象，使用前需要先配置 `express-session` 中间件。

```ts
@Get('profile')
getProfile(@Session() session: Record<string, any>) {
  return session.user // 读取当前登录用户
}
```

### `@HostParam`

获取主机名中的动态参数，需要配合 `@Controller({ host: ':account.example.com' })` 使用。

```ts
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getAccount(@HostParam('account') account: string) {
    return { account } // 访问 api.example.com 时得到 api
  }
}
```

### `@Req`、`@Request`

注入完整的 request 对象。`@Request` 是 `@Req` 的别名。

```ts
@Get('request-info')
getRequestInfo(@Req() request: any) {
  return {
    method: request.method,
    userAgent: request.headers['user-agent'],
  }
}
```

### `@Res`、`@Response`

注入 response 对象。直接使用 response 返回后，Nest 不会再自动处理返回值；使用 `passthrough` 可以保留 Nest 的自动响应能力。

```ts
@Get('download')
download(@Res({ passthrough: true }) response: any) {
  response.header('X-File-Type', 'text') // 设置响应头
  return { message: '开始下载' } // 仍由 Nest 自动返回 JSON
}
```

### `@Next`

注入底层 Express 的 `next` 方法，将请求交给下一个 middleware 或 handler。

```ts
@Get('next')
passToNext(@Next() next: () => void) {
  next() // 继续执行后续处理逻辑
}
```

## 设置响应

### `@HttpCode`

修改接口成功时返回的 HTTP 状态码。

```ts
@Post()
@HttpCode(201) // 创建成功时返回 201，而不是默认的 200
create() {
  return { message: '创建成功' }
}
```

### `@Header`

为响应设置一个自定义请求头。

```ts
@Get('version')
@Header('X-App-Version', '1.0.0')
getVersion() {
  return { version: '1.0.0' }
}
```

### `@Redirect`

让接口直接重定向到指定 URL，也可以在方法中动态返回 `url` 和 `statusCode`。

```ts
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
openDocs() {}
```

### `@Render`

指定模板名称，让 Nest 使用模板引擎渲染页面。需要先配置 Handlebars、Pug 等模板引擎。

```ts
@Get('home')
@Render('home') // 对应 views/home.hbs
home() {
  return { title: 'Nest 首页' } // 传给模板的变量
}
```
