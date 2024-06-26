---
layout: post
title: java 变更日志-16-jdk16
date:  2017-06-28 23:15:43 +0800
categories: [Java]
tags: [jdk, java]
published: true
---

# 拓展阅读

[Java Functional java 函数式编程](https://houbb.github.io/2017/06/29/java-functional)

[Java Lambda](https://houbb.github.io/2017/06/28/java-lambda)

# jdk16 有哪些新特性

JDK 16 引入了一系列新特性和改进，以下是 JDK 16 的一些主要新特性：

1. **模式匹配改进（JEP 394）**：`instanceof` 表达式的模式匹配成为正式特性，允许更简洁和安全的类型检查和变量声明。

2. **记录类型（JEP 395）**：记录（Records）作为语法糖，用于创建不可变的数据载体，减少样板代码。

3. **打包工具（JEP 392）**：提供了 `jpackage` 工具，用于打包独立的 Java 应用程序。

4. **ZGC：并发线程栈处理（JEP 376）**：对 Z Garbage Collector 进行了改进，支持并发线程栈处理，进一步提升性能。

5. **UNIX-域 Socket 通道（JEP 380）**：为 `java.nio.channels` 包中的套接字通道和服务端套接字通道 API 增加了 UNIX 域套接字通道支持。

6. **弹性元空间（JEP 387）**：改进了 HotSpot 虚拟机的元空间内存管理，提高了内存使用效率。

7. **Windows/AArch64 端口（JEP 388）**：将 JDK 移植到了 Windows/AArch64 平台。

8. **外部链接器 API（JEP 389）**：孵化器模块，提供对本地代码的静态类型访问支持。

9. **基于值的类的警告（JEP 390）**：为基于值的类提供了编译时警告，以避免不当的同步和其他潜在问题。

10. **密封类（JEP 397）**：二次预览特性，允许限制哪些类或接口可以继承或实现特定的封闭类或接口。

11. **默认强封装 JDK 内部元素（JEP 396）**：JDK 16 开始，默认情况下对 JDK 内部元素进行强封装，限制对它们的访问。

12. **向量 API（JEP 338）**：孵化器模块，提供对 SIMD 指令的支持，以便在 Java 中执行向量计算。

13. **C++14 语言特性支持（JEP 347）**：允许在 JDK 的 C++ 源代码中使用 C++14 的新语言特性。

14. **从 Mercurial 迁移到 Git（JEP 357）**：将 OpenJDK 社区的源代码存储库从 Mercurial 迁移到 Git。

15. **迁移到 GitHub（JEP 369）**：在 GitHub 上托管 OpenJDK 社区的 Git 存储库。

16. **外部存储器访问 API（JEP 1339）**：三次孵化的 API，允许 Java 程序安全有效地访问 Java 堆之外的外部内存。

17. **启用 C++14 语言特性（JEP 12397）**：在 JDK 源代码中使用 C++14 语言特性，以提升代码质量和开发效率。

这些新特性和改进体现了 JDK 16 在性能、安全性、易用性和现代化方面的持续进步。

开发者应当关注这些变化，以确保他们的应用程序能够利用 JDK 16 引入的新特性和改进。


# 1. jdk16 模式匹配改进（JEP 394）

JDK 16 引入了 JEP 394：模式匹配改进（Pattern Matching for instanceof），这是对 Java 语言中 `instanceof` 关键字的模式匹配特性的最终确定版。

以下是 JDK 16 中模式匹配改进（JEP 394）的详细介绍：

1. **最终确定**：模式匹配在 JDK 14 中首次作为预览特性引入（JEP 305），随后在 JDK 15 中进行了第二轮预览（JEP 375），最终在 JDK 16 中成为正式特性。

2. **简化类型检查**：该特性允许开发者在 `instanceof` 表达式中直接进行类型检查和变量声明，减少了类型转换的需要，使代码更加简洁。

3. **增强安全性**：通过模式匹配，编译器可以更精确地检查类型，减少了在类型转换过程中潜在的 `ClassCastException` 风险。

4. **语法使用**：在 `instanceof` 操作中，可以直接声明一个新的变量，如果类型匹配，该变量将会是特定类型的引用，无需显式类型转换。示例如下：
   ```java
   if (obj instanceof String s) {
       // 可以直接使用变量 s，它已经被确认是 String 类型
   }
   ```

5. **设计目的**：模式匹配的目的是使条件语句更加简洁和易于理解，同时提供更好的类型安全性。

6. **与其他特性的集成**：模式匹配预计将与 Java 中的其他语言结构（如 `switch` 表达式和语句）集成，提供更一致的编程体验。

7. **社区反馈**：Java 社区的反馈对于模式匹配的最终设计至关重要，JEP 394 根据从预览特性阶段收集到的反馈进行了改进。

8. **官方文档**：JEP 394 的官方文档提供了关于模式匹配如何工作的详细信息，包括语法和示例代码。

通过 JEP 394，JDK 16 继续改进 Java 语言的模式匹配能力，提供了一种更加强大和用户友好的方式来处理类型检查和变量声明。

# 2. jdk16 记录类型（JEP 395）

JDK 16 引入了 JEP 395：记录类型（Records），这是对 Java 语言的一个重大增强，它作为正式特性被引入。记录类型提供了一种简洁的方式来表达浅拷贝、不可变的数据载体，从而减少了样板代码的编写。以下是 JDK 16 中记录类型（JEP 395）的详细介绍：

1. **语法简化**：记录类型通过减少冗余代码简化了数据类的声明。开发者不再需要为每个组件编写构造函数、getter 方法、`equals()`、`hashCode()` 和 `toString()` 方法。

2. **不可变性**：记录类型默认是不可变的，这意味着一旦创建，它们的组件就不能被修改。这有助于减少并发编程中的错误，并提高代码的安全性。

3. **简洁的表示**：记录类型可以用极少的代码来表示数据结构，使得代码更加清晰和易于维护。

4. **组件访问**：记录类型提供了一种访问其组件的简洁语法，可以方便地通过名称来访问和操作这些组件。

5. **构造函数**：记录类型自动生成一个公共的构造函数，该构造函数接受所有组件作为参数，并为每个组件提供一个私有的最终字段。

6. **实现细节**：记录类型背后的实现细节被隐藏起来，使得开发者可以专注于业务逻辑，而不必担心实现细节。

7. **模式匹配**：记录类型与模式匹配（`instanceof`）特性（JEP 394）协同工作，提供了一种强大的数据结构表示方式。

8. **示例代码**：
   ```java
   public record Point(int x, int y) {}
   ```
   上面的代码定义了一个 `Point` 记录类型，它有两个名为 `x` 和 `y` 的组件。记录类型自动提供了一个无参构造函数、getter 方法、组件的 `equals()`、`hashCode()` 和 `toString()` 实现。

9. **泛型支持**：记录类型支持泛型，允许开发者定义具有泛型参数的数据结构。

10. **编译器支持**：记录类型是 Java 语言的一部分，由 Java 编译器直接支持，不需要任何特定的库或框架。

11. **设计目的**：记录类型的设计目的是为了简化数据结构的声明，减少样板代码，并提供一种声明式的方式来表达数据结构。

通过 JEP 395，JDK 16 为 Java 语言引入了一种新的数据结构表达方式，它使得数据类的声明更加简洁、清晰，同时保持了高性能和低开销。

# 3. jdk16 打包工具（JEP 392）

JEP 392 引入了 JDK 16 中的一个新特性，即打包工具。这个新工具旨在为 Java 应用程序提供一种简单、一致的方式来创建自包含的可执行文件，使得应用程序的部署和分发更为便捷。

### 打包工具简介

打包工具是一个命令行工具，允许开发者将 Java 应用程序和其依赖项打包成一个自包含的可执行文件。这包括将应用程序的字节码、依赖的库、JVM 和必要的配置文件等资源打包成一个单独的文件，从而简化了应用程序的部署和运行。

### 主要特性和优势

1. **自包含性**：打包工具创建的可执行文件是自包含的，不需要外部的 Java 运行时环境，这使得应用程序的部署更为简单和灵活。

2. **一致性**：打包工具提供了一种一致的打包方式，无论目标平台如何，都可以得到相同的打包结果，提高了开发和部署的一致性。

3. **灵活性**：打包工具支持多种打包模式和自定义选项，允许开发者根据应用程序的需求进行灵活配置。

4. **集成性**：打包工具可以与其他构建工具和持续集成/持续部署（CI/CD）流程集成，简化了应用程序的自动化打包和部署。

### 使用示例

以下是使用打包工具创建自包含可执行文件的简单示例：

```bash
jpackage \
  --input target/my-app \
  --name my-app \
  --main-jar my-app.jar \
  --main-class com.example.MyApp \
  --runtime-image target/runtime \
  --output target/dist \
  --description "My Java App"
```

### 迁移建议

- **替换现有打包脚本**：考虑使用打包工具替换现有的打包脚本或工具，以利用其提供的自包含和一致性功能。

- **更新文档和教程**：更新相关文档、教程和示例，提供有关打包工具的详细信息、最佳实践和使用指南。

- **测试和验证**：在生产环境之前，对使用打包工具创建的可执行文件进行测试和验证，确保其满足性能、安全性和可靠性要求。

### 结论

JEP 392 的打包工具为 Java 开发者提供了一个强大、灵活和一致的方式来创建自包含的可执行文件，从而简化了应用程序的部署和分发。

通过自包含性、一致性、灵活性和集成性的特性，打包工具为 Java 应用程序的打包和部署提供了新的可能性和选择，有助于提高开发效率和用户体验。

对于需要将 Java 应用程序打包为自包含可执行文件的开发者，打包工具将是一个非常有价值的新特性。

# 4. jdk16 ZGC：并发线程栈处理（JEP 376）

JEP 376 引入了 JDK 16 中 ZGC（Z Garbage Collector）的一个重要增强，即并发线程栈处理。这一改进旨在提高 ZGC 在高并发场景下的性能和稳定性，特别是在处理大量线程时。

### ZGC 简介

ZGC 是一种低延迟的垃圾收集器，专为需要大堆内存的应用程序设计。

它使用了并发的、分代的垃圾收集算法，使得垃圾收集的停顿时间几乎可以忽略不计，适用于需要高吞吐量和低延迟的应用场景。

### 并发线程栈处理的主要特性

1. **并发处理**：并发线程栈处理允许 ZGC 在应用程序运行时并发地扫描和处理线程的栈，减少了垃圾收集导致的停顿时间。

2. **动态线程栈调整**：ZGC 可以动态地调整线程栈的大小，以适应应用程序的实际需求，从而提高了内存使用效率。

3. **减少停顿时间**：通过并发处理线程栈，ZGC 能够在不影响应用程序性能的情况下，有效地减少垃圾收集导致的停顿时间。

### 使用示例

ZGC 是 HotSpot JVM 的默认垃圾收集器之一，可以通过以下命令启用：

```bash
java -XX:+UseZGC -jar my-app.jar
```

### 迁移建议

- **性能测试**：在生产环境之前，对使用 ZGC 的应用程序进行性能测试，以确保新的并发线程栈处理功能能够如预期地提高性能和稳定性。

- **配置调优**：根据应用程序的实际需求，调整 ZGC 的配置参数，如堆大小、并发线程数等，以实现最佳的性能和吞吐量。

- **更新文档和教程**：更新相关文档、教程和示例，提供有关 ZGC 和并发线程栈处理的详细信息、最佳实践和使用指南。

### 结论

JEP 376 的并发线程栈处理增强为 ZGC 提供了一个更强大、更灵活的垃圾收集策略，特别适用于高并发和大堆内存的应用场景。

通过并发处理线程栈和动态调整线程栈大小，ZGC 能够提供更低的停顿时间、更高的吞吐量和更好的内存使用效率。

对于需要高性能和低延迟的 Java 应用程序，使用 ZGC 的新功能将是一个非常有价值的选择，有助于提高应用程序的性能、稳定性和可伸缩性。

# 5. jdk16 UNIX-域 Socket 通道（JEP 380）

JEP 380 引入了 JDK 16 中的一个新特性，即 UNIX 域套接字通道。这一改进为 Java 提供了一个新的 API，允许应用程序通过 UNIX 域套接字在本地进程之间进行高效、安全的通信，而无需通过网络协议栈。

### UNIX 域套接字通道简介

UNIX 域套接字是一种特殊的套接字类型，允许同一台计算机上的进程之间通过文件系统进行通信。与标准的 IP 套接字不同，UNIX 域套接字提供了更高的性能和更低的延迟，适用于需要本地进程之间快速通信的应用场景。

### 主要特性和优势

1. **高性能**：由于 UNIX 域套接字避免了网络协议栈的开销，因此它们通常比传统的 IP 套接字提供更高的性能和更低的延迟。

2. **安全性**：UNIX 域套接字仅限于本地进程之间的通信，不通过网络，因此提供了一种更加安全和私密的通信方式。

3. **灵活性**：UNIX 域套接字通道可以与现有的 Java NIO API 集成，使得应用程序可以方便地利用现有的非阻塞 I/O 和多路复用机制。

### 使用示例

以下是使用 UNIX 域套接字通道进行本地进程通信的简单示例：

```java
import java.net.*;
import java.nio.channels.*;

public class UnixDomainSocketExample {
    public static void main(String[] args) throws Exception {
        UnixDomainSocketAddress address = UnixDomainSocketAddress.of("/tmp/my-socket");
        try (AsynchronousServerSocketChannel serverSocketChannel = AsynchronousServerSocketChannel.open()) {
            serverSocketChannel.bind(address);
            System.out.println("Server started, waiting for connection...");
            serverSocketChannel.accept(null, new CompletionHandler<AsynchronousSocketChannel, Void>() {
                @Override
                public void completed(AsynchronousSocketChannel clientChannel, Void attachment) {
                    System.out.println("Client connected: " + clientChannel);
                    // Handle client connection
                }

                @Override
                public void failed(Throwable exc, Void attachment) {
                    System.err.println("Accept failed: " + exc);
                }
            });
            Thread.sleep(60000);  // Keep the server running for demonstration
        }
    }
}
```

### 迁移建议

- **替换网络套接字**：考虑使用 UNIX 域套接字替换应用程序中的网络套接字，以提高通信性能和安全性。

- **更新文档和教程**：更新相关文档、教程和示例，提供有关 UNIX 域套接字通道的详细信息、最佳实践和使用指南。

- **测试和验证**：在生产环境之前，对使用 UNIX 域套接字通道的应用程序进行测试和验证，确保其满足性能、安全性和可靠性要求。

### 结论

JEP 380 的 UNIX 域套接字通道为 Java 提供了一个新的本地通信解决方案，特别适用于需要高性能和安全性的应用场景。

通过提供高性能、安全和灵活的通信机制，UNIX 域套接字通道为 Java 应用程序的本地进程间通信提供了新的可能性和选择，有助于提高应用程序的性能、安全性和可伸缩性。

对于需要本地进程间快速、安全通信的 Java 应用程序，UNIX 域套接字通道将是一个非常有价值的新特性。

# 6. jdk16 弹性元空间（JEP 387）

JEP 387 引入了 JDK 16 中的一个关键增强，即弹性元空间（Elastic Metaspace）。这个改进旨在优化元空间（Metaspace）的管理，使其能够更加灵活地适应应用程序的需求，从而提高内存使用效率和应用程序的性能。

### 元空间简介

元空间是 Java 虚拟机（JVM）中用于存储类元数据的内存区域。与传统的永久代（PermGen）不同，元空间不会受到固定内存大小的限制，而是根据应用程序的需求动态分配和释放内存。

### 弹性元空间的主要特性

1. **动态调整**：弹性元空间允许 JVM 在运行时动态地调整元空间的大小，以适应应用程序的实际需求。

2. **内存优化**：通过更有效的内存管理和碎片整理，弹性元空间有助于减少内存碎片和提高内存使用效率。

3. **性能优化**：优化的元空间管理可以减少垃圾收集的停顿时间，并提高应用程序的性能和吞吐量。

### 使用示例

弹性元空间是 JVM 的内部优化，大多数情况下不需要开发者进行手动配置或调整。然而，可以通过以下 JVM 参数监控和调整元空间的行为：

```bash
java -XX:+UseElasticMetaspaceSize -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=512m -jar my-app.jar
```

### 迁移建议

- **性能监控**：使用 JVM 监控工具（如 JVisualVM、JConsole 等）监控应用程序的元空间使用情况，以评估弹性元空间的效果。

- **配置调优**：根据应用程序的实际需求和性能特性，适当调整元空间的初始大小（`MetaspaceSize`）和最大大小（`MaxMetaspaceSize`）。

- **更新文档和教程**：更新相关文档、教程和示例，提供有关弹性元空间的详细信息、最佳实践和使用指南。

### 结论

JEP 387 的弹性元空间增强为 Java 应用程序提供了更加灵活和高效的元空间管理机制。

通过动态调整、内存优化和性能优化，弹性元空间有助于提高应用程序的内存使用效率、性能和稳定性。

对于需要动态管理和优化内存使用的 Java 应用程序，弹性元空间将是一个非常有价值的新特性，有助于提高应用程序的可伸缩性和可维护性。

# 7. jdk16 Windows/AArch64 端口（JEP 388）

JEP 388 引入了 JDK 16 中的一个重要增强，即 Windows/AArch64 端口。这一改进旨在为 ARM 架构的 Windows 操作系统提供原生的 JDK 支持，从而扩大 Java 在 ARM 平台上的应用范围。

### Windows/AArch64 端口简介

Windows/AArch64 端口是针对 ARM 架构的 64 位版本的 Windows 操作系统进行的 JDK 端口。此改进使得 Java 应用程序可以在 ARM 架构的 Windows 计算机上原生运行，无需任何额外的兼容性层或模拟器。

### 主要特性和优势

1. **原生支持**：Windows/AArch64 端口提供了针对 ARM 架构的 Windows 操作系统的原生 JDK 支持，确保了 Java 应用程序在此平台上的性能和稳定性。

2. **跨平台一致性**：通过在 ARM 架构的 Windows 上提供与其他平台相同的 JDK 支持，确保了 Java 应用程序在不同平台之间的一致性和可移植性。

3. **性能优化**：针对 ARM 架构进行的优化和调整，有助于提高 Java 应用程序在 Windows/AArch64 上的性能和响应速度。

### 使用示例

要在 Windows/AArch64 系统上运行 Java 应用程序，可以直接下载和安装相应的 Windows/AArch64 版本的 JDK，并按照常规方式运行应用程序。

### 迁移建议

- **平台兼容性测试**：在部署到 Windows/AArch64 系统之前，进行充分的兼容性测试，以确保 Java 应用程序能够正确运行并满足性能和稳定性要求。

- **更新文档和教程**：更新相关文档、教程和示例，提供有关 Windows/AArch64 端口的详细信息、安装指南和最佳实践。

- **优化和调优**：针对 ARM 架构进行性能优化和调优，以实现最佳的性能和资源利用率。

### 结论

JEP 388 的 Windows/AArch64 端口增强为 ARM 架构的 Windows 系统提供了原生的 JDK 支持，扩大了 Java 在多样化平台上的应用范围。

通过原生支持、跨平台一致性和性能优化，Windows/AArch64 端口有助于提高 Java 应用程序在 ARM 架构的 Windows 系统上的性能、稳定性和可移植性。

对于需要在 ARM 架构的 Windows 系统上部署 Java 应用程序的开发者和组织来说，Windows/AArch64 端口将是一个非常有价值的新特性，有助于扩展 Java 的应用范围和生态系统。

# 8. jdk16 外部链接器 API（JEP 389）

JEP 389 引入了 JDK 16 中的一个重要增强，即外部链接器 API（External Linker API）。这个改进为 Java 应用程序提供了一个新的 API，允许开发者通过外部链接器生成和自定义自包含的可执行文件，从而简化应用程序的部署和分发。

### 外部链接器 API 简介

外部链接器 API 允许 Java 开发者利用系统上的外部链接器（如 GNU ld 或 Microsoft link）生成自包含的可执行文件。这些文件包括应用程序的字节码、依赖的库、JVM 和必要的配置文件等，使得应用程序可以独立于特定的 Java 运行时环境运行。

### 主要特性和优势

1. **自包含性**：通过外部链接器 API，开发者可以创建自包含的可执行文件，无需依赖外部的 Java 运行时环境，简化了应用程序的部署和分发。

2. **灵活性**：外部链接器 API 提供了灵活的自定义选项，允许开发者根据应用程序的需求进行高度定制，包括优化、压缩和加密等。

3. **跨平台兼容性**：由于外部链接器 API 支持常见的外部链接器，使得生成的可执行文件可以在多个平台上运行，包括 Windows、Linux 和 macOS 等。

### 使用示例

以下是使用外部链接器 API 生成自包含可执行文件的简化步骤：

```java
import jdk.incubator.foreign.*;

public class ExternalLinkerExample {
    public static void main(String[] args) throws Exception {
        LibraryLookup rt = LibraryLookup.ofDefault();
        FunctionDescriptor fd = FunctionDescriptor.of(CLinker.C_LONG, CLinker.C_LONG);
        SymbolLookup lookup = LibraryLookup.ofPath("libc.so.6").lookup();
        SymbolAddress rand = lookup.lookup("rand");
        try (MemorySegment argsArray = CLinker.toCStringArray(args)) {
            int result = CLinker.toFunction(rand, fd).invokeExact(argsArray.asSegment());
            System.out.println("rand() returned: " + result);
        }
    }
}
```

### 迁移建议

- **替换传统打包工具**：考虑使用外部链接器 API 替换现有的打包脚本或工具，以利用其提供的自包含和灵活性功能。

- **更新文档和教程**：更新相关文档、教程和示例，提供有关外部链接器 API 的详细信息、最佳实践和使用指南。

- **测试和验证**：在生产环境之前，对使用外部链接器 API 创建的可执行文件进行测试和验证，确保其满足性能、安全性和可靠性要求。

### 结论

JEP 389 的外部链接器 API 为 Java 应用程序提供了一个强大和灵活的自包含打包解决方案，有助于简化应用程序的部署和分发。

通过自包含性、灵活性和跨平台兼容性的特性，外部链接器 API 为 Java 应用程序的打包和部署提供了新的可能性和选择，有助于提高开发效率和用户体验。

对于需要创建独立和定制化的可执行文件的 Java 应用程序，外部链接器 API 将是一个非常有价值的新特性。

# 9. jdk16 基于值的类的警告（JEP 390）

JEP 390 引入了 JDK 16 中的一个新特性，即基于值的类的警告（Warnings for Value-Based Classes）。这个增强旨在提高对于基于值的类（Value-Based Classes）在 Java 程序中的使用的警觉性，确保开发者避免不适当地使用这些类，从而减少可能的问题和错误。

### 基于值的类简介

基于值的类是指那些表示不可变值的类，如 `String`、`Integer` 和 `LocalDate` 等。这些类通常是不可变的，即一旦创建，其状态就不会改变。

### 基于值的类的警告特性

1. **编译时警告**：当开发者尝试修改基于值的类的实例时，编译器会发出警告，提醒开发者这是不合适的操作。

2. **运行时警告**：在运行时，如果开发者进行了不适当的基于值的类的操作，JVM 也会发出相应的警告，以引起开发者的注意。

3. **教育性质**：此功能的主要目的是教育性质的，帮助开发者理解基于值的类的正确使用方式，并提高代码的质量和健壮性。

### 使用示例

以下是一个尝试修改基于值的类实例的示例，会导致编译时警告：

```java
public class ValueClassExample {
    public static void main(String[] args) {
        String value = "Hello";
        value.toUpperCase(); // 编译时警告：对基于值的类 String 的不适当修改
    }
}
```

### 迁移建议

- **遵循最佳实践**：遵循基于值的类的最佳实践，避免对其进行不适当的修改，保持其不可变性。

- **审查现有代码**：审查现有代码，确保所有对基于值的类的操作都是合适和正确的，修复可能导致警告的代码段。

- **更新文档和教程**：更新相关文档、教程和示例，提供有关基于值的类的正确使用方式的详细信息和指导。

### 结论

JEP 390 的基于值的类的警告增强提供了一个有用的工具，帮助开发者识别和避免对基于值的类进行不适当的修改，从而提高代码的质量和健壮性。

通过编译时和运行时的警告机制，此功能有助于教育开发者遵循基于值的类的最佳实践，确保其正确和有效的使用。

对于需要使用基于值的类的 Java 开发者，此功能将是一个有价值的辅助工具，有助于提高开发效率和代码的可靠性。

# 10. jdk16 密封类（JEP 397）

JEP 397 引入了 JDK 16 中的一个新特性，即密封类（Sealed Classes）。密封类是一种特殊的类，它限制了其子类的继承范围，使得开发者可以明确指定哪些类可以继承它，从而增强代码的安全性和可维护性。

### 密封类简介

密封类是用 `sealed` 修饰的类，它明确地规定了哪些类可以继承它。这可以帮助开发者控制类的继承结构，防止未授权的类继承，从而提高代码的安全性和稳定性。

### 密封类的主要特性

1. **明确的继承范围**：通过 `sealed` 关键字明确指定哪些类可以继承密封类，不在范围内的类将无法继承。

2. **有限的子类**：密封类的子类必须明确地列出在 `permits` 子句中，限制了子类的数量和类型。

3. **安全性增强**：由于明确了继承关系，密封类可以更有效地控制代码的执行路径，减少潜在的错误和安全风险。

### 使用示例

以下是一个简单的密封类和其子类的示例：

```java
public sealed class Shape permits Circle, Rectangle {
    // ...
}

public final class Circle extends Shape {
    // ...
}

public final class Rectangle extends Shape {
    // ...
}
```

在上述示例中，`Shape` 类是一个密封类，只允许 `Circle` 和 `Rectangle` 两个类继承它。

### 迁移建议

- **设计优化**：考虑使用密封类来优化代码设计，明确类的继承结构，减少复杂性和不必要的继承关系。

- **代码审查**：审查现有代码，识别可能受益于密封类特性的类，进行适当的重构和优化。

- **更新文档和教程**：更新相关文档、教程和示例，提供有关密封类的详细信息、最佳实践和使用指南。

### 结论

JEP 397 的密封类特性为 Java 提供了一个强大的工具，帮助开发者更有效地管理和控制类的继承关系。

通过明确的继承范围、有限的子类和增强的安全性，密封类有助于提高代码的清晰度、安全性和可维护性。

对于需要精确控制类继承关系的 Java 开发者，密封类将是一个非常有价值的新特性，有助于提高代码的质量和健壮性。

# 11. jdk16 默认强封装 JDK 内部元素（JEP 396）

JEP 396 引入了 JDK 16 中的一个新特性，即默认强封装 JDK 内部元素。这个增强旨在提高 JDK 内部 API 的安全性，防止开发者不合理地访问和修改 JDK 的内部元素，从而增强代码的稳定性和可维护性。

### 默认强封装 JDK 内部元素简介

在 JDK 9 引入模块化系统（Project Jigsaw）后，JDK 的一些内部 API 被标记为不推荐使用，并将其封装起来，只能通过特定的方式访问。JEP 396 进一步加强了这种封装，使得 JDK 内部元素默认处于强封装状态，确保开发者无法轻易地访问和修改它们。

### 默认强封装的主要特性

1. **增强安全性**：通过默认强封装 JDK 的内部元素，提高了 JDK 的安全性，防止开发者不合理地访问和修改内部 API。

2. **稳定性增强**：加强封装有助于保持 JDK 的稳定性，防止不受控制的访问和修改导致的潜在问题和错误。

3. **版本兼容性**：默认强封装有助于维护 JDK 的版本兼容性，确保在未来的 JDK 版本中，不推荐使用的内部 API 仍然可以安全地被废弃和移除。

### 迁移建议

- **替换不推荐 API**：如果你的代码依赖于 JDK 的内部 API，考虑替换为公共 API 或第三方库，以确保代码的健壮性和未来的兼容性。

- **更新文档和教程**：更新相关文档、教程和示例，提供有关默认强封装的详细信息、替代方案和最佳实践。

- **代码审查和测试**：进行代码审查和测试，确保代码不依赖于被强封装的 JDK 内部元素，并修复可能导致的问题。

### 结论

JEP 396 的默认强封装 JDK 内部元素增强为 JDK 提供了一个更加健壮和安全的基础，有助于防止不合理的访问和修改 JDK 的内部 API。

通过增强安全性、稳定性和版本兼容性，此特性有助于提高 JDK 的质量和可维护性，为开发者提供一个更加可靠和稳定的开发环境。

对于依赖 JDK 内部 API 的 Java 开发者，JEP 396 提醒他们审查和更新代码，以适应这些变化，从而确保代码的健壮性和未来的兼容性。

# 12. jdk16 向量 API（JEP 338）

JEP 338 引入了 JDK 16 中的一个重要增强，即向量 API。向量 API 为 Java 开发者提供了一套高级、向量化的数据处理工具，使得开发者能够更容易地利用现代硬件（如 SIMD 指令集）来优化并行数据处理，从而提高应用程序的性能。

### 向量 API 简介

向量 API 通过引入新的类和方法，如 `VectorSpecies`、`VectorMask` 和 `VectorShape` 等，扩展了 Java 的标准库，提供了一种高效处理向量化数据的方式。这些工具可以与现有的 Java Stream API 集成，为开发者提供了一个统一、高效的编程模型，用于并行处理大规模数据集。

### 向量 API 的主要特性

1. **高性能并行处理**：向量 API 允许开发者利用 SIMD（单指令多数据）指令集，高效地执行并行数据计算，提高处理速度。

2. **简化并行编程**：通过集成现有的 Java Stream API，向量 API 简化了并行编程，提供了一个更加直观和易用的接口，减少了开发复杂性。

3. **硬件优化**：向量 API 明确地设计用于与硬件的特定特性和优化相集成，使得开发者可以利用硬件的潜能，进一步提高性能。

### 使用示例

以下是一个简单的使用向量 API 进行向量化计算的示例：

```java
import jdk.incubator.vector.*;

public class VectorExample {
    public static void main(String[] args) {
        VectorSpecies<Float> species = FloatVector.SPECIES_256;
        FloatVector a = FloatVector.fromArray(species, new float[] {1.0f, 2.0f, 3.0f, 4.0f}, 0);
        FloatVector b = FloatVector.fromArray(species, new float[] {4.0f, 3.0f, 2.0f, 1.0f}, 0);
        FloatVector result = a.add(b);
        float[] array = new float[species.length()];
        result.intoArray(array, 0);
        for (float value : array) {
            System.out.println(value);
        }
    }
}
```

### 迁移建议

- **评估性能优势**：评估现有的并行计算代码，确定是否可以通过向量 API 获得性能提升。

- **逐步迁移**：开始时，可以选择性地使用向量 API 优化关键的计算核心，逐步扩展到其他部分。

- **更新文档和教程**：提供有关向量 API 的详细信息、最佳实践和使用指南，帮助开发者快速上手和利用这一特性。

### 结论

JEP 338 的向量 API 为 Java 开发者提供了一个强大的工具，用于高效地执行并行向量化计算。

通过高性能的并行处理、简化的编程模型和硬件优化，向量 API 有助于提高应用程序的性能和响应速度。

对于需要处理大规模数据集和优化计算密集型任务的 Java 应用程序，向量 API 将是一个非常有价值的新特性，有助于提高性能和扩展能力。

# 13. jdk16 C++14 语言特性支持（JEP 347）

JEP 347 引入了 JDK 16 中的一个重要增强，即对 C++14 语言特性的支持。这个增强旨在提高 JDK 中 JNI（Java Native Interface）的互操作性，允许开发者在 JNI 方法中使用更先进和现代的 C++ 特性，从而提供更加灵活和高效的编程体验。

### C++14 语言特性支持简介

C++14 是 C++ 标准的一个版本，它引入了一系列的新特性和改进，如泛型、类型推断、初始化列表、lambda 表达式等，这些特性可以帮助开发者编写更加简洁、可读和高效的 C++ 代码。

JEP 347 通过增强 JNI，使得 Java 应用程序能够更容易地与使用 C++14 特性编写的本地库进行交互，从而提高代码的互操作性和性能。

### C++14 语言特性支持的主要特性

1. **泛型编程**：支持模板和泛型编程，允许开发者编写更加通用和可复用的代码。

2. **类型推断**：引入 `auto` 关键字，使得类型推断更为灵活，减少冗余代码。

3. **初始化列表**：支持初始化列表，使得对象的初始化更为简洁和直观。

4. **Lambda 表达式**：支持 Lambda 表达式，提供了一种便捷的方式来编写内联的匿名函数。

### 使用示例

以下是一个简单的 JNI 示例，展示了如何在 JNI 方法中使用 C++14 的特性：

```cpp
#include <jni.h>
#include <vector>
#include <algorithm>

JNIEXPORT void JNICALL Java_com_example_MyClass_nativeMethod(JNIEnv *env, jobject obj) {
    // 使用 C++14 的特性
    std::vector<int> numbers = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
    std::sort(numbers.begin(), numbers.end());

    // Lambda 表达式
    std::for_each(numbers.begin(), numbers.end(), [](int number) {
        // 打印每个数字
        printf("%d\n", number);
    });
}
```

### 迁移建议

- **评估互操作性**：评估现有的 JNI 代码，确定是否可以从 C++14 的新特性中受益，并进行适当的更新。

- **更新文档和教程**：提供有关 C++14 支持的详细信息、最佳实践和使用指南，帮助开发者理解如何有效地利用这些新特性。

- **进行兼容性测试**：确保更新后的 JNI 代码在不同的平台和环境中都能正常工作，保持与旧版本的兼容性。

### 结论

JEP 347 的 C++14 语言特性支持为 Java 开发者提供了一个强大的工具，用于增强 JNI 的互操作性和性能。

通过支持现代 C++ 的特性，如泛型、类型推断、初始化列表和 Lambda 表达式等，开发者可以编写更加高效、简洁和可维护的 JNI 代码。

对于需要与使用 C++14 特性编写的本地库进行交互的 Java 应用程序，这一增强将提供更大的灵活性和优化机会，有助于提高代码的质量和性能。

# 14. jdk16 从 Mercurial 迁移到 Git（JEP 357）

JEP 357 引入了 JDK 16 中的一个重要增强，即从 Mercurial 迁移到 Git。这个变化标志着 JDK 项目从过去的版本控制系统 Mercurial 切换到了现代的、更广泛使用的 Git，以提高开发效率、社区参与度和工具生态系统的整合。

### 从 Mercurial 迁移到 Git 简介

Mercurial 是一个分布式版本控制系统，曾被广泛用于 JDK 的开发。然而，随着 Git 在开源社区和企业中的普及，JDK 项目决定迁移到 Git，以获得更好的工具支持、更广泛的社区参与和更高的开发效率。

### 迁移到 Git 的主要动机

1. **工具生态系统**：Git 拥有丰富的工具和插件支持，可以满足各种开发需求，提供更灵活和强大的版本控制功能。

2. **广泛的社区支持**：Git 已成为业界标准，拥有庞大的社区和丰富的资源，有助于吸引更多的开发者参与 JDK 项目。

3. **开发效率提升**：Git 提供了高效的分支和合并策略，支持并行开发和复杂项目管理，有助于提高开发速度和团队协作效率。

### 迁移过程和策略

- **代码库迁移**：JDK 的代码库已成功迁移到 Git，保留了完整的历史记录和版本信息。

- **工具和流程更新**：更新了与 Mercurial 相关的工具和流程，以适应 Git 的特性和工作流程。

- **社区参与**：积极鼓励社区成员参与迁移过程，提供必要的文档、教程和支持，以确保平稳过渡。

### 迁移建议

- **更新开发环境**：确保开发者的开发环境已经更新到支持 Git，包括 IDE、构建工具和其他相关工具。

- **学习 Git 基础**：为新的开发者提供 Git 的基础培训和资源，帮助他们快速上手和参与项目。

- **更新文档和指南**：提供有关 Git 的详细文档、教程和最佳实践，帮助开发者了解和遵循新的工作流程和规范。

### 结论

JEP 357 的从 Mercurial 迁移到 Git 为 JDK 项目带来了一个重要的变革，标志着项目的现代化和开放化。

通过采用 Git，JDK 项目能够更好地利用现代的工具和资源，提高开发效率、社区参与度和项目质量。

这一变化不仅有助于 JDK 项目本身的发展，还将对整个 Java 生态系统产生积极的影响，促进其持续的创新和增长。

# 15. jdk16 迁移到 GitHub（JEP 369）

JEP 369 引入了 JDK 16 中的一个重要增强，即迁移到 GitHub。这个变化意味着 JDK 项目从自己的 Mercurial 仓库转移到了全球最大的代码托管平台 GitHub，这是一个显著的改变，将进一步促进 Java 社区的参与、贡献和创新。

### 迁移到 GitHub 简介

GitHub 是一个基于 Git 的代码托管平台，拥有庞大的开发者社区、丰富的工具集和强大的协作功能。通过将 JDK 项目迁移到 GitHub，JDK 项目将能够充分利用 GitHub 的优势，包括更高的可见性、更广泛的社区参与和更强的协作能力。

### 迁移到 GitHub 的主要动机

1. **社区参与**：GitHub 拥有庞大的开发者社区，有助于吸引更多的开发者参与 JDK 项目，提高社区活跃度和项目质量。

2. **协作和贡献**：GitHub 提供了强大的协作和贡献工具，如 Pull Request、Issue 跟踪和代码审查，有助于简化开发流程，提高代码质量和合作效率。

3. **可视性和传播**：作为全球最大的代码托管平台，GitHub 为 JDK 项目提供了更高的可见性和影响力，有助于提升 Java 生态系统的知名度和普及度。

### 迁移过程和策略

- **代码仓库迁移**：JDK 项目的代码仓库已成功迁移到 GitHub，并保留了完整的历史记录和版本信息。

- **流程和工具更新**：更新了开发流程和工具，以适应 GitHub 的特性和工作流程，包括 CI/CD、自动化测试和代码审查等。

- **社区建设**：积极建设和培养 GitHub 社区，提供必要的文档、教程和支持，鼓励更多的开发者参与贡献和反馈。

### 迁移建议

- **设置和配置**：为 JDK 项目设置和配置 GitHub 仓库，包括分支管理、权限设置和 CI/CD 集成等。

- **培训和教育**：提供 GitHub 使用的培训和教育资源，帮助开发者快速上手并熟悉 GitHub 的使用和最佳实践。

- **文档和指南更新**：更新相关文档和指南，提供有关 GitHub 工作流程、贡献指南和项目规范的详细信息，帮助开发者了解和遵循新的开发流程。

### 结论

JEP 369 的迁移到 GitHub 标志着 JDK 项目的一个重大转变，将为 Java 社区带来更广泛的参与、更高的协作效率和更好的项目质量。

通过利用 GitHub 的强大功能和广泛的社区资源，JDK 项目将能够更好地满足开发者的需求，促进 Java 技术的创新和发展。

这一变化不仅将加强 JDK 项目本身，还将推动整个 Java 生态系统的繁荣和进步。

# 16. jdk16 外部存储器访问 API（JEP 1339）

JEP 1339 引入了 JDK 16 中的一个重要增强，即外部存储器访问 API。这个新特性为 Java 应用程序提供了一种标准化、高效的方式，用于访问外部存储设备，如 SSD、HDD 或云存储等，从而实现数据的快速读写和管理。

### 外部存储器访问 API 简介

外部存储器访问 API 旨在简化和标准化 Java 应用程序与外部存储设备之间的交互，提供了一组统一的 API，用于处理文件、目录和数据流，支持异步 I/O 操作和高性能数据传输。

### 外部存储器访问 API 的主要特性

1. **统一的 API**：外部存储器访问 API 提供了一个统一的接口，用于访问不同类型的外部存储设备，使得开发者可以更容易地编写跨平台的存储操作代码。

2. **高性能 I/O**：支持异步 I/O 操作和零拷贝数据传输，利用现代存储设备的性能优势，实现高效的数据读写。

3. **安全和可靠**：提供了丰富的安全特性和错误处理机制，确保数据的完整性和可靠性，防止数据丢失和损坏。

4. **云存储集成**：支持与各种云存储服务的集成，如 Amazon S3、Google Cloud Storage 和 Azure Blob Storage 等，方便开发者直接访问和管理云上的数据。

### 使用示例

以下是一个简单的外部存储器访问 API 使用示例，展示了如何异步读取文件内容：

```java
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousFileChannel;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.concurrent.Future;

public class ExternalStorageExample {
    public static void main(String[] args) throws Exception {
        Path path = Path.of("example.txt");
        AsynchronousFileChannel channel = AsynchronousFileChannel.open(path, StandardOpenOption.READ);

        ByteBuffer buffer = ByteBuffer.allocate(1024);
        Future<Integer> readResult = channel.read(buffer, 0);

        while (!readResult.isDone()) {
            // 等待读取完成
        }

        buffer.flip();
        byte[] data = new byte[buffer.remaining()];
        buffer.get(data);

        System.out.println(new String(data));
        channel.close();
    }
}
```

### 迁移建议

- **评估现有代码**：评估现有的文件和存储操作代码，确定是否可以从外部存储器访问 API 获得性能和功能上的优势。

- **更新文档和教程**：提供有关外部存储器访问 API 的详细文档、教程和最佳实践，帮助开发者快速上手和利用这一特性。

- **进行性能测试**：进行性能测试，比较外部存储器访问 API 和传统 I/O API 在读写操作上的性能差异，以确保性能的提升。

### 结论

JEP 1339 的外部存储器访问 API 为 Java 开发者提供了一个强大的工具，用于简化和优化与外部存储设备的交互。

通过提供统一的 API、高性能的 I/O 操作和丰富的安全特性，外部存储器访问 API 有助于提高数据处理效率、简化存储管理和提升应用程序的可靠性。

对于需要处理大量数据或与外部存储设备进行高效交互的 Java 应用程序，这一特性将是一个非常有价值的新功能，有助于提升应用程序的性能和可扩展性。

# 17. jdk16 启用 C++14 语言特性（JEP 12397）

JEP 12397 引入了 JDK 16 中的一个重要增强，即启用 C++14 语言特性。这个变化允许 JDK 使用 C++14 中引入的新特性，以提供更加现代化、高效和可维护的 C++ 代码，尤其是在与 JNI（Java Native Interface）相关的本地代码开发中。

### 启用 C++14 语言特性简介

C++14 是 C++ 标准的一个版本，它引入了一系列的新特性和改进，如泛型、类型推断、初始化列表、lambda 表达式等。通过启用 C++14 语言特性，JDK 使得 JNI 本地代码可以更加简洁、高效和现代化，从而提高代码质量和开发效率。

### 启用 C++14 语言特性的主要优势

1. **代码简洁性**：C++14 的新特性如泛型和类型推断可以减少冗余代码，使得 JNI 本地代码更加简洁和可读。

2. **类型安全性**：类型推断和强类型枚举等特性有助于提高代码的类型安全性，减少潜在的编程错误。

3. **高级特性支持**：支持 lambda 表达式、变长模板和 constexpr 等高级特性，使得 JNI 本地代码更加灵活和强大。

4. **性能优化**：新的编译优化和代码生成技术可以提高执行效率，特别是在涉及模板和泛型的代码中。

### 使用示例

以下是一个简单的 JNI 示例，展示了如何使用 C++14 特性，如 lambda 表达式和 auto 类型推断：

```cpp
#include <jni.h>
#include <iostream>

JNIEXPORT void JNICALL Java_com_example_MyClass_nativeMethod(JNIEnv *env, jobject obj) {
    // 使用 lambda 表达式
    auto printMessage = [](const char* message) {
        std::cout << message << std::endl;
    };

    printMessage("Hello from native code using C++14!");
}
```

### 迁移建议

- **代码评估**：评估现有 JNI 本地代码，确定是否可以利用 C++14 的新特性进行优化和简化。

- **编译器和工具更新**：确保使用支持 C++14 的编译器和开发工具，如 GCC 5.1+、Clang 3.4+ 或 Visual Studio 2015+。

- **更新文档和教程**：提供有关 C++14 支持的详细信息、最佳实践和使用指南，帮助开发者了解如何有效地利用这些新特性。

### 结论

JEP 12397 的启用 C++14 语言特性为 JDK 的 JNI 本地代码开发带来了一个重要的改进。

通过支持现代的 C++ 特性，如泛型、类型推断和 lambda 表达式等，开发者可以编写更加简洁、高效和可维护的本地代码，从而提高整体的代码质量和开发效率。

这一变化不仅有助于优化 JNI 本地代码，还将推动 Java 和 C++ 之间的互操作性和集成，加强两种语言在复杂应用开发中的协作和整合。

# 总计 jdk16 的变化

JDK 16 在多个方面都有所改进和增强，以下是 JDK 16 的主要变化和新特性的总结：

1. **启用 C++14 语言特性（JEP 12397）**
   - 支持 C++14 中的新特性，如泛型、类型推断、初始化列表和 lambda 表达式等，以提高 JNI 本地代码的编写效率和质量。

2. **外部存储器访问 API（JEP 1339）**
   - 引入一个标准化、高效的 API，用于访问外部存储设备，如 SSD、HDD 或云存储等，支持异步 I/O 操作和高性能数据传输。

3. **启用 C++14 语言特性（JEP 12397）**
   - 允许 JDK 使用 C++14 中引入的新特性，以提供更加现代化、高效和可维护的 C++ 代码，尤其是在与 JNI 相关的本地代码开发中。

4. **迁移到 GitHub（JEP 369）**
   - 将 JDK 项目从 Mercurial 迁移到 GitHub，以提高开发效率、社区参与度和工具生态系统的整合。

5. **启用 C++14 语言特性（JEP 12397）**
   - 支持 C++14 中的新特性，如泛型、类型推断、初始化列表和 lambda 表达式等，以提高 JNI 本地代码的编写效率和质量。

6. **外部存储器访问 API（JEP 1339）**
   - 引入一个标准化、高效的 API，用于访问外部存储设备，如 SSD、HDD 或云存储等，支持异步 I/O 操作和高性能数据传输。

这些变化涉及了多个领域，包括本地代码开发、存储访问、开发工具和项目管理等，共同为 JDK 16 带来了更加现代化、高效和灵活的开发环境和特性。

这些改进不仅有助于提高 JDK 自身的性能和功能，还有助于推动整个 Java 生态系统的进步和发展。

* any list
{:toc}