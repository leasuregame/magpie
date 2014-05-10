var Factory, autoLoad, fs, path;

path = require('path');

fs = require('fs');

Factory = module.exports = {};

Factory.init = function(type, db) {
  autoLoad(type, db);
  return Factory;
};

autoLoad = function(type, db) {
  if (!db) {
    db = '';
  } else {
    db = 'dbs/'+ db;
  }

  var dir = path.join(__dirname, type, db);
  return fs.readdirSync(dir).forEach(function(filename) {
    var load, name;

    if (!/Dao\.js/.test(filename)) {
      return;
    }
    name = path.basename(filename, '.js');
    load = function() {
      return require(dir + "/" + name);
    };
    return Factory.__defineGetter__(name.slice(0, -3), load);
  });
};