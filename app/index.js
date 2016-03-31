const yo = require('yeoman-generator'),
  path = require('path'),
  mkdirp = require('mkdirp'),
  _forEach = require('lodash').forEach,
  del = require('del'),
  fs = require('fs'),
  readdir = fs.readdirSync,
  Separator = require('./utils/promptSeparator'),

  _replaceAll = function (str, from, to) {
    return str.replace(new RegExp(from, 'g'), to);
  };

// Array of avaiable components
var libComponents = [
  'bootstrap',
  'config',
  'customMixins',
  'helpers',
  'layout',
  'mixins',
  'normalize',
  'pages',
  'sprite',
  'typography',
  'variables'
];

/**
 * Compose config object for components which have to be build.
 * @param {Array}  arr - components from prompt
 * @param {Object} build - components from .yo-rc.json if exists
 * @constructor - components build config
 */
var Build = function (arr, build) {
  const toBuildComponents = Array.isArray(arr) ? arr : [],
    buildObj = !!build ? build : {};

  libComponents.map(function (el) {
    this[el] = arrayHasStr(toBuildComponents, el) || !!buildObj[el];
  }.bind(this));
};

/**
 * Define if array has at least one occurence of needed string
 * @param arr - array to search in
 * @param str - string to search
 */
var arrayHasStr = function (arr, str) {
  return arr.indexOf(str) >= 0;
};


module.exports = yo.Base.extend({

  constructor: function () {
    yo.Base.apply(this, arguments);
  },

  initializing: function () {

    var _this = this;
    var done = this.async();

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

    this.buildArray = [];
    this.build = this.config.get('build') || new Build(this.buildArray);

    console.log(this.build);

    this.components = this.config.get('components') || {};
    this.paths = this.config.get('paths') || {};

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
            checked: this.build.typography,
            name: '- typography'
          },
          {
            value: 'pages',
            checked: this.build.pages,
            name: '- pages'
          },
          {
            value: 'helpers',
            checked: this.build.helpers,
            name: '- helpers'
          },
          {
            value: 'layout',
            checked: this.build.layout,
            name: '- layout files'
          },
          {
            value: 'variables',
            checked: this.build.variables,
            name: '- variables files'
          },
          {
            value: 'customMixins',
            checked: this.build.customMixins,
            name: '- custom-mixins'
          },
          {
            value: 'sprite',
            checked: this.build.sprite,
            name: '- Compass spriting'
          },
          {
            value: 'normalize',
            checked: this.build.normalize,
            name: '- bootstrap\'s normalize.css'
          },
          {
            value: 'bootstrap',
            checked: this.build.bootstrap,
            name: '- bootstrap@^4.0 scss files'
          },
          {
            value: 'mixins',
            checked: this.build.mixins,
            name: '- scss-mixins-collection (library plug in)'
          },
          {
            value: 'config',
            checked: this.build.config,
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
        message: 'Set relative path to the _mixins.scss from this folder ( default: ' + this.default.path.scssMixinsPath + ' ):'
      },
      bootstrapScssPath: {
        type: 'input',
        name: 'bootstrapScssPath',
        message: 'Set relative path to the bootstrap/scss folder from this folder ( default: ' + this.default.path.bootstrapScssPath + ' ):'
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

    // TODO: add support for prompting destinationPath
    this.destinationPath(this.default.path.destinationPath);

    done();
    //try {
    //  console.log(fs.realpathSync('./scss', function (err) {
    //    console.log('readdir cb', err);
    //  }));
    //} catch(err) {
    //  console.log(err);
    //  done();
    //}

    /*this.prompt({
     type: 'confirm',
     name: 'removeFolder',
     message: 'This action will remove everything withing ./scss folder and build it from scratch. Proceed?'
     }, function (response) {
     if (!response.removeFolder) return false;
     del.sync('./scss');
     done();
     });*/

    // Wrapper for arrayHasStr();
    this.buildArrayHasStr = function (str) {
      return arrayHasStr(_this.buildArray, str);
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
    /**
     * Custom templating
     * @param {String} from - path to template file
     * @param {Object} placeholders - set of placeholders-strings pairs to replace in template body
     * @return {String} - content with replaced placeholders
     */
    this.fsTpl = function (from, placeholders) {
      var content = this.fsRead(from);
      _forEach(placeholders, function (value, key) {
        content = _replaceAll(content, '{% ' + key + ' %}', value);
      });
      return content;
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
                  this.buildArray.push(component);
                }.bind(this));
                // Compass spriting require compass config to be set
                if (this.buildArrayHasStr('sprite') && !this.buildArrayHasStr('config')) {
                  this.buildArray.push('config');
                }
                done();
              }.bind(this)
            );
          } else if (response.buildType === 'base') {
            this.buildArray = [
              'typography',
              'layout',
              'variables',
              'mixins'
            ];
            done();
          } else {
            this.buildArray = libComponents;
            done();
          }
        }.bind(this)
      );
    },
    paths: function () {
      var done = this.async();
      var prompts = [];

      if (this.buildArrayHasStr('layout') && this.buildArrayHasStr('variables')) {
        prompts.push(this.prompts.extendedFiles);
      }
      if (this.buildArrayHasStr('mixins')) {
        prompts.push(this.prompts.scssMixinsPath);
      }
      if (this.buildArrayHasStr('bootstrap')) {
        prompts.push(this.prompts.bootstrapScssPath);
        prompts.push(this.prompts.bootstrapType);
      }
      if (prompts.length) {
        this.prompt(prompts, function (response) {
          this.components.extended = !!response.extendedFiles;
          this.paths.scssMixinsPath = response.scssMixinsPath || '';
          this.paths.bootstrapScssPath = response.bootstrapScssPath || '';
          this.components.bootstrap = {
            bootstrapType: response.bootstrapType || 'none'
          };
          done();
        }.bind(this))
      } else {
        done();
      }
    },
    configRb: function () {
      var done = this.async();
      if (this.buildArrayHasStr('config')) {
        this.prompt(this.prompts.config, function (response) {
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
    setConfig: function () {
      var done = this.async();
      // Bootstraps full build type has normalize already
      // TODO: make this work
      //if (this.build.normalize && /full/i.test(this.components.bootstrap.bootstrapType)) this.build.normalize = false;
      this.config.set({
        build: new Build(this.buildArray),
        components: this.components,
        paths: this.paths
      });

      done();
    }
  },

  writing: {
    vars: function () {
      var done = this.async,
        from = this.components.extended ? 'extended/variables' : 'base/variables';

      if (this.build.variables) mkdirp.sync(path.join(this.destinationPath(), 'util/'));

      this.fsCopy(from, 'util/variables');
      done();
    }
  },
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

  end: function () {
    console.log('*** Happy styling indeed! ***');
  }

});
