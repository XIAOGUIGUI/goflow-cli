const path = require('path')
module.exports = (gulp, common, resolve) => {
  const DEV = process.env.NODE_ENV === 'dev'
  const { root, projectPath, assetsPath } = common.config
  const { env } = common.config[process.env.NODE_ENV]
  const defineVariable = require('../common/define_variable')(common.config)
  const jsPath = path.resolve(projectPath, './src/js/**/*.js')
  const distPath = path.resolve(assetsPath, './js')
  const es2015Path = path.resolve(root, './node_modules/babel-preset-es2015')
  let uglifyOption = {
    compress: {}
  }
  if (env === 'prod') {
    uglifyOption.compress.drop_console = true
  }
  gulp.src(jsPath)
    .pipe(common.plugins.if(DEV, common.plugins.changed(distPath, {
      extension: '.js'
    })))
    .pipe(common.plugins.preprocess({ context: defineVariable }))
    .pipe(common.plugins.babel({
      presets: [es2015Path]
    }))
    .on('error', function (e) {
      this.emit('end')
    })
    .pipe(common.plugins.if(!DEV, common.plugins.uglify(uglifyOption)))
    .pipe(gulp.dest(distPath))
    .on('end', () => {
      if (DEV === false) {
        common.messager.log('JS 构建完成')
        resolve()
      }
      resolve && resolve()
    })
    .pipe(common.plugins.if(DEV, common.reload({ stream: true })))
}
