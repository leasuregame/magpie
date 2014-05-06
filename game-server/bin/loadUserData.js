var async = require('async');
var path = require('path');
var Data = require('./data');
var _ = require('underscore');
var pomelo = require('pomelo');
var Mysql = require('../app/dao/mysql/mysql');
var app = pomelo.createApp({
  base: path.join(__dirname, '..')
});


app.set('env', process.argv[3] || 'development');
//app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
app.set('mysql', require('../config/mysql')[process.argv[3] || 'development']['userdb']);
app.set('dbClient', new Mysql(app));
var dao = require('../app/dao').init('mysql');
app.set('dao', dao);

var udata = new Data(dao);
var user_path = path.join(__dirname, '..', 'config', 'fixtures/', 'user.csv');
udata.importCsvToSql('user', user_path, function(err, res) {
  if (!err) {
    console.log('load user data complete, on ', Date.now());
    process.exit();
  }
});