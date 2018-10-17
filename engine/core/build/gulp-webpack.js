const del = require('del')
const gulp = require('gulp')

const TaskArt = require('../basicTasks/TaskArt')
const webpackBuild = require('../webpack/build')
const getMultipleConfig = require('../common/getMultipleConfig')
const toPromise = (func, gulp, common) => {
  return new Promise((resolve, reject) => {
    func(gulp, common, resolve, reject)
  })
}
module.exports = async common => {
  const { buildDistPath, multiple } = common.config
  if (multiple.enable) {
    let multipleConfig = getMultipleConfig(common)
    common.config.multiple = Object.assign(multiple, multipleConfig)
  }
  del.sync([buildDistPath], { force: true })
  await toPromise(TaskArt, gulp, common)
  await webpackBuild(common)
  common.messager.success()
}
