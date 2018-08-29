'use strict'

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
let server
let runner = (config, resolve) => {
  const webpackConfig = require('./webpack.dev.conf')(config)
  // default port where dev server listens for incoming traffic
  const port = config.dev.port
  // automatically open browser, if not set will be false
  const autoOpenBrowser = config.dev.autoOpenBrowser
  // Define HTTP proxies to your custom API backend
  // https://github.com/chimurai/http-proxy-middleware
  const proxyTable = config.dev.proxyTable

  const app = express()
  const compiler = webpack(webpackConfig)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
    logLevel: 'error',
    historyApiFallback: false,
    compress: false,
    noInfo: false,
    lazy: false,
    stats: {
      assets: false,
      builtAt: false,
      cached: false,
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      timings: false,
      hash: false,
      entrypoints: false,
      version: false,
      warnings: false,
      errorDetails: false
    },
    watchOptions: {
      aggregateTimeout: 100,
      poll: 1000
    },
    disableHostCheck: true
  })
  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false
  })
  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      hotMiddleware.publish({ action: 'reload' })
      // cb()
    })
  })

  // enable hot-reload and state-preserving
  // compilation error display
  app.use(hotMiddleware)

  // proxy api requests
  Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context]
    if (typeof options === 'string') {
      options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
  })

  // handle fallback for HTML5 history API
  app.use(require('connect-history-api-fallback')())

  // serve webpack bundle output
  app.use(devMiddleware)

  // serve pure static assets
  const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
  app.use(staticPath, express.static('./static'))
  const uri = `http://${config.dev.ip}:${config.dev.port}`
  devMiddleware.waitUntilValid(() => {
    if (autoOpenBrowser) {
      opn(uri)
    }
    resolve()
  })

  server = app.listen(port)
}
module.exports = {
  runner: (config) => new Promise(resolve => {
    runner(config, resolve)
  }),
  close: () => {
    server.close()
  }
}
