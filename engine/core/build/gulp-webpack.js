const path = require('path')
const del = require('del')
const gulp = require('gulp')

const TaskArt = require('../basicTasks/TaskArt')
const webpackBuild = require('../webpack/build')
const toPromise = ( func, gulp, common ) => {
  return new Promise( ( resolve, reject ) => {
      func( gulp, common, resolve, reject )
  } );
}
module.exports = async (common) => {
  const { buildDistPath } = common.config
  del.sync([buildDistPath], { force: true })
  await toPromise(TaskArt, gulp, common)
  await webpackBuild(common)
  common.messager.success()
}