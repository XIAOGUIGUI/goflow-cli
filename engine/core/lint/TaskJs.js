const path = require('path')
const glob = require('glob')
module.exports = (gulp, common, resolve) =>  {
  const DEV = process.env.NODE_ENV === 'dev'
  const { projectPath, assetsPath } = common.config
  const jsPath = path.resolve(projectPath, './src/js/**/*.js')
  const distPath = path.resolve(assetsPath, './js')
  const eslint = common.plugins.eslint
  const [ eslintConfig ] = glob.sync(path.resolve(projectPath, '.eslintrc.*'))
  gulp.src(jsPath)
    .pipe(common.plugins.if(DEV, common.plugins.changed(distPath, {
      extension: '.js'
    })))
    .pipe(eslint({
      configFile: eslintConfig || path.resolve(__dirname, '../common/default_js_eslint.js')
    }))
    .pipe(eslint.results(results => {
      // Called for each ESLint result.
      if (results.errorCount > 0) {
        common.messager.notice('JS 代码检查错误 >> ')
        for (let index = 0; index < results.length; index++) {
          if (results[index].errorCount > 0) {
            let fileName = path.basename(results[index].filePath)
            common.messager.error( `JS 代码检查错误: ${ fileName }文件`)
            for (let j = 0; j < results[index].messages.length; j++) {
              let message =  results[index].messages[j];
              common.messager.error( `line ${ message.line }, col ${ message.column }: ${ message.message }` )
            }
          }
        }
      } else {
        if (DEV === false) {
          common.messager.log( 'JS 代码风格检查完成' )
        }
        resolve && resolve()
      }
    }))
}