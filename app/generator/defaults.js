module.exports = {
  path: {
    // Relative from appFolder
    destinationRoot: './scss',
    scssMixinsPath: '../node_modules/scss-mixins-collection/mixins/__mixins.scss',
    bootstrapScssPath: '../node_modules/bootstrap/scss'
  },
  config: {
    cssDir: './css',
    sassDir: './scss',
    fontsDir: './fonts',
    imagesDir: './images',
    outputStyle: ':nested',
    lineComments: true,
    relativeAssets: true
  }
};
