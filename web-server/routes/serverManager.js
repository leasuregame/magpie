var filter = require('../util/filter');
var playerDao = require('../dao/playerDao');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var game_dir = path.join(__dirname, '..', '..', 'game-server');
var WHITE_LIST_PATH= path.join(__dirname, '..', '..', 'shared', 'whitelist.json');
var CONF_PATH = path.join(__dirname, '..', '..', 'shared', 'conf.json');

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

  app.get('/admin/api/whitelist', filter.authorize, function(req, res) {
    var list = JSON.parse(readWhiteList());
    playerDao.playersInAreas(
      ['id', 'name', 'userId', 'areaId'], 
      ' userId in (' + list.toString() + ') ', 
      [1],
      function(err, players) {
        if (err) {
          res.send(err);
        } else {
          res.send(players);  
        }        
      }
    );
  });

  app.post('/admin/api/whitelist', filter.authorize, function(req, res) {
    var name = req.body.name;

    if (!name || typeof name != 'string' || name == '') { 
      res.send('非法参数');
    } else {
      playerDao.playersInAreas(['id', 'name', 'userId', 'areaId'], {
        name: name
      }, [1], function(err, players) {
        if (err) {
          res.send(err);
        } else {
          if (!!players && players.length > 0) {
            var player = players[0];
            addWhiteList(player.userId);
            res.send(player);
          } else {
            res.send('玩家不存在');
          }
        }
      });      
    }
  });

  app.delete('/admin/api/whitelist/:pid', filter.authorize, function(req, res) {
    var pid = req.params.pid;
    console.log(req.params, pid);
    if (isNaN(parseInt(pid))) {
      res.send('非法参数');
    } else {
      delWhiteList(pid);
      res.send('ok');
    }
  });

  app.get('/admin/api/whitelist/status', filter.authorize, function(req, res) {
    var confData = JSON.parse(fs.readFileSync(CONF_PATH, 'utf8'));
    res.send(confData.useWhiteList);
  });

  app.get('/admin/api/whitelist/status/toggle', filter.authorize, function(req, res) {
    var confData = JSON.parse(fs.readFileSync(CONF_PATH, 'utf8'));

    if (confData.useWhiteList) {
      confData.useWhiteList = false;
    } else {
      confData.useWhiteList = true;
    }

    fs.writeFileSync(CONF_PATH, JSON.stringify(confData), 'utf8');
    res.send(confData.useWhiteList);
  });

  var readWhiteList = function() {
    try {
      return fs.readFileSync(WHITE_LIST_PATH, 'utf8') || [];  
    } catch (err) {
      fs.writeFileSync(WHITE_LIST_PATH, '[]', 'utf8');
      return '[]';
    }      
  };

  var writeWhiteList = function(data) {
    if (typeof data != 'string') {
      data = JSON.stringify(data);
    }
    fs.writeFileSync(WHITE_LIST_PATH, data, 'utf8');
  };

  var addWhiteList = function(pid) {
    var list = JSON.parse(readWhiteList());
    list.push(pid);
    writeWhiteList(list);
  };

  var delWhiteList = function(pid) {
    var list = JSON.parse(readWhiteList());
    for (var i = 0; i<list.length; i++) {
      if (list[i] == pid) {
        list.splice(i, 1);
        break;
      }
    }
    writeWhiteList(list);
  };

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