const buildConfig = require('./build_config')

module.exports = async function () {
  const workflowConfig = await buildConfig()
  require('../engine/lint')(workflowConfig)
}
