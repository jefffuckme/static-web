---
layout: post
title: ZooKeeper-20-内部原理
date:  2016-09-25 12:21:05 +0800
categories: [Apache]
tags: [zookeeper, config-center]
published: true
---

# ZooKeeper内部原理

本章与其他章节不同，本章不会讲解任何关于如何通过ZooKeeper构建⼀个应⽤程序相关的知识，主要是介绍ZooKeeper内部是如何运⾏的，通过从⾼层次介绍其所使⽤的协议，以及ZooKeeper所采⽤的在提供⾼性能的同时还具有容错能⼒的机制。这些内容⾮常重要，通过这些为⼤家提供了⼀个更深度的视⾓来分析为什么程序与ZooKeeper⼀同⼯作时会如此运⾏。如果你打算运⾏ZooKeeper，该视⾓对你会⾮常有⽤，同时本章也是下⼀章的背景知识。

我们在前⼏章中已经了解，ZooKeeper运⾏于⼀个集群环境中，客户端会连接到这些服务器执⾏操作请求，但究竟这些服务器对客户端所发送的请求操作做了哪些⼯作？我们在第2章中已经提到了，我们选择某⼀个服务器，称之为群⾸（leader）。其他服务器追随群⾸，被称为追随者（follower）。群⾸作为中⼼点处理所有对ZooKeeper系统变更的请求，它就像⼀个定序器，建⽴了所有对ZooKeeper状态的更新的顺序，追随者接收群⾸所发出更新操作请求，并对这些请求进⾏处理，以此来保障状态更新操作不会发⽣碰撞。

群⾸和追随者组成了保障状态变化有序的核⼼实体，同时还存在第三类服务器，称为观察者（observer）。观察者不会参与决策哪些请求可被接受的过程，只是观察决策的结果，观察者的设计只是为了系统的可扩展性。

本章中，我们还会介绍我们⽤于实现ZooKeeper集群和服务器与客户端内部通信所使⽤的协议。我们⾸先以客户端的请求和事务的这些常见概念展开讨论，这些概念将贯穿本章后续部分。

# 请求、事务和标识符

ZooKeeper服务器会在本地处理只读请求（exists、getData和getChildren）。假如⼀个服务器接收到客户端的getData请求，服务器读取该状态信息，并将这些信息返回给客户端。因为服务器会在本地处理请求，所以ZooKeeper在处理以只读请求为主要负载时，性能会很⾼。我们还可以增加更多的服务器到ZooKeeper集群中，这样就可以处理更多的读请求，⼤幅提⾼整体处理能⼒。

那些会改变ZooKeeper状态的客户端请求（create、delete和setData）将会被转发给群⾸，群⾸执⾏相应的请求，并形成状态的更新，我们称为事务（transaction）。其中，请求表⽰源⾃于客户端发起的操作，⽽事务则包含了对应请求处理⽽改变ZooKeeper状态所需要执⾏的步骤。我们通过⼀个简单点的例⼦，⽽不是ZooKeeper的操作，来说明这个问题。假如，操作为inc（i），该⽅法对变量i的值进⾏增量操作，如果此时⼀个请求为inc（i），假如i的值为10，该操作执⾏后，其值为11。再回过头看请求和事务的概念，其中inc（i）为请求，⽽事务则为变量i和11（变量i保存了11这个值）。

现在我们再来看看ZooKeeper的例⼦，假如⼀个客户端提交了⼀个对/z节点的setData请求，setData将会改变该znode节点数据信息，并会增加该节点的版本号，因此，对于这个请求的事务包括了两个重要字段：节点中新的数据字段值和该节点新的版本号。当处理该事务时，服务端将会⽤事务中的数据信息来替换/z节点中原来的数据信息，并会⽤事务中的版本号更新该节点，⽽不是增加版本号的值。

⼀个事务为⼀个单位，也就是说所有的变更处理需要以原⼦⽅式执⾏。以setData的操作为例，变更节点的数据信息，但并不改变版本号将会导致错误的发⽣，因此，ZooKeeper集群以事务⽅式运⾏，并确保所有的变更操作以原⼦⽅式被执⾏，同时不会被其他事务所⼲扰。在ZooKeeper中，并不存在传统的关系数据库中所涉及的回滚机制，⽽是确保事务的每⼀步操作都互不⼲扰。在很长的⼀段时间⾥，ZooKeeper所采⽤的设计⽅式为，在每个服务器中启动⼀个单独的线程来处理事务，通过单独的线程来保障事务之间的顺序执⾏互不⼲扰。最近，ZooKeeper增加了多线程的⽀持，以便提⾼事务处理的速度。

同时⼀个事务还具有幂等性，也就是说，我们可以对同⼀个事务执⾏两次，我们得到的结果还是⼀样的，我们甚⾄还可以对多个事务执⾏多次，同样也会得到⼀样的结果，前提是我们确保多个事务的执⾏顺序每次都是⼀样的。事务的幂等性可以让我们在进⾏恢复处理时更加简单。

当群⾸产⽣了⼀个事务，就会为该事务分配⼀个标识符，我们称之为ZooKeeper会话ID（zxid），通过Zxid对事务进⾏标识，就可以按照群⾸所指定的顺序在各个服务器中按序执⾏。服务器之间在进⾏新的群⾸选举时也会交换zxid信息，这样就可以知道哪个⽆故障服务器接收了更多的事务，并可以同步他们之间的状态信息。

zxid为⼀个long型（64位）整数，分为两部分：时间戳（epoch）部分和计数器（counter）部分。每个部分为32位，在我们讨论zab协议时，我们就会发现时间戳（epoch）和计数器（counter）的具体作⽤，我们通过该协议来⼴播各个服务器的状态变更信息。

# 群⾸选举

群⾸为集群中的服务器选择出来的⼀个服务器，并会⼀直被集群所认可。设置群⾸的⽬的是为了对客户端所发起的ZooKeeper状态变更请求进⾏排序，包括：create、setData和delete操作。群⾸将每⼀个请求转换为⼀个事务，如前⼀节中所介绍，将这些事务发送给追随者，确保集群按照群⾸确定的顺序接受并处理这些事务。

