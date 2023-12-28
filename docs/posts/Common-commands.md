---
title: 常用命令记录
date: 2021-12-10 10:56:00
tags:
    - note
categories:
    - Note
---

## 常用命令记录

### iOS 符号化

**符号化单行：**

用法：
```
xcrun atos -o [symbol] -arch arm64 -l [loadAddress] [address]
```

例如：
```
xcrun atos -o AliMeetingSDK.framework.dSYM/Contents/Resources/DWARF/AliMeetingSDK -arch arm64 -l 0x113ee8000 0x0000000113ef1908
```

### Docker 清理命令

Docker在使用过程中会产生许多临时或不再需要的数据，例如悬挂的镜像（dangling images）、未使用的容器、网络、卷等。这些数据会占用磁盘空间，有时需要手动清理以释放空间。以下是几个清理无用磁盘空间的常用命令：

1. 清理悬挂的镜像（没有标签的镜像）

    ```
    docker image prune
    ```

2. 清理所有未使用的镜像（不仅仅是悬挂的）

    ```
    docker image prune -a
    ```

3. 清理停止的容器

    ```
    docker container prune
    ```

4. 清理未使用的网络

    ```
    docker network prune
    ```

5. 清理未使用的卷

    ```
    docker volume prune
    ```

6. 一条命令清理所有未使用的对象（包括镜像、容器、网络和卷）

    ```
    docker system prune
    ```

7. 如果你还想清理构建缓存，可以加上`-all`和`-force`标志

    ```
    docker system prune --all --force
    ```

8. 可以单独清理构建缓存

    ```
    docker builder prune
    ```

9. 要清理指定容器的日志文件（这不是Docker内置的命令，而是直接操作容器的日志文件），需要定位到Docker容器日志文件的存放路径，通常在`/var/lib/docker/containers/`下对应容器的目录里。以下是一个命令示例，它会将指定容器的日志文件截断为0字节，相当于清空了日志文件（请谨慎操作，确保不需要这些日志）：

    ```
    truncate -s 0 /var/lib/docker/containers/*/*-json.log
    ```

使用这些命令前，请确保你了解它们的作用，并确定不会清理掉重要的数据。如果你在生产环境中执行这些命令，请先在测试环境中验证它们的影响。另外，清理前最好停止所有正在运行的容器，或至少确认当前没有正在运行的任务会受到清理操作的影响。
