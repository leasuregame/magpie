var express = require('express');
var mysql = require('./script/mysql');
var fs = require('fs');
var spawn = require('child_process').spawn;

var app = express();

app.use(express.static(__dirname + '/public'));
app.use('/spec', express.static(__dirname + '/spec'));

app.set('views', __dirname + '/views')
app.engine('html', require('ejs').renderFile);

app.get('/test', function(req, res){
  var files = fs.readdirSync(__dirname + '/spec');
  files = files.filter(function(f) { return /Spec.js$/.test(f); });
  files = ['taskSpec.js'];
  res.render('SpecRunner.html', {files: files});
});

app.get('/adduser', function(req, res){
  var account = req.query.account;
  var pwd = req.query.password;
  mysql.query("insert into user (account, password, createTime) values (?, ?, ?)", [account, pwd, Date.now()], function(err, result){
    if(err){
      res.send({code: 500});
    }
    
    res.send({code: 200, uid: result.insertId});

  });
});

app.get('/removeuser', function(req, res){
  var uid = req.query.uid;
  if (!uid){
    res.send({code: 200, msg: 'parameter uid is null'})
  }

  mysql.query('delete from user where id = ?', [uid], function(err, results){
    if (!err){
      res.send({code: 200});
    }
    else{
      res.send({code: 500, msg: 'faild to delete user by id: ' + uid});
    }
  });
});

app.get('/addPlayer', function(req, res){
  var userId = req.query.userId;
  var areaId = req.query.areaId;
  var name = req.query.name;
  var ct = Date.now();

  mysql.query('insert into player (userId, areaId, name, createTime) values (?,?,?,?)', 
    [userId, areaId, name, Date.now()], function(err, result) {
    if (err){
      res.send({code: 500, msg: 'faild to add player with parameters: ' + JSON.stringify(req.query)});
    }
    else{
      res.send({code: 200, playerId: result.insertId, ct: ct});
    }
  });
});

app.get('/removePlayer', function(req, res){
  var playerId = req.query.playerId;
  mysql.query('delete from player where id = ?', [playerId], function(err, results){
    if (!err){
      res.send({code: 200})
    }
    else{      
      res.send({code: 500, msg: 'faild to delete player by id: ' + playerId});
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

var command = function(req, res, cmd, args) {
  var ps = spawn(cmd, args);
  ps.stdout.on('data', function(data){
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