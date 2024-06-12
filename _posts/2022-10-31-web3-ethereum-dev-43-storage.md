---
layout: post 
title: web3 以太坊开发-43-去中心化存储 storage
date: 2022-10-28 21:01:55 +0800
categories: [web3]
tags: [web3, dev, ethereum, sh]
published: true
---

# 去中心化存储

不同于由一个公司或组织控制的中心服务器，分布式存储系统由分别持有全局数据中部分数据的用户操作者组成 P2P 网络，形成了一个具有弹性的文件储存、共享系统。 

这些可以应用于基于区块链的应用程序或任何 P2P 网络中。

以太坊本身可以用作分布式存储系统，所有智能合约的编码储存就是一种分布式存储。 

然而，当涉及大量的数据存储时，就不太符合以太坊的最初目标。 

这一区块链正在稳步增长，在本报告撰写之时，以太坊区块链约为 500GB - 1TB（取决于客户端），而网络上的每个节点都需要存储所有这些数据。 

如果链上数据量继续扩大（例如 5TB），那么将导致所有节点都无法继续运行。 而且，由于燃料费用，将这么多数据部署到主网的费用将非常昂贵。

由于这些制约因素，我们需要使用不同的区块链或方法，以分布式的方式储存大量数据。

在查看去中心化存储选项时，用户必须牢记几件事情。

- 持久性机制/激励结构

- 数据保留执行

- 去中心化

- 共识

# 持久性机制/激励结构

## 基于区块链

为了使某个数据永久保存，我们需要使用一种持久性机制。 

例如，在以太坊中，持久性机制是当运行一个节点时，需要考虑整条链的情况。 

新建的数据持续不断地堆积到链的末端，并且要求每个节点复制所有新加入的数据。

这被称为基于区块链的持久性机制。

区块链的持久性存储机制会出现区块链过大，维护和存储所有数据十分困难的问题（比如许多机构预测整个区块链网络需要 40ZB 的存储容量）。

区块链还必须有某种类型的激励结构。 为获得基于区块链的持久性，需要向验证者付款。 数据被添加到链上后，向验证者付款以继续添加数据。

基于区块链持久性的平台：

以太坊

[Arweave](https://www.arweave.org/)

## 基于合约

我们能直观地感受到，基于合约的持久性使得数据不能被每个节点复制并永久存储，而必须根据合约协议进行维护。 

这些是与多个节点达成的协议，这些节点承诺在一段时间内保存一份数据。 

每当费用耗尽或数据更新时，就必须向这些节点续费，以保持数据的持续性。

在大多数情况下，不是在链上储存所有数据，而是在链上存储定位数据的哈希值。 

这样，整条链不需要扩大规模，就能保存所有数据。

基于合约持久性的平台：

[Filecoin](https://docs.filecoin.io/about-filecoin/what-is-filecoin/)

[Skynet](https://siasky.net/)

[Storj](https://storj.io/)

[0Chain](https://0chain.net/)

## 其他注意事项

星际文件系统是一个储存和访问文件、网站、应用程序和数据的分布式系统。 

虽然它没有内置激励计划，但可以与上述任何基于合同的激励解决方案一起使用，以获得更长期的持久性。 

另一个将数据持久存储在星际文件系统上的办法是与某项固定服务（表示将您的数据固定在某处）一起使用。 

您甚至可以运行自己的星际文件系统节点来为该网络做出贡献，从而将您和/或他人的数据免费持久地存储在星际文件系统上。

[星际文件系统](https://docs.ipfs.io/concepts/what-is-ipfs/)

[Pinata（星际文件系统固定服务）](https://www.pinata.cloud/)

[web3.storage（星际文件系统/菲乐币固定服务）](https://web3.storage/)

[Infura（星际文件系统固定服务）](https://infura.io/product/ipfs)

# 数据留存

为了保留数据，系统必须有某种机制，以确保数据得到保留。

## 质疑机制

确保保留数据的一个最常见方法是使用向节点发出的某种类型的密码质询，以确保它们仍然持有数据。 

一种简单的方法是查看 Arweave 的访问证明。 

他们向节点发出质疑，以查看它们是否在最近的区块和过去的随机区块中都具有数据。 

如果节点无法给出答案，则会受到惩罚。

具有质疑机制的去中心化存储类型：

- 0Chain

- Skynet

- Arweave

- Filecoin

## 去中心化

没有很好的工具来衡量平台的去中心化程度，但一般来说，您可能想使用那些没有某种形式的 KYC 的工具证明它们实际上是去中心化的。

不使用 KYC 的去中心化工具：

- 0Chain（实现非 KYC 版本）

- Skynet

- Arweave

- Filecoin

- 星际文件系统

- 以太坊

## 共识

这些工具大多有自己的 共识机制 版本，但一般都是基于工作量证明（PoW） 或者权益证明（PoS）。

基于工作量证明：

- Skynet

- Arweave

基于权益证明：

- 以太坊

- Filecoin

- 0Chain

# 相关工具

[IPFS - 即星际文件系统，是以太坊的去中心化存储和文件引用系统。](https://ipfs.io/)

[Storj DCS - 安全、私有、与 S3 兼容的去中心化云对象存储，供开发者使用。](https://storj.io/)

[Skynet - Skynet 是一条去中心化 PoW 链，专用于去中心化网络。](https://siasky.net/)

[Filecoin - Filecoin 是由星际文件系统背后的同一团队打造。 它是星际文件系统之上的一个激励层。](https://filecoin.io/)

[Arweave - Arweave 是去中心化数据存储平台。](https://www.arweave.org/)

[0chain - 0Chain 是一个具有区块分片和 blobbers 的基于权益证明的去中心化存储平台。](https://0chain.net/)

[Swarm - 以太坊 web3 堆栈的分布式存储平台和内容分发服务。](https://www.ethswarm.org/)

[OrbitDB - 基于星际文件系统的去中心化点对点数据库。](https://orbitdb.org/)

[Aleph.im - 去中心化云项目（数据库、文件存储、计算和 DID）。 独特的链下和链上点对点技术融合。 星际文件系统以及多链兼容性。](https://aleph.im/)

[Ceramic - 用户控制的星际文件系统数据库存储，用于数据丰富和吸引人的应用程序。](https://ceramic.network/)

[Filebase - 第一个兼容 S3 的对象存储平台，允许您跨多个去中心化存储网络存储数据，包括星际文件系统、Sia、Skynet 和 Storj。](https://filebase.com/)

# 参考资料

https://ethereum.org/zh/developers/docs/storage/

* any list
{:toc}