var fs = require('fs');
var path = require('path');
var CONF_PATH = path.join(__dirname, '..', '..', 'shared', 'conf.json');

var Route = function(app) {
  app.get('/admin/json/editor', function(req, res) {
    res.render('jsonEditor', {
      confData: JSON.parse(fs.readFileSync(CONF_PATH, 'utf8'))
    });
  });
};

module.exports = Route;