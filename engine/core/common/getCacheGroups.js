module.exports = (config) => {
  const { webpack: webpackConfig } = config
  let cacheGroups = {
    commons: {
      chunks: 'all',
      name: 'comomns',
      minChunks: 2,
      priority: -10
    },
    async_commons: {
      chunks: 'async',
      name: 'async_commons',
      minChunks: 2,
      priority: 0
    }
  }

  cacheGroups = Object.assign(cacheGroups, webpackConfig.cacheGroups)

  return cacheGroups
}
