const path = require('path')
var templateFunction = function (data) {
  if (data.sprites.length === 0) {
    return ''
  }
  let spritesName = data.sprites[0].image.replace(/(.*\/)*([^.]+).*/ig,"$2")
  let spritesheetName = ''
  let spritesheetClass = ''
  if (templateConfig && templateConfig.spritesheetNameMap[spritesName]) {
    spritesheetName = templateConfig.spritesheetNameMap[spritesName]
  } else {
    spritesheetName = `.icon-${spritesName}`
  }
  let shared = 'N {\n\tdisplay: inline-block;\n\tbackground-image: url(I);\n\tbackground-repeat: no-repeat;\n\tbackground-size: Wpx, Hpx;\n}\n'  
    .replace('N', spritesheetName)
    .replace('I', data.sprites[0].image)
    .replace('W', data.spritesheet.width)
    .replace('H', data.spritesheet.height);
  let spriteNameMap = templateConfig && templateConfig.spriteNameMap[spritesName] ? templateConfig.spriteNameMap[spritesName] : {}
  let perSprite = data.sprites.map(function (sprite) {
    let name = sprite.name
    if (spriteNameMap[name]) {
      name = spriteNameMap[name]
    } else {
      name = `.icon-${name}`
    }
    let x = sprite.offset_x
    if (x !== 0) {
      x = x /(sprite.width - data.spritesheet.width) * 100
    }
    let y = sprite.offset_y
    if (y !== 0) {
      y = y /(sprite.height - data.spritesheet.height) * 100
    }
    return 'N {\n\twidth: Wpx;\n\theight: Hpx;\n\tbackground-position: X% Y%;\n}'
        .replace('N', name)
        .replace('W', sprite.width + 1)
        .replace('H', sprite.height + 1)
        .replace('X', x)
        .replace('Y', y)
  }).join('\n\n');
  if (templateConfig && templateConfig.spritesheetClassMap[spritesName]) {
    spritesheetClass = templateConfig.spritesheetClassMap[spritesName]
    shared.replace('\t', '\t\t')
    perSprite.replace('\t', '\t\t')
    return spritesheetClass + '{\n\t' + shared + '\n' + perSprite + '\n}';
  } else {
    return shared + '\n' + perSprite;
  }
}
module.exports = (gulp, common, options) => {}