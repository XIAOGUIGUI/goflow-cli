const path = require('path')
const glob = require('glob')
module.exports = (common) => {
  const { projectPath } = common.config
  let globPath = path.resolve(projectPath, 'src/views/**?/*.html')
  let pages = []
  let chunkOther = {}
  let entries = {}

  glob.sync(globPath).forEach(function (entry) {
    let basename = path.basename(entry, path.extname(entry))
    let tmp = entry.split('/').splice(-3)
    let pathname = basename
    entries[pathname] = './src/views/' + tmp[1] + '/' + tmp[1] + '.js'
    pages.push(pathname)
  })
  if (pages.length === 0) {
    common.messager.stop('多页面文件不存在,请在views文件夹添加页面的html与js')
  } else {
    for (let index = 0; index < pages.length; index++) {
      let pageName = pages[index]
      let chunkOtherString = pages.filter(val => val !== pageName).join('|')
      chunkOther[pageName] = chunkOtherString
    }
  }
  return {
    entries,
    chunkOther,
    pages
  }
}
