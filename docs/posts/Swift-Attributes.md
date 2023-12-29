---
title: Swift 中的属性标记（Attribute）--更新中...
date: 2023-12-28 14:00:00
tags:
    - Swift
categories:
    - 笔记
---

## @frozen

在 Swift 中，`@frozen` 是一个属性(attribute)，它用于修饰枚举(enum)和结构体(struct)。自 Swift 5 开始，`@frozen` 属性被引入，目的是为了让库的作者可以明确表达他们的类型是否会在未来的版本中添加新的成员，而不破坏二进制兼容性(Binary Compatibility)。

当一个枚举或结构体被标记为 `@frozen` 时，这意味着这个类型的内存布局(memory layout)是固定的，并且在未来的版本中，该类型不会添加新的成员。这允许编译器做出更多优化，因为它可以确信该类型的大小和结构在编译时是已知的，并且在未来也不会改变。

对于枚举来说，`@frozen` 的使用非常重要，因为它影响了 switch 语句的编译方式。如果一个枚举是`@frozen` 的，编译器会要求 switch 语句覆盖所有的枚举情况(case)，因为它知道不会有新的情况被添加。如果枚举不是`@frozen` 的，编译器则会要求 switch 语句包含一个默认情况(default case)，以处理未来可能添加的新情况。

在 Swift 的标准库中，大多数公开的枚举和结构体都是`@frozen`的，这是为了确保它们在未来的 Swift 版本中保持向后兼容性。

举个例子，下面的代码展示了一个`@frozen`枚举：

```Swift
@frozen enum Direction {
    case north
    case south
    case east
    case west
}
```

这里的 Direction 枚举被标记为`@frozen`，这表示它的成员列表在未来不会改变，因此编译器可以安全地假设当它生成 switch 语句的代码时，不需要包含用于处理未来可能添加的新成员的默认情况。

需要注意的是，`@frozen` 属性只能应用于那些你希望保持稳定 ABI(Application Binary Interface)的 public 或者 open 类型。对于内部使用的类型，或者没有公开的库类型，通常不需要使用`@frozen`，因为这些类型的更改不会影响到外部的二进制兼容性。

## 内联

### @inlinable

在 Swift 中，`@inlinable` 是一个函数和方法的属性，它指示编译器可以将该函数或方法的主体内联到其他模块中。这意味着在模块的边界之外，编译器可以将函数或方法的实现直接插入到调用地点，而不是通过正常的函数调用机制。**这可以提高性能，因为它减少了函数调用的开销，并且有可能使更多的优化变得可行。**

使用`@inlinable`属性可以使库的作者控制哪些函数和方法的实现对外部模块可见，这样即使在库的二进制版本之间，这些函数和方法也可以被内联。这对于性能敏感的代码非常有价值，**但要注意，一旦你将函数标记为 `@inlinable`，你就承诺了这部分 API 的二进制稳定性，因为外部模块可能依赖于这些具体的实现细节。**

下面是一个使用 `@inlinable` 的示例：

```Swift
public struct MyStruct {
    public var value: Int

    @inlinable
    public func computeSomethingComplex() -> Int {
        // 复杂的计算
        return value * value
    }
}
```

这里，computeSomethingComplex 方法被标记为`@inlinable`，这允许其他模块在调用这个方法时直接插入其实现代码，而不是通过正常的函数调用。这样做的好处是可能提高性能，但代价是减少了将来修改函数实现的灵活性，因为外部代码可能已经内联了旧的实现。

需要注意的是，`@inlinable`属性只应该用于那些你有意公开其实现细节，并承诺在未来版本中保持二进制兼容性的公开(public)或开放(open)函数和方法。对于内部(internal)或私有(private)的函数和方法，默认情况下它们的实现是不可见的，并且编译器已经可以在同一个模块中自由内联这些函数和方法，无需`@inlinable`属性。

### @usableFromInline

