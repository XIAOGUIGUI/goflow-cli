const path = require('path')
const postcssAutoprefixer = require('autoprefixer')
const postcssPxtorem = require('postcss-pxtorem')
let DEV
let messager
const sassErrorNotifier = function (msg) {
  let fileName = path.basename(msg.file)
  messager.notice('Sass 编译错误 >> ')
  messager.error(`Sass 编译错误: ${fileName}文件`)
  messager.error(`line ${msg.line}, col ${msg.column}: ${msg.messageOriginal}`)
  if (DEV === true) {
    this.emit('end')
  }
}
let getPostcssList = config => {
  let result = [
    postcssAutoprefixer({
      browsers: config.browserslist,
      cascade: true,
      remove: false
    })
  ]
  if (config.px2rem.enable === true) {
    result.push(postcssPxtorem(config.px2rem))
  }
  return result
}
module.exports = (gulp, common) => new Promise(resolve => {
  const { projectPath, assetsPath } = common.config
  const sassPath = path.resolve(projectPath, './src/sass/**/*.scss')
  const sassBasePath = path.resolve(projectPath, './src/sass/')
  const distPath = path.resolve(assetsPath, './css')

  DEV = process.env.NODE_ENV === 'dev'
  messager = common.messager
  gulp.src(sassPath)
    .pipe(common.plugins.changed(distPath, {
      extension: '.css'
    }))
    .pipe(common.plugins.betterSassInheritance({ base: sassBasePath }))
    .pipe(common.plugins.if(DEV, common.plugins.sourcemaps.init()))
    .pipe(common.plugins.sass())
    .on('error', sassErrorNotifier)
    .pipe(common.plugins.if(!DEV, common.plugins.cssBase64({
      baseDir: '../img/',
      maxWeightResource: 1024 * 10,
      extensionsAllowed: ['.png', '.jpg', 'gif', 'jpeg', 'svg']
    })))
    .pipe(common.plugins.postcss(getPostcssList(common.config)))
    .on('error', function (e) {
      console.log(e)
    })
    .pipe(common.plugins.if(!DEV, common.plugins.cleanCss()))
    .pipe(common.plugins.if(DEV, common.plugins.sourcemaps.write()))
    .pipe(gulp.dest(distPath))
    .on('end', () => {
      if (DEV === false) {
        messager.log('Sass 构建完成')
        resolve()
      }
      resolve()
    })
    .pipe(common.plugins.if(DEV, common.reload({ stream: true })))
})
