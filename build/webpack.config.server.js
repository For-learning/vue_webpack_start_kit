const path = require('path')
const ExtractPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

let config

const isDev = process.env.NODE_ENV === 'development'

const plugins = [
  new ExtractPlugin('styles.[contentHash:8].css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // 官方推荐ssr的配置
    'process.env.VUE_ENV': '"server"'
  })
]

/**
 * 服务端渲染最重要的kernal包
 * ？？？会帮我将整个打包过程通过json文件输出，规避很多逻辑处理
 */
if (isDev) {
  plugins.push(new VueServerPlugin())
}

config = merge(baseConfig, {
  /**
   * 指定打包出来的程序是在node端运行的
   */
  target: 'node',
  entry: path.join(__dirname, '../client/server-entry.js'),
  /**
   * 使用source-map，webpack的server render能给我们一个代码调试的功能
   */
  devtool: 'source-map',
  /**
   * 制定我们的程序入口文件符合commonjs2规范，因为我们的程序是在node端跑的
   */
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server-entry.js',
    path: path.join(__dirname, '../server-build')
  },
  /**
   * 代码是运行在服务端的，如果需要什么包直接引用就可以了
   * 这个配置告诉webpack在打包的时候不需要将vue的类库等都打包到 server-entry.js 中
   * 由于在服务端，直接读取 package.json 然后直接引用就可以了
   */
  externals: Object.keys(require('../package.json').dependencies),
  module: {
    rules: [
      /**
       * css进行单独文件打包，注意，这里面不能有类似dom操作一类的将css插入到html的方式，这是服务端
       */
      {
        test: /\.styl/,
        use: ExtractPlugin.extract({
          fallback: 'vue-style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        })
      }
    ]
  },
  plugins
})

config.resolve = {
  alias: {
    'model': path.join(__dirname, '../client/model/server-model.js')
  }
}

module.exports = config
