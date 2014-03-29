var fs = require('fs');
var path = require('path');

Factory = module.exports = {};

var autoLoad = function() {
  return fs.readdirSync(__dirname).forEach(function(filename) {
    var load, name;

    if (filename == 'index.js') {
      return;
    }
    name = path.basename(filename, '.js');
    filepath = path.join(__dirname, filename);
    load = function() {
      return require("./" + name);
    };

    watch(filepath);
    return Factory.__defineGetter__(name, load);
  });
};

var watch = function(filepath) {
  fs.watch(filepath, function() {
    delete require.cache[filepath];
  });
};

autoLoad();