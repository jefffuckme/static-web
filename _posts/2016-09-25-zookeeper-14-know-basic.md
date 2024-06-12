---
layout: post
title: ZooKeeper-14-了解 ZooKeeper 基础知识
date:  2016-09-25 12:21:05 +0800
categories: [Apache]
tags: [zookeeper, config-center]
published: true
---

# 了解ZooKeeper

前⼀章从较⾼的层⾯讨论了分布式应⽤的需求，同时也讨论了在协作⽅⾯的共性需求。

我们以实际应⽤中使⽤很⼴泛的主-从架构（master-worker）为例⼦，从中摘取了⼀些常⽤原语。本章将开始讨论ZooKeeper，看⼀看这个服务如何实现这些协作⽅⾯的原语。

# ZooKeeper基础

很多⽤于协作的原语常常在很多应⽤之间共享，因此，设计⼀个⽤于协作需求的服务的⽅法往往是提供原语列表，暴露出每个原语的实例化调⽤⽅法，并直接控制这些实例。⽐如，我们可以说分布式锁机制组成了⼀个重要的原语，同时暴露出创建（create）、获取（acquire）和释放（release）三个调⽤⽅法。

这种设计存在⼀些重⼤的缺陷：⾸先，我们要么预先提出⼀份详尽的原语列表，要么提供API的扩展，以便引⼊新的原语；其次，以这种⽅式实现原语的服务使得应⽤丧失了灵活性。

图2-1描述了⼀个znode树的结构，根节点包含4个⼦节点，其中三个⼦节点拥有下⼀级节点，叶⼦节点存储了数据信息。