`@usableFromInline` 是 Swift 中的一个属性，用于修饰属性、函数、初始化器和下标等声明。这个属性的作用是允许这些被修饰的元素在其定义模块的内部是可见的，并能够被标记为`@inlinable` 的代码使用，同时在模块外部它们仍然是私有的。换句话说，`@usableFromInline` 提供了一种方式，在不将 API 公开为公共 API 的同时，让它能够被其他模块内联使用。

`@usableFromInline` 属性通常与`@inlinable` 一起使用，用于实现对某些函数或方法内部实现的内联，同时保持它们不被外部模块直接访问。这在你想优化性能而又不想泄露内部实现细节时非常有用。

举个例子，你可能有一个内部使用的函数，这个函数是性能关键的，并且你想让它能够被其他模块内联，但不想让它成为你公共 API 的一部分：

```Swift
internal struct SomeInternalStruct {
    internal var value: Int

    @usableFromInline
    internal func criticalInternalMethod() -> Int {
        // 一些性能敏感的操作
        return value * 42
    }
}

@inlinable
public func publicFunctionUsingInternalMethod() -> Int {
    let instance = SomeInternalStruct(value: 10)
    // criticalInternalMethod 能够被这个公共函数内联使用，尽管它自身是 internal 的。
    return instance.criticalInternalMethod()
}
```

在上面的例子中，criticalInternalMethod 函数被标记为`@usableFromInline`，这意味着尽管它是内部的(internal)，它仍然可以被同一个模块中的`@inlinable` 代码内联调用，比如 publicFunctionUsingInternalMethod 函数。重要的是，criticalInternalMethod 函数对模块外部依然是不可见的，这有助于隐藏实现细节并保持二进制兼容性。

使用`@usableFromInline` 时需要小心，因为一旦你使用了这个属性，你就在承诺该内部 API 的稳定性，因为它可以被模块内部的`@inlinable` 代码使用，并可能会影响到模块的二进制接口（ABI）。

### @inline、@inline(never)、@inline(__always)

在 Swift 中，`@inline` 属性用于控制编译器的内联行为，即是否将函数的实现在编译时插入到每个调用点。这个属性可以带有不同的参数，表明编译器应该如何处理内联。Swift 提供了两种主要的形式：`@inline(never)` 和 `@inline(__always)`。

`@inline(never)`：这个属性表明编译器不应该内联标记的函数，无论它被调用的上下文是什么。即使编译器认为内联能够带来性能提升，也应遵守这个属性指示不进行内联。这可以用在你不希望由于内联而失去函数调用开销的情况，或者当你认为内联可能导致代码膨胀时。

```Swift
@inline(never)
func myNonInlinableFunction() {
    // 这个函数不会被内联到调用它的地方
}
```

`@inline(__always)`：与`@inline(never)`相反，这个属性指示编译器应该尽可能总是内联这个函数，不管它的调用上下文。这可以用于那些非常小、经常被调用且对性能至关重要的函数，当你希望避免函数调用的额外开销时。

```Swift
@inline(__always)
func myAlwaysInlinableFunction() {
    // 这个函数会被尽可能地内联到调用它的地方
}
```

需要注意的是，`@inline(never)` 和 `@inline(__always)` 都只是编译器的指示，而不是强制的命令。编译器在某些情况下可能会忽略这些指示，例如，如果函数体非常大，那么即使使用了 `@inline(__always)`，编译器也可能决定不进行内联以避免代码膨胀。或者，如果函数是递归的，即使 `@inline(never)` 也可能不会被遵守，因为内联递归函数可能会导致无限内联循环。

总体来说，这些内联相关的属性应该谨慎使用，因为它们对编译器的优化有很强的指示作用。在大多数情况下，最好的做法是让编译器根据它的优化策略来自动决定是否内联函数。只有当你对你的代码和性能有深入了解，并且通过性能分析确认这些改变确实带来了好处时，才使用这些属性。

