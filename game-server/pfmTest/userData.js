var async = require('async');
var path = require('path');
var Data = require('./data');
var _ = require('underscore');
var pomelo = require('pomelo');
var app = pomelo.createApp({
  base: path.join(__dirname, '..')
});

app.set('env', process.argv[2] || 'development');
//app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
app.set('mysql', require('../config/mysql')[process.argv[2] || 'development']['userdb']);
app.set('dbClient', require('../app/dao/mysql/mysql').init(app));
var dao = require('../app/dao').init('mysql');
app.set('dao', dao);

var udata = new Data(dao);
udata.dataForRankingUser(function(err, res) {
	console.log('rank user complete');
	process.exit();
});
//process.exit();