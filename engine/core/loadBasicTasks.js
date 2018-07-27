const fs = require('fs')

// 载入基础任务
var basicTaskPath = './basicTasks'

module.exports = function(gulp, config) {
  fs.readdirSync(basicTaskPath)
    .filter(function(file) {
      return file.match(/js$/) // 排除非 JS 文件，如 Vim 临时文件
    }).sort().forEach(function(file) {
      require('./' + basicTaskPath + '/' + file)(gulp, config)
    })
}