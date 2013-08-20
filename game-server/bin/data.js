var csv = require('csv');
var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('underscore');

module.exports = function(db, dir) {
	return new Data(db, dir);
};

var Data = function(db, dir) {
	this.db = db;
  if (typeof dir !== 'undefined') {
    this.fixtures_dir = dir;  
  } else {
    this.fixtures_dir = path.join(__dirname, '..', 'config', 'fixtures/');
  }
  
};

Data.prototype.importCsvToSql = function(table, filepath, callback) {
  var self = this;
  csv()
    .from(filepath, {
      columns: true,
      delimiter: ';',
      escape: '"'
    })
    .transform(function(row, index, cb) {
      _.each(row, function(val, key) {
        if (_.isEmpty(val)) {
          delete row[key];
        }
      });

      if (_.isEmpty(row)) {
        cb(null);
        return;
      }

      self.db[table].delete({
        where: {
          id: row.id
        }
      }, function(err, res) {
        self.db[table].create({
          data: row
        }, function(err, res) {
          if (err) {
            console.log(err);
          }
          cb(null, true);
        });
      });
    })
    .on('error', function(error) {
      console.log(error.message);
    })
    .on('close', function() {
      console.log('');
    })
    .on('end', function(count) {
      callback(null, count);
    });
};

Data.prototype.loadCsvDataToSql = function(callback) {
  console.log("  *** load data from csv ***  ");
  var self = this;
  var files = fs.readdirSync(this.fixtures_dir).filter(function(file) {
    return /\.csv$/.test(file) && !/user\.csv$/.test(file);
  });
  
  var count = 0;
  for (var i = 0; i < files.length; i++) {
    (function(i) {
      var filename = files[i];

      var table = path.basename(filename, '.csv');
      self.importCsvToSql(table, self.fixtures_dir + filename, function(err, res) {
        count++;
        if (err) {
          console.log('load ' + filename + ' error: ', err);
          return;
        }

        console.log(filename + '   >>   ' + table);
        if (count == files.length) {
          console.log("  *** load data from csv complete ***  ");
          callback(null, true);
        }
      });
    })(i);
  }
};

Data.prototype.loadDataForRankingList = function(callback) {
  var self = this;
  var count = 0;
  console.log('  *** create test data for ranking list ***  ');
  console.log('raking list data creating......');
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

      self.db.player.create({
        data: data
      }, function(err, res) {
        if (err) {
          console.log(err);
        }

        self.db.rank.create({
          data: {
            playerId: id,
            createTime: Date.now(),
            ranking: id - 9999
          }
        }, function(err, _res) {
          count += 1;
          if (count == 10001) {
            console.log('  ***  data for ranking list completed ***  ');
            callback(null, true);
          }
        });
      });
    })(i);
  }
};