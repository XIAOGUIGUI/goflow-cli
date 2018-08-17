module.exports = (gulp, common) => new Promise(resolve => {
  const {buildDistPath} = common.config
  gulp.src( `${ buildDistPath }/**/*.html` )
    .pipe(common.plugins.inlineSource() )
    .pipe(gulp.dest(buildDistPath) )
    .on('end', () => {
      common.messager.log( 'HTML 内联成功' )
      resolve()
    })
})