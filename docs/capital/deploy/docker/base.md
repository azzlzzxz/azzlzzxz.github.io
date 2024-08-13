# Docker

`Docker` 是一个开源的应用容器引擎，让开发者打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 `Linux` 机器上，也可以实现虚拟化。

`Docker` 容器是完全使用沙箱机制，相互之间不会有任何接口。更重要的是，容器性能开销极低。

![docker](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/docker.png)

## Docker 的应用场景

- `Web` 应用的自动化打包和发布。

- 自动化测试和持续集成、发布。

- 在服务型环境中部署和调整数据库或其他的后台应用。

- 从头编译或者扩展现有的 `OpenShift` 或 `Cloud Foundry` 平台来搭建自己的 `PaaS` 环境。

## Docker 组件

- ` Docker Client：` `Docker ` 客户端，通过命令行或者其他工具使用 `Docker API` 进行操作。
- ` Docker Image：` `Docker ` 镜像，用来打包应用程序及其依赖。
- ` Docker Container：` `Docker ` 容器，是 `Docker` 运行时环境中的一个进程，是应用运行的环境。
- ` Docker Compose：` `Docker ` 编排，用于定义和运行多容器 `Docker` 应用程序。
- ` Docker File：` `Docker` 镜像构建文件，用来定义 `Docker` 镜像的内容。

## 通过 Docker Destop 直观学习 Docker

![docker_desktop](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/docker_desktop.jpg)

`images` 是本地的所有镜像，`containers` 是镜像跑起来的容器。

`docker desktop` `pull` 一个镜像试试看。

![pull_nginx](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/pull_nginx.png)

我们点击 `pull` 按钮，就相当于执行了 `docker pull`

```sh
docker pull nginx:latest
```

![run_nginx](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/run_nginx.png)

我们点击 `run` 按钮，填了个表单，就相当于执行了 `docker run`

![docker_run](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/docker_run.png)

```sh
docker run --name nginx-test2 -p 80:80 -v /tmp/aaa:/usr/share/nginx/html -e KEY1=VALUE1 -d nginx:latest
```

- `-p` 是端口映射
  - 端口：这个是宿主机的端口，比如你要访问宿主机的 80 端口，那你就要映射到容器的 80 端口，容器内跑的 `nginx` 服务是在 80 端口，你要把宿主机的某个端口映射到容器的 80 端口才可以访问。
- `-v` 是指定数据卷挂载目录
  - 数据卷 `volume`：这个是把宿主机某个目录挂到容器内。因为容器是镜像跑起来的，下次再用这个镜像跑的还是同样的容器，那你在容器内保存的数据就会消失。所以我们都是把某个宿主机目录，挂载到容器内的某个保存数据的目录，这样数据是保存在宿主机的，下次再用镜像跑一个新容器，只要把这个目录挂载上去就行。
- `-e` 是指定环境变量
- `-d `是后台运行

点击 run，可以看到容器内的 nginx 服务跑起来了。

![run](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/run.png)
