const path = require('path')
const glob = require('glob')

module.exports = (config) => {
  const { buildDistPath } = config
  let globPath = path.resolve(buildDistPath, './**?/*.html')
  let entries = {
  }
  let basename
  let tmp
  let pathname

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry))
    tmp = entry.split('/').splice(-3)
    pathname = basename // 正确输出js和html的路径

    // console.log(pathname)
    entries[pathname] = './src/views/' + tmp[1] + '/' + tmp[1] + '.js'
    // entries[pathname] = {
    //   entry: 'src/' + tmp[1] + '/' + tmp[1] + '.js',
    //   template: tmp[0] + '/' + tmp[1] + '/' + tmp[2],
    //   title: tmp[2],
    //   filename: tmp[2]
    // }
  })
  return entries
}
