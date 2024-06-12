---
layout: post
title: 数据分析-24-解决问题之明确定义问题
date:  2020-6-3 13:34:28 +0800
categories: [Data]
tags: [data, data-analysis, monitor, apm, sh]
published: true
---

# 定义问题

![定义问题](https://pic2.zhimg.com/v2-c95205890f116086b3ebe0f8ec2bf0cb_1440w.jpg?source=172ae18b)

因为最近接触思维导图的缘故开始进入了用结构化思维打开问题的新阶段。

整个分析流程分为：明确问题、获取数据、处理数据、分析数据、输出结论。

把已有的技能整个到这五个板块中。

这样就可以根据问题状态来定位阶段，再采用对应阶段的工具就好了。

也就是说，努力的方向就从一个模糊的大方向细化到了五个相对具体的小方向。

今天的学习聚焦在明确问题这一板块。

# 小例子

先举一些完整的例子，然后从里边切出第一板块：

小孩子因为饿了想吃饼干而大哭，这并不是因为孩子没有吃到饼干，而是因为孩子饿了。这种情况下，即使手头没有饼干，只要有能让孩子吃下去充饥的东西，就可以止住哭声，而不是到处去找饼干。

一个人总迟到并不是因为闹钟的唤醒效果很差，而是因为他没吃早餐。因为他没吃早餐，导致他中午吃的很多，接着晚饭就吃的很晚，然后因为消化的缘故导致他睡的很晚，进而进入一个负面的循环。

一家公司的离职率很高，据员工反馈是因为给的少，然而事实是薪水其实和市场持平。原来是因为公司其他条件不行导致吸引来的都是看中薪金条件的员工。这样加强文化建设就优于单纯的加钱。

销售额出现连续下滑问题后定位到了是用户量减少的原因，如果这个时候马上就开始加大拉新投入，用户量虽然上去了，但是成本也相应的增大了。而深挖后发现用户减少的原因是因为功能bug导致无法正常使用，优化了这个问题之后用户的增速又恢复了正常。

# 如何明确问题？

关于明确问题要做到两件事情：

确定问题是真问题， 以及 确定这个问题是值得被解决的问题。

## 第一件事： 确定问题是真问题。

当一个需求丢过来的时候要从三个方面去进行确认：

确定这个需求要达成的目的、产生背景以及展示对象。有哪些资源可以使用。大概什么规模，必须包含什么维度。初稿和终稿的时间。 

对方真正的需求是什么，还可以通过什么方式实现，怎么帮助对方实现。这个需求的确是像陈述的一样是个需求，而不是只是觉得xx指标低，但实际上并没有。

确定这些之后，接下来就要确定好由时间+维度+指标的一个完整指标来量化问题，方便得知后续迭代之后情况是否有所好转。

先从小孩和饼干开始：

目的是让小孩吃到饼干。发现对方真正的需求是让孩子停止哭泣。是个真问题。

那么得到指标就可以是今日孩子哭泣时长，而不是把焦点放在饼干上。

迟到问题就可以是本月迟到率。

离职问题可以是本月离职率。

销售额问题可以直接用销售额做指标。

总的来说是要找到对方真正关心的问题，然后再将问题量化成一个指标，看指标值是不是真的存在异常。

这样两步就可以过滤掉一些无效需求，也可以保证后续的分析工作是有意义的。

## 第二件事： 确定这个问题是值得被解决的问题

通过第一步确认之后可能还剩下一堆过筛的需求。这个时候要确认这些需求的重要性和可解决性。

要优先关注重要的，好解决的任务，这样的事情回报率才是最大的。

要把更多的事情往这类任务上倾斜。

![值得被解决的问题](https://pic2.zhimg.com/80/v2-1f7155dee9d321ad1d8d2f7dce0d35e9_720w.jpg)

# 参考资料

[【数据分析】数据分析方法（七）：AARRR 模型分析 & 漏斗分析](https://blog.csdn.net/be_racle/article/details/125221528)

* any list
{:toc}