'use strict'

const path = require('path')

const utils = require('./utils')
const happyPlugin = require('./happyPlugin')
const WebpackBar = require('webpackbar')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const webpackAlias = require('../common/webpack_alias')
let projectPathString
function resolve (dir) {
  return path.join(projectPathString, dir)
}

module.exports = (config) => {
  const { root, buildDistPath, projectPath } = config
  projectPathString = projectPath
  const vueLoaderConfig = require('./vue-loader.conf')(config)
  let plugins = happyPlugin.createHappyPlugins(vueLoaderConfig.cssLoaders, config)
  let imgLoaderOptions = {
    limit: 10000,
    name: utils.assetsPath('img/[name].[hash:7].[ext]', config)
  }
  if (process.env.NODE_ENV !== 'dev' && config.build.imgResourcesDomain && config.build.imgResourcesDomain !== '') {
    imgLoaderOptions.publicPath = config.build.imgResourcesDomain
  }
  let publicPath = config.dev.assetsPublicPath
  if (process.env.NODE_ENV !== 'dev' && config.build.resourcesDomain && config.build.resourcesDomain !== '') {
    publicPath = config.build.resourcesDomain
  }
  // vueLoader添加happypack
  Object.assign(vueLoaderConfig.config.loaders, {
    js: require.resolve('happypack/loader') + '?id=happy-babel-vue'
  })
  return {
    mode: 'development',
    entry: {
      app: './src/main.js'
    },
    output: {
      path: buildDistPath,
      filename: '[name].js',
      publicPath: publicPath
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
      rules: [
        {
          test: /Preheat\.(js|vue)$/,
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
          test: /\.(gif|svg)(\?.*)?$/,
          loader: require.resolve('url-loader') + '?' + JSON.stringify(imgLoaderOptions),
          include: [resolve('src/assets/')]
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
      new WebpackBar({
        compiledIn: false,
        name: process.env.NODE_ENV
      })
      // new StyleLintPlugin({
      //   configFile: path.resolve(__dirname, '../common/default_css_stylelint.js'),
      //   files: ['src/**/*.vue', 'src/sass/*.s?(a|c)ss']
      // })
    ].concat(plugins)
  }
}
