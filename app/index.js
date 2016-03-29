const yo = require('yeoman-generator'),
  path = require('path'),
  mkdirp = require('mkdirp');

var build = {
  custom: {
    typography: false,
    helpers: false,
    layout: false,
    vars: false,
    mixins: false,
    sprite: false
  },
  base: {
    typography: true,
    helpers: false,
    layout: false,
    vars: false,
    mixins: true,
    sprite: false
  },
  full: {
    typography: true,
    helpers: true,
    layout: true,
    vars: true,
    mixins: true,
    sprite: true
  }
}

module.exports = yo.Base.extend({

  _props: {
    core: '',
    util: ''
  },
  constructor: function () {
    yo.Base.apply(this, arguments);
  },

  initializing: function () {
    this.pkg = require('../package.json');
    this.options = {};
    this.destinationRoot('./scss');
  },

  prompting: {
    build: function () {
      var done = this.async();
      this.prompt(
        {
          type: 'list',
          name: 'build',
          message: 'Choose scaffold\'s type:',
          choices: [
            {name: 'base', message: 'Base scaffold for small projects'},
            {name: 'full', message: 'Load all avaiable goodies'},
            {name: 'custom', message: 'Choose components yourself'}
          ]
        },
        function (response) {
          this.options.build = build[response.build];
          if (response.build === 'custom') this.options.custom = true;
          done();
        }.bind(this)
      );
    },
    custom: function () {
      if (!this.options.custom) return true;
      var done = this.async();
      this.prompt(
        {
          type: 'checkbox',
          name: 'custom',
          message: 'Choose custom components to load:',
          choices: [
            {name: 'typography', checked: true, message: 'Font-face declarations'},
            {name: 'helpers', message: 'Helper classes'},
            {name: 'layout', message: 'Extended layout'},
            {name: 'vars', message: 'Base variables structure'},
            {name: 'mixins', message: 'Base custom mixins structure'},
            {name: 'sprite', message: 'Compass spriting'}
          ]
        },
        function (response) {
          response.custom.forEach(function (opt) {
            this.options.build[opt] = true;
          }.bind(this));
          done();
        }.bind(this)
      );
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
          this.prompt(
            {
              type: 'input',
              name: 'mixinsPath',
              message: 'Relative path to the _mixins.scss file ( default: ../../../node_modules/scss-mixins-collection/mixins/_mixins.scss ):'
            },
            function (response) {
              this.options.mixinsPath = response.mixinsPath || '../../../node_modules/scss-mixins-collection/mixins/_mixins.scss';
              done();
            }.bind(this)
          );

        }.bind(this)
      )
    }
  },

  writing: {
    vars: function () {
      var done = this.async();
      mkdirp(path.join(this.destinationPath(), 'util/variables'));
      this.fs.write(path.join(this.destinationPath(), 'util/variables', '__variables.scss'), 'hi\nthere!');
      done();
    },
    mixins: function () {
      var done = this.async();

      done();
    },
    customMixins: function () {
      var done = this.async();

      done();
    },
    sprite: function () {
      var done = this.async();

      done();
    },
    typography: function () {
      var done = this.async();
      if (this.options.typography) {
        this.fs.copy(
          path.join(this.templatePath(), 'base', 'typography'),
          path.join(this.destinationPath(), 'typography')
        );
      }
      done();
    },
    layout: function () {
      var done = this.async(),
        from = this.options.layout ? 'extended/layout' : 'base/layout';

      this.fs.copy(
        path.join(this.templatePath(), from),
        path.join(this.destinationPath(), 'layout')
      );

      done();
    },
    helpers: function () {
      var done = this.async();
      if (this.options.helpers) {
        this.fs.copy(
          path.join(this.templatePath(), 'extended/helpers'),
          path.join(this.destinationPath(), 'helpers')
        );
      }
      done();
    },

    //// Helpers
    //this.sourceRoot(path.join(__dirname, 'templates', name + '-shared'));
    //this.directory('.', '.');
    //
    //// Util
    //this.sourceRoot(path.join(__dirname, 'templates', name + '-shared'));
    //this.directory('.', '.');
  },

  end: function () {
  }

});
