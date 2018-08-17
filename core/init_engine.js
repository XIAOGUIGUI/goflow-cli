'use strict'

const path = require('path')
// 版本锁定
const override = require('../engine/override')

module.exports = async () => {
  await override(
    path.resolve(__dirname, '../node_modules'),
    path.resolve(__dirname, '../node_modules/legoflow-engine/node_modules_override'),
    false
  )
}
