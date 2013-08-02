var pomelo = require('pomelo');
var app = pomelo.createApp();
app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
app.set('dbClient', require('../app/dao/mysql/mysql').init(app));
var dao = require('../app/dao').init('mysql');
app.set('dao', dao);
var csv = require('csv');
var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('underscore');

var FIXTURES_DIR = path.join(__dirname, '..', 'config', 'fixtures/');

var importCsvToMySql = function(table, filepath, callback) {
  csv()
  .from(filepath, {columns: true, delimiter: ';', escape: '"'})
  .transform(function(row, index, cb) {
  	_.each(row, function(val, key){
  		if (_.isEmpty(val)) {
  			delete row[key];
  		}
  	});

  	if (_.isEmpty(row)) return;
  	
  	dao[table].delete({where: {id: row.id}}, function(err, res) {
      dao[table].create({data: row}, function(err, res) {
        if (err) {
  				console.log(err);
  			}
        console.log('create success', index);
        cb(null, true);
  		});
  	});
  })
	.on('error', function(error){
	  console.log(error.message);
	})
  .on('close', function(){
    console.log('');
  })
	.on('end', function(count) {
    console.log('call end..............');
		callback(null, count);
	});
};

//importCsvToMySql('user', FIXTURES_DIR + 'user.csv', function(){});

var loadCsvDataToSql = function(callback) {
  console.log("  *** load data from csv ***  ");
  var files = fs.readdirSync(FIXTURES_DIR);

  async.eachSeries(files, function(filename, cb) {
    if (!/\.csv$/.test(filename)) {
      return cb();
    }

    var table = path.basename(filename, '.csv');
    importCsvToMySql(table, FIXTURES_DIR + filename, function(err, count) {
    	console.log(filename + '   >>   ' + table);
      cb(err);
    });
  }, function(err) {
    if (err) {
      console.log(err);
    }

    console.log('  *** load dta from csv completed ***  ');
    callback(null, true);
  });
};

var loadDataForRankingList = function(callback) {
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

      dao.player.create({data: data}, function(err, res) {
      	if (err) {
      		console.log(err);
      	}

      	dao.rank.create({data: {
      		playerId: id,
          createTime: Date.now(),
          ranking: id - 9999
      	}}, function(err, _res) {
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

var main = function() {
  var type = process.argv[2];
  var quenues = [];
  var start = Date.now();

  switch (type) {
    case 'csv': 
      quenues.push(loadCsvDataToSql); 
      break;
    case 'rank': 
      quenues.push(loadDataForRankingList); 
      break;
    default: 
      quenues.push(loadCsvDataToSql);
      quenues.push(loadDataForRankingList);
  }

  async.mapSeries(
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