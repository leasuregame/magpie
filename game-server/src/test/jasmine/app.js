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
  responseRunner(req, res, 'SpecRunner')
});

app.get('/test/html', function(req, res) {
  responseRunner(req, res, 'htmlRunner');
});

app.get('/message/add', function(req, res) {
  args = req.query;
  args.createTime = Date.now();
  console.log('add message: ', args);
  mysql.magpiedb1.query("insert into message set ?", args, function(err, result) {
    if (err) {
      return res.send({
        code: 500,
        msg: err
      });
    }

    res.send({
      code: 200,
      insertId: result.insertId
    });
  });
});

app.get('/adduser', function(req, res) {
  var account = req.query.account;
  var pwd = req.query.password;
  mysql.userdb.query("insert into user (account, password, createTime, roles) values (?, ?, ?, ?)", [account, pwd, Date.now(), '[1]'], function(err, result) {
    if (err) {
      return res.send({
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
    return res.send({
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
  var lv = req.lv || 1;
  var ct = Date.now();

  mysql.magpiedb1.query('insert into player (userId, areaId, name, lv, createTime) values (?,?,?,?,?)', [userId, areaId, name, lv, Date.now()], function(err, result) {
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

app.get('/addPlayerbyId', function(req, res) {
  var userId = req.query.userId;
  var areaId = req.query.areaId;
  var name = req.query.name;
  var id = req.query.id;
  var lv = req.lv || 1;
  var ct = Date.now();

  mysql.magpiedb1.query('insert into player (id,userId, areaId, name, lv, createTime) values (?,?,?,?,?,?)', [id, userId, areaId, name, lv, Date.now()], function(err, result) {
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

app.get('/addFriend', function(req, res) {
  var playerId = req.query.playerId;
  var friendId = req.query.friendId;
  mysql.magpiedb1.query('insert into friend (playerId,friendId) values (?,?)', [playerId, friendId], function(err, result) {
    if (err) {
      res.send({
        code: 500,
        msg: 'faild to add friend with parameters: ' + JSON.stringify(req.query)
      });
    } else {
      res.send({
        code: 200,
        result: result
      });
    }
  });
});

app.get('/clear/:table', function(req, res) {
  var table = req.params.table;
  mysql.magpiedb1.query('delete from ' + table, function(err, result) {
    if (err) {
      res.send({
        code: 500,
        msg: 'faild to delete data from ' + table
      });
    } else {
      res.send({
        code: 200
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

app.get('/loaddata/user', function(req, res) {
  command(req, res, 'sh', [__dirname + '/script/load-data.sh', 'user']);
});

app.get('/createDb', function(req, res) {
  command(req, res, 'sh', [__dirname + '/../../bin/initMysql.sh', 'magpie_area_1']);
});

app.get('/:table/query', function(req, res) {
  var table = req.params.table;
  var query = req.query;

  var where = '', k, v, args = [];
  for (k in query) {
    where += ' ' + k + '=? and';
    args.push(query[k]);
  }  

  var sql = 'select * from ' + table + (where == '' ? '': ' where ' + where.slice(0, -3));
  console.log(sql, args);
  mysql.magpiedb1.query(sql, args, function(err, results) {
    console.log(err, results);
    if (err) {
      res.send({
        code: 500, 
        msg: err
      });
    } else {
      if (!!results && results.length == 1) {
        res.send({
          code: 200,
          data: results[0]
        });
      } else if (!!results && results.length > 1) {
        res.send({
          code: 200,
          data: results
        })
      } else {
        res.send({
          code: 200,
          data: null
        })
      }
    }
  });

});

app.get('/update/:table/:id', function(req, res) {
  var table = req.params.table;
  var id = req.params.id;
  var data = req.query;
  console.log(data);
  var _sets = ' set ',
    arg,
    args = [];
  for (var key in data) {
    _sets += key + ' = ?,';
    arg = data[key];
    if (typeof arg == 'object') {
      arg = JSON.stringify(arg);
    }
    args.push(arg);
  }
  var sql = 'update ' + table + _sets.slice(0, -1) + ' where id = ?';
  args.push(id);
  console.log(sql, args);
  mysql.magpiedb1.query(sql, args, function(err, result) {
    if (err) {
      res.send({
        code: 500,
        msg: err
      })
    } else {
      res.send({
        code: 200
      });
    }
  });
});

app.get('/create/:table', function(req, res) {
  var table = req.params.table;
  var data = req.query;
  console.log('create:', table, data);
  mysql.magpiedb1.query("insert into "+ table +" set ?", data, function(err, result) {
    if (err) {
      return res.send({
        code: 500,
        msg: err
      });
    }

    res.send({
      code: 200,
      insertId: result.insertId
    });
  });

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

var responseRunner = function(req, res, runner) {
  var debug = req.query.debug || false;
  var dir = __dirname + '/spec';
  util.walk(dir, function(err, files) {
    files = files.filter(function(f) {
      return /Spec.js$/.test(f);
    });
    if (debug) {
      files = [];
    }

    res.render(runner + '.html', {
      files: files.map(function(f) {
        return f.substr(dir.length + 1)
      })
    });
  });
};

app.listen(3000);
console.log('Test server listen on http://127.0.0.1:3000/test');