var config = require('../config/mysql')[process.argv[3] || 'development'][1];
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('underscore');

var FIXTURES_DIR = path.join(__dirname, '..', 'config', 'fixtures/')
var DELIMITER = ';';
var OBJECT_FIELDS = ['task', 'pass'];

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
      var field = OBJECT_FIELDS.indexOf(headers[i]) !== -1 ? fields[i].replace(new RegExp('""', 'gm'), '"').replace('"{', '{').replace('}"', '}') : fields[i];
      args.push(field);
    }
  }

  var sql = "insert into " + table + " (" + fields_str.slice(0, -1) + ") values (" + values_str.slice(0, -1) + ");";
  return [sql, args];
};

var importCsvToMySql = function(table, filepath, callback) {
  data = fs.readFileSync(filepath, 'utf-8')
  row_delimiter = data.indexOf('\n') > 0 ? '\n' : '\r2';

  var list = data.toString().split(row_delimiter);
  var headers = list[0].split(DELIMITER);
  var rows = list.slice(1);

  async.each(
    rows,
    function(row, cb) {
      // ignore empty row
      if (row == '' || !_.any(row.split(DELIMITER))) {
        return cb();
      }

      id = row.split(',')[0];
      var _ref = deleteSql(table, row.split(DELIMITER)[0]),
        delete_sql = _ref[0],
        d_args = _ref[1];
      var _ref = insertSql(table, headers, row),
        insert_sql = _ref[0],
        i_args = _ref[1];

      query(delete_sql, d_args, function(err, result) {
        if (err) {
          console.log('Error: delete data from ', table);
        }
        query(insert_sql, i_args, function(err, result) {
          if (err) {
            console.log('Error: import data to ', table);
            return cb(err);
          }
          cb();
        });
      });
    },
    callback
  );
};

var laodCsvDataToSql = function(cb) {
  console.log("  *** load data from csv ***  ");
  var files = fs.readdirSync(FIXTURES_DIR);

  async.each(files, function(filename, cb) {
    if (!/\.csv$/.test(filename)) {
      return cb();
    }

    var table = path.basename(filename, '.csv');
    importCsvToMySql(table, FIXTURES_DIR + filename, cb);
    console.log(filename + '   >>   ' + table);
  }, function(err) {
    if (err) {
      console.log(err);
    }

    console.log('  *** load dta from csv completed ***  ');
    console.log('done');
    cb(null, true);
  });
};

var loadDataForRankingList = function(cb) {
  var count = 0;
  console.log('  *** create test data for ranking list ***  ');
  console.log('creating......');
  for (var i = 10000; i < 20001; i++) {
    (function(id) {
      var _ranking = 10000;
      var data = {
        id: id,
        name: 'james' + id,
        userId: id,
        areaId: 1,
        createTime: Date.now()
      };
      query('insert into player set ?', data, function(err, res) {
        if (err) {
          console.log(err);
        }

        query('insert into rank set ?', {
          playerId: id,
          createTime: Date.now(),
          ranking: id - 9999
        }, function(err, _res) {
          count += 1;
          if (count == 10001) {
            console.log('  ***  data for ranking list completed ***  ');
            cb(null, true); 
          }
        });
      });

    })(i);
  }
};

var main = function() {
  var type = process.argv[2];
  var quenues = [];
  var start = Date.now();

  switch (type) {
    case 'csv': 
      quenues.push(laodCsvDataToSql); 
      break;
    case 'rank': 
      quenues.push(loadDataForRankingList); 
      break;
    default: 
      quenues.push(laodCsvDataToSql);
      quenues.push(loadDataForRankingList);
  }

  async.map(
    quenues,
    function(fn, cb) {
      fn(cb)
    },
    function(err, results) {
      var end = Date.now();
      console.log('time: ' + (end - start)/1000 + 's');
      if (_.every(results)) {
        process.exit();
      }
    }
  );
};

main();