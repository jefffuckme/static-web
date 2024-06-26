---
layout: post
title: 监控-skywalking-02-深入学习 skywalking 的实现原理的一些问题
date:  2019-4-1 19:24:57 +0800
categories: [APM]
tags: [monitor, apm, sf]
published: true
---


# Q1: SkyWalking 的架构是什么样的？有哪些核心组件和模块？

SkyWalking 的架构是一个分布式系统性能监控和调用链追踪的解决方案，它由多个核心组件和模块组成。

以下是 SkyWalking 的主要架构和核心组件：

1. Collector（数据收集器）：Collector 是 SkyWalking 的数据收集组件，负责接收来自各个应用程序的跟踪数据和性能指标。它可以通过接收器（Receiver）从不同的数据源接收数据，并将数据传递给后端存储（Storage）和查询（Query）组件。

2. Storage（数据存储）：Storage 组件负责将收集到的跟踪数据和性能指标持久化到存储后端，如 Elasticsearch、MySQL、TiDB 等。存储后端负责存储和索引数据，以便后续查询和分析。

3. Query（数据查询）：Query 组件负责处理来自用户界面或 API 的查询请求，并从存储后端检索和提取数据。它将查询结果返回给用户界面，用于展示和分析性能数据。

4. Web UI（用户界面）：Web UI 提供了直观的可视化界面，用于展示监控数据、调用链追踪和性能指标图表。用户可以通过 Web UI 来查看应用程序的性能状况，并进行故障排查和性能优化。

5. Java Agent：Java Agent 是 SkyWalking 的核心组件之一，用于在 Java 应用程序中进行字节码操作和数据收集。它会在应用程序启动时加载，并通过字节码增强来收集跟踪信息，然后将数据发送到 Collector 进行处理。

6. Proxy（代理）：Proxy 是 SkyWalking 的另一个核心组件，用于支持非 Java 语言的应用程序。它是一个类似于 Java Agent 的代理，用于在其他编程语言中实现跟踪数据的收集和传输。

7. Plugins（插件）：SkyWalking 提供了丰富的插件，用于扩展其功能。插件可以支持不同的存储后端、特定的中间件、集成告警系统等，从而满足特定应用场景的需求。

SkyWalking 的架构设计使其具有高度可扩展性和灵活性，可以适用于不同规模和复杂度的分布式应用程序。

通过这些核心组件的协作，SkyWalking 可以实现全栈性能监控和调用链追踪，帮助用户快速发现和解决性能问题，优化系统的可靠性和性能表现。

# Q2: SkyWalking 如何在 Java 应用程序中通过 Java Agent 进行字节码操作和数据收集？

SkyWalking 在 Java 应用程序中通过 Java Agent 进行字节码操作和数据收集的过程如下：

1. Java Agent 加载：Java Agent 是一个特殊的 Java 程序，它在应用程序启动时作为代理加载到 Java 虚拟机（JVM）中。Java Agent 需要在 MANIFEST.MF 文件中声明 premain 方法，这个方法会在 JVM 启动时被调用。

2. 字节码增强：一旦 Java Agent 被加载到 JVM 中，它就会开始对目标应用程序进行字节码增强（Bytecode Enhancement）。字节码增强是指对目标类的字节码进行修改，以注入额外的代码，用于收集性能数据和跟踪信息。

3. 字节码收集：在字节码增强的过程中，Java Agent 会将收集跟踪数据的代码插入到目标类的方法中，这些代码会在方法的入口和出口处执行，并收集方法的执行时间、参数、返回值等信息。

4. 数据传输：收集到的跟踪数据会被 Java Agent 打包，并发送到 SkyWalking Collector 或其他数据接收端。这样，跟踪数据就能够被集中存储和分析。

5. 调用链追踪：通过在应用程序的不同组件中插入跟踪代码，Java Agent 能够捕获请求在分布式系统中的传递路径，形成完整的调用链。这样，开发人员就能够了解请求的调用关系和执行过程。

