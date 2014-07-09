var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var DB_PATH = path.join(__dirname, '..', 'sqlite');

/*
 * 创建web-server 所用 sqlite3 数据库
 */

var DB_FILE_NAME = 'webServDb.sqlite';

fs.exists(DB_PATH, function(exists){
    if(!exists) {
        fs.mkdirSync(DB_PATH);
    }
    var db = new sqlite3.Database(path.join(DB_PATH, DB_FILE_NAME));
    db.serialize(function(){
        // 创建"发放奖励"记录表
        db.exec('CREATE TABLE IF NOT EXISTS "optionRecord" (' +
            '"id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
            '"operator"  TEXT(64) DEFAULT NULL,' +
            '"areaIds"  TEXT(128),"playerNames"  TEXT(1024),' +
            '"options"  TEXT(1024) DEFAULT NULL,' +
            '"status"  INTEGER DEFAULT NULL,' +
            '"createTime"  INTEGER DEFAULT NULL,' +
            '"type"  INTEGER DEFAULT NULL' +
            ');');
    });
});






