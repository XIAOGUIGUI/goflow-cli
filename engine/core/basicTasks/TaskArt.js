// 处理art-template页面
const path = require('path')
module.exports = (gulp, common, callBack) => {
  const DEV = process.env.NODE_ENV === 'dev'
  const { projectPath, buildDistPath, publicAssetsPath } = common.config
  const { userArgs } = common.config[process.env.NODE_ENV]
  const srcPath = path.resolve(projectPath, './src/*.html')
  const artCommonPath = path.resolve(projectPath, './src/art_common')
  let data = {
    publicAssetsPath,
    userArgs,
    DEBUG: DEV
  }
  gulp.src(srcPath)
    .pipe(common.plugins.changed(buildDistPath))
    .pipe(common.plugins.htmlArt({
      paths: [artCommonPath],
      data
    }))
    .on('error', e => {
      let fileName = path.basename(e.file)
      common.messager.notice( 'ART 编译错误 >> ' )
      common.messager.error( `ART 编译错误: ${ fileName }文件`)
      if (e.type === 'TemplateError') {
        common.messager.error( `line ${ e.line }, col ${ e.column }: ${ e.message }` )
      } else {
        common.messager.error( `错误原因: ${  e.message }`)
      }
    })
    .pipe(gulp.dest(buildDistPath))
    .on('end', ( ) => {
      if (DEV === false) {
        common.messager.log( 'ART 编译完成' )
      }
      callBack && callBack()
    })
    .pipe(common.plugins.if(DEV, common.reload({ stream: true } )))
}