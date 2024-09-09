# 项目搭建

使用 `React Native` 内建的命令行工具来创建一个名为`"AwesomeProject"`的新项目

```shell
npx react-native@latest init AwesomeProject
```

![react-native-project](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react-native-project.jpg)

## `Android` 目录

![react-native-android](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react-native-andriod.jpg)

## `ios` 目录

![react-native-ios](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/react-native-ios.jpg)

## 路由

:::tip
[React Navigation](https://reactnavigation.org/docs/getting-started/)
:::

```shell
yarn add @react-navigation/native
```

### `Stack` 导航

:::tip
[Stack 文档](https://reactnavigation.org/docs/stack-navigator)

`Stack Navigator` 为您的应用提供了一种在屏幕之间转换的方法，其中每个新屏幕都位于堆栈的顶部。

默认情况下，堆栈导航器配置为具有熟悉的 `iOS` 和 `Android` 外观和感觉：`iOS` 上的新屏幕从右侧滑入，`Android` 上使用操作系统默认动画
:::

- `RN`中是没有`web`端的`history`对象的，在使用路由之前需要将组件先声明在`Stack`中

```jsx
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const HomeScreen = ({}) => {
    return (
        <Button onPress={()=>void navigation.navigate('Details')} title="跳转到详情页">
    )
}

export const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Details">
                <Stack.Screen name="Home" component={HomeScreen}>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
```

可以看出来，重要的是：`Stack.Navigator` ，`Stack.Screen`和`navigation.navigate`。

#### `Navigator`属性

- `initialRouteName`：导航器首次加载时呈现的路由名称
- `presentation`: 快捷选项，它配置了几个选项来配置渲染和过渡的样式
  - `card`
  - `modal`
  - `transparentModal`
- `header`： 使用自定义标头来代替默认标头，它接受一个函数，该函数返回一个 `React Element` 以显示为标题。
- `screenOptions`：导航器中屏幕使用的默认选项
- ...

#### `Screen`属性

- `options`
  - `title`
  - `headerTitleStyle`
  - `headerStyle`
  - `headerLeft`
  - `headerRight`
  - `headerTinyColor`

#### 路由跳转

1. `replace`

使用堆栈中的新屏幕替换当前屏幕。该方法接受以下参数：

- `name`-字符串- 要推送到堆栈的路由的名称。
- `params`-对象- 传递给目标路线的屏幕参数。

```shell
navigation.replace('Profile', { owner: 'Michaś' });
```

2. `push`

将新屏幕推送到堆栈顶部并导航至该屏幕。该方法接受以下参数：

- `name`-字符串- 要推送到堆栈的路由的名称。
- `params`-对象- 传递给目标路线的屏幕参数。

```shell
navigation.push('Profile', { owner: 'Michaś' });
```

3. `pop`

从堆栈中弹出当前屏幕并导航回上一个屏幕。它需要一个可选参数 `( count)`，允许您指定要弹出的屏幕数。

```shell
navigation.pop();
```

4. `popToTop`
   弹出堆栈中除第一个屏幕之外的所有屏幕并导航到该屏幕。

```shell
navigation.popToTop();
```

### `Bottom Tabs`导航

:::tip
[Bottom Tabs 文档](https://reactnavigation.org/docs/bottom-tab-navigator)

屏幕底部的简单标签栏可让您在不同路线之间切换。路由是延迟初始化的 - 它们的屏幕组件直到首次获得焦点时才会初始化。
:::

```shell
yarn add @react-navigation/bottom-tabs
```

举个 🌰：

```jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}
```

### `Drawer`导航

:::tip
[Drawer Navigator 文档](https://reactnavigation.org/docs/drawer-navigator)
Drawer Navigator 在屏幕侧面呈现一个导航抽屉，可以通过手势打开和关闭。
:::

```shell
yarn add @react-navigation/drawer
```

举个 🌰：

```jsx
import { createDrawerNavigator } from '@react-navigation/drawer'

const Drawer = createDrawerNavigator()

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Article" component={Article} />
    </Drawer.Navigator>
  )
}
```

## UI 组件库

:::tip
[NativeBase](https://docs.nativebase.io/?utm_source=HomePage&utm_medium=header&utm_campaign=NativeBase_3)
:::

### 安装

```shell
yarn add native-base react-native-svg@12.1.1 react-native-safe-area-context@3.3.2
```

```shell
cd ios/
pod install
```

### 自定义配置

在根目录下建一个 theme.ts 文件

```ts
import { extendTheme } from 'native-base'

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#2F72FF',
      100: '#5B74FA',
    },
    back: {
      50: '#0f0e0e',
      100: '#FAFAFA',
      200: '#E0E0E0',
    },
  },
})
```

在 App.ts 里引入

```jsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { NativeBaseProvider } from 'native-base'

import Permission from '@/components/Permission'

import { theme } from '../theme'

function App() {
  return (
    <>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer>
          <Permission />
        </NavigationContainer>
      </NativeBaseProvider>
    </>
  )
}

export default App
```

## 环境配置

使用`react-native-dotenv`来区分、配置环境

```shell
yarn add -D react-native-dotenv
```

配置

`babel.config.js` 配置

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv'],
    ...
  ],
};
```

`package.json` 配置

```json
"scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    + "android-release": "cd android && ENVFILE=.env.production && ./gradlew assembleRelease",
    + "android-clean": "cd android && ./gradlew clean",
    ...
  },
```

![env](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/env.png)

使用

```js
fetch(`${process.env.API_URL}/users`, {
  headers: {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  },
})
```

```js
import { API_URL, API_TOKEN } from '@env'

fetch(`${API_URL}/users`, {
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
})
```

## 本地存储

:::tip
[async-storage 文档](https://github.com/react-native-async-storage/async-storage)
:::

## 更改 `React Native` 应用的名称

### 更改`android`名称

1. 修改 `AndroidManifest.xml` 文件：

- 打开项目目录中的 `android` 文件夹。
- 在 `android/app/src/main` 目录下找到 `AndroidManifest.xml` 文件。
- 找到 `android:label` 属性，并将其值修改为你想要的新应用名称。

```xml
<application android:name=".MainApplication" android:label="NewAppName" ...></application>
```

2. 修改 `strings.xml` 文件：

- 在 `android/app/src/main/res/values` 目录下找到 `strings.xml` 文件。
- 修改 `app_name` 键的值为你想要的新应用名称。

```xml
<resources>
    <string name="app_name">NewAppName</string>
</resources>

```

### 更改`ios`名称

1. 修改 `Info.plist` 文件：

- 打开 `Xcode`，找到项目目录中的 `ios` 文件夹。
- 在 `ios` 文件夹中找到 `Info.plist` 文件。
- 找到 `CFBundleName` 键，并将其值修改为你想要的新应用名称。

```shell
<key>CFBundleName</key>
<string>NewAppName</string>
```

2. 修改 `project.pbxproj` 文件（可选）：

- 打开 `Xcode`，找到项目目录中的 `ios` 文件夹。
- 在 `ios` 文件夹中找到 `{project_name}.xcodeproj` 文件夹，并打开它。
- 打开 `project.pbxproj` 文件,搜索旧的应用名称并将其替换为新的应用名称。这一步主要用于更改显示的应用名称。

## 更改 `React Native` 应用的图标

可以使用第三方工具来生成所需的图标集。例如：[App Icon Generator](https://www.appicon.co/) 允许你上传一个大尺寸图标，并生成不同尺寸的 `iOS` 和 `Android` 图标。

### 替换`android`图标

- 打开 `android/app/src/main/res` 目录。
- 在 `res` 目录中，你会找到多个 `mipmap-` 前缀的文件夹，如 `mipmap-mdpi`, `mipmap-hdpi` 等。
- 将准备好的图标分别替换到这些文件夹中，确保命名为 `ic_launcher.png`
- 如果需要适配 `Android 8.0` 及以上的圆形图标，可以在 `res` 目录下的 `mipmap-anydpi-v26` 文件夹中替换 `ic_launcher.xml` 和 `ic_launcher_round.xml`。

### 替换`ios`图标

- 打开 `ios` 目录，然后找到 `AppIcon` 资源目录，路径通常是 `ios/YourProjectName/Images.xcassets/AppIcon.appiconset`。
- 将你准备好的图标拖到 `AppIcon.appiconset` 中，替换现有的图标文件。确保命名和尺寸对应。
- 在 `AppIcon.appiconset` 目录中，有一个名为 `Contents.json` 的文件。确保每个图标都有相应的 `JSON` 配置。

## 发布

### Android 发布

生成一个签名密钥，你可以用`keytool`命令生成一个私有密钥。

```shell
$ keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

这条命令会要求你输入密钥库`（keystore）`和对应密钥的密码，然后设置一些发行相关的信息。最后它会生成一个叫做 `my-release-key.keystore `的密钥库文件。

在运行上面这条语句之后，密钥库里应该已经生成了一个单独的密钥，有效期为 10000 天。`--alias` 参数后面的别名是你将来为应用签名时所需要用到的，所以记得记录这个别名。

#### 设置 gradle 变量

- 把`my-release-key.keystore`文件放到你工程中的`android/app`文件夹下。
- 编辑`~/.gradle/gradle.properties`（全局配置，对所有项目有效）或是项目目录`/android/gradle.properties`（项目配置，只对所在项目有效）。如果没有`gradle.properties`文件你就自己创建一个，添加如下的代码（注意把其中的\*\*\*\*替换为相应密码）

```shell
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```

编辑你项目目录下的`android/app/build.gradle`，添加如下的签名配置：

```java
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```

#### 发布 APK 包

运行脚本 `android-release`

```json
"scripts": {
    "android-release": "cd android && ENVFILE=.env.production && ./gradlew assembleRelease",
    "android-clean": "cd android && ./gradlew clean",
    ...
  },
```

生成的 `APK` 文件位于`android/app/build/outputs/apk/release/app-release.apk`，它已经可以用来发布了。

可以使用[蒲公英](https://www.pgyer.com/)来帮助你发布应用

### iOS 发布

在将 `React Native` 应用发布到 `Apple App Store` 之前，需要完成一系列步骤：

1. 创建 `Apple Developer` 帐户

- 如果还没有 `Apple Developer` 帐户，请前往 [Apple Developer](https://developer.apple.com/) 注册。

2. 配置 `Xcode` 项目

- 打开 `ios` 文件夹中的 `.xcworkspace` 文件（使用 `Xcode` 打开）。
- 在 `Xcode` 中选择项目文件（通常在左侧的导航栏中显示为蓝色的项目图标）。
- 在项目的`“General”`选项卡中，填写以下信息：
  - `Display Name`: 你想要在 `App Store` 中显示的名称。
  - `Bundle Identifier`: 你的应用程序唯一标识符（例如`com.yourcompany.yourapp`）。
  - `Version` 和 `Build`: 应用程序的版本号和构建号。

3. 创建 `App ID` 和 `Provisioning Profile`

   在 `Apple Developer` 网站上：

   - 登录 `Apple Developer` 帐户。
   - 导航到 `Certificates`, `Identifiers` & `Profiles`。
   - 创建一个 `App ID`（确保与 `Xcode` 项目中的 `Bundle Identifier`匹配）。
   - 创建一个 `Distribution Certificate`。
   - 创建一个 `App Store Distribution Provisioning Profile`，并下载到本地。

4. 配置 `Xcode` 项目使用 `Provisioning Profile`

- 打开 `Xcode`，选择项目。
- 导航到项目的`“Signing & Capabilities”`选项卡。
- 选择对应的 `Team`（开发者团队）。
- 选择刚刚创建的 `Provisioning Profile`。

5. 使用 `Xcode` 构建

- 选择 `iOS` 设备（或 `Generic iOS Device`）。
- 在菜单栏中选择 `Product` > `Archive`。

6. 使用 `Xcode` 上传到 `App Store Connect`

- 在 `Archive` 完成后，会打开 `Organizer` 窗口。
- 选择刚刚创建的 `Archive` 并点击 `Distribute App`。
- 选择 `App Store Connect` > `Upload`。
- 按照提示完成上传。

7. 在 `App Store Connect` 配置

- 登录 [App Store Connect](https://appstoreconnect.apple.com/)。
- 创建一个新的 `App`（如果这是第一次提交该应用）。
- 填写应用程序信息（如名称、描述、分类等）。
- 在`“App Information”`中，设置版本号和构建号。
- 在`“Pricing and Availability”`中设置应用的价格和可用性。
- 在`“Prepare for Submission”`中，添加应用程序截图、图标等资源。

8. 提交应用进行审核

- 在 `App Store Connect` 中，选择刚刚上传的构建版本。
- 点击`“Submit for Review”`。
- 按照提示填写所需信息并提交应用。

### 等待审核和发布

- 一旦应用通过审核，你会收到通知。
- 应用通过审核后，将会在 `App Store` 上发布，用户可以下载和使用。

### 额外步骤

- **测试应用**：在提交审核前，可以使用 `TestFlight` 进行测试。
- **更新版本**：在发布后，如果需要更新应用版本，修改版本号并重复上述步骤。
