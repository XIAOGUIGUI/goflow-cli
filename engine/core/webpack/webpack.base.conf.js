'use strict'

const path = require('path')

const utils = require('./utils')
const happyPlugin = require('./happyPlugin')
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
  if (process.env.NODE_ENV !== 'dev') {
    imgLoaderOptions.publicPath = config.build.imgResourcesDomain
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
      publicPath: process.env.NODE_ENV !== 'dev'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    resolve: {
      alias: webpackAlias(config),
      modules: [
        path.resolve( root, './node_modules' ),
        path.resolve( projectPath, './node_modules' )
      ],
      extensions: ['.js', '.vue', '.json'],
      
    },
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: require.resolve('eslint-loader'),
          enforce: 'pre',
          include: [resolve('src'), resolve('test')],
          options: {
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
    plugins
  }
}
