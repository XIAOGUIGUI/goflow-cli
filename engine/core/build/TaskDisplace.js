const del = require('del')
module.exports = (gulp, common) => new Promise(resolve => {
  const { buildDistPath, assetsPath } = common.config
  const cssPath = `${assetsPath}/css/`
  let htmlDisPlaceState = false
  let cssDisPlaceState = false
  let callcack = () => {
    if (htmlDisPlaceState && cssDisPlaceState) {
      del.sync(`${buildDistPath}/tmp`)
      del.sync(`${buildDistPath}/rev-manifest.json`)
      common.messager.log('静态资源Reversion 构建完成')
      resolve()
    }
  }
  gulp.src([`${buildDistPath}/rev-manifest.json`, `${buildDistPath}/**/*.html`])
    .pipe(common.plugins.revDisplace({
      replaceReved: true
    }))
    // .pipe(common.plugins.htmlmin({
    //   collapseWhitespace: true,
    //   minifyCSS: true,
    //   minifyJS: {compress: {drop_console: true}},
    //   processConditionalComments: true,
    //   removeComments: true,
    //   removeEmptyAttributes: true,
    //   removeScriptTypeAttributes: true,
    //   removeStyleLinkTypeAttributes: true
    // }))
    .pipe(gulp.dest(buildDistPath))
    .on('end', () => {
      htmlDisPlaceState = true
      callcack()
    })
  gulp.src([`${buildDistPath}/rev-manifest.json`, `${cssPath}/*.css`])
    .pipe(common.plugins.revDisplace({
      replaceReved: true
    }))
    .pipe(gulp.dest(cssPath))
    .on('end', () => {
      cssDisPlaceState = true
      callcack()
    })
})
