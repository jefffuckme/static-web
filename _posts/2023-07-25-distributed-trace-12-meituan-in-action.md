---
layout: post
title: 分布式链路追踪-12-美团 可视化全链路日志追踪
date:  2023-07-25 +0800
categories: [Trace]
tags: [trace, distributed, sh]
published: true
---

# 拓展阅读

[全链路压测自动化实践](https://tech.meituan.com/2019/02/14/full-link-pressure-test-automation.html)

# 1. 背景

## 1.1 业务系统日益复杂

随着互联网产品的快速发展，不断变化的商业环境和用户诉求带来了纷繁复杂的业务需求。业务系统需要支撑的业务场景越来越广、涵盖的业务逻辑越来越多，系统的复杂度也跟着快速提升。

与此同时，由于微服务架构的演进，业务逻辑的实现往往需要依赖多个服务间的共同协作。

总而言之，业务系统的日益复杂已经成为一种常态。

## 1.2 业务追踪面临挑战

业务系统往往面临着多样的日常客诉和突发问题，“业务追踪”就成为了关键的应对手段。

业务追踪可以看做一次业务执行的现场还原过程，通过执行中的各种记录还原出原始现场，可用于业务逻辑执行情况的分析和问题的定位，是整个系统建设中重要的一环。

目前在分布式场景下，业务追踪的主流实现方式包括两类，一类是基于日志的ELK方案，一类是基于单次请求调用的会话跟踪方案。

然而随着业务逻辑的日益复杂，上述方案越来越不适用于当下的业务系统。

### 1.2.1 传统的 ELK 方案

日志作为业务系统的必备能力，职责就是记录程序运行期间发生的离散事件，并且在事后阶段用于程序的行为分析，比如曾经调用过什么方法、操作过哪些数据等等。

在分布式系统中，ELK技术栈已经成为日志收集和分析的通用解决方案。

如下图1所示，伴随着业务逻辑的执行，业务日志会被打印，统一收集并存储至Elasticsearch（下称ES）[2]。

![传统的 ELK 方案](https://p0.meituan.net/travelcube/d3538d3d5d1cbf7bdc1b5c99020e3df8150979.jpg)

传统的ELK方案需要开发者在编写代码时尽可能全地打印日志，再通过关键字段从ES中搜集筛选出与业务逻辑相关的日志数据，进而拼凑出业务执行的现场信息。

然而该方案存在如下的痛点：

日志搜集繁琐：虽然ES提供了日志检索的能力，但是日志数据往往是缺乏结构性的文本段，很难快速完整地搜集到全部相关的日志。 

日志筛选困难：不同业务场景、业务逻辑之间存在重叠，重叠逻辑打印的业务日志可能相互干扰，难以从中筛选出正确的关联日志。 

日志分析耗时：搜集到的日志只是一条条离散的数据，只能阅读代码，再结合逻辑，由人工对日志进行串联分析，尽可能地还原出现场。

综上所述，随着业务逻辑和系统复杂度的攀升，传统的ELK方案在日志搜集、日志筛选和日志分析方面愈加的耗时耗力，很难快速实现对业务的追踪。

### 1.2.2 分布式会话跟踪方案

在分布式系统，尤其是微服务系统中，业务场景的某次请求往往需要经过多个服务、多个中间件、多台机器的复杂链路处理才能完成。

为了解决复杂链路排查困难的问题，“分布式会话跟踪方案”诞生。该方案的理论知识由Google在2010年《Dapper》论文[3]中发表，随后Twitter开发出了一个开源版本Zipkin[4]。

市面上的同类型框架几乎都是以Google Dapper论文为基础进行实现，整体大同小异，都是通过一个分布式全局唯一的id（即traceId），将分布在各个服务节点上的同一次请求串联起来，还原调用关系、追踪系统问题、分析调用数据、统计系统指标。

分布式会话跟踪，是一种会话级别的追踪能力，如下图2所示，单个分布式请求被还原成一条调用链路，从客户端发起请求抵达系统的边界开始，记录请求流经的每一个服务，直到向客户端返回响应为止。

![图2 一次典型的请求全过程（摘自《Dapper》）](https://p0.meituan.net/travelcube/558166461a0c0213105588ceab13dd3e94339.jpg)

分布式会话跟踪的主要作用是分析分布式系统的调用行为，并不能很好地应用于业务逻辑的追踪。

下图3是一个审核业务场景的追踪案例，业务系统对外提供审核能力，待审对象的审核需要经过“初审”和“复审”两个环节（两个环节关联相同的taskId），因此整个审核环节的执行调用了两次审核接口。

如图左侧所示，完整的审核场景涉及众多“业务逻辑”的执行，而分布式会话跟踪只是根据两次RPC调用生成了右侧的两条调用链路，并没有办法准确地描述审核场景业务逻辑的执行，问题主要体现在以下几个方面：

![flow](https://p0.meituan.net/travelcube/8da3f1e203894e78788d6ca25055b70a348329.jpg)

(1) 无法同时追踪多条调用链路

分布式会话跟踪仅支持单个请求的调用追踪，当业务场景包含了多个调用时，将生成多条调用链路；由于调用链路通过traceId串联，不同链路之间相互独立，因此给完整的业务追踪增加了难度。

例如当排查审核场景的业务问题时，由于初审和复审是不同的RPC请求，所以无法直接同时获取到2条调用链路，通常需要额外存储2个traceId的映射关系。

(2) 无法准确描述业务逻辑的全景

分布式会话跟踪生成的调用链路，只包含单次请求的实际调用情况，部分未执行的调用以及本地逻辑无法体现在链路中，导致无法准确描述业务逻辑的全景。

例如同样是审核接口，初审链路1包含了服务b的调用，而复审链路2却并没有包含，这是因为审核场景中存在“判断逻辑”，而该逻辑无法体现在调用链路中，还是需要人工结合代码进行分析。

(3) 无法聚焦于当前业务系统的逻辑执行

分布式会话跟踪覆盖了单个请求流经的所有服务、组件、机器等等，不仅包含当前业务系统，还涉及了众多的下游服务，当接口内部逻辑复杂时，调用链路的深度和复杂度都会明显增加，而业务追踪其实仅需要聚焦于当前业务系统的逻辑执行情况。

例如审核场景生成的调用链路，就涉及了众多下游服务的内部调用情况，反而给当前业务系统的问题排查增加了复杂度。

### 1.2.3 总结

传统的ELK方案是一种滞后的业务追踪，需要事后从大量离散的日志中搜集和筛选出需要的日志，并人工进行日志的串联分析，其过程必然耗时耗力。

而分布式会话跟踪方案则是在调用执行的同时，实时地完成了链路的动态串联，但由于是会话级别且仅关注于调用关系等问题，导致其无法很好地应用于业务追踪。

因此，无论是传统的ELK方案还是分布式会话跟踪方案，都难以满足日益复杂的业务追踪需求。

本文希望能够实现聚焦于业务逻辑追踪的高效解决方案，将业务执行的日志以业务链路为载体进行高效组织和串联，并支持业务执行现场的还原和可视化查看，从而提升定位问题的效率，即可视化全链路日志追踪。

下文将介绍可视化全链路日志追踪的设计思路和通用方案，同时介绍新方案在大众点评内容平台的落地情况，旨在帮助有类似需求的业务系统开发需求的同学提供一些思路。

# 2. 可视化全链路日志追踪

## 2.1 设计思路

可视化全链路日志追踪考虑在前置阶段，即业务执行的同时实现业务日志的高效组织和动态串联，如下图4所示，此时离散的日志数据将会根据业务逻辑进行组织，绘制出执行现场，从而可以实现高效的业务追踪。

![设计思路](https://p1.meituan.net/travelcube/d5ef753204998aab83fa13d68f5f83b2169981.jpg)

新方案需要回答两个关键问题：如何高效组织业务日志，以及如何动态串联业务日志。下文将逐一进行回答。

### 问题1：如何高效组织业务日志？

为了实现高效的业务追踪，首先需要准确完整地描述出业务逻辑，形成业务逻辑的全景图，而业务追踪其实就是通过执行时的日志数据，在全景图中还原出业务执行的现场。

新方案对业务逻辑进行了抽象，定义出业务逻辑链路，下面还是以“审核业务场景”为例，来说明业务逻辑链路的抽象过程：

逻辑节点：业务系统的众多逻辑可以按照业务功能进行拆分，形成一个个相互独立的业务逻辑单元，即逻辑节点，可以是本地方法（如下图5的“判断逻辑”节点）也可以是RPC等远程调用方法（如下图5的“逻辑A”节点）。

逻辑链路：业务系统对外支撑着众多的业务场景，每个业务场景对应一个完整的业务流程，可以抽象为由逻辑节点组合而成的逻辑链路，如下图5中的逻辑链路就准确完整地描述了“审核业务场景”。
一次业务追踪就是逻辑链路的某一次执行情况的还原，逻辑链路完整准确地描述了业务逻辑全景，同时作为载体可以实现业务日志的高效组织。

![如何高效组织业务日志？](https://p1.meituan.net/travelcube/fe5e5df2b6b3bf340a259fda34b75b46156456.jpg)

### 问题2：如何动态串联业务日志？

业务逻辑执行时的日志数据原本是离散存储的，而此时需要实现的是，**随着业务逻辑的执行动态串联各个逻辑节点的日志，进而还原出完整的业务逻辑执行现场**。

由于逻辑节点之间、逻辑节点内部往往通过MQ或者RPC等进行交互，新方案可以采用分布式会话跟踪提供的分布式参数透传能力[5]实现业务日志的动态串联：

通过在执行线程和网络通信中持续地透传参数，实现在业务逻辑执行的同时，不中断地传递链路和节点的标识，实现离散日志的染色。

基于标识，染色的离散日志会被动态串联至正在执行的节点，逐渐汇聚出完整的逻辑链路，最终实现业务执行现场的高效组织和可视化展示。

与分布式会话跟踪方案不同的是，当同时串联多次分布式调用时，新方案需要结合业务逻辑选取一个公共id作为标识，例如图5的审核场景涉及2次RPC调用，为了保证2次执行被串联至同一条逻辑链路，此时结合审核业务场景，选择初审和复审相同的“任务id”作为标识，完整地实现审核场景的逻辑链路串联和执行现场还原。

# 2.2 通用方案

明确日志的高效组织和动态串联这两个基本问题后，本文选取图4业务系统中的“逻辑链路1”进行通用方案的详细说明，方案可以拆解为以下步骤：

![通用方案](https://p0.meituan.net/travelcube/6e28103ad7cdb54832e5e7844b31a9dd34296.jpg)

## 2.2.1 链路定义

“链路定义”的含义为：使用特定语言，静态描述完整的逻辑链路，链路通常由多个逻辑节点，按照一定的业务规则组合而成，业务规则即各个逻辑节点之间存在的执行关系，包括串行、并行、条件分支。

DSL（Domain Specific Language）是为了解决某一类任务而专门设计的计算机语言，可以通过JSON或XML定义出一系列节点（逻辑节点）的组合关系（业务规则）。

因此，本方案选择使用DSL描述逻辑链路，实现逻辑链路从抽象定义到具体实现。

![链路定义](https://p1.meituan.net/travelcube/48936bcb952d2485e5daa948afc6999372963.jpg)

### 逻辑链路1-DSL

```json
 [
    {
      "nodeName": "A",
      "nodeType": "rpc"
    },
    {
      "nodeName": "Fork",
      "nodeType": "fork",
      "forkNodes": [
        [
          {
            "nodeName": "B",
            "nodeType": "rpc"
          }
        ],
        [
          {
            "nodeName": "C",
            "nodeType": "local"
          }
        ]
      ]
    },
    {
      "nodeName": "Join",
      "nodeType": "join",
      "joinOnList": [
        "B",
        "C"
      ]
    },
    {
      "nodeName": "D",
      "nodeType": "decision",
      "decisionCases": {
        "true": [
          {
            "nodeName": "E",
            "nodeType": "rpc"
          }
        ]
      },
      "defaultCase": [
        {
          "nodeName": "F",
          "nodeType": "rpc"
        }
      ]
    }
  ]
```

## 2.2.2 链路染色

“链路染色”的含义为：在链路执行过程中，通过透传串联标识，明确具体是哪条链路在执行，执行到了哪个节点。

链路染色包括两个步骤：

步骤一：**确定串联标识，当逻辑链路开启时，确定唯一标识，能够明确后续待执行的链路和节点**。

链路唯一标识 = 业务标识 + 场景标识 + 执行标识 （三个标识共同决定“某个业务场景下的某次执行”）

业务标识：赋予链路业务含义，例如“用户id”、“活动id”等等。

场景标识：赋予链路场景含义，例如当前场景是“逻辑链路1”。

执行标识：赋予链路执行含义，例如只涉及单次调用时，可以直接选择“traceId”；涉及多次调用时则，根据业务逻辑选取多次调用相同的“公共id”。

节点唯一标识 = 链路唯一标识 + 节点名称 （两个标识共同决定“某个业务场景下的某次执行中的某个逻辑节点”）

节点名称：DSL中预设的节点唯一名称，如“A”。

步骤二：**传递串联标识，当逻辑链路执行时，在分布式的完整链路中透传串联标识，动态串联链路中已执行的节点，实现链路的染色**。

例如在“逻辑链路1”中：

当“A”节点触发执行，则开始在后续链路和节点中传递串联标识，随着业务流程的执行，逐步完成整个链路的染色。

当标识传递至“E”节点时，则表示“D”条件分支的判断结果是“true”，同时动态地将“E”节点串联至已执行的链路中。

## 2.2.3 链路上报

“链路上报”的含义为：在链路执行过程中，将日志以链路的组织形式进行上报，实现业务现场的准确保存。

![链路上报](https://p0.meituan.net/travelcube/1f1aec7b6a8ad083ace6d79f8a18d68587621.jpg)

如上图8所示，上报的日志数据包括：节点日志和业务日志。其中节点日志的作用是绘制链路中的已执行节点，记录了节点的开始、结束、输入、输出；业务日志的作用是展示链路节点具体业务逻辑的执行情况，记录了任何对业务逻辑起到解释作用的数据，包括与上下游交互的入参出参、复杂逻辑的中间变量、逻辑执行抛出的异常。

## 2.2.4 链路存储

“链路存储”的含义为：将链路执行中上报的日志落地存储，并用于后续的“现场还原”。上报日志可以拆分为链路日志、节点日志和业务日志三类：

链路日志：链路单次执行中，从开始节点和结束节点的日志中提取的链路基本信息，包含链路类型、链路元信息、链路开始/结束时间等。

节点日志：链路单次执行中，已执行节点的基本信息，包含节点名称、节点状态、节点开始/结束时间等。

业务日志：链路单次执行中，已执行节点中的业务日志信息，包含日志级别、日志时间、日志数据等。

下图就是链路存储的存储模型，包含了链路日志，节点日志，业务日志、链路元数据（配置数据），并且是如下图9所示的树状结构，其中业务标识作为根节点，用于后续的链路查询。

- 图9 链路的树状存储结构

![存储](https://p0.meituan.net/travelcube/de1585811ef98880d0daf8d674f9e0ce102979.jpg)

# 3. 大众点评内容平台实践

## 3.1 业务特点与挑战

互联网时代，内容为王。

内容型平台的核心打法就是搭建内容流水线，保障内容可持续、健康且有价值地流转到内容消费者，并最终形成内容“生产→治理→消费→生产”的良性循环。

大众点评和美团App拥有丰富多样的内容，站内外业务方、合作方有着众多的消费场景。

对于内容流水线中的三方，分别有如下需求：

- 内容的生产方：希望生产的内容能在更多的渠道分发，收获更多的流量，被消费者所喜爱。

- 内容的治理方：希望作为“防火墙”过滤出合法合规的内容，同时整合机器和人工能力，丰富内容属性。

- 内容的消费方：希望获得满足其个性化需求的内容，能够吸引其种草，或辅助其做出消费决策。

生产方的内容模型各异、所需处理手段各不相同，消费方对于内容也有着个性化的要求。

如果由各个生产方和消费方单独对接，内容模型异构、处理流程和输出门槛各异的问题将带来对接的高成本和低效率。

在此背景下，点评内容平台应运而生，作为内容流水线的“治理方”，承上启下实现了内容的统一接入、统一处理和统一输出：

- 图10 点评内容平台业务形态

![点评内容平台业务形态](https://p0.meituan.net/travelcube/70e2859a96b5659e4ac84def80b427d892965.jpg)

- 统一接入：统一内容数据模型，对接不同的内容生产方，将异构的内容转化为内容平台通用的数据模型。

- 统一处理：统一处理能力建设，积累并完善通用的机器处理和人工运营能力，保证内容合法合规，属性丰富。

- 统一输出：统一输出门槛建设，对接不同的内容消费方，为下游提供规范且满足其个性化需求的内容数据。

如下图11所示，是点评内容平台的核心业务流程，每一条内容都会经过这个流程，最终决定在各个渠道下是否分发。

![分发](https://p0.meituan.net/travelcube/9ba49505df8764779e685680ec6e6b22144117.jpg)

内容是否及时、准确经过内容平台的处理，是内容生产方和消费方的核心关注，也是日常值班的主要客诉类型。而内容平台的业务追踪建设，主要面临以下的困难与复杂性：

- 业务场景多：业务流程涉及多个不同的业务场景，且逻辑各异，例如实时接入、人工运营、分发重算等图中列出的部分场景。

- 逻辑节点多：业务场景涉及众多的逻辑节点，且不同内容类型节点各异，例如同样是实时接入场景，笔记内容和直播内容在执行的逻辑节点上存在较大差异。

- 触发执行多：业务场景会被多次触发执行，且由于来源不同，逻辑也会存在差异，例如笔记内容被作者编辑、被系统审核等等后，都会触发实时接入场景的重新执行。

点评内容平台日均处理百万条内容，涉及百万次业务场景的执行、高达亿级的逻辑节点的执行，而业务日志分散在不同的应用中，并且不同内容，不同场景，不同节点以及多次执行的日志混杂在一起，无论是日志的搜集还是现场的还原都相当繁琐耗时，传统的业务追踪方案越来越不适用于内容平台。

点评内容平台亟需新的解决方案，实现高效的业务追踪，因此我们进行了可视化全链路日志追踪的建设，下面本文将介绍一下相关的实践和成果。

# 3.2 实践与成果

## 3.2.1 实践

点评内容平台是一个复杂的业务系统，对外支撑着众多的业务场景，通过对于业务场景的梳理和抽象，可以定义出实时接入、人工运营、任务导入、分发重算等多个业务逻辑链路。

由于点评内容平台涉及众多的内部服务和下游依赖服务，每天支撑着大量的内容处理业务，伴随着业务的执行将生成大量的日志数据，与此同时链路上报还需要对众多的服务进行改造。

因此在通用的全链路日志追踪方案的基础上，点评内容平台进行了如下的具体实践。

(1) 支持大数据量日志的上报和存储

点评内容平台实现了图12所示的日志上报架构，支持众多服务统一的日志收集、处理和存储，能够很好地支撑大数据量下的日志追踪建设。

![支持大数据量日志的上报和存储](https://p0.meituan.net/travelcube/5766c1ee95a334de30cb8af12f495643120017.jpg)

日志收集：各应用服务通过机器上部署的log_agent收集异步上报的日志数据，并统一传输至Kafka通道中，此外针对少量不支持log_agent的服务，搭建了如图所示的中转应用。

日志解析：收集的日志通过Kafka接入到Flink中，统一进行解析和处理，根据日志类型对日志进行分类和聚合，解析为链路日志、节点日志和业务日志。

日志存储：完成日志解析后，日志会按照树状的存储模型进行落地存储，结合存储的需求分析以及各个存储选项的特点，点评内容平台最终选择HBase作为存储选型。

整体而言，log_agent + Kafka + Flink + HBase的日志上报和存储架构能够很好地支持复杂的业务系统，天然支持分布式场景下众多应用的日志上报，同时适用于高流量的数据写入。

(2) 实现众多后端服务的低成本改造

点评内容平台实现了“自定义日志工具包”（即下图13的TraceLogger工具包），屏蔽链路追踪中的上报细节，实现众多服务改造的成本最小化。TraceLogger工具包的功能包括：

模仿slf4j-api：工具包的实现在slf4j框架之上，并模仿slf4j-api对外提供相同的API，因此使用方无学习成本。

屏蔽内部细节，内部封装一系列的链路日志上报逻辑，屏蔽染色等细节，降低使用方的开发成本。

上报判断：

判断链路标识：无标识时，进行兜底的日志上报，防止日志丢失。

判断上报方式：有标识时，支持日志和RPC中转两种上报方式。

日志组装：实现参数占位、异常堆栈输出等功能，并将相关数据组装为Trace对象，便于进行统一的收集和处理。

异常上报：通过ErrorAPI主动上报异常，兼容原日志上报中ErrorAppender。

日志上报：适配Log4j2日志框架实现最终的日志上报。

![日志框架层](https://p0.meituan.net/travelcube/3b651ca2e4b1c2d4c8931b28f6465a5d133236.jpg)

下面是TraceLogger工具包分别进行业务日志和节点日志上报的使用案例，整体的改造成本较低。

业务日志上报：无学习成本，基本无改造成本。

```java
// 替换前：原日志上报
LOGGER.error("update struct failed, param:{}", GsonUtils.toJson(structRequest), e);
// 替换后：全链路日志上报
TraceLogger.error("update struct failed, param:{}", GsonUtils.toJson(structRequest), e);
```

节点日志上报：支持API、AOP两种上报方式，灵活且成本低。

```java
  public Response realTimeInputLink(long contentId) {
    // 链路开始：传递串联标识（业务标识 + 场景标识 + 执行标识）
    TraceUtils.passLinkMark("contentId_type_uuid");
    // ...
    // 本地调用(API上报节点日志)
    TraceUtils.reportNode("contentStore", contentId, StatusEnums.RUNNING)
    contentStore(contentId);
    TraceUtils.reportNode("contentStore", structResp, StatusEnums.COMPLETED)
    // ...
    // 远程调用
    Response processResp = picProcess(contentId);
    // ...
  }
  // AOP上报节点日志
  @TraceNode(nodeName="picProcess")
  public Response picProcess(long contentId) {
    // 图片处理业务逻辑
    // 业务日志数据上报
    TraceLogger.warn("picProcess failed, contentId:{}", contentId);
  }
```

## 3.2.2 成果

基于上述实践，点评内容平台实现了可视化全链路日志追踪，能够一键追踪任意一条内容所有业务场景的执行，并通过可视化的链路进行执行现场的还原，追踪效果如下图所示：

【链路查询功能】：根据内容id实时查询该内容所有的逻辑链路执行，覆盖所有的业务场景。

![链路](https://p1.meituan.net/travelcube/30f2e1cc5f51fd03699e077a5a6b534e260325.jpg)

【链路展示功能】：通过链路图可视化展示业务逻辑的全景，同时展示各个节点的执行情况。

![链路展示功能](https://p1.meituan.net/travelcube/544ccd8f71df3d1252c88d5c030d9498245769.jpg)

【节点详情查询功能】：支持展示任意已执行节点的详情，包括节点输入、输出，以及节点执行过程中的关键业务日志。

![节点详情查询功能](https://p0.meituan.net/travelcube/2f9639ac74c0f41e501793f21a36688d312018.jpg)

目前，可视化全链路日志追踪系统已经成为点评内容平台的“问题排查工具”，我们可以将问题排查耗时从小时级降低到5分钟内；

同时也是“测试辅助工具”，利用可视化的日志串联和展示，明显提升了RD自测、QA测试的效率。

最后总结一下可视化全链路日志追踪的优点：

- 接入成本低：DSL配置配合简单的日志上报改造，即可快速接入。

- 追踪范围广：任意一条内容的所有逻辑链路，均可被追踪。

- 使用效率高：管理后台支持链路和日志的可视化查询展示，简单快捷。

# 4. 总结与展望

随着分布式业务系统的日益复杂，可观测性对于业务系统的稳定运行也愈发重要[6]。

作为大众点评内容流水线中的复杂业务系统，为了保障内容流转的稳定可靠，点评内容平台落地了全链路的可观测建设，在日志（Logging）、指标（Metrics）和追踪（Tracing）的三个具体方向上都进行了一定的探索和建设。

其中之一就是本文的“可视化全链路日志追踪”，结合日志（Logging）与追踪（Tracing），我们提出了一套新的业务追踪通用方案，通过在业务执行阶段，结合完整的业务逻辑动态完成日志的组织串联，替代了传统方案低效且滞后的人工日志串联，最终可以实现业务全流程的高效追踪以及业务问题的高效定位。

此外，在指标（Metrics）方向上，点评内容平台实践落地了“可视化全链路指标监控”，支持实时、多维度地展示业务系统的关键业务和技术指标，同时支持相应的告警和异常归因能力，实现了对业务系统整体运行状况的有效把控。

未来，点评内容平台会持续深耕，实现覆盖告警、概况、排错和剖析等功能的可观测体系[7]，持续沉淀和输出相关的通用方案，希望可以为业务系统（特别是复杂的业务系统），提供一些可观测性建设的借鉴和启发。

# 参考资料

[可视化全链路日志追踪](https://tech.meituan.com/2022/07/21/visualized-log-tracing.html)

* any list
{:toc}