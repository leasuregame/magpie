/*
 * GET home page.
 */

var fs = require('fs');
var path = require('path');

exports.index = function(req, res) {
  res.render('index', {
    title: 'LeasureGame',
    content: fs.readFileSync(path.join(__dirname, '..', 'views', 'notice.html'), 'utf8')
  });
};