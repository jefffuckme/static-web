---
layout: post
title: windows bat 脚本教程-18-device 设备
date:  2016-11-30 14:14:36 +0800
categories: [Windows]
tags: [windows, shell, bat]
published: true
---

# 设备

Windows现在具有一个改进的库，可以在批处理脚本中用于处理连接到系统的设备。这称为设备控制台 - DevCon.exe。

Windows驱动程序开发人员和测试人员可以使用DevCon来验证驱动程序是否正确安装和配置，包括正确的INF文件、驱动程序堆栈、驱动程序文件和驱动程序包。您还可以在脚本中使用DevCon命令（启用、禁用、安装、启动、停止和继续）来测试驱动程序。DevCon是一个命令行工具，可在本地计算机和远程计算机上执行设备管理功能。

DevCon可以显示本地计算机和远程计算机（运行Windows XP及更早版本）上驱动程序和设备的以下属性：

- 硬件ID、兼容ID和设备实例ID。这些标识符在设备识别字符串中有详细描述。
- 设备安装类。
- 设备安装类中的设备。
- INF文件和设备驱动程序文件。
- 驱动程序包的详细信息。
- 硬件资源。
- 设备状态。
- 预期的驱动程序堆栈。
- 驱动程序存储中的第三方驱动程序包。
  
DevCon可以按硬件ID、设备实例ID或设备安装类搜索本地或远程计算机上已安装和未安装的设备。

DevCon可以通过以下方式更改本地计算机上即插即用（PnP）设备的状态或配置：

- 启用设备。
- 禁用设备。
- 更新驱动程序（交互式和非交互式）。
- 安装设备（创建设备节点并安装软件）。
- 从设备树中删除设备并删除其设备堆栈。
- 重新扫描即插即用设备。
- 添加、删除和重新排序根枚举设备的硬件ID。
- 更改设备安装类的上层和下层过滤驱动程序。
- 从驱动程序存储中添加和删除第三方驱动程序包。

DevCon（DevCon.exe）包含在安装了WDK、Visual Studio和用于桌面应用程序的Windows SDK时。当安装时，DevCon.exe套件位于以下位置。

- %WindowsSdkDir%\tools\x64\devcon.exe
- %WindowsSdkDir%\tools\x86\devcon.exe
- %WindowsSdkDir%\tools\arm\devcon.exe

**语法**

```
devcon [/m:\\computer] [/r] command [arguments]
```

其中：

- `/m:\\computer`：在指定的远程计算机上运行命令。需要反斜杠。
- `/r`：条件重启。在完成操作后，仅在需要重新启动才会重新启动系统以使更改生效。
- `command`：指定DevCon命令。

**示例**

以下是使用DevCon命令的一些示例。

**列出所有驱动程序文件**

以下命令使用DevCon DriverFiles操作列出系统上使用的设备的驱动程序文件名。该命令使用通配符(*)表示系统上的所有设备。由于输出内容很多，命令使用重定向字符(>)将输出重定向到引用文件driverfiles.txt。

```
devcon driverfiles * > driverfiles.txt
```

**显示所有设备的状态**

以下命令使用DevCon status操作查找本地计算机上所有设备的状态。然后，将状态保存在status.txt文件中以进行日志记录或以供以后查看。该命令使用通配符(*)表示所有设备和重定向字符(>)将输出重定向到status.txt文件。

```
devcon status * > status.txt
```

**启用所有打印机设备**

以下命令通过在DevCon Enable命令中指定打印机安装类来启用计算机上的所有打印机设备。命令包括/r参数，如果需要使启用有效，则重新启动系统。

```
devcon /r enable = Printer
```

**安装键盘设备**

以下命令使用DevCon Install操作在本地计算机上安装键盘设备。命令包括设备的INF文件（keyboard.inf）的完整路径和硬件ID（*PNP030b）。

```
devcon /r install c:\windows\inf\keyboard.inf *PNP030b
```

**扫描新设备**

以下命令将扫描计算机以查找新设备。

```
devcon scan
```

**重新扫描新设备**

以下命令将重新扫描计算机以查找新设备。

```
devcon rescan
```

DevCon命令提供了强大的功能，可用于设备管理和驱动程序操作，是Windows批处理脚本中不可或缺的工具。

# chat

## Q: 详细介绍一下 bat 脚本中的设备

在批处理（.bat）脚本中，设备是指计算机系统中连接或安装的硬件设备，例如键盘、鼠标、打印机、显示器、网卡等。在批处理脚本中，可以通过一系列命令来管理和操作这些设备，例如安装、卸载、启用、禁用等。下面是关于批处理脚本中设备的详细介绍：

