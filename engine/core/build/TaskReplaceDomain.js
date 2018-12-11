module.exports = (gulp, common) => new Promise(resolve => {
  const { buildDistPath, assetsPath } = common.config
  const { resourcesDomain, imgResourcesDomain, assetsSubDirectory } = common.config[process.env.NODE_ENV]
  const cssPath = `${assetsPath}/css/`
  let htmlDisPlaceState = false
  let cssDisPlaceState = false
  let callcack = () => {
    if (htmlDisPlaceState && cssDisPlaceState) {
      resolve()
    }
  }
  if (resourcesDomain && resourcesDomain.length !== 0) {
    gulp.src(`${buildDistPath}/**/*.html`)
      .pipe(common.plugins.domainReplace({
        assetsUrl: resourcesDomain,
        assetsPath: assetsSubDirectory,
        type: assetsSubDirectory
      }))
      .pipe(gulp.dest(buildDistPath))
      .on('end', () => {
        htmlDisPlaceState = true
        callcack()
      })
  } else {
    htmlDisPlaceState = true
  }
  if ((resourcesDomain && resourcesDomain.length !== 0) || (imgResourcesDomain && imgResourcesDomain.length !== 0)) {
    gulp.src(`${assetsPath}/css/*.css`)
      .pipe(common.plugins.domainReplace({
        assetsUrl: resourcesDomain,
        imgUrl: imgResourcesDomain,
        assetsPath: assetsSubDirectory
      }))
      .pipe(gulp.dest(cssPath))
      .on('end', () => {
        cssDisPlaceState = true
        callcack()
      })
  } else {
    cssDisPlaceState = true
    callcack()
  }
})
