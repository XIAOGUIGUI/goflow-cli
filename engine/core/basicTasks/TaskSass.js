const path = require('path')
const through = require('through2')
let sassCompileError = false
let sassCompileSuccess = false
let messager
const sassErrorNotifier = function (msg) {

  console.log( 'Sass 编译错误 >> ' )

  messager.error( `Sass 编译错误: ${ msg.file.split( '/' ).pop( ) }文件 line${ msg.line } >> ${ msg.message.replace(/\"/g,'\'') }` )

  messager.notice( `Sass编译错误: ${ msg.file.split( '/' ).pop( ) }文件 line${ msg.line }` )

  this.emit('end')
}
const styleErrorNotifier = function (msg) {

  console.log(msg)

  this.emit('end')
}
module.exports = (gulp, common) => {
  const { projectPath, assetsPath } = common.config
  messager = common.messager
  const sassPath = path.resolve(projectPath, './src/sass/**/*.scss')
  const distPath = path.resolve(assetsPath, './css')

  gulp.src(sassPath)
    .pipe(common.plugins.changed(distPath, {
      extension: '.css'
    }))
    .pipe(common.plugins.stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }))
    .on('error', styleErrorNotifier)
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
}