'use strict'

let config = {}
config = require('../config/index')

exports.set = (name, value) => {
  config.set(name, value)
  print.success(`set ${name}: ${value}`)
}

exports.get = name => {
  return config.get(name) || ''
}

exports.clean = () => {
  config.clean()
  print.success('clean finish')
}
