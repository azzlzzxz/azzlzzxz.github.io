# 前端发布策略

前端发布的本质，其实是静态资源的发布，一般是 `js`、`css`,而不包括动态渲染出来的`html`模版。

## 野生状态下的前端资源

- 有一个`HTML`
- `HTML`中引入一个`CSS`
- `CSS`和`HTML`模版都有服务器反向代理

这时候他们的网络时序图会如下图所示，`html` 和 `css` 会依此加载：

![release_init](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/release_init.jpg)

用 `HTTP` 的缓存提高资源的加载速度

## 协商缓存

使用协商缓存的话，浏览器去请求资源，服务器会告诉浏览器这个资源已经多久没有改变过了，浏览器发现这个时间内自己请求过这个资源，于是就把缓存的资源拿出来直接使用。

![release_negotiate](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/release_negotiate.jpg)

这种方式省去了重新下载整个资源的时间，但是仍然需要一次协商缓存的过程。

## 本地缓存

另一种是本地缓存，在这种方式下，浏览器在发起请求之前，会对比请求的`url`，如果发现和之前一致的话，就从硬盘或是内存中，找到对应的缓存，直接使用。

![release_cache](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/release_cache.jpg)

显然本地缓存对加载速度更好，但是本地缓存带来了新的问题，如果资源更新了怎么办？用户一直使用老的缓存，即使发布了新的版本，用户不是也用不上啊，那么我们就需要想办法去解决这个问题 🙋。

### 版本号 `version` 控制

既然本地缓存更请求的`url`有关，那么我们在请求资源的后面多加个版本的参数不就好了么，每次更新资源的时候也同步的更新参数。

比如说：所有的资源都加上一个`v.x.x.x`的版本号，在下次更新的时候修改版本号，让用户的缓存失效。

![release_version](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/release_version.jpg)

但是在实际情况中，我们还发现了新的问题，对于一个大型网站来说，静态资源可能非常非常多，每天都会有新的前端代码被修改，如果其中每一个资源被修改了，我们就全量修改所有的版本号的话。那缓存的意义也就不大了。

![release_version_1](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/release_version_1.jpg)

针对这个问题，我们可以用 `hash` 来解决。

### `hash` 区分

`hash` 是一串字符串，它像是文件的一种特质，只和文件的内容有关，如果一个文件的内容变了，那么它的 `hash` 值也会变化。

利用 `hash` 的特性，我们可以把上一步的版本号改为 `hash` 值，这样的话只有被我们改动过的静态资源的缓存才会失效。

![release_hash](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/release_hash.jpg)

看起来这是一种比较完美的解决方案。

### 性能优化

为了进一步提升网站性能，一般都会把静态资源和动态网页分集群部署，静态资源会被部署到 `CDN` 节点上，网页中引用的资源也会变成对应的部署路径：

![release_static](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/release_static.jpg)

好了，当我要更新静态资源的时候，同时也会更新 `html` 中的引用吧，就好像这样：

![release_static_1](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/release_static_1.jpg)

页面和静态资源不在同一个机器上，我们就要面临一个问题，他们两者的部署，就必然会有一个时间差，那么是先上线页面呢，还是先上线静态资源呢？

- `先部署页面，再部署资源：`在二者部署的时间间隔内，如果有用户访问页面，就会在新的页面结构中加载旧的资源，并且把这个旧版本的资源当做新版本缓存起来，其结果就是：**<font color="FF9D00">用户访问到了一个样式错乱的页面，除非手动刷新，否则在资源缓存过期之前，页面会一直执行错误。</font>**

- `先部署资源，再部署页面：`在部署时间间隔之内，有旧版本资源本地缓存的用户访问网站，由于请求的页面是旧版本的，资源引用没有改变，浏览器将直接使用本地缓存，这种情况下页面展现正常；**<font color="FF9D00">但没有本地缓存或者缓存过期的用户访问网站，就会出现旧版本页面加载新版本资源的情况，导致页面执行错误，但当页面完成部署，这部分用户再次访问页面又会恢复正常了。</font>**

## 最终方案：非覆盖式发布 🌟🌟🌟

![release_static_2](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/release_static_2.jpg)

之前的方案之所以有问题，是因为在 `CDN` 上同名的文件只能有一份，它要么是老的要么是新的，不能同时存在，这种方式叫做`覆盖式发布`。

`非覆盖式发布`就是指我们不通过 `url` 参数带 `hash` 的方法解决缓存问题，而是直接将 `hash` 写入到静态资源的文件名中，这样的话不同版本的同一资源，文件名也不会重复。

我们在发布时，将新的资源推送到 `CDN` 之后并不会覆盖老的资源，它们两者在 `CDN` 上同时存在，这个时候访问新页面的用户加载新的资源，访问老的页面的用户加载老的资源，各不冲突，这样就可以完美的解决资源更新的问题了。
