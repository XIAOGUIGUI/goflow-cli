const gulp = require('gulp')
const TaskLintJs = require('./core/lint/TaskJs')
const TaskLintCss = require('./core/lint/TaskCss')
const toPromise = (func, gulp, common) => {
  return new Promise((resolve, reject) => {
    func(gulp, common, resolve, reject)
  })
}
module.exports = async config => {
  process.env.NODE_ENV = 'lint'
  let common
  try {
    common = require('./core/common/common')(config, 'build')
    let jsState = await toPromise(TaskLintJs, gulp, common)
    let cssState = await toPromise(TaskLintCss, gulp, common)
    common.messager.success('静态检查完成')
    if (jsState !== 0 || cssState !== 0) {
      process.exit(1)
    }
  } catch (error) {
    common.messager.error(error)
    process.exit(1)
  }
}
