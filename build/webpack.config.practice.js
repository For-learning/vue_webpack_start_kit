const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

/**
 * 使用webpack-dev-server启动实时开发环境
 */
const devServer = {
  port: 9090,
  host: '0.0.0.0',
  // 将出现的错误出现在网页上，以便更好的提示
  overlay: {
    errors: true
  },
  // 热替换，只替换当前修改的组件，要配合下面的 HotModuleReplacementPlugin 使用
  hot: true,
  // 自动打开浏览器
  // open: true
}

// Define config
let config

config = merge(baseConfig, {
  /**
   * 给vue/dist/vue.js起一个别名，当webpack进行打包的时候会引入vue/dist/vue.js文件
   * 因为默认会引入vue.commom.js文件，这样无法使用html-webpack-plugin的template挂载功能，必须使用全功能的vue.js
   * Reference: https://segmentfault.com/a/1190000006435886
   */
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  },
  /**
   * 最新指定哪种环境（dev/prod）的配置
   */
  mode: 'development',
  devServer,
  /**
   * 官方推荐的source map调试配置，方便浏览器中的代码调试
   */
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    /**
     * 一般vue，react之类的框架都会设置此属性：
     * 1. 首先这个变量在这里，在webpack打包的编译的过程中是可以引用到的
     * 2. 区分打包，因为vue会有不同版本的vue代码打包来分别适应dev环境和prod环境，比如开发环境需要丰富的信息提示等，
     * 而产品环境则需要更好的运行速度，这个配置会告诉webpack进行打包的时候使用不同的vue版本
     */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    /**
     * 使用html-webpack-plugin给vue指定一个挂载点
     */
    new HTMLPlugin({
      template: path.join(__dirname, './template.html')
    }),
    /**
     * 由于vue是组件化的，第一个插件开启组建热替换功能
     * 第二个减少无用的信息输出
     */
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})

module.exports = config