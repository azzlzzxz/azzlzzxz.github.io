# Docker

## Docker 是什么

`Docker` 是一个开源的应用容器引擎，可以把应用程序及其依赖打包到一个可移植的容器中，然后运行在不同的 `Linux` 环境中。

与虚拟机相比，容器不需要携带完整的操作系统，因此启动速度更快、资源开销更低。不同容器之间相互隔离，应用不会轻易影响宿主机或其他容器。

![docker](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/docker.png)

## Docker 的应用场景

- 自动打包和发布 `Web` 应用。
- 自动化测试、持续集成和持续发布。
- 部署数据库、缓存等后台服务。
- 为 `PaaS` 平台提供标准化的运行环境。

## Docker 的核心组件

### Docker Client

`Docker Client` 是 Docker 的客户端，最常见的使用方式是通过命令行执行 `docker` 命令。客户端会通过 `Docker API` 与 Docker 服务通信。

### Docker Image

`Docker Image`（镜像）是一个只读模板，里面包含应用程序、依赖、配置和运行环境。

常见镜像包括 `nginx`、`mysql`、`redis` 和 `mongo`。例如：

```bash
docker pull redis
```

可以把镜像理解成“安装包 + 运行模板”：

```text
Redis 镜像
├── Redis 程序
├── Redis 配置
└── Redis 运行环境
```

镜像本身不会因为容器运行而改变，因此同一个镜像可以创建多个容器。

### Docker Container

`Docker Container`（容器）是镜像运行后的实例，也是应用真正运行的环境。

```bash
docker run redis
```

这条命令会根据 `redis` 镜像启动一个 Redis 容器：

```text
镜像（模板）
      ↓ docker run
容器（运行中的程序）
```

一个镜像可以启动多个容器：

```text
redis:7
├── Redis 容器 A
├── Redis 容器 B
└── Redis 容器 C
```

#### 镜像和容器是什么关系

可以用“模具和蛋糕”来理解镜像与容器的关系：

```text
蛋糕模具（镜像）
        ↓ 根据模具制作
蛋糕（容器）
```

- 模具只有一个，但可以制作很多个蛋糕；镜像只有一个，也可以启动很多个容器。
- 模具本身不会被吃掉，镜像也不会因为容器运行而改变。
- 蛋糕是制作出来的成品，容器是镜像启动后的运行实例。
- 蛋糕可以被吃掉，容器也可以被停止或删除。

所以：镜像是不会直接运行的模板，容器是镜像启动后产生的运行实例；删除容器不会自动删除镜像。

### Docker Compose

`Docker Compose` 用于定义和运行多个容器组成的应用，例如同时启动 `Web` 服务、数据库和 Redis。

通常通过 `compose.yml` 描述服务，再使用一条命令统一启动。

### Dockerfile

`Dockerfile` 是构建 Docker 镜像的配置文件，用来描述镜像的基础环境、依赖安装、文件复制和启动命令。

> 正确写法是 `Dockerfile`，而不是 `Docker File`。

## 数据卷（Volume）

### 为什么需要数据卷

容器中的数据默认保存在容器内部。删除容器时，这些数据也可能一起被删除。

例如启动 Mongo：

```bash
docker run mongo
```

容器中的数据库数据可能是：

```text
Mongo 容器
└── /data/db
    ├── user
    ├── order
    └── product
```

如果删除容器：

```bash
docker rm mongo
```

容器中的数据库数据也可能一起丢失，因为数据默认保存在容器内部。

### 用租房和仓库理解数据卷

可以把容器理解成租来的房子，把数据库文件理解成家具。房子被拆除后，放在房子里的家具也会消失。

如果把家具放进独立的仓库，即使更换房子，家具仍然存在。Docker 数据卷就是这个独立的“仓库”。

### 什么是挂载（Mount）

`-v` 的作用就是建立宿主机目录和容器目录之间的连接：

```bash
docker run -v ~/Desktop/upload:/uploads nginx:latest
```

```text
宿主机：~/Desktop/upload
              ⇅ 挂载
容器：  /uploads
```

容器在 `/uploads` 中创建 `a.png` 后，宿主机的 `~/Desktop/upload` 中也会出现这个文件。

对于 Mongo，可以将数据目录挂载到宿主机：

```text
宿主机：~/docker-data/mongo
              ⇅ 挂载
容器：  /data/db
```

这样 Mongo 数据实际保存在宿主机，即使删除容器，数据仍然存在。

## 端口映射（Port Mapping）

容器中的服务默认只能在容器网络内部访问。使用 `-p` 把宿主机端口映射到容器端口：

```text
-p 宿主机端口:容器端口
```

