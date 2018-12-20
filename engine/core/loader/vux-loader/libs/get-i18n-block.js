const yamlReader = require('js-yaml')
// @todo try parse
function get (code) {
  let content = code
  const results = content.match(/<i18n[^>]*>([\s\S]*?)<\/i18n>/)
  try {
    const local = yamlReader.safeLoad(results[1])
    return local
  } catch (e) {
    return {}
  }
}

function getWithLocale ({ code = '', locale = '' }) {
  const rs = get(code)
  let _rs = {}
  for (let i in rs) {
    _rs[i] = typeof rs[i][locale] === 'undefined' ? i : rs[i][locale]
  }
  return _rs
}

exports.get = get
exports.getWithLocale = getWithLocale
