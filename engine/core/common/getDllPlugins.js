const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
let dllAssetsToMap = (list) => {
  let result = {}
  for (let index = 0; index < list.length; index++) {
    let dllName = list[index].match(/js\/.*?(?=\.)/)[0]
    dllName = dllName.substring(dllName.indexOf('/') + 1)
    result[dllName] = list[index]
  }
  return result
}

let getAssets = (list, dllAssetsMap) => {
  let result = []
  for (let index = 0; index < list.length; index++) {
    result.push(dllAssetsMap[list[index]])
  }
  return result
}
module.exports = (config, htmlFiles) => {
  const { projectPath, webpack: webpackConfig } = config
  const { assetsSubDirectory } = config[process.env.NODE_ENV]
  const { dll, html } = webpackConfig

  let result = {
    dllReferencePlugins: [],
    includeAssetHtmlPlugins: []
  }
  let configHtml = html || {}
  let dllOptions = []
  const manifestFiles = glob.sync(path.resolve(projectPath, './dll/*.manifest.json'))
  const dllAssets = glob.sync(path.resolve(projectPath, './dll/*.dll.js')).map(v => `${assetsSubDirectory}/js/${path.basename(v)}`)
  const dllAssetsMap = dllAssetsToMap(dllAssets)
  if (dll) {
    manifestFiles.forEach(item => {
      result.dllReferencePlugins.push(new webpack.DllReferencePlugin({
        context: projectPath,
        manifest: require(item)
      }))
    })
    htmlFiles.forEach(htmlItem => {
      let dllOption = {
        files: [ htmlItem.filename ],
        append: false
      }
      if (configHtml[htmlItem.filename] && configHtml[htmlItem.filename].dll) {
        dllOption.assets = getAssets(configHtml[htmlItem.filename].dll, dllAssetsMap)
      } else {
        dllOption.assets = dllAssets
      }
      dllOptions.push(dllOption)
    })
    dllOptions.forEach(item => {
      result.includeAssetHtmlPlugins.push(new HtmlWebpackIncludeAssetsPlugin(item))
    })
  }
  return result
}