需要注意的是，Java Agent 在字节码增强过程中必须非常小心，以确保对目标应用程序的影响最小。如果字节码增强有误，可能会导致应用程序出现异常或不稳定。

总的来说，Java Agent 是 SkyWalking 实现调用链追踪和性能监控的关键组件。它通过在目标应用程序中进行字节码操作和数据收集，实现了对分布式系统的性能监控和调用链追踪功能。这使得开发人员能够更好地了解系统的性能状况，并及时发现和解决潜在的问题。

# Q3: SkyWalking 是如何支持其他编程语言的？对于不同语言的代理实现有什么区别？

SkyWalking 支持其他编程语言主要通过代理（Proxy）实现。代理是类似于 Java Agent 的组件，用于在不同编程语言的应用程序中进行数据收集和传输，以实现跟踪和性能监控功能。

对于不同语言的代理实现，有一些区别和适配措施：

1. 代理加载方式：与 Java Agent 类似，代理需要在目标应用程序启动时被加载到相应的运行时环境中。不同编程语言的运行时环境可能有不同的加载机制，代理需要适配不同的加载方式。

2. 代理代码注入：对于每种编程语言，代理需要能够在目标应用程序中进行代码注入，以实现数据收集功能。不同编程语言的代码注入机制也有所不同，代理需要根据具体情况进行适配。

3. 数据收集和传输：不同编程语言的代理需要将收集到的数据进行打包和传输。对于支持 HTTP 或 gRPC 等通信协议的语言，可以直接通过网络传输数据。而对于一些不支持这些协议的语言，可能需要通过其他机制来传输数据。

4. 数据格式：数据格式在不同编程语言的代理之间也可能有所不同。数据格式的统一性是确保数据在不同语言之间正确传递和解析的关键。

5. 环境依赖：不同编程语言的运行时环境和标准库可能有所不同，代理需要根据具体环境来处理依赖和兼容性问题。

总的来说，SkyWalking 通过实现不同编程语言的代理，实现了对多语言的支持。

代理作为中间层，将收集到的数据统一传输给 SkyWalking Collector 或其他数据接收端，从而实现对分布式系统的全栈性能监控和调用链追踪。

不同编程语言的代理在实现细节上可能有所不同，但它们都**遵循了相同的原则，确保数据的准确传递和跨语言的一致性**。

# Q4: 如何在 SkyWalking 中实现跨进程的调用链追踪？

在 SkyWalking 中实现跨进程的调用链追踪是通过以下步骤来实现的：

1. 生成 Trace ID 和 Span ID：当一个请求进入系统时，首先在根节点生成一个全局唯一的 Trace ID，用于标识整个调用链。同时，在根节点生成一个 Span ID，用于标识当前节点的操作。

2. 上下文传递：在分布式系统中，请求可能会跨越多个进程和服务。为了将请求在各个服务之间关联起来，需要将 Trace ID 和 Span ID 通过上下文传递。一般来说，这些信息会以请求头的形式传递，或者通过上下文变量在请求的不同环节中传递。

3. 链路关联：当请求进入下一个进程或服务时，它会携带前一个进程的 Trace ID 和 Span ID。下一个进程会将这些信息解析出来，并继续生成新的 Span ID，用于标识当前节点的操作。这样，就建立了整个调用链的关联关系。

4. 数据收集和传输：在每个进程中，SkyWalking 的代理会在应用程序的关键节点（例如请求的入口和出口、RPC 调用、数据库查询等）插入跟踪代码，用于收集性能数据和调用关系。收集到的数据会通过数据传输机制发送到 SkyWalking Collector 或其他数据接收端。

5. 调用链构建：SkyWalking Collector 接收到各个进程传递过来的跟踪数据后，将根据 Trace ID 进行关联，构建起完整的调用链。这个调用链将显示请求在分布式系统中的执行路径和调用关系。

