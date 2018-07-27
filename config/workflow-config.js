const path = require('path')

module.exports = {
  remUnit: 75,
  lang: {
    defulteLang: 'en'
  },
  build: {
    env: 'production',
    assetsSubDirectory: 'static',
    assetsPublicPath: './'
  },
  dev: {
    env: 'development',
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    cssSourceMap: false
  }
}