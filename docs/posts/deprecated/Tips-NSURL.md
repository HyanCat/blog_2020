---
title: Tips - NSURL
date: 2016-04-22 09:45:46
tags:
categories: iOS
---

NSURL 非常强大，一些小细节可以更好地处理 url。

<!-- more -->

## Tips

1. 所有用来表示 URL 的一定不要用 NSString。一切的资源都是 URL。

2. NSURL 表示任何符合 URL 标准的地址（如 https://hyancat.com, tel://xxx, file://xxx.png 等）。尤其注意：scheme 为 file 的文件地址，使用 path 属性获取地址字符串。

3. 如果需要持久化，本机文件的引用使用 bookmark （一个包含描述文件位置的 NSData，会随着文件的移动等变化而变化）
