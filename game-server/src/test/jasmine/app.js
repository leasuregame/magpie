var express = require('express');
var mysql = require('./script/mysql');
var util = require('./script/util');
var fs = require('fs');
var spawn = require('child_process').spawn;

var app = express();

app.use(express.static(__dirname + '/public'));
app.use('/spec', express.static(__dirname + '/spec'));

app.set('views', __dirname + '/views')
app.engine('html', require('ejs').renderFile);

app.get('/test', function(req, res) {
  var dir = __dirname + '/spec';
  util.walk(dir, function(err, files){
    files = files.filter(function(f) {
      return /Spec.js$/.test(f);
    });
    //files = ['fightSpec.js', 'playerSpec.js', 'userSpec.js'];
    res.render('SpecRunner.html', {
      files: files.map(function(f) { return f.substr(dir.length+1)})
    });
  });

});

app.get('/adduser', function(req, res) {
  var account = req.query.account;
  var pwd = req.query.password;
  mysql.userdb.query("insert into user (account, password, createTime, roles) values (?, ?, ?, ?)", [account, pwd, Date.now(), '[1]'], function(err, result) {
    if (err) {
      res.send({
        code: 500
      });
    }

    res.send({
      code: 200,
      uid: result.insertId
    });

  });
});

app.get('/removeuser', function(req, res) {
  var uid = req.query.uid;
  if (!uid) {
    res.send({
      code: 200,
      msg: 'parameter uid is null'
    })
  }

  mysql.userdb.query('delete from user where id = ?', [uid], function(err, results) {
    if (!err) {
      res.send({
        code: 200
      });
    } else {
      res.send({
        code: 500,
        msg: 'faild to delete user by id: ' + uid
      });
    }
  });
});

app.get('/addPlayer', function(req, res) {
  var userId = req.query.userId;
  var areaId = req.query.areaId;
  var name = req.query.name;
  var ct = Date.now();

  mysql.magpiedb1.query('insert into player (userId, areaId, name, createTime) values (?,?,?,?)', [userId, areaId, name, Date.now()], function(err, result) {
    if (err) {
      res.send({
        code: 500,
        msg: 'faild to add player with parameters: ' + JSON.stringify(req.query)
      });
    } else {
      res.send({
        code: 200,
        playerId: result.insertId,
        ct: ct
      });
    }
  });
});

app.get('/removePlayer', function(req, res) {
  var playerId = req.query.playerId;
  mysql.magpiedb1.query('delete from player where id = ?', [playerId], function(err, results) {
    if (!err) {
      res.send({
        code: 200
      })
    } else {
      res.send({
        code: 500,
        msg: 'faild to delete player by id: ' + playerId
      });
    }
  });
});

app.get('/loaddata/rank', function(req, res) {
  command(req, res, 'sh', [__dirname + '/script/load-data.sh', 'rank']);
});

app.get('/loaddata/csv', function(req, res) {
  command(req, res, 'sh', [__dirname + '/script/load-data.sh', 'csv']);
});

app.get('/loaddata/all', function(req, res) {
  command(req, res, 'sh', [__dirname + '/script/load-data.sh', 'all']);
});

app.get('/createDb', function(req, res) {
  command(req, res, 'sh', [__dirname + '/../../bin/initMysql.sh']);
});

app.get('/:table/:id', function(req, res) {
  mysql.magpiedb1.query('select * from ' + req.params.table + ' where id = ?', [req.params.id], function(err, result) {
    if (err) {
      res.send({
        code: 500,
        msg: err
      })
    } else {
      if ( !! result && result.length == 1) {
        res.send({
          code: 200,
          data: result[0]
        });
      } else {
        res.send({
          code: 404,
          data: req.params.table + ' not exists'
        });
      }
    }
  });
});

var command = function(req, res, cmd, args) {
  var ps = spawn(cmd, args);
  ps.stdout.on('data', function(data) {
    console.log(data.toString());
  });
  ps.stderr.on('data', function(data) {
    console.log('error:', data.toString());
  });
  ps.on('close', function(code) {
    res.send('done');
  });
};

app.listen(3000);
console.log('Test server listen on http://127.0.0.1:3000/test');