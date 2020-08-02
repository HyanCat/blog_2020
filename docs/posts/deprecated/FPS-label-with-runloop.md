---
title: iOS Runloop 制作一个 FPSLabel
date: 2016-04-11 12:51:07
tags:
    - iOS
    - runloop
    - label
categories: iOS
---

一步一步实现一个简单好用的监测 FPS 的控件。

<!-- more -->

## Runloop 机制

1. 关于 Runloop 机制看 ibireme 的这篇文章
   [深入理解 RunLoop](http://blog.ibireme.com/2015/05/18/runloop/)

2. CADisplayLink 是一个和屏幕刷新率一致的定时器。查看 CADisplayLink.h 文件，它提供了四个方法

    ```ObjectiveC
    // 新建屏幕刷新同步定时器，屏幕每刷新一次（一帧），调用一次 selector
    + (CADisplayLink *)displayLinkWithTarget:(id)target selector:(SEL)sel;
    // 添加到某个 runloop 中
    - (void)addToRunLoop:(NSRunLoop *)runloop forMode:(NSString *)mode;
    // 从添加到的 runloop 中移除
    - (void)removeFromRunLoop:(NSRunLoop *)runloop forMode:(NSString *)mode;
    // 销毁释放
    - (void)invalidate;
    ```

## 视图

FPSLabel 这种调试性工具，需要一直显示在屏幕最上层，那我们直接将它添加到最开始创建的 UIWindow 上。

```ObjectiveC
+ (instancetype)showInWindow:(UIWindow *)window
{
    HyFPSLabel *label = [[HyFPSLabel alloc] initWithFrame:CGRectZero];
    label.layer.cornerRadius = 4.f;
    label.layer.masksToBounds = YES;
    label.textAlignment = NSTextAlignmentCenter;
    label.userInteractionEnabled = NO;
    label.font = [UIFont fontWithName:@"Menlo" size:12];

    [window addSubview:label];
}
```

这里 frame 为 CGRectZero，因为要支持不同屏幕以及旋转，所以 Autolayout 是必须的。

```ObjectiveC
label.translatesAutoresizingMaskIntoConstraints = NO;
// 这里一定要注意，使用手写原生 autolayout 的话，需要设置 translatesAutoresizingMaskIntoConstraints 为 NO

NSLayoutConstraint *leadingLayout =[NSLayoutConstraint constraintWithItem:label
                                                                attribute:NSLayoutAttributeLeading
                                                                relatedBy:NSLayoutRelationEqual
                                                                   toItem:window
                                                                attribute:NSLayoutAttributeLeading
                                                               multiplier:1
                                                                 constant:10.f];
NSLayoutConstraint *bottomLayout = [NSLayoutConstraint constraintWithItem:label
                                                                attribute:NSLayoutAttributeBottom
                                                                relatedBy:NSLayoutRelationEqual
                                                                   toItem:window
                                                                attribute:NSLayoutAttributeBottom
                                                               multiplier:1
                                                                 constant:-10.f];
NSLayoutConstraint *widthLayout = [NSLayoutConstraint constraintWithItem:label
                                                               attribute:NSLayoutAttributeWidth
                                                               relatedBy:NSLayoutRelationEqual
                                                                  toItem:nil
                                                               attribute:NSLayoutAttributeNotAnAttribute
                                                              multiplier:0
                                                                constant:60.f];
NSLayoutConstraint *heightLayout = [NSLayoutConstraint constraintWithItem:label
                                                                attribute:NSLayoutAttributeHeight
                                                                relatedBy:NSLayoutRelationEqual
                                                                   toItem:nil
                                                                attribute:NSLayoutAttributeNotAnAttribute
                                                               multiplier:0
                                                                 constant:20.f];
if (IOS8_OR_LATER) {
    [NSLayoutConstraint activateConstraints:@[leadingLayout, bottomLayout, widthLayout, heightLayout]];
}
else {
    [window addConstraints:@[leadingLayout, bottomLayout, widthLayout, heightLayout]];
}
```

因为要做一个无依赖的工具库，所以手写原生 Autolayout，虽然代码有些繁重。Masonry 笑着说：我四行代码就搞定。😁

## 计算逻辑

接下来就是要完善这个 label 自身了。在 init 方法中需要创建并添加 CADisplayLink：

```ObjectiveC
_displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(tick:)];
[_displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
```

这里 `tick:` 这个 selector 就是和屏幕刷新率保持一致的方法。在这个方法里，我们累计时间计算每秒执行次数，就是刷新率了。

```ObjectiveC
- (void)tick:(CADisplayLink *)displayLink
{
	CFTimeInterval currentTime = displayLink.timestamp;
	if (_lastTime == 0) {
		// first time.
		_lastTime = currentTime;
		return;
	}
	_tickCount++;
	CFTimeInterval delta = currentTime - _lastTime;
	if (delta < 1) return;
	// get fps
	self.fps = MIN(lrint(_tickCount / delta), 60);
	_tickCount = 0;
	_lastTime = currentTime;
}
```

`self.fps` 便是得到的 FPS 帧率。
那么最后一步便是将它显示在前面做好的 label 上了。这里颜色根据帧率从绿色到红色变化。`_displayLink` 方法：

```ObjectiveC
CGFloat hue = self.fps > 24 ? (self.fps - 24) / 120.f : 0;
self.textColor = [UIColor colorWithHue:hue saturation:1 brightness:0.9 alpha:1];
self.text = [NSString stringWithFormat:@"%@ FPS", @(self.fps)];
self.layer.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.7f].CGColor;
```

到这里，FPSLabel 已经只做完了，可以在 `AppDelegate` 的 window 上了。

## 更进一步

我们想在帧率不变的时候，一般是保持在满 60 帧的时候，自动隐藏这个 label。
这里只需要添加 KVO 监听 `self.fps` 属性。

然后在 `_displayLink` 方法中增加显示和隐藏的逻辑，以及渐隐渐现动画。
这里延迟 2 秒无变化则自动隐藏（延迟必须大于 1 秒，因为帧率是按 1 秒计数来算的）

```ObjectiveC
if (self.autoHide) {
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(fadeOut) object:nil];
    [self performSelector:@selector(fadeOut) withObject:nil afterDelay:2];
}
```

至此，一个能自动隐藏的好用又好看的 FPSLabel 制作完成，调用方法：

    [HyFPSLabel showInWindow:self.window].autoHide = YES;

完整代码见：[HyanCat/HyFPSLabel](https://github.com/HyanCat/HyFPSLabel)

---

参考：

-   https://github.com/xiekw2010/DXFPSLabel
-   https://github.com/ibireme/YYText/blob/master/Demo/YYTextDemo/YYFPSLabel.m
