# RestFul API

- RestFul 是面向资源。
- RestFul 是一种架构的规范和约束、原则。
- rest：资源的表述性状态转移（表述性：客户端请求一个资源，服务器拿到这个资源）
- 资源的地址：在 Web 中就是 URL（统一资源标识符）
- 资源是 Rest 系统的核心概念，所有的设计都是以资源为中心。

## RestFul 架构应该遵循统一接口原则。

不论什么样的资源，都是通过使用相同的接口进行资源的访问。

RestFul 可以通过一套统一的接口为 Web，iOS 和 Android 提供服务。

RestFul 架构风格规定，数据的元操作，即 CRUD(create, read, update 和 delete,即数据的增删查改)操作，分别对应于 HTTP 方法：

- GET 用来获取资源
- POST 用来新建资源（也可以用于更新资源）
- PUT 用来更新资源，DELETE 用来删除资源，这样就统一了数据操作的接口，仅通过 HTTP 方法，就可以完成对数据的所有增删查改工作。

## rest 和 RestFul 的区别

- rest 是一种架构风格。
- RestFul 是遵循了 rest 的原则 的 web 服务。
- retFul 是有 rest 衍生出来的。

### rest 原则

1. 网络上的所有事物都被抽象为资源。
2. 每一个资源都有一个唯一的资源标识符。
3. 同一个资源具有多种表现形式（xml、json 等）。
4. 对于资源的各种操作不会改变资源的标识符。 5.所有操作都是无状态的。

### 什么是无状态和有状态

- 有状态：后面每一个状态都依赖于前面的状态，没有一个 url，能够直接定位到想要的资源。
- 无状态：对每个资源请求，都不依赖于其他资源或其他请求。每个资源都可以寻址的，都有至少一个 url 能对其定位的。

### 在 RestFul 之前的操作

http://127.0.0.1/user/query/1 GET   根据用户 id 查询用户数据
http://127.0.0.1/user/save POST 新增用户
http://127.0.0.1/user/update POST 修改用户信息
http://127.0.0.1/user/delete GET/POST 删除用户信息

### RestFul 用法

http://127.0.0.1/user/1 GET   根据用户 id 查询用户数据
http://127.0.0.1/user  POST  新增用户
http://127.0.0.1/user  PUT  修改用户信息
http://127.0.0.1/user  DELETE  删除用户信息

## RestFul 中的请求方法有哪些

get、post、put、delete、head、options。

### PUT

put 方法在 Rest 中主要用于更新资源，因为大多数浏览器不支持 put 和 delete，会自动将 put 和 delete 请求转化为 get 和 post。

因此为了使用 put 和 delete 方法,需要以 post 发送请求，在表单中使用隐藏域发送真正的请求。

put 方法的参数是同 post 一样是存放在消息中的，同样具有安全性，可发送较大信息。

put 方法是幂等的，对同一 URL 资源做出的同一数据的任意次 put 请求其对数据的改变都是一致的。比如更新/student/2 的 name 值为 bobdylan，不论提交该请求多少次，/student/2 资源的 name 值会于提交一次请求无异。

### DELETE

Delete 在 Rest 请求中主要用于删除资源，因为大多数浏览器不支持 put 和 delete，会自动将 put 和 delete 请求转化为 get 和 post。

因此为了使用 put 和 delete 方法,需要以 post 发送请求，在表单中使用隐藏域发送真正的请求。

Delete 方法的参数同 post 一样存放在消息体中,具有安全性，可发送较大信息 Delete 方法是幂等的，不论对同一个资源进行多少次 delete 请求都不会破坏数据。

### OPTIONS

options 请求属于浏览器的预检请求，查看服务器是否接受请求，预检通过后，浏览器才会去发 get，post，put，delete 等请求。

至于什么情况下浏览器会发预检请求，浏览器会会将请求分为两类，简单请求与非简单请求，非简单请求会产生预检 options 请求。

### 两种请求方式

浏览器将 CORS 请求分为两类：简单请求（simple request）和非简单请求（not-simple-request）,简单请求浏览器不会预检，而非简单请求会预检。

**这两种方式怎么区分？**

同时满足下列三大条件，就属于简单请求，否则属于非简单请求

1. 请求方式只能是：GET、POST、HEAD。
2. HTTP 请求头限制这几种字段：Accept、Accept-Language、Content-Language、Content-Type、Last-Event-ID。
3. Content-type 只能取：application/x-www-form-urlencoded、multipart/form-data、text/plain。

对于简单请求，浏览器直接请求，会在请求头信息中，增加一个 origin 字段，来说明本次请求来自哪个源（协议+域名+端口）。

服务器根据这个值，来决定是否同意该请求，服务器返回的响应会多几个头信息字段，三个与 CORS 请求相关，都是以 Access-Control-开头。

1. Access-Control-Allow-Origin：该字段是必须的，\_ 表示接受任意域名的请求，还可以指定域名。
2. Access-Control-Allow-Credentials：该字段可选，是个布尔值，表示是否可以携带 cookie，（注意：如果 Access-Control-Allow-Origin 字段设置\_，此字段设为 true 无效）。
3. Access-Control-Allow-Headers：该字段可选，里面可以获取 Cache-Control、Content-Type、Expires 等，如果想要拿到其他字段，就可以在这个字段中指定。

非简单请求是对那种对服务器有特殊要求的请求，比如请求方式是 PUT 或者 DELETE，或者 Content-Type 字段类型是 application/json，都会在正式通信之前，增加一次 HTTP 请求，称之为预检。