为了了解管理权的原理，⼀个服务器必须被仲裁的法定数量的服务器所认可。在第2章中我们已经讨论过，法定数量必须集群数量是能够交错在⼀起，以避免我们所说的脑裂问题（split brain）：即两个集合的服务器分别独⽴的运⾏，形成了两个集群。这种情况将导致整个系统状态的不⼀致性，最终客户端也将根据其连接的服务器⽽获得不同的结果，在2.3.3节我们已经通过具体例⼦说明了这⼀情况。

选举并⽀持⼀个群⾸的集群服务器数量必须⾄少存在⼀个服务器进程的交叉，我们使⽤属于仲裁（quorum）来表⽰这样⼀个进程的⼦集，仲裁模式要求服务器之间两两相交。

- 注意：进展

⼀组服务器达到仲裁法定数量是必需条件，如果⾜够多的服务器永久性地退出，⽆法达到仲裁法定数量，ZooKeeper也就⽆法取得进展。即使服务器退出后再次启动也可以，但必须保证仲裁的法定数量的服务器最终运⾏起来。我们先不讨论这个问题，⽽在下⼀章中再讨论重新配置集群，重新配置可以随时间⽽改变仲裁法定数量。

每个服务器启动后进⼊LOOKING状态，开始选举⼀个新的群⾸或查找已经存在的群⾸，如果群⾸已经存在，其他服务器就会通知这个新启动的服务器，告知哪个服务器是群⾸，与此同时，新的服务器会与群⾸建⽴连接，以确保⾃⼰的状态与群⾸⼀致。

如果集群中所有的服务器均处于LOOKING状态，这些服务器之间就会进⾏通信来选举⼀个群⾸，通过信息交换对群⾸选举达成共识的选择。

对于群⾸选举的消息，我们称之为群⾸选举通知消息（leader electionnotifications），或简单地称为通知（notifications）。该协议⾮常简单，当⼀个服务器进⼊LOOKING状态，就会发送向集群中每个服务器发送⼀个通知消息，该消息中包括该服务器的投票（vote）信息，投票中包含服务器标识符（sid）和最近执⾏的事务的zxid信息，⽐如，⼀个服务器所发送的投票信息为（1，5），表⽰该服务器的sid为1，最近执⾏的事务的zxid为5（出于群⾸选举的⽬的，zxid只有⼀个数字，⽽在其他协议中，zxid则有时间戳epoch和计数器组成）。

当⼀个服务器收到⼀个投票信息，该服务器将会根据以下规则修改⾃⼰的投票信息：

1.将接收的voteId和voteZxid作为⼀个标识符，并获取接收⽅当前的投票中的zxid，⽤myZxid和mySid表⽰接收⽅服务器⾃⼰的值。

2.如果（voteZxid>myZxid）或者（voteZxid=myZxid且voteId>mySid），保留当前的投票信息。

3.否则，修改⾃⼰的投票信息，将voteZxid赋值给myZxid，将voteId赋值给mySid。

简⽽⾔之，只有最新的服务器将赢得选举，因为其拥有最近⼀次的zxid。我们稍后会看到，这样做将会简化群⾸崩溃后重新仲裁的流程。如果多个服务器拥有最新的zxid值，其中的sid值最⼤的将赢得选举。

当⼀个服务器接收到仲裁数量的服务器发来的投票都⼀样时，就表⽰群⾸选举成功，如果被选举的群⾸为某个服务器⾃⼰，该服务器将会开始⾏使群⾸⾓⾊，否则就成为⼀个追随者并尝试连接被选举的群⾸服务器。

- 注意：查找群⾸

在ZooKeeper中对应的实现选举的Java类为QuorumPeer，其中的run⽅法实现了服务器的主要⼯作循环。当进⼊LOOKING状态，将会执⾏lookForLeader⽅法来进⾏群首的选举，该⽅法主要执⾏我们刚刚所讨论的协议，该⽅法返回前，在该⽅法中会将服务器状态设置为LEADING状态或FOLLOWING状态，当然还可能为OBSERVING状态，我们稍后讨论这个状态。如果服务器成为群首，就会创建⼀个Leader对象并运⾏这个对象，如果服务器为追随者，就会创建⼀个Follower对象并运⾏。

- 图9-1：群首选举过程的示例

