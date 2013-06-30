var config = require('../config/mysql').development;
var ttconfig = require('../config/ttserver').development;
var mysql = require('mysql');
var ttServer = require('../app/manager/ttserver/ttserver');
var fs = require('fs');
var path = require('path');

FIXTURES_DIR = path.join(__dirname, '..', 'config', 'fixtures/')
DELIMITER = ',';

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

var deleteSql = function(table, id){
  var sql = "delete from " + table + " where id = ?"
  var args = [id];
  return [sql, args];
};

var insertSql = function(table, headers, row) {
  var fields = row.split(DELIMITER);
  var args = [];
  var fields_str = "";
  var values_str = "";

  for (var i = 0; i < fields.length; i++) {
    if (fields[i] !== '') {
      fields_str += headers[i] + ",";
      values_str += "?,"
      args.push(fields[i]);
    }
  }

  var sql = "insert into " + table + " (" + fields_str.slice(0, -1) + ") values (" + values_str.slice(0, -1) + ");";
  return [sql, args];
};

var importCsvToMySql = function(table, filepath) {
  fs.readFile(filepath, function(err, data) {
    if (err) {
      throw err;
    }

    var list = data.toString().split('\n');
    var headers= list[0].split(DELIMITER);
    var rows = list.slice(1);

    for (i = 0; i < rows.length; i++) {
      // ignore empty row
      if (rows[i] == '' || rows[i].split(DELIMITER).length == 1) break;

      (function(i){
        id = rows[i].split(',')[0];
        var _ref = deleteSql(table, rows[i].split(DELIMITER)[0]), delete_sql = _ref[0], d_args = _ref[1];
        var _ref = insertSql(table, headers, rows[i]), insert_sql = _ref[0], i_args = _ref[1];
        console.log(delete_sql);
        console.log(insert_sql);
        query(delete_sql, d_args, function(err, result){
          query(insert_sql, i_args, function(err, result) {
            if (err) {
              console.log('Error: import data to ', table);
              throw err;
            }
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

var laodCsvDataToSql = function() {
  console.log("  *** load data from csv ***  ");
  fs.readdirSync(FIXTURES_DIR).forEach(function(filename){
    if (!/\.csv/.test(filename)){
      return;
    }

    var table = path.basename(filename, '.csv');
    importCsvToMySql(table, FIXTURES_DIR + filename);
    console.log(filename + '   >>   ' + table);
  });
  console.log('  *** completed ***  ');
  process.exit();   
};

laodCsvDataToSql();

// console.log('import player data to tt server...');
// importJson('players.js');



