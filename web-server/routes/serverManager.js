var filter = require('../util/filter');
var exec = require('child_process').exec;
var path = require('path');
var game_dir = path.join(__dirname, '..', '..', 'game-server');


var Manager = function(app) {
  app.get('/admin/server/manager', filter.authorize, function(req, res) {
    res.render('serverManager');
  });

  app.get('/admin/api/server/restart', filter.authorize, function(req, res) {
    var child = exec('cd ' + game_dir + ' && ' + 'pomelo stop && pomelo start -e production --daemon',
      function(error, stdout, stderr) {
        errorHandler(res, error, stdout, stderr);
      });
  });

  app.get('/admin/api/server/start', filter.authorize, function(req, res) {
    exec('ps -ef | grep "game-server/app.js env="', function(error, stdout, stderr) {
      var output = stdout.split('\n');
      if (!error && output.length > 3) {        
        res.send({
          code: 300,
          msg: '服务已经正在运行了：<br>',
          output: output
        })
      } else {
        var child = exec('cd ' + game_dir + ' && ' + 'pomelo start -e production --daemon',
          function(error, stdout, stderr) {
            errorHandler(res, error, stdout, stderr);
          });
      }
    });

  });

  app.get('/admin/api/server/stop', filter.authorize, function(req, res) {
    var force = req.query.force === 'true';

    if (force) {
      exec('pkill -9 -f game-server/app.js',
        function(error, stdout, stderr) {
          errorHandler(res, error, stdout, stderr);
        });
    } else {
      var child = exec('cd ' + game_dir + ' && ' + 'pomelo stop',
        function(error, stdout, stderr) {
          errorHandler(res, error, stdout, stderr);
        });
    }
  });

  var errorHandler = function(res, error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
      res.send({
        code: 500,
        msg: '执行命令出错:<br>' + error
      })
    } else {
      res.send({
        code: 200,
        msg: '执行命令成功:<br>' + stdout + '<br>' + stderr + '<br>' + error
      });
    }
  };
};

module.exports = Manager;