# 浏览器缓存机制

![cache](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/cache.jpg)

## 浏览器缓存位置和优先级

1. `Service Worker`
2. `Memory Cache`（内存缓存）
3. `Disk Cache`（硬盘缓存）
4. `Push Cache`（推送缓存）
5. 以上缓存都没命中就会进行网络请求

## 不同缓存间的差别

### `Service Worker`

和 `Web Worker` 类似，是独立的线程，我们可以在这个线程中缓存文件，在主线程需要的时候读取这里的文件，`Service Worker` 使我们可以自由选择缓存哪些文件以及文件的匹配、读取规则，并且缓存是持续性的。

`ServiceWorker` 是运行在浏览器后台进程里的一段 `JS`，它可以做许多事情，比如拦截客户端的请求、向客户端发送消息、向服务器发起请求等等，其中最重要的作用之一就是离线资源缓存。

`ServiceWorker` 拥有对缓存流程丰富灵活的控制能力，当页面请求到 `ServiceWorker` 时，`ServiceWorker` 同时请求缓存和网络，把缓存的内容直接给用户，而后覆盖缓存。

![server_worker](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/server_worker.png)

::: tip 注意

- 需要`HTTPS`才可以使用`ServiceWorker`

:::

### `Memory Cache`

内存缓存，内存缓存不是持续性的，缓存会随着进程释放而释放。

内存缓存：读取快、持续时间短、容量小。

### `Disk Cache`

硬盘缓存，相较于内存缓存，硬盘缓存的持续性和容量更优，它会根据 `HTTP header` 的字段判断哪些资源需要缓存。

硬盘缓存：读取慢、持续时间长、容量大。

### `Push Cache`

推送缓存，`Push Cache` 是与 `HTTP/2` 中的 `Server Push` 机制相关的缓存机制。`Server Push` 是 `HTTP/2` 提供的一个功能，允许服务器在客户端请求某个资源时，主动向客户端推送其他相关的资源，而不需要客户端显式地请求这些资源。

`Push Cache` 是一种临时的缓存机制，生命周期相对较短，通常在当前会话中有效。一旦会话结束或者资源被使用后，缓存内容可能会被清除

## 浏览器缓存策略

`HTTP` 缓存一般分为两类：`强缓存（也称本地缓存`）和 `协商缓存（也称 304 缓存）`。

普通刷新会启用协商缓存，忽略强缓存。只有在地址栏或收藏夹输入网址、通过链接引用资源等情况下，浏览器才会启用强缓存。

### 强缓存(不需要向服务器询问的缓存)（200）

本地缓存是最快速的一种缓存方式，只要资源还在缓存有效期内，浏览器就会直接在本地读取，不会请求服务端。

::: tip `from disk cache` 和 `from memory cache` 什么时候会触发？

1. 先查找内存，如果内存中存在，从内存中加载
2. 如果内存中未查找到，选择硬盘获取，如果硬盘中有，从硬盘中加载
3. 如果硬盘中未查找到，那就进行网络请求
4. 加载到的资源缓存到硬盘和内存

:::

![memory_cache](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/memory_cache.png)

#### 设置 `Expires(HTTP1.0)`

即过期时间，例如`「Expires: Thu, 26 Dec 2019 10:30:42 GMT」`表示缓存会在这个时间后失效，这个过期日期是绝对日期，如果修改了本地日期，或者本地日期与服务器日期不一致，那么将导致缓存过期时间错误。

`Expires`是 `HTTP1.0` 的产物，故现在大多数使用 `Cache-Control` 替代。

#### 设置 `Cache-Control`

`HTTP/1.1`新增字段，`Cache-Control` 可以通过 `max-age` 字段来设置过期时间，例如`「Cache-Control:max-age=3600」`除此之外`Cache-Control`还能设置`private/no-cache`等多种字段:

- `private`：客户端可以缓存

- `public`：客户端和代理服务器都可以缓存

- `max-age=t`：缓存内容将在`t`秒后失效
- `no-cache`：需要使用协商缓存来验证缓存数据
- `no-store`：所有内容都不会缓存。

::: tip 注意 ⚠️

- **`no-cache` 的意思是可以缓存，但每次用应该去想服务器验证缓存是否可用。（而不是不缓存）**

