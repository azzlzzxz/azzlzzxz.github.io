# NPM

[npm 官网](https://www.npmjs.com/)

## 介绍 NPM

npm（Node Package Manager）是一种用于管理 JavaScript 软件包和依赖项的包管理工具。它是 Node.js 生态系统的一部分，并且是最常用的 JavaScript 包管理器之一。以下是 npm 的一些关键特点和功能：

1. 包管理、发布、安装
2. 依赖项管理
3. 版本管理
4. 脚本运行

```json
package.json
{
  "private": true, // 是否私有
  "name": "xxx", // 包名/项目名
  "bin": {// 指定可执行文件的路径或命令
    "cli": "./bin/cli.js"
  },
  "description": "this is test project", // 描述
  "version": "1.0.0", // 版本
  "scripts": {
    // 脚本
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    // 仓库地址
    "type": "git",
    "url": "https://github.com/xxx/xxx.git"
  },
  "keywords": ["test", "project", "azzlzzxz"], // 搜索关键字
  "author": "xxx", // 作者npm用户
  "license": "ISC", // 开源协议
  "bugs": {
    // 项目问题跟踪器的 url 和/或应报告问题的电子邮件地址
    "url": "https://github.com/owner/project/issues",
    "email": "project@hostname.com"
  },
  "homepage": "https://github.com/xxx/xxx", // 主页
  "dependencies": {
    // 生产依赖
    "my_dep": "^1.0.0",
    "another_dep": "~2.2.0"
  },
  "devDependencies": {
    // 开发依赖
    "my_test_framework": "^3.1.0",
    "another_dev_dep": "1.0.0 - 1.2.0"
  }
}
```

- dependencies： 生产环境需要的依赖（-P/--save-prod）。
- devDependencies：工程只有开发环境需要，生产环境不需要的依赖（-D/--save-dev）。
- optionalDependencies：依赖是可选的，它们只有在运行时需要使用某些功能时才会被引入（-O/--save-optional）。
- peerDependencies：工程需要和这个依赖配套使用，一般用于解决插件依赖的核心库的版本和主项目依赖的核心库的版本不一致的问题，常见于开发配套插件。
- bundledDependencies：工程依赖于某些特定的依赖项，并且希望在运行时不必再次下载它们，则可以使用该选项（-B/--save-bundle）。

## 发布一个 npm 包(公共)

1. 首先需要到 [npm 官网](https://www.npmjs.com/) 注册一个 npm 账号。
   > 你也可以直接在本地执行 npm adduser 来创建账户
2. 在本地通过运行 npm login 登陆你的 npm 账号
   > npm 的账户管理是镜像维度的，所以当你切换镜像的时候用户也会跟着切换，也就是说如果你想把你的包发布到官方的 npm 上，那么你登陆时就需要将你的镜像设置为 npm 官方就像，如果你想发布到 taobao，那么你就需要切换为 taobao 镜像。
   > 随便推荐一个 npm 镜像管理工具 nrm，可以像 nvm 切换 node 一样方便的切换 npm 镜像。
   > npm whoami 可以查看到当前登陆的用户名
3. 初始化项目

   - npm init -y 可以在当前目录下快速初始化一个 package.json 文件

   ```json
   {
     "name": "azzlzzxz",
     "description": "this is test project",
     "version": "1.0.0",
     "repository": {
       "type": "git",
       "url": "https://github.com/xxx/xxx.git"
     },
     "keywords": ["test", "project", "azzlzzxz"],
     "author": "xxx",
     "license": "ISC",
     "bugs": {
       "url": "https://github.com/owner/project/issues",
       "email": "project@hostname.com"
     },
     "homepage": "https://github.com/xxx/xxx",
     "main": "index.js"
   }
   ```

   - 初始化一个 README.md 文件

   ```md
   这是一个测试的 npm 包
   ```

4. 编写代码/修改代码
   - 如果你是修改代码，那么你还需要修改 package.json 中的 version 来修改版本，或者也可以运行 npm version xxx 来智能的生成新版本号（命令参数详见官网或者 npm version -h ）
   - 升级版本：
     npm version patch : package.json 中的版本号 2.0.0 变为 2.0.1
     npm version minor : package.json 中的版本号 2.0.1 变为 2.1.0;
     npm version major : package.json 中的版本号 2.1.0 变为 3.0.0
5. 使用 npm publish 发布当前包到 npm 仓库
   > 注意你当前的镜像必须是 npm 官方镜像

## 发布属于某个 scope 或者组织下的包

在实际项目中，对于一些不能完全和项目或者框架解藕的 npm 包我们一般会将其发布到相应的命名空间或者组织下，例如 @vue/cli、 @vue/runtime-core、 @vue/composition-api...他们都是 vue 组织下的包，同理 @bable/xxx、@webpack/xxx 等也是一样的。当我们在开发一个公司内部的项目时一般也会搭建 npm 私服，然后在其中创建项目的 scope，然后将项目的 npm 发布上去。

1. 需要 name 用 @组织名 开头，例如 @vue/cli

   ```json
   {
     "name": "@azzlzzxz/form",
     "version": "1.0.4",
     "description": "",
     "main": "index.js",
     "keywords": ["test", "project"],
     "author": "azzlzzxz",
     "license": "ISC",
     "dependencies": {
       "jquery": "^3.6.0",
       "lodash": "<4.2.0"
     }
   }
   ```

2. 你的 npm 账户需要属于这个组织或者命名空间

   ```shell
    npm set registry http://nexus.xxx
    输入：npm config get registry 检查源是否切换成功

    在本地注册并登录用户
    npm adduser --registry http://nexus.xxx
   ```

3. 如果发布的包属于某一个 scope 或者组织，如果是非 npm 官方镜像（一般就是指私有 npm 仓库），那么你还需要配置 publishConfig.registry 来指定镜像地址。

```json
// package.json
{
  // ...
  "publishConfig": {
    "registry": "私有镜像地址"
  }
  // ...
}
```

4. 发布 npm 包
   ```shell
    npm publish --registry 'xxx：私服镜像源'
   ```

## 调试/修改包

我们在开发一个 @azzlzzxz/form 包时，经常会在本地先做一些测试或者修改。如果我们本地正好有一个项目 project1 在使用这个包时，使用这个项目来检验包的运行结果当然是不二之选，所以我就需要将我们修改的包给放入项目的 node_modules 中来替换线上的版本。这时候就需要使用到 npm link 命令了。

1. 在你的 @azzlzzxz/form 目录下运行 npm link 命令，不加任何参数。这一步会在你全局的 node_modules 下创建一个名为 @azzlzzxz/form 的链接（可以理解为快捷方式）链接到你的 @azzlzzxz/form 代码所在目录。

2. 在 project1 目录下运行 npm link @azzlzzxz/form ，这一步就是在 project1 的 node_modules 中再创建一个 @azzlzzxz/form 链接链接到全局的 node_modules/@azzlzzxz/form。

这样当你修改 @azzlzzxz/form 的代码时， project1 中的 @azzlzzxz/form 代码也会同步。

## 安装本地包

上面说到 npm link 可以创建链接直接链接到本地对应包的代码目录，但是当我们运行 npm i 或者 node_modules 丢失之类的情况时，再次安装就会出现去 npm 官网下载包代码而不是创建链接，原因是 npm link 并不会在 package.json 存在记录。但是有的时候我们想开发一个私有包，不想发布到 npm 上，又要运行 npm install 能正常安装这个包，那么我们可以用下面这种方式。

```shell
npm install 待安装包的相对路径
```

当运行 npm i ../bar 时，我们可以在 package.json 中看到相关信息

```json
{
  "name": "@azzlzzxz/form",
  "version": "1.0.4",
  "description": "",
  "main": "index.js",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@yuexi111/bar": "file:../bar", // <---- 这里
    "jquery": "^3.6.0",
    "lodash": "<4.2.0"
  }
}
```

## npm 常用的命令如何工作的

### npm run

npm run 是最常用的命令，他的作用是运行 pacgake.json 中指定的脚本

```json
// package.josn
{
  "name": "demo",
  "version": "1.0.7",
  "scripts": {
    "serve": "vue-cli-service serve"
  }
}
```

当我们运行 npm run serve 会查找 package.json 中 scripts 中 key 为 serve 对应的值来当作命令执行，也就是相当于执行了 vue-cli-service serve

这里有一个 npm 包：@azzlzzxz/hello_shell，他给我们提供了一个 hello 命令，我们来在项目中使用一下它。

```json
// package.json
{
  "name": "demo",
  "scripts": {
    "hello": "hello"
  },
  "dependencies": {
    "@azzlzzxz/hello_shell": "^1.0.0"
  }
}
```

当运行 npm run hello 时其实就相当于运行了 hello

那为什么我们要执行 npm run hello 而不直接执行 hello 呢？

> hello
> zsh: command not found: hello

为什么我们直接执行 hello 找不到命令，使用 npm run 来执行却可以？
原因是 npm run 执行脚本时会先去 node_modules/.bin 中查找是否存在要运行的命令，如果不存在则查找 ../node_modules/.bin，如果全都找不到才会去按系统的环境变量查找。

![hello.js](../../.vuepress/public/images/hello.jpg)

好在现在 node 给我们提供了 npx 命令来解决这个问题。运行 npx hello 即可运行 hello 命令。当然你也可以直接运行 node_modules/.bin/hello

> npx 可以让命令的查找路径与 npm run 一致

那么 node_modules/.bin 中的文件从哪来的呢？
npm i @azzlzzxz/hello_shell 时会将 @azzlzzxz/hello_shell 中的 package.json 中的 bin 指定的命令和文件链接到 node_modules/.bin，也就是说 node_modules/.bin/hello 其实是 node_modules@azzlzzxz/hello_shell/bin/index.js 的快捷方式

```json
// package.json
{
  "name": "@azzlzzxz/hello_shell",
  "version": "1.0.0",
  "description": "一个描述",
  "keywords": [],
  "bin": {
    "hello": "bin/hello_shell.js" // 指定运行 hello 命令时运行的文件
  },
  "license": "ISC"
}
```

```js
// bin/index.js
#!/usr/bin/env node
console.log('Hello NPM')
```

当运行 npx hello 时自然就相当于运行了 @yuexi111/hello_shell/bin/index.js

- 当我们使用 npm install 安装包时，会将这个包中 package.json 中 bin 中指定的脚本软链接到项目的 node_modules/.bin 下，key 作为链接名字（也就是命令），value 作为命令运行时执行的文件

- 当我们通过 npm run xxx 运行某个脚本时，会执行 package.json 中 scripts 中指定的脚步后的命令，会先去 node_modules/.bin 中查找这些命令，然后去 ../node_modules/.bin,...全都找不到才会去环境变量中查找。

### npm install

假如我们从 github 上 conle 了一个项目，他的 package.json 是这样的：

```json
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@azzlzzxz/form": "^1.0.4",
    "@azzlzzxz/table": "^1.0.1"
  }
}
```

当我们去运行 npm install 的时候，会经过一下几步:

#### 执行工程自身 preinstall 钩子

npm 跟 git 一样都有完善的钩子机制散布在 npm 运行的各个阶段，当前 npm 工程如果定义了 preinstall 钩子此时会在执行 npm install 命令之前被执行。

```json
// 如何定义钩子：直接在 scripts 中定义即可
// package.json
{
  // ...
  "scripts": {
    "preinstall": "echo \"preinstall hook\"",
    "install": "echo \"install hook\"",
    "postinstall": "echo \"postinstall hook\""
    // ...
  }
  // ...
}
```

常用的 npm hooks 包括：

1.  preinstall：在安装依赖前执行的脚本
2.  postinstall：在安装依赖后执行的脚本
3.  prestart：在启动应用前执行的脚本
4.  poststart：在启动应用后执行的脚本
5.  pretest：在执行测试前执行的脚本
6.  posttest：在执行测试后执行的脚本
7.  prebuild：在打包前执行的脚本
8.  postbuild：在打包后执行的脚本
9.  prepublish：在发布前执行的脚本
10. postpublish：在发布后执行的脚本

#### 获取 package.json 中依赖数据构建依赖树

首先需要做的是确定工程中的首层依赖，也就是 dependencies 和 devDependencies 属性中直接指定的模块（假设此时没有添加 npm install 的其他参数）。

> 工程本身是整棵依赖树的根节点，每个首层依赖模块都是根节点下面的一棵子树，npm 会开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点。

确定完首层依赖后，就开始获取各个依赖的模块信息，获取模块信息是一个递归的过程，分为以下几步：

1. 获取模块信息。在下载一个模块之前，首先要确定其版本，这是因为 package.json 中往往是 semantic version（semver，语义化版本）。此时如果版本描述文件（npm-shrinkwrap.json 或 package-lock.json）中有该模块信息直接拿即可，如果没有则从仓库获取。如 packaeg.json 中某个包的版本是 ^1.1.0，npm 就会去仓库中获取符合 1.x.x 形式的最新版本。

2. 获取模块实体。上一步会获取到模块的压缩包地址（resolved 字段），npm 会用此地址检查本地缓存，缓存中有就直接拿，如果没有则从仓库下载。

3. 查找该模块依赖，如果有依赖则回到第 1 步，如果没有则停止。

最终会得到一个类似下图中的依赖树:
![npm](../../.vuepress/public/images/npm.jpg)

> 如果项目中存在 npm 的 lock 文件（例如 package-lock.json），则不会从头开始构建依赖树，而是对 lock 中依赖树中存储冲突的依赖进行调整即可

#### 依赖树扁平化（dedupe）

上一步获取到的是一棵完整的依赖树，其中可能包含大量重复模块。比如 form 模块依赖于 antd, table 模块同样依赖于 antd。在 npm3 以前会严格按照依赖树的结构进行安装，也就是方便在 form 和 table 的 node_modules 中各安装一份，因此会造成模块冗余。

​ 从 npm3 开始默认加入了一个 dedupe 的过程。它会遍历所有节点，逐个将模块放在根节点下面，也就是 node_modules 的第一层。当发现有重复模块时，则将其丢弃。

经过优化后的依赖树就是变成了下面这样:
![npm_opt](../../.vuepress/public/images/npm_opt.jpg)

> 而 lock 文件中存储的正是这颗被优化后的依赖树。

这里需要对重复模块进行一个定义，它指的是模块名相同且 semver(语义化版本) 兼容。每个 semver 都对应一段版本允许范围，如果两个模块的版本允许范围存在交集，那么就可以得到一个兼容版本，而不必版本号完全一致，这可以使更多冗余模块在 dedupe 过程中被去掉。

比如 node_modules 下 form 模块依赖 antd@^4.0.0，tale 模块依赖 antd@^4.1.0，则 >=4.1.0 的版本都为兼容版本。

而当 foo 依赖 antd@^5.0.0，bar 依赖 antd@^4.1.0，则依据 semver 的规则，二者不存在兼容版本。会将一个版本放在首层依赖中，另一个仍保留在其父项（foo 或者 bar）的依赖树里。

举个栗子 🌰，假设一个依赖树原本是这样:

```lua
node_modules
|--form
   |-- antd@version1
|--table
   |-- antd@version2
```

假设 version1 和 version2 是兼容版本，则经过 dedupe 会成为下面的形式：

```lua
node_modules
|--form
|--table
|--antd（保留的版本为兼容版本）
```

假设 version1 和 version2 为非兼容版本，则后面的版本保留在依赖树中：

```lua
node_modules
|--form
|--antd@version1
|--table
   |-- antd@version2
```

#### 安装模块

这一步将会按照依赖树下载/解压包，并更新工程中的 node_modules。

![update_node_modules](../../.vuepress/public/images/update_node_modules.jpg)

### npm ci

npm ci 命令可以完全安装 lock 文件描述的依赖树来安装依赖，可以用它来避免扁平化造成的 node_modules 结构不确定的问题。

**npm ci** 和 **npm i** 不仅仅是是否使用 package-lock.json 的区别，npm ci 会删除 node_modules 中所有的内容并且毫无二心的按照 package-lock.json 的结构来安装和保存包，他的目的是为了保证任何情况下产生的 node_modules 结构都一致的。而 npm i 不会删除 node_modules（如果 node_modules 已经存在某个包就不会重新下载了）、并且安装过程中可能还会调整并修改 package-lock.json 的内容

> 实际项目中建议将 lock 也添加到 git 中，尽量使用 npm ci 来安装依赖，如果有依赖需要修改的，可以通过 npm install xxx@xxx 来安装指定依赖的指定版本，这样只会调整 lock 文件中指定依赖的依赖树，不会修改其他依赖的依赖树。

### npm cache clean –force

是强制清除~/.npm 目录下的压缩包（清除缓存）

## package-lock.json

背景

npm 使用 semver 版本控制，方便开发者使用特定的版本跟踪策略，比如：自动更新一些版本（bug 修复等）
但是 npm semver 版本控制策略可能导致一些问题：

1. 团队内不同的队友（teammates）可能实际上依赖的版本并不一致
2. 本地开发环境或者其他环境阶段安装的依赖不一致
3. 这些运行时环境不一致的问题，最终可能导致本地或者测试环境能够正常运行的代码，在生产环境中却产生了异常。

为了达到不同成员、不同环境的依赖保持一致的效果，采用了 package-lock.json 来锁定特定的版本。

package-lock.json 组成

```json
{
  "name": "assets-system", //和package.json中name保持一致
  "version": "0.1.0", // 和package.json中name保持一致
  "lockfileVersion": 1,
  "requires": true,
  "packages": {},
  "dependencies": [] //当前包的依赖锁定依赖树
}
```

部分字段说明：

```json
"react": {
  "version": "18.2.0",
  "resolved": "http://nexus.fenxianglife.com/repository/npm-public/react/-/react-18.2.0.tgz",
  "integrity": "sha512-/3IjMdb2L9QbBdWiW5e3P2/npwMBaU9mHCSCUzNln0ZCYbcfTsGbTJrU/kGemdH2IWmB2ioZ+zkxtmq6g09fGQ==",
  "requires": {
    "loose-envify": "^1.1.0"
  }
},
```

1. resolved：依赖包的下载地址，对应使用 npm registry 安装的依赖。
2. integrity：是用来验证资源的完整性，即是否是我期望加载的资源，而不是被别人篡改了内容。

## npm 存在的问题

### 依赖结构不确定

假如项目依赖两个包 a 和 b，这两个包的依赖又是这样的:

![depend_one](../../.vuepress/public/images/depend_one.jpg)

那么 npm install 的时候，通过扁平化处理之后，究竟是这样:

![depend_second](../../.vuepress/public/images/depend_second.png)

还是这样:

![depend_three](../../.vuepress/public/images/depend_three.png)

答案是: 都有可能。取决于 a 和 b 在 package.json 中的位置，如果 a 声明在前面，那么就是前面的结构，否则是后面的结构。
这就是为什么会产生依赖结构的不确定问题，也是 lock 文件诞生的原因之一，无论是 package-lock.json(npm 5.x 才出现)还是 yarn.lock，都是为了保证 install 之后都产生确定的 node_modules 结构。

### 扁平化导致可以非法访问没有声明过依赖的包（幽灵依赖）

“幽灵依赖” 指的是项目代码中使用了一些没有被定义在其 package.json 文件中的包。

考虑下面的例子：

```json
// package.json
{
  "name": "demo",
  "main": "index.js",
  "dependencies": {
    "minimatch": "^3.0.4"
  },
  "devDependencies": {
    "rimraf": "^2.6.2"
  }
}
```

但假设代码是这样：

```json
// index.js
var minimatch = require("minimatch")
var expand = require("brace-expansion");  // ???
var glob = require("glob")  // ???

// （更多使用那些库的代码)
```

有两个库根本没有被作为依赖定义在 package.json 文件中。那这到底是怎么跑起来的呢？
原来 brace-expansion 是 minimatch 的依赖，而 glob 是 rimraf 的依赖。在安装的时候，NPM 会打平他们的文件夹到 node_modules。NodeJS 的 require() 函数能够在依赖目录找到它们，因为 require() 在查找文件夹时 根本不会受 package.json 文件 影响。

这是很不安全的，当未来 minimatch 中不再依赖 brace-expansion 时将会导致项目报错，因为那时整个项目可能没有如何包依赖了 brace-expansion，也就不会在顶层依赖树中有 brace-expansion，所以项目一定会因为找不到 brace-expansion 这个包而报错。

### 又慢又大

#### 分析依赖树

npm 在分析依赖树的时候会先并行发出项目顶级的依赖解析请求，当某一个请求回来时，在去请求起所有的子依赖，直到不存在依赖为止，由于每一个树都需要根节点的依赖解析请求后才能开始解析其子树，如果依赖树深度比较深就会导致等待时间过长

![deped_four](../../.vuepress/public/images/depend_four.jpg)

递归的分析依赖树需要非常大量的 http 请求，这也会导致依赖树构建时间过长

这里推荐一个分析依赖树的工具 npm-remote-ls

可视化依赖关系：[npm.anvaka](https://npm.anvaka.com/#/)

#### 大量文件下载/解压

因为 npm 下载的内容是一个个压缩包，解压后文件数量多，需要大量的 IO 操作（创建文件夹、创建文件、写入文件...），这也是导致 npm 慢的主要原因。

#### 依然可能存在大量重复包

扁平化只能会在首次遇到一个包时才会将其提升到顶部，如果项目中有 A、B、C 三个包分别依赖了D@1.0.0、D@2.0.0、D@2.0.0，那么可能会产生D@1.0.0被提升，D@2.0.0出现在 B、C 的 node_modelus 的情况。
