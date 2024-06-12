---
layout: post
title: pinyin4j 之中文拼音的基础知识
date:  2020-1-9 10:09:32 +0800
categories: [Search]
tags: [nlp, pinyin, sh]
published: true
---

# 拼音声调

## 声调

拼音声调是指普通话中的声调，通常叫四声，即阴平（第一声），用“ˉ”表示，如lā；阳平第二声，用“ˊ”表示，如lá；上声（第三声），用“ˇ”表示，如lǎ；去声（第四声），用“ˋ”表示，如；là。

汉语中还存在着一种特殊声调，叫做轻声，有时也叫第五声，在汉语拼音中不标调。有些学者认为“第五声”的说法并不确切。轻声虽然能够起分辨语义的作用，但是通常不列入汉语“四声”之一，因为声调是正常重音音节的音高形式。在音高上，轻音只有音区特征，声调还有曲拱特征。

每个汉字由韵母和声母配合构成一个音节构成。在韵母上部应该标出声调，为了方便也可省略。声调影响舌头位置，不仅仅声带有关。


## 标音调的问题

汉语拼音中标声调位置的规则如下：

```
若有两个韵母（元音），且第一个韵母（元音）为i、u、或是ü时，则将声调标示在第二个韵母（元音）上。

其余状况下声调皆应标示于第一个韵母（元音）之上。
```

# 汉语拼音方案

## 历史

这里不再赘述，语同音，字同形的意义其实比文字本身要大的多。

## 方案

参见 [汉语拼音方案](https://baike.baidu.com/item/%E6%B1%89%E8%AF%AD%E6%8B%BC%E9%9F%B3%E6%96%B9%E6%A1%88)


# 语音标注方案

## 符号标调

《汉语拼音方案》中声调采用的是符号标调：

1957年11月1日国务院全体会议第六十次会议通过，1958年2月11日第一次全国人民代表大会第五次会议批准的《汉语拼音方案》中声调符号采用的是：阴平（ˉ）、阳平（ˊ）、上声（ˇ）去声（ˋ）、轻声（不标调）的方法。这种方法解决了不同声调汉字的区别问题。例如，妈 mā（阴平）、麻 má（阳平）、马 mǎ（上声）、骂 mà（去声）、吗 mɑ（轻声不标调）。

为识字辨音立下了汗马功劳。

但随着信息化的不断发展，其与计算机键盘不相适应。输入1个声调符号要折腾好一阵子，用起来很不爽快，影响汉字信息化的不断发展。

## 数字标调

采用数字 1、2、3、4、5，代替《汉语拼音方案》中声调阴平（ˉ），阳平（ˊ），上声（ˇ），去声（ˋ），轻声（不标调）这几个标调符号。

实施方法：

（1）用数字1代替阴平（ˉ）符号，因为阴平为第一声。例如，拼音pīn yīn，按本方法是pin1 yin1。

例字：吖 呵 阿 啊 锕 腌的拼音是“ā”。用本方法，吖 呵 阿 啊 锕 腌的拼音是“a”。

哀 挨 埃 唉 哎 锿的拼音是“āi”。用本方法，哀 挨 埃 唉 哎 锿的拼音是“ai1”。

（2）用数字2代替阳平（ˊ）符号，因为阳平为第二声。

例字：挨 癌 皑 捱的拼音是“ái”。用本方法，挨 癌 皑 捱的拼音是“ai2”。

（3）用数字3代替上声（ˇ）符号，因为上声为第三声。

例字：毐 矮 蔼 霭的拼音是“ǎi”。用本方法，毐 矮 蔼 霭的拼音是“ai3”。

（4）用数字4代替去声（ˋ）符号，因为去声为第四声。

例字：艾 哎 砹 唉爱 嗳 暧 瑷 嫒 碍 隘 嗌的拼音是“ài”。用本方法，艾 哎 砹 唉爱 嗳 暧 瑷 嫒 碍 隘 嗌的拼音是“ai4”。

（5）用数字5代替轻声，因为轻声为第5声。

例字：啊字的拼音是“ɑ”。用本方法，啊字的拼音是“a5”。吧 罢字的拼音是“ba”。用本方法，吧 罢字的拼音是“ba5”。

（6）说明：按上述实施方法，用数字标调，一律将声调(数字)标示在音节后面。

例如：成立 cheng2 li4


# 标调的位置

标调就是按一定规则给音节标上调号，表示这个音节读第几声。

汉语声调符号的标记位置有两种情况：

a母出现不放过， （即韵母中凡是有a的，标在a上。如lao,标在a上）

没有a母找 o e ， （没有a，但有o 或e的，标在 o 或e 上。如lou标在o上,lei标在e上）

i u并列标在后， （i和 u并列时，标在后面。比如liu,标在u上，gui,标在i 上）

单个韵母不必说。 （单个的韵母，当然就标它上面了）


# 参考资料

[拼音声调-百度百科](https://baike.baidu.com/item/%E6%8B%BC%E9%9F%B3%E5%A3%B0%E8%B0%83/3031925?fr=aladdin)

[汉语拼音方案-百度百科](https://baike.baidu.com/item/%E6%B1%89%E8%AF%AD%E6%8B%BC%E9%9F%B3%E6%96%B9%E6%A1%88)

https://github.com/mozillazg/pinyin-data

https://github.com/mozillazg/phrase-pinyin-data


* any list
{:toc}