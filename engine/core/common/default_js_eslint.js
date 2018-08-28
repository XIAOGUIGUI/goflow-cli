'use strict'

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: 'standard',
  plugins: ['html'],
  globals: {
    $: true
  },
  // add your custom rules here
  rules: {
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV !== 'dev' ? 2 : 0
  }
}
