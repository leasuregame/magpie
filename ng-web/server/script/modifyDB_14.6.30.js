var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var DB_PATH = path.join(__dirname, '..', 'sqlite');

/*
 * 修改sqlite中表结构
 */

var DB_FILE_NAME = 'webServDb.sqlite';

var DB_FILE_PATH = path.join(DB_PATH, DB_FILE_NAME);

fs.exists(DB_FILE_PATH, function(exists){
    if(!exists) {
        console.log('db does not existed, please run "initDB"');
        return;
    }
    var db = new sqlite3.Database(path.join(DB_PATH, DB_FILE_NAME));
    db.serialize(function(){
        // 创建"发放奖励"记录表
        db.exec('ALTER TABLE sendRewardRecord ADD COLUMN type INTEGER DEFAULT NULL');
        db.exec('UPDATE sendRewardRecord SET type = 1');
        db.exec('ALTER TABLE sendRewardRecord RENAME TO optionRecord');

        console.log('finished all');
    });
});






