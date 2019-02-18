const path = require('path')

module.exports = (gulp, common) => new Promise(resolve => {
  const { projectPath, assetsPath } = common.config
  const imgPath = path.resolve(projectPath, './src/img/*.{png,jpg}')
  gulp.src(imgPath, { base: 'src' })
    .pipe(common.plugins.rev())
    .pipe(common.plugins.webp())
    .pipe(common.plugins.rename(function (filePath) {
      let index = filePath.basename.lastIndexOf('-')
      filePath.basename = filePath.basename.substring(0, index) + '.' + filePath.basename.substring(index + 1)
    }))
    .on('error', e => {
      console.log(e)
    })
    .pipe(gulp.dest(assetsPath))
    .on('end', () => {
      common.messager.log('图片webp压缩完成')
      resolve()
    })
})