![输入图片说明](https://images.gitee.com/uploads/images/2021/0321/105911_76d22db7_508704.png "屏幕截图.png")

并不是所有执⾏过程都如图9-1中所⽰，在图9-2中，我们展⽰了另⼀种情况的例⼦。服务器s2做出了错误判断，选举了另⼀个服务器s3⽽不是服务器s1，虽然s1的zxid值更⾼，但在从服务器s1向服务器s2传送消息时发⽣了⽹络故障导致长时间延迟，与此同时，服务器s2选择了服务器s3作为群⾸，最终，服务器s1和服务器s3组成了仲裁数量（quorum），并将忽略服务器s2。

- 图9-2：消息交错导致⼀个服务器选择了另⼀个群首

![输入图片说明](https://images.gitee.com/uploads/images/2021/0321/110110_1f5f9d7f_508704.png "屏幕截图.png")

虽然服务器s2选择了另⼀个群⾸，但并未导致整个服务发⽣错误，因为服务器s3并不会以群⾸⾓⾊响应服务器s2的请求，最终服务器s2将会在等待被选择的群⾸s3的响应时⽽超时，并开始再次重试。再次尝试，意味着在这段时间内，服务器s2⽆法处理任何客户端的请求，这样做并不可取。

从这个例⼦，我们发现，如果让服务器s2在进⾏群⾸选举时多等待⼀会，它就能做出正确的判断。我们通过图9-3展⽰这种情况，我们很难确定服务器需要等待多长时间，在现在的实现中，默认的群⾸选举的实现类为FastLeaderElection，其中使⽤固定值200ms（常量finalizeWait），这个值⽐在当今数据中⼼所预计的长消息延迟（不到1毫秒到⼏毫秒的时间）要长得多，但与恢复时间相⽐还不够长。万⼀此类延迟（或任何其他延迟）时间并不是很长，⼀个或多个服务器最终将错误选举⼀个群⾸，从⽽导致该群⾸没有⾜够的追随者，那么服务器将不得不再次进⾏群⾸选举。错误地选举⼀个群⾸可能会导致整个恢复时间更长，因为服务器将会进⾏连接以及不必要的同步操作，并需要发送更多消息来进⾏另⼀轮的群⾸选举。

- 注意：快速群⾸选举的快速指的是什么？

如果你想知道为什么我们称当前默认的群首选举算法为快速算法，这个问题有历史原因。最初的群首选举算法的实现采用基于拉取式的模型，⼀个服务器拉取投票值的间隔⼤概为1秒，该⽅法增加了恢复的延迟时间，相比较现在的实现⽅式，我们可以更加快速地进⾏群首选举。

![输入图片说明](https://images.gitee.com/uploads/images/2021/0321/110401_d8ed1793_508704.png "屏幕截图.png")

- 图9-3：群首选举时的长延迟

如果想实现⼀个新的群⾸选举的算法，我们需要实现⼀个quorum包中的Election接⼜。为了可以让⽤户⾃⼰选择群⾸选举的实现，代码中使⽤了简单的整数标识符（请查看代码中QuorumPeer.createElectionAlgorithm（）），另外两种可选的实现⽅式为LeaderElection类和AuthFastLeaderElection类，但在版本3.4.0中，这些类已经标记为弃⽤状态，因此，在未来的发布版本中，你可能不会再看到这些类。

# Zab：状态更新的⼴播协议

在接收到⼀个写请求操作后，追随者会将请求转发给群⾸，群⾸将探索性地执⾏该请求，并将执⾏结果以事务的⽅式对状态更新进⾏⼴播。⼀个事务中包含服务器需要执⾏变更的确切操作，当事务提交时，服务器就会将这些变更反馈到数据树上，其中数据树为ZooKeeper⽤于保存状态信息的数据结构（请参考DataTree类）。

之后我们需要⾯对的问题便是服务器如何确认⼀个事务是否已经提交，由此引⼊了我们所采⽤的协议：Zab：ZooKeeper原⼦⼴播协议（ZooKeeper Atomic Broadcast protocol）。假设现在我们有⼀个活动的群⾸服务器，并拥有仲裁数量的追随者⽀持该群⾸的管理权，通过该协议提交⼀个事务⾮常简单，类似于⼀个两阶段提交。

1.群⾸向所有追随者发送⼀个PROPOSAL消息p。

2.当⼀个追随者接收到消息p后，会响应群⾸⼀个ACK消息，通知群⾸其已接受该提案（proposal）。

3.当收到仲裁数量的服务器发送的确认消息后（该仲裁数包括群⾸⾃⼰），群⾸就会发送消息通知追随者进⾏提交（COMMIT）操作。

图9-4说明了这⼀个过程的具体步骤顺序，我们假设群⾸通过隐式⽅式给⾃⼰发送消息。

- 图9-4：提交提案的常规消息模式

![输入图片说明](https://images.gitee.com/uploads/images/2021/0321/110859_fe35a574_508704.png "屏幕截图.png")

在应答提案消息之前，追随者还需要执⾏⼀些检查操作。追随者将会检查所发送的提案消息是否属于其所追随的群⾸，并确认群⾸所⼴播的提案消息和提交事务消失的顺序正确。

Zab保障了以下⼏个重要属性：

- 如果群首按顺序⼴播了事务T和事务T，那么每个服务器在提交T？事

务前保证事务T已经提交完成。

- 如果某个服务器按照事务T、事务T的顺序提交事务，所有其他服务

器也必然会在提交事务T前提交事务T。

第⼀个属性保证事务在服务器之间的传送顺序的⼀致，⽽第⼆个竖向地保证服务器不会跳过任何事务。假设事务为状态变更操作，每个状态变更操作又依赖前⼀个状态变更操作的结果，如果跳过事务就会导致结果的不⼀致性，⽽两阶段提交保证了事务的顺序。Zab在仲裁数量服务器中记录了事务，集群中仲裁数量的服务器需要在群⾸提交事务前对事务达成⼀致，⽽且追随者也会在硬盘中记录事务的确认信息。

我们在9.6节将会看到，事务在某些服务器上可能会终结，⽽其他服务器上却不会，因为在写⼊事务到存储中时，服务器也可能发⽣崩溃。⽆论何时，只要仲裁条件达成并选举了⼀个新的群⾸，ZooKeeper都可以将所有服务器的状态更新到最新。

但是，ZooKeeper⾃始⾄终并不总是有⼀个活动的群⾸，因为群⾸服务器也可能崩溃，或短时间地失去连接，此时，其他服务器需要选举⼀个新的群⾸以保证系统整体仍然可⽤。其中时间戳（epoch）的概念代表了管理权随时间的变化情况，⼀个时间戳表⽰了某个服务器⾏使管理权的这段时间，在⼀个时间戳内，群⾸会⼴播提案消息，并根据计数器（counter）识别每⼀个消息。我们知道zxid的第⼀个元素为时间戳信息，因此每个zxid可以很容易地与事务被创建时间戳相关联。

时间戳的值在每次新群⾸选举发⽣的时候便会增加。同⼀个服务器成为群⾸后可能持有不同的时间戳信息，但从协议的⾓度出发，⼀个服务器⾏使管理权时，如果持有不同的时间戳，该服务器就会被认为是不同的群⾸。如果服务器s成为群⾸并且持有的时间戳为4，⽽当前已经建⽴的群⾸的时间戳为6，集群中的追随者会追随时间戳为6的群⾸s，处理群⾸在时间戳6之后的消息。当然，追随者在恢复阶段也会接收时间戳4到时间戳6之间的提案消息，之后才会开始处理时间戳为6之后的消息，⽽实际上这些提案消息是以时间戳6的消息来发送的。

在仲裁模式下，记录已接收的提案消息⾮常关键，这样可以确保所有的服务器最终提交了被某个或多个服务已经提交完成的事务，即使群⾸在此时发⽣了故障。完美检测群⾸（或任何服务器）是否发⽣故障是⾮常困难的，虽然不是不可能，但在很多设置的情况下，都可能发⽣对⼀个群⾸是否发⽣故障的错误判断。

实现这个⼴播协议所遇到最多的困难在于群⾸并发存在情况的出现，这种情况并不⼀定是脑裂场景。多个并发的群⾸可能会导致服务器提交事务的顺序发⽣错误，或者直接跳过了某些事务。为了阻⽌系统中同时出现两个服务器⾃认为⾃⼰是群⾸的情况是⾮常困难的，时间问题或消息丢失都可能导致这种情况，因此⼴播协议并不能基于以上假设。为了解决这个问题，Zab协议提供了以下保障：

- ⼀个被选举的群首确保在提交完所有之前的时间戳内需要提交的事

务，之后才开始⼴播新的事务。

- 在任何时间点，都不会出现两个被仲裁支持的群首。

为了实现第⼀个需求，群⾸并不会马上处于活动状态，直到确保仲裁数量的服务器认可这个群⾸新的时间戳值。⼀个时间戳的最初状态必须包含所有的之前已经提交的事务，或者某些已经被其他服务器接受，但尚未提交完成的事务。这⼀点⾮常重要，在群⾸进⾏时间戳e的任何新的提案前，必须保证⾃时间戳开始值到时间戳e－1内的所有提案被提交。如果⼀个提案消息处于时间戳 `e'< e`，在群⾸处理时间戳e的第⼀个提案消息前没有提交之前的这个提案，那么旧的提案将永远不会被提交。

对于第⼆个需求有些棘⼿，因为我们并不能完全阻⽌两个群⾸独⽴地运⾏。假如⼀个群⾸l管理并⼴播事务，在此时，仲裁数量的服务器Q判断群⾸l已经退出，并开始选举了⼀个新的群⾸l'，我们假设在仲裁机构Q放弃群⾸l时有⼀个事务T正在⼴播，⽽且仲裁机构Q的⼀个严格的⼦集记录了这个事务T，在群⾸l'被选举完成后，在仲裁机构Q之外服务器也记录了这个事务T，为事务T形成⼀个仲裁数量，在这种情况下，事务T在群⾸l'被选举后会进⾏提交。不⽤担⼼这种情况，这并不是个bug，Zab协议保证T作为事务的⼀部分被群⾸l'提交，确保群⾸l'的仲裁数量的⽀持者中⾄少有⼀个追随者确认了该事务T，其中的关键点在于群⾸l'和l在同⼀时刻并未获得⾜够的仲裁数量的⽀持者。

图9-5说明了这⼀场景，在图中，群⾸l为服务器s5，l'为服务器s3，仲裁机构由s1到s3组成，事务T的zxid为（1，1）。在收到第⼆个确认消息之后，服务器s5成功向服务器s4发送了提交消息来通知提交事务。其他服务器因追随服务器s3忽略了服务器s5的消息，注意服务器s3所了解的xzid为（1，1），因此它知道获得管理权后的事务点。

- 图9-5：群首发⽣重叠的情况

![输入图片说明](https://images.gitee.com/uploads/images/2021/0321/111548_41b4d7f3_508704.png "屏幕截图.png")

之前我们提到Zab保证新群⾸l'不会缺失（1，1），现在我们来看看其中的细节。在新群⾸l'⽣效前，它必须学习旧的仲裁数量服务器之前接受的所有提议，并且保证这些服务器不会继续接受来⾃旧群⾸的提议。此时，如果群⾸l还能继续提交提议，⽐如（1，1），这条提议必须已经被⼀个以上的认可了新群⾸的仲裁数量服务器所接受。我们知道仲裁数量必须在⼀台以上的服务器之上有所重叠，这样群⾸l'⽤来提交的仲裁数量和新群⾸l使⽤的仲裁数量必定在⼀台以上的服务器上是⼀致的。因此，l'将（1，1）加⼊⾃⾝的状态并传播给其跟随者。

在群⾸选举时，我们选择zxid最⼤的服务器作为群⾸。这使得ZooKeeper不需要将提议从追随者传到群⾸，⽽只需要将状态从群⾸传播到追随者。假设有⼀个追随者接受了⼀条群⾸没有接受的提议。群⾸必须确保在和其他追随者同步之前已经收到并接受了这条提议。但是，如果我们选择zxid最⼤的服务器，我们将可以完完全全跳过这⼀步，可以直接发送更新到追随者。

在时间戳发⽣转换时，Zookeeper使⽤两种不同的⽅式来更新追随者来优化这个过程。如果追随者滞后于群⾸不多，群⾸只需要发送缺失的事务点。因为追随者按照严格的顺序接收事务点，这些缺失的事务点永远是最近的。这种更新在代码中被称之为DIFF。如果追随者滞后很久，ZooKeeper将发送在代码中被称为SNAP的完整快照。因为发送完整的快照会增⼤系统恢复的延时，发送缺失的事务点是更优的选择。可是当追随者滞后太远的情况下，我们只能选择发送完整快照。

群⾸发送给追随者的DIFF对应于已经存在于事务⽇志中的提议，⽽SNAP对应于群⾸拥有的最新有效快照。我们将稍后在本章中讨论这两种保存在磁盘上的⽂件。

- 注意：深⼊代码

这里我们给出⼀点代码指导。⼤部分Zab的代码存在于Leader、LearnerHandler和Follower。Leader和LearnerHandler的实例由群首服务器执⾏，⽽Follower的实例由追随者执⾏。Leader.lead和Follower.followLeader是两个重要的⽅法，他们在服务器在QuorumPeer中从LOOKING转换到LEADING或者FOLLOWING时得到调用。

如果你对DIFF和SNAP的区别感兴趣，可以查看LearnerHandler.run的代码，其中包含了使用DIFF时如何决定发送哪条提议，以及关于如何持久化和发送快照的细节。

# 观察者

⾄此，我们已经介绍了群⾸和追随者。还有⼀类我们没有介绍的服务器：观察者。观察者和追随者之间有⼀些共同点。具体说来，他们提交来⾃群⾸的提议。不同于追随者的是，观察者不参与我们之前介绍过的选举过程。他们仅仅学习经由INFORM消息提交的提议。由于群⾸将状态变化发送给追随者和观察者，这两种服务器也都被称为学习者。

- 注意：深⼊INFORM消息

因为观察者不参与决定提议接受与否的投票，群首不需要发送提议到观察者，群首发送给追随者的提交消息只包含zxid⽽不包含提议本身。因此，仅仅发送提交消息给观察者并不能使其实施提议。这是我们使用INFORM消息的原因。INFORM消息本质上是包含了正在被提交的提议信息的提交消息。

简单来说，追随者接受两种消息⽽观察者只接受⼀种消息。追随者从⼀次⼴播中获取提议的内容，并从接下来的⼀条提交消息中获取zxid。相比之下，观察者只获取⼀条包含已提交提议的内容的INFORM消息。

引⼊观察者的⼀个主要原因是提⾼读请求的可扩展性。通过加⼊多个观察者，我们可以在不牺牲写操作的吞吐率的前提下服务更多的读操作。

采⽤观察者的另外⼀个原因是进⾏跨多个数据中⼼的部署。由于数据中⼼之间的⽹络链接延时，将服务器分散于多个数据中⼼将明显地降低系统的速度。引⼊观察者后，更新请求能够先以⾼吞吐率和低延迟的⽅式在⼀个数据中⼼内执⾏，接下来再传播到异地的其他数据中⼼得到执⾏。值得注意的是，观察者并不能消除数据中⼼之间的⽹络消息，因为观察者必须转发更新请求给群⾸并且处理INFORM消息。不同的是，当参与的服务器处于同⼀个数据中⼼时，观察者保证提交更新必需的消息在数据中⼼内部得到交换。

# 服务器的构成

群⾸、追随者和观察者根本上都是服务器。我们在实现服务器时使⽤的主要抽象概念是请求处理器。请求处理器是对处理流⽔线上不同阶段的抽象。每⼀个服务器实现了⼀个请求处理器的序列。我们可以把⼀个处理器想象成添加到请求处理的⼀个元素。⼀条请求经过服务器流⽔线上所有处理器的处理后被称为得到完全处理。

- 注意：请求处理器

ZooKeeper代码里有⼀个叫RequestProcessor的接⼝。这个接⼝的主要⽅法是processRequest，它接受⼀个Request参数。在⼀条请求处理器的流⽔线上，对相邻处理器的请求的处理通常通过队列现实解耦合。当⼀个处理器有⼀条请求需要下⼀个处理器进⾏处理时，它将这条请求加⼊队列。

## 独⽴服务器

Zookeeper中最简单的流⽔线是独⽴服务器（ZeeKeeperServer类）。图9-6描述了此类服务器的流⽔线。它包含三种请求处理器：PrepRequestProcessor、SyncRequestProcessor和FinalRequestProcessor。

- 图9-6：⼀个独立服务器的流⽔线

```
PrepRequestProcessor=》SyncRequestProcessor=》FinalRequestProcessor。
```

PrepRequestProcessor接受客户端的请求并执⾏这个请求，处理结果则是⽣成⼀个事务。我们知道事务是执⾏⼀个操作的结果，该操作会反映到ZooKeeper的数据树上。事务信息将会以头部记录和事务记录的⽅式添加到Request对象中。同时还要注意，只有改变ZooKeeper状态的操作才会产⽣事务，对于读操作并不会产⽣任何事务。因此，对于读请求的Request对象中，事务的成员属性的引⽤值则为null。

下⼀个请求处理器为SyncRequestProcessor。SyncRequestProcessor负责将事务持久化到磁盘上。实际上就是将事务数据按顺序追加到事务⽇志中，并⽣成快照数据。对于硬盘状态的更多细节信息，我们将在本章下⼀节进⾏讨论。

下⼀个处理器也是最后⼀个为FinalRequestProcessor。如果Request对象包含事务数据，该处理器将会接受对ZooKeeper数据树的修改，否则，该处理器会从数据树中读取数据并返回给客户端。

## 群⾸服务器

当我们切换到仲裁模式时，服务器的流⽔线则有⼀些变化，⾸先我们介绍群⾸的操作流⽔线（类LeaderZooKeeper），如图9-7所⽰。

- 图9-7：群首服务器的流⽔线

![输入图片说明](https://images.gitee.com/uploads/images/2021/0321/113705_70bba90a_508704.png "屏幕截图.png")

第⼀个处理器同样是PrepRequestProcessor，⽽之后的处理器则为ProposalRequestProcessor。该处理器会准备⼀个提议，并将该提议发送给跟随者。ProposalRequestProcessor将会把所有请求都转发给CommitRequestProcessor，⽽且，对于写操作请求，还会将请求转发给SyncRequestProcessor处理器。

SyncRequestProcessor处理器所执⾏的操作与独⽴服务器中的⼀样，即持久化事务到磁盘上。执⾏完之后会触发AckRequestProcessor处理器，这个处理器是⼀个简单请求处理器，它仅仅⽣成确认消息并返回给⾃⼰。我们之前曾提到过，在仲裁模式下，群⾸需要收到每个服务器的确认消息，也包括群⾸⾃⼰，⽽AckRequestProcessor处理器就负责这个。

在ProposalRequestProcessor处理器之后的处理器为CommitRequestProcessor。CommitRequestProcessor会将收到⾜够多的确认消息的提议进⾏提交。实际上，确认消息是由Leader类处理的（Leader.processAck（）⽅法），这个⽅法会将提交的请求加⼊到CommitRequestProcessor类中的⼀个队列中。这个队列会由请求处理器线程进⾏处理。

下⼀个处理器也是最后⼀个为FinalRequestProcessor处理器，它的作⽤与独⽴服务器⼀样。FinalRequestProcessor处理更新类型的请求，并执⾏读取请求。在FinalRequestProcessor处理器之前还有⼀个简单的请求处理器，这个处理器会从提议列表中删除那些待接受的提议，这个处理器的名字叫ToBeAppliedRequestProcessor。待接受请求列表包括那些已经被仲裁法定⼈数所确认的请求，并等待被执⾏。群⾸使⽤这个列表与追随者之间进⾏同步，并将收到确认消息的请求加⼊到这个列表中。之后ToBeAppliedRequestProcessor处理器就会在FinalRequestProcessor处理器执⾏后删除这个列表中的元素。

注意，只有更新请求才会加⼊到待接受请求列表中，然后由ToBeAppliedRequest-Processor处理器从该列表移除。

## 追随者和观察者服务器

现在我们来讨论追随者（FollowerRequestProcessor类），图9-8展⽰了⼀个追随者服务器中会⽤到的请求处理器。我们注意到图中并不是⼀个单⼀序列的处理器，⽽且输⼊也有不同形式：客户端请求、提议、提交事务。我们通过箭头来将标识追随者处理的不同路径。

- 图9-8：追随者服务器的流⽔线

![输入图片说明](https://images.gitee.com/uploads/images/2021/0321/113920_32e25dac_508704.png "屏幕截图.png")

我们⾸先从FollowerRequestProcessor处理器开始，该处理器接收并处理客户端请求。FollowerRequestProcessor处理器之后转发请求给CommitRequestProcessor，同时也会转发写请求到群⾸服务器。

当群⾸接收到⼀个新的写请求操作时，直接地或通过其他追随者服务器来⽣成⼀个提议，之后转发到追随者服务器。当收到⼀个提议，追随者服务器会发送这个提议到SyncRequestProcessor处理器，SendRequestProcessor会向群⾸发送确认消息。当群⾸服务器接收到⾜够确认消息来提交这个提议时，群⾸就会发送提交事务消息给追随者（同时也会发送INFORM消息给观察者服务器）。当接收到提交事务消息时，追随者就通过CommitRequestProcessor处理器进⾏处理。

为了保证执⾏的顺序，CommitRequestProcessor处理器会在收到⼀个写请求处理器时暂停后续的请求处理。这就意味着，在⼀个写请求之后接收到的任何读取请求都将被阻塞，直到读取请求转给CommitRequestProcessor处理器。通过等待的⽅式，请求可以被保证按照接收的顺序来被执⾏。

对于观察者服务器的请求流⽔线（ObserverZooKeeperServer类）与追随者服务器的流⽔线⾮常相似。但是因为观察者服务器不需要确认提议消息，因此观察者服务器并不需要发送确认消息给群⾸服务器，也不⽤持久化事务到硬盘。对于观察者服务器是否需要持久化事务到硬盘，以便加速观察者服务器的恢复速度，这样的讨论正在进⾏中，因此对于以后的ZooKeeper版本也会会有这⼀个功能。

# 本地存储

我们之前已经提到过事务⽇志和快照，SyncRequestProcessor处理器就是⽤于在处理提议是写⼊这些⽇志和快照。我们将会在本节详细讨论这些。

## ⽇志和磁盘的使⽤

我们之前说过服务器通过事务⽇志来持久化事务。在接受⼀个提议时，⼀个服务器（追随者或群⾸服务器）就会将提议的事务持久化到事物⽇志中，该事务⽇志保存在服务器的本地磁盘中，⽽事务将会按照顺序追加其后。服务器会时不时地滚动⽇志，即关闭当前⽂件并打开⼀个新的⽂件。

因为写事务⽇志是写请求操作的关键路径，因此ZooKeeper必须有效处理写⽇志问题。⼀般情况下追加⽂件到磁盘都会有效完成，但还有⼀些情况可以使ZooKeeper运⾏的更快，组提交和补⽩。组提交（GroupCommits）是指在⼀次磁盘写⼊时追加多个事务。这将使持久化多个事物只需要⼀次磁道寻址的开销。

关于持久化事务到磁盘，还有⼀个重要说明：现代操作系统通常会缓存脏页（Dirty Page），并将它们异步写⼊磁盘介质。然⽽，我们需要在继续之前，确保事务已经被持久化。因此我们需要冲刷（Flush）事务到磁盘介质。冲刷在这⾥就是指我们告诉操作系统将脏页写⼊磁盘，并在操作完成后返回。因为我们在SyncRequestProcessor处理器中持久化事务，所以这个处理器同时也会负责冲刷。在SyncRequestProcessor处理器中当需要冲刷事务到磁盘时，事实上我们是冲刷的是所有队列中的事务，以实现组提交的优化。如果队列中只有⼀个事务，这个处理器依然会执⾏冲刷。该处理器并不会等待更多的事务进⼊队列，因为这样做会增加执⾏操作的延时。

- 注意：磁盘写缓存

服务器只有在强制将事务写⼊事务日志之后才确认对应的提议。更准确⼀点，服务器调用ZKDatabase的commit⽅法，这个⽅法最终会调用FileChannel.force。这样，服务器保证在确认事务之前已经将它持久化到磁盘中。不过，有⼀个需要注意的地⽅，现代的磁盘⼀般有⼀个缓存用于保存将要写到磁盘的数据。如果写缓存开启，force调用在返回后并不能保证数据已经写⼊介质中。实际上，它可能还在写缓存中。为了保证在FileChannel.force（）⽅法返回后，写⼊的数据已经在介质上，磁盘写缓存必须关闭。不同的操作系统有不同的关闭⽅式。

补⽩（padding）是指在⽂件中预分配磁盘存储块。这样做，对于涉及存储块分配的⽂件系统元数据的更新，就不会显著影响⽂件的顺序写⼊操作。假如需要⾼速向⽇志中追加事务，⽽⽂件中并没有原先分配存储块，那么⽆论何时在写⼊操作到达⽂件的结尾，⽂件系统都需要分配⼀个新存储块。⽽通过补⽩⾄少可以减少两次额外的磁盘寻址开销：⼀次是更新元数据；另⼀次是返回⽂件。

为了避免受到系统中其他写操作的⼲扰，我们强烈推荐你将事务⽇志写⼊到⼀个独⽴磁盘，将第⼆块磁盘⽤于操作系统⽂件和快照⽂件。

## 快照

快照是ZooKeeper数据树的拷贝副本，每⼀个服务器会经常以序列化整个数据树的⽅式来提取快照，并将这个提取的快照保存到⽂件中。服务器在进⾏快照时不需要进⾏协作，也不需要暂停处理请求。因为服务器在进⾏快照时还会继续处理请求，所以当快照完成时，数据树可能又发⽣了变化，我们称这样的快照是模糊的（fuzzy），因为它们不能反映出在任意给点的时间点数据树的准确状态。

举个例⼦说明⼀下。⼀个数据树中只有2个znode节点：/z和/z'。⼀开始，两个znode节点的数据都是1。现在有以下操作步骤：

1.开始⼀个快照。

这个快照包含了/z=1和/z'=2。然⽽，数据树中这两个znode节点在任意的时间点上都不是这个值。这并不是问题，因为服务器会重播（replay）事务。每⼀个快照⽂件都会以快照开始时最后⼀个被提交的事务作为标记（tag），我们将这个时间戳记为TS。如果服务器最后加载快照，它会重播在TS之后的所有事务⽇志中的事务。在这个例⼦中，它们就是T和T。在快照的基础上重放T和T'后，服务器最终得到/z=2和/z'=2，即⼀个合理的状态。

接下来我们还需要考虑⼀个重要的问题，就是再次执⾏事务T'是否会有问题，因为这个事务在开始快照开始之后已经被接受，⽽结果也被快照中保存下来。就像我们之前所说的，事务是幂等的（idempotent），所以即使我们按照相同的顺序再次执⾏相同的事务，也会得到相同的结果，即便其结果已经保存到快照中。

为了理解这个过程，假设重复执⾏⼀个已经被执⾏过的事务。如上例中所描述，⼀个操作设置某个znode节点的数据为⼀个特定的值，这个值并不依赖于任何其他东西，我们⽆条件（unconditionly）地设置/z'的值（setData请求中的版本号为－1），重新执⾏操作成功，但因为我们递增了两次，所以最后我们以错误的版本号结束。如以下⽅式就会导致问题出现，假设有如下3个操作并成功执⾏：

```
setData /z', 2, -1
setData /z', 3, 2
setData /a, 0, -1
```

第⼀个setData操作跟我们之前描述的⼀样，⽽后我们又加上了2个setData操作，以此来展⽰在重放中第⼆个操作因为错误的版本号⽽未能成功的情况。假设这3个操作在提交时被正确执⾏。此时如果服务器加载最新的快照，即该快照已包含第⼀个setData操作。服务器仍然会重放第⼀个setData操作，因为快照被⼀个更早的zxid所标记。因为重新执⾏了第⼀个setData操作。⽽第⼆个setData操作的版本号又与期望不符，那么这个操作将⽆法完成。⽽第三个setData操作可以正常完成，因为它也是⽆条件的。

在加载完快照并重放⽇志后，此时服务器的状态是不正确的，因为它没有包括第⼆个setData请求。这个操作违反了持久性和正确性，以及请求的序列应该是⽆缺⼜（no gap）的属性。

这个重放请求的问题可以通过把事务转换为群⾸服务器所⽣成的statedelta来解决。当群⾸服务器为⼀个请求产⽣事务时，作为事务⽣成的⼀部分，包括了⼀些在这个请求中znode节点或它的数据变化的值（delta值），并指定⼀个特定的版本号。最后重新执⾏⼀个事务就不会导致不⼀致的版本号。

# 服务器与会话

会话（Session）是Zookeeper的⼀个重要的抽象。保证请求有序、临时znode节点、监事点都与会话密切相关。因此会话的跟踪机制对ZooKeeper来说也⾮常重要。

ZooKeeper服务器的⼀个重要任务就是跟踪并维护这些会话。在独⽴模式下，单个服务器会跟踪所有的会话，⽽在仲裁模式下则由群⾸服务器来跟踪和维护。群⾸服务器和独⽴模式的服务器实际上运⾏相同的会话跟踪器（参考SessionTracker类和SessionTrackerImpl类）。⽽追随者服务器仅仅是简单地把客户端连接的会话信息转发给群⾸服务器（参考LearnerSessionTracker类）。

为了保证会话的存活，服务器需要接收会话的⼼跳信息。⼼跳的形式可以是⼀个新的请求或者显式的ping消息（参考LearnerHandler.run（））。两种情况下，服务器通过更新会话的过期时间来触发（touch）会话活跃（参考SessionTrackerImpl.touchSession（）⽅法）。在仲裁模式下，群⾸服务器发送⼀个PING消息给它的追随者们，追随者们返回⾃从最新⼀次PING消息之后的⼀个session列表。群⾸服务器每半个tick（参考10.1.1节的介绍）就会发送⼀个ping消息给追随者们。所以，如果⼀个tick被设置成2秒，那么群⾸服务器就会每⼀秒发送⼀个ping消息。

对于管理会话的过期有两个重要的要点。⼀个称为过期队列（expiryqueue）的数据结构（参考ExpiryQueue类），⽤于维护会话的过期。这个数据结构使⽤bucket来维护会话，每⼀个bucket对应⼀个某时间范围内过期的会话，群⾸服务器每次会让⼀个bucket的会话过期。为了确定哪⼀个bucket的会话过期，如果有的话，当下⼀个底限到来时，⼀个线程会检查这个expiry queue来找出要过期的bucket。这个线程在底限时间到来之前处于睡眠状态，当它被唤醒时，它会取出过期队列的⼀批session，让它们过期。当然取出的这批数据也可能是空的。

为了维护这些bucket，群⾸服务器把时间分成⼀些⽚段，以expirationInterval为单位进⾏分割，并把每个会话分配到它的过期时间对应的bucket⾥，其功能就是有效地计算出⼀个会话的过期时间，以向上取正的⽅式获得具体时间间隔。更具体来说，就是对下⾯的表达式进⾏计算，当会话的过期时间更新时，根据结果来决定它属于哪⼀个bucket。

```
(expirationTime / expirationInterval + 1) * expirationInterval
```

举例说明，⽐如expirationInterval为2，会话的超时时间为10。那么这个会话分配到bucket为12（（10/2+1）*2的结果）。注意当我们触发（touch）这个会话时expirationTime会增加，所以随后我们需要根据之后的计算会话移动到其他的bucket中。

使⽤bucket的模式来管理的⼀个主要原因是为了减少让会话过期这项⼯作的系统开销。在⼀个ZooKeeper的部署环境中，可能其客户端就有数千个，因此也就有数千个会话。在这种场景下要细粒度地检查会话过期是不合适的。如果expirationInterval短的话，那么ZooKeeper就会以这种细粒度的⽅式完成检查。⽬前expirationInterval是⼀个tick，通常以秒为单位。

# 服务器与监视点

监视点（参考2.1.3节）是由读取操作所设置的⼀次性触发器，每个监视点由⼀个特定操作来触发。为了在服务端管理监视点，ZooKeeper的服务端实现了监视点管理器（watch manager）。⼀个WatchManager类的实例负责管理当前已被注册的监视点列表，并负责触发它们。所有类型的服务器（包括独⽴服务器，群⾸服务器，追随者服务器和观察者服务器）都使⽤同样的⽅式处理监视点。

DataTree类中持有⼀个监视点管理器来负责⼦节点监控和数据的监控，对于这两类监控，请参考4.2节，当处理⼀个设置监视点的读请求时，该类就会把这个监视点加⼊manager的监视点列表。类似的，当处理⼀个事务时，该类也会查找是否需要触发相应的监视点。如果发现有监视点需要触发，该类就会调⽤manager的触发⽅法。添加⼀个监视点和触发⼀个监视点都会以⼀个read请求或者FinalRequestProcessor类的⼀个事务开始。

监视点只会保存在内存，⽽不会持久化到硬盘。当客户端与服务端的连接断开时，它的所有监视点会从内存中清除。因为客户端库也会维护⼀份监视点的数据，在重连之后监视点数据会再次被同步到服务端。

# 客户端

在客户端库中有2个主要的类：ZooKeeper和ClientCnxn。ZooKeeper类实现了⼤部分API，写客户端应⽤程序时必须实例化这个类来建⽴⼀个会话。⼀旦建⽴起⼀个会话，ZooKeeper就会使⽤⼀个会话标识符来关联这个会话。这个会话标识符实际上是由服务端所⽣成的（参考SessionTrackerImpl类）。

ClientCnxn类管理连接到server的Socket连接。该类维护了⼀个可连接的ZooKeeper的服务器列表，并当连接断掉的时候⽆缝地切换到其他的服务器。当重连到⼀个其他的服务器时会使⽤同⼀个会话（如果没有过期的话），客户端也会重置所有的监视点到刚连接的服务器上（参考ClientCnxn.SendThread.primeConnection（））。重置默认是开启的，可以通过设置disableAutoWatchReset来禁⽤。

# 序列化

对于⽹络传输和磁盘保存的序列化消息和事务，ZooKeeper使⽤了Hadoop中的Jute来做序列化。如今，该库以独⽴包的⽅式被引⼊，在ZooKeeper代码库中，org.apache.jute就是Jute库（ZooKeeper的开发团队早就讨论过要替换Jude，但⾄今没找到合适的⽅案，它⼯作得很好，还没有必要替换它）。

对于Jute最主要的定义⽂件为zookeeper.jute。它包含了所有的消息定义和⽂件记录。下⾯是⼀个Jute定义的例⼦：

```
module org.apache.zookeeper.txn {
...
class CreateTxn {
ustring path;
buffer data;
vector<org.apache.zookeeper.data.ACL> acl;
boolean ephemeral;
int parentCVersion;
}
...
}
```

这个例⼦定义模块，该模块包括⼀个create事务的定义。同时。这个模块映射到了⼀个ZooKeeper的包中。

# ⼩结

本章讨论了ZooKeeper核⼼机制问题。群⾸竞选机制是可⽤性的关键因素，没有这个机制，ZooKeeper套件将⽆法保持可靠性。拥有群⾸是必要但⾮充分条件，ZooKeeper还需要Zab协议来传播状态的更新等，即使某些服务器可能发⽣崩溃，也能保证状态的⼀致性。

我们又回顾了多种服务器类型：独⽴服务器、群⾸服务器、追随者服务器和观察者服务器。这些服务器之间因运转的机制及执⾏的协议的不同⽽不同。在不同的部署场景中，各个服务器可以发挥不同的作⽤，⽐如增加观察者服务器可以提供更⾼的读吞吐量，⽽且还不会影响写吞吐量。不过，增加观察者服务器并不会增加整个系统的⾼可⽤性。

在ZooKeeper内部，我们实现了⼀系列机制和数据结构。我们在本章中专注于会话与监视点的实现，这个也是在实现ZooKeeper应⽤时所涉及的重要概念。

虽然我们在本章中提供了代码的相关线索，但我们并没有提供源代码的详尽视图。我们强烈建议读者⾃⾏下载⼀份源代码，以本章所提供的线索为开端，独⽴分析和思考。

# 参考资料

《Zookeeper分布式过程协同技术详解》

* any list
{:toc}