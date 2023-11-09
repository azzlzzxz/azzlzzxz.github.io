# JWT

## 什么是 `JWT`

`JSON Web Token（JWT）`是目前最流行的跨域身份验证解决方案。

解决问题：`session` 不支持分布式架构，无法支持横向扩展，只能通过数据库来保存会话数据实现共享。如果持久层失败会出现认证失败。
优点：服务器不保存任何会话数据，即服务器变为无状态，使其更容易扩展。

`JWT` 包含了使用.分隔的三部分：

1. Header 头部

```lua
// 固定格式
{ "alg": "HS256", "typ": "JWT"}
// algorithm => HMAC SHA256
// type => JWT
```

2. `Payload` 负载、载荷

```lua
也可以自定义字段
JWT 规定了7个官方字段
iss (issuer)：签发人
exp (expiration time)：过期时间
sub (subject)：主题
aud (audience)：受众
nbf (Not Before)：生效时间
iat (Issued At)：签发时间
jti (JWT ID)：编号
```

3. `Signature` 签名：对前两部分的签名，防止数据篡改

```js
HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)
```

`JWT` 作为一个令牌`（token）`，有些场合可能会放到 `URL`（比如 `api.example.com/?token=xxx`）。`Base64` 有三个字符+、/和=，在 `URL` 里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成`_ `。这就是 `Base64URL` 算法。

## 使用方式

### `HTTP` 请求的头信息 `Authorization` 字段里面：

```lua
Authorization: Bearer <token>
```

### 通过 `url` 传输

```lua
http://www.xxx.com/pwa?token=xxxxx
```

如果是 `post` 请求也可以放在请求体中。

### 应用

```js
const Koa = require('koa')
const Router = require('koa-router')
const jwt = require('jwt-simple') // jsonwebtoken
const crypto = require('crypto')
const router = new Router()
const app = new Koa()

// jwt 原理实现
const jwt1 = {
  // 替换base64里的 + / =
  toBase64Url(content) {
    return content.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  },
  // 把主要内容转成base64
  toBase64(content) {
    return this.toBase64Url(Buffer.from(JSON.stringify(content)).toString('base64'))
  },
  // 加盐
  sign(content, secret) {
    return this.toBase64Url(crypto.createHmac('sha256', secret).update(content).digest('base64'))
  },
  // 把主要信息拼成传给客户端的token
  encode(payload, secret) {
    // payload 不能放敏感信息
    let header = this.toBase64({ typ: 'JWT', alg: 'HS256' })
    let content = this.toBase64(payload)
    let sign = this.sign(header + '.' + content, secret)
    return header + '.' + content + '.' + sign
  },
  // 解码base64也需要把- _ 空格反解回 + / =
  base64urlUnescape(str) {
    str += new Array(5 - (str.length % 4)).join('=')
    return str.replace(/\-/g, '+').replace(/_/g, '/')
  },
  // 客户端传的token通过密钥进行解析，如果老的和新的一致，说明没有被篡改
  decode(token, secert) {
    let [header, content, sign] = token.split('.')
    let newSign = this.sign(header + '.' + content, secret)
    if (sign == newSign) {
      return JSON.parse(Buffer.from(this.base64urlUnescape(content), 'base64').toString())
    } else {
      throw new Error('令牌出错')
    }
  },
}
router.get('/login', async (ctx) => {
  // 访问login时 我就给你生成一个令牌 返还给你
  let token = jwt1.encode(
    {
      username: 'admin',
      expires: '100',
    },
    'zfpx',
  )
  ctx.body = {
    token,
  }
})

router.get('/validate', async (ctx) => {
  let authorization = ctx.headers['authorization']
  // token的组成三部分 Header.Payload.Sign
  // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwaXJlcyI6IjEwMCJ9.n_npoDGiZEXqQ7lp71_m_LIv0fjfbEqGZYV3Hu5LcxI

  if (authorization) {
    let r = {}
    try {
      r = jwt1.decode(authorization.split(' ')[1], 'zfpx') // r 里面存放着过期时间

      // if(r.expires < Date.now().getTime()){
      //     // 过期了
      // }
    } catch (e) {
      console.log(e)

      // 在给你个新令牌
      r.messag = '令牌失效 '
    }
    ctx.body = {
      ...r,
    }
  }
})

app.use(router.routes())
app.listen(3000)
```
