var Separator = require('../utils/promptSeparator');

module.exports = function(_this) {
  return {
    buildType: {
      type: 'list',
      name: 'buildType',
      message: 'Choose scaffolds type:',
      choices: [
        {
          value: 'base',
          name: '- Base'
        },
        {
          value: 'full',
          name: '- Full'
        },
        {
          value: 'custom',
          name: '- Custom'
        }
      ]
    },
    components: {
      type: 'checkbox',
      name: 'components',
      message: 'Which components you would like to use?',
      choices: [
        new Separator(),
        {
          value: 'typography',
          checked: _this.build.typography,
          name: '- typography'
        },
        {
          value: 'pages',
          checked: _this.build.pages,
          name: '- pages'
        },
        {
          value: 'helpers',
          checked: _this.build.helpers,
          name: '- helpers'
        },
        {
          value: 'layout',
          checked: _this.build.layout,
          name: '- layout files'
        },
        {
          value: 'variables',
          checked: _this.build.variables,
          name: '- variables files'
        },
        {
          value: 'customMixins',
          checked: _this.build.customMixins,
          name: '- custom-mixins'
        },
        {
          value: 'sprite',
          checked: _this.build.sprite,
          name: '- Compass spriting'
        },
        {
          value: 'normalize',
          checked: _this.build.normalize,
          name: '- bootstrap\'s normalize.css'
        },
        {
          value: 'bootstrap',
          checked: _this.build.bootstrap,
          name: '- bootstrap@^4.0 scss files'
        },
        {
          value: 'mixins',
          checked: _this.build.mixins,
          name: '- scss-mixins-collection (library plug in)'
        },
        {
          value: 'config',
          checked: _this.build.config,
          name: '- config.rb (Compass config file)'
        }
      ]
    },
    extendedFiles: {
      type: 'confirm',
      name: 'extendedFiles',
      message: 'Do you need premade content for layout and variables files?'
    },
    scssMixinsPath: {
      type: 'input',
      name: 'scssMixinsPath',
      message: 'Set relative path to the _mixins.scss from this folder:',
      default: _this.default.paths.scssMixinsPath
    },
    bootstrapScssPath: {
      type: 'input',
      name: 'bootstrapScssPath',
      message: 'Set relative path to the bootstrap/scss folder from this folder:',
      default: _this.default.paths.bootstrapScssPath
    },
    bootstrapType: {
      type: 'list',
      name: 'bootstrapType',
      message: 'Which bootstrap build do you need?',
      choices: [
        {
          value: 'full',
          name: '- Full'
        },
        {
          value: 'fullFlex',
          name: '- Full (flex support)'
        },
        {
          value: 'grid',
          name: '- Grid only'
        },
        {
          value: 'gridFlex',
          name: '- Grid only (flex support)'
        },
        {
          value: 'reboot',
          name: '- Reboot only'
        }
      ]
    },
    config: [
      {
        type: 'input',
        name: 'cssDir',
        message: 'css_dir',
        default: function () {
          return _this.default.config.cssDir
        }
      },
      {
        type: 'input',
        name: 'sassDir',
        message: 'sass_dir',
        default: function () {
          return _this.default.config.sassDir
        }
      },
      {
        type: 'input',
        name: 'imagesDir',
        message: 'images_dir',
        default: function () {
          return _this.default.config.imagesDir
        }
      },
      {
        type: 'input',
        name: 'fontsDir',
        message: 'fonts_dir',
        default: function () {
          return _this.default.config.fontsDir
        }
      },
      {
        type: 'list',
        name: 'outputStyle',
        message: 'output_style',
        choices: [
          ':expanded',
          ':nested',
          ':compact',
          ':compressed'
        ],
        default: function () {
          return _this.default.config.outputStyle
        }
      },
      {
        type: 'confirm',
        name: 'lineComments',
        message: 'Enable line_comments?:',
        default: function () {
          return _this.default.config.lineComments
        }
      },
      {
        type: 'confirm',
        name: 'relativeAssets',
        message: 'Enable relative_assets?',
        default: function () {
          return _this.default.config.relativeAssets
        }
      }
    ]
  };
};
