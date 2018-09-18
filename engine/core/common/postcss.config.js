module.exports = {
  plugins: [
    require('autoprefixer')({ browsers: process.env.browserslist })
  ]
}
