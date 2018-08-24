'use strict';

const path = require('path');
let projectPath
function resolve (dir) {
  return path.join(projectPath, dir)
}
module.exports = ( config ) => {
    projectPath = config.projectPath
    return {
      'vue$': 'vue/dist/vue.esm.js',
      '@local/vue$': resolve('node_modules/vue/dist/vue.esm.js'),
      '@local': resolve('node_modules'),
      '@': resolve('src'),
      '@business': resolve('src/business'),
      '@components': resolve('src/components'),
      '@lang': resolve('src/lang'),
      '@pages': resolve('src/pages'),
      '@utils': resolve('src/utils'),  
    }
};
