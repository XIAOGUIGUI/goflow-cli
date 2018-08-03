const path = require('path')

const del = require('del')
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')({
  rename: {}
})
const Messager = require('../../messager.js')
const messager = new Messager()

// 创建 common 对象
var common = {}
common.plugins = plugins
common.messager = messager
module.exports = async (config) => {
  common.config = config
  const { projectPath, buildDistPath } = config
  try {
    del.sync([buildDistPath], { force: true })
    messager.success()
  } catch (err) {
    console.error('[BUILD ERROR]', err)
    messager.error(err)
  }
}