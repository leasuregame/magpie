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
  console.log(req.query, req.body, '-----------');
  email = req.query.email;
  pwd = req.query.password;
  mysql.query("insert into User (email, password) values ('" + email + "', '" + pwd + "')", function(err, result){
    console.log('add user: == ', result, err);
    if(err){
      res.send({code: 500});
    }
    
    console.log('add user:', result.insertId);
    res.send({code: 200, uid: result.insertId});

  });
});

app.get('/removeuser', function(req, res){
  uid = req.query.uid;
  if (!uid){
    res.send({code: 200, msg: 'parameter uid is null'})
  }
  console.log('remove user:', uid);
  mysql.query('delete from User where id = ?', [uid], function(err, results){
    if (!err){
      res.send({code: 200});
    }
    else{
      res.send({code: 500, msg: 'faild to delete user by id: ' + uid});
    }
  });
});

app.get('/removeplayer', function(req, res){
  playerId = req.params.playerId;
  tt.del(playerId, function(err, result){
    if (err){
      res.send({code: 500, msg: 'faild to delete player by id: ' + playerId});
    }
    else{
      res.send({code: 200});
    }
  });
});

app.listen(3000);
console.log('Test server listen on http://127.0.0.1:3000/test');