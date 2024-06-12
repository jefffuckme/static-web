---
layout: post
title: 遗传算法详解
date:  2020-1-23 10:09:32 +0800
categories: [Data-Struct]
tags: [data-struct, algorithm, sh]
published: true
---

# 前言

说一说跨学库的东西。

生物学中的进化论可谓无人不知，无人不晓。

数学中的梯度下降和牛顿迭代，收敛的效果能否进一步优化呢？

这也使我想起来以前阅读的两本书《失控》和《超级智能》

# 什么是遗传算法？

## 遗传算法的科学定义

遗传算法（Genetic Algorithm, GA）是**模拟达尔文生物进化论的自然选择和遗传学机理的生物进化过程的计算模型，是一种通过模拟自然进化过程搜索最优解的方法。**

其主要特点是直接对结构对象进行操作，不存在求导和函数连续性的限定；具有内在的隐并行性和更好的全局寻优能力；采用概率化的寻优方法，不需要确定的规则就能自动获取和指导优化的搜索空间，自适应地调整搜索方向。

遗传算法以一种群体中的所有个体为对象，并利用随机化技术指导对一个被编码的参数空间进行高效搜索。

其中，选择、交叉和变异构成了遗传算法的遗传操作；

参数编码、初始群体的设定、适应度函数的设计、遗传操作设计、控制参数设定五个要素组成了遗传算法的核心内容。

##  遗传算法的执行过程(参照百度百科)

遗传算法是从代表问题可能潜在的解集的一个种群（population）开始的，而一个种群则由经过基因（gene）编码的一定数目的个体(individual)组成。

每个个体实际上是染色体(chromosome)带有特征的实体。

染色体作为遗传物质的主要载体，即多个基因的集合，其内部表现（即基因型）是某种基因组合，它决定了个体的形状的外部表现，如黑头发的特征是由染色体中控制这一特征的某种基因组合决定的。

因此，在一开始需要实现从表现型到基因型的映射即编码工作。

由于仿照基因编码的工作很复杂，我们往往进行简化，如二进制编码。

初代种群产生之后，按照适者生存和优胜劣汰的原理，逐代（generation）演化产生出越来越好的近似解，在每一代，根据问题域中个体的适应度（fitness）大小选择（selection）个体，并借助于自然遗传学的遗传算子（genetic operators）进行组合交叉（crossover）和变异（mutation），产生出代表新的解集的种群。

这个过程将导致种群像自然进化一样的后生代种群比前代更加适应于环境，末代种群中的最优个体经过解码（decoding），可以作为问题近似最优解。

## 遗传算法图解

