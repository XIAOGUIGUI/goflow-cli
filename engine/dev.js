const network = require('network')
const findFreePort = require('find-free-port-sync')
const gulp = require('./core/dev/gulp')
const gulpWebpack = require('./core/dev/gulp-webpack')
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
  process.env.NODE_ENV = 'dev'
  config.dev.ip = localIP
  const port = parseInt(config.dev.port)
  findFreePort( port, port + 10, localIP, (freePort ) => {
    config.dev.port = freePort
  })
  let common = require('./core/common/common')(config, 'dev')
  const { projectPath } = common.config
  if ( config.mode !== 'webpack' ) {
    await gulp(common)
  } else {
    await gulpWebpack(common)
  }
  // 入口文件增加或删除提示重启加入webpack构建中
  common.plugins.watch(`${ projectPath }/app-config.js`, () => {
    common.messager.notice( '项目配置修改后, 重启工作流后生效' )
  })
  common.messager.success({
    ip: config.dev.ip,
    bsPort: config.dev.port
  })
}
module.exports = start