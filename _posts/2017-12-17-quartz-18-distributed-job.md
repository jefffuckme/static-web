---
layout: post
title:  Quartz 18-分布式任务调度框架 xxl-job elastic-job saturn 对比
date:  2017-12-19 14:43:25 +0800
categories: [Schedule]
tags: [java, quartz, job, schedule, distributed, sh]
published: true
---

# 业务场景

保险人管系统每月工资结算，平安有150万代理人，如何快速的进行工资结算(数据运算型)

保险短信开门红/电商双十一 1000w+短信发送(短时汇聚型)

工作中业务场景非常多，所涉及到的场景也各不相同，这使得我们定时任务系统应该集管理、调度、任务分配、监控预警为一体的综合调度系统,如何打造一套健壮的、适应不同场景的系统，技术选型尤其重要。

针对以上场景我们需要我们的分布式任务系统具备以下能力：

1.支持多种作业类型(shell作业/Java作业)

2.支持作业HA，负载均衡和失败转移

3.支持弹性扩容(应对开门红以及促销活动)

4.支持Job Timeout 处理

5.支持统一监控和告警

6.支持作业统一配置

7.支持资源隔离和作业隔离

# 定时任务调度的特点

任务调度就是设点某一时间点自动触发的任务，该任务可以在时间规律上去循环执行。

一般的技术quartz、spring task、java.util.Timer，这几种如果在单一机器上跑其实问题不大，但是如果一旦应用于集群环境做分布式部署，就会带来一个致命的问题，那就是重复执行，当然解决方案有，但是必须依赖数据库，将任务执行状态持久化下来。

## 特点：

- 时间驱动：系统一般可以通过时间来驱动，定时定点定次。

- 批量处理：批量处理堆积的数据更加高效，在不需要实时性的情况下比消息中间件更有优势。而且有的业务逻辑只能批量处理。如对账批处理、资金管理系统回盘、部分银行的报盘前的制盘

- 非实时性：定时任务不要求实时性，一般不用于C端用户的交互，更多的用于业务数据的处理

- 隔离性/专一性：可以跟其他系统分离，只关注业务数据的处理，不影响用户的操作和用户系统的性能。

# 开源定时任务框架

Quartz：Java事实上的定时任务标准。但Quartz关注点在于定时任务而非数据，并无一套根据数据处理而定制化的流程。虽然Quartz可以基于数据库实现作业的高可用，但缺少分布式并行调度的功能。

TBSchedule：阿里早期开源的分布式任务调度系统。代码略陈旧，使用timer而非线程池执行任务调度。众所周知，timer在处理异常状况时是有缺陷的。而且TBSchedule作业类型较为单一，只能是获取/处理数据一种模式。还有就是文档缺失比较严重。

Elastic-job：当当开发的弹性分布式任务调度系统，功能丰富强大，采用zookeeper实现分布式协调，实现任务高可用以及分片，目前是版本2.15，并且可以支持云开发，目前是版本2.15，现在已经不在更新。

Saturn：是唯品会自主研发的分布式的定时任务的调度平台，Saturn (任务调度系统)是唯品会开源的一个分布式任务调度平台，取代传统的Linux Cron/Spring Batch Job的方式，做到全域统一配置，统一监控，任务高可用以及分片并发处理。Saturn是在当当开源的Elastic Job基础上，结合各方需求和我们的实践见解改良而成，最新发布版本V3.3.1(2019年1月18日)，最新测试版本V3.3.3.1。使用案例 唯品会、酷狗音乐、新网银行、海融易、航美在线、量富征信 

xxl-job: 是大众点评员工徐雪里于2015年发布的分布式任务调度平台，是一个轻量级分布式任务调度框架，其核心设计目标是开发迅速、学习简单、轻量级、易扩展,最新发布版本V2.0.2(2019.4.20日)，其在唯品会内部已经发部署350+个节点，每天任务调度4000多万次。同时，管理和统计也是它的亮点。使用案例 大众点评、易信(IM)、京东(电商系统)、360金融(金融系统)、易企秀、随行付(支付系统)、优信二手车

# 分布式定时任务调度系统对比

