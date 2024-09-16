# 命令

## `mac` 或 `linux` 中打开`.bashrc`，编辑完之后如何保存退出

这要主要看是用什么程序来编辑文件。

如果是 `vi`，则：`Esc`退出编辑模式，输入以下命令：

:::tip

1. `:wq` 保存后退出 `vi`，若为 `:wq!` 则为强制储存后退出（常用）
2. `:w`保存但不退出（常用）
3. `:w!` 若文件属性为『只读』时，强制写入该档案
4. `:q`离开 `vi` （常用）
5. `:q!` 若曾修改过档案，又不想储存，使用`!`为强制离开不储存档案。
6. `:e!` 将档案还原到最原始的状态！

:::

## `Mac`电脑解决`npm`权限不足问题，每次需要加`sudo`赋权限

### 更改项目文件夹权限

终端中，进入您的项目文件夹，并将其所有者更改为您当前的用户

```bash
sudo chown -R $(whoami) /path/to/your/project
```

### 更改全局`npm`安装位置

由于全局`npm`包的安装位置需要超级用户权限才能进行更改

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

将`~/.npm-global/bin`添加到您的`PATH`环境变量中。在`~/.bashrc`或`~/.bash_profile`文件中添加以下行

```bash
export PATH=~/.npm-global/bin:$PATH
```

保存文件后，执行以下命令以使更改生效

```bash
source ~/.bashrc
```