![image](https://user-images.githubusercontent.com/18375710/72863124-7596b600-3d0a-11ea-9c03-a1c38cbe72e7.png)

# 相关生物学术语

为了大家更好了解遗传算法，在此之前先简单介绍一下相关生物学术语，大家了解一下即可。

基因型(genotype)：性状染色体的内部表现；

表现型(phenotype)：染色体决定的性状的外部表现，或者说，根据基因型形成的个体的外部表现；

进化(evolution)：种群逐渐适应生存环境，品质不断得到改良。生物的进化是以种群的形式进行的。

适应度(fitness)：度量某个物种对于生存环境的适应程度。

选择(selection)：以一定的概率从种群中选择若干个个体。一般，选择过程是一种基于适应度的优胜劣汰的过程。

复制(reproduction)：细胞分裂时，遗传物质DNA通过复制而转移到新产生的细胞中，新细胞就继承了旧细胞的基因。

交叉(crossover)：两个染色体的某一相同位置处DNA被切断，前后两串分别交叉组合形成两个新的染色体。也称基因重组或杂交；

变异(mutation)：复制时可能（很小的概率）产生某些复制差错，变异产生新的染色体，表现出新的性状。

编码(coding)：DNA中遗传信息在一个长链上按一定的模式排列。遗传编码可看作从表现型到基因型的映射。

解码(decoding)：基因型到表现型的映射。

个体（individual）：指染色体带有特征的实体；

种群（population）：个体的集合，该集合内个体数称为种群

# 问题引出与解决

## 一元函数最大值问题

![image](https://user-images.githubusercontent.com/18375710/72863885-243bf600-3d0d-11ea-8bcd-96e744f944c7.png)


目标：现在我们要在**既定的区间内找出函数的最大值。**

学过高中数学的孩纸都知道，上面的函数存在着很多的极大值和极小值。

而最大值则是指定区间的极大值中的最大的那一个。

从图像上具体表现为，极大值像是一座座山峰，极小值则是像一座座山谷。因此，我们也可以把遗传算法的过程看作是一个在多元函数里面求最优解的过程。

这些山峰对应着局部最优解，其中有一个山峰是海拔最高的，这个山峰则对应的是全局最优解。

那么，遗传算法要做的就是尽量爬到最高峰，而不是困在较低的小山峰上。（如果问题求解是最小值，那么要做的就是尽量走到最低谷，道理是一样的）。

## "袋鼠蹦跳"

既然我们把函数曲线理解成一个一个山峰和山谷组成的山脉。

那么我们可以设想所得到的每一个解就是一只袋鼠，我们希望它们不断的向着更高处跳去，直到跳到最高的山峰。

所以求最大值的过程就转化成一个“袋鼠跳”的过程。

下面介绍介绍“袋鼠跳”的几种方式。

### 爬山算法

一只袋鼠朝着比现在高的地方跳去。它找到了不远处的最高的山峰。但是这座山不一定是最高峰。

这就是爬山算法，它不能保证局部最优值就是全局最优值。

### 模拟退火

袋鼠喝醉了。它随机地跳了很长时间。这期间，它可能走向高处，也可能踏入平地。但是，它渐渐清醒了并朝最高峰跳去。这就是模拟退火算法。

### 遗传算法

有很多袋鼠，它们降落到喜玛拉雅山脉的任意地方。

这些袋鼠并不知道它们的任务是寻找珠穆朗玛峰。但每过几年，就在一些海拔高度较低的地方射杀一些袋鼠。

于是，不断有袋鼠死于海拔较低的地方，而越是在海拔高的袋鼠越是能活得更久，也越有机会生儿育女。

就这样经过许多年，这些袋鼠们竟然都不自觉地聚拢到了一个个的山峰上，可是在所有的袋鼠中，只有聚拢到珠穆朗玛峰的袋鼠被带回了美丽的澳洲。

## 大体实现过程

遗传算法中每一条染色体，对应着遗传算法的一个解决方案，一般我们用适应性函数（fitness function）来衡量这个解决方案的优劣。

所以从一个基因组到其解的适应度形成一个映射。

遗传算法的实现过程实际上就像自然界的进化过程那样。

下面我们用袋鼠跳中的步骤一一对应解释，以方便大家理解：

1. 首先寻找一种对问题潜在解进行“数字化”编码的方案。（建立表现型和基因型的映射关系）

2. 随机初始化一个种群（那么第一批袋鼠就被随意地分散在山脉上），种群里面的个体就是这些数字化的编码。

3. 接下来，通过适当的解码过程之后（得到袋鼠的位置坐标）。

4. 用适应性函数对每一个基因个体作一次适应度评估（袋鼠爬得越高当然就越好，所以适应度相应越高）。

5. 用选择函数按照某种规定择优选择（每隔一段时间，射杀一些所在海拔较低的袋鼠，以保证袋鼠总体数目持平。）。

6. 让个体基因变异（让袋鼠随机地跳一跳）。

7. 然后产生子代（希望存活下来的袋鼠是多产的，并在那里生儿育女）。

遗传算法并不保证你能获得问题的最优解，但是使用遗传算法的最大优点在于你不必去了解和操心如何去“找”最优解。

（你不必去指导袋鼠向那边跳，跳多远。）

而只要简单的“否定”一些表现不好的个体就行了。

（把那些总是爱走下坡路的袋鼠射杀，这就是遗传算法的精粹！）

ps: 就是自然选择，适者生存。


### 一般步骤

由此我们可以得出遗传算法的一般步骤：

1. 随机产生种群。

2. 根据策略判断个体的适应度，是否符合优化准则，若符合，输出最佳个体及其最优解，结束。否则，进行下一步。

3. 依据适应度选择父母，适应度高的个体被选中的概率高，适应度低的个体被淘汰。

4. 用父母的染色体按照一定的方法进行交叉，生成子代。

5. 对子代染色体进行变异。

6. 由交叉和变异产生新一代种群，返回步骤2，直到最优解产生。

具体图解可以回到1.3查看。

# 具体实现细节

## 先从编码说起

编码是应用遗传算法时要解决的首要问题，也是设计遗传算法时的一个关键步骤。

编码方法影响到交叉算子、变异算子等遗传算子的运算方法，大很大程度上决定了遗传进化的效率。

迄今为止人们已经提出了许多种不同的编码方法。

总的来说，这些编码方法可以分为三大类：二进制编码法、浮点编码法、符号编码法。

下面分别进行介绍：

###  二进制编码法

就像人类的基因有AGCT 4种碱基序列一样。不过在这里我们只用了0和1两种碱基,然后将他们串成一条链形成染色体。

一个位能表示出2种状态的信息量，因此足够长的二进制染色体便能表示所有的特征。这便是二进制编码。

如下：

```
1110001010111
```

它由二进制符号0和1所组成的二值符号集。

它有以下一些优点：

1. 编码、解码操作简单易行

2. 交叉、变异等遗传操作便于实现

3. 合最小字符集编码原则

4. 利用模式定理对算法进行理论分析。

二进制编码的缺点是：

对于一些连续函数的优化问题，由于其随机性使得其局部搜索能力较差，如对于一些高精度的问题（如上题），当解迫近于最优解后，由于其变异后表现型变化很大，不连续，所以会远离最优解，达不到稳定。

### 浮点编码法

二进制编码虽然简单直观，但明显地。但是存在着连续函数离散化时的映射误差。

个体长度较短时，可能达不到精度要求，而个体编码长度较长时，虽然能提高精度，但增加了解码的难度，使遗传算法的搜索空间急剧扩大。

所谓浮点法，是指个体的每个基因值用某一范围内的一个浮点数来表示。

在浮点数编码方法中，必须保证基因值在给定的区间限制范围内，遗传算法中所使用的交叉、变异等遗传算子也必须保证其运算结果所产生的新个体的基因值也在这个区间限制范围内。

如下所示：

```
1.2-3.2-5.3-7.2-1.4-9.7
```

浮点数编码方法有下面几个优点：

- 适用于在遗传算法中表示范围较大的数

- 适用于精度要求较高的遗传算法

- 便于较大空间的遗传搜索

- 改善了遗传算法的计算复杂性，提高了运算交率

- 便于遗传算法与经典优化方法的混合使用

- 便于设计针对问题的专门知识的知识型遗传算子

- 便于处理复杂的决策变量约束条件

### 符号编码法

符号编码法是指个体染色体编码串中的基因值取自一个无数值含义、而只有代码含义的符号集如｛A,B,C…｝。

符号编码的主要优点是：

- 符合有意义积术块编码原则

- 便于在遗传算法中利用所求解问题的专门知识

- 便于遗传算法与相关近似算法之间的混合使用。

## 为我们的袋鼠染色体编码

在上面介绍了一系列编码方式以后，那么，如何利用上面的编码来为我们的袋鼠染色体编码呢？

首先我们要明确一点：编码无非就是建立从基因型到表现型的映射关系。这里的表现型可以理解为个体特征（比如身高、体重、毛色等等）。

那么，在此问题下，我们关心的个体特征就是：袋鼠的位置坐标（因为我们要把海拔低的袋鼠给杀掉）。无论袋鼠长什么样，爱吃什么。

我们关心的始终是袋鼠在哪里，并且只要知道了袋鼠的位置坐标（位置坐标就是相应的染色体编码，可以通过解码得出），我们就可以：

在喜马拉雅山脉的地图上找到相应的位置坐标，算出海拔高度。（相当于通过自变量求得适应函数的值）然后判读该不该射杀该袋鼠。

可以知道染色体交叉和变异后袋鼠新的位置坐标。

回到3.1中提的求一元函数最大值的问题。

在上面我们把极大值比喻为山峰，那么，袋鼠的位置坐标可以比喻为区间[-1, 2]的某一个x坐标（有了x坐标，再通过函数表达式可以算出函数值 <==> 得到了袋鼠染色体编码，解码得到位置坐标，在喜马拉雅山脉地图查询位置坐标算出海拔高度）。这个x坐标是一个实数，现在，说白了就是怎么对这个x坐标进行编码。

下面我们以二进制编码为例讲解，不过这种情况下以二进制编码比较复杂就是了。（如果以浮点数编码，其实就很简洁了，就一浮点数而已。）

我们说过，一定长度的二进制编码序列，只能表示一定精度的浮点数。在这里假如我们要求解精确到六位小数，由于区间长度为 2 - (-1) = 3 ,为了保证精度要求，至少把区间 `[-1,2]` 分为 3 × 10^6 等份。

又因为 `2^21 = 2097152 < 3*10^6 < 2^22 = 4194304`

所以编码的二进制串至少需要22位。

## 二进制串转换为实数值

把一个二进制串(b0,b1,....bn)转化为区间里面对应的实数值可以通过下面两个步骤：

1、将一个二进制串代表的二进制数转化为10进制数：

![image](https://user-images.githubusercontent.com/18375710/72866892-f1e3c600-3d17-11ea-8e2a-4573e67de626.png)

2、对应区间内的实数：

![image](https://user-images.githubusercontent.com/18375710/72866909-02943c00-3d18-11ea-9361-af013fab3473.png)

例如一个二进制串(1000101110110101000111)2通过上面换算以后，表示实数值0.637197。

好了，上面的编码方式只是举个例子让大家更好理解而已，编码的方式千奇百怪，层出不穷，每个问题可能采用的编码方式都不一样。

在这一点上大家要注意。

## 评价个体的适应度--适应度函数（fitness function）

前面说了，适应度函数主要是通过个体特征从而判断个体的适应度。

在本例的袋鼠跳中，我们只关心袋鼠的海拔高度，以此来判断是否该射杀该袋鼠。

这样一来，该函数就非常简单了。只要输入袋鼠的位置坐标，在通过相应查找运算，返回袋鼠当前位置的海拔高度就行。

适应度函数也称评价函数，是根据目标函数确定的用于区分群体中个体好坏的标准。适应度函数总是非负的，而目标函数可能有正有负，故需要在目标函数与适应度函数之间进行变换。

评价个体适应度的一般过程为：

对个体编码串进行解码处理后，可得到个体的表现型。

由个体的表现型可计算出对应个体的目标函数值。

根据最优化问题的类型，由目标函数值按一定的转换规则求出个体的适应度。


## 射杀一些袋鼠--选择函数（selection）

遗传算法中的选择操作就是用来确定如何从父代群体中按某种方法选取那些个体，以便遗传到下一代群体。

选择操作用来确定重组或交叉个体，以及被选个体将产生多少个子代个体。

前面说了，我们希望海拔高的袋鼠存活下来，并尽可能繁衍更多的后代。

但我们都知道，在自然界中，适应度高的袋鼠越能繁衍后代，但这也是从概率上说的而已。毕竟有些适应度低的袋鼠也可能逃过我们的眼睛。

那么，怎么建立这种概率关系呢？

下面介绍几种常用的选择算子：

轮盘赌选择（Roulette Wheel Selection）：是一种回放式随机采样方法。每个个体进入下一代的概率等于它的适应度值与整个种群中个体适应度值和的比例。选择误差较大。

随机竞争选择（Stochastic Tournament）：每次按轮盘赌选择一对个体，然后让这两个个体进行竞争，适应度高的被选中，如此反复，直到选满为止。

最佳保留选择：首先按轮盘赌选择方法执行遗传算法的选择操作，然后将当前群体中适应度最高的个体结构完整地复制到下一代群体中。

无回放随机选择（也叫期望值选择Excepted Value Selection）：根据每个个体在下一代群体中的生存期望来进行随机选择运算。

方法如下:

（1） 计算群体中每个个体在下一代群体中的生存期望数目N。

（2） 若某一个体被选中参与交叉运算，则它在下一代中的生存期望数目减去0.5，若某一个体未 被选中参与交叉运算，则它在下一代中的生存期望数目减去1.0。

（3） 随着选择过程的进行，若某一个体的生存期望数目小于0时，则该个体就不再有机会被选中。

确定式选择：按照一种确定的方式来进行选择操作。具体操作过程如下：

（1） 计算群体中各个个体在下一代群体中的期望生存数目N。

（2） 用N的整数部分确定各个对应个体在下一代群体中的生存数目。

（3） 用N的小数部分对个体进行降序排列，顺序取前M个个体加入到下一代群体中。至此可完全确定出下一代群体中Ｍ个个体。

无回放余数随机选择：可确保适应度比平均适应度大的一些个体能够被遗传到下一代群体中，因而选择误差比较小。

均匀排序：对群体中的所有个体按期适应度大小进行排序，基于这个排序来分配各个个体被选中的概率。

最佳保存策略：当前群体中适应度最高的个体不参与交叉运算和变异运算，而是用它来代替掉本代群体中经过交叉、变异等操作后所产生的适应度最低的个体。

随机联赛选择：每次选取几个个体中适应度最高的一个个体遗传到下一代群体中。

排挤选择：新生成的子代将代替或排挤相似的旧父代个体，提高群体的多样性。

## 轮盘选择

下面以轮盘赌选择为例给大家讲解一下：

假如有５条染色体，他们的适应度分别为５、８、３、７、２。

那么总的适应度为：F = 5 + 8 + 3 + 7 + 2 = 25。

那么各个个体的被选中的概率为：

```
α1 = ( 5 / 25 ) * 100% = 20%
α2 = ( 8 / 25 ) * 100% = 32%
α3 = ( 3 / 25 ) * 100% = 12%
α4 = ( 7 / 25 ) * 100% = 28%
α5 = ( 2 / 25 ) * 100% = 8%
```

所以转盘如下：

![image](https://user-images.githubusercontent.com/18375710/72867016-78000c80-3d18-11ea-91e6-a108d73f5062.png)

当指针在这个转盘上转动，停止下来时指向的个体就是天选之人啦。

可以看出，适应性越高的个体被选中的概率就越大。

## 遗传--染色体交叉(crossover)

遗传算法的交叉操作，是指对两个相互配对的染色体按某种方式相互交换其部分基因，从而形成两个新的个体。

适用于二进制编码个体或浮点数编码个体的交叉算子：

单点交叉（One-point Crossover）：指在个体编码串中只随机设置一个交叉点，然后再该点相互交换两个配对个体的部分染色体。

两点交叉与多点交叉：

(1) 两点交叉（Two-point Crossover）：在个体编码串中随机设置了两个交叉点，然后再进行部分基因交换。

(2) 多点交叉（Multi-point Crossover）

均匀交叉（也称一致交叉，Uniform Crossover）：两个配对个体的每个基因座上的基因都以相同的交叉概率进行交换，从而形成两个新个体。

算术交叉（Arithmetic Crossover）：由两个个体的线性组合而产生出两个新的个体。该操作对象一般是由浮点数编码表示的个体。

咳咳，根据国际惯例。还是抓一个最简单的二进制单点交叉为例来给大家讲解讲解。

二进制编码的染色体交叉过程非常类似高中生物中所讲的同源染色体的联会过程――随机把其中几个位于同一位置的编码进行交换，产生新的个体。

![image](https://user-images.githubusercontent.com/18375710/72867070-a4b42400-3d18-11ea-92b6-4efb256747bd.png)

## 变异--基因突变(Mutation)

遗传算法中的变异运算，是指将个体染色体编码串中的某些基因座上的基因值用该基因座上的其它等位基因来替换，从而形成新的个体。

例如下面这串二进制编码：

101101001011001

经过基因突变后，可能变成以下这串新的编码：

001101011011001

以下变异算子适用于二进制编码和浮点数编码的个体：

基本位变异（Simple Mutation）：对个体编码串中以变异概率、随机指定的某一位或某几位仅因座上的值做变异运算。

均匀变异（Uniform Mutation）：分别用符合某一范围内均匀分布的随机数，以某一较小的概率来替换个体编码串中各个基因座上的原有基因值。（特别适用于在算法的初级运行阶段）

边界变异（Boundary Mutation）：随机的取基因座上的两个对应边界基因值之一去替代原有基因值。特别适用于最优点位于或接近于可行解的边界时的一类问题。

非均匀变异：对原有的基因值做一随机扰动，以扰动后的结果作为变异后的新基因值。对每个基因座都以相同的概率进行变异运算之后，相当于整个解向量在解空间中作了一次轻微的变动。

高斯近似变异：进行变异操作时用符号均值为Ｐ的平均值，方差为P**2的正态分布的一个随机数来替换原有的基因值。


# 个人收获

这篇文章也是遗传算法的结果，直接copy+一些变异=新的文章。

# 参考资料

[遗传算法-百度百科](https://baike.baidu.com/item/%E9%81%97%E4%BC%A0%E7%AE%97%E6%B3%95/838140?fr=aladdin)

[【算法】超详细的遗传算法(Genetic Algorithm)解析](https://www.jianshu.com/p/ae5157c26af9)

[Python3完整实现了简单遗传算法(SGA)](https://blog.csdn.net/hellocsz/article/details/100679506)

[遗传算法](https://www.jianshu.com/p/7a6f56602f9a)

https://zhuanlan.zhihu.com/p/35986593

[如何通俗易懂地解释遗传算法？有什么例子？](https://www.zhihu.com/question/23293449/answer/120220974)

[一文读懂遗传算法工作原理（附Python实现）](https://www.cnblogs.com/jingsupo/archive/2018/04/23/genetic-algorithm-python.html)

* any list
{:toc}