const fs = require('fs')
const fs1 = require('fs-extra')
const path = require('path')
const del = require('del')
const chokidar = require('chokidar')
const TaskSpritesmith = require('../basicTasks/TaskSpritesmith')
let spritesWatchObject
module.exports = (gulp, common, resolve) => {
  const { projectPath } = common.config
  const spritesPath = path.resolve(projectPath, './src/img/slice/')
  const templateConfigPath = path.resolve(projectPath, './src/img/slice/config.json')
  let templateConfig = null
  if(fs.existsSync(templateConfigPath)){
    templateConfig = fs1.readJsonSync(templateConfigPath)
  }
  del.sync([path.resolve(projectPath, './src/sass/sprites/')], { force: true })
  spritesWatchObject = {}
  let spritesFiles = fs.readdirSync(spritesPath).filter(function(file){
    let filePath = path.join(spritesPath, file)
    return fs.statSync(filePath).isDirectory()
  })
  spritesFiles.forEach(file => {
    let filePath = path.resolve(projectPath, `./src/img/slice/${file}/*.png`)
    TaskSpritesmith(gulp, common, {
      name: file,
      srcPath: filePath,
      templateConfig
    })
    spritesWatchObject[file] = common.plugins.watch(filePath, () => {
      TaskSpritesmith(gulp, common, {
        name: file,
        srcPath: filePath,
        templateConfig
      })
    })
  })
  resolve && resolve()
  // 监听
  let ready = false
  chokidar.watch(spritesPath).on('addDir', filePath => {
    if (ready === true) {
      let fileName = filePath.split(spritesPath)[1]
      fileName = fileName.substring(1)
      if (fileName.indexOf(path.sep) < 0) {
        let srcPath = path.resolve(filePath, './*.png')
        common.plugins.watch(srcPath, () => {
          TaskSpritesmith(gulp, common, {
            name: fileName,
            srcPath,
            templateConfig
          })
        })
      }
    }
  }).on('unlinkDir', filePath => {
    if (ready === true) {
      let fileName = filePath.split(spritesPath)[1]
      fileName = fileName.substring(1)
      if (fileName.indexOf(path.sep) < 0) {
        let pngPath = path.resolve(projectPath, `./src/img/${fileName}.png`)
        let sassPath = path.resolve(projectPath, `./src/sass/sprite/${fileName}.scss`)
        del.sync([pngPath, sassPath], { force: true })
        spritesWatchObject[fileName] && spritesWatchObject[fileName].close()
      }
    }
  }).on('ready', function () {
    ready = true
  })
}