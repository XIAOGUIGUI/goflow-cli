module.exports = {
  mode: 'gulp',
  px2rem: {
    // px转rem配置
    enable: false, // 是否开启
    root_value: 75,
    unit_precision: 5,
    prop_white_list: [],
    selector_black_list: [],
    replace: true,
    media_query: false
  },
  spritesmith: {
    algorithm: 'binary-tree',
    padding: 4
  },
  lang: {
    defulteLang: 'en'
  },
  browserslist: ['> 1%', 'last 2 versions', 'not ie <= 8', 'Android >= 4'],
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
