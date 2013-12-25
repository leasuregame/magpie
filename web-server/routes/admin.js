/*
 * GET users listing.
 */

var fs = require('fs');
var path = require('path');
var qs = require('querystring');

var readFile = function(name) {
  return fs.readFileSync(path.join(__dirname, '..', 'views', name), 'utf8');
};

var writeFile = function(name, text) {
  fs.writeFileSync(path.join(__dirname, '..', 'views', name), text);
};

exports.admin = function(req, res) {
  res.render('admin', {
    title: '公告编辑',
    content: readFile('notice.html')
  });
};

exports.saveNotice = function(req, res) {
  if (req.body.content) {
    writeFile('notice.html', req.body.content);
  }
  res.end();
};