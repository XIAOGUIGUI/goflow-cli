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
  if (flag === 'build' && cmd.analyzer) {
    workflowConfig[flag].analyzer = true
  }
  console.log(`ℹ ｢wdm｣: launching ${chalk.bold(`workflow.${flag}`)}${env !== '' ? `, env: ${chalk.bold.underline(env)}` : ''}`)
  const Messager = require('../engine/messager')

  const { sender } = Messager
  // 重写messager方法
  Messager.sender = ({ type, msg }) => {
    if (type === 'success') {
      let printMsg = msg || ''
      if (flag === 'build') {
        printMsg = 'build finish'
      } else if (flag === 'dev' && workflowConfig.mode === 'webpack') {
        printMsg = `http://${msg.ip}:${msg.bsPort}`
      } else if (flag === 'dev') {
        printMsg = `started dev service`
      }
      print.success(printMsg)
    } else {
      sender({ type, msg })
    }
    if (type === 'stop') {
      process.exit(1)
    }
  }
  require(`../engine/${flag}`)(workflowConfig)
}
