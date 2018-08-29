
const path = require('path')
const os = require('os')
const HappyPack = require('happypack')

const babelOptions = require('../common/babel_options')
const size = process.env.NODE_ENV !== 'dev' ? os.cpus().length : (os.cpus().length /4)
const happyThreadPool = HappyPack.ThreadPool({ size: size })

// 创建happypack插件
function createHappyPlugin (id, loaders) {
  return new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: happyThreadPool,
    verbose: false
  })
}
exports.createHappyPlugins = function (cssLoaders, config) {
  const { appNodeModules } = config
  let babelLoader = {
    loader: path.resolve(appNodeModules, 'babel-loader'),
    options: babelOptions
  }
  let reusult = [
    createHappyPlugin('happy-babel-js', [babelLoader]),
    createHappyPlugin('happy-babel-vue', [babelLoader])
  ]
  for (const extension in cssLoaders) {
    reusult.push(createHappyPlugin(`happy-${extension}`, cssLoaders[extension]))
  }
  reusult.push(new HappyPack({
    id: 'happy-vue',
    threadPool: happyThreadPool,
    loaders: [{
      path: require.resolve('vue-loader'),
      query: {
        loaders: cssLoaders
      }
    }],
    verbose: false,
  }))
  return reusult
}