# RxJS 与 Interceptor

## RxJS 是什么

`RxJS` 是一个处理异步数据流的库。数据从 `Observable`（可观察对象）产生，经过一系列 `operator`（操作符）处理，最后交给订阅者。

```ts
import { filter, map, of } from 'rxjs'

of(1, 2, 3)
  .pipe(
    map((value) => value * value), // 转换每个值
    filter((value) => value % 2 !== 0), // 只保留奇数
  )
  .subscribe((value) => console.log(`value: ${value}`))

// 输出：1、9
```

复杂异步逻辑可以拆成多个操作符组合，减少嵌套代码。

## 常用操作符

### `Observable`

`Observable` 是会产生数据的异步数据源，变量通常使用 `$` 结尾。

```ts
import { of } from 'rxjs'

const numbers$ = of(1, 2, 3)
numbers$.subscribe((value) => console.log(value))
```

### `map`

转换数据流中的每个值。

```ts
of(1, 2, 3)
  .pipe(map((value) => value * 10))
  .subscribe(console.log) // 10、20、30
```

### `filter`

只保留满足条件的值。

```ts
of(1, 2, 3, 4)
  .pipe(filter((value) => value % 2 === 0))
  .subscribe(console.log) // 2、4
```

### `scan`

根据前一次结果持续累计，适合计数器和求和。

```ts
of(1, 2, 3)
  .pipe(scan((total, value) => total + value, 0))
  .subscribe(console.log) // 1、3、6
```

上面的示例需要先导入：

```ts
import { of, filter, map, scan } from 'rxjs'
```

## 在 Interceptor 中使用 RxJS

NestJS 的 `Interceptor` 通过 `next.handle()` 获取控制器返回值对应的 `Observable`，再使用 RxJS 操作符处理结果。

### 使用 `map` 统一响应格式

```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        message: 'success',
        data, // data 是控制器原本返回的结果
      })),
    )
  }
}
```

```ts
@Get()
@UseInterceptors(ResponseInterceptor)
findAll() {
  return ['张三', '李四']
}

// { code: 200, message: 'success', data: ['张三', '李四'] }
```

### 使用 `tap` 添加日志

`tap` 适合记录日志、更新缓存等副作用操作，不会修改数据流中的值。

```ts
import { Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        this.logger.log(`接口返回：${JSON.stringify(data)}`) // 只观察，不修改结果
      }),
    )
  }
}
```

## 将 Observable 转成 Promise

### `firstValueFrom`

获取 `Observable` 发出的第一个值，然后返回 `Promise`。

```ts
import { firstValueFrom, of } from 'rxjs'

const source$ = of(1, 2, 3)
const result = await firstValueFrom(source$)

console.log(result) // 1
```

### `lastValueFrom`

等待 `Observable` 完成，并返回最后一个值。

```ts
import { lastValueFrom, of } from 'rxjs'

const result = await lastValueFrom(of(1, 2, 3))
console.log(result) // 3
```

如果数据流不会结束，`lastValueFrom` 会一直等待。因此 HTTP 请求这种通常只返回一次结果的数据流，适合使用 `firstValueFrom`。

### NestJS `HttpService` 示例

`HttpService` 返回的是 `Observable`，可以转换后配合 `async/await`。

```ts
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async findUser() {
    const response = await firstValueFrom(this.httpService.get('https://api.example.com/user/1'))

    return response.data // AxiosResponse 中的接口响应内容
  }
}
```

## 小结

- `Observable` 表示异步数据流。
- `map` 转换数据，`filter` 过滤数据，`scan` 累计计算。
- `tap` 用于日志、缓存等副作用。
- `Interceptor` 可以通过 `next.handle().pipe(...)` 处理控制器返回值。
- `firstValueFrom` 获取第一个值，`lastValueFrom` 获取最后一个值。
