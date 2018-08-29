const path = require('path')

const del = require('del')
const gulp = require('gulp')

const TaskArt = require('../basicTasks/TaskArt')
const TaskArtLang = require('../basicTasks/TaskArtLang')

const TaskCopy = require('../basicTasks/TaskCopy')
const TaskBabel = require('../basicTasks/TaskBabel')
const TaskLintJs = require('../lint/TaskJs')
const TaskSass = require('../basicTasks/TaskSass')
const TaskLintCss = require('../lint/TaskCss')
const SPRITES = require('./sprites')
const SERVER = require('./browserSync')

const toPromise = (func, gulp, common) => {
  return new Promise((resolve, reject) => {
    func(gulp, common, resolve, reject)
  })
}
module.exports = async (common) => {
  const { projectPath, buildDistPath } = common.config
  del.sync([buildDistPath], { force: true })
  await toPromise(SPRITES, gulp, common)
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
  TaskLintJs(gulp, common)
  TaskBabel(gulp, common)
  common.plugins.watch(path.resolve(projectPath, './src/js/**/*.js'), () => {
    TaskLintJs(gulp, common)
    TaskBabel(gulp, common)
  })
  await TaskLintCss(gulp, common)
  await TaskSass(gulp, common)
  common.plugins.watch(path.resolve(projectPath, './src/sass/**/*.scss'), () => {
    TaskLintCss(gulp, common)
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
}
