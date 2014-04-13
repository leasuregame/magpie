var async = require('async');
var path = require('path');
var Data = require('./data');
var _ = require('underscore');
var pomelo = require('pomelo');
var app = pomelo.createApp({
  base: path.join(__dirname, '..')
});

var genDao = function(key) {
  app.set('env', process.argv[2] || 'development');
  //app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
  app.set('mysql', require('../config/mysql')[process.argv[2] || 'development'][key]);
  app.set('dbClient', require('../app/dao/mysql/mysql').init(app));
  var dao = require('../app/dao').init('mysql');
  app.set('dao', dao);
  return dao;
};


var main = function() {
  var quenues = [];
  var start = Date.now();
  var gdata = new Data(genDao(1), path.join(__dirname, 'testData/'));

  quenues.push(gdata.dataForRanking);

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