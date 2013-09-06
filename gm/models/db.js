/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-24
 * Time: 下午5:26
 * To change this template use File | Settings | File Templates.
 */


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data/userData.sqlite3');

module.exports = db;