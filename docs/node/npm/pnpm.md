# PNPM

[pnpm 官网](https://pnpm.io/zh/)

## pnpm 介绍

pnpm - performant npm，在 2017 年正式发布，定义为快速的，节省磁盘空间的包管理工具，开创了一套新的依赖管理机制，成为了包管理的后起之秀。

## 节省磁盘空间

使用 npm 时，依赖每次被不同的项目使用，都会重复安装一次。 而在使用 pnpm 时，依赖会被存储在内容可寻址的存储中，所以：

1. 如果你用到了某依赖项的不同版本，只会将不同版本间有差异的文件添加到仓库。 例如，如果某个包有 100 个文件，而它的新版本只改变了其中 1 个文件。那么 pnpm update 时只会向存储中心额外添加 1 个新文件，而不会因为仅仅一个文件的改变复制整新版本包的内容。
2. 所有文件都会存储在硬盘上的某一位置。 当软件包被被安装时，包里的文件会硬链接到这一位置，而不会占用额外的磁盘空间。 这允许你跨项目地共享同一版本的依赖。

因此，您在磁盘上节省了大量空间，这与项目和依赖项的数量成正比，并且安装速度要快得多！

![pnpm_one](../../.vuepress/public/images/pnpm_one.jpg)

### 硬链接

1. 硬链接就是多个文件名指向了同一个文件，这多个文件互为硬链接。
2. 通过硬链接，不会产生额外的磁盘占用，并且，两个文件都能找到相同的磁盘内容
3. 硬链接的数量没有限制，可以为同一个文件产生多个硬链接
4. 硬链接的概念来自于 Unix 操作系统，它是指将一个文件 A 指针复制到另一个文件 B 指针中，文件 B 就是文件 A 的硬链接

![hard_link](../../.vuepress/public/images/hard_link.jpg)

### 软连接(符号链接)

1. 软链接就是快捷方式，是一个单独文件。就像我们电脑桌面上的快捷方式，大小只有几字节，指向源文件，点击快捷方式，其实执行的就是源文件。
2. 符号链接又称为软连接，如果为某个文件或文件夹 A 创建符号连接 B，则 B 指向 A。

![symbol_link](../../.vuepress/public/images/symbol_link.jpg)

### 符号链接和硬链接的区别

1. 硬链接仅能链接文件，而符号链接可以链接目录
2. 硬链接在链接完成后仅和文件内容关联，和之前链接的文件没有任何关系。而符号链接始终和之前链接的文件关联，和文件内容不直接相关

### node 环境对硬链接和符号链接的处理

1. 硬链接：硬链接是一个实实在在的文件，node 不对其做任何特殊处理，也无法区别对待，实际上，node 根本无从知晓该文件是不是一个硬链接
2. 符号链接：由于符号链接指向的是另一个文件或目录，当 node 执行符号链接下的 JS 文件时，会使用原始路径。

## pnpm 原理

pnpm 引入了另一套依赖管理策略：内容寻址存储。

该策略会将包安装在系统的全局 store 中，依赖的每个版本只会在系统中安装一次。

在引用项目 node_modules 的依赖时，会通过硬链接与符号链接在全局 store 中找到这个文件。

node_modules 中每个包的每个文件都是来自内容可寻址存储的硬链接。 假设您安装了依赖于 bar@1.0.0 的 foo@1.0.0。 pnpm 会将两个包硬链接到 node_modules 如下所示：

```lua
node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>/bar
    │           ├── index.js
    │           └── package.json
    └── foo@1.0.0
        └── node_modules
            └── foo -> <store>/foo
                ├── index.js
                └── package.json
```

![pnpm_pj](../../.vuepress/public/images/pnpm_pj.jpg)

这是 node_modules 中的唯一的“真实”文件。 一旦所有包都硬链接到 node_modules，就会创建符号链接来构建嵌套的依赖关系图结构。

您可能已经注意到，这两个包都硬链接到一个 node_modules 文件夹（foo@1.0.0/node_modules/foo）内的子文件夹中。 这必要的：

1. 允许包自行导入自己。 foo 应该能够 require('foo/package.json') 或者 import \* as package from "foo/package.json"。
2. 避免循环符号链接。 依赖以及需要依赖的包被放置在一个文件夹下。 对于 Node.js 来说，依赖是在包的内部 node_modules 中或在任何其它在父目录 node_modules 中是没有区别的。

安装的下一阶段是符号链接依赖项。 bar 将被符号链接到 foo@1.0.0/node_modules 文件夹：

```lua
node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>/bar
    └── foo@1.0.0
        └── node_modules
            ├── foo -> <store>/foo
            └── bar -> ../../bar@1.0.0/node_modules/bar
```

![pnpm_form-data](../../.vuepress/public/images/pnpm_form-data.jpg)

接下来，处理直接依赖关系。 foo 将被符号链接至根目录的 node_modules 文件夹，因为 foo 是项目的依赖项：

```lua
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>/bar
    └── foo@1.0.0
        └── node_modules
            ├── foo -> <store>/foo
            └── bar -> ../../bar@1.0.0/node_modules/bar
```

![pnpm_axios](../../.vuepress/public/images/pnpm_axios.jpg)

这是一个非常简单的例子。 但是，无论依赖项的数量和依赖关系图的深度如何，布局都会保持这种结构。

让我们添加 qar@2.0.0 作为 bar 和 foo 的依赖项。 这是新的结构的样子：

```lua
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       ├── bar -> <store>/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo -> <store>/foo
    │       ├── bar -> ../../bar@1.0.0/node_modules/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    └── qar@2.0.0
        └── node_modules
            └── qar -> <store>/qar
```

<font color="#E9EBFE">如你所见，即使图形现在更深（foo > bar > qar），但目录深度仍然相同。</font>

这种布局乍一看可能很奇怪，但它与 Node 的模块解析算法完全兼容！ 解析模块时，Node 会忽略符号链接，因此当 foo@1.0.0/node_modules/foo/index.js 需要 bar 时，Node 不会使用在 foo@1.0.0/node_modules/bar 的 bar，相反，bar 是被解析到其实际位置（bar@1.0.0/node_modules/bar）。 因此，bar 也可以解析其在 bar@1.0.0/node_modules 中的依赖项。

这种布局的一大好处是只有真正在依赖项中的包才能访问。
