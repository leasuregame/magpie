/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午4:18
 * To change this template use File | Settings | File Templates.
 */


var pomelo = require('pomelo');
var app = pomelo.createApp();
app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
app.set('dbClient', require('../../app/dao/mysql/mysql').init(app));
