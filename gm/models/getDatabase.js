/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-26
 * Time: 下午6:36
 * To change this template use File | Settings | File Templates.
 */


var mysql = require('mysql');



var getDatabase = function(key) {

    var mysqlConfig = require('../config/mysql1.json');
    var env = "development";

    var val = mysqlConfig;
    if (mysqlConfig[env] && mysqlConfig[env][key]) {
        val = mysqlConfig[env][key];
    }

    return val;

};


module.exports = getDatabase;
