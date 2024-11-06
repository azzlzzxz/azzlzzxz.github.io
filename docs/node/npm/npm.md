# NPM 常用命令

## `npx`

`npx:` `Node` 包的可执行运行器。

`npx` 和 `npm` 区别：

1. `npx` 是 `npm5.2.0` 版本之后新增的命令，可以直接运行安装在本地 `node_modules` 目录下的可执行文件，而不需要全局安装。`npm` 需要全局安装才能使用。

2. `npx` 可以直接运行远程仓库中的包，而不需要先安装到本地。`npm` 需要先安装到本地才能使用。

3. `npx` 可以避免全局安装的包版本冲突问题，因为它会优先使用本地的包。`npm` 需要全局安装，容易出现版本冲突问题。

```sh
npx create-react-app my-app
```

## 查看已安装的依赖包

```sh
# 当前项目
npm list --depth 0

# 全局
npm list -g --depth 0
```

## 查看依赖包的安装路径

```sh
# 当前项目
npm root

# 全局
npm root -g
```

## 清除缓存

```sh
npm cache clean -f
# OR
yarn cache clean
```

## `npm init`初始化

```sh
# 项目名
package name: (test)
# 版本号
version: (1.0.0)
# 项目描述
description:
# 入口文件
entry point: (index.js)
# 运行 test 脚本时所执行的命令
test command:
# 项目 git 地址
git repository:
# 关键字，用于 npm search
keywords:
# 作者
author:
# 开源协议
license: (ISC)
```

## `npm config` 配置文件

```sh
# 查看 npm 的配置
npm config list -l

# 查看 npm 配置
npm config get init.author.name

# 修改 npm 默认配置
npm config set init.author.name xxx

# 删除 npm 指定配置
npm config delete init.author.name
```

## `npm search` 搜索模块

```sh
npm search 搜索词 [-g]
```

## `npm install` 模块安装

```sh
# 安装最新包
npm install antd
# 安装指定版本
npm install antd@4.16.24
# 安装指定版本范围
npm install lodash@">=4.16.24 <4.16.24"

# 别名
i add

# 配置项
# 全局依赖
--global -g
# 生产环境依赖 dependencies (默认)
--save -S
# 开发环境依赖 devDependencies
--save-dev -D
```

## `npm uninstall` 模块卸载

```sh
# 卸载
npm uninstall antd
```

## `npm link`引用模块

```sh
# 在全局模块路径下中创建 link
npm link

# 在其他目录下创建一个从全局模块路径到项目模块路径的 link
# packageName 是取自包的 package.json 中 name 字段
npm link packageName

# 别名
ln

# 移除模块引用
npm unlink
```

## 发布相关命令

```sh
# 在 npmjs.com 注册一个用户
npm adduser

# 登录
npm login

# 将当前模块发布到 npmjs.com
npm publish
```
