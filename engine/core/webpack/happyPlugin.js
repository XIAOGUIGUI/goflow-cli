
const os = require('os')
const HappyPack = require('happypack')
const size = process.env.NODE_ENV !== 'dev' ? os.cpus().length : (os.cpus().length /4)
const happyThreadPool = HappyPack.ThreadPool({ size: size })
const babelLoader = {
  loader: require.resolve('babel-loader'),
  options: { cacheDirectory: true}
}
// 创建happypack插件
function createHappyPlugin (id, loaders) {
  return new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: happyThreadPool,
    verbose: false
  })
}
let reusult = [
  createHappyPlugin('happy-babel-js', [babelLoader]),
  createHappyPlugin('happy-babel-vue', [babelLoader])
]
exports.createHappyPlugins = function (cssLoaders) {
  for (const extension in cssLoaders) {
    reusult.push(createHappyPlugin(`happy-${extension}`, cssLoaders[extension]))
  }
  reusult.push(new HappyPack({
    id: 'happy-vue',
    threadPool: happyThreadPool,
    loaders: [{
      path: require.resolve('vue-loader'),
      query: {
        loaders: {
          scss: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
        }
      }
    }],
    verbose: false,
  }))
  return reusult
}