const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

module.exports = (config) => {
  const { projectPath, webpack: webpackConfig } = config
  const { assetsSubDirectory } = config[process.env.NODE_ENV]
  const { dll } = webpackConfig

  let result = {
    dllReferencePlugins: [],
    includeAssetHtmlPlugins: []
  }
  const manifestFiles = glob.sync(path.resolve(projectPath, './dll/*.manifest.json'))
  const dllAssets = glob.sync(path.resolve(projectPath, './dll/*.dll.js')).map(v => `${assetsSubDirectory}/js/${path.basename(v)}`)
  console.log(manifestFiles)
  if (dll) {
    manifestFiles.forEach(item => {
      result.dllReferencePlugins.push(new webpack.DllReferencePlugin({
        context: projectPath,
        manifest: require(item)
      }))
    })
    result.includeAssetHtmlPlugins.push(new HtmlWebpackIncludeAssetsPlugin({
      files: [ 'index.html' ],
      append: false,
      assets: dllAssets
    }))
  }
  return result
}
