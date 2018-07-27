// 处理art-template页面
const path = require('path')
const artTemplate = require('art-template')
module.exports = (gulp, common) => {
  const { projectPath, buildDist } = common.config
  const artPath = path.resolve(projectPath, './src/art/*.html')
  const artCommonPath = path.resolve(projectPath, './src/art/common')
  gulp.src(artPath)
    .pipe(common.plugins.changed(buildDist))
    .pipe(common.plugins.htmlTpl({
      tag: 'template',
      paths: [artCommonPath],
      engine: function(template, data) {
        return artTemplate.compile(template)(data)
      }
    }))
    .on('error', e => {
      console.error(`[ART ERROR]: ${e.message}`)
    })
    .pipe(gulp.dest(buildDist))
    .pipe(common.reload({stream: true}))
}