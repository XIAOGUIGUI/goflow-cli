'use strict'

const os = require('os')
const path = require('path')
const fs = require('fs')

const userRoot = os.homedir()

const globalConfigPath = path.resolve(userRoot, './.goflow_config')

const defaultConfig = {
  // 开发者
  user: '',
  // 自动打开 chrome
  autoOpenChrome: true,
  // 启动端口号
  port: 3000,
  // 常用编辑器
  editor: 'VSCode',
  // 自定义项目类型本地绝对路径
  customProjectPath: '',
  // 加载 npm legoflow 模板
  loadNPMLegoFlowTemplate: false
}

let config = defaultConfig

const writeConfig = () => {
  fs.writeFileSync(globalConfigPath, JSON.stringify(config), 'utf8')
}

const readConfig = () => {
  config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'))

  return config
}

if (!fs.existsSync(globalConfigPath)) {
  writeConfig()
} else {
  readConfig()
}

exports.set = (name, value) => {
  value == 'true' && (value = true)
  value == 'false' && (value = false)

  config[name] = value

  writeConfig()
}

exports.get = name => {
  if (!name) {
    return readConfig()
  } else {
    return config[name]
  }
}

exports.clean = () => {
  config = defaultConfig
  writeConfig()
}
