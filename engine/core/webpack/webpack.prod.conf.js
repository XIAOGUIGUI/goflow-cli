'use strict'

const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ParallelUglifyESPlugin = require('webpack-parallel-uglify-es-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const getCacheGroups = require('../common/getCacheGroups')

module.exports = (config) => {
  const { projectPath, buildDistPath } = config
  const baseWebpackConfig = require('./webpack.base.conf')(config)
  const { assetsPublicPath, analyzer, uglify } = config[process.env.NODE_ENV]
  let SwOptions = {
    cacheId: config.serviceWorker.cacheId,
    filename: 'service-worker.js',
    templateFilePath: path.resolve(__dirname, './service-worker.tmpl'),
    staticFileGlobs: ['dist/**/*.{js,html,css,jpg,png,webp,eot,svg,ttf,woff}'],
    minify: true,
    stripPrefix: 'dist/'
  }
  if (assetsPublicPath.indexOf('//') === 0) {
    SwOptions.staticFileGlobs = ['dist/**/*.{js,css,jpg,png,webp,eot,svg,ttf,woff}']
    SwOptions.replacePrefix = assetsPublicPath
  } else {
    SwOptions.staticFileGlobs = ['dist/**/*.{js,html,css,jpg,png,webp,eot,svg,ttf,woff}']
  }
  const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true
      }, config)
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
      path: buildDistPath,
      filename: utils.assetsPath('js/[name].[chunkhash].js', config),
      chunkFilename: utils.assetsPath('js/[name].[chunkhash].js', config)
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 500000,
      maxAssetSize: 500000
    },
    optimization: {
      splitChunks: {
        cacheGroups: getCacheGroups(config)
      }
    },
    plugins: [
      new ParallelUglifyESPlugin({
        cacheDir: '.cache/',
        uglifyJS: {
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            warnings: false,
            drop_console: uglify.drop_console,
            collapse_vars: true,
            reduce_vars: true
          }
        }
      }),
      new MiniCssExtractPlugin({
        filename: utils.assetsPath('css/[name].[contenthash].css', config)
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      }),
      // 作用域提升,提升代码在浏览器执行速度
      new webpack.optimize.ModuleConcatenationPlugin(),
      // 根据模块相对路径生成四位数hash值作为模块id
      new webpack.HashedModuleIdsPlugin(),
      // copy custom static assets
      new CopyWebpackPlugin([
        {
          from: path.resolve(projectPath, './static'),
          to: config.build.assetsSubDirectory,
          ignore: ['.*']
        }
      ]),
      // service worker caching
      new SWPrecacheWebpackPlugin(SwOptions)
    ]
  })
  if (analyzer === true) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }
  return webpackConfig
}
