const gulp = require('./core/build/gulp')
module.exports = async config => {
  process.env.NODE_ENV = 'build'
  if (config.mode !== 'webpack') {
    await gulp(config)
  }
}
