const gulp = require('./core/build/gulp')
const gulpWebpack = require('./core/build/gulp-webpack')
module.exports = async config => {
  process.env.NODE_ENV = 'build'
  try {
    common = require('./core/common/common')(config, 'build')
    if (config.mode !== 'webpack') {
      await gulp(common)
    } else {
      await gulpWebpack(common)
    }
  } catch (error) {
    common.messager.error(error)
  }
  
}
