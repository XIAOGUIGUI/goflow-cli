const path = require('path')
let messager = null
let jsErrorResults
const jsErrorNotifier = function () {
  messager.notice('JS 代码检查错误 >> ')
  for (let index = 0; index < jsErrorResults.length; index++) {
    if (jsErrorResults[index].errorCount > 0) {
      let fileName = jsErrorResults[index].filePath && jsErrorResults[index].filePath.split('src')[1]
      messager.notice(`JS 代码检查错误: ${fileName}文件`)
      for (let j = 0; j < jsErrorResults[index].messages.length; j++) {
        let message = jsErrorResults[index].messages[j]
        messager.error(`line ${message.line}, col ${message.column}: ${message.message}`)
      }
    }
  }
}
// 格式化样式检查数据
const jsErrorFormatter = function (jsLintResults) {
  jsErrorResults = []
  jsLintResults.forEach(function (result) {
    if (result.messages.length === 0) {
      return false
    }
    jsErrorResults.push(result)
  })
  if (jsErrorResults.length > 0) {
    jsErrorNotifier()
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
        jsErrorFormatter(data)
      }
    }))
    .on('end', () => {
      if (DEV === false) {
        common.messager.log('JS 代码风格检查完成')
        resolve && resolve(jsErrorResults.length)
      }
    })
}
