const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

const devServer = {
  port: 9090,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  hot: true
}

// Define config
let config

config = merge(baseConfig, {
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  },
  mode: 'development',
  devServer,
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin({
      template: path.join(__dirname, './template.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})

module.exports = config