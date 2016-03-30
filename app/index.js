const yo = require('yeoman-generator'),
  path = require('path'),
  mkdirp = require('mkdirp'),
  _forEach = require('lodash').forEach,
  del = require('del'),
  Separator = require('./utils/promptSeparator'),

  _replaceAll = function (str, from, to) {
    return str.replace(new RegExp(from, 'g'), to);
  };

var libComponents = [
  'bootstrap',
  'config',
  'customMixins',
  'helpers',
  'layout',
  'mixins',
  'pages',
  'sprite',
  'typography',
  'variables'
];

var Build = function (arr) {
  const toBuildComponents = Array.isArray(arr) ? arr : [];
  libComponents.map(function (el) {
    this[el] = toBuildComponents.indexOf(el) >= 0;
  }.bind(this));
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
    }, function (response) {
      if (!response.removeFolder) return false;
      del.sync('./scss');
      done();
    });

    this.default = {};

    this.default.path = {
      // Relative from appFolder
      destinationPath: './scss',
      scssMixinsPath: '../node_modules/scss-mixins-collection/mixins/__mixins.scss',
      bootstrapScssPath: '../node_modules/bootstrap/scss'
    };

    this.default.config = {
      cssDir: './css',
      sassDir: './scss',
      fontsDir: './fonts',
      imagesDir: './images',
      outputStyle: ':nested',
      lineComments: true,
      relativeAssets: true
    };

    this.build = [];

    this.components = {};

    this.path = {};

    this.prompts = {
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
            name: '- layout files',
            checked: true
          },
          {
            value: 'variables',
            name: '- variables files',
            checked: true
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
            value: 'bootstrap',
            name: '- bootstrap@^4.0 scss files'
          },
          {
            value: 'mixins',
            name: '- scss-mixins-collection (library plug in)'
          },
          {
            value: 'config',
            name: '- config.rb (Compass config file)'
          }
        ]
      },
      scssMixinsPath: {
        type: 'input',
        name: 'scssMixinsPath',
        message: 'Set relative path to the _mixins.scss from this folder ( default: ' + this.default.path.scssMixinsPath + ' ):'
      },
      bootstrapScssPath: {
        type: 'input',
        name: 'bootstrapScssPath',
        message: 'Set relative path to the bootstrap/scss folder from this folder ( default: ' + this.default.path.bootstrapScssPath + ' ):'
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
      },
      config: [
        {
          type: 'input',
          name: 'cssDir',
          message: 'css_dir',
          default: function() {
            return _this.default.config.cssDir
          }
        },
        {
          type: 'input',
          name: 'sassDir',
          message: 'sass_dir',
          default: function() {
            return _this.default.config.sassDir
          }
        },
        {
          type: 'input',
          name: 'imagesDir',
          message: 'images_dir',
          default: function() {
            return _this.default.config.imagesDir
          }
        },
        {
          type: 'input',
          name: 'fontsDir',
          message: 'fonts_dir',
          default: function() {
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
          default: function() {
            return _this.default.config.outputStyle
          }
        },
        {
          type: 'confirm',
          name: 'lineComments',
          message: 'Enable line_comments?:',
          default: function() {
            return _this.default.config.lineComments
          }
        },
        {
          type: 'confirm',
          name: 'relativeAssets',
          message: 'Enable relative_assets?',
          default: function() {
            return _this.default.config.relativeAssets
          }
        }
      ]
    };

    this.writes = {
      bootstrapBuild: {
        full: function () {
          this.fsWrite('bootstrap.scss', this.fsTpl('bootstrap/bootstrap', {bootstrapScssPath: _this.options.bootstrapScssPath}));
        }.bind(_this),
        fullFlex: function () {
          var content = this.fsRead('bootstrap/bootstrap-flex') + '\n';
          content += this.fsTpl('bootstrap/bootstrap', {bootstrapScssPath: _this.options.bootstrapScssPath});
          this.fsWrite('bootstrap.scss', content);
        }.bind(_this),
        grid: function () {
          this.fsWrite('bootstrap.scss', this.fsTpl('bootstrap/bootstrap-grid', {bootstrapScssPath: _this.options.bootstrapScssPath}));
        }.bind(_this),
        gridFlex: function () {
          var content = this.fsRead('bootstrap/bootstrap-flex') + '\n';
          content += this.fsTpl('bootstrap/bootstrap-grid', {bootstrapScssPath: _this.options.bootstrapScssPath});
          this.fsWrite('bootstrap.scss', content);
        }.bind(_this),
        reboot: function () {
          this.fsWrite('bootstrap.scss', this.fsTpl('bootstrap/bootstrap-reboot', {bootstrapScssPath: _this.options.bootstrapScssPath}));
        }.bind(_this)
      }
    };

    this.destinationRoot(this.default.path.destinationPath);

    // Wrappers for fs functions
    this.fsCopy = function (from, to) {
      this.fs.copy(
        path.join(this.templatePath(), from),
        path.join(this.destinationPath(), to)
      );
    }.bind(this);
    // Custom templating
    this.fsTpl = function (from, templateVars) {
      var content = this.fsRead(from);
      _forEach(templateVars, function (value, key) {
        content = _replaceAll(content, '{% ' + key + ' %}', value);
      });
      return content;
    }.bind(this);
    this.fsWrite = function (to, string) {
      this.fs.write(path.join(this.destinationPath(), to), string);
    }.bind(this);
    this.fsRead = function (from) {
      return this.fs.read(path.join(this.templatePath(), from));
    }.bind(this);
  },

  prompting: {
    buildType: function () {
      var done = this.async();
      this.prompt(this.prompts.buildType,
        function (response) {
          if (response.buildType === 'custom') {
            this.prompt(this.prompts.components,
              function (response) {
                response.components.forEach(function (component) {
                  this.build.push(component);
                }.bind(this));
                done();
              }.bind(this)
            );
          } else if (response.buildType === 'base') {
            this.build = [
              'typography',
              'layout',
              'variables',
              'mixins'
            ];
            done();
          } else {
            this.build = libComponents;
            done();
          }
        }.bind(this)
      );
    },
    paths: function () {
      var done = this.async();
      var prompts = [];
      if (this.build.indexOf('mixins') >= 0) {
        prompts.push(this.prompts.scssMixinsPath);
      }
      if (this.build.indexOf('bootstrap') >= 0) {
        prompts.push(this.prompts.bootstrapScssPath);
        prompts.push(this.prompts.bootstrapType);
      }
      this.prompt(prompts, function (response) {
        if (this.build.indexOf('mixins')) {
          this.path.scssMixinsPath = response.scssMixinsPath || this.default.path.scssMixinsPath;
        }
        if (this.build.indexOf('bootstrap') >= 0) {
          this.bootstrapScssPath = response.bootstrapScssPath || this.default.path.bootstrapScssPath;
          this.components.bootstrap = {
            bootstrapType: response.bootstrapType || null
          }
        }
        done();
        }.bind(this)
      );
    },
    configRb: function () {
      var done = this.async();
      if (this.build.indexOf('config')) {
        this.prompt(this.prompts.config, function(response){
          this.components.config = {
            cssDir: response.cssDir,
            sassDir: response.sassDir,
            imagesDir: response.imagesDir,
            fontsDir: response.fontsDir,
            outputStyle: response.outputStyle,
            lineComments: response.lineComments,
            relativeAssets: response.relativeAssets
          };
          done();
        }.bind(this));
      } else {
        done();
      }
    },
    setBuild: function () {
      this.conf = {
        components: this.components,
        build: new Build(this.build),
        path: this.path
      };
      this.config.set(this.conf);
      console.log(this.config);
      console.log(this.conf);
    }
  },

  //writing: {
  //  vars: function () {
  //    var done = this.async(),
  //      from;
  //
  //    if (this.build.variables)
  //      mkdirp.sync(path.join(this.destinationPath(), 'util/'));
  //
  //    this.fsCopy(from, 'util/variables');
  //
  //    done();
  //  },
  //  mixins: function () {
  //    var done = this.async();
  //    if (this.build.mixins) {
  //      // Load scss-mixins-collection
  //    }
  //    done();
  //  },
  //  customMixins: function () {
  //    var done = this.async();
  //    if (this.build.customMixins) {
  //      this.files.util += '\n' + this.fsRead('import/util/custom-mixins');
  //      this.fsCopy('extended/custom-mixins', 'util/custom-mixins');
  //    }
  //    done();
  //  },
  //  sprite: function () {
  //    var done = this.async();
  //    if (this.build.sprite) {
  //      this.files.util += '\n' + this.fsRead('import/util/spriting');
  //      this.fsCopy('extended/_spriting.scss', 'util/_spriting.scss');
  //    }
  //    done();
  //  },
  //
  //  typography: function () {
  //    var done = this.async();
  //    if (this.build.typography) {
  //      this.fsCopy('base/typography', 'typography');
  //    }
  //    done();
  //  },
  //  pages: function () {
  //    var done = this.async();
  //    if (this.build.pages) {
  //      mkdirp.sync(path.join(this.destinationPath(), 'pages'));
  //      this.fsWrite('pages/__pages.scss', '// Sets import for pages scss files');
  //    }
  //    done();
  //  },
  //  layout: function () {
  //    var done = this.async(),
  //      from;
  //
  //    if (this.build.layout) {
  //      from = this.build.layout ? 'extended/layout' : 'base/layout';
  //      this.fsCopy(from, 'layout');
  //    }
  //    done();
  //  },
  //  helpers: function () {
  //    var done = this.async();
  //    if (this.build.helpers) {
  //      this.fsCopy('extended/helpers', 'helpers');
  //    }
  //    done();
  //  },
  //  util: function () {
  //    var done = this.async();
  //    this.fsWrite('util/__util.scss', 'util');
  //    done();
  //  },
  //  core: function () {
  //    var done = this.async();
  //    this.fsWrite('core.scss', 'core');
  //    done();
  //  },
  //  config: function () {
  //    var done = this.async();
  //    if (this.build.config) {
  //
  //    } else {
  //      done();
  //    }
  //
  //  },
  //  bootstrap: function () {
  //    var done = this.async();
  //    if (this.build.bootstrap) {
  //      if (!/grid/.test(this.options.bootstrapBuild)) {
  //        mkdirp.sync(path.join(this.destinationPath(), 'bootstrap'));
  //        this.fsWrite('bootstrap/_variables-override.scss', '// Set Bootstrap\'s variables overrides here\n');
  //      }
  //      this.config.bootstrapBuild[this.options.bootstrapBuild]();
  //    }
  //    done();
  //  }
  //},

  end: function () {
    console.log('*** Happy styling indeed! ***');
  }

});
