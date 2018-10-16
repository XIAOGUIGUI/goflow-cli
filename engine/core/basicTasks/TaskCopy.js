const path = require('path')
module.exports = (gulp, common, options) => {
  const { projectPath, buildDistPath, assetsPath } = common.config
  let copyDistPath = assetsPath
  if (options.distPath && options.distPath === true) {
    copyDistPath = buildDistPath
  }
  let matchingPath = '/**/*'
  if (options.currentDirectory && options.currentDirectory === true) {
    matchingPath = '/*'
  }
  let copyOptions = {}
  if (options.base && options.base === true) {
    let copyBasePath = path.resolve(projectPath, options.directory)
    copyOptions.base = copyBasePath
  } else {
    copyDistPath = path.resolve(copyDistPath, options.distDirectory)
  }
  const copySrcPath = path.resolve(projectPath, options.directory + matchingPath)
  gulp.src(copySrcPath, copyOptions)
    .pipe(gulp.dest(copyDistPath))
}
