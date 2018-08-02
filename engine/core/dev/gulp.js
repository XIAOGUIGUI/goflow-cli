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
const TaskBabel = require('../basicTasks/TaskBabel')
const TaskSass = require('../basicTasks/TaskSass')
const SPRITES = require('./sprites')
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
  SPRITES(gulp, common)
  TaskCopy(gulp, common, {
    directory: './static',
    base: true
  })
  plugins.watch(path.resolve(projectPath, './static'), () => {
    TaskCopy(gulp, common, {
      directory: './static',
      base: true
    })
  })
  TaskCopy(gulp, common, {
    directory: './src/img',
    distDirectory: 'img'
  })
  plugins.watch(path.resolve(projectPath, './src/img'), () => {
    TaskCopy(gulp, common, {
      directory: './src/img',
      distDirectory: 'img'
    })
  })
  TaskCopy(gulp, common, {
    directory: './src/font',
    distDirectory: 'font'
  })
  plugins.watch(path.resolve(projectPath, './src/font'), () => {
    TaskCopy(gulp, common, {
      directory: './src/font',
      distDirectory: 'font'
    })
  })
  TaskBabel(gulp, common)
  plugins.watch(path.resolve(projectPath, './src/js/**/*.js'), () => {
    TaskBabel(gulp, common)
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
  // 入口文件增加或删除提示重启加入webpack构建中
  plugins.watch(path.resolve(projectPath, './app-config.js'), () => {
    messager.notice( '项目配置文件变动, 请重启工作流使用最新配置' )
  })
  messager.success()
}