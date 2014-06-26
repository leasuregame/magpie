var filter = require('../util/filter');
var exec = require('child_process').exec;
var path = require('path');
var game_dir = path.join(__dirname, '..', '..', 'game-server');


var Manager = function(app) {
  app.get('/admin/api/server/restart', function (req, res) {
    var child = exec('cd '+game_dir+' && ' + 'pomelo stop && pomelo start -e production --daemon',
      function(error, stdout, stderr) {
        errorHandler(res, error, stdout, stderr);
      });
  });

  app.get('/admin/api/server/start', function (req, res) {
    var child = exec('cd '+game_dir+' && ' + 'pomelo start -e production --daemon',
      function(error, stdout, stderr) {
        errorHandler(res, error, stdout, stderr);
      });
  });

  app.get('/admin/api/server/stop', function (req, res) {
    var child = exec('cd '+game_dir+' && ' + 'pomelo stop',
      function(error, stdout, stderr) {
        errorHandler(res, error, stdout, stderr);
      });
  });

  var errorHandler = function(res, error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }

    res.send(stdout + '<br>' + stderr + '<br>' + error);
  };
};

module.exports = Manager;