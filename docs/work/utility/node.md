# node 相关工具

## node 版本管理工具

### nvm

安装 `HomeBrew`

:::tip
[参考链接-HomeBrew](https://brew.idayer.com/)
:::

```sh
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

安装 `nvm`

```sh
#curl
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

#wget
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```

完成安装输入 `nvm --version` 可以查看当前 `nvm` 的版本，若遇到 `nvm:command not found` ,则编辑`.bash_profile` 文件，没有的话就新建一个，命令都是：

```sh
vi .bash_profile
```

然后将以下代码复制进去，保存退出

```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

然后 `source` 一下 `.bash_profile`

```sh
source .bash_profile
```

使用 `nvm`：

1. 查看当前 `node` 版本：`nvm current`
2. 切换 `node` 版本：`nvm use` 指定版本
3. 设置默认版本并切换：`nvm alias default` 指定版本
4. 查看安装的 `node` 列表：`nvm ls`

![nvm](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/nvm.png)

### `fnm`

:::tip
[参考链接-fnm](https://github.com/Schniz/fnm)
:::

安装 `fnm`

```sh
# homebrew
brew install fnm

# curl
curl -fsSL https://fnm.vercel.app/install | bash
```

使用 `fnm`

```sh
# fnm 版本
fnm --version

# 安装指定node版本
fnm install <版本号>

# 切换node版本
fnm use <版本号>

# 查看安装的node版本
fnm ls
```

## nrm (npm 镜像管理工具)

`npm registry` 管理工具，能够查看和切换当前使用的 `registry`

```sh
# 安装
npm install -g nrm

# 查看所有 registry
nrm ls

# 切换 registry
nrm use [registry 别名]

# 添加自定义 registry
nrm add [别名] [registry 地址]
```

- `nrm` 查询镜像地址返回

```lua
npm ---------- https://registry.npmjs.org/
yarn --------- https://registry.yarnpkg.com/
tencent ------ https://mirrors.cloud.tencent.com/npm/
cnpm --------- https://r.cnpmjs.org/
taobao ------- https://registry.npmmirror.com/
npmMirror ---- https://skimdb.npmjs.com/registry/
```

### 镜像获取/修改

```sh
# 切换源
npm set registry https://registry.npmjs.org/

# 检查源是否切换成功
npm config get registry
```