![输入图片说明](https://images.gitee.com/uploads/images/2021/0313/193455_d02d1b28_508704.png "屏幕截图.png")

针对⼀个znode，没有数据常常表达了重要的信息。

⽐如，在主-从模式的例⼦中，主节点的znode没有数据，表⽰当前还没有选举出主节点。⽽图2-1中涉及的⼀些其他znode节点在主-从模式的配置中⾮常有⽤：

- /workers

节点作为⽗节点，其下每个znode⼦节点保存了系统中⼀个可用从节点信息。如图2-1所示，有⼀个从节点（foot.com：2181）。

- /tasks

节点作为⽗节点，其下每个znode⼦节点保存了所有已经创建并等待从节点执⾏的任务的信息，主-从模式的应用的客户端在/tasks下添加⼀个znode⼦节点，用来表示⼀个新任务，并等待任务状态的znode节点。

- /assign

节点作为⽗节点，其下每个znode⼦节点保存了分配到某个从节点的⼀个任务信息，当主节点为某个从节点分配了⼀个任务，就会在/assign下增加⼀个⼦节点。

## API概述

znode节点可能含有数据，也可能没有。如果⼀个znode节点包含任何数据，那么数据存储为字节数组（byte array）。字节数组的具体格式特定于每个应⽤的实现，ZooKeeper并不直接提供解析的⽀持。我们可以使⽤如Protocol Buffers、Thrift、Avro或MessagePack等序列化（Serialization）包来⽅便地处理保存于znode节点的数据格式，不过有些时候，以UTF-8或ASCII编码的字符串已经够⽤了。

ZooKeeper的API暴露了以下⽅法：

| 方法 | 描述 | 
|:---|:---|
| create/path data | 创建⼀个名为/path的znode节点，并包含数据data。 |
| delete/path | 删除名为/path的znode。 |
| exists/path | 检查是否存在名为/path的节点。 |
| setData/path data | 设置名为/path的znode的数据为data。 |
| getData/path | 返回名为/path节点的数据信息。 |
| getChildren/path | 返回所有/path节点的所有⼦节点列表。 |

需要注意的是，ZooKeeper并不允许局部写⼊或读取znode节点的数据。当设置⼀个znode节点的数据或读取时，znode节点的内容会被整个替换或全部读取进来。

ZooKeeper客户端连接到ZooKeeper服务，通过API调⽤来建⽴会话（session）。如果你对如何使⽤ZooKeeper⾮常感兴趣，请跳转到后⾯的“会话”⼀节，在那⼀节会讲解如何通过命令⾏的⽅式来运⾏ZooKeeper指令。

# znode的不同类型

当新建znode时，还需要指定该节点的类型（mode），不同的类型决定了znode节点的⾏为⽅式。

## 持久节点和临时节点

znode节点可以是持久（persistent）节点，还可以是临时（ephemeral）节点。持久的znode，如/path，只能通过调⽤delete来进⾏删除。临时的znode与之相反，当创建该节点的客户端崩溃或关闭了与ZooKeeper的连接时，这个节点就会被删除。

## 有序节点

⼀个znode还可以设置为有序（sequential）节点。⼀个有序znode节点被分配唯⼀个单调递增的整数。当创建有序节点时，⼀个序号会被追加到路径之后。例如，如果⼀个客户端创建了⼀个有序znode节点，其路径为/tasks/task-，那么ZooKeeper将会分配⼀个序号，如1，并将这个数字追加到路径之后，最后该znode节点为/tasks/task-1。有序znode通过提供了创建具有唯⼀名称的znode的简单⽅式。同时也通过这种⽅式可以直观地查看znode的创建顺序。

# 监视与通知

ZooKeeper通常以远程服务的⽅式被访问，如果每次访问znode时，客户端都需要获得节点中的内容，这样的代价就⾮常⼤。因为这样会导致更⾼的延迟，⽽且ZooKeeper需要做更多的操作。考虑图2-2中的例⼦，第⼆次调⽤getChildren/tasks返回了相同的值，⼀个空的集合，其实是没有必要的。

![输入图片说明](https://images.gitee.com/uploads/images/2021/0313/194429_16e95756_508704.png "屏幕截图.png")

这是⼀个常见的轮询问题。为了替换客户端的轮询，我们选择了基于通知（notification）的机制：客户端向ZooKeeper注册需要接收通知的znode，通过对znode设置监视点（watch）来接收通知。监视点是⼀个单次触发的操作，意即监视点会触发⼀个通知。为了接收多个通知，客户端必须在每次通知后设置⼀个新的监视点。在图2-3阐述的情况下，当节点/tasks发⽣变化时，客户端会收到⼀个通知，并从ZooKeeper读取⼀个新值。

![输入图片说明](https://images.gitee.com/uploads/images/2021/0313/194526_7e421f3e_508704.png "屏幕截图.png")

当使⽤通知机制时，还有⼀些需要知道的事情。因为通知机制是单次触发的操作，所以在客户端接收⼀个znode变更通知并设置新的监视点时，znode节点也许发⽣了新的变化（不要担⼼，你不会错过状态的变化）。让我们看⼀个例⼦来说明它到底是怎么⼯作的。假设事件按以下顺序发⽣：1.客户端c1设置监视点来监控/tasks数据的变化。

通知机制的⼀个重要保障是，对同⼀个znode的操作，先向客户端传送通知，然后再对该节点进⾏变更。

如果客户端对⼀个znode设置了监视点，⽽该znode发⽣了两个连续更新。第⼀次更新后，客户端在观察第⼆次变化前就接收到了通知，然后读取znode中的数据。我们认为主要特性在于通知机制阻⽌了客户端所观察的更新顺序。虽然ZooKeeper的状态变化传播给某些客户端时更慢，但我们保障客户端以全局的顺序来观察ZooKeeper的状态。

ZooKeeper可以定义不同类型的通知，这依赖于设置监视点对应的通知类型。客户端可以设置多种监视点，如监控znode的数据变化、监控znode⼦节点的变化、监控znode的创建或删除。为了设置监视点，可以使⽤任何API中的调⽤来读取ZooKeeper的状态，在调⽤这些API时，传⼊⼀个watcher对象或使⽤默认的watcher。本章后续（主从模式的实现）及第4章会以主从模式的例⼦来展开讨论，我们将深⼊研究如何使⽤该机制。

## 注意：谁来管理我的缓存

如果不让客户端来管理其拥有的ZooKeeper数据的缓存，我们不得不让ZooKeeper来管理这些应用程序的缓存。但是，这样会导致ZooKeeper的设计更加复杂。事实上，如果让ZooKeeper管理缓存失效，可能会导致ZooKeeper在运⾏时，停滞在等待客户端确认⼀个缓存失效的请求上，因为在进⾏所有的写操作前，需要确认所有的缓存数据是否已经失效。

# 版本

每⼀个znode都有⼀个版本号，它随着每次数据变化⽽⾃增。两个API操作可以有条件地执⾏：setData和delete。这两个调⽤以版本号作为转⼊参数，只有当转⼊参数的版本号与服务器上的版本号⼀致时调⽤才会成功。

![输入图片说明](https://images.gitee.com/uploads/images/2021/0313/194841_990af606_508704.png "屏幕截图.png")

# 参考资料

《Zookeeper分布式过程协同技术详解》

* any list
{:toc}