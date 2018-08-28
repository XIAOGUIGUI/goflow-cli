const buildConfig = require('./build_config')

module.exports = async function () {
  const workflowConfig = await buildConfig()
  if (workflowConfig.mode === 'webpack') {
    console.log('webpack')
  } else {

  }
  require('../engine/lint')(workflowConfig)
}
