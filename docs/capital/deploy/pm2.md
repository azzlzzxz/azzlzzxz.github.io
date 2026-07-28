# PM2

## PM2 是什么

`PM2`（Process Manager 2）是 Node.js 应用的进程管理器。它可以帮助我们管理应用进程、收集日志、监控资源，并在进程异常退出时自动重启应用。

直接使用 Node.js 启动应用：

```bash
node ./dist/main.js
```

应用会占用当前终端。如果进程崩溃，需要手动重新启动；日志也会直接输出到当前终端。

使用 PM2 启动：

```bash
pm2 start ./dist/main.js --name nest-app
```

应用会交给 PM2 管理，即使当前终端关闭，应用也可以继续运行。

## PM2 的主要功能

- 进程管理：启动、停止、重启和删除应用。
- 自动重启：进程崩溃、超过内存限制或文件变化时自动重启。
- 日志管理：统一查看标准输出和错误输出。
- 集群模式：启动多个 Node.js 进程，利用多核 CPU。
- 性能监控：查看进程的 CPU 和内存占用。
- 配置文件：使用 ecosystem 文件批量管理多个应用。

## 安装和启动

### 安装 PM2

```bash
npm install --global pm2
```

查看版本：

```bash
pm2 --version
```

### 启动 NestJS 应用

先构建 NestJS 项目：

```bash
npm run build
```

再使用 PM2 启动构建产物：

```bash
pm2 start dist/main.js --name nest-app
```

查看当前由 PM2 管理的进程：

```bash
pm2 list
```

## 进程管理

下面的命令中的 `nest-app` 也可以替换成 PM2 分配的进程 ID。

```bash
pm2 start dist/main.js --name nest-app # 启动应用
pm2 restart nest-app                   # 重启应用
pm2 stop nest-app                      # 停止应用
pm2 delete nest-app                    # 从 PM2 中删除应用
pm2 reload nest-app                    # 平滑重载，适合集群模式
pm2 status                             # 查看进程状态
```

`restart` 会停止后重新启动进程；`reload` 会逐个重启集群中的进程，通常可以减少服务中断。

## 日志管理

查看所有应用的日志：

```bash
pm2 logs
```

只查看某个应用的日志：

```bash
pm2 logs nest-app
```

只查看最近 100 行：

```bash
pm2 logs nest-app --lines 100
```

PM2 默认将日志保存在 `~/.pm2/logs`：

```text
~/.pm2/logs/
├── nest-app-out.log    # 标准输出
└── nest-app-error.log  # 错误输出
```

清空日志：

```bash
pm2 flush
pm2 flush nest-app
```

## 自动重启

### 进程崩溃自动重启

PM2 默认会在 Node.js 进程异常退出后自动重启。可以使用下面的命令关闭该行为：

```bash
pm2 start dist/main.js --name nest-app --no-autorestart
```

### 内存超限自动重启

当应用内存超过指定值时自动重启：

```bash
pm2 start dist/main.js \
  --name nest-app \
  --max-memory-restart 200M
```

### 定时重启

下面的示例每 3 分钟重启一次，适合需要定期释放内存的特殊场景：

```bash
pm2 start dist/main.js \
  --name nest-app \
  --cron-restart "*/3 * * * *"
```

### 文件变化自动重启

开发环境可以监听文件变化：

```bash
pm2 start dist/main.js --name nest-app --watch
```

生产环境通常不建议开启 `--watch`，因为构建目录或日志变化可能触发不必要的重启。

## 集群模式和负载均衡

Node.js 的 JavaScript 代码通常运行在单个进程中。多核服务器可以使用 PM2 集群模式启动多个进程，让多个进程共同处理请求。

使用所有 CPU 核心：

```bash
pm2 start dist/main.js --name nest-app -i max
```

也可以直接指定进程数量：

```bash
pm2 start dist/main.js --name nest-app -i 4
```

动态调整集群数量：

```bash
pm2 scale nest-app 3   # 调整为 3 个进程
pm2 scale nest-app +3  # 在当前基础上增加 3 个进程
```

