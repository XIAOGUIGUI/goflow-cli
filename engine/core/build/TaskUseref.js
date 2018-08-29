const path = require('path')
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
    .pipe(common.plugins.if(/\.js$/,common.plugins.uglify()))
    .pipe(common.plugins.if(/\.css$/, common.plugins.cssnano({
      safe: true,
      reduceTransforms: false,
      advanced: false,
      compatibility: 'ie8',
      keepSpecialComments: 0
    })))
    .pipe(gulp.dest(buildDistPath))
    .on( 'end', resolve )
})