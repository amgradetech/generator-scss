module.exports = function(_this) {
  return {
    bootstrapBuild: {
      full: function () {
        this.fsWrite('bootstrap.scss', this.fsTpl('bootstrap/bootstrap', {bootstrapScssPath: _this.paths.bootstrapScssPath}));
      }.bind(_this),
      fullFlex: function () {
        var content = this.fsRead('bootstrap/bootstrap-flex') + '\n';
        content += this.fsTpl('bootstrap/bootstrap', {bootstrapScssPath: _this.paths.bootstrapScssPath});
        this.fsWrite('bootstrap.scss', content);
      }.bind(_this),
      grid: function () {
        this.fsWrite('bootstrap.scss', this.fsTpl('bootstrap/bootstrap-grid', {bootstrapScssPath: _this.paths.bootstrapScssPath}));
      }.bind(_this),
      gridFlex: function () {
        var content = this.fsRead('bootstrap/bootstrap-flex') + '\n';
        content += this.fsTpl('bootstrap/bootstrap-grid', {bootstrapScssPath: _this.paths.bootstrapScssPath});
        this.fsWrite('bootstrap.scss', content);
      }.bind(_this),
      reboot: function () {
        this.fsWrite('bootstrap.scss', this.fsTpl('bootstrap/bootstrap-reboot', {bootstrapScssPath: _this.paths.bootstrapScssPath}));
      }.bind(_this)
    }
  };
};
