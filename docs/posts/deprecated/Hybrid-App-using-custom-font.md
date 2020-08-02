---
title: Hybrid App 混合开发之自定义字体
date: 2018-02-18 12:33:00
tags:
    - iOS
    - Android
    - Hybrid
categories: App
---

### 前言

自从开始了 Hybrid App，就一发不可收拾了。以后有空会记录一些 Hybrid 在多端开发中的问题。

### 问题

由于某个地方的文字显示需要用到特殊字体，在 iOS 和 Android 中加载自定义的字体也都是很容易的，但在 webview 中自定义字体却没那么简单。

### 解决

1. 各端按照系统支持的方案各自实现

    1. iOS 在 info.plist 中配置加载自定义字体
    2. Android 字体丢进 Assets 里，按本地文件方式加载即可

    优点：遵循各平台开发（其实也没什么优点）。缺点：各端实现，维护起来稍显麻烦，并且字体只能内置在工程中。

2. 比较 🐔 贼的方法，js 注入 style

    字体丢进工程里或远程下载，只要能找到字体文件就行。读取文件，转成 base64 编码，js 在 head 标签中注入一段 css style，如下：

    ```ObjectiveC
    NSString *base64 = [self getBase64FromFile:@"zhijianhualiang" ofType:@"ttf"];
    NSString *js = [NSString stringWithFormat:@"\
                    var css = '@font-face { font-family: \"SYZJHLT\"; src: url(data:font/ttf;base64,%@) format(\"truetype\");}'; \
                    var head = document.getElementsByTagName('head')[0], \
                    style = document.createElement('style'); \
                    style.type = 'text/css'; \
                    if (style.styleSheet) { \
                        style.styleSheet.cssText = css; \
                    } else { \
                        style.appendChild(document.createTextNode(css)); \
                    } \
                    head.appendChild(style);", base64];
    ```

    优点：多端统一实现，效果也很好。缺点：字体转的 base64 较大，如果需要多个字体或变更字体就不太好。

3. 不完美的方法，拦截字体文件请求

    拦截 html 的字体请求，然后返回一个本地字体文件。当然由于 WKWebview 无法拦截，故而不考虑，不可能再去换更老效率更差的 UIWebView。

4. 更完美的方法，内置静态服务器

    内置一个静态服务器，webview 中请求的字体文件 url 为本地服务器的 url，让本地服务器处理 url 并返回字体文件。

    1. iOS [GCDWebServer](https://github.com/swisspol/GCDWebServer)
    2. Android [NanoHttpd](https://github.com/NanoHttpd/nanohttpd)

    优点：可扩展性强，字体随便变，其它 css、js 等静态文件都可以代理。缺点：各自实现 http server 稍麻烦，但这也是一劳永逸的事。

    具体如何实现，之后应该会有一篇记录。
