const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const config = {
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