例如 Nginx 在容器内监听 `80` 端口：

```bash
-p 8080:80
```

表示浏览器访问 `localhost:8080` 时，Docker 会把请求转发到容器的 `80` 端口。

常见映射：

- `-p 3000:3000`：访问容器中的 Node/Nest 服务。
- `-p 6379:6379`：访问容器中的 Redis。
- `-p 27017:27017`：访问容器中的 MongoDB。

## 综合示例：启动 Redis

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v ~/docker/redis:/data \
  redis:7
```

这条命令把镜像、容器、端口映射和数据卷串了起来：

```text
redis:7（镜像）
        │ docker run
        ▼
Redis 容器
├── 容器端口：6379 ⇄ 宿主机端口：6379
└── 容器目录：/data ⇄ 宿主机目录：~/docker/redis
```

- `redis:7`：根据 Redis 7 镜像创建容器。
- `--name redis`：将容器命名为 `redis`。
- `-p 6379:6379`：让宿主机可以访问 Redis。
- `-v ~/docker/redis:/data`：把 Redis 数据保存到宿主机。
- `-d`：让容器在后台运行。

## 实际开发中的多容器应用

以 `Nest`、`Mongo`、`Redis` 和 `Nginx` 为例，一个项目通常会拆成多个容器：

```text
Docker 应用
├── Nest 容器：运行 Node/Nest 项目
├── Mongo 容器：存储业务数据
├── Redis 容器：缓存、Session、限流
└── Nginx 容器：反向代理、静态资源、HTTPS
```

这些容器通过 Docker 网络互相通信。开发者只需要安装 Docker，不需要在宿主机上分别安装 Node、Mongo、Redis 和 Nginx。

## Docker 概念总结

| 概念                     | 作用                                         |
| ------------------------ | -------------------------------------------- |
| 镜像（Image）            | 应用的模板和运行环境，本身不运行             |
| 容器（Container）        | 镜像启动后的运行实例，真正提供服务           |
| 数据卷（Volume）         | 保存容器中的重要数据，避免删除容器后数据丢失 |
| 端口映射（Port Mapping） | 让宿主机可以访问容器中的服务                 |

一句话记忆：镜像是模板，容器是运行中的实例；容器负责运行程序，数据卷负责保存数据，端口映射负责让外部访问容器中的服务。

## Docker Desktop

![docker_desktop](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/docker_desktop.jpg)

Docker Desktop 是 Docker 的图形化管理工具：

- `Images`：查看本地已有的镜像。
- `Containers`：查看镜像启动后的容器。

### 拉取镜像

在 Docker Desktop 中点击 `Pull`，相当于执行：

```bash
docker pull nginx:latest
```

- `nginx` 是镜像名称。
- `latest` 是镜像标签，表示使用最新版本。

![pull_nginx](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/pull_nginx.png)

### 启动容器

在 Docker Desktop 中点击 `Run` 并填写配置，相当于执行下面的命令：

![run_nginx](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/run_nginx.png)

```bash
docker run \
  --name nginx-test \
  -p 80:80 \
  -v /tmp/aaa:/usr/share/nginx/html \
  -e KEY1=VALUE1 \
  -d nginx:latest
```

容器启动后，可以在 Docker Desktop 的 `Containers` 页面查看运行状态。

![docker_run](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/docker_run.png)

## `docker run` 常用参数

### `--name`

为容器指定名称，方便后续查看、停止或删除容器。

```bash
docker run --name nginx-test nginx:latest
```

### `-p`

映射宿主机端口和容器端口，格式是 `-p 宿主机端口:容器端口`。

```bash
docker run -p 8080:80 nginx:latest
```

### `-v`

挂载数据卷，格式是 `-v 宿主机目录:容器目录`。

```bash
docker run -v /tmp/aaa:/usr/share/nginx/html nginx:latest
```

### `-e`

设置容器内的环境变量：

```bash
docker run -e APP_ENV=development nginx:latest
```

### `-d`

让容器在后台运行，不占用当前终端：

```bash
docker run -d nginx:latest
```

### 完整示例

```bash
docker run \
  --name nginx-test \
  -p 8080:80 \
  -v /tmp/aaa:/usr/share/nginx/html \
  -e APP_ENV=development \
  -d nginx:latest
```

![run](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/run.png)

这条命令完成了以下事情：

1. 使用 `nginx:latest` 镜像创建容器。
2. 将容器命名为 `nginx-test`。
3. 将宿主机 `8080` 端口映射到容器 `80` 端口。
4. 将宿主机目录挂载到 Nginx 静态文件目录。
5. 设置 `APP_ENV=development` 环境变量。
6. 让容器在后台运行。
