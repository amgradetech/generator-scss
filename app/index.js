const yo = require('yeoman-generator');

module.exports = yo.Base.extend({
  constructor: function () {
    yo.Base.apply(this, arguments);
  },
  initializing: function () {
    this.pkg = require('../package.json');
  },
  writing: {
    scss: function() {
      this.fs.copy(
        this.templatePath('scss'),
        this.destinationPath('scss')
      );
    }
  },
  end: function(){
    console.log('scss scaffold done');
  }
});
