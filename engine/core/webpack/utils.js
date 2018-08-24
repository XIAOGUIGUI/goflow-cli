'use strict'

const path = require('path')
let localConfig
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
exports.assetsPath = function (_path, config) {
  localConfig = config
  const assetsSubDirectory = process.env.NODE_ENV === 'dev'
    ? localConfig.build.assetsSubDirectory
    : localConfig.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options, config) {
  localConfig = config
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }
  const px2remLoader = {
    loader: 'px2rem-loader',
    options: {
      remUnit: localConfig.px2rem.root_value
    }
  }

  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader,px2remLoader]
    
    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    if (options.extract) {
      return  [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: localConfig.build.assetsPublicPath === './' ? '../../' : localConfig.build.assetsPublicPath,
        }
      }].concat(loaders)
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }
  return {
    css: generateLoaders(),
    scss: generateLoaders('fast-sass'),
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options, config) {
  localConfig = config
  const output = []
  const loaders = exports.cssLoaders(options, config)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
