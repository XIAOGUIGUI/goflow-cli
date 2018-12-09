#!/usr/bin/env node

'use strict'
const program = require('commander')
const chalk = require('chalk')
global.print = require('./core/print')
const localConfig = require('./core/local_config')
const checkUpdate = require('./core/check_update')
const workflow = require('./core/workflow')
const lint = require('./core/lint')
const { version } = require('./package.json')

program
  .version(version)
  .option('-v, --version', 'output the version number')
  .description(`${chalk.blue.bold('GoFlow CLI')}`)
program
  .command('set <name> <value>')
  .description('set config <name> <value>')
  .action(localConfig.set)
program
  .command('get <name>')
  .description('get config <name>')
  .action(env => {
    let value = localConfig.get(env)
    print.success(`get ${env}: ${value}`)
  })
program
  .command('init')
  .description('init new project')
  .action(require('./core/new_project'))
program
  .command('serve')
  .description(chalk.yellow('run dev workflow in project'))
  .action((cmd) => {
    checkUpdate().then(() => workflow('dev', '', cmd))
  })
program
  .command('build [env]')
  .description(chalk.yellow('run build workflow in project'))
  .action((env, cmd) => {
    if (!env) {
      env = 'prod'
    }
    if (env !== 'prod' && env !== 'testing') {
      console.log(chalk.red(`! The env parameter only supports prod or testing.`))
    } else {
      checkUpdate().then(() => workflow('build', env, cmd))
    }
  })
program
  .command('build:dll')
  .description(chalk.yellow('run build dll'))
  .action((cmd) => {
    checkUpdate().then(() => workflow('dll', void 0, cmd))
  })
program
  .command('lint')
  .description(chalk.yellow('run lint workflow in project'))
  .action((cmd) => {
    lint(cmd)
  })
program.on('command:*', function () {
  console.log(
    chalk.yellow(
      `! Command not found. Please try to use ${chalk.yellow.bold('-h')}`
    )
  )
  process.exit(1)
})
program.parse(process.argv)
