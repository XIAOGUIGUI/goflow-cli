'use strict'

module.exports = {
  cacheDirectory: true,
  presets: [
    [
      require.resolve('babel-preset-env'), {
        modules: false,
        targets: {
          browsers: ['android >= 4', '> 1%', 'last 2 versions', 'not ie <= 8']
        }
      }
    ],
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-stage-2')
  ],
  plugins: [require.resolve('babel-plugin-transform-runtime'), require.resolve('babel-plugin-dynamic-import-webpack')],
  env: {
    test: {
      presets: [
        require.resolve('babel-preset-env'),
        require.resolve('babel-preset-stage-2')
      ],
      plugins: [require.resolve('babel-plugin-istanbul')]
    }
  }
}
