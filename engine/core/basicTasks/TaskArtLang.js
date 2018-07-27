// 处理多语言art-template页面
// 处理art-template页面
const path = require('path')
const artTemplate = require('art-template')
module.exports = (gulp, common) => {
  const { projectPath, buildDist } = common.config
  const { defulteLang } = common.config.lang
  const artPath = path.resolve(projectPath, './src/art/lang/*.html')
  const artCommonPath = path.resolve(projectPath, './src/art/common')
  let fileName = ''
  gulp.src(artPath)
    .pipe(common.plugins.rename(function (path) {
      fileName = path.basename;
    }))
    .pipe(common.plugins.changed(buildDist))
    .pipe(common.plugins.htmlTpl({
      tag: 'template',
      paths: [artCommonPath],
      engine: function(template, data) {
        try {
          data = require(path.join(`${projectPath}/src/lang/${fileName}/${defulteLang}.js`))
        } catch (error) {
          console.error(`[ART LANG ERROR]: ${error}`)
        }
        return artTemplate.compile(template)(data)
      }
    })).on('error', e => {
      console.error(`[ART ERROR]: ${e.message}`)
    })
    .pipe(gulp.dest(buildDist))
    .pipe(common.reload({stream: true}))
}
