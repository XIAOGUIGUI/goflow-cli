'use strict'

const fs = require('fs')
const UglifyJS = require('uglify-es')

module.exports = function (filePath, config) {
  let code = fs.readFileSync(filePath, 'utf-8')
  code = code.replace(/appversion/, config.version).replace(/sw_version/, config.cacheId)
  const result = UglifyJS.minify(code)
  if (result.error) return ''
  return result.code
}
