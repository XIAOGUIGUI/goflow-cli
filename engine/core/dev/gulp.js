const path = require('path')

const del = require('del')
const gulp = require('gulp')

const TaskArt = require('../basicTasks/TaskArt')
const TaskArtLang = require('../basicTasks/TaskArtLang')

const TaskCopy = require('../basicTasks/TaskCopy')
const TaskBabel = require('../basicTasks/TaskBabel')
const TaskSass = require('../basicTasks/TaskSass')
const SPRITES = require('./sprites')
const SERVER = require('./browserSync')

module.exports = async (config) => {
  common = require('../common/common')(config, 'dev')
  const { projectPath, buildDistPath } = common.config
  del.sync([buildDistPath], { force: true })
  SPRITES(gulp, common)
  TaskCopy(gulp, common, {
    directory: './static',
    base: true
  })
  common.plugins.watch(path.resolve(projectPath, './static'), () => {
    TaskCopy(gulp, common, {
      directory: './static',
      base: true
    })
  })
  TaskCopy(gulp, common, {
    directory: './src/img',
    distDirectory: 'img'
  })
  common.plugins.watch(path.resolve(projectPath, './src/img'), () => {
    TaskCopy(gulp, common, {
      directory: './src/img',
      distDirectory: 'img'
    })
  })
  TaskCopy(gulp, common, {
    directory: './src/font',
    distDirectory: 'font'
  })
  common.plugins.watch(path.resolve(projectPath, './src/font'), () => {
    TaskCopy(gulp, common, {
      directory: './src/font',
      distDirectory: 'font'
    })
  })
  TaskBabel(gulp, common)
  common.plugins.watch(path.resolve(projectPath, './src/js/**/*.js'), () => {
    TaskBabel(gulp, common)
  })
  await TaskSass(gulp, common)
  common.plugins.watch(path.resolve(projectPath, './src/sass/**/*.scss'), () => {
    TaskSass(gulp, common)
  })
  TaskArt(gulp, common)
  TaskArtLang(gulp, common)
  common.plugins.watch(path.resolve(projectPath, './src/*.html'), () => {
    TaskArt(gulp, common)
  })
  common.plugins.watch(path.resolve(projectPath, './src/art_lang/*.html'), () => {
    TaskArtLang(gulp, common)
  })
  common.plugins.watch(path.resolve(projectPath, './src/art_common/*.html'), () => {
    TaskArt(gulp, common, false)
    TaskArtLang(gulp, common, false)
  })

  await SERVER(common.config)
  // 入口文件增加或删除提示重启加入webpack构建中
  common.plugins.watch(path.resolve(projectPath, './app-config.js'), () => {
    common.messager.notice( '项目配置修改后, 重启工作流后生效' )
  })
  common.messager.success()
}