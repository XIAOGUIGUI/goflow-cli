const fs = require('fs-extra')
const gulp = require('gulp')
const base64 = require('gulp-html-css-js-base64')

module.exports = async function (config) {
  let common = require('./core/common/common')(config, 'build')
  const { buildDistPath, buildPlayPath, play } = common.config

  if (!play) {
    common.messager.stop('play config undefined')
    return void 0
  }
  fs.removeSync(buildPlayPath)
  if (play.platform) {
    for (const key in play.platform) {
      let { allBase64, openCode } = play.platform[key]
      let replaceCode = openCode && openCode.length !== 0
      gulp.src([`${buildDistPath}/index.html`])
        .pipe(base64({
          fileType: 'html',
          maxImageSize: 1000 * 1024,
          // eslint-disable-next-line no-useless-escape
          rule: /url\([^\)]+\.ttf\)/g
        }))
        .pipe(base64({
          fileType: 'html',
          maxImageSize: 1000 * 1024,
          rule: /\.\/static\/([^"]*)\.mp3/g
        }))
        .pipe(common.plugins.if(allBase64, base64({
          fileType: 'html',
          maxImageSize: 1000 * 1024,
          rule: /\.\/static\/([^"]*)\.(jpg|gif|png)/g
        })))
        .pipe(common.plugins.if(replaceCode, common.plugins.replace(play.openKey, openCode)))
        .pipe(gulp.dest(`${buildPlayPath}/${key}`))
        .on('end', () => {
          common.messager.log(`${key}平台资源base64成功`)
        })
      if (allBase64 === false) {
        gulp.src(`${buildDistPath}/static/img/*`)
          .pipe(gulp.dest(`${buildPlayPath}/${key}/static/img/`))
          .on('end', () => {
            common.messager.log(`${key}平台图片资源移动成功`)
          })
      }
    }
  }
}