6. 可视化展示：构建好的调用链会在 SkyWalking 的可视化界面中以树形结构或图形方式展示出来。这样，开发人员和运维团队可以通过界面清晰地了解请求的传递路径和调用关系，从而进行性能优化和故障排查。

总的来说，跨进程的调用链追踪是通过在请求中传递 Trace ID 和 Span ID，以及在每个进程中收集和传输跟踪数据来实现的。

这使得 SkyWalking 能够在分布式系统中实现全栈性能监控和调用链追踪，帮助开发人员和运维团队更好地了解和管理复杂的分布式系统。

# Q5: SkyWalking 的数据采集和传输机制是怎样的？如何保证数据的完整性和准确性？

SkyWalking 的数据采集和传输机制主要涉及数据收集、数据传输和数据存储三个关键步骤。

为了保证数据的完整性和准确性，SkyWalking 采取了以下措施：

1. 数据收集：在每个应用程序的关键节点（如请求入口和出口、RPC 调用、数据库查询等）上，SkyWalking 的代理会插入跟踪代码，用于收集性能数据和调用关系。这些收集到的数据包括 Trace ID、Span ID、请求时间、参数、返回值等信息。

2. 数据传输：收集到的跟踪数据会被 SkyWalking 的代理打包，然后通过数据传输机制发送到 SkyWalking Collector 或其他数据接收端。SkyWalking 支持多种数据传输方式，包括 HTTP、gRPC 等。传输的过程中，数据会经过加密和压缩，以确保数据的安全性和传输效率。

3. 数据存储：一旦跟踪数据被传输到 SkyWalking Collector 或其他数据接收端，它们会被存储到后端存储，如 Elasticsearch、MySQL、TiDB 等。存储后端负责将数据持久化，并根据数据的索引和查询需求进行相应的处理。

为了保证数据的完整性和准确性，SkyWalking 采取了以下措施：

1. 唯一标识符：在数据收集的过程中，SkyWalking 使用全局唯一的 Trace ID 和 Span ID 来标识每个请求和操作。这些标识符在整个调用链中保持唯一，确保请求的调用关系和传递路径能够正确关联。

2. 上下文传递：为了在分布式系统中关联跨进程的调用链，SkyWalking 通过上下文传递机制将 Trace ID 和 Span ID 在不同进程之间传递。这样，不同进程收集到的数据都能正确关联到同一个调用链上。

3. 异常处理：在数据传输过程中，SkyWalking 会对数据进行加密和压缩，以防止数据被篡改或损坏。同时，传输过程中的异常情况会被捕获和处理，确保数据能够正确传输到后端存储。

4. 完善的数据校验：在数据收集和传输的过程中，SkyWalking 会进行严格的数据校验，确保数据的格式和内容符合预期。对于不合法的数据，会进行相应的处理和丢弃，以确保存储的数据是有效的和准确的。

总的来说，SkyWalking 的数据采集和传输机制通过使用唯一标识符和上下文传递等手段，保证了跨进程的调用链数据的完整性和准确性。

这使得 SkyWalking 能够提供可靠的全栈性能监控和调用链追踪功能，帮助开发人员和运维团队更好地了解和管理分布式系统。

# Q6: SkyWalking 的存储后端是如何工作的？支持哪些存储方案？

SkyWalking 的存储后端负责将收集到的跟踪数据和性能指标持久化存储，以便后续查询和分析。SkyWalking 支持多种存储方案，可以根据用户的需求选择合适的存储后端。目前，SkyWalking 支持以下存储方案：

1. Elasticsearch：Elasticsearch 是 SkyWalking 最常用的存储后端之一。它是一个开源的分布式搜索和分析引擎，具有良好的可扩展性和性能，适用于大规模的数据存储和查询。

2. MySQL：SkyWalking 也支持使用关系型数据库 MySQL 作为存储后端。对于规模较小的应用或资源有限的环境，MySQL 可以是一个简单且有效的选择。

