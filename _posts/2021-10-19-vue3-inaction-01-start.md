---
layout: post
title: 开篇：Vue CLI 3 项目构建基础
date: 2021-10-18 21:01:55 +0800
categories: [FrontEnd]
tags: [front-end, vue, web, source-code, sh]
published: true
---

# 序言 

大家好，当你点进这个标题，开始阅读本章的时候，说明你对 Vue.js 是充满好奇心和求知欲的。

我之前写过一篇文章，这样评价 Vue.js，称它是“简单却不失优雅，小巧而不乏大匠”的作品，正如其官网介绍的“易用，灵活和高效”那样。其实框架是 Vue.js 的本质，而真正了解它的人则会把它当成一件作品来欣赏。

Vue.js 作为一门轻量级、易上手的前端框架，从入门难度和学习曲线上相对其他框架来说算是占据优势的，越来越多的人开始投入 Vue.js 的怀抱，走进 Vue.js 的世界。

那么接下来屏幕前的你不妨一起来和我从零开始构建一个 Vue 项目，体会一下 Vue.js 的精彩绝伦。

# 依赖工具

在构建一个 Vue 项目前，我们先要确保你本地安装了 Node 环境以及包管理工具 npm，打开终端运行：

```
λ node -v  
v12.16.2   
           
λ npm -v   
6.14.13    
```

如果成功打印出版本号，说明你本地具备了 node 的运行环境，我们可以使用 npm 来安装管理项目的依赖，而如果没有或报错，则你需要去 node 官网进行 node 的下载及安装。

左边的版本是推荐安装的稳定版本，也就是目前已经被正式列入标准的版本，而右边的版本是当前最新的版本，该版本包含了一些新的特性，还未被完全列入标准，可能以后会有所变动。这里建议大家安装最新的 node 稳定版进行开发。


# 脚手架

当我们安装完 node 后便可以开始进行后续的构建工作了，那么这里我主要给大家介绍下最便捷的脚手架构建。

## 1. 什么是脚手架

很多人可能经常会听到“脚手架”三个字，无论是前端还是后台，其实它在生活中的含义是为了保证各施工过程顺利进行而搭设的工作平台。

因此作为一个工作平台，前端的脚手架可以理解为能够帮助我们快速构建前端项目的一个工具或平台。

## 2. vue-cli

其实说到脚手架，目前很多主流的前端框架都提供了各自官方的脚手架工具，以帮助开发者快速构建起自己的项目，比如 Vue、React 等，这里我们就来介绍下 Vue 的脚手架工具 vue-cli。

vue-cli 经历了几个版本的迭代，目前最新的版本是 3.x，也是本小册构建项目所使用的版本，我们一起来看下其人性化的构建流程：

### a. 安装

我们可以在终端通过以下命令全局安装 vue-cli：

```
# 安装 Vue CLI 3.x
npm i -g @vue/cli
```

如果你习惯使用 yarn，你也可以：

```
# 没有全局安装yarn需执行此命令
npm i -g yarn
yarn global add @vue/cli
```

注意因为是全局安装，所以 vue-cli 是全局的包，它和我们所处的项目没有关系。

同时我们这里介绍的 CLI 版本是最新的 3.x，它和 2.x 版本存在着很大的区别，具体的讲解会在后续章节中进行介绍。

ps: 会发现安装特别慢。可以使用 cnpm 进行安装。

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

然后

```
cnpm i -g @vue/cli 
```

版本查看：

```
vue -V

@vue/cli 4.5.14
```

### b. 构建

安装完 vue-cli 后，我们在你想要创建的项目目录地址下执行构建命令：

```
# my-project 是你的项目名称
vue create my-project
```

执行完上述命令后，会出现一系列的选择项，我们可以根据自己的需要进行选择，流程图如下：

比如：

```
vue create sensitive-word-h5
```

会提示我们选择模式

```
? Please pick a preset: (Use arrow keys)
> Default ([Vue 2] babel, eslint)
  Default (Vue 3) ([Vue 3] babel, eslint)
  Manually select features
```

此处我们选择 vue3，然后等待项目创建完成即可。

整体的创建流程：

![创建流程](https://img.kancloud.cn/9d/cd/9dcd0f19cd857a6578762b50c6432dc2_980x634.gif)

如果你只想构建一个基础的 Vue 项目，那么使用 Babel、Router、Vuex、CSS Pre-processors 就足够了，最后选择你喜欢的包管理工具 npm or yarn。

### c. 启动

等待构建完成后你便可以运行命令来启动你的 Vue 项目：

```
# 打开项目目录
cd sensitive-word-h5

npm run serve
```

启动日志：

```
 DONE  Compiled successfully in 4509ms                                                                                                                14:52:03


  App running at:
  - Local:   http://localhost:8080/
  - Network: http://172.31.30.124:8080/

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```

我们根据提示打开浏览器即可访问：

[http://localhost:8080/](http://localhost:8080/)

### d. 目录结构

最后脚手架生成的目录结构如下：

```
├── node_modules     # 项目依赖包目录
├── public
│   ├── favicon.ico  # ico图标
│   └── index.html   # 首页模板
├── src 
│   ├── assets       # 样式图片目录
│   ├── components   # 组件目录
│   ├── views        # 页面目录
│   ├── App.vue      # 父组件
│   ├── main.js      # 入口文件
│   ├── router.js    # 路由配置文件
│   └── store.js     # vuex状态管理文件
├── .gitignore       # git忽略文件
├── .postcssrc.js    # postcss配置文件
├── babel.config.js  # babel配置文件
├── package.json     # 包管理文件
└── yarn.lock        # yarn依赖信息文件
```

根据你安装时选择的依赖不同，最后生成的目录结构也会有所差异。

# 3. 可视化界面

当然，除了使用上述命令行构建外，vue-cli 3.x 还提供了可视化的操作界面，在项目目录下我们运行如下命令开启图形化界面：

```
vue ui
```

之后浏览器会自动打开本地 8000 端口，页面如下：

如果你还没有任何项目，那么可以点击创建或者直接导入现有的项目。

创建项目和我们使用命令行的步骤基本相同，完全可视化操作，一定程度上降低了构建和使用的难度。

项目创建或导入成功后你便可以进入项目进行可视化管理了。

在整个管理界面中，我们可以为自己的项目安装 CLI 提供的插件，比如安装 @vue/cli-plugin-babel 插件，同时我们也可以配置相应插件的配置项，进行代码的编译、热更新、检查等。详细的操作大家可以自己进行手动尝试，相信你会发现意想不到的惊喜。

# 你还需要了解什么

上方我们用 vue-cli 成功生成了一个最基础的 Vue 项目，麻雀虽小，五脏俱全，但是想要让麻雀飞起来，我们还要不断的给它进行拓展训练，那么我们还需要了解什么呢？

![vue](https://img.kancloud.cn/ed/59/ed593aa16ec2a02e0c6e4360d0fb6150_665x251.gif)

以上这些内容（包含但不限于）将会在本小册的接下来几章进行详细的讲解，你准备好了吗？

# 结语

本文主要讲述了使用 vue-cli 脚手架进行 Vue 项目构建的基本知识，从构建的流程中我们不难发现 Vue 提供给了我们一套非常灵活可配置的工具，其小巧而不乏大匠的魅力不言而喻。希望大家能够从构建开始，逐渐领略 Vue.js 的匠心，激发自己的对 Vue 的兴趣。

# 参考资料

https://www.kancloud.cn/sllyli/vueproject/1244252

* any list
{:toc}
