const path = require('path')
const network = require('network')
const findFreePort = require('find-free-port-sync')
const gulp = require('./core/dev/gulp')

let localIP = void 0
let getLocalIPCounter = 0

network.get_private_ip((err, ip) => {
  if (err) throw err
  localIP = ip
})
const start = async (config) => {
  if (!localIP && getLocalIPCounter < 10 ) {
    ++getLocalIPCounter
    setTimeout(() => start(config), 300 )
    return void 0;
  }else if (getLocalIPCounter >= 10) {
    localIP = '127.0.0.1'
  }
  config.dev.ip = localIP
  const port = parseInt(config.dev.port)
  config.dev.port = findFreePort({
    start: port,
    end: port + 10
  })
  config.publicAssetsPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
  config.assetsPath = path.resolve(config.buildDistPath, config.dev.assetsSubDirectory)
  if ( config.mode !== 'webpack' ) {
    await gulp(config)
  }
  
}
module.exports = start