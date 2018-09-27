# eslint 提高代码规范性

## 安装包

```
"eslint": "^4.16.0",
"eslint-config-standard": "^11.0.0-beta.0",
"eslint-plugin-import": "^2.8.0",
"eslint-plugin-node": "^5.2.1",
"eslint-plugin-promise": "^3.6.0",
"eslint-plugin-standard": "^3.0.1",
```
eslint 使用 eslint-config-standard 作为检测标准，而eslint-config-standard则依赖其他的插件完成功能。

## 配置全局rc文件
```
{
    "extends": "standard",
    "plugins": [
        "html"
    ]
}
```
由于vue不是标准的js文件，因此安装`"eslint-plugin-html": "^4.0.1",` 这个插件来解析vue文件。安装完成后在全局配置文件中配置plugins即可。

## 配置npm run命令
```
"lint": "eslint --ext .js --ext .jsx --ext .vue client/",
"lint-fix": "eslint --fix --ext .js --ext .jsx --ext .vue client/",
```
lint 用来检测client/目录下的代码是否规范，lint-fix则会自动修复不规范的代码。

## 开发过程自动检测

安装两个包
```
"babel-eslint": "^8.2.1",
"eslint-loader": "^1.9.0",
```

```
{
    "extends": "standard",
    "plugins": [
        "html"
    ],
    "parser": "babel-eslint"
}
```

由于代码都是babel处理过的，有些babel的语法可能eslint不能很好的支持，因此一般会使用这个parser。

配置webpackloader

```
{
    test: /\.(vue|js|jsx)$/,
    loader: 'eslint-loader',
    exclude: /node_modules/,
    enforce: 'pre'
}
```

我们希望每次webpack工作的第一步是检测我们的代码，因此加上`enforce: 'pre'`配置，`/node_modules/`中的代码都是检测编译过的，并且是ES5的语法，因此不需要进行检测。

# .editorconfig的使用

.editorconfig 是用来规范不同编辑器之间的行为，vscode需要安装插件进行支持，webstrom默认有这个插件。

```
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 4
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
```

分行解释
- 读文件读到这个配置就可以了，不需要继续搜索
- ...

# 使用husky（哈士奇）在代码提交之前做代码eslint检查
## 安装husky
```
"husky": "^0.14.3",
```

安装完后，会自动在.git下生成一个hook，用于检测提交。因此首先确认项目在git的管理下。
## 配置

```
"precommit": "npm run lint-fix",
```

# MISC
vue-loader有一个强大的功能就是自定义模块，默认在vue文件中有`<template>` `<script>` `<style>` 三个模块，我们依然可以自定义这种模块，refer to `第2章 Vue+Webpack的前端工程工作流搭建/2-2 vue-loader配置`

# SSR做的那些事
对于像vue，react之类的框架，我们一般会通过webpack进行打包，从而生成一个（或几个）bundle的js文件，而这些js文件中包括正常页面交互的js，并且还有样式文件，甚至一些体积较小的图片被转成base64的格式放在里面。这些文件会一并被浏览器请求过去，当这些js文件在正常执行内部的逻辑之前，里面的webpack会先把里面的js，css甚至图片等插入到事先定义好的摸板中，之后才能执行我们熟知的页面逻辑。而SSR则是在将这部分“里面的webpack会先把里面的js，css甚至图片等插入到事先定义好的摸板中”放在服务器端执行。