3. TiDB：TiDB 是一个开源的分布式 SQL 数据库，它具有类似 MySQL 的接口和语法，但具有分布式数据库的特性。TiDB 可以作为 SkyWalking 的存储后端，支持大规模的数据存储和查询。

4. H2：H2 是一个内存数据库，SkyWalking 也可以将数据存储在内存中，适用于一些小规模或临时使用的场景。

5. 其他：除了上述常见的存储方案，SkyWalking 还支持其他一些存储后端，比如 ClickHouse、Cassandra 等。这些存储方案可以根据特定的需求和场景选择使用。

存储后端的选择取决于应用的规模、性能需求、资源预算等因素。Elasticsearch 通常被认为是最常用和推荐的存储后端，因为它对于分布式数据存储和实时查询具有良好的支持。

然而，如果应用规模较小或对性能要求不高，也可以考虑使用其他存储方案。

用户可以根据实际情况选择合适的存储后端，以满足自己的性能监控和调用链追踪需求。

# Q7: 如何实现 SkyWalking 的可视化界面和报警功能？

SkyWalking 的可视化界面和报警功能是通过 Web UI 和告警模块来实现的。下面分别介绍这两个方面的实现：

1. 可视化界面（Web UI）：
   - Web UI 是 SkyWalking 的用户界面，提供直观的可视化展示功能，用于展示监控数据、调用链追踪和性能指标图表。
   - Web UI 使用前端技术实现，通常采用 HTML、CSS 和 JavaScript 等开发。它通过与后端服务进行交互，从存储后端或 SkyWalking Collector 获取监控数据和性能指标，并将这些数据以图表和可视化图形的形式展示出来。
   - Web UI 提供了多种视图和面板，用于展示不同类型的数据，包括调用链追踪、性能指标、拓扑图、依赖关系图等。用户可以通过 Web UI 来查看应用程序的性能状况，并进行故障排查和性能优化。
   - Web UI 的开发和维护由 SkyWalking 社区贡献者进行，用户可以通过浏览器访问 SkyWalking 的 Web UI 来使用其功能。

2. 报警功能：
   - 报警功能是 SkyWalking 的一个重要特性，它允许用户根据指标的阈值设置报警规则，并在指标达到或超过阈值时触发报警。
   - 报警功能通常与可视化界面和存储后端相结合。用户可以在 Web UI 中配置报警规则，指定监控指标和阈值，并选择报警的方式（如邮件、短信等）。
   - 当监控指标达到或超过设定的阈值时，报警模块会触发报警，并向指定的接收者发送通知。这样，用户可以及时发现和处理系统中的异常情况，确保系统的稳定性和性能。

总的来说，SkyWalking 的可视化界面和报警功能是通过 Web UI 和报警模块来实现的。Web UI 提供了直观的可视化展示功能，用于展示监控数据和调用链追踪。

报警功能允许用户根据阈值设置报警规则，及时发现系统中的异常情况，并采取相应的措施。

这些功能使得 SkyWalking 成为一个强大的分布式系统性能监控和调用链追踪工具，帮助用户更好地了解和管理复杂的分布式系统。

# Q8: SkyWalking 如何处理大规模和复杂的分布式系统？其可扩展性和性能如何？

SkyWalking 在处理大规模和复杂的分布式系统方面具有良好的可扩展性和性能，主要体现在以下几个方面：

1. 分布式架构：SkyWalking 的架构设计采用了分布式架构，允许将组件部署在多个节点上，从而实现数据的水平扩展和负载均衡。通过将收集器（Collector）和存储后端进行横向扩展，SkyWalking 能够处理大量的监控数据和跨越多个应用程序的调用链信息。

2. 数据压缩和缓存：SkyWalking 在数据传输和存储过程中采用了数据压缩和缓存机制，减少了数据传输和存储的压力。这样，即使面对大规模数据的情况，SkyWalking 也能保持较高的性能和响应速度。

3. 异步处理：SkyWalking 在数据收集和传输过程中采用了异步处理，这意味着数据收集和传输过程不会阻塞主线程。这样可以降低对应用程序性能的影响，同时提高了数据的处理效率。

