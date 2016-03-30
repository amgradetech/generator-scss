const yo = require('yeoman-generator'),
  path = require('path'),
  mkdirp = require('mkdirp'),
  _forEach = require('lodash').forEach,
  del = require('del'),

  _replaceAll = function(str, from, to) {
    return str.replace(new RegExp(from, 'g'), to);
  };

// TODO: add yo-rc.json

module.exports = yo.Base.extend({

  constructor: function () {
    yo.Base.apply(this, arguments);
  },

  initializing: function () {

    var _this = this;
    var done = this.async();

    this.prompt({
      type: 'confirm',
      name: 'removeFolder',
      message: 'This action will remove everything withing ./scss folder and build it from scratch. Proceed?'
    }, function(response){
      if (!response.removeFolder) return false;
      del.sync('./scss');
      done();
    });

    this.pkg = require('../package.json');

    this.options = {};

    this.options.default = {
      // Relative from appFolder
      nodeModulesPath: '../node_modules/',
      mixinsScssPath: 'scss-mixins-collection/mixins/__mixins.scss',
      bootstrapScssPath: 'bootstrap/scss',
      config: {
        cssDir: './css',
        sassDir: './scss',
        fontsDir: './fonts',
        imagesDir: './images',
        lineComments: false,
        outputStyle: ':nested',
        relativeAssets: false
      }
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
          bootstrap: false,
          sprite: false
        },
        base: {
          bootstrap: false,
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
          bootstrap: true,
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
      },
      promptList: {
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
          message: 'Which components you would like to use?',
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
              name: '- extended layout files'
            },
            {
              value: 'vars',
              name: '- extended variables files'
            },
            {
              value: 'customMixins',
              name: '- custom-mixins'
            },
            {
              value: 'sprite',
              name: '- Compass spriting'
            },
            {
              value: 'mixins',
              name: '- scss-mixins-collection (library plug in)'
            }
          ]
        },
        bootstrapType: {
          type: 'list',
          name: 'bootstrapBuild',
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
        }

      },
      bootstrapBuild: {
        full: function () {
          this.fsWrite('bootstrap.scss', this.fsTpl('bootstrap/bootstrap', { bootstrapScssPath: _this.options.bootstrapScssPath }));
        }.bind(_this),
        fullFlex: function () {
          var content = this.fsRead('bootstrap/bootstrap-flex') + '\n';
          content += this.fsTpl('bootstrap/bootstrap', { bootstrapScssPath: _this.options.bootstrapScssPath });
          this.fsWrite('bootstrap.scss', content);
        }.bind(_this),
        grid: function () {
          this.fsWrite('bootstrap.scss', this.fsTpl('bootstrap/bootstrap-grid', { bootstrapScssPath: _this.options.bootstrapScssPath }));
        }.bind(_this),
        gridFlex: function () {
          var content = this.fsRead('bootstrap/bootstrap-flex') + '\n';
          content += this.fsTpl('bootstrap/bootstrap-grid', { bootstrapScssPath: _this.options.bootstrapScssPath });
          this.fsWrite('bootstrap.scss', content);
        }.bind(_this),
        reboot: function () {
          this.fsWrite('bootstrap.scss', this.fsTpl('bootstrap/bootstrap-reboot', { bootstrapScssPath: _this.options.bootstrapScssPath }));
        }.bind(_this)
      }
    };

    // Wrappers for fs functions
    this.fsCopy = function (from, to) {
      this.fs.copy(
        path.join(this.templatePath(), from),
        path.join(this.destinationPath(), to)
      );
    }.bind(this);
    // Custom templating
    this.fsTpl = function(from, templateVars) {
      var content = this.fsRead(from);
      _forEach(templateVars, function(value, key){
        content = _replaceAll(content, '{% '+key+' %}', value);
      });
      return content;
    }.bind(this);
    this.fsWrite = function (to, string) {
      this.fs.write(path.join(this.destinationPath(), to), string);
    }.bind(this);
    this.fsRead = function (from) {
      return this.fs.read(path.join(this.templatePath(), from));
    }.bind(this);
    this.configPrompting = function(){
      this.prompt({type: 'input', name: 'config', message: 'css_dir ( default:'+this.options.default.config.cssDir +' ):' }, function(response){if(response.config)});
    }.bind(this);
  },

  prompting: {
    build: function () {
      var done = this.async();

      this.prompt(this.config.promptList.buildType,
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
        this.prompt(this.config.promptList.components,
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
    nodeModules: function () {
      var done = this.async();
      if (this.options.build.mixins) {
        this.prompt(
          {
            type: 'input',
            name: 'nodeModulesPath',
            message: 'Set relative path to the node_modules/ from this folder ( default: ' + this.options.default.nodeModulesPath + ' ):'
          },
          function (response) {
            this.options.nodeModulesPath = response.nodeModulesPath ? response.nodeModulesPath : false || this.options.default.nodeModulesPath;
            this.options.mixinsScssPath = '../../' + path.join(this.options.nodeModulesPath, this.options.default.mixinsScssPath);
            this.options.bootstrapScssPath = '../' + path.join(this.options.nodeModulesPath, this.options.default.bootstrapScssPath);
            done();
          }.bind(this)
        );
      } else {
        this.options.mixinsScssPath = '../../' + path.join(this.options.default.nodeModulesPath, this.options.default.mixinsScssPath);
        this.options.bootstrapScssPath = '../' + path.join(this.options.default.nodeModulesPath, this.options.default.bootstrapScssPath);
        done();
      }
    },
    bootstrapScss: function () {
      var done = this.async();
      this.prompt(
        {
          type: 'confirm',
          name: 'bootstrap',
          message: 'Do you want to include Bootstrap\'s@^4.0 scss files?'
        },
        function (response) {
          if (response.bootstrap) {
            this.options.build.bootstrap = true;
            this.prompt({
                type: 'input',
                name: 'bootstrapPath',
                message: 'Set relative path to the bootstrap/scss folder from this folder ( default: ' + path.join(this.options.default.nodeModulesPath, this.options.default.bootstrapScssPath) + ' ):'
              },
              function (response) {
                if (response.bootstrapPath) {
                  this.options.bootstrapPath = '../' + response.bootstrapPath;
                }
                this.prompt(this.config.promptList.bootstrapType, function (response) {
                  this.options.bootstrapBuild = response.bootstrapBuild;
                  done();
                }.bind(this));
              }.bind(this));
          } else {
            done();
          }
        }.bind(this)
      );
    },
    configRb: function() {
      var done = this.async();
      this.prompt({
        type: 'confirm',
        name: 'config',
        message: 'Would you like to setup config.rb?'
      }, function(response){
        if (response.config) {
          this.configPrompt();
        } else {
          done();
        }
      }.bind(this));

    }
  },

  writing: {
    vars: function () {
      var done = this.async();
      var from = this.options.build.vars ? 'extended/variables' : 'base/variables';

      mkdirp.sync(path.join(this.destinationPath(), 'util/'));

      this.fsCopy(from, 'util/variables');

      done();
    },
    mixins: function () {
      var done = this.async();

      this.config.files.util += '\n' + this.fsRead('import/util/variables');

      if (this.options.build.mixins) {
        this.config.files.util += '\n' + '// Mixins library\n@import "' + this.options.mixinsScssPath + '";' + '\n';
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
        this.fsCopy('extended/_spriting.scss', 'util/_spriting.scss');

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
      var done = this.async();
      this.fsCopy('config.rb', '../config.rb');
      done();
    },
    bootstrap: function () {
      var done = this.async();
      if (this.options.build.bootstrap) {
        if (!/grid/.test(this.options.bootstrapBuild)) {
          mkdirp.sync(path.join(this.destinationPath(), 'bootstrap'));
          this.fsWrite('bootstrap/_variables-override.scss', '// Set Bootstrap\'s variables overrides here\n');
        }
        this.config.bootstrapBuild[this.options.bootstrapBuild]();
      }

      done();

    }
  },

  end: function () {
    console.log('*** Happy styling indeed! ***');
  }

});
