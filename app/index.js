const yo = require('yeoman-generator'),
  path = require('path'),
  mkdirp = require('mkdirp');

// TODO: add yo-rc.json
// TODO: add bootstrap's scss integration

module.exports = yo.Base.extend({

  constructor: function () {
    yo.Base.apply(this, arguments);
  },

  initializing: function () {
    this.pkg = require('../package.json');

    this.options = {};

    this.options.default = {
      mixinsPath: '../../../node_modules/scss-mixins-collection/mixins/__mixins.scss'
    };

    this.destinationRoot('./scss');

    this.config = {
      build: {
        custom: {
          typography: false,
          pages: false,
          helpers: false,
          layout: false,
          vars: false,
          mixins: false,
          customMixins: false,
          sprite: false
        },
        base: {
          typography: true,
          pages: true,
          helpers: false,
          layout: false,
          vars: false,
          mixins: true,
          customMixins: false,
          sprite: false
        },
        full: {
          typography: true,
          pages: true,
          helpers: true,
          layout: true,
          vars: true,
          mixins: true,
          customMixins: true,
          sprite: true
        }
      },
      files: {
        util: '',
        core: ''
      }
    };

    this.promptList = {
      buildType: {
        type: 'list',
        name: 'build',
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
        name: 'custom',
        message: 'Choose custom components to load:',
        choices: [
          {
            value: 'typography',
            checked: true,
            name: '- typography'
          },
          {
            value: 'pages',
            name: '- pages',
            checked: true
          },
          {
            value: 'helpers',
            name: '- helpers'
          },
          {
            value: 'layout',
            name: '- layout (extended)'
          },
          {
            value: 'vars',
            name: '- variables (extended)'
          },
          {
            value: 'customMixins',
            name: '- custom-mixins'
          },
          {
            value: 'sprite',
            name: '- sprite'
          }
        ]
      }
    };

    // Wrappers for fs functions
    this.fsCopy = function (from, to) {
      this.fs.copy(
        path.join(this.templatePath(), from),
        path.join(this.destinationPath(), to)
      );
    }.bind(this);
    this.fsWrite = function (to, string) {
      this.fs.write(path.join(this.destinationPath(), to), string);
    }.bind(this);
    this.fsRead = function (from) {
      return this.fs.read(path.join(this.templatePath(), from));
    }.bind(this);
  },

  prompting: {
    build: function () {
      var done = this.async();

      this.prompt(this.promptList.buildType,
        function (response) {
          this.options.build = this.config.build[response.build];
          if (response.build === 'custom') this.options.custom = true;
          done();
        }.bind(this)
      );
    },
    custom: function () {
      var done = this.async();

      if (this.options.custom) {
        this.prompt(this.promptList.components,
          function (response) {
            response.custom.forEach(function (opt) {
              this.options.build[opt] = true;
            }.bind(this));
            done();
          }.bind(this)
        );
      } else {
        done();
      }
    },
    mixinsLibrary: function () {
      var done = this.async();
      this.prompt(
        {
          type: 'confirm',
          name: 'mixinsLib',
          message: 'Are you using scss-mixins-collection library?'
        },
        function (response) {
          if (!response.mixinsLib) {
            done();
            return true;
          }
          this.options.build.mixins = true;
          this.prompt(
            {
              type: 'input',
              name: 'mixinsPath',
              message: 'Relative path to the _mixins.scss file from this folder ( default: ' + this.options.default.mixinsPath.substr(6) + ' ):'
            },
            function (response) {
              this.options.mixinsPath = response.mixinsPath ? '../../' + response.mixinsPath : false || this.options.default.mixinsPath;
              console.log(this.options.mixinsPath);
              done();
            }.bind(this)
          );

        }.bind(this)
      );
    }
  },

  writing: {
    vars: function () {
      var done = this.async();
      var from = this.options.build.vars ? 'extended/variables' : 'base/variables';

      mkdirp.sync(path.join(this.destinationPath(), 'util/'));

      this.fsCopy(from, path.join(this.destinationPath(), 'util/variables'));

      done();
    },
    mixins: function () {
      var done = this.async();

      this.config.files.util += '\n' + this.fsRead('import/util/variables');

      if (this.options.build.mixins) {
        this.config.files.util += '\n' + '// Mixins library\n@import "' + this.options.mixinsPath + '";' + '\n';
      }

      done();
    },
    customMixins: function () {
      var done = this.async();
      if (this.options.build.customMixins) {

        this.config.files.util += '\n' + this.fsRead('import/util/custom-mixins');

        this.fsCopy('extended/custom-mixins', 'util/custom-mixins');

      }
      done();
    },
    sprite: function () {
      var done = this.async();

      if (this.options.build.sprite) {

        this.config.files.util += '\n' + this.fsRead('import/util/spriting');
        this.fsCopy('extended', '_spriting.scss', 'util/_spriting.scss');

      }

      done();
    },
    util: function () {
      var done = this.async();
      this.fsWrite('util/__util.scss', this.config.files.util);
      this.config.files.core += '\n' + this.fsRead('import/core/util');
      done();
    },
    typography: function () {
      var done = this.async();
      if (this.options.build.typography) {
        this.config.files.util += '\n' + this.fsRead('import/core/typography');
        this.fsCopy('base/typography', 'typography');
      }
      done();
    },
    pages: function () {
      var done = this.async();
      if (this.options.build.pages) {
        this.config.files.core += '\n' + this.fsRead('import/core/pages');
        mkdirp.sync(path.join(this.destinationPath(), 'pages'));
        this.fsWrite('pages/__pages.scss', '// Sets import for pages scss files');
      }
      done();
    },
    layout: function () {
      var done = this.async(),
        from = this.options.build.layout ? 'extended/layout' : 'base/layout';

      this.config.files.core += '\n' + this.fsRead('import/core/layout');
      this.fsCopy(from, 'layout');

      done();
    },
    helpers: function () {
      var done = this.async();
      if (this.options.build.helpers) {
        this.config.files.core += '\n' + this.fsRead('import/core/helpers');
        this.fsCopy('extended/helpers', 'helpers');
      }
      done();
    },
    core: function () {
      var done = this.async();
      this.fsWrite('core.scss', this.config.files.core);
      done();
    },
    config: function () {
      this.fsCopy('config.rb', 'config.rb');
    }
  },

  end: function () {
    console.log('*** Happy styling indeed! ***');
  }

});
