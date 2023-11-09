# Cookie&Session

## Cookie

### `cookie` 设置

- 服务端设置的响应头是 `set-cookie`，客户端设置的请求头是 `cookie`。
- 服务端设置 `cookie` 后会带给客户端，之后客户端的每次请求都会带上 `cookie` 给服务端。
- `cookie` 里的字段：
  - `max-age`（多少秒生效）/ `Expries（绝对时间）`。
  - `domain` 针对那个域名生效，（ `a.zhufeng.com b.zhufeng.com` ：二级域名一样，一级域名不同（可以让这两个域名共享 `cookie`，原则上来说它们俩是同一个网站）） 通过设置 `.zhufeng.com `表示不管是 `a` 还是 `b` 都能访问，如果写死 `a.zhufeng.com` 就表示只能在这个里访问。
  - `path` 限制只能在某个路径来访问 `cookie`。
  - `httpOnly` 可以实现相对安全一些 防止浏览器随便更改。
- 设置 `cookie` 时要避免重名。
- `cookie` 是由多个由空格分号隔开的字段所组成。

```js
const http = require('http')
const querystring = require('querystring')

// 服务端设置的是set-cookie 客户端设置的是 cookie字段
// cookie 存活时间
const server = http.createServer((req, res) => {
  let arr = []
  res.setCookie = function (key, value, options = {}) {
    // 给res扩展setCookie方法
    let args = []
    if (options.maxAge) {
      args.push(`max-age=${options.maxAge}`)
    }
    if (options.domain) {
      args.push(`domain=${options.domain}`)
    }
    if (options.path) {
      args.push(`path=${options.path}`)
    }
    if (options.httpOnly) {
      args.push(`httpOnly=${options.httpOnly}`)
    }
    arr.push(`${key}=${value}; ${args.join('; ')}`)
    res.setHeader('Set-Cookie', arr)
  }
  // 当用户访问  /read 表示读取cookie
  if (req.url === '/read') {
    // cookie是由多个 由分号空格隔开的字段
    // name=zf; age=10  name=zf&age=10
    let result = querystring.parse(req.headers.cookie, '; ', '=')
    res.end(JSON.stringify(result))
  } else if (req.url == '/write') {
    // max-age (多少秒生效)/Exipres(绝对时间)
    // domain 针对哪个域名生效 （二级域名一样，一级域名不同（可以让这两个域名共享cookie，原则上来说它们俩是同一个网站） a.zhufeng.com b.zhufeng.com） 通过设置 .zhufeng.com 表示不管是a还是b都能访问，如果写死a.zhufeng.com就表示只能在这个里访问
    // res.setHeader('Set-Cookie',[`name=zf; max-age=10; expires=${new Date(Date.now()+10*1000*1000).toGMTString()}`,"age=10"]); // max-age和expires同时设置，以max-age为准
    // path 限制只能在某个路径来访问cookie
    // httpOnly可以实现相对安全一些 防止浏览器随便更改

    // 设置cookie要避免重名
    // C:\Windows\System32\drivers\etc\hosts（映射表）
    res.setCookie('name', 'aa', {
      maxAge: 100,
      // path:'/write', // 在write路径开头下才能访问
      domain: 'zf.cn', // 增加domain 可以设置二级域名访问 , 减少cookie的发送
      httpOnly: true, // 只能服务端来操作cookie
    })
    res.setCookie('age', 10) // 不加domain默认是当前域名
    res.end('write ok')
  }
  // /write 时候写入cookie
})

server.listen(3000)
```

### 加盐算法

1. 加盐算法是可以使 `cookie` 更安全：可以通过服务端设置 `cookie` 时对应一个标识，如果客户端更改了 `cookie`，那么再请求时，客户端带的 `cookie` 就对应不上服务端 `cookie` 的标识了，这样就提高了安全性。
2. 加盐算法：放入不同的密钥，产生的结果不同，并且不可逆，密钥就是盐值（别人不知道盐值多少，就不能签出同样的值）。
3. 为什么不用 `md5`：这样的话别人可以通过改 `cookie` 值，在生成对应的 `md5`，来骗过服务器）（服务器返回 5->1（有 4->2），客户端知道是 `md5` 就改成 4->2 骗服务器。

