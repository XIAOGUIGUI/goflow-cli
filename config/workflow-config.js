module.exports = {
  mode: 'gulp',
  webpack: {},
  webp: true,
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
  multiple: {
    enable: false
  },
  vux: false,
  spritesmith: {
    algorithm: 'binary-tree',
    padding: 4
  },
  lang: null,
  browserslist: ['> 1%', 'last 2 versions', 'not ie <= 8', 'Android >= 4'],
  build: {
    env: 'production',
    analyzer: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    relativeHtmlPath: './',
    uglify: {
      drop_console: true
    }
  },
  testing: {
    env: 'testing',
    uglify: {
      drop_console: true
    }
  },
  dev: {
    env: 'development',
    port: 8080,
    startPath: 'index.html',
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    relativeHtmlPath: '/',
    proxyTable: {},
    cssSourceMap: false
  }
}
