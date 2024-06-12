---
layout: post
title:  Microservices 微服务架构
date:  2018-09-06 08:16:17 +0800
categories: [Architecture]
tags: [serverless, architecture, sh]
published: true
---

# 微服务

## 概念

微服务是一种软件开发技术——面向服务的体系结构(SOA)体系结构样式的变体，它将应用程序构造为松散耦合服务的集合。

在微服务体系结构中，服务是细粒度的，协议是轻量级的。

将应用程序分解为不同的更小的服务的好处是，它提高了模块化，使应用程序更容易理解、开发和测试，并对体系结构的侵蚀更有弹性。

通过允许小型自治团队独立开发、部署和扩展各自的服务，实现了开发的并行化。

它还允许通过连续的重构来出现单个服务的体系结构。基于微服务的体系结构支持持续的交付和部署。

## 系统架构

- 微服务架构图示

![微服务架构图示](https://pic1.zhimg.com/80/v2-9702c65f3767125903a6c0e144bbcda0_hd.png)

## 优点

微服务架构有很多重要的优点。首先，它解决了复杂性问题。它将单体应用分解为一组服务。虽然功能总量不变，但应用程序已被分解为可管理的模块或服务。这些服务定义了明确的RPC或消息驱动的API边界。微服务架构强化了应用模块化的水平，而这通过单体代码库很难实现。因此，微服务开发的速度要快很多，更容易理解和维护。

其次，这种体系结构使得每个服务都可以由专注于此服务的团队独立开发。只要符合服务API契约，开发人员可以自由选择开发技术。这就意味着开发人员可以采用新技术编写或重构服务，由于服务相对较小，所以这并不会对整体应用造成太大影响。

第三，微服务架构可以使每个微服务独立部署。开发人员无需协调对服务升级或更改的部署。这些更改可以在测试通过后立即部署。所以微服务架构也使得CI／CD成为可能。

最后，微服务架构使得每个服务都可独立扩展。我们只需定义满足服务部署要求的配置、容量、实例数量等约束条件即可。比如我们可以在EC2计算优化实例上部署CPU密集型服务，在EC2内存优化实例上部署内存数据库服务。

## 缺点

微服务的一些想法在实践上是好的，但当整体实现时也会呈现出其复杂性。

- 运维开销及成本增加

整体应用可能只需部署至一小片应用服务区集群，而微服务架构可能变成需要构建/测试/部署/运行数十个独立的服务，并可能需要支持多种语言和环境。

这导致一个整体式系统如果由20个微服务组成，可能需要40~60个进程。

- 必须有坚实的 DevOps 开发运维一体化技能

开发人员需要熟知运维与投产环境，开发人员也需要掌握必要的数据存储技术如NoSQL，具有较强DevOps技能的人员比较稀缺，会带来招聘人才方面的挑战。

- 隐式接口及接口匹配问题

把系统分为多个协作组件后会产生新的接口，这意味着简单的交叉变化可能需要改变许多组件，并需协调一起发布。

在实际环境中，一个新品发布可能被迫同时发布大量服务，由于集成点的大量增加，微服务架构会有更高的发布风险。

- 代码重复

某些底层功能需要被多个服务所用，为了避免将“同步耦合引入到系统中”，有时需要向不同服务添加一些代码，这就会导致代码重复。

- 分布式系统的复杂性

作为一种分布式系统，微服务引入了复杂性和其他若干问题，例如网络延迟、容错性、消息序列化、不可靠的网络、异步机制、版本化、差异化的工作负载等，开发人员需要考虑以上的分布式系统问题。

- 异步机制

微服务往往使用异步编程、消息与并行机制，如果应用存在跨微服务的事务性处理，其实现机制会变得复杂化。

- 可测性的挑战

在动态环境下服务间的交互会产生非常微妙的行为，难以可视化及全面测试。

经典微服务往往不太重视测试，更多的是通过监控发现生产环境的异常，进而快速回滚或采取其他必要的行动。

但对于特别在意风险规避监管或投产环境错误会产生显著影响的场景下需要特别注意。

## 取舍

1. 公司对应的资本 + 团队对应的技术，选择合适的技术

2. 微服务是手段，而不是目的。

## 挑战

上面的挑战可以概述如下：

- API Gateway

- 服务间调用

- 服务发现

- 服务容错

- 服务部署

- 数据调用

![PatternsRelatedToMicroservices](https://microservices.io/i/PatternsRelatedToMicroservices.jpg)

不过幸运的是，很多成熟的中间件，已经为我们解决了这些问题。

# SOA vs 微服务

![SOA vs 微服务](https://images.gitee.com/uploads/images/2020/1212/101955_42f91188_508704.png "soa.png")

| SOA	                                       | 微服务架构 |
|:---|:---|
| 应用程序服务的可重用性的最大化	           |    专注于解耦 |
| 系统性的改变需要修改整体	               |   系统性的改变是创建一个新的服务 |
| DevOps和持续交付正在变得流行，但还不是主流 | 	  强烈关注DevOps和持续交付 |
| 专注于业务功能重用	                       |  更重视“上下文边界”的概念 |
| 通信使用企业服务总线ESB	                   |  对于通信而言，使用较少精细和简单的消息系统 |
| 支持多种消息协议	                       |  使用轻量级协议，例如HTTP，REST或Thrift API |
| 对部署到它的所有服务使用通用平台	       |    应用程序服务器不是真的被使用，通常使用云平台 |
| 容器（如Docker）的使用不太受欢迎	       |   容器在微服务方面效果很好 |
| SOA服务共享数据存储	                       |  每个微服务可以有一个独立的数据存储 |
| 共同的治理和标准	                       |  轻松的治理，更加关注团队协作和选择自由 |

# 第一代微服务框架

[Spring Cloud](https://houbb.github.io/2018/09/06/spring-cloud)

[Dubbo](https://houbb.github.io/2016/09/25/dubbo)

# 下一代微服务：Service Mesh？

[Service Mesh](https://houbb.github.io/2018/09/06/service-mesh)

# 拓展阅读

[K8s](https://houbb.github.io/2018/08/18/k8)

# 参考资料

- Microservices

https://en.wikipedia.org/wiki/Microservices

https://martinfowler.com/articles/microservices.html

https://microservices.io/patterns/microservices.html

- 微服务

[什么是微服务](https://blog.csdn.net/wuxiaobingandbob/article/details/78642020)

[解析微服务架构(一)：什么是微服务](https://www.ibm.com/developerworks/community/blogs/3302cc3b-074e-44da-90b1-5055f1dc0d9c/entry/%E8%A7%A3%E6%9E%90%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84_%E4%B8%80_%E4%BB%80%E4%B9%88%E6%98%AF%E5%BE%AE%E6%9C%8D%E5%8A%A1?lang=en)

[SOA 架构和微服务架构](https://zhuanlan.zhihu.com/p/38878840)

[一篇文章快速理解微服务架构](http://dockone.io/article/3687)

[微服务架构 vs. SOA架构](https://blog.csdn.net/chszs/article/details/78515231)

* any list
{:toc}