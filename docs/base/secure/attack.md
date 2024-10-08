# Web 安全相关知识

## `XSS` 跨站脚本攻击

`XSS`，是一种代码注入攻击，攻击者通过在目标网站上注入恶意脚本，使之在用户的浏览器上运行。利用这些恶意脚本，攻击者可获取用户的敏感信息如 `Cookie`、`SessionID` 等，进而危害数据安全。

- 存储型`XSS`

攻击者恶意通过页面输入框提交一段脚本代码到服务器，用户从服务器访问页面时会自动执行该脚本代码，从而进行攻击

- 反射型`XSS`

攻击者提供给用户一个包含恶意脚本的`URL`，用户打开`URL`后重定向到正常页面，同时执行恶意脚本代码

- `DOM`型`XSS`

攻击者通过修改`DOM`节点绑定的方法来促使用户正常交互时产生攻击行为

::: tip 如何解决

- 对用户的输入进行验证过滤

验证和过滤的目的是确保用户输入的数据符合预期的格式和内容，避免恶意脚本或非法字符的注入。

- 现代框架默认都会在 HTML 渲染到页面前进行`XSS`转义处理

- 富文本编辑时对内容进行转义后存储

- 使用 `CSP`（内容安全策略）：通过 `HTTP` 头中的 `Content-Security-Policy` 指令来指定哪些来源的脚本可以执行，哪些不能执行，阻止恶意脚本的加载。

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
```

:::

## `CSRF` 跨站请求伪造

`CSRF` 攻击是指用户在正常网站中登录后，访问了钓鱼网站，钓鱼网站获取到正常网站中的认证信息并伪造请求发送给正常网站服务端。

攻击方式主要包含：`img`标签等`src`属性、`form`标签的`action`、`a`标签的`href`

::: tip 如何解决

- 添加`Token`认证，客户端每次发起请求是都携带一个`token`标记，服务端对该标记进行验证

- 服务端处理请求前验证来源，检查 `HTTP` 请求头中的 `Referer` 或 `Origin` 是否来自信任的域

- 服务端返回`Cookie`时设置 `SameSite`，不允许第三方`Cookie`

:::

## `SQL` 注入

`SQL` 注入是通过在 `Web` 表单输入或 `URL` 参数中插入恶意 `SQL` 语句，从而操控数据库执行意外操作的攻击手段。

::: tip 如何解决

- 输入验证：严格验证和过滤所有用户输入，防止恶意字符或语句注入。

- 通过使用预处理语句或参数化查询，避免将用户输入直接拼接到 `SQL` 语句中，防止 `SQL` 注入。

:::

## `点击劫持`

点击劫持是一种攻击手段，攻击者通过在一个透明的框架中嵌入受信任网站的页面，诱使用户在不知情的情况下点击攻击者控制的恶意页面上的按钮或链接，从而执行攻击者意图的操作。

::: tip 如何解决

- 在`Http`头中加入 `X-Frame-Options` 属性，此属性控制页面是否可被嵌入 `iframe` 中

  - `DENY`：不能被所有网站嵌套或加载

  - `SAMEORIGIN`：只能被同域网站嵌套或加载

  - `ALLOW-FROM URL`：可以被指定网站嵌套或加载

- 使用 `CSP` `frame-ancestors`：通过设置 `CSP` 的 `frame-ancestors` 指令，限制哪些域可以嵌入当前页面，进一步减少点击劫持风险。

:::

## 文件上传漏洞

文件上传漏洞允许攻击者上传包含恶意代码的文件到服务器，并在服务器上执行这些文件。这类攻击会导致服务器被攻击者控制、网站篡改、数据泄露等严重后果。

::: tip 如何解决

- 限制文件类型和大小

- 文件名安全性检查：避免文件名中包含特殊字符或代码，防止攻击者利用文件名执行攻击

- 存储位置隔离：上传的文件应存储在与应用程序分离的文件存储位置上，并限制执行权限，防止文件被直接执行

:::

## `CDN`劫持

攻击者为了让用户能够登录自己开发的钓鱼网站，都会通过对`CDN`进行劫持的方法，让用户自动转入自己开发的网站，而很多用户却往往无法察觉到自己已经被劫持。

`CDN` 劫持的攻击形式一般包括以下几种：

- `DNS` 劫持：攻击者通过劫持 `DNS` 解析，将用户请求的域名解析到伪造的 `CDN` 节点上，从而实现内容篡改或插入恶意代码。

- `HTTP` 劫持：攻击者劫持 `HTTP` 请求，通过修改返回的响应内容，将合法的内容替换为恶意内容。

- `MITM（中间人攻击）`：攻击者在用户和 `CDN` 服务器之间的通信中间插入恶意节点，篡改传输的数据。

::: tip 如何解决

- 使用 `HTTPS` 强制加密传输

- 启用子资源完整性

  - 使用 `SRI` 验证静态资源：`SRI` 通过为资源（如 `JavaScript`、`CSS` 文件）生成哈希值，确保内容没有被篡改。如果 `CDN` 返回的文件内容和预期的哈希值不匹配，浏览器将拒绝加载该文件。

  - 注意使用正确的哈希算法（如 `SHA-256`）：确保资源的完整性检查更加安全和有效。

- `DNS` 安全防护：通过对 `DNS` 解析请求进行数字签名，防止 `DNS` 劫持攻击

:::
