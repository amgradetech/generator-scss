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
  libComponents = generator.libcomponents,
  Build = generator.build,
  arrayHasStr = utils.arrayHasStr;

module.exports = yo.Base.extend({

  constructor: function() {
    yo.Base.apply(this, arguments);
  },

  initializing: function() {

    var _this = this;
    //var done = this.async();

    this.default = generator.defaults;
    this.buildArray = [];
    this.build = this.config.get('build') || new Build(this.buildArray);
    this.components = this.config.get('components') || {};
    this.paths = this.config.get('paths') || {};
    this.prompts = generator.prompts(this);
    this.writes = generator.writes(this);

    // Wrapper for arrayHasStr();
    this.buildArrayHasStr = function(str) {
      return arrayHasStr(_this.buildArray, str);
    };
    // Wrappers for fs functions
    this.fsCopy = function(from, to) {
      this.fs.copy(
        this.templatePath(from),
        this.destinationPath(to)
      );
    }.bind(this);
    this.fsWrite = function(to, string) {
      this.fs.write(this.destinationPath(to), string);
    }.bind(this);
    this.fsRead = function(from) {
      return this.fs.read(this.templatePath(from));
    }.bind(this);
  },

  prompting: {
    components: function() {
      var done = this.async();

      this.prompt(this.prompts.components,
        function(response) {
          this.buildArray = [].concat(response.components)

          done();
        }.bind(this)
      );
    },

  },

  writing: {
    pre: function() {
      // TODO: add support for prompting destinationPath
      this.destinationRoot(this.default.path.destinationRoot);
      this.appname = 'scss';
    },
    vars: function() {
      varfrom = this.components.extended ? 'extended/variables' : 'base/variables';
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
    customMixins: function() {
      if (this.build.customMixins) {
        this.fsCopy('extended/custom-mixins', 'util/custom-mixins');
      }
    },
    sprite: function() {
      if (this.build.sprite) {
        this.fsCopy('_sprite.scss', 'util/_sprite.scss');
      }
    },
    typography: function() {
      if (this.build.typography) {
        this.fsCopy('_typography.scss', '_typography.scss');
      }
    },
    pages: function() {
      if (this.build.pages) {
        mkdirp.sync(this.destinationPath('pages'));
        this.fsWrite('pages/__pages.scss', '// Sets import for scss files per unique page');
      }
    },
    layout: function() {
      var from;

      if (this.build.layout) {
        from = this.components.extended ? 'extended/layout' : 'base/layout';
        this.fsCopy(from, 'layout');
      }
    },
    helpers: function() {
      if (this.build.helpers) {
        this.fsCopy('extended/helpers', 'helpers');
      }
    },
    normalize: function() {
      if (this.build.normalize) {
        this.fsCopy('bootstrap/_normalize.scss', '_normalize.scss');
      }
    },
    util: function() {
      var utilContent = '';

      if (this.build.variables) utilContent += this.fsRead('import/util/variables') + '\n';
      if (this.build.mixins) utilContent += this.fsTpl('import/util/mixins', { scssMixinsPath: this.paths.scssMixinsPath }) + '\n';
      if (this.build.customMixins) utilContent += this.fsRead('import/util/custom-mixins') + '\n';
      if (this.build.sprite) utilContent += this.fsRead('import/util/sprite');

      this.fsWrite('util/__util.scss', utilContent);

    },
    core: function() {
      var done = this.async()

      libComponents.forEach(function(component){
        if (this.build[component]) {
          fsCopy(component, component)
        }
      })

      done();
    },
  },

  end: function() {
    console.log('★★★ Happy Styling! ★★★');
  }

});
