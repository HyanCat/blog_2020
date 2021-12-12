---
title: 常用命令记录
date: 2021-12-10 10:56:00
tags:
    - note
categories:
    - Note
---

## 常用命令记录

### 符号化

**符号化单行：**

用法：
```
xcrun atos -o [symbol] -arch arm64 -l [loadAddress] [address]
```

例如：
```
xcrun atos -o AliMeetingSDK.framework.dSYM/Contents/Resources/DWARF/AliMeetingSDK -arch arm64 -l 0x113ee8000 0x0000000113ef1908
```

