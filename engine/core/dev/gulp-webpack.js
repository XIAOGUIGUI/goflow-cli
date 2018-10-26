const path = require('path')
const del = require('del')
const gulp = require('gulp')

const TaskArt = require('../basicTasks/TaskArt')
const SPRITES = require('./sprites')
const webpackServer = require('../webpack/dev-server')
const getMultipleConfig = require('../common/getMultipleConfig')
const toPromise = (func, gulp, common) => {
  return new Promise((resolve, reject) => {
    func(gulp, common, resolve, reject)
  })
}
module.exports = async common => {
  const { projectPath, buildDistPath, multiple } = common.config
  if (multiple.enable) {
    let multipleConfig = getMultipleConfig(common)
    common.config.multiple = Object.assign(multiple, multipleConfig)
  }
  del.sync([buildDistPath], { force: true })
  await toPromise(SPRITES, gulp, common)
  await toPromise(TaskArt, gulp, common)
  let htmlPath = multiple.enable ? './src/views/**?/*.html' : './src/*.html'
  common.plugins.watch(path.resolve(projectPath, htmlPath), () => {
    TaskArt(gulp, common)
  })
  common.plugins.watch(path.resolve(projectPath, './src/art_common/*.html'), () => {
    TaskArt(gulp, common, false)
  })
  await webpackServer.runner(common.config)
}
