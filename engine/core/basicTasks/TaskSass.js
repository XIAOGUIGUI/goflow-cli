const path = require('path')
const through = require('through2')
const escape = require('lodash/escape')

let sassCompileError = false
let sassCompileSuccess = false
let messager
const sassErrorNotifier = function (msg) {

  messager.notice( 'Sass 编译错误 >> ' )

  messager.error( `Sass 编译错误: ${ msg.file.split( '/' ).pop( ) }文件 line ${ msg.line }, col ${ msg.col }: ${ msg.message.replace(/\"/g,'\'') }` )

  this.emit('end')
}
const styleErrorNotifier = function (stylelintResults) {
  if (stylelintResults.length > 0) {
    messager.notice('Sass 样式检查错误 >> ')
    stylelintResults.forEach(function(stylelintResult) {
      if (!stylelintResult.warnings.length) {
        return false
      }
      let fileName = escape(stylelintResult.source)
      messager.error( `Sass 样式检查错误: ${ fileName }文件`)
      stylelintResult.warnings.forEach(function(warning) {
        messager.error( `line ${ escape(warning.line) }, col ${ escape(warning.column) }: ${ escape(warning.text) }` )
      })
    })
  }
}
module.exports = (gulp, common) => new Promise(resolve => {

  const { projectPath, assetsPath } = common.config
  messager = common.messager
  const sassPath = path.resolve(projectPath, './src/sass/**/*.scss')
  const distPath = path.resolve(assetsPath, './css')

  gulp.src(sassPath)
    .pipe(common.plugins.changed(distPath, {
      extension: '.css'
    }))
    .pipe(common.plugins.stylelint({
      reporters: [{
        formatter: styleErrorNotifier
      }]
    }))
    .on('error', function(){
      this.emit('end')
      resolve()
    })
    .pipe(common.plugins.sourcemaps.init())
    .pipe(common.plugins.sass())
    .on('error', sassErrorNotifier)
    .pipe( through.obj( ( file, enc, cb ) => {
      sassCompileSuccess = true
      cb( null, file )
    }))
    .pipe(common.plugins.sourcemaps.write())
    .pipe(gulp.dest(distPath))
    .pipe(common.reload({ stream: true } ))
    .on( 'end', ( ) => {
      resolve()
    })
})