4. 可扩展插件机制：SkyWalking 提供了丰富的插件机制，允许用户根据自己的需求和场景定制功能。通过插件机制，用户可以根据特定的业务场景，选择合适的数据存储后端、中间件、告警系统等，从而实现定制化的功能和性能优化。

5. 高性能数据存储后端：SkyWalking 支持多种数据存储后端，如 Elasticsearch、MySQL、TiDB 等。这些存储后端都具有良好的可扩展性和性能，能够适应大规模数据存储和查询的需求。

总体而言，SkyWalking 在设计和实现上考虑到了大规模和复杂分布式系统的需求，具有良好的可扩展性和性能。

通过分布式架构、数据压缩、异步处理和插件机制的应用，它可以处理大量的监控数据和复杂的调用链信息，并提供高性能和快速响应的性能监控和调用链追踪功能。

这使得 SkyWalking 成为一个强大的分布式系统监控和性能优化工具，能够有效地支持大规模和复杂的分布式应用程序。

# Q9: SkyWalking 的插件机制是如何实现的？如何利用插件扩展功能？

SkyWalking 的插件机制是通过扩展点和扩展加载器实现的。SkyWalking 将一些关键的组件设计为扩展点，允许用户编写自定义的插件，并通过扩展加载器加载和管理这些插件。通过这种机制，用户可以灵活地扩展 SkyWalking 的功能，满足特定的需求和场景。

插件机制的实现步骤如下：

1. 定义扩展点：在 SkyWalking 的代码中，确定哪些组件应该是可扩展的，将其定义为扩展点。这些扩展点是一些接口或抽象类，定义了一些接口方法或抽象方法，供用户在插件中实现。

2. 编写插件：用户编写自定义的插件，并实现扩展点中定义的接口方法或抽象方法。插件的实现逻辑可以根据用户的需求来定制，可以实现特定的数据存储后端、中间件支持、告警系统等功能。

3. 扩展加载器：SkyWalking 提供了扩展加载器，用于加载和管理插件。扩展加载器会扫描 classpath 下的扩展点实现类，加载这些实现类，并将它们注册到相应的扩展点中。

4. 配置和加载插件：用户可以在 SkyWalking 的配置文件中指定需要加载的插件。扩展加载器会根据配置文件中的信息加载对应的插件，并将其注册到相应的扩展点中。

通过以上步骤，用户可以实现对 SkyWalking 的扩展，增加新的功能或修改现有功能的行为。例如，用户可以实现自定义的数据存储后端插件，将监控数据存储到其他类型的数据库；或者实现自定义的告警插件，根据特定的监控指标触发告警行为。

SkyWalking 社区提供了一些官方插件，同时也鼓励用户开发和贡献自己的插件。

这种插件机制使得 SkyWalking 可以适应不同的使用场景和需求，为用户提供高度定制化的功能，扩展其应用范围和灵活性。

# Q10: SkyWalking 的最新发展和未来规划是什么？有哪些开发社区和贡献方式？

截至我在2021年9月的最后更新，我无法提供SkyWalking在该日期之后的最新发展和未来规划。然而，在那个时候，SkyWalking是由一个充满活力的开源社区积极开发和维护的，并有未来改进和功能的路线图。

获取SkyWalking的最新发展和未来规划的最佳方法是访问其官方网站或GitHub存储库，项目的维护者和社区成员经常发布更新、发布说明以及有关未来规划的信息。Apache SkyWalking的官方网站是：https://skywalking.apache.org/

关于开发社区和贡献方式，SkyWalking是Apache软件基金会的项目，遵循Apache Way的原则。该项目的开发是开放的，任何有兴趣的人都可以参与贡献。以下是参与和为SkyWalking项目贡献的一些方式：

