'use strict'

const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// add hot-reload related code to entry chunks

module.exports = (config) => {
  const baseWebpackConfig = require('./webpack.base.conf')(config)
  const defineVariable = require('../common/define_variable')(config)
  const devClientPath = path.resolve(__dirname, './dev-client.js')
  Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = [devClientPath].concat(baseWebpackConfig.entry[name])
  })
  return merge(baseWebpackConfig, {
    module: {
      rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }, config)
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
      new webpack.DefinePlugin(defineVariable),
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Running: http://${config.dev.ip}:${config.dev.port}`]
        },
        onErrors (severity, errors) {
          if (errors instanceof Array) {
            errors.forEach((item, index) => {
              if (item.file && item.file.indexOf('./src/') >= 0) {
                errors[ index ].file = `./src/${item.file.split('./src/')[1]}`
              }
            })
          }
        }
      })
    ]
  })
}
