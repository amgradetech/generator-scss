var libComponents = require('./libcomponents'),
  arrayHasStr = require('../utils/arrayHasStr');

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

module.exports = Build;
