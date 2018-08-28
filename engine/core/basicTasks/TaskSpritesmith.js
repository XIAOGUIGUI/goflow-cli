const path = require('path')
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
  let templateConfig = templateOption || {
    spritesheetNameMap: {},
    spriteNameMap: {},
    spritesheetClassMap: {}
  }
  if (templateConfig && templateConfig.spritesheetNameMap[spritesName]) {
    spritesheetName = templateConfig.spritesheetNameMap[spritesName]
  } else {
    spritesheetName = `.icon-${spritesName}`
  }
  let shared = 'N {\n  display: inline-block;\n  background-image: url(I);\n  background-repeat: no-repeat;\n  background-size: Wpx, Hpx;\n}\n'
    .replace('N', spritesheetName)
    .replace('I', data.sprites[0].image)
    .replace('W', data.spritesheet.width)
    .replace('H', data.spritesheet.height)
  let spriteNameMap = templateConfig && templateConfig.spriteNameMap[spritesName] ? templateConfig.spriteNameMap[spritesName] : {}
  let perSprite = data.sprites.map(function (sprite) {
    let name = sprite.name
    if (spriteNameMap[name]) {
      name = spriteNameMap[name]
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
    return 'N {\n  width: Wpx;\n  height: Hpx;\n  background-position: X Y;\n}'
      .replace('N', name)
      .replace('W', sprite.width + 1)
      .replace('H', sprite.height + 1)
      .replace('X', x)
      .replace('Y', y)
  }).join('\n\n')
  if (templateConfig && templateConfig.spritesheetClassMap[spritesName]) {
    spritesheetClass = templateConfig.spritesheetClassMap[spritesName]
    shared.replace('  ', '    ')
    perSprite.replace('  ', '    ')
    return spritesheetClass + '{\n  ' + shared + '\n' + perSprite + '\n}\n'
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
