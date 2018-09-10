'use strict'

module.exports = {
  processors: ['stylelint-processor-html'],
  plugins: ['stylelint-order'],
  rules: {
    'color-hex-case': ['lower', {
      message: '颜色值必须为小写字母。'
    }],
    'color-hex-length': ['short', {
      message: '十六进制颜色使用缩写。例如，#ffffff写成#fff。'
    }],
    'color-no-invalid-hex': [true, {
      message: '颜色值不能为无效值。'
    }],
    'shorthand-property-no-redundant-values': [true, {
      message: '禁止在简写属性中使用冗余值。'
    }],
    'function-url-quotes': ['always', {
      message: 'url地址必须使用双引号。'
    }],
    'number-leading-zero': ['never', {
      message: '分数低于1的数字禁止前导零。例如，0.05写成.05。'
    }],
    'number-no-trailing-zeros': [true, {
      message: '禁止在数量尾随零。'
    }],
    'length-zero-no-unit': [true, {
      message: '值为零不允许带单位。'
    }],
    'declaration-bang-space-after': ['never', {
      message: '感叹号之后禁止有空白。'
    }],
    'declaration-bang-space-before': ['always', {
      message: '感叹号之前必须有一个空格。'
    }],
    'declaration-colon-space-before': ['never', {
      message: '冒号之前禁止有空白。'
    }],
    'declaration-colon-space-after': ['always', {
      message: '冒号之后必须有一个空格。'
    }],
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-block-semicolon-newline-after': ['always', {
      message: '在分号之后要求换行。'
    }],
    'block-no-empty': true,
    'block-closing-brace-empty-line-before': ['never', {
      message: '禁止在闭括号之前有空行。'
    }],
    'block-closing-brace-newline-before': ['always', {
      message: '在闭括号之前必须换行。'
    }],
    'block-closing-brace-newline-after': ['always', {
      message: '在闭括号之后必须换行。'
    }],
    'block-opening-brace-space-before': ['always', {
      message: '在开括号之前要求有一个空格。'
    }],
    'block-opening-brace-newline-after': ['always', {
      message: '在开括号之后必须换行。'
    }],
    'selector-no-vendor-prefix': true,
    'selector-type-case': 'lower',
    'selector-list-comma-newline-after': ['always', {
      message: '选择器列表的逗号之后必须换行。'
    }],
    'rule-empty-line-before': ['always', {
      ignore: ['after-comment', 'first-nested'],
      message: '规则之前必须空一行。'
    }],
    'comment-empty-line-before': ['always', {
      message: '注释之前必须有一行空行。'
    }],
    'comment-no-empty': [true, {
      message: '禁止空注释。'
    }],
    'comment-whitespace-inside': ['always', {
      message: "注释'/*'后和'*/'前必须有空白。"
    }],
    'indentation': [2, {
      message: '缩进使用两个空格。'
    }],
    'max-nesting-depth': [3, {
      message: '选择器不要超过4层'
    }],
    'no-descending-specificity': [true, {
      message: '禁止低优先级的选择器出现在高优先级的选择器之后。'
    }],
    'no-duplicate-selectors': [true, {
      message: '在一个样式表中禁止出现重复的选择器。'
    }],
    'no-empty-source': [true, {
      message: '禁止空样式文件。'
    }],
    'no-eol-whitespace': [true, {
      message: '禁止行尾空白。'
    }],
    'no-extra-semicolons': [true, {
      message: '禁止多余的分号。'
    }],
    'no-invalid-double-slash-comments': [true, {
      message: '不允许双斜杠注释。'
    }],
    'no-missing-end-of-source-newline': [true, {
      message: '文件末尾必须空一行。'
    }],
    'no-unknown-animations': [true, {
      message: '禁止动画名称与 @keyframes 声明不符。'
    }],
    'order/order': [['custom-properties'], {
      unspecified: 'top',
      message: '禁止动画名称与 @keyframes 声明不符。'
    }],
    'order/properties-order': [
      {
        emptyLineBefore: 'always',
        properties: [
          'display',
          'visibility',
          'float',
          'clear',
          'overflow',
          'overflow-x',
          'overflow-y',
          'clip',
          'zoom'
        ]
      },
      {
        emptyLineBefore: 'always',
        properties: [
          'table-layout',
          'empty-cells',
          'caption-side',
          'border-spacing',
          'border-collapse',
          'flex',
          'flex-direction',
          'flex-wrap',
          'flex-flow',
          'justify-content',
          'align-items',
          'align-content',
          'list-style',
          'list-style-position',
          'list-style-type',
          'list-style-image'
        ]
      },
      {
        emptyLineBefore: 'always',
        properties: ['position', 'top', 'right', 'bottom', 'left', 'z-index']
      },
      {
        emptyLineBefore: 'always',
        properties: [
          'margin',
          'margin-top',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'box-sizing',
          'border',
          'border-width',
          'border-style',
          'border-color',
          'border-top',
          'border-top-width',
          'border-top-style',
          'border-top-color',
          'border-right',
          'border-right-width',
          'border-right-style',
          'border-right-color',
          'border-bottom',
          'border-bottom-width',
          'border-bottom-style',
          'border-bottom-color',
          'border-left',
          'border-left-width',
          'border-left-style',
          'border-left-color',
          'border-radius',
          'border-top-left-radius',
          'border-top-right-radius',
          'border-bottom-right-radius',
          'border-bottom-left-radius',
          'border-image',
          'border-image-source',
          'border-image-slice',
          'border-image-width',
          'border-image-outset',
          'border-image-repeat',
          'padding',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left',
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height'
        ]
      },
      {
        emptyLineBefore: 'always',
        properties: [
          'font',
          'font-family',
          'font-size',
          'font-weight',
          'font-style',
          'font-variant',
          'font-size-adjust',
          'font-stretch',
          'font-effect',
          'font-emphasize',
          'font-emphasize-position',
          'font-emphasize-style',
          'font-smooth',
          'line-height',
          'text-align',
          'text-align-last',
          'vertical-align',
          'white-space',
          'text-decoration',
          'text-emphasis',
          'text-emphasis-color',
          'text-emphasis-style',
          'text-emphasis-position',
          'text-indent',
          'text-justify',
          'letter-spacing',
          'word-spacing',
          'text-outline',
          'text-transform',
          'text-wrap',
          'text-overflow',
          'text-overflow-ellipsis',
          'text-overflow-mode',
          'word-wrap',
          'word-break'
        ]
      },
      {
        emptyLineBefore: 'always',
        properties: [
          'color',
          'background',
          'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader',
          'background-color',
          'background-image',
          'background-repeat',
          'background-attachment',
          'background-position',
          'background-position-x',
          'background-position-y',
          'background-clip',
          'background-origin',
          'background-size'
        ]
      },
      {
        emptyLineBefore: 'always',
        properties: [
          'outline',
          'outline-width',
          'outline-style',
          'outline-color',
          'outline-offset',
          'opacity',
          'box-shadow',
          'text-shadow'
        ]
      },
      {
        emptyLineBefore: 'always',
        properties: [
          'transition',
          'transition-delay',
          'transition-timing-function',
          'transition-duration',
          'transition-property',
          'transform',
          'transform-origin',
          'animation',
          'animation-name',
          'animation-duration',
          'animation-play-state',
          'animation-timing-function',
          'animation-delay',
          'animation-iteration-count',
          'animation-direction'
        ]
      },
      {
        emptyLineBefore: 'always',
        properties: [
          'content',
          'quotes',
          'counter-reset',
          'counter-increment',
          'resize',
          'cursor',
          'user-select',
          'nav-index',
          'nav-up',
          'nav-right',
          'nav-down',
          'nav-left',
          'tab-size',
          'hyphens',
          'pointer-events'
        ]
      }
    ]
  }
}
