const path = require('path')
const _ = require('lodash')
const spritesmith = require('gulp.spritesmith')
let isRem = false
let templateOption = null
var templateFunction = function (data) {
  if (data.sprites.length === 0) {
    return ''
  }
  let spritesName = data.sprites[0].image.replace(/(.*\/)*([^.]+).*/ig, '$2')
  let spritesheetName = ''
  let spritesheetClass = ''
  let shareSpace = '  '
  let startSpace = ''
  let closeSpace = ''
  let templateConfig = _.defaultsDeep(templateOption, {
    spritesheetNameMap: {},
    spriteNameMap: {},
    spritesheetClassMap: {}
  })
  if (templateConfig && templateConfig.spritesheetClassMap[spritesName]) {
    spritesheetClass = templateConfig.spritesheetClassMap[spritesName]
    shareSpace = '    '
    startSpace = '  '
    closeSpace = '  '
  }
  if (templateConfig && templateConfig.spritesheetNameMap[spritesName]) {
    let name = templateConfig.spritesheetNameMap[spritesName]
    spritesheetName = name.replace(/,\s*./g, ',\n.')
  } else {
    spritesheetName = `.icon-${spritesName}`
  }
  let shared = '{start}N {\n\tdisplay: inline-block;\n\n\tbackground-image: url("I");\n\tbackground-repeat: no-repeat;\n\tbackground-size: Wpx, Hpx;\n{close}}\n'
    .replace('{start}', startSpace)
    .replace('{close}', closeSpace)
    .replace('N', spritesheetName)
    .replace('I', data.sprites[0].image)
    .replace('W', data.spritesheet.width)
    .replace('H', data.spritesheet.height)
    .replace(/\t/g, shareSpace)
  let spriteNameMap = templateConfig && templateConfig.spriteNameMap[spritesName] ? templateConfig.spriteNameMap[spritesName] : {}
  let perSprite = data.sprites.map(function (sprite) {
    let name = sprite.name
    if (spriteNameMap[name]) {
      name = spriteNameMap[name].replace(/,\s*./g, ',\n.')
    } else {
      name = `.icon-${name}`
    }
    let x
    let y
    if (isRem && sprite.offset_x !== 0) {
      x = (sprite.offset_x / (sprite.width - data.spritesheet.width) * 100) + '%'
    } else if (sprite.offset_x !== 0) {
      x = sprite.offset_x + 'px'
    } else {
      x = sprite.offset_x
    }
    if (isRem && sprite.offset_y !== 0) {
      y = (sprite.offset_y / (sprite.height - data.spritesheet.height) * 100) + '%'
    } else if (sprite.offset_y !== 0) {
      y = sprite.offset_y + 'px'
    } else {
      y = sprite.offset_y
    }
    return '{start}N {\n\twidth: Wpx;\n\theight: Hpx;\n\n\tbackground-position: X Y;\n{close}}'
      .replace('{start}', startSpace)
      .replace('{close}', closeSpace)
      .replace('N', name)
      .replace('W', sprite.width + 1)
      .replace('H', sprite.height + 1)
      .replace('X', x)
      .replace('Y', y)
      .replace(/\t/g, shareSpace)
  }).join('\n\n')
  if (spritesheetClass !== '') {
    return spritesheetClass + ' {\n' + shared + '\n' + perSprite + '\n}\n'
  } else {
    return shared + '\n' + perSprite + '\n'
  }
}
module.exports = (gulp, common, options, callback) => {
  const { projectPath, spritesmith: spritesmithConfign, px2rem, mode } = common.config
  const { algorithm, padding } = spritesmithConfign
  isRem = px2rem.enable
  templateOption = options.templateConfig
  const spritesDestPath = path.resolve(projectPath, './src/img/')
  let imgPath = `../img/${options.name}.png`
  if (mode === 'webpack') {
    imgPath = `../../img/${options.name}.png`
  }
  gulp.src(options.srcPath)
    .pipe(spritesmith({
      imgName: `${options.name}.png`,
      imgPath,
      cssName: `../sass/sprites/_${options.name}.scss`,
      algorithm,
      padding,
      cssTemplate: templateFunction
    }))
    .pipe(gulp.dest(spritesDestPath))
    .on('end', () => {
      callback && callback()
    })
}
