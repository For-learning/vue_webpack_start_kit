const path = require('path')

/**
 * process.env.NODE_ENV 可以取到 cross-env NODE_ENV=development 设置的值
 */
const isDev = process.env.NODE_ENV === 'development'

const config = {
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
  }
}

if (isDev) {
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
} else {
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
}

module.exports = config