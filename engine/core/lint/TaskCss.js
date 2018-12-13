const path = require('path')
let messager = null
let styleErrorResult = []
// 输出代码格式错误信息
const styleErrorNotifier = function () {
  messager.notice('Sass 样式检查错误 >> ')
  styleErrorResult.forEach(function (result) {
    messager.notice(`Sass 样式检查错误: ${result.fileName}文件`)
    result.warnings.forEach(function (warning) {
      messager.error(`line ${warning.line}, col ${warning.column}: ${warning.text}`)
    })
  })
}
// 格式化样式检查数据
const styleErrorFormatter = function (stylelintResults) {
  styleErrorResult = []
  stylelintResults.forEach(function (result) {
    if (result.warnings.length === 0) {
      return false
    }
    let resultObject = {
      warnings: []
    }
    resultObject.fileName = result.source && result.source.split('src')[1]
    result.warnings.forEach(function (warning) {
      if (!(resultObject.fileName.indexOf('.vue') > -1 && warning.rule === 'no-empty-source')) {
        resultObject.warnings.push(warning)
      }
    })
    if (resultObject.warnings.length !== 0) {
      styleErrorResult.push(resultObject)
    }
  })
  if (styleErrorResult.length > 0) {
    styleErrorNotifier()
  }
}
module.exports = (gulp, common, resolve) => {
  const DEV = process.env.NODE_ENV === 'dev'
  const { projectPath } = common.config
  const sassPath = path.resolve(projectPath, './src/sass/**/*.scss')
  const vuePath = path.resolve(projectPath, './src/**/*.vue')
  messager = common.messager
  gulp.src([vuePath, sassPath])
    .pipe(common.plugins.stylelint({
      configFile: path.resolve(__dirname, '../common/default_css_stylelint.js'),
      reporters: [{
        formatter: styleErrorFormatter
      }]
    }))
    .on('error', function (e) {
      if (DEV === true) {
        resolve && resolve()
      }
    })
    .on('end', () => {
      if ((DEV === false && styleErrorResult.length === 0) || process.env.NODE_ENV === 'lint') {
        messager.log('css 代码风格检查完成')
        resolve && resolve(styleErrorResult.length)
      }
    })
}
