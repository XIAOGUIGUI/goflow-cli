const path = require('path')
const pngquant = require('imagemin-pngquant')

module.exports = (gulp, common) => new Promise(resolve => {
  const { projectPath, buildDistPath, assetsPath } = common.config
  const imgPath = path.resolve(projectPath, './src/img/*.{png,jpg,gif,ico}')
  const manifestPath = path.resolve(buildDistPath, './rev-manifest.json')
  gulp.src(imgPath, { base: 'src' })
    .pipe(common.plugins.imagemin({
      use: [pngquant()]
    }))
    .pipe(common.plugins.rev())
    .pipe(common.plugins.rename(function (filePath) {
      let index = filePath.basename.lastIndexOf('-')
      filePath.basename = filePath.basename.substring(0, index) + '.' + filePath.basename.substring(index + 1)
    }))
    .on('error', e => {
      console.log(e)
    })
    .pipe(gulp.dest(assetsPath))
    .pipe(common.plugins.rev.manifest(manifestPath, {
      base: buildDistPath,
      merge: true
    }))
    .pipe(gulp.dest(buildDistPath))
    .on('end', () => {
      common.messager.log('图片压缩完成')
      resolve()
    })
})
