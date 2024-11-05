# Zsh 配置

## `oh-my-zsh`

[oh-my-zsh](https://ohmyz.sh/)

安装

```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# OR 国内镜像
sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"
```

更新

```sh
omz update
```

## `zinint`

安装

```sh
# 下载安装脚本
bash -c "$(curl --fail --show-error --silent --location https://raw.githubusercontent.com/zdharma-continuum/zinit/HEAD/scripts/install.sh)"
```

更新

```sh
# 更新 zinit
zinit self-update

# 更新所有插件
zinit update

# 并发更新所有插件
zinit update --parallel
```

加载插件

```sh
# 加载插件（启动分析功能跟踪插件具体）
zinit load [插件]

# 加载插件（静默加载，启动更快）
zinit light [插件]
```

卸载

```sh
# 卸载插件
zinit delete [插件]

# 卸载所有插件
zinit delete --all

# 卸载所有未使用插件
zinit delete --clean
```

## `zsh` 插件

### `autojump`

用于常用目录间的快速跳转（通过维护命令行中最常用的目录的数据库来工作）

```sh
# 安装
brew install autojump
```

- [<u>autojump | Github</u>](https://github.com/wting/autojump)

### `zsh-autosuggestions`

根据您的历史记录和完成情况建议您键入的命令

:::: code-group

```sh [oh-my-zsh]
# clone
git clone --depth=1 git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions

# 在 ~/.zshrc 中配置
plugins=(其他插件 zsh-autosuggestions)

# 使配置生效
source ~/.zshrc
```

```sh [zinit]
# 在 ~/.zshrc 中配置
zinit ice lucid wait="0" atload="_zsh_autosuggest_start"
zinit light zsh-users/zsh-autosuggestions

# 使配置生效
source ~/.zshrc
```

::::

### `zsh-completions`

`zsh` 的自动补全功能。

```sh
# clone
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions

# 在 ~/.zshrc 中配置
plugins=(其他插件 zsh-completions)

# 使配置生效
source ~/.zshrc
```

### `fast-syntax-highlighting`

`zsh` 的语法高亮功能。

:::: code-group

```sh [oh-my-zsh]
# clone
git clone --depth=1 https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting

# 在 ~/.zshrc 中配置
plugins=(其他插件 fast-syntax-highlighting)

# 使配置生效
source ~/.zshrc
```

```sh [zinit]
# 在 ~/.zshrc 中配置
zinit light zdharma-continuum/fast-syntax-highlighting

# 使配置生效
source ~/.zshrc
```

::::

## `zsh` 主题

### `powerlevel10k`

安装

:::: code-group

```sh [oh-my-zsh]
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# 在 ~/.zshrc 中配置
ZSH_THEME="powerlevel10k/powerlevel10k"

# 使配置生效
source ~/.zshrc
```

```sh [zinit]
# 在 ~/.zshrc 中配置
zinit ice depth=1
zinit light romkatv/powerlevel10k

# 使配置生效
source ~/.zshrc
```

::::

配置

> 使用 [iTerm2](/efficiency/software/mac#iterm2) 可自动安装所需字体

```sh
p10k configure
```

修改字体

`Powerlevel10k` 推薦使用 `Meslo Nerd Font`

- [MesloLGS NF Regular.ttf](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/MesloLGS%20NF%20Regular.ttf)

![iterm2_config](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/iterm2_config.jpg)

修复 `vscode` 终端图标乱码，修改 `terminal.integrated.fontFamily`为 `"MesloLGS NF"`

```sh
"terminal.integrated.fontFamily": "MesloLGS NF",
```
