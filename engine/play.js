const fs = require('fs-extra')
const gulp = require('gulp')
const base64 = require('gulp-into-base64')

const AD_CODE_1 = '<script>function getScript(e,i){var n=document.createElement("script");n.type="text/javascript",n.async=!0,i&&(n.onload=i),n.src=e,document.head.appendChild(n)}function parseMessage(e){var i=e.data,n=i.indexOf(DOLLAR_PREFIX+RECEIVE_MSG_PREFIX);if(-1!==n){var t=i.slice(n+2);return getMessageParams(t)}return{}}function getMessageParams(e){var i,n=[],t=e.split("/"),a=t.length;if(-1===e.indexOf(RECEIVE_MSG_PREFIX)){if(a>=2&&a%2===0)for(i=0;a>i;i+=2)n[t[i]]=t.length<i+1?null:decodeURIComponent(t[i+1])}else{var o=e.split(RECEIVE_MSG_PREFIX);void 0!==o[1]&&(n=JSON&&JSON.parse(o[1]))}return n}function getDapi(e){var i=parseMessage(e);if(!i||i.name===GET_DAPI_URL_MSG_NAME){var n=i.data;getScript(n,onDapiReceived)}}function invokeDapiListeners(){for(var e in dapiEventsPool)dapiEventsPool.hasOwnProperty(e)&&dapi.addEventListener(e,dapiEventsPool[e])}function onDapiReceived(){dapi=window.dapi,window.removeEventListener("message",getDapi),invokeDapiListeners()}function init(){window.dapi.isDemoDapi&&(window.parent.postMessage(DOLLAR_PREFIX+SEND_MSG_PREFIX+JSON.stringify({state:"getDapiUrl"}),"*"),window.addEventListener("message",getDapi,!1))}var DOLLAR_PREFIX="$$",RECEIVE_MSG_PREFIX="DAPI_SERVICE:",SEND_MSG_PREFIX="DAPI_AD:",GET_DAPI_URL_MSG_NAME="connection.getDapiUrl",dapiEventsPool={},dapi=window.dapi||{isReady:function(){return!1},addEventListener:function(e,i){dapiEventsPool[e]=i},removeEventListener:function(e){delete dapiEventsPool[e]},isDemoDapi:!0};init();</script>'
const AD_CODE_2 = `<script>
  window.onload = function(){
    (dapi.isReady()) ?onReadyCallback():dapi.addEventListener("ready", onReadyCallback);
  };
  function onReadyCallback(){
    dapi.removeEventListener("ready", onReadyCallback);
    let isAudioEnabled = !!dapi.getAudioVolume();
    if(dapi.isViewable()){
      adVisibleCallback({isViewable: true});
    }
    dapi.addEventListener("viewableChange", adVisibleCallback);
    dapi.addEventListener("adResized", adResizeCallback);
    dapi.addEventListener("audioVolumeChange", audioVolumeChangeCallback);
  }
  function adVisibleCallback(event){
    if (event.isViewable){
      screenSize = dapi.getScreenSize();
    }
  }
  function adResizeCallback(event){
    screenSize = event;
  }
  function audioVolumeChangeCallback(volume){
  }
</script>`
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
      let replaceAdCode1 = key === 'ad' ? AD_CODE_1 : ''
      let replaceAdCode2 = key === 'ad' ? AD_CODE_2 : ''
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
          rule: /url\(\.\/static.*?\.(jpg|gif|png)\)/g
        })))
        .pipe(common.plugins.if(allBase64, base64({
          fileType: 'html',
          maxImageSize: 1000 * 1024,
          rule: /\.\/static\/([^"]*)\.(jpg|gif|png)/g
        })))
        .pipe(common.plugins.if(replaceCode, common.plugins.replace(play.openKey, openCode)))
        .pipe(common.plugins.replace('<ad-code-1></ad-code-1>', replaceAdCode1))
        .pipe(common.plugins.replace('<ad-code-2></ad-code-2>', replaceAdCode2))
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
