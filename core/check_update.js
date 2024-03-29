'use strict'

const axios = require('axios')
const chalk = require('chalk')
const boxen = require('boxen')
const compareVersion = require('compare-versions')

const { version: nowVersion } = require('../package.json')

module.exports = async () => {
  try {
    const { version } = (await axios('https://raw.githubusercontent.com/XIAOGUIGUI/goflow-cli/master/package.json',
      { timeout: 5000 }
    )).data
    if (compareVersion(version, nowVersion) > 0) {
      console.log(
        boxen(
          chalk.yellow(
            `Update available ${nowVersion} → ${chalk.bold.yellow.underline(
              version
            )}\nRun ${chalk.bold.green(
              'npm i -g goflow-cli'
            )} to update\nView Changelog ${chalk.bold.yellow.underline(
              'http://t.cn/Rgdthet'
            )}`
          ),
          {
            padding: { left: 1, right: 1 },
            borderStyle: 'double',
            borderColor: 'yellow'
          }
        )
      )
    }
  } catch (e) {
    if (e.toString().indexOf('timeout') > 0) {
      console.error('[CHECK UPDATE ERROR]', 'timeout of 5000ms exceeded')
    } else {
      console.error('[CHECK UPDATE ERROR]', e.response ? e.response.data : '检查更新失败')
    }
  }
}
