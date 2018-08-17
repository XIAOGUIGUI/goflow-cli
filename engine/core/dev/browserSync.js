const browserSync = require('browser-sync')
let config = void 0;
let server = resolve => {
  const { buildDistPath, localNodeModules, appNodeModules } = config
  const { port, ip, startPath, autoOpenBrowser } = config.dev
  const options = {
    https: false,
    ui: false,
    notify: false,
    ghostMode: false,
    port,
    timestamps: true,
    server: {
      baseDir: [buildDistPath, localNodeModules, appNodeModules]
    },
    open: 'external',
    scriptPath(path, port) {
      bsPort = port
      bsHotFileUrl = `http://${ip}:${port}${path.toString()}`
      return ''
    },
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn(snippet) {
          let consoleString = '<script src="https://s1.yy.com/ued_web_static/lib/lego/log/dev.js" async="async"><\/script>'
          snippet = `<script src="${bsHotFileUrl}"><\/script>${consoleString}<\/body>`
          return snippet
        }
      }
    }
  }
  if (startPath) {
    options.server.index = startPath
  }
  if (!autoOpenBrowser) {
    options.open = false
  }
  browserSync(options, (err) => {
    if (err) {
      console.error('browserOpen error: ' + err)
      return void 0
    }
    resolve()
  })
}
module.exports = (_config) => new Promise(resolve => {
  config = _config
  server(resolve)
})
