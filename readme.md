# 仓库介绍

根据 webpack 打包的流程，实现一个可以通过一个入口文件，生成一个 bundle 的小 demo

- 这里创建三个文件，表示一个简单的依赖关系，暂时不考虑复杂依赖图，主要为了实现 webpack 核心的打包流程
- 依赖关系: index.js --> foo.js --> const.js
- 输出结果: foo outpu --> hello myWebpack

## 运行myWebpack

`npm run build` 会输出bundle.js

实现代码在myWbapck.js中