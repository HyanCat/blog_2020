---
title: Effective Objective-C 2.0 知识点梳理
date: 2016-04-30 20:25:40
tags:
categories: iOS
---

![Effective Objective-C Note](https://o.ruogoo.cn/image/f914f5e506c8c7d04c9a39d1a3d42efb.jpg)

复习了《Effective Objective-C 2.0》这本书，每小节简单地做点笔记。
总体来说知识点都比较基础，大部分在平时写代码时也都有涉及到，这里就当是总结吧，对新人可能会有一定的帮助。

<!-- more -->

## 栈、堆内存分配、回收、自动回收

Objective-C 对象总是分配在堆中，对象指针是分配在栈中。
结构体可能分配在栈中

## 前向声明和引入头文件

只引入必要的头文件，减少编译时间
前向声明解决两个类的互相引用问题
必须要引入某个协议时，协议单独头文件，或使用 extension

## 字面量语法糖

字面量代码简洁易读
字面量更安全，数组和字典有值为 nil，会抛出异常

## 常量

在实现文件中使用 `static const xxxx` 来定义“只在编译单元内可见的常量”，const 保证了常量不被修改，static 保证了该常量仅在定义此变量的编译单元中可见，所以也可不必加前缀。
外界可见的常量，头文件中使用

    extern NSString *const xxxx;

常量会放在`全局符号表`中这里的 const 保证了常量指针不被修改。加类名或框架名前缀。

## 枚举

使用 NS_ENUM NS_OPTIONS 来定义枚举类型，指明底层数据类型。
switch 枚举类型时最好不要 default。

## 属性

atomic 和 nonatomic: atomic 会通过锁定机制来确保其读写操作的原子性，但会比较耗性能。需要严格保证某个属性为线程安全，则使用 atomic 或手动锁定。
assign: 只针对`纯量类型`执行简单赋值操作
strong: 一种强`拥有关系`，赋新值时，setter 方法会先 retain 新值，release 旧值，然后将新值设置上去。
weak: 一种`非拥有关系`，设置新值时，不 retain 新值也不 release 旧值，对象在外部被摧毁时，属性值也会清空。
unsafe_unretained: 一种`非拥有关系`（unreatined），对象在外部被摧毁时，属性值不会自动清空(unsafe)，和 assign 类似
copy: 一种强`拥有关系`，赋新值时，setter 方法会 copy 新值，保证可变对象的安全性。

手动实现合成方法时严格遵从属性声明的语义。

## 对象内部读写属性

对象内部读取数据时，使用实例变量来读，写入数据时，应通过 setter 方法来写。
init 和 dealloc 方法中应总是直接通过实例变量来读写，原因子类可能会重写 setter 方法。

## 对象等同性

自定义对象判断等同性应实现 NSObject 协议中的 isEqual 和 hash 方法。

## 类族

使用`工厂模式`创建类族，抽象基类暴露公共方法，使用者无需关心实现细节。

## 关联对象

设置关联对象值时，通常使用静态全局变量做键。

## 消息转发

对象的方法全部由`动态消息派发派发系统`处理，每个类会有一张消息表，且会缓存这个表以增加效率。派发时如果在表中找不到响应的消息指针，则向父类派发，最后找不到则抛给`message forwarding`操作，抛出异常。
完整的消息转发流程。
重写 resolveInstanceMethod 来处理消息转发。

## 方法交换

方法交换的原理：修改类的 selector 映射表
作用：运行时改变原有方法的实现，多用于调试，不宜滥用。

## 类对象 Class

每个类实例有一个 isa 指针指向类对象 Class，每个类对象有一个 isa 指针指向 metaclass
判断对象类型应使用类型查询方法，`isKindOfClass:` `isMemberOfClass:`，因为 NSProxy 的 class 是 NSProxy，使用查询方法则为代理对象的类。

## 命名前缀

类、Category 都加前缀

## 全能初始化方法

开发者需要维护好多种初始化方法，尽量调用父类对应方法。

## description

NSObject 协议中的方法，调试应实现 debugDescription 方法。

## 不可变对象

尽量创建不可变对象，不要把可变 collection 公开。

## 命名

语义清晰简洁

## 私有方法命名

加前缀，单一下划线前缀可能会与 apple 源码冲突。

## 错误模型

严重错误才使用异常，因为抛出异常后内存不会自动释放。
规范化使用 NSError，错误通过引用参数或委托返回给调用者处理。

## NSCopying

实现拷贝协议。
可变版本与不可变版本拷贝。
一般尽量使用浅拷贝，深拷贝自己实现。

## 委托

委托对象应该支持的接口定义成协议，协议中可能需要处理的事件定义成方法。
可实现有位段的结构体来缓存委托对象能否响应相关协议方法的信息。

## 分类

尽可能使用分类机制将不同功能划分成小块。
第三方的分类名称和方法总是应该添加专属前缀。
尽量不要在分类中定义属性，可以在扩展中定义属性。

## 扩展

使用扩展向类中增加属性或变量，可扩展读写属性。
隐藏遵循的协议从而少引入头文件。

## 协议

使用协议隐藏无需关心的类，只需要关心响应特定的方法。

## 引用计数

ARC 编译时自动增加 retain release autorelease 等操作
以 alloc、new、copy、mutableCopy 开头的方法，调用者持有方法返回的对象，ARC 会负责释放。其它方法返回的对象，调用者则不持有，不需要负责。
**strong: 默认语义，强引用此值
**unsafe_unretained: 不持有，不安全，对象被销毁时，变量值不会清空
**weak: 不持有，对象销毁时，变量值会自动清空
**autoreleasing: 对象按引用传递给方法时，此值在方法返回时自动释放
CoreFoundation 对象不归 ARC 管理，依然需要 CFRetain、CFRelease。

## dealloc

引用计数为 0 时，执行 dealloc。
dealloc 中只做取消 KVO 或移除通知操作。

## exception

ARC 不处理异常时清理内存，开启 -fobjc-arc-exceptions 标志可以，但会降低效率。除非严重到终止程序或无需处理内存时，才可使用 exception。

## 循环引用

使用 weak 避免循环引用。但也需考虑对象随时可能被释放。

## 自动释放池

自动释放池排布在栈中，嵌套后入先出。
大量临时变量使用自动释放池，降低内存峰值。

## Block

block 分配在栈上，copy 后复制在堆上，成为带引用计数的对象，后续复制只增加引用计数。
应使用 typedef 定义 block。
使用 block 代替 delegate 回调，使得代码分离。

## GCD 同步锁

dispatch_sync 代替 @synchronize 和 NSLock，写操作异步。
写入操作使用 dispatch_barrier_async 使得并发队列中写入依然能单独执行，保证了线程安全。

## GCD 代替 performSelector

performSelector 在编译期间无法确定 selector 的具体对象，且参数过于局限。

## NSOperation

使用 NSOperation 更为灵活，可在必要时 cancel，可指定操作依赖关系，可以使用 KVO，可以指定更细的优先级，可以重用。

## GCD group

dispatch group 可以在并发队列中执行多项任务，并在任务都执行完之后发起通知。非并发队列则无需使用 group。

## dispatch_once

dispatch_once 的 token 标记不能变，更高效且线程安全的。

## 当前队列

队列同步嵌套时，不应用当前单个队列对象来描述所处的队列情况。

## 遍历

for in 快速遍历更高效。
块枚举法遍历是通过 GCD 来并发执行遍历，多核情形下最快。

## 缓存

NSCache 线程安全的，且能自动清理。

## load 与 initialize

如果类或分类实现了 +load 方法，应用启动加载类时，会调用 +load 方法，并且没有继承关系。
在首次要用到某个类的时候，系统会调用 +initialize 方法，此方法遵循继承关系。
无法在编译期间设定的全局常量，可在 +initialize 中初始化该常量。

## NSTimer

NSTimer 对象会持有 target，如果这个 timer 同时又是 target 的成员变量，就会循环引用。
GCD 代替 NSTimer 或者改写成 block 可以避免循环引用且更简单。
