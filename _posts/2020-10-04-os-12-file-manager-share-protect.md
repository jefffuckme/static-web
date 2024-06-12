---
layout: post
title:  操作系统学习(12)文件的共享与保护
date:  2020-10-4 11:18:54 +0800
categories: [OS]
tags: [os, file, sf]
published: true
---

# 共享文件：硬链接和软链接

文件共享使多个用户（进程）共享同一份文件，系统中只需保留该文件的一份副本。如果系统不能提供共享功能，那么每个需要该文件的用户都要有各自的副本，会造成对存储空间的极大浪费。随着计算机技术的发展，文件共享的范围已由单机系统发展到多机系统，进而通过网络扩展到全球。

这些文件的分享是通过分布式文件系统、远程文件系统、分布式信息系统实现的。这些系统允许多个客户通过C/S模型共享网络中的服务器文件。

现代常用的两种文件共享方法有：

# 基于索引结点的共享方式（硬链接）

在树形结构的目录中，当有两个或多个用户要共享一个子目录或文件时，必须将共享文件或子目录链接到两个或多个用户的目录中，才能方便地找到该文件，如图4-7所示

- 图4-7  基于索引结点的共享方式

![输入图片说明](https://images.gitee.com/uploads/images/2020/1006/112522_90746cd6_508704.png "屏幕截图.png")

在这种共享方式中引用索引结点，即诸如文件的物理地址及其他的文件属性等信息，不再是放在目录项中，而是放在索引结点中。

在文件目录中只设置文件名及指向相应索引结点的指针。在索引结点中还应有一个链接计数count,用于表示链接到本索引结点（亦即文件） 上的用户目录项的数目。

当count=2时，表示有两个用户目录项链接到本文件上，或者说是有两个用户共享此文件。

当用户A创建一个新文件时，它便是该文件的所有者，此时将count置为1。

当有用户 B要共享此文件时，在用户B的目录中增加一个目录项，并设置一指针指向该文件的索引结点。

此时，文件主仍然是用户A，count=2。如果用户A不再需要此文件，不能将文件直接删除。

因为，若删除了该文件，也必然删除了该文件的索引结点，这样便会便用户B的指针悬空，而用户B则可能正在此文件上执行写操作，此时用户B会无法访问到文件。

因此用户A不能删除此文件，只是将该文件的count减1，然后删除自己目录中的相应目录项。用户B仍可以使用该文件。

当COunt=0时，表示没有用户使用该文件，系统将负责删除该文件。

如图4-8给出了用户B链接到文件上的前、后情况。

## 利用符号链实现文件共享（软链接）

为使用户B能共享用户A的一个文件F,可以由系统创建一个LINK类型的新文件，也取名为F，并将文件F写入用户B的目录中，以实现用户B的目录与文件F的链接。

在新文件中只包含被链接文件F的路径名。这样的链接方法被称为符号链接。

- 图4-8  文件共享中的链接计数

![输入图片说明](https://images.gitee.com/uploads/images/2020/1006/112819_0be4f33f_508704.png "屏幕截图.png")

新文件中的路径名则只被看做是符号链，当用户B要访问被链接的文件F且正要读 LINK类新文件时，操作系统根据新文件中的路径名去读该文件，从而实现了用户B对文件 F的共享。

在利用符号链方式实现文件共享时，只有文件的拥有者才拥有指向其索引结点的指针。

而共享该文件的其他用户则只有该文件的路径名，并不拥有指向其索引结点的指针。

这样，也就不会发生在文件主删除一共享文件后留下一悬空指针的情况。当文件的拥有者把一个共享文件删除后，其他用户通过符号链去访问它时，会出现访问失败，于是将符号链删除，此时不会产生任何影响。当然，利用符号链实现文件共享仍然存在问题，例如：一个文件釆用符号链方式共享，当文件拥有者将其删除，而在共享的其他用户使用其符号链接访问该文件之前，又有人在同一路径下创建了另一个具有同样名称的文件，则该符号链将仍然有效，但访问的文件已经改变，从而导致错误。

在符号链的共享方式中，当其他用户读共享文件时，需要根据文件路径名逐个地查找目录，直至找到该文件的索引结点。因此，每次访问时，都可能要多次地读盘，使得访问文件的开销变大并增加了启动磁盘的频率。此外，符号链的索引结点也要耗费一定的磁盘空间。符号链方式有一个很大的优点，即网络共享只需提供该文件所在机器的网络地址以及该机器中的文件路径即可。

上述两种链接方式都存在一个共同的问题，即每个共享文件都有几个文件名。换言之，每增加一条链接，就增加一个文件名。这实质上就是每个用户都使用自己的路径名去访问共享文件。当我们试图去遍历整个文件系统时，将会多次遍历到该共享文件。

硬链接和软链接都是文件系统中的静态共享方法，在文件系统中还存在着另外的共享需求，即两个进程同时对同一个文件进行操作，这样的共享可以称为动态共享。

# 文件保护：文件访问类型和访问控制

为了防止文件共享可能会导致文件被破坏或未经核准的用户修改文件，文件系统必须控制用户对文件的存取，即解决对文件的读、写、执行的许可问题。

为此，必须在文件系统中建立相应的文件保护机制。

文件保护通过口令保护、加密保护和访问控制等方式实现。

其中，口令保护和加密保护是为了防止用户文件被他人存取或窃取，而访问控制则用于控制用户对文件的访问方式。

## 访问类型

对文件的保护可以从限制对文件的访问类型中出发。可加以控制的访问类型主要有以下几种：

读：从文件中读。

写：向文件中写。

执行：将文件装入内存并执行。

添加：将新信息添加到文件结尾部分。

删除：删除文件，释放空间。

列表清单：列出文件名和文件属性。

此外还可以对文件的重命名、复制、编辑等加以控制。

这些高层的功能可以通过系统程序调用低层系统调用来实现。保护可以只在低层提供。

例如，复制文件可利用一系列的读请求来完成。这样，具有读访问用户同时也具有复制和打印的权限了。

## 访问控制

解决访问控制最常用的方法是根据用户身份进行控制。

而实现基于身份访问的最为普通的方法是为每个文件和目录增加一个访问控制列表(Access-Control List, ACL)，以规定每个用户名及其所允许的访问类型。

这种方法的优点是可以使用复杂的访同方法。其缺点是长度无法预期并且可能导致复杂的空间管理，使用精简的访问列表可以解决这个问题。

精简的访问列表釆用拥有者、组和其他三种用户类型。

1. 拥有者：创建文件的用户。

2. 组：一组需要共享文件且具有类似访问的用户。

3. 其他：系统内的所有其他用户。

这样只需用三个域列出访问表中这三类用户的访问权限即可。

文件拥有者在创建文件时，说明创建者用户名及所在的组名，系统在创建文件时也将文件主的名字、所属组名列在该文件的FCB中。

用户访问该文件时，按照拥有者所拥有的权限访问文件，如果用户和拥有者在同一个用户组则按照同组权限访问，否则只能按其他用户权限访问。UNIX操作系统即釆用此种方法。

口令和密码是另外两种访问控制方法。

口令指用户在建立一个文件时提供一个口令，系统为其建立FCB时附上相应口令，同时告诉允许共享该文件的其他用户。

用户请求访问时必须提供相应口令。这种方法时间和空间的开销不多，缺点是口令直接存在系统内部，不够安全。

密码指用户对文件进行加密，文件被访问时需要使用密钥。

这种方法保密性强，节省了存储空间，不过编码和译码要花费一定时间。

口令和密码都是防止用户文件被他人存取或窃取，并没有控制用户对文件的访问类型。

### 注意

注意两个问题：

现代操作系统常用的文件保护方法，是将访问控制列表与用户、组和其他成员访问控制方案一起组合使用。

对于多级目录结构而言，不仅需要保护单个文件，而且还需要保护子目录内的文件, 即需要提供目录保护机制。

目录操作与文件操作并不相同，因此需要不同的保护机制。

# 文件系统层次结构

现代操作系统有多种文件系统类型（如FAT32、NTFS、 ext2、ext3、ext4等），因此文件系统的层次结构也不尽相同。

图4-11是一种合理的层次结构。

![输入图片说明](https://images.gitee.com/uploads/images/2020/1006/113930_65aefec8_508704.png)

## 1) 用户调用接口

文件系统为用户提供与文件及目录有关的调用，如新建、打开、读写、关闭、删除文件，建立、删除目录等。

此层由若干程序模块组成，每一模块对应一条系统调用，用户发出系统调用时，控制即转入相应的模块。

## 2) 文件目录系统

文件目录系统的主要功能是管理文件目录，其任务有管理活跃文件目录表、管理读写状态信息表、管理用户进程的打开文件表、管理与组织在存储设备上的文件目录结构、调用下一级存取控制模块。

## 3) 存取控制验证

实现文件保护主要由该级软件完成，它把用户的访问要求与FCB中指示的访问控制权限进行比较，以确认访问的合法性。

## 4) 逻辑文件系统与文件信息缓冲区

逻辑文件系统与文件信息缓冲区的主要功能是根据文件的逻辑结构将用户要读写的逻辑记录转换成文件逻辑结构内的相应块号。

## 5) 物理文件系统

物理文件系统的主要功能是把逻辑记录所在的相对块号转换成实际的物理地址。

## 6) 分配模块

分配模块的主要功能是管理辅存空间，即负责分配辅存空闲空间和回收辅存空间。

## 7) 设备管理程序模块

设备管理程序模块的主要功能是分配设备、分配设备读写用缓冲区、磁盘调度、启动设备、处理设备中断、释放设备读写缓冲区、释放设备等。

# 文件系统的实现：目录实现和文件实现

## 目录实现

在读文件前，必须先打开文件。打开文件时，操作系统利用路径名找到相应目录项，目录项中提供了查找文件磁盘块所需要的信息。目录实现的基本方法有线性列表和哈希表两种。

### 1) 线性列表

最简单的目录实现方法是使用存储文件名和数据块指针的线性表。

创建新文件时，必须首先搜索目录表以确定没有同名的文件存在，然后在目录表后增加一个目录项。删除文件则 根据给定的文件名搜索目录表，接着释放分配给它的空间。

若要重用目录项，有许多方法：可以将目录项标记为不再使用，或者将它加到空闲目录项表上，还可以将目录表中最后一个 目录项复制到空闲位置，并降低目录表长度。釆用链表结构可以减少删除文件的时间。其优 点在于实现简单，不过由于线性表的特殊性，比较费时。

### 2) 哈希表

哈希表根据文件名得到一个值，并返回一个指向线性列表中元素的指针。

这种方法的优点是查找非常迅速，插入和删除也较简单，不过需要一些预备措施来避免冲突。最大的困难 是哈希表长度固定以及哈希函数对表长的依赖性。

目录查询是通过在磁盘上反复搜索完成，需要不断地进行I/O操作，开销较大。

所以如前面所述，为了减少I/O操作，把当前使用的文件目录复制到内存，以后要使用该文件时只要在内存中操作，从而降低了磁盘操作次数，提高了系统速度。

# 文件实现

## 1. 文件分配方式

文件分配对应于文件的物理结构，是指如何为文件分配磁盘块。

常用的磁盘空间分配方法有三种：连续分配、链接分配和索引分配。

有的系统（如RD0S操作系统）对三种方法都支持，但是更普遍的是一个系统只提供一种方法的支持。

### 1) 连续分配。

连续分配方法要求每个文件在磁盘上占有一组连续的块，如图4-12所示。 

磁盘地址定义了磁盘上的一个线性排序。这种排序使作业访问磁盘时需要的寻道数和寻道时间最小。

- 图4-12  连续分配

![输入图片说明](https://images.gitee.com/uploads/images/2020/1006/213410_900ec7bc_508704.png)

文件的连续分配可以用第一块的磁盘地址和连续块的数量来定义。

如果文件有n块长并 从位置b开始，那么该文件将占有块b, b+1, b+2, …, b+n-1。 一个文件的目录条目包括开始块的地址和该文件所分配区域的长度。

连续分配支持顺序访问和直接访问。其优点是实现简单、存取速度快。

缺点在于，文件长度不宜动态增加，因为一个文件末尾后的盘块可能已经分配给其他文件，一旦需要增加， 就需要大量移动盘块。

此外，反复增删文件后会产生外部碎片（与内存管理分配方式中的碎 片相似)，并且很难确定一个文件需要的空间大小，因而只适用于长度固定的文件。

### 2) 链接分配。

链接分配是釆取离散分配的方式，消除了外部碎片，故而显著地提高了磁盘空间的利用率；又因为是根据文件的当前需求，为它分配必需的盘块，当文件动态增长时，可以动态地再为它分配盘块，故而无需事先知道文件的大小。

此外，对文件的增、删、改也非常方便。链接分配又可以分为隐式链接和显式链接两种形式。

隐式连接如图4-13所示。每个文件对应一个磁盘块的链表；

磁盘块分布在磁盘的任何地方，除最后一个盘块外，每一个盘块都有指向下一个盘块的指针，这些指针对用户是透明的。目录包括文件第一块的指针和最后一块的指针。

创建新文件时，目录中增加一个新条目。每个目录项都有一个指向文件首块的指针。该 指针初始化为NULL以表示空文件，大小字段为0。写文件会通过空闲空间管理系统找到空 闲块，将该块链接到文件的尾部，以便写入。读文件则通过块到块的指针顺序读块。

隐式链接分配的缺点在于无法直接访问盘块，只能通过指针顺序访问文件，以及盘块指针消耗了一定的存储空间。

隐式链接分配的稳定性也是一个问题，系统在运行过程中由于软件或者硬件错误导致链表中的指针丢失或损坏，会导致文件数据的丢失。


- 图4-13  隐式链接分配

![输入图片说明](https://images.gitee.com/uploads/images/2020/1006/213602_4a2a5177_508704.png "屏幕截图.png")

显式链接，是指把用于链接文件各物理块的指针，显式地存放在内存的一张链接表中。 

该表在整个磁盘仅设置一张，每个表项中存放链接指针，即下一个盘块号。

在该表中，凡是属于某一文件的第一个盘块号，或者说是每一条链的链首指针所对应的盘块号，均作为文件 地址被填入相应文件的FCB的“物理地址”字段中。由于查找记录的过程是在内存中进行的，因而不仅显著地提高了检索速度，而且大大减少了访问磁盘的次数。

由于分配给文件的所有盘块号都放在该表中，故称该表为文件分配表（File Allocation Table, FAT)。

### 3) 索引分配。

链接分配解决了连续分配的外部碎片和文件大小管理的问题。

但是，链接分配不能有效支持直接访问（FAT除外）。

索引分配解决了这个问题，它把每个文件的所 有的盘块号都集中放在一起构成索引块（表），如图4-14所示。

- 图4-14  索引分配

![输入图片说明](https://images.gitee.com/uploads/images/2020/1006/213741_77eba8a2_508704.png "屏幕截图.png")

每个文件都有其索引块，这是一个磁盘块地址的数组。索引块的第i个条目指向文件的第i个块。目录条目包括索引块的地址。

要读第i块，通过索引块的第i个条目的指针来查找和读入所需的块。

创建文件时，索引块的所有指针都设为空。

当首次写入第i块时，先从空闲空间中取得一个块，再将其地址写到索引块的第i个条目。索引分配支持直接访问，且没有外部碎片问题。

其缺点是由于索引块的分配，增加了系统存储空间的开销。索引块的大小是一个重要的问题，每个文件必须有一个索引块，因此索引块应尽可能小，但索引块太小就无法支持大文件。可以釆用以下机制来处理这个问题。

链接方案：一个索引块通常为一个磁盘块，因此，它本身能直接读写。为了处理大文件，可以将多个索引块链接起来。

多层索引：多层索引使第一层索引块指向第二层的索引块，第二层索引块再指向文件块。这种方法根据最大文件大小的要求，可以继续到第三层或第四层。例如，4096B的块，能在 索引块中存入1024个4B的指针。两层索引允许1048576个数据块，即允许最大文件为4GB。

混合索引：将多种索引分配方式相结合的分配方式。例如，系统既釆用直接地址，又采 用单级索引分配方式或两级索引分配方式。

- 表4-2是三种分配方式的比较。

![输入图片说明](https://images.gitee.com/uploads/images/2020/1006/213949_5c3f8f9d_508704.png "屏幕截图.png")

此外，访问文件需要两次访问外存——首先要读取索引块的内容，然后再访问具体的磁盘块，因而降低了文件的存取速度。

为了解决这一问题，通常将文件的索引块读入内存的缓冲区中，以加快文件的访问速度。

# 2. 文件存储空间管理

## 1) 文件存储器空间的划分与初始化。

一般来说，一个文件存储在一个文件卷中。

文件卷可以是物理盘的一部分，也可以是整个物理盘，支持超大型文件的文件卷也可以由多个物理盘组成，如图4-15所示。

在一个文件卷中，文件数据信息的空间（文件区）和存放文件控制信息FCB的空间（目录区）是分离的。

由于存在很多种类的文件表示和存放格式，所以现代操作系统中一般都有 很多不同的文件管理模块，通过它们可以访问不同格式的逻辑卷中的文件。

逻辑卷在提供文件服务前，必须由对应的文件程序进行初始化，划分好目录区和文件区，建立空闲空间管理 表格及存放逻辑卷信息的超级块。

## 2) 文件存储器空间管理。

文件存储设备分成许多大小相同的物理块，并以块为单位交换信息，因此，文件存储设备的管理实质上是对空闲块的组织和管理，它包括空闲块的组织、分配与回收等问题。

- 图4-15  逻辑卷与物理盘的关系

![输入图片说明](https://images.gitee.com/uploads/images/2020/1006/221032_ae11bd48_508704.png "屏幕截图.png")

### ①空闲表法

空闲表法属于连续分配方式，它与内存的动态分配方式类似，为每个文件分配一块连续的存储空间。

系统为外存上的所有空闲区建立一张空闲盘块表，每个空闲区对应于一个空闲表项，其中包括表项序号、该空闲区第一个盘块号、该区的空闲盘块数等信息。再将所有空闲区按其起始盘块号递增的次序排列，见表4-3。

- 表4-3 空闲盘块表

![输入图片说明](https://images.gitee.com/uploads/images/2020/1006/221228_f35cbb70_508704.png)

空闲盘区的分配与内存的动态分配类似，同样是釆用首次适应算法、循环首次适应算法等。

例如，在系统为某新创建的文件分配空闲盘块时，先顺序地检索空闲盘块表的各表项，直至找到第一个其大小能满足要求的空闲区，再将该盘区分配给用户，同时修改空闲盘块表。 

系统在对用户所释放的存储空间进行回收时，也釆取类似于内存回收的方法，即要考虑回收区是否与空闲表中插入点的前区和后区相邻接，对 相邻接者应予以合并。

### ②空闲链表法

将所有空闲盘区拉成一条空闲链，根据构成链所用的基本元素不同，可把链表分成两种形式：空闲盘块链和空闲盘区链。

空闲盘块链是将磁盘上的所有空闲空间，以盘块为单位拉成一条链。

当用户因创建文件而请求分配存储空间时，系统从链首开始，依次摘下适当的数目的空闲盘块分配给用户。

当用户因删除文件而释放存储空间时，系统将回收的盘块依次插入空闲盘块链的末尾。

这种方法的优点是分配和回收一个盘块的过程非常简单，但在为一个文件分配盘块时，可能要重复多次操作。

空闲盘区链是将磁盘上的所有空闲盘区（每个盘区可包含若干个盘块）拉成一条链。

在每个盘区上除含有用于指示下一个空闲盘区的指针外，还应有能指明本盘区大小（盘块数）的信息。

分配盘区的方法与内存的动态分区分配类似，通常釆用首次适应算法。在回收盘区时，同样也要将回收区与相邻接的空闲盘区相合并。

### ③位示图法

位示图是利用二进制的一位来表示磁盘中一个盘块的使用情况，磁盘上所有的盘块都有一个二进制位与之对应。

当其值为“0”时，表示对应的盘块空闲；当其值为“1”时，表示 对应的盘块已分配。位示图法示意如图4-16所示。

- 盘块的分配：

顺序扫描位示图，从中找出一个或一组其值为“0”的二进制位。

将所找到的一个或一组二进制位，转换成与之对应的盘块号。

假定找到的其值为“0” 的二进制位，位于位示图的第i行、第j列，则其相应的盘块号应按下式计算（n代表每行 的位数）：

```
b = n (i-1) + j
```

修改位示图，令map[i, j] = 1。

- 盘块的回收

将回收盘块的盘块号转换成位示图中的行号和列号。

转换公式为

```
i=(b-1)DIVn+l
j=(b-l)MOD n+1
```

修改位示图，令map[i, j] = 0。

### ④成组链接法

空闲表法和空闲链表法都不适合用于大型文件系统，因为这会使空闲表或空闲链表太大。

在UNIX系统中釆用的是成组链接法，这种方法结合了空闲表和空闲链表两种方法，克服了表太大的缺点。

其大致的思想是:把顺序的n个空闲扇区地址保存在第一个空闲扇区内，其后一个空闲扇区内则保存另一顺序空闲扇区的地址，如此继续，直至所有空闲扇区均予以链接。

系统只需要保存一个指向第一个空闲扇区的指针。

假设磁盘最初全为空闲扇区；其成组链接如图4-17所示。

通过这种方式可以迅速找到大批空闲块地址。

- 图4-17 成组链接法示意图

![输入图片说明](https://images.gitee.com/uploads/images/2020/1006/223059_867acab5_508704.png "屏幕截图.png")

表示文件存储器空闲空间的“位向量”表或第一个成组链块以及卷中的目录区、文件区划分信息都需要存放在辅存储器中，一般放在卷头位置，在UNIX系统中称为“超级块”。 

在对卷中文件进行操作前，“超级块”需要预先读入系统空间的主存，并且经常保持主存“超级块”与辅存卷中“超级块”的一致性。

注意：本书如无特别提示，所使用的位示图法，行和列都是从1开始编号。

特别注意，如果题目中指明从0开始编号，则上述的计算方法要进行相应调整。

# 参考资料

[操作系统的基本概念](http://c.biancheng.net/cpp/html/2579.html)

https://lgwain.gitbooks.io/os/content/unit11.html

* any list
{:toc}