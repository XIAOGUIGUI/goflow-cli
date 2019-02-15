const fs = require('fs-extra')
const path = require('path')
const del = require('del')

module.exports = (gulp, common) => new Promise(resolve => {
  const { buildDistPath, assetsPath, relativeHtmlPath } = common.config
  const jsPath = path.resolve(assetsPath, 'js/**/*.js')
  const cssPath = path.resolve(assetsPath, 'css/**/*.css')
  const fontPath = path.resolve(assetsPath, 'font/**/*')
  const manifestPath = path.resolve(buildDistPath, './rev-manifest.json')
  const tmpPath = path.resolve(buildDistPath, './tmp', relativeHtmlPath)
  gulp.src([jsPath, cssPath, fontPath], { base: assetsPath })
    .pipe(common.plugins.rev())
    .on('error', e => {
      console.log(e)
    })
    .pipe(common.plugins.rename(function (filePath) {
      let index = filePath.basename.lastIndexOf('-')
      filePath.basename = filePath.basename.substring(0, index) + '.' + filePath.basename.substring(index + 1)
    }))
    .pipe(gulp.dest(tmpPath))
    .pipe(common.plugins.rev.manifest(manifestPath, {
      base: buildDistPath,
      merge: true
    }))
    .pipe(gulp.dest(buildDistPath))
    .on('end', () => {
      del.sync(jsPath)
      del.sync(cssPath)
      del.sync(fontPath)
      gulp.src(path.resolve(tmpPath, './**/*'))
        .pipe(gulp.dest(assetsPath))
        .on('end', () => {
          fs.removeSync(path.resolve(buildDistPath, './tmp'))
          resolve()
        })
    })
})
