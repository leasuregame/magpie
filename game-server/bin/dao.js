var async = require('async');
var path = require('path');
var Data = require('./data');
var _ = require('underscore');
var pomelo = require('pomelo');
var app = pomelo.createApp({
  base: path.join(__dirname, '..')
});

var genDao = function(key) {
  app.set('env', process.argv[3] || 'development');
  //app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
  app.set('mysql', require('../config/mysql')[process.argv[3] || 'development'][key]);
  app.set('dbClient', require('../app/dao/mysql/mysql').init(app));
  var dao = require('../app/dao').init('mysql');
  app.set('dao', dao);
  return dao;
};


var main = function() {
  var type = process.argv[2];
  var areaId = parseInt(process.argv[4] || 1);
  var quenues = [];
  var start = Date.now();
  var gdata = new Data(genDao(areaId));


  switch (type) {
    case 'csv':
      quenues.push(gdata.loadCsvDataToSql);
      break;
    case 'rank':
      quenues.push(gdata.loadDataForRankingList);
      break;
    case 'delete-unused-cards':
      quenues.push(gdata.deleteUnUsedCards);
    case 'fix-duplicate-ranking': 
      quenues.push(gdata.fixDuplicateRanking);
    case 'reset-ranking': 
      quenues.push(gdata.resetRanking);
    case 'change-card-tableid': 
      quenues.push(gdata.correctCardTableId);
    case 'change-card-book': 
      quenues.push(gdata.correctCardBook);
    case 'change-card-ps': 
      quenues.push(gdata.changeCardPassiveSkill);     
    case 'fix-elixir': 
      quenues.push(gdata.fixPlayerElixir);
    default:
      quenues.push(gdata.loadCsvDataToSql);
      quenues.push(gdata.loadDataForRankingList);
  }

  async.mapSeries(
    quenues,
    function(fn, cb) {
      fn.call(gdata, cb);
    },
    function(err, results) {
      var end = Date.now();
      console.log('time: ' + (end - start) / 1000 + 's');
      console.log('finished on:', Date.now());
      if (_.every(results)) {
        process.exit();
      }
    }
  );
};

main();