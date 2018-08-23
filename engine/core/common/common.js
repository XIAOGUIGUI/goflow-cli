'use strict';

const path = require('path')
const _ = require('lodash')
const plugins = require('gulp-load-plugins')({
	rename: {}
})
const browserSync = require('browser-sync')
const reload = browserSync.reload
const Messager = require('../../messager.js')
const messager = new Messager()
// 创建 common 对象
var common = {}
common.plugins = plugins
common.reload = reload
common.messager = messager

const resolve = ( _config_, flag) => {
	let config = _.cloneDeep( _config_ )
	const { projectPath, root} = config
	const flagConfig = config[flag]
	config.appNodeModules = path.resolve(root, './node_modules')
	config.localNodeModules = path.resolve(projectPath, './node_modules')
	config.buildDistPath = path.resolve(projectPath, './dist')
	config.buildTmpPath = path.resolve(projectPath, './dist/tmp')
	config.publicAssetsPath = flagConfig.assetsPublicPath + flagConfig.assetsSubDirectory
	config.assetsPath = path.resolve(config.buildDistPath, flagConfig.assetsSubDirectory)
	// 用户自定义开发参数
	let userArgs = flagConfig.userArgs || {}
	let devUserArgs = config.dev.devUserArgs || {}
	if (flag === 'build' && flagConfig[flagConfig.env]) {
		userArgs = _.defaultsDeep(userArgs, devUserArgs)
	}
	common.userArgs = userArgs
	common.config = config
	return common
}

module.exports = ( _config_, flag ) => {
	try {
		return resolve( _config_, flag)
	} catch ( e ) {
		console.error( '[COMMON]: ', e )
		messager.stop( '配置文件解析错误' )
	}
};