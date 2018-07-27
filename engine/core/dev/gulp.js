const path = require('path')
const del = require('del')
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')({
  rename: {}
})
const browserSync = require('browser-sync')
const reload = browserSync.reload
const TaskArt = require('../basicTasks/TaskArt')
const TaskArtLang = require('../basicTasks/TaskArtLang')
const SERVER = require('./browserSync')



const Messager = require('../../messager.js')
const messager = new Messager()
// 创建 common 对象
var common = {}
common.plugins = plugins
common.reload = reload
common.messager = messager
module.exports = async (config) => {
  common.config = config
  const { projectPath, buildDist } = config
  del.sync([buildDist], { force: true })
  TaskArt(gulp, common)
  TaskArtLang(gulp, common)
  await SERVER(browserSync, config)
  plugins.watch(path.resolve(projectPath, './src/art/*.html'), () => {
    TaskArt(gulp, common)
  })
  plugins.watch(path.resolve(projectPath, './src/art/lang/*.html'), () => {
    TaskArtLang(gulp, common)
  })
  messager.success()
}