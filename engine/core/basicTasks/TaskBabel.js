const path = require('path')
module.exports = (gulp, common) =>  {
  const { root, projectPath, assetsPath } = common.config
  const jsPath = path.resolve(projectPath, './src/js/**/*.js')
  const distPath = path.resolve(assetsPath, './js')
  const es2015Path = path.resolve(root, './node_modules/babel-preset-es2015')
  gulp.src(jsPath)
    .pipe(common.plugins.changed(distPath, {
      extension: '.js'
    }))
    .pipe(common.plugins.babel({
      presets: [es2015Path]
    }))
    .on('error', function(e){
      console.log(e)
      this.emit('end')
    })
    .pipe(gulp.dest(distPath))
    .pipe(common.reload({ stream: true } ))
}