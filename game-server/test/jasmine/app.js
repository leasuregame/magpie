express = require('express');
mysql = require('./script/mysql');
tt = require('./script/tt');

app = express();

app.use(express.static(__dirname + '/public'));
app.use('/spec', express.static(__dirname + '/spec'));

app.set('views', __dirname + '/views')
app.engine('html', require('ejs').renderFile);

app.get('/test', function(req, res){
  res.render('SpecRunner.html');
});

app.get('/adduser', function(req, res){
  account = req.query.account;
  pwd = req.query.password;
  mysql.query("insert into user (account, password, create_time) values (?, ?, ?)", [account, pwd, Date.now()], function(err, result){
    if(err){
      res.send({code: 500});
    }
    
    res.send({code: 200, uid: result.insertId});

  });
});

app.get('/removeuser', function(req, res){
  uid = req.query.uid;
  if (!uid){
    res.send({code: 200, msg: 'parameter uid is null'})
  }
  console.log('remove user:', uid);
  mysql.query('delete from user where id = ?', [uid], function(err, results){
    if (!err){
      res.send({code: 200});
    }
    else{
      res.send({code: 500, msg: 'faild to delete user by id: ' + uid});
    }
  });
});

// app.get('/removeplayer', function(req, res){
//   playerId = req.params.playerId;
//   tt.del(playerId, function(err, result){
//     if (err){
//       res.send({code: 500, msg: 'faild to delete player by id: ' + playerId});
//     }
//     else{
//       res.send({code: 200});
//     }
//   });
// });

app.get('/removePlayer', function(req, res){
  playerId = req.query.pid;
  mysql.query('delete from player where id = ?', [playerId], function(err, results){
    if (!err){
      res.send({code: 200})
    }
    else{
      res.send({code: 500, msg: 'faild to delete player by id: ' + playerId});
    }
  });
});

app.listen(3000);
console.log('Test server listen on http://127.0.0.1:3000/test');