- **`no-store`才是不缓存内容。当在首部字段`Cache-Control`有指定`max-age`指令时，比起首部字段 `Expires`，会优先处理`max-age`指令。命中强缓存的表现形式：`Firefox`浏览器表现为一个灰色的 200 状态码。`Chrome`浏览器状态码表现为`200 (from disk cache)`或是`200 OK (from memory cache)`**

:::

### 协商缓存(需要向服务器询问缓存是否已经过期)（304）

协商缓存，顾名思义是经过浏览器与服务器之间协商过之后，在决定是否读取本地缓存，如果服务器通知浏览器可以读取本地缓存，会返回 `304` 状态码，并且协商过程很简单，只会发送头信息，不会发送响应体

![304](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/304.png)

#### `Last-Modified(HTTP1.0)`

即最后修改时间，浏览器第一次请求资源时，服务器会在响应头上加上`Last-Modified`。

当资源过期时（浏览器判断 `Cache-Control` 标识的 `max-age` 过期），发现响应头具有 `Last-Modified` 声明，浏览器会在请求头中带上 `If-Modified-Since` 字段，字段的值就是之前服务器返回的最后修改时间，服务器对比这两个时间，若相同响应 `304` 走缓存，否则，响应 `200` 返回新资源，并更新 `Last-Modified`

#### `ETag`

`HTTP/1.1` 新增字段，表示文件唯一标识，只要文件内容改动，`ETag` 就会重新计算，`ETag` 的值，默认是对 `文件的索引节（INode）`，`大小（Size）`和`最后修改时间（MTime）`进行 `Hash` 后得到的。

缓存流程和`Last-Modified`一样：

1. 浏览器请求资源

2. 服务器发送`ETag`字段

3. 浏览器再次请求时发送`If-None-Match`

4. 如果`ETag`值不匹配，说明文件已经改变，返回新资源并更新`ETag`，若匹配则返回 `304`。

::: tip

- `If-None-Match：`当资源过期时，浏览器发现响应头里有`ETag`，则再次像服务器请求时带上请求头`If-none-match`(值是`ETag`的值)，服务器收到请求进行比对，决定返回`200`或`304`

:::

`Last-Modified` 与 `ETag` 两者对比：

- `ETag`比`Last-Modified`更准确：如果我们打开文件但并没有修改，`Last-Modified` 也会改变，并且`Last-Modified`的单位时间为一秒，如果一秒内修改完了文件，那么还是会命中缓存。

- 如果什么缓存策略都没有设置，那么浏览器会取响应头中的`Date`减去`Last-Modified`值的 10% 作为缓存时间。

## 缓存场景

对于大部分的场景都可以使用强缓存配合协商缓存解决，但是在一些特殊的地方可能需要选择特殊的缓存策略。

对于某些不需要缓存的资源，可以使用`Cache-control: no-store`，表示该资源不需要缓存

对于频繁变动的资源，可以使用`Cache-Control: no-cache`并配合`ETag`使用，表示该资源已被缓存，但是每次都会发送请求询问资源是否更新。

对于代码文件来说，通常使用`Cache-Control: max-age=31536000`并配合策略缓存使用，然后对文件进行指纹处理，一旦文件名变动就会立刻下载新的文件

## 启发式缓存

如果响应中未显示`Expires`，`Cache-Control：max-age`或`Cache-Control：s-maxage`，并且响应中不包含其他有关缓存的限制，缓存可以使用启发式方法计算新鲜度寿命。

通常会根据响应头中的 2 个时间字段`Date`减去`Last-Modified`值的 10% 作为缓存时间。

```js
// Date 减去 Last-Modified 值的 10% 作为缓存时间。
// Date：创建报文的日期时间, Last-Modified 服务器声明文档最后被修改时间
response_is_fresh =  max(0,（Date -  Last-Modified)) % 10
```

::: tip 注意 ⚠️

只有在服务端没有返回明确的缓存策略时才会激活浏览器的启发式缓存策略。

:::

### 启发式缓存会引起什么问题

考虑一个情况，假设你有一个文件没有设置缓存时间，在一个月前你更新了上个版本。这次发版后，你可能得等到 `3` 天后用户才看到新的内容了。如果这个资源还在`CDN`也缓存了，则问题会更严重。

所以，要给资源设置合理的缓存时间。不要不设置缓存，也不要设置过长时间的缓存。应用内容要很久才会覆盖新版本。一般带`hash`的文件缓存时间可以长一点。
