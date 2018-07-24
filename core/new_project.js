'use strict'
const chalk = require('chalk')
const ora = require('ora')
const prompt = require('inquirer').prompt
const goflowProject = require('../project')

const {
  version: c_version
} = require('../package.json')

module.exports = async function () {
  let projectTypes = {}

  let spinner = void 0

  if (true) {
    spinner = ora('正在获取 GoFlow NPM 模板').start()
  }
  projectTypes = await goflowProject.getProjectType()

  spinner && spinner.stop()

  const types = Object.keys(projectTypes)
  let spaceLenght = 0
  const getToSpaceLenght = () => {
    types.forEach((item) => {
      if (item.length > spaceLenght) {
        spaceLenght = item.length
      }
    })
  }
  getToSpaceLenght()
  spaceLenght = spaceLenght + 2
  const toSpace = str => {
    return str + Array(spaceLenght > str.length ? spaceLenght - str.length + 1 || 0 : 0).join(' ')
  }
  types.forEach((item, index) => {
    let description = `- ${projectTypes[item].description}`
    types[index] = {
      name: `${chalk.bold(toSpace(item))}${ chalk.whiteBright(description)}`,
      value: item
    }
  })
  let questions = [{
      type: 'input',
      name: 'name',
      message: '项目名称',
      default: '',
      validate(input) {
        const done = this.async()
        !input ? done('项目名称不能为空') : done(null, true)
      }
    },
    {
      type: 'list',
      name: 'type',
      message: '项目类型',
      choices: types,
      default: 0
    },
    {
      type: 'input',
      name: 'version',
      message: '版本号',
      default: '0.0.1'
    },
    {
      type: 'input',
      name: 'description',
      message: '项目描述',
      default: ''
    },
    {
      type: 'list',
      name: 'isSourcePath',
      message: '是否作为源路径',
      choices: [{
        name: 'no',
        value: false
      }, {
        name: 'yes',
        value: true
      }],
      default: 0
    }
  ]
  const {
    name,
    type,
    version,
    description,
    isSourcePath
  } = await prompt(questions);

  const options = {
    path: process.cwd(),
    type,
    name,
    version,
    isSourcePath,
    c_version: `cli@${ c_version }`,
    description,
    typeSourcePath: projectTypes[type].path,
    typeTpl: projectTypes[type].type,
    from: 'cli',
  }
  const result = await goflowProject.new(options)

  result && result.newProjectSuccessMessage && console.log(result.newProjectSuccessMessage)

  typeof result !== 'string' ? print.success('新建成功') : print.error(result)
}