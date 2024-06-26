---
layout: post
title: windows bat 脚本教程-14-return code 返回编码
date:  2016-11-30 14:14:36 +0800
categories: [Windows]
tags: [windows, shell, bat]
published: true
---

# 错误码

**常见的退出代码及其描述**

| 错误代码 | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| 0        | 程序成功完成。                                               |
| 1        | 不正确的功能。指示在 Windows 命令提示符 cmd.exe 中尝试执行无法识别的命令。 |
| 2        | 找不到指定的文件。指示文件无法在指定位置找到。               |
| 3        | 找不到指定的路径。指示找不到指定的路径。                     |
| 5        | 拒绝访问。指示用户对指定资源没有访问权限。                   |
| 9009     | 0x2331<br/>程序未被识别为内部或外部命令、可操作的程序或批处理文件。指示在配置操作时命令、应用程序名称或路径拼写错误。 |
| 221225495<br/>0xC0000017<br/>-1073741801 | 虚拟内存不足。表示 Windows 已耗尽内存。                        |
| 3221225786<br/>0xC000013A<br/>-1073741510 | 应用程序由于 CTRL+C 终止。表示应用程序已由用户的键盘输入 CTRL+C 或 CTRL+Break，或关闭命令提示符窗口而终止。 |
| 3221225794<br/>0xC0000142<br/>-1073741502 | 应用程序无法正确初始化。表示应用程序已在当前用户无访问权限的桌面上启动。另一个可能的原因是 gdi32.dll 或 user32.dll 未能初始化。 |

这些错误代码有助于确定命令行执行的结果，并帮助解决问题。

# **错误级别**

环境变量 %ERRORLEVEL% 包含最后执行的程序或脚本的返回代码。

默认情况下，检查 ERRORLEVEL 的方式如下所示。

**语法**
```batch
IF %ERRORLEVEL% NEQ 0 ( 
   DO_Something 
)
```

通常，在批处理文件的末尾使用命令 EXIT /B %ERRORLEVEL% 返回批处理文件的错误代码。

在批处理文件的末尾使用 EXIT /B 将停止批处理文件的执行。

在批处理文件的末尾使用 EXIT /B < exitcodes > 返回自定义返回代码。

环境变量 %ERRORLEVEL% 包含批处理文件中最新的错误级别，即最后执行的命令的最新错误代码。在批处理文件中，使用环境变量而不是常量值是一种良好的做法，因为相同的变量在不同计算机上会扩展为不同的值。

让我们看一个快速示例，演示如何从批处理文件中检查错误代码。

**示例**
假设我们有一个名为 Find.cmd 的批处理文件，其中包含以下代码。在代码中，我们明确指定如果找不到名为 lists.txt 的文件，则应将错误级别设置为 7。同样，如果我们发现未定义变量 userprofile，则应将错误级别代码设置为 9。

```batch
if not exist c:\lists.txt exit 7 
if not defined userprofile exit 9 
exit 0
```

假设我们有另一个名为 App.cmd 的文件，首先调用 Find.cmd。现在，如果 Find.cmd 返回一个错误，其中它将错误级别设置为大于 0，那么它将退出程序。在以下批处理文件中，在调用 Find.cnd find 后，它实际上检查错误级别是否大于 0。

```batch
Call Find.cmd

if errorlevel gtr 0 exit 
echo “Successful completion”
```

**输出**
在上述程序中，可能会有以下情景作为输出:

- 如果文件 c:\lists.txt 不存在，则控制台输出中将不会显示任何内容。
- 如果变量 userprofile 不存在，则控制台输出中将不会显示任何内容。
- 如果上述两个条件都通过，则在命令提示符中显示字符串 “Successful completion”。


# **循环**

在决策制作章节中，我们已经看到了按顺序执行的语句。此外，也可以在批处理脚本中实现控制流的更改。

然后，它们被分类为控制流语句。

