# AOP

## `AOP` 是什么

`AOP`（Aspect Oriented Programming）是面向切面编程，是一种程序设计思想，是软件设计领域中的一个重要概念。`AOP` 允许用户把公用的代码抽取出来，便于重复使用。

## `AOP` 的好处

`AOP` 的好处是可以把一些通用逻辑分离到切面中，保持业务逻辑的纯粹性，这样切面逻辑可以复用，还可以动态的增删。

举个例子 🌰：

一个请求过来，可能会经过 `Controller`（控制器）、`Service`（服务）、`Repository`（数据库访问） 的逻辑，如果想在这个调用链路里加入一些通用逻辑该怎么加呢？比如日志记录、异常处理等，通过 `AOP` 透明的给业务逻辑加上通用逻辑。

![aop](./images/aop.jpg)

## `Nest`实现`AOP`的方式

### `Middleware` 中间件

中间件是在路由处理程序 之前 调用的函数。 中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的 `next()` 中间件函数。 `next()` 中间件函数通常由名为 `next` 的变量表示。

![middle_ware](./images/middle_ware.png)

中间件函数可以执行以下任务:

- 执行任何代码。
- 对请求和响应对象进行更改。
- 结束请求-响应周期。
- 调用堆栈中的下一个中间件函数。
- 如果当前的中间件函数没有结束请求-响应周期, 它必须调用 `next()` 将控制传递给下一个中间件函数。否则, 请求将被挂起。

**<font color="FF9D00">全局中间件</font>**

在 `main.ts` 里通过 `app.use` 使用：

![middleware](./images/middleware.png)

```ts
app.use(function (req: Request, res: Response, next: NextFunction) {
  console.log('before', req.url)
  next()
  console.log('after')
})
```

![m_run](./images/m_run.png)

**<font color="FF9D00">路由中间件</font>**

```shell
nest g middleware log --no-spec --flat
```

`--no-spec` 是不生成测试文件，`--flat` 是平铺，不生成目录。

生成`log.middleware.ts` 代码

```ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('before2', req.url)

    next()

    console.log('after2')
  }
}
```

然后在 `AppModule` 里启用：

在 `configure` 方法里配置 `LogMiddleware` 在哪些路由生效。

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LogMiddleware } from './log.middleware'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('aaa*')
  }
}
```

```ts
// app.controller.ts
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('handler....')
    return this.appService.getHello()
  }

  @Get('/aaa')
  aaa(): string {
    console.log('aaa...')
    return 'aaa'
  }
}
```

![m_test](./images/m_test.png)

### `Guard` 路由守卫
