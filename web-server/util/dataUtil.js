var path = require('path');
var fs = require('fs');

var DIRNAME = path.join(__dirname, '..', 'data');

var filePath = function(name, ext) {
  return DIRNAME + '/' + name + '.' + ext;
};

exports.getJson = function(name) {
  var filepath = filePath(name, 'json');
  return JSON.parse(exports.read(filepath));
};

exports.setJson = function(name, data) {
  fs.writeFileSync(filePath(name, 'json'), JSON.stringify(data));
};

exports.html = function(name) {
  return exports.read(filePath(name, 'html'));
};

exports.saveHtml = function(name, data) {
  exports.write(filePath(name, 'html'), data);
};

exports.read = function(name) {
  if (!fs.existsSync(name)) {
    return;
  }
  return fs.readFileSync(name, 'utf8');
};

exports.write = function(name, data) {
  fs.writeFileSync(name, data);
};

exports.delFile = function(name) {
  if (fs.existsSync(DIRNAME + '/' + name)) {
    fs.unlinkSync(DIRNAME + '/' + name);
  }
};