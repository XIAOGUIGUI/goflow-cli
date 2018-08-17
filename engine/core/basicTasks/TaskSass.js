const path = require('path')
const escape = require('lodash/escape')
const postcssAutoprefixer = require('autoprefixer');
const postcssPxtorem = require('postcss-pxtorem');
let DEV
let styleErrorResult = []
let messager
const sassErrorNotifier = function (msg) {
  let fileName = path.basename(msg.file)
  messager.notice( 'Sass 编译错误 >> ' )
  messager.error( `Sass 编译错误: ${ fileName }文件`)
  messager.error( `line ${ msg.line }, col ${ msg.column }: ${ msg.messageOriginal }` )
  if (DEV === true) {
    this.emit('end')
  }
}
// 输出代码格式错误信息
const styleErrorNotifier = function () {
  messager.notice('Sass 样式检查错误 >> ')
  styleErrorResult.forEach(function(result) {
    messager.error( `Sass 样式检查错误: ${ result.fileName }文件`)
    result.warnings.forEach(function(warning) {
      messager.error( `line ${ escape(warning.line) }, col ${ escape(warning.column) }: ${ escape(warning.text) }` )
    })
  })
}
// 格式化样式检查数据
const styleErrorFormatter = function (stylelintResults) {
  styleErrorResult = []
  stylelintResults.forEach(function(result) {
    if (result.warnings.length === 0) {
      return false
    }
    let resultObject = {
      warnings: []
    }
    resultObject.fileName = path.basename(result.source)
    
    result.warnings.forEach(function(warning) {
      resultObject.warnings.push(warning)
    })
    styleErrorResult.push(resultObject)
  })
  if (styleErrorResult.length > 0) {
    styleErrorNotifier()
  }
}
let getPostcssList = config => {
  let result = [postcssAutoprefixer({
    browsers: config.browserslist,
    cascade: true,
    remove: false})]
  if (config.px2rem.enable === true) {
    result.push(postcssPxtorem(config.px2rem))
  }
  return result
}
module.exports = (gulp, common) => new Promise(resolve => {
  DEV = process.env.NODE_ENV === 'dev'
  const { projectPath, assetsPath } = common.config
  messager = common.messager
  const sassPath = path.resolve(projectPath, './src/sass/**/*.scss')
  const distPath = path.resolve(assetsPath, './css')

  gulp.src(sassPath)
    .pipe(common.plugins.changed(distPath, {
      extension: '.css'
    }))
    .pipe(common.plugins.stylelint({
      reporters: [{
        formatter: styleErrorFormatter
      }]
    }))
    .on('error', function(e){
      if (DEV === true) {
        this.emit('end')
        resolve()
      }
    })
    .pipe(common.plugins.if(DEV,common.plugins.sourcemaps.init()))
    .pipe(common.plugins.sass())
    .on('error', sassErrorNotifier)
    .pipe(common.plugins.if(!DEV,common.plugins.cssBase64({
      baseDir: '../img/',
      maxWeightResource: 1024 * 10,
      extensionsAllowed: [ '.png', '.jpg', 'gif', 'jpeg', 'svg' ],
    })))
    .pipe(common.plugins.postcss(getPostcssList(common.config)))
    .on('error', function(e){
      console.log(e)
    })
    .pipe(common.plugins.if(!DEV,common.plugins.cssnano({
      safe: true,
      reduceTransforms: false,
      advanced: false,
      compatibility: 'ie8',
      keepSpecialComments: 0
    })))
    .pipe(common.plugins.if(DEV,common.plugins.sourcemaps.write()))
    .pipe(gulp.dest(distPath))
    .on('end', ( ) => {
      if (DEV === false && styleErrorResult.length === 0) {
        messager.log( 'Sass 构建完成' )
        resolve()
      } else if (DEV === true) {
        resolve()
      }
    })
    .pipe(common.plugins.if(DEV, common.reload({ stream: true } )))
    
})