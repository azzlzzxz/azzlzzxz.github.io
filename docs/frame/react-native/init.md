# 环境配置

## 基础环境配置

:::tip
[ReactNative 中文网](https://reactnative.cn/)

[ReactNative 官网](https://reactnative.dev/)

:::

### 安装 `nodejs`

如果你 `node` 装过了，这一步跳过。注意检查下版本号，`node` 最好需要 18 或者 18+，你可以使用 `node -v` 先检查下版本号。如果低于这个版本，建议升级或者重装，可以使用 `nvm` 等 `node` 版本控制工具来切换 `node` 版本([可以看这篇文章来安装`nvm`](/work/utility/nvm.md))。

```shell
brew install node
```

### 安装 `yarn`

[Yarn](https://yarnpkg.com/)是 `Facebook` 提供的替代 `npm` 的工具，可以加速 `node` 模块的下载。

```shell
npm install -g yarn
```

### 安装 `React Native cli`

```shell
npm install -g react-native-cli
```

### 安装`Java Development Kit`

推荐使用 `Homebrew`(如何安装 `Homebrew` 可以看这篇文章[Homebrew 安装](/work/utility/nvm.md)) 来安装由 `Azul` 提供的 名为 `Zulu` 的 `OpenJDK` 发行版。此发行版同时为 `Intel` 和 `M1` 芯片提供支持。在 `M1` 芯片架构的 `Mac` 上相比其他 `JDK` 在编译时有明显的性能优势。

```shell
brew install --cask zulu@17

# Get path to where cask was installed to double-click installer
brew info --cask zulu@17
```

## `android`环境搭建(`mac`)

### 安装 `Android Studio`

[Android Studio 下载](https://developer.android.google.cn/studio?hl=zh-cn)

安装界面中选择"`Customize`"选项，确保选中了以下几项：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`

### 安装 `Android SDK`

在 `Android Studio` 的欢迎界面中找到 `seetings`。点击`seetings`。

![settings](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/seettings.png)

在`Languages & Frameworks` 里找到 `Android SDK` ，选择`"SDK Platforms"`选项卡，然后在右下角勾选`"Show Package Details"`，展开 `Android 14 (UpsideDownCake)` 选项，确保勾选了下面这些组件（如果看不到这个界面，则需要使用稳定的代理软件）：

- `Android SDK Platform 34`
- `Sources for Android 34`
- `Intel x86 Atom_64 System Image`（官方模拟器镜像文件，使用非官方模拟器不需要安装此组件）或是 `Google APIs ARM 64 v8a System Image`（针对 `Apple Silicon` 系列机型）或是 `Google APIs ARM 64 v8a System Image`。

![Android SDK Platform](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/sdk.png)

然后点击`"SDK Tools"`选项卡，同样勾中右下角的`"Show Package Details"`。展开"`Android SDK Build-Tools"`选项，确保选中了 `React Native` 所必须的 `34.0.0` 版本。你可以同时安装多个其他版本。

![tools](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/tools.png)

点击`"Apply"`来下载和安装选中的这些组件。

### 配置 `ANDROID_HOME` 环境变量

`React Native `工具要求设置一些环境变量，以便使用原生代码构建应用程序。
将以下内容添加到你的 `~/.zprofile` 或 `~/.zshrc` 文件（如果您使用的是 `bash`，则添加到 `~/.bash_profile` 或 `~/.bashrc` 文件）中。

```shell
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**<font color="FF9D00">具体操作为：在终端输入`open ~/.zshrc`然后在弹出的文件里加入以上命令之后，关闭文件即可。</font>**

![ANDROID_HOME](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/android_home.png)

## `ios`环境搭建(`mac`)

### 安装 `Watchman`

`Watchman` 是一个监视工具，用于监视文件系统事件，并通知应用程序。

```shell
brew install watchman
```

### 安装 `Xcode`

你可以通过 `App Store` 或是到`Apple` 开发者官网上下载。这一步骤会同时安装 `Xcode IDE`、`Xcode` 的命令行工具和 `iOS` 模拟器。

![settings](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/ios_settings.png)

### `Xcode` 的命令行工具

启动 `Xcode`，并在 `Xcode | settings | Locations` 菜单中检查一下是否装有某个版本的 `Command Line Tools`。

![command](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/command.png)

### 选择平台

![platform](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/platform.png)

### `ios` 模拟器

选择你想用的模拟器
![simulator](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/simulator.png)

### 安装 CocoaPods

`CocoaPods` 是一个依赖管理工具，用于管理 `iOS` 和 `Mac` 应用程序依赖项。

```shell
brew install cocoapods
```

**这样就完成了安卓和 ios 的环境配置，可以开始着手于我们的项目搭建了。**
