// 处理art-template页面
const path = require('path')
module.exports = (gulp, common, other) => {
  const DEV = process.env.NODE_ENV === 'dev'
  const { projectPath, buildDistPath, publicAssetsPath, multiple } = common.config
  const { userArgs, env } = common.config[process.env.NODE_ENV]
  let htmlPath = multiple.enable ? './src/views/**?/*.html' : './src/*.html'
  const srcPath = path.resolve(projectPath, htmlPath)
  const artCommonPath = path.resolve(projectPath, './src/art_common')
  let hasChange = true
  let callBack
  if (typeof other === 'function') {
    callBack = other
  } else if (typeof other === 'boolean') {
    hasChange = other
  }
  let data = {
    publicAssetsPath,
    userArgs,
    NODE_ENV: env,
    DEBUG: DEV
  }
  if (multiple.enable) {
    data.chunkOther = multiple.chunkOther
  }
  gulp.src(srcPath)
    .pipe(common.plugins.if(multiple.enable, common.plugins.rename(function (Filepath) {
      Filepath.dirname = ''
      data.pageName = Filepath.basename
    })))
    .pipe(common.plugins.if(hasChange, common.plugins.changed(buildDistPath)))
    .pipe(common.plugins.htmlArt({
      paths: [artCommonPath],
      data
    }))
    .on('error', e => {
      let fileName = path.basename(e.file)
      common.messager.notice('ART 编译错误 >> ')
      common.messager.error(`ART 编译错误: ${fileName}文件`)
      if (e.type === 'TemplateError') {
        common.messager.error(`line ${e.line}, col ${e.column}: ${e.message}`)
      } else {
        common.messager.error(`错误原因: ${e.message}`)
      }
    })
    .pipe(gulp.dest(buildDistPath))
    .on('end', () => {
      if (DEV === false) {
        common.messager.log('ART 编译完成')
      }
      callBack && callBack()
    })
    .pipe(common.plugins.if(DEV, common.reload({ stream: true })))
}
