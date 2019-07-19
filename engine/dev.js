const os = require('os')
const findFreePort = require('find-port-free-sync')
const gulp = require('./core/dev/gulp')
const gulpWebpack = require('./core/dev/gulp-webpack')
let localIP
const getIp = () => {
  let ipStr
  const infaces = os.networkInterfaces()
  let bool = false
  for (var i in infaces) {
    infaces[i].some((x) => {
      if (x.family === 'IPv4' && x.internal === false && x.address.indexOf('192.') === 0) {
        ipStr = x.address
        bool = true
        return true
      }
    })
    if (bool) {
      break
    }
  }
  return ipStr
}
const start = async config => {
  process.env.NODE_ENV = 'dev'
  localIP = getIp() || '127.0.0.1'
  config.dev.ip = localIP
  const port = parseInt(config.dev.port)
  let freePort = findFreePort({
    start: port,
    end: port + 9,
    num: 10,
    ip: localIP
  })
  config.dev.port = freePort[freePort.length - 1]
  let common = require('./core/common/common')(config, 'dev')
  const { projectPath, browserslist } = common.config
  process.env.browserslist = browserslist
  try {
    if (config.mode !== 'webpack') {
      await gulp(common)
    } else {
      await gulpWebpack(common)
    }
    // 入口文件增加或删除提示重启加入webpack构建中
    common.plugins.watch(`${projectPath}/app-config.js`, () => {
      common.messager.notice('项目配置修改后, 重启工作流后生效')
    })
    common.messager.success({
      ip: config.dev.ip,
      bsPort: config.dev.port
    })
  } catch (error) {
    common.messager.error(error)
  }
}
module.exports = start