| 序号 | 循环及描述                                               |
| ---- | -------------------------------------------------------- |
| 1    | While 语句实现                                           |
| 2    | For 语句 - 列表实现                                      |
| 3    | 通过范围循环                                             |
| 4    | 经典的 for 循环实现                                      |
| 5    | 循环遍历命令行参数                                       |
| 6    | Break 语句实现                                           |

**While 语句实现**

Batch Script 中没有直接的 while 语句，但是我们可以很容易地通过使用 if 语句和标签来实现这个循环。

**For 语句 - 列表实现**

"FOR" 结构为批处理文件提供了循环功能。以下是与一组值一起使用 'for' 语句的常用构造。

**通过范围循环**

‘for’ 语句还可以移动到一系列值。以下是语句的一般形式。

**经典的 for 循环实现**

以下是大多数编程语言中都可用的经典 ‘for’ 语句。

**循环遍历命令行参数**

‘for’ 语句也可以用于检查命令行参数。以下示例显示了如何使用 ‘for’ 语句循环遍历命令行参数。

**示例**
```batch
@ECHO OFF 
:Loop 

IF "%1"=="" GOTO completed 
FOR %%F IN (%1) DO echo %%F 
SHIFT 
GOTO Loop 
:completed
```

**输出**
假设我们上面的代码存储在一个名为 Test.bat 的文件中。如果批处理文件将命令行参数 1、2 和 3 传递给 Test.bat，则上述命令将产生以下输出。

```
1 
2 
3
```

**Break 语句实现**

break 语句用于更改任何编程语言中循环内的控制流。break 语句通常用于循环结构，并用于立即终止最内层的循环。


# chat

## 详细介绍下 bat 的返回码

在批处理（Batch）文件中，返回码（Exit Code）是一个数字，它表示命令或程序执行完成后的状态。返回码用于指示命令是否成功执行，以及执行的结果是否符合预期。在批处理编程中，返回码非常重要，因为它们允许脚本来根据前一个命令的执行结果进行条件判断和流程控制。

### 返回码的基本概念

- **成功返回码**：通常，返回码 `0` 表示命令或程序成功执行，没有错误发生。
- **错误返回码**：非零返回码通常表示命令执行出错或未能按预期完成。不同的错误返回码可以表示不同类型的错误或状态。

### 使用返回码

在批处理文件中，可以使用 `errorlevel` 变量来引用前一个命令的返回码。这个变量在命令执行后立即更新，可以用来进行条件判断。

### 示例

```bat
@echo off
rem 执行一个命令，比如dir
dir nonExistentFile

rem 检查返回码
if errorlevel 1 (
    echo The file or directory was not found.
) else (
    echo The command was successful.
)
```

在上面的示例中，如果 `dir` 命令成功找到文件或目录，则 `errorlevel` 将为 `0`；如果文件或目录不存在，`errorlevel` 将为 `1`。

### 特殊返回码

- `0`：成功完成，没有错误。
- `1`：错误发生，通常是通用错误指示。
- `2`：意味着命令被正确解释，但执行时出现错误，如 `dir` 找不到指定的文件。

### 修改返回码

在批处理文件中，可以使用 `exit /b` 命令来设置批处理脚本的返回码，并从批处理文件中退出。这对于从批处理文件中传递执行状态给调用它的程序或脚本非常有用。

```bat
@echo off
rem 一些命令...

rem 根据条件设置返回码
if some_condition (
    echo Success
    exit /b 0
) else (
    echo Failure
    exit /b 1
)
```

### 注意事项

- 批处理文件的默认返回码是最后一个执行命令的返回码。
- 使用 `exit` 命令（不带 `/b`）将退出整个批处理脚本，并且不能从批处理文件中传递返回码。
- 在批处理文件中，返回码是区分命令执行成功与否的关键，因此正确地使用和解释返回码对于脚本的健壮性至关重要。

返回码是批处理脚本中进行条件逻辑和错误处理的重要工具，通过它们可以实现更加复杂和灵活的批处理自动化任务。

# 参考资料

https://www.tutorialspoint.com/batch_script/batch_script_return_code.htm

* any list
{:toc}