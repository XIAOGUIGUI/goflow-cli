'use strict'

const webpack = require('webpack')

module.exports = common => new Promise(resolve => {
  const { config } = common
  const webpackConfig = require('./webpack.prod.conf')(config)
  webpack(webpackConfig, function (error, stats) {
    if (error) {
      common.messager.stop(`webpack打包错误: ${error.toString()}`)
    } else {
      const msg = stats.toString({
        assets: false,
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        entrypoints: false,
        chunkModules: false
      })
      if (stats.compilation.errors.length > 0) {
        common.messager.log(msg)
        common.messager.stop(`webpack打包错误`)
      } else {
        common.messager.log('webpack构建完成')
        resolve()
      }
    }
  })
})