查看进程的 CPU 和内存占用：

```bash
pm2 monit
```

::: tip

集群模式适合无状态应用。不要把登录状态、临时数据等只保存在单个进程的内存中；这类数据应放到 Redis 或数据库中。

:::

## ecosystem 配置文件

当应用较多，或者启动参数较复杂时，推荐使用配置文件统一管理。

生成示例配置：

```bash
pm2 ecosystem
```

也可以手动创建 `ecosystem.config.cjs`：

```js
module.exports = {
  apps: [
    {
      name: 'nest-app',
      script: './dist/main.js',
      instances: 'max', // 使用所有 CPU 核心
      exec_mode: 'cluster', // 开启集群模式
      max_memory_restart: '200M',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
```

使用生产环境配置启动：

```bash
pm2 start ecosystem.config.cjs --env production
```

保存当前进程列表：

```bash
pm2 save
```

恢复已保存的进程：

```bash
pm2 resurrect
```

## 开机自动启动

让 PM2 在服务器重启后自动恢复应用：

```bash
pm2 startup
```

PM2 会输出一条需要使用管理员权限执行的命令。执行那条命令后，再保存当前进程列表：

```bash
pm2 save
```

## Docker 中使用 PM2

Docker 已经负责管理容器生命周期，因此在 Docker 中是否使用 PM2 要根据部署方式决定：

- 单个容器只运行一个 Node.js 进程时，可以直接使用 `node`，让 Docker 负责重启容器。
- 希望在容器内部使用 PM2 管理日志、集群和进程时，使用 `pm2-runtime`，不要使用普通的 `pm2` 命令后台运行。

### Dockerfile 示例

```dockerfile
# 构建阶段
FROM node:18 AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 生产阶段
FROM node:18 AS production-stage

WORKDIR /app

COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/package*.json ./

RUN npm install --omit=dev
RUN npm install --global pm2

EXPOSE 3000

# pm2-runtime 会保持在前台，适合作为 Docker 的主进程
CMD ["pm2-runtime", "dist/main.js", "--name", "nest-app"]
```

构建并启动：

```bash
docker build -t nest-app:1.0.0 .
docker run --name nest-app -p 3000:3000 -d nest-app:1.0.0
```

查看容器日志：

```bash
docker logs -f nest-app
```

::: warning

不要在 Docker 中使用 `pm2 start ...` 让 PM2 进入后台运行，否则容器的主进程可能提前退出。Docker 场景应使用 `pm2-runtime`，或者直接使用 `node`。

:::

## PM2 Plus

`PM2 Plus` 是 PM2 提供的在线监控服务，支持远程查看应用状态、日志和性能指标。它属于付费功能，普通部署通常使用本地的 `pm2 monit` 和日志命令即可满足需求。

## 常用命令速查

| 命令               | 作用             |
| ------------------ | ---------------- |
| `pm2 start app.js` | 启动应用         |
| `pm2 list`         | 查看进程列表     |
| `pm2 logs`         | 查看日志         |
| `pm2 restart app`  | 重启应用         |
| `pm2 reload app`   | 平滑重载应用     |
| `pm2 stop app`     | 停止应用         |
| `pm2 delete app`   | 删除应用         |
| `pm2 monit`        | 查看 CPU 和内存  |
| `pm2 save`         | 保存当前进程列表 |
| `pm2 startup`      | 配置开机启动     |

## 总结

PM2 主要解决 Node.js 应用的进程管理问题：

- 使用 `pm2 start` 启动和管理应用。
- 使用 `pm2 logs` 统一查看日志。
- 使用自动重启和内存限制提高稳定性。
- 使用 `-i` 集群模式利用多核 CPU。
- 使用 ecosystem 配置文件批量管理应用。
- 使用 `pm2-runtime` 在 Docker 中以前台进程运行 PM2。

在 Docker 环境中，如果每个容器只运行一个 Node.js 进程，直接使用 `node` 通常更简单；如果确实需要 PM2 的集群和进程管理能力，应使用 `pm2-runtime`。
