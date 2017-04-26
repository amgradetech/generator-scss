var Separator = require('../utils/promptSeparator');

module.exports = function(_this) {
  return {
    folders: {
      type: 'checkbox',
      name: 'folders',
      message: 'Which folders you would like to use?',
      choices: [
        new Separator(),
        {
          value: 'bootstrap',
          checked: _this.build.bootstrap,
          name: '- bootstrap - import bootstrap4 source'
        },
        {
          value: 'components',
          checked: _this.build.components,
          name: '- components'
        },
        {
          value: 'helpers',
          checked: _this.build.helpers,
          name: '- helpers'
        },
        {
          value: 'layout',
          checked: _this.build.layout,
          name: '- layout'
        },
        {
          value: 'scenes',
          checked: _this.build.scenes,
          name: '- scenes'
        },
      ]
    },
  };
};
