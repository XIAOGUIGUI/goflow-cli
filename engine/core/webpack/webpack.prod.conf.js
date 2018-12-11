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
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (config) => {
  const { projectPath, buildDistPath } = config
  const baseWebpackConfig = require('./webpack.base.conf')(config)
  const { assetsPublicPath, analyzer } = config[process.env.NODE_ENV]
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
        cacheGroups: {
          element: {
            name: 'element',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            chunks: 'initial',
            // 默认组的优先级为负数，以允许任何自定义缓存组具有更高的优先级（默认值为0）
            priority: 100
          },
          lodash: {
            name: 'lodash',
            test: /[\\/]node_modules[\\/]lodash[\\/]/,
            chunks: 'initial',
            // 默认组的优先级为负数，以允许任何自定义缓存组具有更高的优先级（默认值为0）
            priority: 100
          },
          components: {
            name: 'components',
            test: /components[\\/]/,
            minSize: 0,
            chunks: 'all',
            priority: 100
          },
          commons: {
            chunks: 'all',
            name: 'chunk-comomns',
            minChunks: 2, // 最小共用次数
            reuseExistingChunk: false
          }
        }
      }
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
