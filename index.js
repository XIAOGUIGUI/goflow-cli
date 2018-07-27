#!/usr/bin/env node

'use strict';
const program = require('commander')
const chalk = require('chalk')
global.print = require('./core/print')
const localConfig = require('./core/local_config')
const checkUpdate = require('./core/check_update')
const workflow = require('./core/workflow')
const { version } = require('./package.json')

program.version( version )
  .option('-v, --version', 'output the version number')
  .description(`${ chalk.blue.bold( 'GoFlow CLI' ) }`)
  .action((env) => {
    print.success(`get`)
  })
program.command( 'set <name> <value>' )
  .description( 'set config <name> <value>' )
  .action( localConfig.set)
program.command( 'get <name>' )
  .description( 'get config <name>' )
  .action((env) => {
    let value = localConfig.get(env)
    print.success(`get ${env}: ${value}`)
  })
program.command('new')
  .description('generate a new app')
  .action(require('./core/new_project'))
program.command('serve')
  .description( chalk.yellow( 'run dev workflow in project' ) )
  .action((env, cmd) => {
    // checkUpdate().then(() => workflow( 'dev', '', cmd ))
    workflow('dev', '', cmd)
  })
program.command( 'build [env]' )
  .description( chalk.yellow( 'run build workflow in project' ) )
  .action(( env, cmd ) => {
    if (!env) {
      env = 'prod'
    }
    workflow('build', env, cmd)
  })
program.on( 'command:*', function ( ) {
  console.log(chalk.yellow( `! Command not found. Please try to use ${ chalk.yellow.bold( '-h' ) }` ))
  process.exit(1)
})
program.parse( process.argv )