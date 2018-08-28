const gulpLint = require('./core/lint/lint-gulp')
module.exports = async config => {
  process.env.NODE_ENV = 'lint'
  let common
  try {
    common = require('./core/common/common')(config, 'build')
    await gulpLint(common)
  } catch (error) {
    common.messager.error(error)
    process.exit(1)
  }
}
