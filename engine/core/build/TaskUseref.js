const path = require('path')
// 合并请求
module.exports = (gulp, common) => new Promise(resolve => {
  const { buildDistPath, localNodeModules, appNodeModules } = common.config
  const htmlPath = path.resolve(buildDistPath, './**/*.html')
  gulp.src(htmlPath)
    .pipe(common.plugins.userefMin({
      searchPath: [buildDistPath, localNodeModules, appNodeModules]
    }))
    .on('error', e => {
      console.log(e)
    })
    .pipe(common.plugins.if(/\.js$/, common.plugins.uglify()))
    .pipe(common.plugins.if(/\.css$/, common.plugins.cleanCss()))
    .pipe(gulp.dest(buildDistPath))
    .on('end', () => {
      resolve()
    })
})
