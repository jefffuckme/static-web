---
layout: post
title:  Apache Kafka-00-kafka 概览
date:  2017-8-9 09:32:36 +0800
categories: [Apache]
tags: [apache, kafka, overview, mq]
published: true
---

# 序章

系统完整的学习 kafka，作为后期自己实现 mq 的基准。

参考 kafka 书籍目录，自己实战学习，记录笔记。

（1）官方笔记

（2）实战笔记

（3）系统书籍学习

# 系列笔记

# 参考书籍

《Kafka 入门与实践》

《Kafka 权威指南》

《Apache Kafka 源码剖析》

# Kafka 入门与实践目录

```
　  第1章　Kafka简介 1

　　第2章　Kafka安装配置 11

　　第3章　Kafka核心组件 33

　　第4章　Kafka核心流程分析 111

　　第5章　Kafka基本操作实战 155

　　第6章　Kafka API编程实战 221

　　第7章　Kafka Streams 267

　　第8章　Kafka数据采集应用 287

　　第9章　Kafka与ELK整合应用 303

　　第10章　Kafka与Spark整合应用 323
```

# Kafka 权威指南目录

```
　　序 xiii

　　前言 xv

　　第 1 章　初识Kafka 1

　　1.1　发布与订阅消息系统 1

　　1.1.1　如何开始 2

　　1.1.2　独立的队列系统 3

　　1.2　Kafka登场 4

　　1.2.1　消息和批次 4

　　1.2.2　模式 4

　　1.2.3　主题和分区 5

　　1.2.4　生产者和消费者 5

　　1.2.5　broker和集群 6

　　1.2.6　多集群 7

　　1.3　为什么选择Kafka 8

　　1.3.1　多个生产者 8

　　1.3.2　多个消费者 8

　　1.3.3　基于磁盘的数据存储 9

　　1.3.4　伸缩性 9

　　1.3.5　高性能 9

　　1.4　数据生态系统 9

　　1.5　起源故事 11

　　1.5.1　LinkedIn的问题 11

　　1.5.2　Kafka的诞生 12

　　1.5.3　走向开源 12

　　1.5.4　命名 13

　　1.6　开始Kafka之旅 13

　　第 2 章　安装Kafka 14

　　2.1　要事先行 14

　　2.1.1　选择操作系统 14

　　2.1.2　安装Java 14

　　2.1.3　安装Zookeeper 15

　　2.2　安装Kafka Broker 17

　　2.3　broker配置 18

　　2.3.1　常规配置 18

　　2.3.2　主题的默认配置 19

　　2.4　硬件的选择 23

　　2.4.1　磁盘吞吐量 23

　　2.4.2　磁盘容量 23

　　2.4.3　内存 23

　　2.4.4　网络 24

　　2.4.5　CPU 24

　　2.5　云端的Kafka 24

　　2.6　Kafka集群 24

　　2.6.1　需要多少个broker 25

　　2.6.2　broker 配置 25

　　2.6.3　操作系统调优 26

　　2.7　生产环境的注意事项 28

　　2.7.1　垃圾回收器选项 28

　　2.7.2　数据中心布局 29

　　2.7.3　共享Zookeeper 29

　　2.8　总结 30

　　第 3 章　Kafka生产者——向Kafka写入数据 31

　　3.1　生产者概览 32

　　3.2　创建Kafka生产者 33

　　3.3　发送消息到Kafka 34

　　3.3.1　同步发送消息 35

　　3.3.2　异步发送消息 35

　　3.4　生产者的配置 36

　　3.5　序列化器 39

　　3.5.1　自定义序列化器 39

　　3.5.2　使用Avro序列化 41

　　3.5.3　在Kafka里使用Avro 42

　　3.6　分区 45

　　3.7　旧版的生产者API 46

　　3.8　总结 47

　　第 4 章　Kafka消费者——从Kafka读取数据 48

　　4.1　KafkaConsumer概念 48

　　4.1.1　消费者和消费者群组 48

　　4.1.2　消费者群组和分区再均衡 51

　　4.2　创建Kafka消费者 52

　　4.3　订阅主题 53

　　4.4　轮询 53

　　4.5　消费者的配置 55

　　4.6　提交和偏移量 57

　　4.6.1　自动提交 58

　　4.6.2　提交当前偏移量 59

　　4.6.3　异步提交 59

　　4.6.4　同步和异步组合提交 61

　　4.6.5　提交特定的偏移量 61

　　4.7　再均衡监听器 62

　　4.8　从特定偏移量处开始处理记录 64

　　4.9　如何退出 66

　　4.10　反序列化器 67

　　4.11　独立消费者——为什么以及怎样使用没有群组的消费者 71

　　4.12　旧版的消费者API 71

　　4.13　总结 72

　　第 5 章　深入Kafka 73

　　5.1　集群成员关系 73

　　5.2　控制器 74

　　5.3　复制 74

　　5.4　处理请求 76

　　5.4.1　生产请求 78

　　5.4.2　获取请求 78

　　5.4.3　其他请求 80

　　5.5　物理存储 81

　　5.5.1　分区分配 81

　　5.5.2　文件管理 82

　　5.5.3　文件格式 83

　　5.5.4　索引 84

　　5.5.5　清理 84

　　5.5.6　清理的工作原理 84

　　5.5.7　被删除的事件 86

　　5.5.8　何时会清理主题 86

　　5.9　总结 86

　　第 6 章　可靠的数据传递 87

　　6.1　可靠性保证 87

　　6.2　复制 88

　　6.3　broker配置 89

　　6.3.1　复制系数 89

　　6.3.2　不完全的首领选举 90

　　6.3.3　最少同步副本 91

　　6.4　在可靠的系统里使用生产者 92

　　6.4.1　发送确认 92

　　6.4.2　配置生产者的重试参数 93

　　6.4.3　额外的错误处理 94

　　6.5　在可靠的系统里使用消费者 94

　　6.5.1　消费者的可靠性配置 95

　　6.5.2　显式提交偏移量 95

　　6.6　验证系统可靠性 97

　　6.6.1　配置验证 98

　　6.6.2　应用程序验证 98

　　6.6.3　在生产环境监控可靠性 99

　　6.7　总结 100

　　第 7 章　构建数据管道 101

　　7.1　构建数据管道时需要考虑的问题 102

　　7.1.1　及时性 102

　　7.1.2　可靠性 102

　　7.1.3　高吞吐量和动态吞吐量 103

　　7.1.4　数据格式 103

　　7.1.5　转换 104

　　7.1.6　安全性 104

　　7.1.7　故障处理能力 104

　　7.1.8　耦合性和灵活性 105

　　7.2　如何在Connect API和客户端API之间作出选择 105

　　7.3　Kafka Connect 106

　　7.3.1　运行Connect 106

　　7.3.2　连接器示例——文件数据源和文件数据池 107

　　7.3.3　连接器示例——从MySQL到ElasticSearch 109

　　7.3.4　深入理解Connect 114

　　7.4　Connect之外的选择 116

　　7.4.1　用于其他数据存储的摄入框架 116

　　7.4.2　基于图形界面的ETL工具 117

　　7.4.3　流式处理框架 117

　　7.5　总结 117

　　第 8 章　跨集群数据镜像 118

　　8.1　跨集群镜像的使用场景 118

　　8.2　多集群架构 119

　　8.2.1　跨数据中心通信的一些现实情况 119

　　8.2.2　Hub和Spoke架构 120

　　8.2.3　双活架构 121

　　8.2.4　主备架构 123

　　8.2.5　延展集群 127

　　8.3　Kafka的MirrorMaker 128

　　8.3.1　如何配置 129

　　8.3.2　在生产环境部署MirrorMaker 130

　　8.3.3　MirrorMaker调优 132

　　8.4　其他跨集群镜像方案 134

　　8.4.1　优步的uReplicator 134

　　8.4.2　Confluent的Replicator 135

　　8.5　总结 135

　　第 9 章　管理Kafka 136

　　9.1　主题操作 136

　　9.1.1　创建主题 137

　　9.1.2　增加分区 138

　　9.1.3　删除主题 138

　　9.1.4　列出集群里的所有主题 139

　　9.1.5　列出主题详细信息 139

　　9.2　消费者群组 140

　　9.2.1　列出并描述群组 140

　　9.2.2　删除群组 142

　　9.2.3　偏移量管理 142

　　9.3　动态配置变更 143

　　9.3.1　覆盖主题的默认配置 143

　　9.3.2　覆盖客户端的默认配置 145

　　9.3.3　列出被覆盖的配置 145

　　9.3.4　移除被覆盖的配置 146

　　9.4　分区管理 146

　　9.4.1　首选的首领选举 146

　　9.4.2　修改分区副本 147

　　9.4.3　修改复制系数 150

　　9.4.4　转储日志片段 151

　　9.4.5　副本验证 152

　　9.5　消费和生产 153

　　9.5.1　控制台消费者 153

　　9.5.2　控制台生产者 155

　　9.6　客户端ACL 157

　　9.7　不安全的操作 157

　　9.7.1　移动集群控制器 157

　　9.7.2　取消分区重分配 157

　　9.7.3　移除待删除的主题 158

　　9.7.4　手动删除主题 158

　　9.8　总结 159

　　第 10 章　监控Kafka 160

　　10.1　度量指标基础 160

　　10.1.1　度量指标在哪里 160

　　10.1.2　内部或外部度量 161

　　10.1.3　应用程序健康检测 161

　　10.1.4　度量指标的覆盖面 161

　　10.2　broker的度量指标 162

　　10.2.1　非同步分区 162

　　10.2.2　broker度量指标 166

　　10.2.3　主题和分区的度量指标 173

　　10.2.4　Java虚拟机监控 174

　　10.2.5　操作系统监控 175

　　10.2.6　日志 176

　　10.3　客户端监控 177

　　10.3.1　生产者度量指标 177

　　10.3.2　消费者度量指标 179

　　10.3.3　配额 181

　　10.4　延时监控 182

　　10.5　端到端监控 183

　　10.6　总结 183

　　第 11 章　流式处理 184

　　11.1　什么是流式处理 185

　　11.2　流式处理的一些概念 186

　　11.2.1　时间 187

　　11.2.2　状态 188

　　11.2.3　流和表的二元性 188

　　11.2.4　时间窗口 189

　　11.3　流式处理的设计模式 190

　　11.3.1　单个事件处理 191

　　11.3.2　使用本地状态 191

　　11.3.3　多阶段处理和重分区 193

　　11.3.4　使用外部查找——流和表的连接 193

　　11.3.5　流与流的连接 195

　　11.3.6　乱序的事件 195

　　11.3.7　重新处理 196

　　11.4　Streams示例 197

　　11.4.1　字数统计 197

　　11.4.2　股票市场统计 199

　　11.4.3　填充点击事件流 201

　　11.5　Kafka Streams的架构概览 202

　　11.5.1　构建拓扑 202

　　11.5.2　对拓扑进行伸缩 203

　　11.5.3　从故障中存活下来 205

　　11.6　流式处理使用场景 205

　　11.7　如何选择流式处理框架 206

　　11.8　总结 208

　　附录A　在其他操作系统上安装Kafka 209

　　作者介绍 214

　　封面介绍 214
```


# Apache Kafka 源码剖析目录

Apache Kafka源码剖析以 Kafka 0.10.0 版本源码为基础，针对 Kafka的架构设计到实现细节进行详细阐述。本书共5 章，从 Kafka 的应用场景、源码环境搭建开始逐步深入，对 Kafka 的核心概念进行分析介绍，对 Kafka 生产者、消费者、服务端的源码进行深入的剖析，最后介绍 Kafka 常用的管理脚本实现，让读者不仅从宏观设计上了解 Kafka，而且能够深入到 Kafka 的细节设计之中。在源码分析的过程中，还穿插了笔者工作积累的经验分析和对 Kafka 设计的理解，希望能够让读者可以举一反三，不仅知其然，而且知其所以然。

本书旨在为读者阅读 Kafka 源码提供帮助和指导，让读者更加深入地了解 Kafka 的运行原理、设计理念，让读者在设计分布式系统时可以参考 Kafka 的优秀设计。本书的内容对于读者全面提升自己的技术能力有很大帮助。

```
第1章　快速入门
第2章　生产者
第3章　消费者
第4章　Kafka服务端
第5章　Kafka Tool
```

# 拓展阅读

# 参考文档

https://6so.so/t/497483/

* any list
{:toc}
