const path = require('path')
const del = require('del')
const gulp = require('./core/build/gulp')
module.exports = async config => {
  config.publicAssetsPath = path.posix.join(config.build.assetsPublicPath, config.build.assetsSubDirectory)
  config.assetsPath = path.resolve(config.buildDistPath, config.dev.assetsSubDirectory)
  if (config.mode !== 'webpack') {
    await gulp(config)
  }
}
