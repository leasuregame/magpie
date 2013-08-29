/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午6:06
 * To change this template use File | Settings | File Templates.
 */


var pomelo = require('pomelo');
var app = pomelo.createApp();
var mysqlConfig = require('../../config/mysql1.json');
app.set('mysql', mysqlConfig.development['1']);
//app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
app.set('dbClient', require('../../app/dao/mysql/mysql').init(app));
var dao = require('../../app/dao').init('mysql');
app.set('dao', dao);
