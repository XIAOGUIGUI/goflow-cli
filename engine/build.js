const gulp = require('./core/build/gulp')
const gulpWebpack = require('./core/build/gulp-webpack')
module.exports = async config => {
  let common
  process.env.NODE_ENV = 'build'
  try {
    common = require('./core/common/common')(config, 'build')
    const { browserslist } = common.config
    process.env.browserslist = browserslist
    if (config.mode !== 'webpack') {
      await gulp(common)
    } else {
      await gulpWebpack(common)
    }
  } catch (error) {
    common.messager.error(error)
  }
}
