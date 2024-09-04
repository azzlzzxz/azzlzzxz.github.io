# 图床搭建

阿里云`OSS` + `PicGo`

## 阿里云`OSS`

[阿里云官网](https://www.aliyun.com/?spm=5176.28508143.J_4VYgf18xNlTAyFFbOuOQe.d_logo.5402154awjlyU4)

### 开通`OSS`服务

如果你还没有开通对象存储服务 OSS，那么点击立即开通。

### 创建`Bucket`

进入控制台之后，点击红框的立即创建或者创建`Bucket`，都可以创建`Bucket`。

![Bucket](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/create_bucket.jpg)

接下来填一些必填的信息：

- `Bucket` 名称：必须全局唯一，和你在游戏中取的名字一样，不能和别人的重名，一旦创建不可更改。

- 地域：选择“有地域属性”，然后选择一个离自己位置近的地域，存储类型：选择“标准存储”即可。

- 存储冗余类型：推荐选择“本地冗余存储”，“同城冗余存储”更贵，如果网站有较高的并发流量可以选择这个。

- 读写权限：一定要选择“公共读”，否则平台无法通过公网访问 `Bucket` 中的内容。

- 其他选择默认，无需修改。

![bucket](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/bucket.jpg)

### 记下`Bucket`信息

进入概览页面，这里可以看到`Bucket`的整体信息。
用文本软件记下红框画起来的几个信息，等会儿配置`PicGo`要用：

- `Bucket`名称：`xxxx`
- `Endpoint`（地域节点）：`xxxx`
- `Bucket域名`（外网地址）：`xxxx`

### 创建`AccessKey`

在页面右上角，鼠标放在头像处，在弹出的框里选择`AccessKey`管理：

![accesskey](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/accesskey.jpg)

在弹出的选项框里，选择继续使用`AccessKey`。
![use_accesskey](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/use_accesskey.jpg)

点击创建`AccessKey`，在弹出的安全验证窗口中，选择一个方式来通过安全验证。
![accesskey_verify](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/accesskey_verify.jpg)

验证好之后把 `AccessKey ID` 和 `Access Key Secret` 保存好，也可以下载下来。

### 创建子账户用来配置`PicGo`

上面生成的`AccessKey`是主账户的，它也可以用来配置`picgo`，但是如果我们只是需要使用`OSS`，强烈建议使用子账号来访问这个`Bucket`，这样可以规避主账户`AccessKey`或者密码泄露导致的问题。步骤如下：

- 点击创建 `AccessKey`，再点击开始使用子用户 `AccessKey`
  ![use_accesskey](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/use_accesskey.jpg)

点击创建用户
![accesskey_create_user](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/accesskey_create_user.jpg)

填写好登录名称，显示名称，勾选控制台访问，OpenAPI 调用访问，其他选择默认就好，点击确认，在弹出的安全验证中选择一种方式完成验证。
![accesskey_user_create](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/accesskey_user_create.jpg)

将创建好的的 AccessKey Id 和 AccessKey secret 复制出来保存好。

### 配置子账户`OSS`权限

勾选中用户，点击添加权限，再点击下面两项权限，加到已选择框中。

选择这两项：

- `AliyunOSSFullAccess`——管理对象存储服务`（OSS）`权限

- `AliyunOSSReadOnlyAccess`——只读访问对象存储服务`（OSS）`的权限

## 配置 PicGo

`PicGo`是一款功能非常强大的图床工具，支持`SM.MS`、`腾讯COS`、`GitHub`图床、七牛云图床、`Imgur`图床、阿里云`OSS`、`gitee`等多种图床平台。

[PicGo 下载地址](https://molunerfinn.com/PicGo/)

![picgo_home](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/picgo_home.jpg)

### `PicGo`配置阿里云`OSS`

点击图床设置，阿里云`OSS`，点击画笔修改。

![picgo_disposition](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/picgo_disposition.jpg)

填上前面记录好的值即可：

- `AccessKey ID`（账号）：`xxxxxxxxxx`

- `AccessKey Secret`（密钥）：`xxxxxxxxxx`

- 设定`Bucket`：刚刚在阿里云`OSS`中创建的`Bucket`名称

- 设定存储区域：地域节点中的第一个字段
  这里要注意，设定存储区域里要填的是之前记下来的地域节点里面的第一个字段，比如你的地域节点值是`oss-cn-hangzhou.aliyuncs.com`，那么这里只需要填`oss-cn-hangzhou`，切记，否则配置失败无法上传图片。

- 设定存储路径：自定义，以/结尾（相当于文件夹），例如 `img/`

填完了记得拉到下面点击确认保存。

![picgo_config](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/picgo_config.jpg)

## 问题

### `Mac`系统安装`PicGo`时打开报错：文件已损坏

打开终端输入以下内容：

```bash
sudo xattr -d com.apple.quarantine "/Applications/PicGo.app"
```
