const path = require('path')
let messager = null
const jsErrorNotifier = function (results) {
  messager.notice('JS 代码检查错误 >> ')
  for (let index = 0; index < results.length; index++) {
    if (results[index].errorCount > 0) {
      let fileName = path.basename(results[index].filePath)
      messager.error(`JS 代码检查错误: ${fileName}文件`)
      for (let j = 0; j < results[index].messages.length; j++) {
        let message = results[index].messages[j]
        messager.error(`line ${message.line}, col ${message.column}: ${message.message}`)
      }
    }
  }
}
module.exports = (gulp, common, resolve) => {
  const DEV = process.env.NODE_ENV === 'dev'
  const { projectPath, assetsPath } = common.config
  const jsPath = path.resolve(projectPath, './src/js/**/*.js')
  const distPath = path.resolve(assetsPath, './js')
  const eslint = common.plugins.eslint
  let eslintConfig = path.resolve(__dirname, '../common/default_js_eslint.js')

  messager = common.messager
  gulp.src(jsPath)
    .pipe(common.plugins.if(DEV, common.plugins.changed(distPath, {
      extension: '.js'
    })))
    .pipe(eslint({
      configFile: eslintConfig
    }))
    .pipe(eslint.results(results => {
      if (results.errorCount > 0) {
        jsErrorNotifier(results)
        if (process.env.NODE_ENV === 'lint') {
          common.messager.log('JS 代码风格检查完成')
          resolve && resolve(results.errorCount)
        }
      } else {
        if (DEV === false) {
          common.messager.log('JS 代码风格检查完成')
          resolve && resolve(0)
        }
      }
    }))
}
