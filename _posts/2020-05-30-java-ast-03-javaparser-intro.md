---
layout: post
title: JavaParser 系列学习-00-介绍
date:  2020-5-29 14:24:18 +0800
categories: [java]
tags: [aop, ast, sh]
published: true
---

# 是什么

JavaParser库以其最简单的形式允许您与Java源代码进行交互，作为Java环境中的Java对象表示形式。 

更正式地说，我们将此对象表示形式称为抽象语法树（AST）。

此外，它提供了一种方便的机制，可以使用我们称为“访客支持”的功能来导航树。

这使开发人员能够专注于在源代码中识别有趣的模式，而不必编写费力的树遍历代码。

该库的最终主要功能是能够操纵源代码的基础结构。

然后可以将其写入文件，为开发人员提供**构建自己的代码生成软件的便利**。

# 不是什么

不是JavaParser虽然该库适合作为库的一部分使用，但它不是代码重构工具箱。

这也许是我们所看到的关于图书馆的最受欢迎的误解。

可以将库视为提供一种机制来回答“这是什么代码？”的问题，语言工程师可以根据自己的意愿选择原因和方式，以及如何选择对其进行操作或报告。

它不是符号求解器，不会回答“此变量在哪里定义”的问题。

为此，您将需要另一个库，我们建议为其使用 [JavaSymbolSolver](https://github.com/javaparser/javasymbolsolver)¹²。

它也不是编译器。可以由库解析的语法正确的源代码并不一定意味着它将成功编译。

尽管可以成功编译的文件在语法上具有内在的正确性，但是解析只是编译过程的一个阶段。

例如，如果在未定义变量v的情况下对其进行引用，则在语法上是正确的，但是会导致编译过程中出现语义错误。

# 这本书是给谁的？

听起来没什么好玩的：大多数Java开发人员。

如果不是JavaParser库，则他们可能将从了解解析器可以提供的日常工作中受益。

为了解决这个问题，在大多数情况下，当选择解析源代码时，您正在寻找的是识别某些东西（通常是代码中的问题）或使代码自动生成的方式。

人们普遍认为这两种做法都可以提高质量和效率。我可以自动发现问题，可以更快地生成此代码吗？

所有开发人员都应该对如何实现这两者感兴趣。

但是，很有可能您将很少在最终用户软件中包括JavaParser库。

通常，它构成工具组件的一部分，该工具组件将对项目的源代码进行操作，或者生成最终将为用户服务的代码。

语言工具可能是我们看到的库最常用的例子。

我们可以在代码中识别兴趣点然后执行操作的想法。

更广泛地说，它是针对语言工程师和工具开发人员的。

作为Java的库，假定您已经对Java有一定的了解。

# 这本书不适合

那些希望学习Java的人，通过以上本书的扩展，不会教读者Java。

除了用户会感兴趣的功能之外，它也不会给您提供关于如何编写解析器的深刻见解。

我们也不会深入研究Java语法或库的基础语法定义。

那些希望在该领域获得更多了解的读者可以访问Java Language Specification³网站。

也许最有争议的是那些缺乏测试的人。

像大多数事物一样，测试方法是主观的，因此就此问题发表意见并不是本书的目标。

这样的例子是本书主要通过主要方法进行说明的。

# 如何使用这本书？

本书旨在用作使用JavaParser库的人员的学习帮助。

它不是参考指南，我们已尽力为此目的维护JavaDoc⁴。

如果您发现缺少文档，请在GitHub上提问。

我们将本书分为两部分，第一部分旨在使您快速掌握抽象语法树，库的关键组件以及如何在计算机上获取一些可用的示例。

如果您是新手，建议您阅读第一部分，以便在该主题上获得良好的基础。

本书的第二部分是用例的集合，这些用例更加详细地介绍了我们如何经常看到所使用的库。

可能会乱序读取用例，也许从用户最关注的用例开始。

尽管阅读所有内容当然没有害处。

# 本书中使用的约定

斜体-用于主题中重要概念的首次引入。

粗体-在当前主题范围内强调特定概念。

代码-用于突出显示内嵌的程序代码字

# 代码样例

您可以不受限制地自由使用本书中的所有代码示例。

原始资源可以在 [GitHub](https://github.com/javaparser/javaparser-visited)⁵上找到。

我们感谢您，但无需注明出处。

这通常包括书名及其作者。

例如：JavaParser：Smith，Van Bruggen和Tomassetti所访问

# 如何联络我们

如有任何问题，意见或疑虑，请来Gitter访问我们。

关于本书的反馈：https://gitter.im/javaparser/javaparserbook

JavaParser库支持：https://gitter.im/javaparser/javaparser

# 作者简介

## 尼古拉斯·史密斯

Nicholas是一位经验丰富的软件工程师，目前正在伦敦从事其业务。 

他一直幸运的是，他的工作也带点旅行，在此期间他曾在丹麦，印度和意大利工作他的事业。

他的教育背景主要是软件工程学士学位和学士学位和硕士学位，后者专门研究金融服务。

尽管他曾涉猎多种语言，但他主要将自己视为Java程序员，从1.3开始使用该语言有空的时候，除了为JavaParser项目做贡献之外，还可以找到他忽略了技术博客nicholaspaulsmith.com⁶或入侵了一些有头脑的计划，

让他提前退休。

## 费德里科·托马塞蒂（Federico Tomassetti）

Federico是一位独立的软件架构师，专注于构建语言：解析器，编译器，编辑器，模拟器和其他类似工具。

他在tomassetti.me⁷的博客上分享了他对语言工程的想法。

之前，他获得了语言工程博士学位，在这里和那里（包括TripAdvisor和Groupon）工作，现在他专注于咨询和为JavaParser和JavaSymbolSolver等开源项目做出贡献。

# 致谢

我们要感谢JavaParser的原始作者：Sreenivasa Viswanadha和JúlioVilmar Gesser。

此外，但最重要的是，我们要感谢围绕JavaParser成长的所有贡献者和精彩的社区。

今天，有数十个人发送了补丁，数百人在论坛，Stack Overflow，GitHub和Gitter上提出了问题。

与他们的讨论有助于理解JavaParser的使用方式以及需要澄清的部分。

# 参考资料

官方语法书

* any list
{:toc}