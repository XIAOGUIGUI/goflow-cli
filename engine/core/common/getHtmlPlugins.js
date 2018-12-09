const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const loadMinified = require('../webpack/load-minified')
module.exports = (config) => {
  const DEV = process.env.NODE_ENV === 'dev'
  const { projectPath, multiple, version, serviceWorker } = config
  let cacheId = serviceWorker.cacheId
  let options
  if (DEV) {
    options = {
      inject: true,
      serviceWorkerLoader: `<script>${fs.readFileSync(path.join(__dirname,
        '../webpack/service-worker-dev.js'), 'utf-8')}</script>`
    }
  } else {
    options = {
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency',
      serviceWorkerLoader: `<script>${loadMinified(path.join(__dirname,
        '../webpack/service-worker-prod.js'), {
        version,
        cacheId
      })}</script>`
    }
  }

  if (multiple.enable === true) {
    let plugins = []
    for (let index = 0; index < multiple.pages.length; index++) {
      options.filename = `${multiple.pages[index]}.html`
      options.template = `${projectPath}/dist/${multiple.pages[index]}.html`
      options.chunks = ['manifest', 'vendor', 'commons', multiple.pages[index]]
      plugins.push(new HtmlWebpackPlugin(options))
    }
    return plugins
  } else {
    options.filename = 'index.html'
    // options.chunks = ['app', 'commons', 'async-commons']
    options.template = `${projectPath}/dist/index.html`
    return [new HtmlWebpackPlugin(options)]
  }
}
