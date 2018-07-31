// 处理多语言art-template页面
const path = require('path')
const artTemplate = require('art-template')
module.exports = (gulp, common) => {
  const { projectPath, buildDistPath, publicAssetsPath } = common.config
  const { defulteLang } = common.config.lang
  const artPath = path.resolve(projectPath, './src/art/lang/*.html')
  const artCommonPath = path.resolve(projectPath, './src/art/common')
  let fileName = ''
  gulp.src(artPath)
    .pipe(common.plugins.rename(function (path) {
      fileName = path.basename;
    }))
    .pipe(common.plugins.changed(buildDistPath))
    .pipe(common.plugins.htmlTpl({
      tag: 'template',
      paths: [artCommonPath],
      engine: function(template, data) {
        try {
          data = require(path.join(`${projectPath}/src/lang/${fileName}/${defulteLang}.js`))
          data.publicAssetsPath = publicAssetsPath
        } catch (error) {
          console.error(`[ART LANG ERROR]: ${error}`)
        }
        return artTemplate.compile(template)(data)
      }
    })).on('error', e => {
      console.error(`[ART ERROR]: ${e.message}`)
    })
    .pipe(gulp.dest(buildDistPath))
    .pipe(common.reload({stream: true}))
}
