// 处理多语言art-template页面
const path = require('path')
module.exports = (gulp, common, langStr, resolve) => {
  const DEV = process.env.NODE_ENV === 'dev'
  const { projectPath, buildDistPath, publicAssetsPath } = common.config
  const { userArgs } = common.config[process.env.NODE_ENV]
  const defulteLang = common.config.lang && common.config.lang.defulteLang ? common.config.lang.defulteLang : 'en'
  const artPath = path.resolve(projectPath, './src/art_lang/*.html')
  const artCommonPath = path.resolve(projectPath, './src/art_common')
  let lang = langStr || defulteLang
  let fileName = ''
  let assetsPath = publicAssetsPath
  let langHtmlNameList = []
  if (publicAssetsPath.indexOf('/') === 0 ) {
    assetsPath = publicAssetsPath.replace("/","../")
  } else if (publicAssetsPath.indexOf('./') === 0){
    assetsPath = publicAssetsPath.replace("./", "../")
  }
  gulp.src(artPath)
    .pipe(common.plugins.rename(function (Filepath) {
      fileName = Filepath.basename;
      langHtmlNameList.push(fileName)
      Filepath.dirname += '/' + Filepath.basename;
      Filepath.basename = lang;
      Filepath.extname = '.html';
    }))
    .pipe(common.plugins.changed(buildDistPath))
    .pipe(common.plugins.htmlArt({
      paths: [artCommonPath],
      formatData: function(data) {
        try {
          data = require(`${projectPath}/src/lang/${fileName}/${lang}.js`)
        } catch (error) {
          throw({
            fileName: fileName,
            message: `${lang}多语言js文件未找到`
          })
        }
        data.publicAssetsPath = assetsPath
        data.userArgs = userArgs
        data.DEBUG = DEV
        return data
      },
    })).on('error', e => {
      let fileName = e.fileName || path.basename(e.file)
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
      resolve && resolve(langHtmlNameList)
    })
    .pipe(common.reload({stream: true}))
}
