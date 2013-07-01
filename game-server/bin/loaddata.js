var config = require('../config/mysql').development;
var ttconfig = require('../config/ttserver').development;
var mysql = require('mysql');
var ttServer = require('../app/manager/ttserver/ttserver');
var fs = require('fs');
var path = require('path');

FIXTURES_DIR = path.join(__dirname, '..', 'config', 'fixtures/')

var connection = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database
});

connection.connect();

var mockApp = {
  get: function(name){
    if (name == 'ttserver'){
      return ttconfig
    }
  }
}

var ttDriver = ttServer(mockApp);

var query = function(sql, args, cb) {
  connection.query(sql, args, function(err, results) {
    if (err) {
      throw err;
    }
    cb(null, results);
    //connection.end();
  });
};

var importCsvToMySql = function(filename) {
  file = fs.readFile(FIXTURES_DIR + filename, function(err, data) {
    if (err) {
      throw err;
    }

    var list = data.toString().split('\n');
    var header = list[0];
    var rows = list.slice(1);

    for (i = 0; i < rows.length; i++) {
      (function(i){
        var delete_sql = "delete from User where id = " + rows[i].split(',')[0];
        var insert_sql = "insert into User (" + header + ") values (" + rows[i] + ")";
        
        query(delete_sql, [], function(err, result){
          query(insert_sql, [], function(err, result) {
            if (err) {
              throw err;
            }
            console.log(result);
          });
        });
      })(i);
    }
  });
};

var importJson = function(filename) {
  data = require(FIXTURES_DIR + filename)
  for( id in data){
    (function(id, data){
      console.log('key', id);
      ttDriver.del(id.toString(), function(err, result){
        console.log('del', err, result);
        ttDriver.add(id.toString(), data[id], function(err, result){
          if (err) throw err;
          console.log('add', err, result);
        })
      });
    })(id, data);
  }
};

console.log('import user data to mysql...');
importCsvToMySql('users.csv');

console.log('import player data to tt server...');
importJson('players.js');