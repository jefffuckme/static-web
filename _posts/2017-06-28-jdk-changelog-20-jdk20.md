---
layout: post
title: java 变更日志-20-jdk20
date:  2017-06-28 23:15:43 +0800
categories: [Java]
tags: [jdk, java]
published: true
---

# 拓展阅读

[Java Functional java 函数式编程](https://houbb.github.io/2017/06/29/java-functional)

[Java Lambda](https://houbb.github.io/2017/06/28/java-lambda)

# jdk20 有哪些新特性

JDK 20 引入了多个新特性，这些特性大多处于孵化或预览阶段，以下是 JDK 20 中的一些关键新特性：

1. **作用域值（Scoped Values）**：
   - 作为孵化 API 引入，作用域值允许在线程内和线程间共享不可变数据，优先于线程局部变量，特别是在使用大量虚拟线程时。

2. **记录模式（Record Patterns）**：
   - 记录模式在 JDK 20 中是第二轮预览，它允许解构记录值，使得代码更简洁易读，并减少空指针异常的风险。

3. **`switch` 模式匹配（Pattern Matching for `switch`）**：
   - 这是 `switch` 语句的模式匹配功能的第四轮预览，允许在 `case` 标签中使用模式，使数据查询更加简洁和安全。

4. **外部函数与内存 API（Foreign Function & Memory API）**：
   - 第二轮预览，这个 API 允许 Java 程序与 Java 运行时之外的代码和数据进行互操作，提供了比 JNI 更安全和易于使用的方法。

5. **虚拟线程（Virtual Threads）**：
   - 虚拟线程是轻量级线程，旨在减少编写、维护和观察高吞吐量并发应用程序的工作量。这是虚拟线程的第二轮预览。

6. **结构化并发（Structured Concurrency）**：
   - 结构化并发是第二轮孵化，它简化了多线程编程，将多个任务视为一个工作单元，简化了错误处理和取消操作。

7. **向量 API（Vector API）**：
   - 向量 API 是第五轮孵化，它允许表达可以在运行时编译为特定 CPU 架构上最佳向量指令的向量计算。

8. **未命名模式和变量（Unnamed Patterns and Variables）**：
   - 这是一个预览特性，允许使用下划线 `_` 表示未命名的变量以及在模式匹配时不使用的组件，提高代码的可读性和可维护性。

9. **未命名类和实例 `main` 方法（Unnamed Classes and Instances `main` methods）**：
   - 这个预览特性简化了 `main` 方法的声明，使得初学者更容易上手 Java。

这些特性体现了 Java 语言和平台的持续进化，旨在提高性能、简化并发编程、增强安全性和易用性。

值得注意的是，JDK 20 是一个非长期支持（LTS）版本，它将在六个月后被 JDK 21 取代。


# jdk20  作用域值（Scoped Values）

JDK 20 中引入了作用域值（Scoped Values）作为孵化 API，这是 Java 并发编程的一个重要补充。

作用域值的核心概念是提供一种新的线程间数据共享机制，它允许在不同线程中安全地共享不可变数据，而无需担心数据竞争和同步问题。

以下是作用域值的一些关键特性：

1. **不可变性**：作用域值是不可变的，这意味着一旦创建，它的值就不能被更改。这提供了线程安全性，因为不可变对象不需要额外的同步措施。

2. **作用域限制**：作用域值的访问受限于其声明的作用域，通常是一个代码块或方法调用栈。这限制了变量的可见性和生命周期，减少了作用域错误的风险。

3. **简化线程间共享**：与传统的线程局部变量（ThreadLocal）相比，作用域值提供了一种更简洁和更安全的方式来共享数据。它们允许在大型程序中的组件之间高效地共享数据，而无需通过方法参数传递。

4. **易于使用**：作用域值的 API 设计简单直观，易于理解和使用。开发者可以快速地声明和使用作用域值，而无需深入了解底层的并发机制。

5. **与虚拟线程的协同**：作用域值与 JDK 20 中的另一个特性——虚拟线程（Virtual Threads）——紧密集成。虚拟线程是轻量级的线程，它们可以大量并发执行，而作用域值为这些线程提供了一种高效的数据共享方式。

6. **性能优势**：由于作用域值的不可变性和作用域限制，它们在多线程环境中的性能通常优于传统的线程安全技术，如同步块或锁。

7. **孵化阶段**：作为孵化 API，作用域值还处于早期开发阶段，可能会在未来的 JDK 版本中进行改进和优化。

8. **使用示例**：
   ```java
   final static ScopedValue<String> message = new ScopedValue<>();
   message.run(() -> {
       // 在这里访问或修改 message 的值
       String value = message.get();
       // ...
   });
   ```

作用域值是 JDK 20 中的一个创新特性，它为 Java 并发编程提供了一种新的解决方案，特别是在处理大量并发线程时，它的优势更加明显。

随着 Java 并发模型的不断发展，作用域值有望成为未来版本中的标准特性。

# jdk20  记录模式（Record Patterns）
记录模式是 JDK 20 的第二轮预览特性，它允许开发者通过模式匹配来解构记录值，使得代码更加简洁且易于理解，同时减少了空指针异常的风险。

# 记录模式（Record Patterns）

记录模式是 Java 语言的一个特性，它在 JDK 20 中作为第二轮预览引入。这个特性旨在通过模式匹配来简化记录（record）类型的使用，特别是在解构记录以访问其组成部分时。

记录模式与 Java 14 引入的记录类型（record type）紧密相关，提供了一种声明式的方式来处理数据。

以下是记录模式的一些关键特性：

1. **解构记录**：记录模式允许开发者在访问记录时直接解构其组成部分，而不需要先将其分配给临时变量。

2. **增强可读性**：通过直接在 `instanceof` 或 `switch` 语句中使用记录模式，代码的可读性和意图表达更加清晰。

3. **与模式匹配结合**：记录模式与 Java 16 引入的模式匹配特性（`instanceof` 模式匹配）相结合，提供了一种新的方式来处理对象实例。

4. **第二轮预览**：在 JDK 20 中，记录模式作为第二轮预览出现，这意味着它已经比第一轮预览时更加成熟，但仍然可能根据开发者的反馈进行调整。

5. **示例代码**：
   ```java
   record Point(int x, int y) {}

   void printPoint(Point point) {
       if (point instanceof Point(int x, int y)) {
           System.out.println("Point coordinates: x = " + x + ", y = " + y);
       }
   }
   ```
   在这个例子中，通过 `instanceof` 与记录模式结合，我们可以直接访问 `Point` 记录的 `x` 和 `y` 成员，而不需要先将其赋值给其他变量。

6. **与 `switch` 表达式结合**：
   ```java
   record Shape(String type, double area) {}

   String describe(Shape shape) {
       return switch (shape) {
           case Shape("Circle", area) -> "A circle with area " + area;
           case Shape("Rectangle", area) -> "A rectangle with area " + area;
           default -> "An unknown shape";
       };
   }
   ```
   在这个例子中，`switch` 表达式使用了记录模式来匹配 `Shape` 记录的类型和面积。

7. **类型安全**：由于记录模式在编译时进行检查，因此它提供了类型安全，减少了运行时错误的可能性。

8. **反馈驱动的改进**：作为预览特性，记录模式的最终形态将受到社区反馈的影响，Oracle 可能会根据这些反馈对 API 进行调整。

记录模式是 Java 语言在处理数据结构方面的一项重要补充，它使得处理记录类型更加直观和方便。随着 JDK 的发展，预计记录模式将逐渐趋于稳定，并在未来的版本中成为正式特性。

# jdk20  `switch` 模式匹配（Pattern Matching for `switch`）

# `switch` 模式匹配（Pattern Matching for `switch`）

在 JDK 20 中，`switch` 模式匹配作为一个语言特性进行了第四轮预览。

这个特性是对传统 `switch` 语句的重大扩展，它允许在 `case` 语句中使用模式匹配来增强代码的可读性和表达能力。

这个特性与 Java 16 中引入的 `instanceof` 模式匹配相辅相成，提供了一种更简洁和类型安全的方式来处理数据。

以下是 `switch` 模式匹配的一些关键特性：

1. **模式匹配**：允许在 `switch` 语句的 `case` 标签中使用模式，而不仅仅是字面量或引用。

2. **增强表达能力**：通过模式匹配，可以更简洁地表达复杂的条件逻辑，减少代码的冗余。

3. **类型安全**：模式匹配提供的类型安全检查可以帮助开发者避免一些常见的错误，如类型转换错误。

4. **与记录模式结合**：可以与记录类型结合使用，从而在 `switch` 语句中直接解构记录。

5. **第四轮预览**：在 JDK 20 中，这个特性作为第四轮预览出现，表明它已经接近完成，但可能还会根据开发者的反馈进行微调。

6. **示例代码**：
   ```java
   enum Color {
       RED, GREEN, BLUE
   }
   
   record RGB(int r, int g, int b) {}
   
   void printColorInfo(Color color) {
       System.out.println(switch (color) {
           case RED -> new RGB(255, 0, 0);
           case GREEN -> new RGB(0, 255, 0);
           case BLUE -> new RGB(0, 0, 255);
           default -> throw new IllegalArgumentException("Unknown color");
       });
   }
   ```
   在这个例子中，`switch` 表达式为每个 `Color` 枚举值创建了一个 `RGB` 记录。

7. **守卫表达式**：模式匹配可以与守卫表达式结合使用，提供更精细的控制。
   ```java
   switch (obj) {
       case String s when s.length() > 10 -> System.out.println("Long string");
       case String s -> System.out.println("String");
       // ...
   }
   ```

8. **简化的语法**：第四轮预览中对 `switch` 标签的语法进行了简化，使其更加一致和易于理解。

9. **穷尽性检查**：`switch` 表达式需要尽可能穷尽所有可能的情况，或者使用 `default` 来处理未明确列出的情况。

10. **与现有代码的兼容性**：尽管 `switch` 模式匹配是一个新特性，但它设计为与现有的 `switch` 语句兼容，这意味着现有的 `switch` 代码可以在不做修改的情况下继续工作。

`switch` 模式匹配是 Java 语言在模式匹配方面的重要补充，它预计将在未来的 JDK 版本中成为正式特性。

这个特性不仅提高了代码的可读性，还增强了语言的表达能力，使得处理条件逻辑更加直观和方便。

# jdk20  外部函数与内存 API（Foreign Function & Memory API）

# 外部函数与内存 API（Foreign Function & Memory API）

JDK 20 中的外部函数与内存 API（通常称为 Java FFM API 或 Project Panama 的一部分）是一个重要的孵化特性，它允许 Java 程序安全且高效地与 Java 运行时之外的代码和数据进行互操作。

这个 API 特别关注于提供一种比 Java Native Interface (JNI) 更安全、更易用的方法来调用本地库和操作非 JVM 管理的内存。

以下是 Java FFM API 的一些关键点：

1. **互操作性**：FFM API 使得 Java 代码能够调用用其他语言（如 C 或 C++）编写的本地库中的函数。

2. **内存操作**：API 提供了对非 JVM 管理内存（即堆外内存）的安全访问，这对于那些需要高性能或特别内存管理的应用程序来说非常重要。

3. **性能**：与 JNI 相比，FFM API 旨在提供更低的性能开销，同时保持或超越 JNI 的性能。

4. **安全性**：通过避免 JNI 中常见的一些风险，如直接内存访问和类型不匹配问题，FFM API 提供了一种更安全的操作方式。

5. **资源类型**：FFM API 引入了资源类型的概念，这些资源在作用域结束时自动被清理，减少了内存泄漏和其他资源管理问题。

6. **符号查找**：API 提供了 `SymbolLookup` 对象，允许开发者查找和操作已加载的本地库中的符号。

7. **函数描述**：使用 `FunctionDescriptor` 对象定义外部函数的参数和返回类型，确保在 Java 和本地代码之间正确地转换数据类型。

8. **方法句柄**：FFM API 使用 Java 方法句柄来表示和调用外部函数，这使得调用过程更加自然和高效。

9. **内存段**：`MemorySegment` 对象用于表示内存区域，可以是堆外内存，允许开发者对其进行操作。

10. **作用域和生命周期管理**：通过 `Arena` 对象管理内存分配和释放，确保资源的生命周期得到合理管理。

11. **限制和警告**：FFM API 中的某些操作被认为是不安全的，如 `MemorySegment::reinterpret` 方法的使用。默认情况下，这些操作会在运行时发出警告。

12. **与 JNI 的关系**：FFM API 旨在最终取代 JNI，提供一种更安全和高效的方式来处理 Java 与本地代码的互操作。

13. **未来发展**：尽管 FFM API 在 JDK 20 中是第三次预览，但预计它将继续发展，并在 JDK 的未来版本中成为正式特性。

FFM API 是 Java 在处理与本地代码互操作方面的一个重要进步，它提供了一种现代、类型安全且性能优异的方法来访问外部函数和内存。

随着 JDK 的发展，预计 FFM API 将逐渐趋于稳定，并在未来版本中成为标准特性。

# jdk20  虚拟线程（Virtual Threads）

虚拟线程是 JDK 20 中的第二轮预览特性，它们是轻量级的线程，旨在减少编写、维护和观察高吞吐量并发应用程序的工作量。

在 JDK 20 中，虚拟线程作为 Project Loom 的一部分，继续作为预览特性进行开发。

虚拟线程旨在提高 Java 程序的并发性能，通过减少传统线程的使用来降低并发编程的复杂性和成本。

以下是虚拟线程的一些关键特性：

1. **轻量级线程**：虚拟线程是一种轻量级的线程实现，它们比传统的 Java 线程更加轻量，因此可以创建数以百万计的虚拟线程而不会像传统线程那样对系统资源造成过大压力。

2. **并发性能**：虚拟线程旨在提高应用程序的并发性能，特别是在 I/O 密集型和高吞吐量的场景中。

3. **简化同步**：由于虚拟线程的轻量级特性，它们减少了传统线程同步和上下文切换的开销。

4. **与结构化并发的兼容性**：虚拟线程与结构化并发（Structured Concurrency）的概念相结合，允许开发者以更安全和更直观的方式编写并发代码。

5. **非阻塞 I/O**：虚拟线程与非阻塞 I/O 操作相结合，可以显著提高对 I/O 密集型任务的处理能力。

6. **资源管理**：虚拟线程的生命周期和资源管理被简化，减少了传统线程管理中的复杂性。

7. **预览特性**：在 JDK 20 中，虚拟线程仍然是一个预览特性，这意味着它们还在开发中，并且可能在 JDK 的未来版本中发生变化。

8. **使用限制**：由于是预览特性，使用虚拟线程需要在编译和运行 Java 程序时添加 `--enable-preview` 参数。

9. **与 JDK 版本的兼容性**：虚拟线程在 JDK 17 中首次作为孵化特性引入，并在 JDK 18 和 JDK 19 中作为预览特性继续开发。

10. **示例代码**：
    ```java
    Thread.startVirtual(() -> {
        // 这里是虚拟线程执行的代码
    });
    ```
    使用 `Thread.startVirtual` 方法可以启动一个虚拟线程。

11. **状态和控制**：虚拟线程提供了与传统线程相似的状态管理和控制机制，如启动、等待完成等。

12. **未来展望**：随着 Project Loom 的进一步发展，虚拟线程预计将在 JDK 的某个未来版本中成为正式特性，从而为 Java 并发编程带来革命性的变化。

虚拟线程是 Java 并发模型的一个重大补充，它为开发者提供了一种新的工具来处理高并发场景，同时简化了并发编程的复杂性。

随着 JDK 的发展，虚拟线程有望成为 Java 标准库中不可或缺的一部分。

# jdk20  结构化并发（Structured Concurrency）

结构化并发是 JDK 20 的第二轮孵化特性，它通过将多个任务视为一个工作单元来简化多线程编程，改善了错误处理和任务取消的机制。

在 JDK 20 中，结构化并发作为孵化 API 的一部分，旨在简化和改进多线程程序的编写和管理。结构化并发是一种编程范式，它通过将并发任务组织为一个工作单元，从而简化错误处理、取消操作，并提高程序的可靠性和可观测性。

以下是结构化并发的一些关键特性：

1. **工作单元**：结构化并发将相关的并发任务（如线程或异步任务）组织为一个工作单元，这些任务作为一个整体被管理，便于集中处理取消和异常。

2. **错误传播**：如果工作单元中的一个任务失败，结构化并发可以自动取消同一工作单元中的其他任务，并将异常传播到父任务，简化了错误处理。

3. **作用域**：结构化并发通常与一个特定的代码块或作用域关联，任务的生命周期被限制在这个作用域内。

4. **取消操作**：结构化并发提供了一种机制，允许在不需要时取消整个工作单元中的所有任务。

5. **资源管理**：它与作用域结合，可以确保在作用域结束时自动释放资源，减少了资源泄露的风险。

6. **安全性**：结构化并发通过限制任务的执行范围，减少了并发编程中的许多常见错误，如死锁和竞态条件。

7. **与虚拟线程的协同**：结构化并发与虚拟线程紧密结合，使得在大量并发执行时，资源管理和错误处理更加高效。

8. **异步编程**：结构化并发也适用于异步编程模式，可以与 CompletableFuture 或其他异步 API 结合使用。

9. **预览特性**：在 JDK 20 中，结构化并发作为一个预览特性，允许开发者尝试这个 API 并提供反馈。

10. **示例代码**：
    ```java
    StructuredTaskScope scope = StructuredTaskScope.open();
    try {
        scope.spawn(() -> {
            // 这里是并发任务的代码
        });
        // 可以继续执行其他工作单元外的代码
    } finally {
        scope.close();
    }
    ```
    使用 `StructuredTaskScope` 可以定义一个结构化并发的作用域，并使用 `spawn` 方法来启动并发任务。

11. **资源清理**：在作用域结束时，所有启动的任务都将被取消，并且相关的资源将被清理。

12. **未来发展**：结构化并发预计将继续发展，并在 JDK 的未来版本中提供更稳定的 API。

结构化并发是 Java 并发编程领域的一个重要进展，它通过提供一种新的编程模型来帮助开发者更安全、更高效地编写并发程序。随着 JDK 的发展，结构化并发有望成为 Java 标准库中的标准特性，从而成为 Java 程序员处理并发问题的首选方法。

# jdk20  向量 API（Vector API）

JDK 20 中的向量 API 是一个孵化中的 API，它允许开发者以一种能在运行时编译为特定 CPU 架构上最佳向量指令的方式来表达向量计算。这意味着开发者可以利用现代 CPU 的 SIMD（单指令多数据）功能，从而在某些类型的计算密集型任务中实现比标量计算更好的性能。

以下是向量 API 的一些关键特性：

1. **平台无关性**：向量 API 提供了一种与平台无关的方式来表达向量计算，使得开发者可以编写一次代码，然后在支持的 CPU 架构上运行，以利用硬件加速。

2. **性能提升**：通过使用向量 API，开发者可以潜在地提高应用程序的性能，尤其是在需要大规模并行处理的数值计算任务中。

3. **安全性**：与直接使用 SIMD 指令相比，向量 API 提供了更高级别的抽象，减少了因错误使用硬件指令而带来的风险。

4. **孵化阶段**：向量 API 在 JDK 20 中处于第五轮孵化阶段，这意味着它还在开发中，并且可能会根据用户反馈进行改进。

5. **内存段操作**：向量 API 增强了对 `MemorySegment` 的操作，允许从 `MemorySegment` 加载和存储向量，这与外部函数和内存 API（Foreign Function & Memory API）的预览定义相一致。

6. **表达能力**：向量 API 提供了丰富的表达能力，允许开发者以声明式的方式编写复杂的向量运算。

7. **未来展望**：随着 JDK 的发展，向量 API 预计将逐渐趋于稳定，并在未来版本中成为正式特性，从而为 Java 程序提供更广泛的硬件加速能力。

向量 API 是 Java 在性能优化方面的一个重要进展，它为开发者提供了一种新的工具来利用现代 CPU 的并行处理能力，同时简化了并行计算的复杂性。

随着 JDK 的发展，向量 API 有望成为 Java 标准库中的标准特性，从而成为 Java 程序员处理高性能计算问题的首选方法。

# jdk20  未命名模式和变量（Unnamed Patterns and Variables）

在 JDK 20 中，未命名模式和变量作为一个预览特性引入，旨在简化 Java 编程语言中的模式匹配和变量声明。这个特性通过引入新的语法结构，允许开发者在模式匹配和变量声明中忽略某些不需要的值，从而提高代码的可读性和简洁性。

以下是未命名模式和变量的一些关键特性：

1. **简化代码**：通过使用下划线 `_` 作为未命名模式或变量，开发者可以忽略在模式匹配中不需要的值，从而减少代码的冗余。

2. **提高可读性**：未命名模式和变量的使用使得代码更加直观，开发者可以更清晰地表达他们的意图，即某些值在当前上下文中是不必要的。

3. **减少模板代码**：在处理包含多个元素的数据结构时，如果某些元素不需要被单独处理，未命名模式和变量可以减少模板代码的编写。

4. **预览特性**：作为预览特性，未命名模式和变量在 JDK 20 中引入，这意味着它还在开发中，并且可能会根据用户反馈进行改进。

5. **示例代码**：
   ```java
   Object obj = ...;
   if (obj instanceof String _ || obj instanceof Integer _) {
       // 在这里，我们不关心具体的 String 或 Integer 值
   }
   ```

   在这个例子中，模式匹配使用了下划线 `_` 来表示开发者不关心 `String` 或 `Integer` 的具体值。

6. **与现有代码的兼容性**：尽管未命名模式和变量是一个新特性，但它设计为与现有的 Java 代码兼容，这意味着现有的代码可以在不做修改的情况下继续工作。

7. **未来发展**：随着 JDK 的发展，未命名模式和变量预计将在 JDK 的未来版本中成为正式特性，从而成为 Java 程序员在处理数据结构时的一个有用工具。

未命名模式和变量是 Java 语言在模式匹配方面的一个重要补充，它为开发者提供了一种新的工具来处理不需要的值，同时简化了代码的编写。随着 JDK 的发展，这个特性有望成为 Java 标准库中的标准特性，从而帮助 Java 程序员编写更简洁、更易读的代码。

# 未命名类和实例 `main` 方法（Unnamed Classes and Instances `main` methods）

在 JDK 20 中，未命名类和实例 `main` 方法作为一个预览特性引入，旨在简化 Java 程序的入口点声明。

这个特性允许开发者定义一个不需要类名的 `main` 方法，从而使得创建简单的 Java 应用程序更加容易和直观。

以下是未命名类和实例 `main` 方法的一些关键特性：

1. **简化程序入口**：开发者可以直接在源文件中编写 `main` 方法，而不需要显式定义一个包含该方法的类。

2. **减少样板代码**：未命名类的特性减少了编写 Java 程序时所需的样板代码量，使得开发者可以更专注于业务逻辑。

3. **易于理解和使用**：对于 Java 初学者来说，未命名类和 `main` 方法的引入降低了学习曲线，使得他们可以更快地开始编写简单的 Java 程序。

4. **预览特性**：作为预览特性，未命名类和实例 `main` 方法在 JDK 20 中引入，这意味着它还在开发中，并且可能会根据用户反馈进行改进。

5. **示例代码**：
   ```java
   public static void main(String[] args) {
       // 程序逻辑
   }
   ```

   在这个例子中，开发者可以直接在源文件中编写 `main` 方法，而不需要将其放在一个类定义中。

6. **与现有代码的兼容性**：尽管未命名类和实例 `main` 方法是一个新特性，但它设计为与现有的 Java 代码兼容，这意味着现有的类定义和 `main` 方法的使用不受影响。

7. **未来发展**：随着 JDK 的发展，未命名类和实例 `main` 方法预计将在 JDK 的未来版本中成为正式特性，从而成为 Java 程序员在编写简单程序时的一个有用工具。

未命名类和实例 `main` 方法是 Java 语言在简化程序构造方面的一个重要补充，它为开发者提供了一种新的工具来简化 Java 程序的编写。

* any list
{:toc}