// 处理art-template页面
const path = require('path')
const artTemplate = require('art-template')
module.exports = (gulp, common) => {
  
  const { projectPath, buildDistPath, publicAssetsPath } = common.config
  const artPath = path.resolve(projectPath, './src/art/*.html')
  const srcHtmPath = path.resolve(projectPath, './src/*.html')
  const artCommonPath = path.resolve(projectPath, './src/art/common')
  gulp.src([srcHtmPath, artPath])
    .pipe(common.plugins.changed(buildDistPath))
    .pipe(common.plugins.htmlTpl({
      tag: 'template',
      paths: [artCommonPath],
      engine: function(template, data) {
        data.publicAssetsPath = publicAssetsPath
        return artTemplate.compile(template)(data)
      }
    }))
    .on('error', e => {
      console.error(`[ART ERROR]: ${e.message}`)
    })
    .pipe(gulp.dest(buildDistPath))
    .pipe(common.reload({stream: true}))
}