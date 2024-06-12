---
layout: post
title: Docker learn-12-入门白皮书
date:  2019-12-18 11:34:23 +0800
categories: [Docker]
tags: [docker, windows, devops, sh]
published: true
---

# 从 dotCloud 到 Docker

## 追根溯源： dotCloud

时间倒回到两年前，有一个名不见经传的小公司，他的名字叫做： dotCloud 。

dotCloud 公司主要提供的是基于 PaaS Platform as a Service ，平台及服务平台为开发者或开发商提供技术服务，并提供的开发工具和技术框架。

初创企业总是艰难的， dotCloud 也是一样。

在 IBM ，亚马逊，谷歌等大公司的挤压下， dotCloud 举步维艰。

即使 2011 年拿到了 1000 万美元的融资，可和上述大公司比起来，也不过是杯水车薪。

随着开源的洪流袭来，在 2013 年 dotCloud 的创始人， 28 岁的 SolomonHykes 做了一个艰难的决定：将 dotCloud 的核心引擎开源！

然而一旦这个基于 LXC Linux Container ）技术的核心管理引擎开源 dotCloud 公司就相当于走上了一条不归路。

可正是这个孤注一掷的举动，却带来了全球技术人员的热潮，众程序员惊呼：

太方便了，太方便了。

也正是这个决定，让所 有的 IT 巨头也为之一颤。一个新的公司也随之出世，它就是： Docker 。

## Docker 出世：从 Docker 0.1 到 Docker 1.0

一个春秋，跨越了 Docker 的成名路。

在互联网时代，一夜成名早已不是什么新闻。

Docker 这个技术公司，向我们证明了，成为一个国际巨星，只需要一个月。 

2013 年 2 月决定开源，到 2013 年3 月 20 日发布 Docker 0.1 ，只用了一个月的时间。

今后几乎每个一个月，Docker 都会发布一个版本。

而 Docker 0.1 的发布像是一个宣言，昭示着一个 Docker 正在以一个新兴容器领导者的姿态迈进。

正如我们所知，从 Docker 0.1 到 Docker 1.0 15 个月的时间， Docker 迅速成长。

在 2014 年 6 月 9 日， Docker 团队宣布发布 Docker 1.0 版。

1.0 版本标志着 Docker 公司认为 Docker 平台已经足够成熟，并可以被应用到产品中（还提供了一些需要付费的支持选项）。

在这 15 个月中， Docker 共收到了超过 460 位贡献者的 8741 条改进建议，Docker的用心经营下社区十分活跃。

可以说， Docker 的成功起于开源，发于社区。

一年的时间，使一个围绕着 Docker 的小型初创企业生态体系逐渐形成。

Docker 先后赢得了 Google 、微软、 Amazon 、 VMware 等巨头的青睐，巨头们纷纷示意将保证自己平台与 Docker 容器技术的兼容性。

微软还宣布来要推出面向 Windows 的 Docker 客户端。

到了 2014 年 9 月， Docker 完成 4000 万美元的 C 轮融资，彼时市值与约为 4 亿美元。

可以说 Docker 一路风生水起，迅速赢得了 IT 圈的信赖。

并且在 8 月 12 Docker 发布了 Docker 1.8 正式版（下载地址见末尾）。

# 如何定义 Docker

Docker是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上。

Docker是一个重新定义了程序开发测试、交付和部署过程的开放平台，Docker 则可以称为构建一次，到处运行，这就是 Docker 提出的

**Build once, Run anywhere**

## 基本概念

为了更好的认识 Docker 我们先来了解几个必备词汇：镜像，容器和仓库。

1、镜像 

文件的层次结构，以及包含如何运行容器的元数据， Docker file 中的每条命令都会在文件系统中创建一个新的层次结构，文件系统在这些层次上构建起来，镜像就构建于这些联合的文件系统之上。

Docker 镜像就是一个只读的模板，镜像可以用来创建 Docker 容器。

Docker 提供了一个很简单的机制来创建镜像或者更新现有的镜像，用户甚至可以直接从其他人那里下载一个已经做好的镜像来直接使用。

2、容器 

容器是从镜像创建的运行实例。它可以被启动、开始、停止、删除。

每个容器都是相互隔离的、保证安全的平台。

可以把容器看做是一个简易版的 Linux 环境， Docker 利用容器来运行应用。

3、仓库 

仓库是集中存放镜像文件的场所，仓库注册服务器（Registry 上往往存放着多个仓库，每个仓库中又包含了多个镜像，每个镜像有不同的标签 tag）。

目前，最大的公开仓库是 Docker Hub ，存放了数量庞大的镜像供用户下载。

## Docker 与容器的关系

Docker 仓库用来保存我们的 images ，当我们创建了自己的 image 之后我们就可以使用 push 命令将它上传到公有或者私有仓库，这样下次要在另外一台机器上使用这个 image 时候，只需要从仓库上 pull 下来就可以了。

