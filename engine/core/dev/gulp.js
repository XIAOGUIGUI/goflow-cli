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
const TaskCopy = require('../basicTasks/TaskCopy')
const TaskSass = require('../basicTasks/TaskSass')
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
  const { projectPath, buildDistPath } = config
  del.sync([buildDistPath], { force: true })
  TaskCopy(gulp, common, {
    directory: './static',
    base: true
  })
  TaskCopy(gulp, common, {
    directory: './src/font',
    distDirectory: 'font'
  })
  await TaskSass(gulp, common)
  plugins.watch(path.resolve(projectPath, './src/sass/**/*.scss'), () => {
    TaskSass(gulp, common)
  })
  TaskArt(gulp, common)
  TaskArtLang(gulp, common)
  plugins.watch(path.resolve(projectPath, './src/*.html'), () => {
    TaskArt(gulp, common)
  })
  plugins.watch(path.resolve(projectPath, './src/art/*.html'), () => {
    TaskArt(gulp, common)
  })
  plugins.watch(path.resolve(projectPath, './src/art/lang/*.html'), () => {
    TaskArtLang(gulp, common)
  })

  await SERVER(browserSync, config)
  
  messager.success()
}