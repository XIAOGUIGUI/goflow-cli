'use strict'

const path = require('path')
const webpack = require('webpack')

const utils = require('./utils')
const happyPlugin = require('./happyPlugin')
const WebpackBar = require('webpackbar')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpackAlias = require('../common/webpack_alias')
const getHtmlPlugins = require('../common/getHtmlPlugins')
const getDllPlugins = require('../common/getDllPlugins')
let projectPathString
function resolve (dir) {
  return path.join(projectPathString, dir)
}

module.exports = (config) => {
  const { root, buildDistPath, projectPath, elementUi, multiple } = config
  const { resourcesDomain, assetsPublicPath } = config[process.env.NODE_ENV]
  projectPathString = projectPath
  const vueLoaderConfig = require('./vue-loader.conf')(config)
  const defineVariable = require('../common/define_variable')(config)
  let happyplugins = happyPlugin.createHappyPlugins(vueLoaderConfig.cssLoaders, config)
  let htmlplugins = getHtmlPlugins(config)
  let dllPlugins = getDllPlugins(config)
  let imgLoaderOptions = {
    limit: 10000,
    name: utils.assetsPath('img/[name].[hash:7].[ext]', config)
  }
  if (process.env.NODE_ENV !== 'dev' && config.build.imgResourcesDomain && config.build.imgResourcesDomain !== '') {
    imgLoaderOptions.publicPath = config.build.imgResourcesDomain
  }
  let publicPath = assetsPublicPath
  if (resourcesDomain) {
    publicPath = resourcesDomain
  }
  // vueLoader添加happypack
  Object.assign(vueLoaderConfig.config.loaders, {
    js: require.resolve('happypack/loader') + '?id=happy-babel-vue'
  })
  let entry = {}
  if (elementUi === true) {
    entry = {
      element: ['element-ui'],
      app: './src/main.js'
    }
  } else if (multiple.enable) {
    entry = multiple.entries
  } else {
    entry = {
      app: './src/main.js'
    }
  }
  let baseWebpackConfig = {
    mode: 'development',
    entry,
    output: {
      path: buildDistPath,
      filename: '[name].js',
      publicPath
    },
    resolve: {
      alias: webpackAlias(config),
      modules: [
        path.resolve(root, './node_modules'),
        path.resolve(projectPath, './node_modules')
      ],
      extensions: ['.js', '.vue', '.json']
    },
    module: {
      noParse: /node_modules\/(element-ui\.js)/,
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: require.resolve('eslint-loader'),
          enforce: 'pre',
          include: [resolve('src'), resolve('test')],
          options: {
            configFile: path.resolve(__dirname, '../common/default_js_eslint.js'),
            emitWarning: true,
            formatter: require('eslint-friendly-formatter')
          }
        },
        {
          test: /\.vue$/,
          loader: require.resolve('vue-loader'),
          include: [resolve('src')],
          exclude: /^node_modules$/,
          options: vueLoaderConfig.config
        },
        {
          test: /\.js$/,
          loader: require.resolve('happypack/loader') + '?id=happy-babel-js',
          exclude: /^node_modules$/,
          include: [resolve('src'), resolve('test')]
        },
        {
          test: /\.(png|jpe?g)(\?.*)?$/,
          loader: require.resolve('webp-url-loader') + '?' + JSON.stringify(imgLoaderOptions)
        },
        {
          test: /\.svg$/,
          loader: require.resolve('svg-sprite-loader'),
          include: [resolve('src/icons')],
          options: {
            symbolId: 'icon-[name]'
          }
        },
        {
          test: /\.(gif|svg)(\?.*)?$/,
          loader: require.resolve('url-loader') + '?' + JSON.stringify(imgLoaderOptions),
          exclude: [resolve('src/icons')]
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]', config)
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]', config)
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(defineVariable),
      new WebpackBar({
        compiledIn: false,
        name: process.env.NODE_ENV
      }),
      new StyleLintPlugin({
        configFile: path.resolve(__dirname, '../common/default_css_stylelint.js'),
        files: ['src/**/*.vue', 'src/sass/*.s?(a|c)ss']
      })
    ]
  }
  if (dllPlugins.dllReferencePlugins.length > 0) {
    baseWebpackConfig.plugins.push(new CopyWebpackPlugin([{
      from: path.resolve(projectPath, './dll'),
      to: config.build.assetsSubDirectory + '/js',
      ignore: ['*.manifest.json']
    }]))
  }
  baseWebpackConfig.plugins = baseWebpackConfig.plugins.concat(happyplugins).concat(dllPlugins.dllReferencePlugins)
  baseWebpackConfig.plugins = baseWebpackConfig.plugins.concat(htmlplugins).concat(dllPlugins.includeAssetHtmlPlugins)
  return baseWebpackConfig
}
