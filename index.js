#!/usr/bin/env node

'use strict';
const program = require('commander')
const chalk = require('chalk')
global.print = require('./core/print')
const checkUpdate = require('./core/check_update')

const { version } = require('./package.json')

program.version( version )
  .option('-v, --version', 'output the version number')
  .description(`${ chalk.blue.bold( 'GoFlow CLI' ) }`)
program.on( 'command:*', function ( ) {
  console.log(chalk.yellow( `! Command not found. Please try to use ${ chalk.yellow.bold( '-h' ) }` ))
  process.exit(1)
})
program.command('init')
  .description('init new project')
  .action(require('./core/new_project'))
program.parse( process.argv )