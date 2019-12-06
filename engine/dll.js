'use strict'

const path = require('path')
const webpack = require('webpack')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const del = require('del')

const webpackAlias = require('./core/common/webpack_alias')

module.exports = function (config) {
  let common = require('./core/common/common')(config, 'build')

  const { root, projectPath } = common.config

  const { dll } = common.config.webpack ? common.config.webpack : {}

  if (!dll) {
    common.messager.stop('dll config undefined')

    return void 0
  }

  del.sync(`${projectPath}/dll/**/*`, { force: true })

  const dllOptions = {
    mode: 'production',
    entry: dll,
    output: {
      filename: '[name].[chunkhash].dll.js',
      path: path.resolve(projectPath, 'dll'),
      library: '_dll_[name]'
    },
    resolve: {
      alias: webpackAlias(config),
      modules: [
        path.resolve(root, './node_modules'),
        path.resolve(projectPath, './node_modules')
      ]
    },
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    plugins: [
      new ParallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJS: {
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true
          },
          warnings: false
        }
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.DllPlugin({
        name: '_dll_[name]',
        path: path.join(projectPath, 'dll', '[name].manifest.json')
      })
    ],
    context: projectPath
  }

  const compiler = webpack(dllOptions)

  compiler.run((error, stats) => {
    if (error) {
      common.messager.stop(`dll 打包错误: ${error.toString()}`)
    } else {
      const msg = stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      })

      if (stats.compilation.errors.length > 0) {
        common.messager.log(msg)

        common.messager.stop(`dll 打包错误`)
      } else {
        common.messager.success('构建完成')
      }
    }
  })
}