```js
const http = require('http')
const querystring = require('querystring')
const crypto = require('crypto')

function sign(value) {
  // 加盐算法 放入不同的秘钥 产生不同的结果 不可逆的 盐值 （别人不知道盐值多少，就不能签出同样的值）
  // base64 传输的过程中 + = / 都转换成空字符串，会导致客户端传来的和服务端的不匹配。
  // 在传输base64时需要转化 + = /  /转换成_  + 变成 - = 变成空
  // 'SteinsGate'是密钥，只要密钥不丢失，加盐数据就安全
  // 同样的只加同样的盐产生的结果是一样的
  return crypto
    .createHmac('sha256', 'SteinsGate')
    .update(value)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
const server = http.createServer((req, res) => {
  let arr = []
  res.setCookie = function (key, value, options = {}) {
    let args = []
    if (options.maxAge) {
      args.push(`max-age=${options.maxAge}`)
    }
    if (options.domain) {
      args.push(`domain=${options.domain}`)
    }
    if (options.path) {
      args.push(`path=${options.path}`)
    }
    if (options.httpOnly) {
      args.push(`httpOnly=${options.httpOnly}`)
    }
    if (options.signed) {
      // 值.签名
      value = value + '.' + sign(value)
    }
    arr.push(`${key}=${value}; ${args.join('; ')}`)
    res.setHeader('Set-Cookie', arr)
  }
  req.getCookie = function (key, options = {}) {
    let result = querystring.parse(req.headers.cookie, '; ', '=')
    let [value, s] = (result[key] || '').split('.')
    if (options.signed) {
      // 要校验签名
      if (s == sign(value)) {
        return value
      } else {
        return undefined
      }
    } else {
      return value
    }
  }
  if (req.url === '/read') {
    let ret = req.getCookie('name', {
      // 将name对应的值解析出来
      // singed:true
    })
    res.end(ret)
  } else if (req.url == '/write') {
    res.setCookie('name', 'hello', {
      maxAge: 100,
      httpOnly: true,
      signed: true,
    })
    res.setCookie('age', 10)
    res.end('write ok')
  }
  // /write 时候写入cookie
})

server.listen(3000)
```

## `session`

`session` 里储存着映射关系：就是服务端存在客户端里的标识对应，服务端的用户敏感数据。

```js
const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const crypto = require('crypto')

// koa 是专门用了一个字段来描述签名 xxx.sign = Lo4m0cBzLMPW7T6FF06Gj8l5i5Y
// console.log(crypto.createHmac('sha1','zfpx').update(`visit=9`).digest('base64'))

app.keys = ['zfpx']
const session = {} //用来记录映射关系的 如果刷新会丢失数据 ,可用用redis 或者mongo 存储session
const CardName = 'connect.sid' // 卡的名字
router.get('/visit', (ctx, next) => {
  let cardId = ctx.cookies.get(CardName)
  if (cardId && session[cardId]) {
    session[cardId].mny -= 10
    ctx.body = `您有${session[cardId].mny}元充值卡`
  } else {
    let cardId = Math.random() + Date.now().toString()
    ctx.cookies.set(CardName, cardId)
    session[cardId] = { mny: 100 }
    ctx.body = `您有100元充值卡`
  }
  // let visit = ctx.cookies.get('visit',{signed:true});
  // if(visit){
  //     visit++;
  // }else{
  //     visit = 1;
  // }
  // ctx.cookies.set('visit',visit,{signed:true});
  // ctx.body = `当前第${visit}次访问`
})
app.use(router.routes())
app.listen(3000)
```

## 区别

1. `Cookie` 可以在客户端、服务端设置，但是 `cookie` 在每次请求都会携带上，不安全，因为放在客户端浏览器里了，那么用户就可以随便更改 `cookie`。
2. `session` 是基于 `cookie` 来使用的，每次给用户注册一个唯一标识，用户可以通过唯一标识去找到对应的数据，去更改，核心数据是存在服务器端的，客户端是不能随便更改的。
3. `localStorage` `sessionStorage` 只能在本地访问 不能超过 `5M` (不会在请求中携带)
4. `cookie` `http` 无状态协议 （用来识别请求的） 客户端和服务端都可以使用 , 每次请求会自动携带 `cookie`， 跨域默认不能携带 `cookie` (`cookie` 是存放在客户端 安全问题 `csrf`) (合理设置 `cookie` 否则每次请求都会携带 `cookie` 4k)
5. `session` 是基于 `cookie` 的 `session` 只是一个对象存放在服务端中，通过一个唯一标识可以找到对应的信息，标识是通过 `cookie` 来发送的 （理论上没有限制的：代表的是服务器的内存）
