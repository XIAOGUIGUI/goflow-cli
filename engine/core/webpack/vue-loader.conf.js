'use strict'
const utils = require('./utils')
const isProduction = process.env.NODE_ENV !== 'dev'

module.exports = config => {
  let cssLoaders = utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }, config)
  return {
    config: {
      postcss: [require('autoprefixer')],
      loaders: cssLoaders,
      transformToRequire: {
        video: ['src', 'poster'],
        source: 'src',
        img: 'src',
        image: 'xlink:href'
      }
    },
    cssLoaders: cssLoaders
  }
}
