const path = require('path')
const del = require('del')
const gulp = require('gulp')

const TaskArt = require('../basicTasks/TaskArt')
const webpackServer = require('../webpack/dev-server')
const toPromise = ( func, gulp, common ) => {
  return new Promise( ( resolve, reject ) => {
      func( gulp, common, resolve, reject )
  } );
}
module.exports = async (common) => {
  const { projectPath, buildDistPath } = common.config
  del.sync([buildDistPath], { force: true })
  await toPromise(TaskArt, gulp, common)
  common.plugins.watch(path.resolve(projectPath, './src/*.html'), () => {
    TaskArt(gulp, common)
  })
  common.plugins.watch(path.resolve(projectPath, './src/art_common/*.html'), () => {
    TaskArt(gulp, common, false)
  })
  await webpackServer.runner(common.config)
}