浏览器会先询问服务器，当前网页所在域名是否在服务器的许可名单之中，服务器允许之后，浏览器会发出正式的 XMLHttpRequest 请求，否则会报错。（备注：之前碰到预检请求后端没有通过，就不会发正式请求，然后找了好久原因，原来后端给忘了设置...）Java 后端实现拦截器，排除 Options。

## 经典面试题 Get 与 Post 的区别

### 最普遍的答案

- GET 使用 URL 或 Cookie 传参，而 POST 将数据放在 BODY 中。
- GET 方式提交的数据有长度限制，则 POST 的数据则可以非常大。
- POST 比 GET 安全，因为数据在地址栏上不可见

**<font color="FF9D00">“标准答案”其实是错的</font>**

### GET 使用 URL 或 Cookie 传参，而 POST 将数据放在 BODY 中

GET 和 POST 是由 HTTP 协议定义的。

在 HTTP 协议中，Method 和 Data（URL， Body， Header）是正交的两个概念，也就是说，使用哪个 Method 与应用层的数据如何传输是没有相互关系的。

HTTP 没有要求，如果 Method 是 POST 数据就要放在 BODY 中。也没有要求，如果 Method 是 GET，数据（参数）就一定要放在 URL 中而不能放在 BODY 中。

那么，网上流传甚广的这个说法是从何而来的呢？我在 HTML 标准中，找到了相似的描述。这和网上流传的说法一致。但是这只是 HTML 标准对 HTTP 协议的用法的约定。怎么能当成 GET 和 POST 的区别呢？

而且，现代的 Web Server 都是支持 GET 中包含 BODY 这样的请求。虽然这种请求不可能从浏览器发出，但是现在的 Web Server 又不是只给浏览器用，已经完全地超出了 HTML 服务器的范畴了。

### GET 方式提交的数据有长度限制，则 POST 的数据则可以非常大

先说结论：HTTP 协议对 GET 和 POST 都没有对长度的限制。HTTP 协议明确地指出了，HTTP 头和 Body 都没有长度的要求。

首先是"GET 方式提交的数据有长度限制"，如果我们使用 GET 通过 URL 提交数据，那么 GET 可提交的数据量就跟 URL 的长度有直接关系了。而实际上，URL 不存在参数上限的问题，HTTP 协议规范没有对 URL 长度进行限制。这个限制是特定的浏览器及服务器对它的限制。IE 对 URL 长度的限制是 2083 字节(2K+35)。对于其他浏览器，如 Netscape、FireFox 等，理论上没有长度限制，其限制取决于操作系统的支持。

注意这个限制是整个 URL 长度，而不仅仅是你的参数值数据长度。

POST 也是一样，POST 是没有大小限制的，HTTP 协议规范也没有对 POST 数据进行大小限制，起限制作用的是服务器的处理程序的处理能力。
当然，我们常说 GET 的 URL 会有长度上的限制这个说法是怎么回事呢？虽然这个不是 GET 和 POST 的本质区别，但是我们也可以说说导致 URL 长度限制的两方面的原因：

1. 浏览器。早期的浏览器会对 URL 长度做限制。而现在的具体限制是怎么样的，我自己没有亲测过，就不复制网上的说法啦。
2. 服务器。URL 长了，对服务器处理也是一种负担。原本一个会话就没有多少数据，现在如果有人恶意地构造几个 M 大小的 URL，并不停地访问你的服务器。服务器的最大并发数显然会下降。另一种攻击方式是，告诉服务器 Content-Length 是一个很大的数，然后只给服务器发一点儿数据，服务器你就傻等着去吧。哪怕你有超时设置，这种故意的次次访问超时也能让服务器吃不了兜着走。有鉴于此，多数服务器出于安全啦、稳定啦方面的考虑，会给 URL 长度加限制。但是这个限制是针对所有 HTTP 请求的，与 GET、POST 没有关系。

3. POST 比 GET 安全，因为数据在地址栏上不可见

这个说法其实也是基于上面的 1，2 两点的基础上来说的，我觉得没什么问题，但是需要明白为什么使用 GET 在地址栏上就不安全了，以及还有没有其他原因说明“POST 比 GET 安全”。

通过 GET 提交数据，用户名和密码将明文出现在 URL 上，因为登录页面有可能被浏览器缓存，其他人查看浏览器的历史纪录，那么别人就可以拿到你的账号和密码了，除此之外，使用 GET 提交数据还可能会造成 Cross-site request forgery 攻击。

### 理解

1. GET 使用 URL 或 Cookie 传参，而 POST 将数据放在 BODY 中”，这个是因为 HTTP 协议用法的约定。并非它们的本身区别。
2. GET 方式提交的数据有长度限制，则 POST 的数据则可以非常大”，这个是因为它们使用的操作系统和浏览器设置的不同引起的区别。也不是 GET 和 POST 本身的区别。
3. POST 比 GET 安全，因为数据在地址栏上不可见”，这个说法没毛病，但依然不是 GET 和 POST 本身的区别。

### 终极区别

<font color="FF9D00">GET 和 POST 最大的区别主要是 GET 请求是幂等性的，POST 请求不是。</font>

这个是它们本质区别，上面的只是在使用上的区别。

什么是幂等性？

幂等性是指一次和多次请求某一个资源应该具有同样的副作用。简单来说意味着对同一 URL 的多个请求应该返回同样的结果。

正因为它们有这样的区别，所以不应该且不能用 get 请求做数据的增删改这些有副作用的操作。因为 get 请求是幂等的，在网络不好的隧道中会尝试重试。如果用 get 请求增数据，会有重复操作的风险，而这种重复操作可能会导致副作用（浏览器和操作系统并不知道你会用 get 请求去做增操作）。
