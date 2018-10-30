'use strict'

const fs = require('fs')
const UglifyJS = require('uglify-es')

module.exports = function (filePath, version) {
  let code = fs.readFileSync(filePath, 'utf-8')
  code = code.replace(/appversion/, version)
  const result = UglifyJS.minify(code)
  if (result.error) return ''
  return result.code
}
