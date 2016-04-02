const yo = require('yeoman-generator'),
  requireTree = require('require-tree'),
  mkdirp = require('mkdirp'),
  _forEach = require('lodash').forEach,
  del = require('del'),
  fs = require('fs'),
  readdir = fs.readdirSync,
  generator = requireTree('./generator'),
  utils = requireTree('./utils'),

  _replaceAll = utils.replaceAll,
  // Array of avaiable components
  libComponents = generator.libcomponents,
  Build = generator.build,
  arrayHasStr = utils.arrayHasStr;

module.exports = yo.Base.extend({

  constructor: function () {
    yo.Base.apply(this, arguments);
  },

  initializing: function () {

    var _this = this;
    //var done = this.async();

    this.default = generator.defaults;
    this.buildArray = [];
    this.build = this.config.get('build') || new Build(this.buildArray);
    this.components = this.config.get('components') || {};
    this.paths = this.config.get('paths') || {};
    this.prompts = generator.prompts(this);
    this.writes = generator.writes(this);

    //done();
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
        this.templatePath(from),
        this.destinationPath(to)
      );
    }.bind(this);
    this.fsWrite = function (to, string) {
      this.fs.write(this.destinationPath(to), string);
    }.bind(this);
    this.fsRead = function (from) {
      return this.fs.read(this.templatePath(from));
    }.bind(this);
    /**
     * Custom templating
     * @param {String} from - path to template file
     * @param {Object} placeholders - set of placeholders-strings pairs to replace in template body
     * @return {String} - content with replaced placeholders
     */
    this.fsTpl = function (from, placeholders) {
      var content = this.fsRead(this.templatePath(from));

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

      if (this.buildArrayHasStr('layout') && this.buildArrayHasStr('variables') && this.buildArrayHasStr('mixins')) {
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
            bootstrapBuild: response.bootstrapType || 'none'
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
      if (this.build.normalize && (!!this.components.bootstrap || /full/i.test(this.components.bootstrap.bootstrapType))) {
        this.buildArray[this.buildArray.indexOf('normalize')] = undefined;
      }

      this.build = new Build(this.buildArray);
      this.config.set({
        build: this.build,
        components: this.components,
        paths: this.paths
      });

      done();
    }
  },

  writing: {
    pre: function () {
      // TODO: add support for prompting destinationPath
      this.destinationRoot(this.default.path.destinationRoot);
      this.appname = 'scss';
    },
    vars: function () {
      var
        from = this.components.extended ? 'extended/variables' : 'base/variables';
      if (this.build.variables) {
        //mkdirp.sync(this.destinationPath('util/'));
        this.fsCopy(from, 'util/variables');
      }
    },
    /*  mixins: function () {
     if (this.build.mixins) {
     // Load scss-mixins-collection
     }
     },*/
    customMixins: function () {
      if (this.build.customMixins) {
        this.fsCopy('extended/custom-mixins', 'util/custom-mixins');
      }
    },
    //  sprite: function () {
    //    var done = this.async();
    //    if (this.build.sprite) {
    //      this.files.util += '\n' + this.fsRead('import/util/spriting');
    //      this.fsCopy('extended/_spriting.scss', 'util/_spriting.scss');
    //    }
    //    done();
    //  },
    //
    typography: function () {
      if (this.build.typography) {
        this.fsCopy('_typography.scss', '_typography.scss');
      }
    },
    pages: function () {
      if (this.build.pages) {
        mkdirp.sync(this.destinationPath('pages'));
        this.fsWrite('pages/__pages.scss', '// Sets import for scss files per unique page');
      }
    },
    layout: function () {
      var from;

      if (this.build.layout) {
        from = this.components.extended ? 'extended/layout' : 'base/layout';
        this.fsCopy(from, 'layout');
      }
    },
    helpers: function () {
      if (this.build.helpers) {
        this.fsCopy('extended/helpers', 'helpers');
      }
    },
    normalize: function(){
      if(this.build.normalize) {
        this.fsCopy('bootstrap/_normalize.scss', '_normalize.scss');
      }
    },
    util: function () {
      var utilContent = '';

      if (this.build.variables) utilContent += this.fsRead('import/util/variables') + '\n';
      if (this.build.mixins) utilContent += this.fsTpl('import/util/mixins', {scssMixinsPath: this.paths.scssMixinsPath}) + '\n';
      if (this.build.customMixins) utilContent += this.fsRead('import/util/custom-mixins') + '\n';
      if (this.build.sprite) utilContent += this.fsRead('import/util/spriting');

      this.fsWrite('util/__util.scss', utilContent);

    },
    core: function () {
      var coreContent = '';

      if (this.build.variables || this.build.mixins || this.build.customMixins || this.build.sprite) coreContent += this.fsRead('import/core/util') + '\n';
      if (this.build.typography) coreContent += this.fsRead('import/core/typography') + '\n';
      if (this.build.normalize) coreContent += this.fsRead('import/core/normalize') + '\n';
      if (this.build.layout) coreContent += this.fsRead('import/core/layout') + '\n';
      if (this.build.pages) coreContent += this.fsRead('import/core/pages') + '\n';
      if (this.build.helpers) coreContent += this.fsRead('import/core/helpers');

      this.fsWrite('core.scss', coreContent);

    },
    config: function () {
      if (this.build.config) {
        this.fsWrite('../config.rb', this.fsTpl('import/config/config.rb', this.components.config));
      }
    },
    bootstrap: function () {
      if (this.build.bootstrap) {
        if (!/grid/.test(this.options.bootstrapBuild)) {
          mkdirp.sync(this.destinationPath('bootstrap'));
          this.fsWrite('bootstrap/_variables-override.scss', '// Set Bootstrap\'s variables overrides here\n');
        }
        this.writes.bootstrapBuild[this.components.bootstrap.bootstrapBuild]();
      }
    }
  },
  end: function () {
    console.log('★★★ Happy Styling! ★★★');
  }

});
