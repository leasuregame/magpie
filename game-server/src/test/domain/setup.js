/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午6:06
 * To change this template use File | Settings | File Templates.
 */


var pomelo = require('pomelo');
var app = pomelo.createApp();
var dao = require('../../app/dao').init('mysql');

app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
var dbClient = require('../../app/dao/mysql/mysql').init(app);
app.set('dbClient', dbClient);
app.load(pomelo.sync, {path: __dirname + '/../../app/dao/mysql/mapping', dbclient: dbClient, interval: 500});
app.set('dao', dao);
