const path = require('path')
let messager = null
let styleErrorResult = []
// 输出代码格式错误信息
const styleErrorNotifier = function () {
  messager.notice('Sass 样式检查错误 >> ')
  styleErrorResult.forEach(function (result) {
    messager.error(`Sass 样式检查错误: ${result.fileName}文件`)
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
    resultObject.fileName = path.basename(result.source)
    result.warnings.forEach(function (warning) {
      resultObject.warnings.push(warning)
    })
    styleErrorResult.push(resultObject)
  })
  if (styleErrorResult.length > 0) {
    styleErrorNotifier()
  }
}
module.exports = (gulp, common, resolve) => {
  const DEV = process.env.NODE_ENV === 'dev'
  const { projectPath } = common.config
  const sassPath = path.resolve(projectPath, './src/sass/**/*.scss')

  messager = common.messager
  gulp.src(sassPath)
    .pipe(common.plugins.stylelint({
      configFile: path.resolve(__dirname, '../common/default_css_stylelint.js'),
      reporters: [{
        formatter: styleErrorFormatter
      }]
    }))
    .on('error', function () {
    })
    .on('end', () => {
      if ((DEV === false && styleErrorResult.length === 0) || process.env.NODE_ENV === 'lint') {
        messager.log('css 代码风格检查完成')
        resolve && resolve(styleErrorResult.length)
      }
    })
}
