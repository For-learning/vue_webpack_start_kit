const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
// const merge = require('webpack-merge')
const ExtractPlugin = require('extract-text-webpack-plugin')


/**
 * process.env.NODE_ENV 可以取到 cross-env NODE_ENV=development 设置的值
 */
const isDev = process.env.NODE_ENV === 'development'

const config = {
  /**
   * 给vue/dist/vue.js起一个别名，当webpack进行打包的时候会引入vue/dist/vue.js文件
   * 因为默认会引入vue.commom.js文件，这样无法使用html-webpack-plugin的template挂载功能，必须使用全功能的vue.js
   * Reference: https://segmentfault.com/a/1190000006435886
   */
  // resolve: {
  //   alias: {
  //     'vue': 'vue/dist/vue.js'
  //   }
  // },
  /**
   * 从一个入口文件开始，爬取所有的依赖文件并将其打包为一个文件
   * - js文件会正常进行模块化打包
   * - css文件会将其打包到最终的文件，当浏览器进行解析的时候，会将其写入到html文件的style标签中
   */
  entry: path.join(__dirname, '../practice/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../dist'),
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      /**
       * 当处理jsx文件的时候，会读取.babelrc的配置，
       * 由于vue处理jsx的方式和react有点区别，因此需要transform-vue-jsx插件
       */
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [{
          /**
           * url-loader实际上封装了file-loader
           * 其加载所有的图片文件，如果图片大小小于1024，则将其转为base64位的字节码直接写入最终的js文件
           * 如果大于1024，则会单独打包
           */
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'resources/[path][name].[hash:8].[ext]'
          }
        }]
      }
    ]
  },
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
    })
  ],
  /**
   * 最新指定哪种环境（dev/prod）的配置
   */
  // mode: isDev ? '"development"' : '"production"'
}

// DEVELOPMENT ENV #################################################################
if (isDev) {
  config.output.filename = 'bundle.[hash:8].js'
  /**
   * 官方推荐的source map调试配置，方便浏览器中的代码调试
   */
  config.devtool = '#cheap-module-eval-source-map'
  config.module.rules.push(
    /**
     * use 是使用多个loader
     * 最下面的先执行，之后一层一层向上抛
     * 比如下面的loader
     * 1. 先通过stylus-loader编译.styl文件成为css文件
     * 2. 再通过css-loader从css文件中加载读取css文件
     * 3. 最后通过style-loader将其写成style的标签形式插入到html中，当然也可以使用其他loader将其单独打包
     */
    {
      test: /\.styl$/,
      use: [
        'style-loader',
        'css-loader',
        'stylus-loader'
      ],
    },
  )
  /**
   * 使用webpack-dev-server启动实时开发环境
   */
  config.devServer = {
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
  config.plugins.push(
    /**
     * 由于vue是组件化的，第一个插件开启组建热替换功能
     * 第二个减少无用的信息输出
     */
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
  // PRODUCTION ENV #################################################################
} else {
  /**
   * 通过这种方式进行单独打包，需要配合 webpack.optimize.CommonsChunkPlugin
   * 注意：webpack.optimize.CommonsChunkPlugin 的 vender 与下面的 vender 要对应
   */
  config.entry = {
    app: path.join(__dirname, '../practice/index.js'),
    vender: ['vue'],
  }
  config.output.filename = '[name].[chunkHash:8].js'
  config.module.rules.push(
    /**
     * use 是使用多个loader
     * 最下面的先执行，之后一层一层向上抛
     * ExtractPlugin 主要是当css-loader加载完css后将其单独打包
     */
    {
      test: /\.styl$/,
      use: ExtractPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'stylus-loader'
        ]
      })
    },
  )
  config.plugins.push(
    // 这里用contentHash，只有内容变了，文件名才会变
    new ExtractPlugin('styles.[contentHash:8].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vender'
    }),
    /**
     * app文件的开头会包含webpack的业务代码，
     * 这个功能是把webpack的业务代码抽取出来
     * 必须放在vender之下，不然chunkHash维护的长缓存就不起作用了ﬁ
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
  )
}

module.exports = config

/**
 * 关于hash和chunkHash的使用(config.output.filename = '[name].[chunkHash:8].js')：
 * 如果打包文件都使用hash的话，那么所以文件的hash码就都是一样的，在prod的环境下就没法使用浏览器的"长缓存"功能了
 * 文件单独打包的时候，chuukHash相当于每个打包分支都有一个hash码，这样当再次打包的时候，只有业务逻辑的hash变化了，库文件不会变化，也就能有效使用浏览器"长缓存"了
 * 
 */