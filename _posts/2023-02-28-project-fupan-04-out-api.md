---
layout: post
title: 项目复盘梳理-04-对外接口+微信审批流
date:  2023-02-13 +0800
categories: [Project]
tags: [in-actions, project, data-migrate, sh]
published: false
---

# 对外接口

类似于微信的开发者平台，一家公司要想做大做强，把自己的业务能力外放出去是必须的。

只有构建出自己强大的生态，才能永远屹立不倒。

# 核心模块

核心功能：

（1）请求类

用户可以主动查询，得到对应的结果。

（2）通知类

当一些事件发生的时候，通知用户。

（3）文件类

比如交易的对账文件。

一般是基于文件的形式，常见的方式有把文件放在对方 SFTP 服务器的。

其实比较好的方式，是让对方通过 appId/appSecret 自己去一个地方取，比如 OSS。

----------------------------------------------------------------------------------------------------------------------------------------

# 权限设计

## 请求类

会首先验证用户的加密策略。

验证通过以后，解密对应的信息，然后处理响应。

返回给用户的时候，也会进行加密。

## 通知类

会把通知给用户的消息进行加密。

-----------------------------------------------

以前是基于安全证书的，证书一般的下载验证流程比较麻烦，经常会有服务商搞不定。

所以在第二次设计改版的时候，推荐使用了 RSA 非对称加密。

公司的公钥可以控台下载，用户的公钥可以配置在控台之上。

这样接入的时候就会更加方便。

# 权限审批流自动化

最初的时候，都是每次销售+外部渠道沟通，然后申请对应的权限，邮件审批，最后开发手动刷库。

这个过程是一个非常麻烦，而且不利于统一管理的事情，大部分的事情都放在了研发这里。

## 流程自动化

得益于微信的强大能力。

公司内部引入了微信的审批流程，将每一个审核节点放在微信审批流中。

## 接口设计

把每一个产品支持的接口，按照接口类别，请求方式，等等配置好。

让用户申请生成一个审批流的单子，全部通过以后，然后将满足对应的接口放开。

其他的流程和以前一样。

# 复盘问题

## k8s 部署问题

自身问题：不熟悉前端的 k8s 部署，配管也不熟悉。第一次接触 k8s

服务问题：k8s 初期，页面存在一些 BUG，文档错误等。

解决方案：参考其他前端的项目，和对应的开发沟通。@黑老师 @杨宇斌

## LDAP 问题

内控需要登录，依赖 LDAP 服务。

问题：LDAP 缺少文档，没有 demo

解决：自己百度，找到用例测试验证。

## 网关配置

问题：k8s 强依赖网关配置，以前的集成环境配置有问题。

解决：和沟通确认网关，重新申请集成网关，并且通知收单的项目负责人。

CORS 跨域问题

问题：前后端分离，存在 CORS 跨域问题

解决：整理了 2 种解决方案，最后统一在网关进行配置。

## 整体收获

应用从立项到上线，共计耗时一周多点，带领新人体验了除 DevOps 阶段的其他全部，应用顺利上线并得到验证。

整个链路中涉及到的人员比较多，沟通相对比较耗时。

# 拓展阅读

[https://github.com/houbb/checksum](https://github.com/houbb/checksum)

* any list
{:toc}