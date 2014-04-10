var async = require('async');
var path = require('path');
var Data = require('../../bin/data');
var _ = require('underscore');
var pomelo = require('pomelo');
var app = pomelo.createApp({
  base: path.join(__dirname, '..', '..')
});

app.set('env', process.argv[2] || 'development');
//app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
app.set('mysql', require('../../config/mysql')[process.argv[2] || 'development']['userdb']);
app.set('dbClient', require('../../app/dao/mysql/mysql').init(app));
var dao = require('../../app/dao').init('mysql');
app.set('dao', dao);

var udata = new Data(dao, path.join(__dirname, '..'));
var areaId = process.argv[3] || 1;
udata.loadRobotUser(areaId, function(err, res) {
	if (!err) {
		console.log('load robot user complete.');
		process.exit();
	}
});

// var user_path = path.join(__dirname, 'csv', 'user.csv');
// udata.importCsvToSql('user', user_path, function(err, res) {
// 	if (!err) {
// 		console.log('load user data complete, on ', Date.now());
// 		udata.dataForRankingUser(function(err, res) {
// 			console.log('rank user complete');
// 			process.exit();
// 		});
// 		//process.exit();
// 	}
// });