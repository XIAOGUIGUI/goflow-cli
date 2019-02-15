const fs = require('fs-extra')
const gulp = require('gulp')

const TaskImg = require('./TaskImg')
const TaskWebp = require('./TaskWebp')
const TaskCopy = require('../basicTasks/TaskCopy')
const TaskBabel = require('../basicTasks/TaskBabel')
const TaskLintJs = require('../lint/TaskJs')
const TaskSass = require('../basicTasks/TaskSass')
const TaskLintCss = require('../lint/TaskCss')
const TaskInline = require('./TaskInline')
const TaskUseref = require('./TaskUseref')
const TaskMd5 = require('./TaskMd5')
const TaskDisplace = require('./TaskDisplace')
const TaskReplaceDomain = require('./TaskReplaceDomain')
const TaskArt = require('../basicTasks/TaskArt')
const TaskArtLang = require('../basicTasks/TaskArtLang')
const toPromise = (func, gulp, common) => {
  return new Promise((resolve, reject) => {
    func(gulp, common, resolve, reject)
  })
}
const toPromise1 = (func, gulp, common, arg) => {
  return new Promise((resolve, reject) => {
    func(gulp, common, arg, resolve, reject)
  })
}
module.exports = async common => {
  const { buildDistPath, lang } = common.config
  let langFomatData = {}
  try {
    fs.removeSync(buildDistPath)
    await new Promise(resolve => {
      TaskCopy(gulp, common, {
        directory: './static',
        base: true
      })
      common.messager.log('static 文件夹移动成功')
      resolve()
    })
    await TaskImg(gulp, common)
    await TaskWebp(gulp, common)
    await toPromise(TaskLintCss, gulp, common)
    await TaskSass(gulp, common)
    await toPromise(TaskLintJs, gulp, common)
    await toPromise(TaskBabel, gulp, common)
    await toPromise(TaskArt, gulp, common)
    let langHtmlList = []
    if (lang) {
      for (const key in lang) {
        if (key === 'defulteLang') {
          lang[lang.defulteLang].push('index')
        } else {
          langHtmlList = await toPromise1(TaskArtLang, gulp, common, key)
          langFomatData[key] = lang[key]
        }
      }
      common.messager.log('多语言ART 编译完成')
    }
    await TaskUseref(gulp, common)
    await TaskInline(gulp, common)
    await TaskMd5(gulp, common)
    await TaskDisplace(gulp, common)
    await TaskReplaceDomain(gulp, common)
    for (let index = 0; index < langHtmlList.length; index++) {
      for (const key in lang) {
        if (key !== 'defulteLang' && Array.isArray(lang[key]) && lang[key].length !== 0) {
          for (let j = 0; j < lang[key].length; j++) {
            let srcPath = `${buildDistPath}/${langHtmlList[index]}/${key}.html`
            let distPath = `${buildDistPath}/${langHtmlList[index]}/${lang[key][j]}.html`
            fs.copySync(srcPath, distPath)
          }
        }
      }
    }
    common.messager.success()
  } catch (err) {
    console.error('[BUILD ERROR]', err)
    common.messager.error(err)
  }
}
