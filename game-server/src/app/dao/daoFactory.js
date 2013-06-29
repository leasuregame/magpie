var Factory, autoLoad, fs, path;

path = require('path');

fs = require('fs');

Factory = module.exports = {};

Factory.init = function(type) {
  autoLoad(type);
  return Factory;
};

autoLoad = function(type) {
  return fs.readdirSync(__dirname + '/' + type).forEach(function(filename) {
    var load, name;

    if (!/Dao\.js/.test(filename)) {
      return;
    }
    name = path.basename(filename, '.js');
    load = function() {
      return require("./" + type + "/" + name);
    };
    return Factory.__defineGetter__(name.slice(0, -3), load);
  });
};
