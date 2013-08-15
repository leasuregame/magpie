var async = require('async');
var path = require('path');
var Data = require('./data');
var _ = require('underscore');
var pomelo = require('pomelo');
var app = pomelo.createApp();

app.set('env', process.argv[3] || 'development');
//app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
app.set('mysql', require('../config/mysql1')[process.argv[3] || 'development']['userdb']);
app.set('dbClient', require('../app/dao/mysql/mysql').init(app));
var dao = require('../app/dao').init('mysql');
app.set('dao', dao);

var udata = new Data(dao);
var user_path = path.join(__dirname, '..', 'config', 'fixtures/', 'user.csv');
udata.importCsvToSql('user', user_path, function(err, res) {
  if (!err) {
    console.log('load user data complete.');
    process.exit();
  }
});