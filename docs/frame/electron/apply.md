# Electron 简单应用

一个 Electron 应用的目录结构如下：

```lua
your-app/
├── package.json
├── main.js
└── index.html
```

package.json 的格式和 Node 的完全一致，并且那个被  main  字段声明的脚本文件是你的应用的启动脚本，它运行在主进程上。你应用里的  package.json  看起来应该像：

```json
{
  "name": "my-electron",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^3.1.13"
  }
}
```

注意：如果  main  字段没有在  package.json  声明，Electron 会优先加载  index.js。

main.js  应该用于创建窗口和处理系统时间，一个典型的例子如下：

```js
const app = require('app') // 控制应用生命周期的模块。
const BrowserWindow = require('browser-window') // 创建原生浏览器窗口的模块

function createWindow() {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 800,
    heigh: 600,
    webPreferences: {
      nodeIntergration: true,
    },
  })
  // 加载应用的 index.html
  win.loadFile('index.html')
  // 打开开发工具
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)
// 当所有窗口被关闭了，退出。
app.on('window-all-closed', () => {
  // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
  // 应用会保持活动状态
  if (process.platfrom !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindow().length === 0) {
    createWindow()
  }
})
```

最后，你想展示的  index.html ：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>烽火戏诸侯!</title>
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using node
    <script>
      document.write(process.versions.node)
    </script>
    , Chrome
    <script>
      document.write(process.versions.chrome)
    </script>
    , and Electron
    <script>
      document.write(process.versions.electron)
    </script>
    .
  </body>
</html>
```
