const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const del = require('del')
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')({
  rename: {}
})
const browserSync = require('browser-sync')
const reload = browserSync.reload
const TaskArt = require('../basicTasks/TaskArt')
const TaskArtLang = require('../basicTasks/TaskArtLang')
const TaskSpritesmith = require('../basicTasks/TaskSpritesmith')
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
  const spritesPath = path.resolve(projectPath, './src/img/slice/')
  let spritesFiles = fs.readdirSync(spritesPath).filter(function(file){
    let filePath = path.join(spritesPath, file)
    return fs.statSync(filePath).isDirectory()
  })
  spritesFiles.forEach(file => {
    let filePath = path.resolve(projectPath, `./src/img/slice/${file}/*.png`)
    TaskSpritesmith(gulp, common, {
      name: file,
      srcPath: filePath
    })
    plugins.watch(filePath, () => {
      TaskSpritesmith(gulp, common, {
        name: file,
        srcPath: filePath
      })
    })
  })
  let ready = false
  chokidar.watch(spritesPath).on('addDir', path => {
    // devMiddleware.publish({ action: 'reload' })
    if (ready === true) {
      plugins.watch(path, () => {
        console.log('dddd')
        TaskSpritesmith(gulp, common)
      })
    }
  }).on('unlinkDir', path => {
    if (ready === true) {
      console.log(path)
    }
  }).on('ready', function () {
    ready = true
  })
  return false
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