---
layout: post
title: 保证登录安全-05-风控规则
date: 2022-02-18 21:01:55 +0800 
categories: [Safe]
tags: [safe, web, in-action, sh]
published: true
---

# 必须性

比如银行卡密码，移动手机的开机密码。

因为位数比较少，所以肯定需要添加对应的次数限制。

# 惩罚

一般账户登录，会限制连续错误 3 次之后，禁止登录。

或者登录方式升级，比如图片验证码+短信验证码等等。

如果继续错误，则会冻结账户，避免账户收到暴力攻击。

## 恶意账户

如果惩罚只是封禁被登录的账户，显然这是有问题的。

我们发现一个 ip 多次调用登录接口，很可能这个 ip 在进行攻击，应该封禁此 ip。

如果要给恶意账户，不断切换 IP，让很多用户陷入账户冻结怎么办呢？

## 自助解冻

一般冻结规则，会在 3 天之后才能操作之类，或者允许用户申述，比如去银行柜台办理。

但是这对用户显然是不合理的，过于麻烦。

所以应该允许用户自助解冻。

# 风控规则

登陆次数限制

冻结账户权限

# 登录信息通知

# 异地登陆警告

# 动态验证码





# 小结

每一家公司都有保护用户隐私安全的义务，只可惜现实中很多用户的隐私安全依然无法保证。

对于一个国家，需要推行相应的法律合规。

对于一家公司，需要架构，安全部门，产研测的共同努力。

对于一位用户，我们也要有保护自己信息安全的意识。

希望本文对你有所帮助，如果喜欢，欢迎点赞收藏转发一波。

我是老马，期待与你的下次重逢。

# 参考资料

无

* any list
{:toc}