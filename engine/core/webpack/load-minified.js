'use strict'

const fs = require('fs')
const UglifyJS = require('uglify-es')

module.exports = function (filePath, assetsPublicPath) {
  let code = fs.readFileSync(filePath, 'utf-8')
  if (assetsPublicPath.indexOf('//') === 0) {
    code = code.replace(/service-worker.js/, `${assetsPublicPath}/service-worker.js`)
  }
  const result = UglifyJS.minify(code)
  if (result.error) return ''
  return result.code
}
