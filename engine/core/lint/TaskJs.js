const path = require('path')
let messager = null
let jsErrorResults
const jsErrorNotifier = function (results) {
  messager.notice('JS 代码检查错误 >> ')
  for (let index = 0; index < results.length; index++) {
    if (results[index].errorCount > 0) {
      let fileName = results[index].filePath && results[index].filePath.split('src')[1]
      messager.notice(`JS 代码检查错误: ${fileName}文件`)
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
  const jsPath = path.resolve(projectPath, './src/**/*.{js,vue}')
  const distPath = path.resolve(assetsPath, './js')
  const eslint = common.plugins.eslintThrough
  let eslintConfig = path.resolve(__dirname, '../common/default_js_eslint.js')

  messager = common.messager
  gulp.src(jsPath)
    .pipe(common.plugins.if(DEV, common.plugins.changed(distPath, {
      extension: '.js'
    })))
    .pipe(eslint({
      configFile: eslintConfig,
      results: (data) => {
        jsErrorResults = data
        if (data.length > 0) {
          jsErrorNotifier(data)
        }
      }
    }))
    .on('end', () => {
      if (DEV === false) {
        common.messager.log('JS 代码风格检查完成')
        resolve && resolve(jsErrorResults.length)
      }
    })
}