Docker的运行离不开这几位的支持， Docker 的成功也是拜几位所赐。

也有人会误以为， Docker 就是容器。 

但 Docker 只会傲娇地说：**我不是容器，我是管理容器的引擎。**

![image](https://user-images.githubusercontent.com/18375710/71171989-14f30400-229a-11ea-985c-60cca456a012.png)

## Docker 概念

Docker 是一个开源的引擎，可以轻松的为任何应用创建一个轻量级的、可移植的、自给自足的容器。开发者在笔记本上编译测试通过的容器可以批量地在生产环境中部署，包括 VMs （虚拟机）、 bare metal 、OpenStack 集群和其他的基础应用平台。

从这里我们可以看出，Docker 并非是容器，而是管理容器的引擎。 

Docker 为应用打包、部署的平台，而非单纯的虚拟化技术。

# Docker 与虚拟化争锋

![image](https://user-images.githubusercontent.com/18375710/71172049-394ee080-229a-11ea-84e5-4f4a67c562a0.png)

谈到虚拟化，很多人又发问了。

## Docker 和虚拟化有什么区别？ 

Docker （或者说是容器）的出现是否会取代传统的虚拟化技术。

说起虚拟化，大家首先想到的必然是VM 一类的虚机。

这类虚拟机完美的运行了另一套系统，能够使应用程序，操作系统和硬件三者之间的逻辑不变。

但在惜时如金的现在，这类虚机也面临着一定的问题，比如：启动时间太长，

你有没有过在启动虚拟机后，点开其他页面继续操作，过了一分钟才回来的经历？

还有虚拟镜像体积太大（一般都是几十 GB ）等问题。

**相比之下 Docker 的镜像一般只有二三百兆。并且启动速度超快，Docker 的启动时间为毫秒级。**

- 价格

还有一个最大的问题是价格问题，据StackEngine 调查分析，有 43.8% 的企业使用 Docker 的原因是 VMvire 太贵。

![image](https://user-images.githubusercontent.com/18375710/71172435-2983cc00-229b-11ea-8dc3-77df7c2543e9.png)

简而言之，更小更快，更便宜。

但是，传统的虚拟技术还不会被取代。

Docker 或者说容器技术和虚拟机并非简单的取舍关系。

## 使用

目前，很多企业仍在使用虚拟机技术，原因很简单，他们需要一个高效，安全且高可用的构架。

然而，刚刚面世两年的 Docker 还没有经历沙场考验， CaaS （Container as a Service ，容器即服务）概念也是近两年才刚刚出现。

无论是应用管理还是运行维护方面， Docker 都还处于发展与完善阶段。

# Docker 的特殊之处

Solomon Hykes：成功的要素之一是在正确的时间做了正确的事，我们一直坚信这个理念。 

Docker 就好比传统的货运集装箱。但是创新可不仅仅是在这个盒子里，而且还包括如何自动管理呈现上万个这样的箱子。

这才是问题的关键。

站在未来的角度， Docker 解决了三大现存问题。

Docker 让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，便可以实现虚拟化。

俗话说：天下武学为快不破；在更新迭代如此之快的IT 更是如此。 

所有成功的 IT 公司都必须走在时代的前列，他们的产品应该来自未来。

他们有必要要站在未来的角度解决现存的问题。

ps: 当然也不能太超前，时机一定要合适。

## 协作痛点

Solomon Hykes 曾经说过，自己在开发 dotCloud 的 PaaS 云时，就发现一个让人头痛的问题：

应用开发工程师和系统工程师两者之间无法轻松协作发布产品。 

## 解决的难题

Docker 解决了难题。让开发者能专心写好程序；让系统工程师专注在应用的水平扩展、稳定发布的解决方案上。

### 简化程序 

Docker 让开发者可以打包他们的应用以及依赖包到一 个可移植的容器中，然后发布到任何流行的 Linux 机器上，便可以实现虚拟化。

Docker 改变了虚拟化的方式，使开发者可以直接将自己的成果放入 Docker 中进行管理。

方便快捷已经是 Docker 的最大优势，过去需要用数天乃至数周的任务，在 Docker 容器的处理下，只需要数秒就能完成。

### 避免选择恐惧症 

如果你有选择恐惧症，还是资深患者。 

Docker 帮你打包你的纠结！

比如 Docker 镜像； 

Docker 镜像中包含了运行环境和配置，所以 Docker 可以简化部署多种应用实例工作。

比如 Web 应用、后台应用、数据库应用、大数据应用比如 Hadoop 集群、消息队列等等都可以打包成一个镜像部署。

### 节省开支 

一方面，云计算时代到来，使开发者不必为了追求效果而 配置高额的硬件， Docker 改变了高性能必然高价格的思维定势。 

Docker 与云的结合，让云空间得到更充分的利用。

不仅解决了硬件管理的问题，也改变了虚拟化的方式。

另一方面， Docker 能够是自愿额达到充分利用。

举个简单地例子：凌晨三点的时候只有很少的人会去访问你的网站，同时你需要比较多的资源执行夜间的批处理任务，通过 Docker 可以很简单的便实现资源的交换。

Docker 的这些优势，让各大 IT 巨头纷纷对 Docker 看好。

# 统一标准

在 2015 年的 Docker Con 上推出了开放容器技术项目（ Open Container Project ）。 

OCP 是一个非营利性组织，其受特许建立通用的容器软件技术标准。

这个项目汇集了微软、谷歌、惠普、IBM 、英特尔、红帽（ Red Hat ）、 VMware 以及高盛等众多实力企业， OCP 的推出，也使宿敌 Docker 和 CoreOS 走向了联合。

让微软与自己的竞争对手 Linux 合作，足以见得 Docker 的魅力。

谷歌 云计算平台产品经理克雷格·麦克拉克伊说：创建通用容器格式非常重要，单一标准可以促进更有活力的生态系统。

# 安全问题

随着容器技术逐渐得到 IT 界的认可， CaaS（Container as a Service ，容器即服务）也逐渐形成。

而 Docker 作为 CaaS 技术的标杆是否已经得到企业的认可？是否投入生产呢？

2015 年， VMblog.com 和 CloudCow.com 共同组织了一次问卷调查。

报告显示， Docker 的早期用户中， 63% 的用于 QA/Test 53% 的用于开发，并且 31% 的用户计划在生产环境中使用 Docker ，阻碍企业使用 Docker 的最大因素
在于其安全性以及缺少生产环境下的运维工具（两个原因各占 49% 左右）。

对 Docker 应用最广泛的三个领域分别是： Test/QA 应用； Web 应用；大数据，企业应用。

调查显示，目前企业对 Docker 的接受程度在不断提高。

但 Docker 的安全性似乎仍旧是企业顾虑的主要原因，那么 Docker 的安全性究竟如何？

总体来讲， Docker 的安全性能还不错，只是这还是一项年轻的技术、因此目前尚未积累起能够满足实际生产需求的完整工具生态系统。

其实如果要谈论 Docker 的安全性，我们就要谈论三点：命名空间 Namespace Docker 程序本身的抗攻击性和加固内核安全性来影响容器的安全性。

## 命名空间

Docker 有五个命名空间：进程、网络、 挂载、宿主和共享内存，为了隔离有问题的应用， Docker 运用 Namespace 将进程隔离，为进程或进程组创建已隔离的运行空间，为进程提供不同的命名空间视图。

这样，每一个隔离出来的进程组，对外就表现为一个 container。

需要注意的是， Docker 让用户误以为自己占据了全部资源，但这并不是虚拟机。

内核 namesapce 从内核 2.6.15 之后被引入，距今已经 5 年了，在很多大型生产系统中被验证。

他们的设计和灵感提出的时间更早， openvz 项目利用 namespace 重新封装他们的内核，并合并到主流内核中。 

openvz 最早的版本是 2005 年的 ，所以他们的设计和实现都很成熟。

## Docker 程序本身的抗攻击性

Docker 允许你在主机和容器之间共享文件夹，这就容易让容器突破资源限制，那么容器就可以对主机做任何更改了。

但实际上，几乎所有虚拟机系统都有在物理主机和虚拟机之间共享资源的限制，所以这一层的安全性，需要你自己把控。

## 加固内核安全性 

默认情况下， Docker 启动的容器只使用一部分内核capabilities ，就算攻击者在容器中取得了 root 权限，他能做的破坏也少了，也不能获得主机的更高权限。

由此我们可以说： **Docker 还是比较安全的，但是你要注意使用在容器中使用非 root 权限允许进程。**


# 应用场景

Docker 的主要应用场景为：

面向开发人员快速开发、交付应用程序。 

开发环境的机器通常内存比较小，之前使用虚拟的时候， 经常需要为开发环境的机器加内存，而现在 Docker 可以轻易的让几十个服务在 Docker 中跑起来。

面向运维人员：降低运维成本。

正如通过虚拟机来整合多个应用， Docker 隔离应用的能力使得 Docker 可以整合多个服务器以降低成本。 

Docker 通过镜像机制，将你的代码和运行环境直接打包成镜像，扔到容器启动即可。

面向企业 Docker 本身就发家于 PaaS ，在 Docker 面向企业 是可以提供 Paas 层的实现；

比如，扩展现有的 OpenShift 或 Cloud Foundry 平台来搭建自己的 PaaS 环境。

# 个人收获

从 docker 的发展历史而言，出现的时间非常短。

这种思想也许很久远，2000 年就有 LXC，1956 年就发明了集装箱。

安全很重要。

价格，体积，速度，也很重要。

# 参考资料

《Docker入门白皮书》

* any list
{:toc}