const gulp = require('gulp')
const TaskLintJs = require('./TaskJs')
const TaskLintCss = require('./TaskCss')
const toPromise = (func, gulp, common) => {
  return new Promise((resolve, reject) => {
    func(gulp, common, resolve, reject)
  })
}
module.exports = async (common) => {
  let jsState = await toPromise(TaskLintJs, gulp, common)
  let cssState = await toPromise(TaskLintCss, gulp, common)
  common.messager.success('静态检查完成')
  if (jsState !== 0 || cssState !== 0) {
    process.exit(1)
  }
}
