'use strict'
const matchI18nReg = /\$t\('?(.*?)'?\)/g
const getI18nBlockWithLocale = require('./libs/get-i18n-block').getWithLocale
const getName = function (path) {
  return path.replace(/\\/g, '/').split('components')[1].replace('index.vue', '').replace(/\//g, '')
}

module.exports = function (source) {
  this.cacheable()
  let isVuxVueFile = this.resourcePath.replace(/\\/g, '/').indexOf('vux/src/components') > -1
  let locale = 'zh-CN'
  if (isVuxVueFile && source.indexOf('$t(') > -1) {
    let locales = getI18nBlockWithLocale({
      code: source,
      locale
    })
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
      if (a.indexOf("'") > -1) { // 用于翻译字符
        return "'" + locales[b] + "'"
      } else { // 用于翻译变量，如 $t(text)
        return b
      }
    })
  }
  return source
}
