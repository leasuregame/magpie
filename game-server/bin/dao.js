var async = require('async');
var path = require('path');
var Data = require('./data');
var _ = require('underscore');
var pomelo = require('pomelo');
var Mysql = require('../app/dao/mysql/mysql');
var app = pomelo.createApp({
  base: path.join(__dirname, '..')
});

var genDao = function(key) {
  app.set('env', process.argv[3] || 'development');
  //app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
  app.set('mysql', require('../config/mysql')[process.argv[3] || 'development'][key]);
  app.set('dbClient', new Mysql(app));
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
      break;
    case 'fix-duplicate-ranking': 
      quenues.push(gdata.fixDuplicateRanking);
      break;
    case 'reset-ranking': 
      quenues.push(gdata.resetRanking);
      break;
    case 'change-card-tableid': 
      quenues.push(gdata.correctCardTableId);
      break;
    case 'change-card-book': 
      quenues.push(gdata.correctCardBook);
      break;
    case 'change-card-ps': 
      quenues.push(gdata.changeCardPassiveSkill);     
      break;
    case 'fix-elixir': 
      quenues.push(gdata.fixPlayerElixir);
      break;
    case 'save-player': 
      quenues.push(gdata.savePalyerData);
      break;
    case 'save-card': 
      quenues.push(gdata.saveCardData);
      break;
    case 'read-data': 
      quenues.push(gdata.readData);
      break;
    case 'add-elixir-back': 
      quenues.push(gdata.addElixirToCard);
      break;
    default:
      console.log('not cmd execute!');
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