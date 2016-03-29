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
  },

  prompting: {
    extended: function () {
      var done = this.async();
      this.prompt(
        {
          type: 'checkbox',
          name: 'extended',
          message: 'Choose ?',
          choices: [
            { name: 'typography', checked: true, message: 'Font-face declarations' },
            { name: 'helpers', message: 'Helper classes' },
            { name: 'layout', message: 'Extended layout' },
            { name: 'vars', message: 'Base variables structure' },
            { name: 'mixins', message: 'Base custom mixins structure' },
            { name: 'sprite', message: 'Compass spriting' }
          ]
        },
        function (response) {
          response.extended.forEach(function (opt) {
            this.options[opt] = true;
          }.bind(this));
          console.log(this.options);
          done();
        }.bind(this)
      );
    }
  },

  writing: {
    typography: function() {
      var done = this.async();
      if (this.options.typography) {
        this.fs.copy(
          path.join(this.templatePath(), 'base', 'typography'),
          path.join(this.destinationPath(), 'typography')
        );
      }
      done();
    },
    layout: function() {
      var done = this.async();
      console.log('layout');
      done();
    }

    //// Layout
    //this.sourceRoot(path.join(__dirname, 'templates', name + '-shared'));
    //this.directory('.', '.');
    //
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
