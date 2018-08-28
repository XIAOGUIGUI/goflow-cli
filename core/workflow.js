'use strict'

const chalk = require('chalk')

const buildConfig = require('./build_config')

module.exports = async (flag = 'build', env = '', cmd = {}) => {
  const workflowConfig = await buildConfig(flag, env)
  if (!workflowConfig) {
    return void 0
  }
  if (env !== '') {
    workflowConfig[flag].env = env
  }
  console.log(`ℹ ｢wdm｣: launching ${chalk.bold(flag)}${env !== '' ? `, env: ${chalk.bold.underline(env)}` : ''}`
  )
  const Messager = require('../engine/messager')

  const { sender } = Messager
  // 重写messager方法
  Messager.sender = ({ type, msg }) => {
    if (type === 'success') {
      let msg = ''
      if (flag === 'build') {
        msg = 'build finish'
      } else if (workflowConfig.mode === 'webpack') {
        msg = `http://${msg.ip}:${msg.bsPort}`
      } else {
        msg = `started dev service`
      }
      print.success(msg)
    } else {
      sender({ type, msg })
    }
    if (type === 'stop') {
      process.exit(1)
    }
  }
  require(`../engine/${flag}`)(workflowConfig)
}
