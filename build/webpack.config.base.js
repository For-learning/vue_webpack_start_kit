const path = require('path')

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
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [{
          /**
           * url-loader实际上封装了file-loader
           * 其加载所有的图片文件，如果图片大小小于1024，则将其转为base64位的字节码直接写如最终的js文件
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

module.exports = config