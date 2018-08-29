'use strict'

const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')
const localConfig = require('./local_config')

module.exports = async (flag, env) => {
  const root = path.resolve(__dirname, '../')
  const defineConfig = require('../config/workflow-config')
  const projectPath = process.cwd()
  const configPath = path.join(projectPath, '/goflow.js')
  let config = {}
  if (!fs.existsSync(configPath)) {
    print.error('找不到项目配置文件，请检查路径')
    return void 0
  } else {
    let projectConfig = require(configPath)
    defineConfig.dev = _.defaultsDeep(projectConfig.dev, defineConfig.dev)
    if (flag === 'build' && projectConfig[env]) {
      defineConfig.build = _.defaultsDeep(defineConfig.build, defineConfig.dev)
      defineConfig.build = _.defaultsDeep(projectConfig[env], defineConfig.build)
    }
    const { autoOpenChrome, user } = localConfig.get()
    defineConfig.user = user
    defineConfig.dev.autoOpenBrowser = typeof autoOpenChrome !== 'undefined' ? autoOpenChrome : true
    config = _.defaultsDeep(projectConfig, defineConfig)
    config.root = root
    config.projectPath = projectPath
  }
  return config
}
