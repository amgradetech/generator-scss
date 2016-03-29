const yo = require('yeoman-generator'),
  path = require('path'),
  mkdirp = require('mkdirp');

module.exports = yo.Base.extend({
  constructor: function () {
    yo.Base.apply(this, arguments);
  },

  initializing: function () {
    this.pkg = require('../package.json');
    this.options = {};
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
    }
  },

  prompting: {
    build: function () {
      var done = this.async();
      this.prompt(
        {
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
        this.prompt(
          {
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
          },
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
              message: 'Relative path to the _mixins.scss file ( default: ../../../node_modules/scss-mixins-collection/mixins/_mixins.scss ):'
            },
            function (response) {
              var done = this.async();
              this.options.mixinsPath = response.mixinsPath || '../../../node_modules/scss-mixins-collection/mixins/_mixins.scss';
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
      var from = this.options.build.vars ? 'extended' : 'base';
      mkdirp(path.join(this.destinationPath(), 'util/'));
      this.fs.copy(
        path.join(this.templatePath(), from, 'variables'),
        path.join(this.destinationPath(), 'util/variables')
      );
      done();
    },
    mixins: function () {
      var done = this.async();
      this.config.files.util += '\n' + this.fs.read(path.join(this.templatePath(), 'import/util/variables'));
      if (this.options.build.mixins) {
        this.config.files.util += '\n' + '// Mixins library\n@import "' + this.options.mixinsPath + '";' + '\n';
      }
      done();
    },
    customMixins: function () {
      var done = this.async();
      if (this.options.build.customMixins) {
        this.config.files.util += '\n' + this.fs.read(path.join(this.templatePath(), 'import/util/custom-mixins'));

        this.fs.copy(
          path.join(this.templatePath(), 'extended', 'custom-mixins'),
          path.join(this.destinationPath(), 'util/custom-mixins')
        );
      }
      done();
    },
    sprite: function () {
      var done = this.async();

      if (this.options.build.sprite) {
        this.config.files.util += '\n' + this.fs.read(path.join(this.templatePath(), 'import/util/spriting'));

        this.fs.copy(
          path.join(this.templatePath(), 'extended', '_spriting.scss'),
          path.join(this.destinationPath(), 'util/_spriting.scss')
        );
      }
      done();
    },
    util: function () {
      var done = this.async();
      this.fs.write(path.join(this.destinationPath(), 'util/__util.scss'), this.config.files.util);
      this.config.files.core += '\n' + this.fs.read(path.join(this.templatePath(),'import/core/util'));
      done();
    },
    typography: function () {
      var done = this.async();
      if (this.options.build.typography) {
        this.config.files.util += '\n' + this.fs.read(path.join(this.templatePath(),'import/core/typography'));
        this.fs.copy(
          path.join(this.templatePath(), 'base', 'typography'),
          path.join(this.destinationPath(), 'typography')
        );
      }
      done();
    },
    pages: function () {
      var done = this.async();
      if (this.options.build.pages) {
        this.config.files.core += '\n' + this.fs.read(path.join(this.templatePath(),'import/core/pages'));
        mkdirp(path.join(this.destinationPath(), 'pages'));
        this.fs.write(path.join(this.destinationPath(), 'pages/__pages.scss'), '// Sets import for pages scss files');
      }
      done();
    },
    layout: function () {
      var done = this.async(),
        from = this.options.build.layout ? 'extended' : 'base';

      this.config.files.core += '\n' + this.fs.read(path.join(this.templatePath(),'import/core/layout'));
      this.fs.copy(
        path.join(this.templatePath(), from, 'layout'),
        path.join(this.destinationPath(), 'layout')
      );

      done();
    },
    helpers: function () {
      var done = this.async();
      if (this.options.build.helpers) {
        this.config.files.core += '\n' + this.fs.read(path.join(this.templatePath(),'import/core/helpers'));
        this.fs.copy(
          path.join(this.templatePath(), 'extended/helpers'),
          path.join(this.destinationPath(), 'helpers')
        );
      }
      done();
    },
    core: function() {
      var done = this.async();
      this.fs.write(path.join(this.destinationPath(), 'core.scss'), this.config.files.core);
      done();
    },
    config: function(){
      this.fs.copy(
        path.join(this.templatePath(), 'config.rb'),
        path.join(this.destinationPath(), 'config.rb')
      );
    }
  },

  end: function () {
    console.log('bye');
  }

});
