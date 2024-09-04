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

## `zsh` 插件

### `zsh-autosuggestions`

根据您的历史记录和完成情况建议您键入的命令

```sh
# clone
git clone --depth=1 git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions

# 在 ~/.zshrc 中配置
plugins=(其他插件 zsh-autosuggestions)

# 使配置生效
source ~/.zshrc
```

### `zsh-completions`

zsh 的自动补全功能。

```sh
# clone
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions

# 在 ~/.zshrc 中配置
plugins=(其他插件 zsh-completions)

# 使配置生效
source ~/.zshrc
```

### `fast-syntax-highlighting`

zsh 的语法高亮功能。

```sh
# clone
# clone
git clone --depth=1 https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting

# 在 ~/.zshrc 中配置
plugins=(其他插件 fast-syntax-highlighting)

# 使配置生效
source ~/.zshrc
```

## `zsh` 主题

### `powerlevel10k`

安装

```sh
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# 在 ~/.zshrc 中配置
ZSH_THEME="powerlevel10k/powerlevel10k"

# 使配置生效
source ~/.zshrc
```

修改字体

`Powerlevel10k` 推薦使用 `Meslo Nerd Font`

- [MesloLGS NF Regular.ttf](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/MesloLGS%20NF%20Regular.ttf)

![iterm2_config](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/iterm2_config.jpg)

修复 `vscode` 终端图标乱码，修改 `terminal.integrated.fontFamily`为 `"MesloLGS NF"`

```sh
"terminal.integrated.fontFamily": "MesloLGS NF",
```
