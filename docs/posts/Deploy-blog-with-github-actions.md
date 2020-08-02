---
title: 使用 GitHub Actions 自动部署 blog 到 GitHub Pages
date: 2020-08-02 15:50:50
tags:
    - Script
categories:
    - 玩具
---

### 准备

#### 仓库

1. 准备好个人的 github.io 仓库，托管静态网页。[https://github.com/HyanCat/hyancat.github.io](https://github.com/HyanCat/hyancat.github.io)
2. vuepress 博客的内容仓库。[https://github.com/HyanCat/blog_2020](https://github.com/HyanCat/blog_2020)

#### 设置 Secrets

博客仓库 Actions 需要用到 git 的读写权限。

1. 生成一个 Personal access tokens [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. 在博客仓库设置中添加 Secrets，Name 是 ACCESS_TOKEN，Value 是刚生成的 token。

### Workflow

1. 新建 .github/workflows/deploy.yml，直接在 GitHub 网页上操作就好了。

    ```yaml
    # This is a basic workflow to help you get started with Actions

    name: Deploy GitHub Pages

    # Controls when the action will run. Triggers the workflow on push or pull request
    # events but only for the master branch
    on:
        push:
            branches: [master]
        pull_request:
            branches: [master]

    # A workflow run is made up of one or more jobs that can run sequentially or in parallel
    jobs:
        # This workflow contains a single job called "build"
        build-and-deploy:
            # The type of runner that the job will run on
            runs-on: ubuntu-latest

            # Steps represent a sequence of tasks that will be executed as part of the job
            steps:
                # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
                - name: Checkout
                uses: actions/checkout@v2
                # 这里直接用别人写好的 action，省事
                - name: vuepress-deploy
                uses: jenkey2011/vuepress-deploy@master
                env:
                    ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
                    TARGET_REPO: HyanCat/hyancat.github.io
                    TARGET_BRANCH: master
                    BUILD_SCRIPT: yarn && yarn build
                    BUILD_DIR: docs/.vuepress/dist/
    ```

2. Push 上去，等待部署成功。

    ![](https://pico.oss-cn-hangzhou.aliyuncs.com/uPic/gEKFQC.png)

详细说明就不写了，可以参考 [https://vuepress-theme-reco.recoluan.com/views/other/github-actions.html](https://vuepress-theme-reco.recoluan.com/views/other/github-actions.html)
