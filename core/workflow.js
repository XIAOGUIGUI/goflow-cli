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
  console.log( `ℹ ｢wdm｣: launching ${ chalk.bold( flag ) }${ env !== '' ? `, env: ${ chalk.bold.underline(env) }` : '' }` );
  const Messager = require('../engine/messager')

  const { sender } = Messager
  // 重写messager方法
  Messager.sender = ({ type, msg }) => {
    if ( type === 'success' ) {
      print.success( flag === 'dev' ? (workflowConfig.mode === 'webpack' ? `http://${ msg.ip }:${ msg.bsPort }` : 'started dev service') : 'build finish' );
    } else {
      sender({ type, msg })
    }
    if (type === 'stop') {
      process.exit(1)
    }
  }
  require(`../engine/${ flag }`)(workflowConfig)
}
