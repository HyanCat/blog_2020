---
title: 使用 certbot 制作 SSL 证书
date: 2020-08-08 15:45:50
tags:
    - Script
categories:
    - 玩具
---

由于经常会去制作一下，干脆记下来。

<!--more-->

Let'sEncrypt 官网：https://letsencrypt.org/
certbot 地址：https://github.com/certbot/certbot

![](https://pico.oss-cn-hangzhou.aliyuncs.com/uPic/GNq2G4.png)

### 安装准备

1. 对于 Mac 环境，直接 homebrew 安装 certbot 即可。

    ```
    brew install certbot --verbose
    ```

2. 准备目录。
    - 新建个工作目录，进入到当前目录；
    - 新建 `config`, `logs`, `work` 文件夹。

### 制作证书

一行命令即可：

```bash
certbot certonly --manual --preferred-challenges=dns \
    --server https://acme-v02.api.letsencrypt.org/directory \
    --agree-tos \
    --config-dir `pwd`/config \
    --work-dir `pwd`/work \
    --logs-dir `pwd`/logs \
    -d "*.ruogoo.cn"
```

第一次，会提示输入接收提醒的邮箱，询问是否公开邮箱、是否记录 IP 等，不允许就会退出。

然后，设置 DNS 的 TXT 解析 \_acme-challenge

```
Please deploy a DNS TXT record under the name
_acme-challenge.ruogoo.cn with the following value:

GcdGo4s_vX2xoF4Bb5wSJF3icpm2oJlxRQGoeSxWRjs

Before continuing, verify the record is deployed.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue
```

设置解析完后，Enter 继续。

等待数秒，完成后，在 `./config/live/` 目录里会有域名对应的公钥 `fullchain.pem` 和私钥 `privkey.pem`。

```
➜  certs tree config/live
config/live
├── README
└── ruogoo.cn
    ├── README
    ├── cert.pem -> ../../archive/ruogoo.cn/cert1.pem
    ├── chain.pem -> ../../archive/ruogoo.cn/chain1.pem
    ├── fullchain.pem -> ../../archive/ruogoo.cn/fullchain1.pem
    └── privkey.pem -> ../../archive/ruogoo.cn/privkey1.pem

1 directory, 6 files
```
