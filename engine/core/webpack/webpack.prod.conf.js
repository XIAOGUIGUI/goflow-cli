'use strict'

const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const loadMinified = require('./load-minified')

module.exports = (config) => {
  const { projectPath, buildDistPath } = config
  const baseWebpackConfig = require('./webpack.base.conf')(config)
  const defineVariable = require('../common/define_variable')(config)
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
      new webpack.DefinePlugin(defineVariable),
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
        // （默认值：30000）块的最小大小
        minSize: 30000,
        // （默认值：1）分割前共享模块的最小块数
        minChunks: 1,
        // （缺省值5）按需加载时的最大并行请求数
        maxAsyncRequests: 8,
        // （默认值3）入口点上的最大并行请求数
        maxInitialRequests: 8,
        // webpack 将使用块的起源和名称来生成名称: `vendors~main.js`,如项目与"~"冲突，则可通过此值修改，Eg: '-'
        automaticNameDelimiter: '~',
        // cacheGroups is an object where keys are the cache group names.
        name: true,
        cacheGroups: {
          vendor: { // 将第三方模块提取出来
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10, // 优先
            enforce: true
          },
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
      // generate dist index.html with correct asset hash for caching.
      // you can customize output by editing /index.html
      // see https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: `${projectPath}/dist/index/index.html`,
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunks: ['index'],
        serviceWorkerLoader: `<script>${loadMinified(path.join(__dirname,
          './service-worker-prod.js'))}</script>`
      }),
      new HtmlWebpackPlugin({
        filename: 'about.html',
        template: `${projectPath}/dist/about/about.html`,
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency',
        chunks: ['about'],
        serviceWorkerLoader: `<script>${loadMinified(path.join(__dirname,
          './service-worker-prod.js'))}</script>`
      }),
      // copy custom static assets
      new CopyWebpackPlugin([
        {
          from: path.resolve(projectPath, './static'),
          to: config.build.assetsSubDirectory,
          ignore: ['.*']
        }
      ]),
      // service worker caching
      new SWPrecacheWebpackPlugin({
        cacheId: config.serviceWorker.cacheId,
        filename: 'service-worker.js',
        templateFilePath: path.resolve(__dirname, './service-worker.tmpl'),
        staticFileGlobs: ['dist/**/*.{js,html,css,jpg,png,webp}'],
        minify: true,
        stripPrefix: 'dist/'
      })
    ]
  })
}
