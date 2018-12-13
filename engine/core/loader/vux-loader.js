'use strict'
const matchI18nReg = /\$t\('?(.*?)'?\)/g

module.exports = function (source) {
  this.cacheable()
  let isVuxVueFile = this.resourcePath.replace(/\\/g, '/').indexOf('vux/src/components') > -1
  let locale = 'zh-CN'
  if (isVuxVueFile && source.indexOf('$t(') > -1) {
    source = source.replace(matchI18nReg, function (a, b) {
      if (a.indexOf('/*') > -1) {
        const start = a.indexOf('/*')
        const end = a.indexOf('*/')
        const str = a.slice(start + 2, end - 1)
        const map = {}
        str.split(',').map(one => {
          one = one.trim()
          const pair = one.split(':').map(one => one.trim())
          map[pair[0]] = pair[1]
        })
        return map[locale]
      }
      return b
    })
  }
  return source
}
