module.exports = function (str, from, to) {
  return str.replace(new RegExp(from, 'g'), to);
};