**1. 设备的表示方式：** 在批处理脚本中，设备通常通过其硬件ID（Hardware ID）或设备实例ID（Device Instance ID）来标识和操作。硬件ID是设备的唯一标识符，而设备实例ID则是设备在系统中的唯一实例标识符。

**2. 设备操作命令：** 批处理脚本中可以使用一系列命令来管理和操作设备，包括：

- 安装设备：通过安装相应的驱动程序来将设备添加到系统中。
- 卸载设备：从系统中移除设备及其相关的驱动程序。
- 启用设备：启用先前禁用的设备，使其可以正常工作。
- 禁用设备：禁用某个设备，使其停止工作。
- 更新设备驱动程序：更新设备的驱动程序以修复问题或提供新功能。
- 列出设备信息：列出系统中已安装的设备及其相关信息。

**3. 设备状态检查：** 通过批处理脚本可以检查设备的状态，例如是否已安装、是否启用等。这可以帮助用户了解系统中设备的当前状态。

**4. 设备驱动程序管理：** 设备通常需要相应的驱动程序才能正常工作。批处理脚本可以用于管理设备的驱动程序，例如安装、卸载、更新等操作。

**5. 设备管理工具：** 除了原生的Windows命令外，还可以使用一些第三方的设备管理工具，如前文提到的DevCon.exe。这些工具提供了更多的功能和选项，可以更灵活地管理设备。

综上所述，批处理脚本中的设备是系统中的硬件设备，通过一系列命令和工具可以对其进行管理和操作。设备管理在自动化系统配置、故障排除和系统维护中起着重要作用，批处理脚本是实现这些管理任务的有效工具之一。

## Q: 给出操作命令

以下是批处理脚本中常用的设备操作命令及其对应的操作：

**1. 安装设备：**
```batch
pnputil -i -a <INF文件路径>
```
其中，`<INF文件路径>`是设备驱动程序的INF文件路径。

**2. 卸载设备：**
```batch
pnputil -f -d <驱动程序名称>
```
其中，`<驱动程序名称>`是要卸载的设备驱动程序的名称。

**3. 启用设备：**
```batch
devcon enable <设备标识符>
```
其中，`<设备标识符>`是要启用的设备的标识符，可以是硬件ID或设备实例ID。

**4. 禁用设备：**
```batch
devcon disable <设备标识符>
```
其中，`<设备标识符>`是要禁用的设备的标识符，可以是硬件ID或设备实例ID。

**5. 更新设备驱动程序：**
```batch
pnputil -i -a <新的INF文件路径>
```
其中，`<新的INF文件路径>`是更新后的设备驱动程序的INF文件路径。

**6. 列出设备信息：**
```batch
devcon find *
```
此命令将列出系统中所有已安装设备的信息。

以上是一些常用的批处理脚本中设备操作的命令示例。这些命令可以根据具体的需求和情况进行调整和组合。

## 为什么 bat 需要提供设备的操作能力？提供了哪些可能性和风险

批处理脚本（.bat文件）需要提供设备的操作能力主要是为了满足以下需求和目的：

**1. 自动化系统配置：** 设备操作命令可以用于自动化系统配置过程，例如在系统初始化时安装必要的设备驱动程序，以确保系统正常运行。

**2. 系统维护和故障排除：** 设备操作命令可以用于系统维护和故障排除，例如卸载或更新问题驱动程序，启用或禁用特定设备以解决设备冲突或性能问题。

**3. 批量部署应用程序：** 设备操作命令可以与应用程序部署过程结合使用，确保在部署过程中设备驱动程序的正确安装和配置。

**4. 自定义系统配置：** 通过设备操作命令，可以根据特定需求自定义系统配置，例如根据不同的硬件配置启用或禁用特定设备。

虽然提供了设备操作能力可以带来一些便利和好处，但也存在一些潜在的风险和可能性：

**1. 误操作风险：** 错误使用设备操作命令可能导致系统设备驱动程序被损坏或不正确配置，进而影响系统稳定性和性能。

**2. 安全风险：** 设备操作命令可能被滥用或用于恶意目的，例如禁用系统关键设备、安装恶意驱动程序等，从而造成系统安全漏洞。

**3. 不可预测的结果：** 对设备进行操作可能会导致系统行为不稳定或产生意外结果，例如启用或禁用某些设备可能导致系统无法正常启动或运行。

**4. 兼容性问题：** 设备操作命令可能会导致与系统或其他设备的兼容性问题，特别是在不同的硬件环境或操作系统版本中。

因此，在使用设备操作命令时，需要谨慎考虑，并且应该遵循最佳实践和安全原则，确保操作的准确性和安全性。

最好在测试环境中进行测试，并备份系统数据以防止意外情况的发生。

# 参考资料

https://www.tutorialspoint.com/batch_script/batch_script_devices.htm

* any list
{:toc}