1. **加入邮件列表和社区讨论：** SkyWalking社区使用邮件列表和其他通讯渠道进行讨论、提问和发布公告。加入邮件列表，您可以参与社区讨论，并从经验丰富的成员那里获得帮助。

2. **报告漏洞和问题：** 如果您在使用SkyWalking时遇到任何漏洞或问题，您可以在GitHub的项目问题跟踪器上报告它们。这有助于开发团队识别和解决软件中的问题。

3. **贡献代码：** 如果您是开发人员，您可以通过提交代码更改和增强来为SkyWalking做出贡献。您可以fork项目，在您的分支上进行更改，然后提交拉取请求以供审查和合并到主存储库中。

4. **文档和翻译：** 改进文档或将项目翻译成不同语言的贡献都受到欢迎。清晰和最新的文档对于项目的成功至关重要。

5. **测试和漏洞验证：** 测试新功能和验证已报告的漏洞是对项目稳定性和可靠性的宝贵贡献。

6. **宣传和推广：** 您可以通过撰写博客文章、演讲或与社区分享您的经验来帮助推广SkyWalking。

在做出重大贡献之前，最好阅读项目的贡献准则和行为准则，这些通常可以在存储库的文档或社区资源中找到。

请记住，开源项目依赖于社区贡献，即使是小的贡献也能产生有意义的影响。

参与像SkyWalking这样的项目不仅有助于改进软件，还会丰富您自己的知识和开发技能。

# Q11: 如果让你设计一款 APM 监视组件，你要如何设计？为什么

设计一款 APM（Application Performance Monitoring）监视组件需要考虑多个方面，包括数据收集、数据处理、数据存储、可视化展示和报警功能等。

以下是我设计这样一款组件的主要考虑因素：

1. **数据收集：** 收集应用程序的性能数据和调用链信息是APM组件的核心功能。可以通过Java Agent、代码注入或者其他方式，在关键节点插入收集代码。收集的数据包括请求的耗时、异常信息、数据库查询、RPC调用等。

2. **数据处理：** 收集到的海量数据需要进行有效的处理和筛选，以提取有用的信息。可以使用采样策略，仅对部分请求进行详细记录，以降低数据量，同时保持对性能问题的敏感度。

3. **数据存储：** 设计一个高效可扩展的数据存储后端是关键。支持多种数据存储方案，如Elasticsearch、Cassandra、ClickHouse等，使用户可以根据规模和需求选择合适的存储方案。

4. **可视化展示：** 提供直观的可视化界面，通过图表、拓扑图、调用链图等形式展示性能指标和调用关系。用户可以从可视化界面中迅速了解系统的运行状况和性能瓶颈。

5. **报警功能：** 支持灵活的报警规则配置，当性能指标达到或超过阈值时触发报警，以便及时发现和处理异常情况。

6. **多语言支持：** 支持多种编程语言，例如Java、Python、Go、Node.js等，使得APM组件能够适用于各种语言的应用程序。

7. **分布式追踪：** 支持跨进程、跨服务的调用链追踪，能够在分布式系统中准确展示请求的执行路径和调用关系。

8. **低侵入性：** 设计组件时要尽量降低对应用程序性能的影响。在数据收集和处理过程中，采取异步和非阻塞方式，避免对业务代码产生负面影响。

9. **高可用和容错性：** 确保组件在高负载和故障情况下依然可靠运行。采用集群部署和负载均衡策略，以确保高可用性。

10. **可扩展性：** 考虑到监视组件可能需要处理海量的监控数据，设计组件时要考虑其可扩展性，支持水平扩展和动态扩容。

总的来说，设计一款优秀的APM监视组件需要综合考虑数据收集、处理、存储、展示和报警等多个方面。

合理的架构设计、高效的数据存储和处理能力，以及直观易用的可视化界面和报警功能，是一个优秀的APM监视组件的重要特点。

同时，要考虑到系统的可扩展性、容错性和低侵入性，以确保组件能够在实际生产环境中发挥有效的监控和优化作用。

# 参考资料

chat

* any list
{:toc}