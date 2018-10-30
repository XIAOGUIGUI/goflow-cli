'use strict'

const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

module.exports = (config) => {
  const { projectPath, buildDistPath } = config
  const { assetsPublicPath } = config[process.env.NODE_ENV]
  const baseWebpackConfig = require('./webpack.base.conf')(config)
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
  return merge(baseWebpackConfig, {
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
      chunkFilename: utils.assetsPath('js/[id].[chunkhash].js', config)
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 500000,
      maxAssetSize: 500000
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
            warnings: false,
            drop_console: true,
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
      new webpack.optimize.SplitChunksPlugin({
        // chunks: "initial"，"async"和"all"分别是：初始块，按需块或所有块；
        chunks: 'all',
        // （默认值3）入口点上的最大并行请求数
        maxInitialRequests: 5,
        // webpack 将使用块的起源和名称来生成名称: `vendors~main.js`,如项目与"~"冲突，则可通过此值修改，Eg: '-'
        automaticNameDelimiter: '~',
        // cacheGroups is an object where keys are the cache group names.
        name: true,
        cacheGroups: {
          // 设置为 false 以禁用默认缓存组
          element: {
            name: 'element',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            chunks: 'initial',
            // 默认组的优先级为负数，以允许任何自定义缓存组具有更高的优先级（默认值为0）
            priority: 20
          },
          lodash: {
            name: 'lodash',
            test: /[\\/]node_modules[\\/]lodash[\\/]/,
            chunks: 'initial',
            // 默认组的优先级为负数，以允许任何自定义缓存组具有更高的优先级（默认值为0）
            priority: -10
          }
        }
      }),
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 30000 // Minimum number of characters (25kb)
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 10 // Must be greater than or equal to one
        // minChunkSize: 1000
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
}
