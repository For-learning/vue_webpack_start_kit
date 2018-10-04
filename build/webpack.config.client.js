const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractPlugin = require('extract-text-webpack-plugin')
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

const defaultPluins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html')
  })
]

const devServer = {
  port: 8000,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  /**
   * mode: "history" 模式下需要开启这个设置，否则路由会当成真正的请求区请求后台，
   *
   */
  historyApiFallback: {
    index: '/public/index.html'
  },
  // proxy: {
  //   '/api': 'http://127.0.0.1:3333',
  //   '/user': 'http://127.0.0.1:3333'
  // },
  hot: true
}

let config

if (isDev) {
  config = merge(baseConfig, {
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: [{
        test: /\.styl/,
        use: [
          'vue-style-loader',
          'css-loader',
          /**
           * 以下在css-loader中开启cssModules方式，refer to：vue-loader.config.js
           * 使用（refer to footer.jsx）：
           * - import className from '../assets/styles/footer.styl'
           * - <div id="{className: footer}">
           */
          //   {
          //     loader: 'css-loader',
          //     options: {
          //       model: true,
          //       localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
          //     }
          //   },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      }]
    },
    devServer,
    plugins: defaultPluins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  })
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../index.js'),
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js',
    },
    module: {
      rules: [{
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
      }]
    },
    plugins: defaultPluins.concat([
      new ExtractPlugin('styles.[contentHash:8].css'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      }),
      new webpack.NamedChunksPlugin()
    ])
  })
}

// config.resolve = {
//   alias: {
//     'model': path.join(__dirname, '../client/model/client-model.js')
//   }
// }

module.exports = config