参与对比的可选系统方案： xxl-job(大众点评开源)、Elastic-job(当当网开源)、Saturn(唯品会开源）

## 集群部署

### xxl-job: 

基于Quartz的集群方案，数据库选用Mysql；集群分布式并发环境中使用QUARTZ定时任务调度，会在各个节点会上报任务，存到数据库中，执行时会从数据库中取出触发器来执行，如果触发器的名称和执行时间相同，则只有一个节点去执行此任务。调度中心通过db配置区分不同集群。

调度中心集群部署时，几点要求和建议：

DB配置保持一致；

登陆账号配置保持一致；

集群机器时钟保持一致（单机集群忽视）；

建议：推荐通过nginx为调度中心集群做负载均衡，分配域名。调度中心访问、执行器回调配置、调用API服务等操作均通过该域名进行

### Elastic-job: 

重写Quartz基于数据库的分布式功能，改用Zookeeper实现注册中心

基于Zookeeper和其客户端Curator实现的全局作业注册控制中心。用于注册，控制和协调分布式作业执行。

### Saturn: 

Saturn是Elastic-job的fork版本，所以saturn 也是用Zookeeper实现集群的调度。

Saturn包括两大部分，Saturn Console和Saturn Executor。

Saturn Console是一个GUI，用于作业/Executor管理，统计报表展现，系统配置等功能。它同时也是整个调度系统的大脑：将作业任务分配到各Executor。

为了实现Console的高可用性，我们都希望Console有多台服务器所组成。我们只需要在多台不同的服务器的环境变量中指定相同的VIP_SATURN_CONSOLE_CLUSTER即可，至于VIP_SATURN_CONSOLE_CLUSTER的值，由你自行指定，只是一个集群标识而已。

Saturn Executor是执行任务的Worker：按照作业配置的要求去执行部署于Executor所在容器或物理机当中的作业脚本和代码。

## 多节点部署时任务不能重复执行

### xxl-job：

使用Quartz基于数据库的分布式功能，为保证系统"轻量级"并且降低学习部署成本，没有采用Zookeeper作为注册中心，采用DB方式进行任务注册发现

### Elastic-job：

将任务拆分为n个任务项后，各个服务器分别执行各自分配到的任务项。一旦有新的服务器加入集群，或现有服务器下线，elastic-job将在保留本次任务执行不变的情况下，下次任务开始前触发任务重分片。

### Saturn：

同Elastic-job 

## 日志可追溯

### xxl-job: 

支持，有日志查询界面

### Elastic-job: 

可通过事件订阅的方式处理调度过程的重要事件，用于查询、统计和监控。Elastic-Job目前提供了基于关系型数据库两种事件订阅方式记录事件。

### Staturn: 

支持日志查看，同时支持jstack和gc log备份到executor日志目录(executor版本大于3.0.0)

# 监控告警

## xxl-job: 

任务调度失败时邮件通知的邮箱地址，支持配置多邮箱地址，配置多个邮箱地址时用逗号分隔

## Elastic-job: 

通过事件订阅方式可自行实现

作业运行状态监控、监听作业服务器存活、监听近期数据处理成功、数据流类型作业（可通过监听近期数据处理成功数判断作业流量是否正常,如果小于作业正常处理的阀值，可选择报警。）、监听近期数据处理失败（可通过监听近期数据处理失败数判断作业处理结果，如果大于0，可选择报警。）

## Staturn: 

支持，需要自己接口实现在executor(SaturnSystemErrorGroup.java以及AbstractSaturnJob.java的实现)

# 弹性扩容缩容

## xxl-job: 

使用Quartz基于数据库的分布式功能，服务器超出一定数量会给数据库造成一定的压力，一旦有新执行器机器上线或者下线，下次调度时将会重新分配任务；

## Elastic-job: 

通过zk实现各服务的注册、控制及协调，以下是弹性分布的实现：

第一台服务器上线触发主服务器选举。主服务器一旦下线，则重新触发选举，选举过程中阻塞，只有主服务器选举完成，才会执行其他任务。

某作业服务器上线时会自动将服务器信息注册到注册中心，下线时会自动更新服务器状态。

主节点选举，服务器上下线，分片总数变更均更新重新分片标记。

定时任务触发时，如需重新分片，则通过主服务器分片，分片过程中阻塞，分片结束后才可执行任务。如分片过程中主服务器下线，则先选举主服务器，再分片。

通过上一项说明可知，为了维持作业运行时的稳定性，运行过程中只会标记分片状态，不会重新分片。分片仅可能发生在下次任务触发前。

每次分片都会按服务器IP排序，保证分片结果不会产生较大波动。

实现失效转移功能，在某台服务器执行完毕后主动抓取未分配的分片，并且在某台服务器下线后主动寻找可用的服务器执行任务。

## Staturn: 

同上

# 支持并行调度

## xxl-job: 

执行器集群部署时，任务路由策略选择"分片广播"情况下，一次任务调度将会广播触发集群中所有执行器执行一次任务，可根据分片参数处理分片任务

## Elastic-job:: 

采用任务分片方式实现。将一个任务拆分为n个独立的任务项，由分布式的服务器并行执行各自分配到的分片项。

## Staturn: 

采用任务分片方式实现。将一个任务拆分为n个独立的任务项，由分布式的服务器并行执行各自分配到的分片项。

#  高可用策略

## xxl-job: 

调度中心HA

通过DB锁保证集群分布式调度的一致性, 一次任务调度只会触发一次执行；

执行器支持集群部署，提升调度系统可用性，同时提升任务处理能力。

执行器集群部署时，几点要求和建议：

执行器回调地址（xxl.job.admin.addresses）需要保持一致；执行器根据该配置进行执行器自动注册等操作。

同一个执行器集群内AppName（xxl.job.executor.appname）需要保持一致；调度中心根据该配置动态发现不同集群的在线执行器列表

## Elastic-job：

调度器的高可用是通过运行几个指向同一个ZooKeeper集群的Elastic-Job-Cloud-Scheduler实例来实现的。ZooKeeper用于在当前主Elastic-Job-Cloud-Scheduler实例失败的情况下执行领导者选举。通过至少两个调度器实例来构成集群，集群中只有一个调度器实例提供服务，其他实例处于”待命”状态。当该实例失败时，集群会选举剩余实例中的一个来继续提供服务。

## Saturn：

同上


# 失败处理策略

## xxl-job: 

调度失败时的处理策略，策略包括：失败告警（默认）、失败重试；

## Elastic-job：

弹性扩容缩容在下次作业运行前重分片，但本次作业执行的过程中，下线的服务器所分配的作业将不会重新被分配。失效转移功能可以在本次作业运行中用空闲服务器抓取孤儿作业分片执行。同样失效转移功能也会牺牲部分性能。

## Saturn：

支持异常检测和自动失败转移

# 动态分片策略

## xxl-job: 

分片广播任务以执行器为维度进行分片，支持动态扩容执行器集群从而动态增加分片数量，协同进行业务处理；在进行大数据量业务操作时可显著提升任务处理能力和速度。

执行器集群部署时，任务路由策略选择”分片广播”情况下，一次任务调度将会广播触发对应集群中所有执行器执行一次任务，同时传递分片参数；可根据分片参数开发分片任务；

## Elastic-job：

支持多种分片策略，可自定义分片策略

默认包含三种分片策略： 基于平均分配算法的分片策略、 作业名的哈希值奇偶数决定IP升降序算法的分片策略、根据作业名的哈希值对Job实例列表进行轮转的分片策略，支持自定义分片策略

elastic-job的分片是通过zookeeper来实现的。分片的分片由主节点分配，如下三种情况都会触发主节点上的分片算法执行：

a、新的Job实例加入集群

b、现有的Job实例下线（如果下线的是leader节点，那么先选举然后触发分片算法的执行）

c、主节点选举

## Saturn：

同Elastic-job

# DAG(有向无环图)

## xxl-job: 

待支持

支持简单的子任务和任务依赖，不支持完整的DAG任务

## Elastic-job：

不支持

## Saturn：

支持作业编排,作业编排将作业形成一个有向无环图，按照图的顺序依次调用。

# 导航目录

> [导航目录](https://blog.csdn.net/ryo1060732496/article/details/79794802)

# 参考资料

[分布式定时任务调度系统技术解决方案(xxl-job、Elastic-job、Saturn)](https://www.cnblogs.com/rainswinds/p/10930495.html)

* any list
{:toc}