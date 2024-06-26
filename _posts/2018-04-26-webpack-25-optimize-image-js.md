---
layout: post
title:  WebPack-25-优化前端资源加载 1 - 图片加载优化和代码压缩
date:  2018-04-23 21:59:43 +0800
categories: [WebPack]
tags: [js, webpack]
published: true
---

# 图片加载优化和代码压缩

前面我们已经提及如何使用 webpack 来满足不同环境的构建需求，其中在生产环境构建时会做额外的一些工作，例如代码压缩等。这一部分的工作就是这一小节的主题，即优化前端资源的加载性能。

我们总是希望浏览器在加载页面时用的时间越短越好，所以构建出来的文件应该越少越小越好，一来减少浏览器需要发起请求的数量，二来减少下载静态资源的时间。

其实 webpack 把多个代码文件打包成几个必需的静态资源，已经很大程度减少了静态资源请求数量了，接下来我们来介绍下如何使用 webpack 实现更多的前端资源加载的优化需求。

# CSS Sprites

CSS Sprites 技术是前端领域一种很常见的用于减少图片资源请求数的优化方式，这里不做详细的介绍。

在了解 webpack 配置之前，需要明白 CSS Sprites 的原理。

如果你使用的 webpack 3.x 版本，需要 CSS Sprites 的话，可以使用 webpack-spritesmith 或者 sprite-webpack-plugin。

我们以 webpack-spritesmith 为例，先安装依赖：

```
npm install webpack-spritesmith --save-dev
```

在 webpack 的配置中应用该插件：

```js
module: {
  loaders: [
    // ... 这里需要有处理图片的 loader，如 file-loader
  ]
},
resolve: {
  modules: [
    'node_modules', 
    'spritesmith-generated', // webpack-spritesmith 生成所需文件的目录
  ],
},
plugins: [
  new SpritesmithPlugin({
    src: {
      cwd: path.resolve(__dirname, 'src/ico'), // 多个图片所在的目录
      glob: '*.png' // 匹配图片的路径
    },
    target: {
      // 生成最终图片的路径
      image: path.resolve(__dirname, 'src/spritesmith-generated/sprite.png'), 
      // 生成所需 SASS/LESS/Stylus mixins 代码，我们使用 Stylus 预处理器做例子
      css: path.resolve(__dirname, 'src/spritesmith-generated/sprite.styl'), 
    },
    apiOptions: {
      cssImageRef: "~sprite.png"
    },
  }),
],
```

在你需要的样式代码中引入 sprite.styl 后调用需要的 mixins 即可：

```js
@import '~sprite.styl'

.close-button
    sprite($close)
.open-button
    sprite($open)
```

更多的 webpack-spritesmith 配置可以参考：[Config of webpack-spritesmith](https://github.com/mixtur/webpack-spritesmith#config)。

遗憾的是，上面提到的这两个 plugin 还没更新到支持 webpack 4.x 版本，如果你使用的是 webpack 4.x，你需要配合使用 postcss 和 postcss-sprites，才能实现 CSS Sprites 的相关构建。

# 图片压缩

在一般的项目中，图片资源会占前端资源的很大一部分，既然代码都进行压缩了，占大头的图片就更不用说了。

我们之前提及使用 file-loader 来处理图片文件，在此基础上，我们再添加一个 image-webpack-loader 来压缩图片文件。

简单的配置如下：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {}
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { // 压缩 jpeg 的配置
                progressive: true,
                quality: 65
              },
              optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                enabled: false,
              },
              pngquant: { // 使用 imagemin-pngquant 压缩 png
                quality: '65-90',
                speed: 4
              },
              gifsicle: { // 压缩 gif 的配置
                interlaced: false,
              },
              webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                quality: 75
              },
          },
        ],
      },
    ],
  },
}
```

image-webpack-loader 的压缩是使用 imagemin 提供的一系列图片压缩类库来处理的，如果需要进一步了解详细的配置，可以查看对应类库的官方文档 usage of image-webpack-loader。

# 使用 DataURL

有的时候我们的项目中会有一些很小的图片，因为某些缘故并不想使用 CSS Sprites 的方式来处理（譬如小图片不多，因此引入 CSS Sprites 感觉麻烦），那么我们可以在 webpack 中使用 url-loader 来处理这些很小的图片。

url-loader 和 file-loader 的功能类似，但是在处理文件的时候，可以通过配置指定一个大小，当文件小于这个配置值时，url-loader 会将其转换为一个 base64 编码的 DataURL，配置如下：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 单位是 Byte，当文件小于 8KB 时作为 DataURL 处理
            },
          },
        ],
      },
    ],
  },
}
```

更多关于 url-loader 的配置可以参考官方文档 [url-loader](https://github.com/webpack-contrib/url-loader)，一般情况仅使用 limit 即可。

# 代码压缩

webpack 4.x 版本运行时，mode 为 production 即会启动压缩 JS 代码的插件，而对于 webpack 3.x，使用压缩 JS 代码插件的方式也已经介绍过了。

在生产环境中，压缩 JS 代码基本是一个必不可少的步骤，这样可以大大减小 JavaScript 的体积，相关内容这里不再赘述。

除了 JS 代码之外，我们一般还需要 HTML 和 CSS 文件，这两种文件也都是可以压缩的，虽然不像 JS 的压缩那么彻底（替换掉长变量等），只能移除空格换行等无用字符，但也能在一定程度上减小文件大小。

在 webpack 中的配置使用也不是特别麻烦，所以我们通常也会使用。

对于 HTML 文件，之前介绍的 html-webpack-plugin 插件可以帮助我们生成需要的 HTML 并对其进行压缩：

```js
module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'assets/index.html', // 配置文件模板
      minify: { // 压缩 HTML 的配置
        minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
        minifyJS: true // 压缩 HTML 中出现的 JS 代码
      }
    }),
  ],
}
```

如上，使用 minify 字段配置就可以使用 HTML 压缩，这个插件是使用 html-minifier 来实现 HTML 代码压缩的，minify 下的配置项直接透传给 html-minifier，配置项参考 html-minifier 文档即可。

对于 CSS 文件，我们之前介绍过用来处理 CSS 文件的 css-loader，也提供了压缩 CSS 代码的功能：

```js
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.css/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true, // 使用 css 的压缩功能
            },
          },
        ],
      },
    ],
  }
}
```

在 css-loader 的选项中配置 minimize 字段为 true 来使用 CSS 压缩代码的功能。css-loader 是使用 cssnano 来压缩代码的，minimize 字段也可以配置为一个对象，来将相关配置传递给 cssnano。更多详细内容请参考 cssnano 官方文档。

# 小结

由于优化前端资源加载这个主题相关的内容比较多，所以拆分成多个小节。本小节先介绍了比较基础的部分：CSS Sprites、图片压缩、使用 DataURL，以及基本的代码压缩，接下来的第 10、11 小节还会继续围绕前端资源加载优化的这个主题，介绍更加深入的内容。


# 参考资料

https://www.kancloud.cn/sllyli/webpack/1242352

* any list
{:toc}