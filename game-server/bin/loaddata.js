var config = require('../config/mysql').development;
var mysql = require('mysql');
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

var query = function(sql, args, cb) {
  connection.query(sql, args, function(err, results) {
    if (err) {
      throw err;
    }
    cb(null, results);
    //connection.end();
  });
};

var deleteSql = function(table, id) {
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
  console.log(table, filepath);
  data = fs.readFileSync(filepath, 'utf-8')

  console.log('read data from ', table, '========');
  var list = data.toString().split('\n');
  var headers = list[0].split(DELIMITER);
  var rows = list.slice(1);

  for (i = 0; i < rows.length; i++) {
    // ignore empty row
    if (rows[i] == '' || rows[i].split(DELIMITER).length == 1) break;
    console.log(i);
    (function(i) {
      id = rows[i].split(',')[0];
      var _ref = deleteSql(table, rows[i].split(DELIMITER)[0]),
        delete_sql = _ref[0],
        d_args = _ref[1];
      var _ref = insertSql(table, headers, rows[i]),
        insert_sql = _ref[0],
        i_args = _ref[1];
      console.log(delete_sql);
      console.log(insert_sql);
      query(delete_sql, d_args, function(err, result) {
        if (err) {
          console.log('Error: delete data from ', table);
        }
        query(insert_sql, i_args, function(err, result) {
          if (err) {
            console.log('Error: import data to ', table);
            throw err;
          }
        });
      });
    })(i);
  }

};

var laodCsvDataToSql = function() {
  console.log("  *** load data from csv ***  ");
  fs.readdirSync(FIXTURES_DIR).forEach(function(filename) {
    if (!/\.csv/.test(filename)) {
      return;
    }

    var table = path.basename(filename, '.csv');
    importCsvToMySql(table, FIXTURES_DIR + filename);
    console.log(filename + '   >>   ' + table);
  });
  console.log('  *** completed ***  ');
  //process.exit();
};

laodCsvDataToSql();