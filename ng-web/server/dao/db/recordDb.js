
var sqlite3 = require('sqlite3').verbose();
var DB_PATH = './sqlite/webServDb.sqlite';

exports.query = function(sql, cb) {

    var conn = new sqlite3.Database(DB_PATH);
    conn.all(sql, function(err, res){
        conn.close();
        cb(err, res);
    });
};

exports.insert = function(table, fields, cb) {

    var conn = new sqlite3.Database(DB_PATH);
    var count = fields.length;
    var placeholder = '';
    for(var i = 0; i < count; i++) {
        placeholder += '?,';
    }
    placeholder = placeholder.substr(0, placeholder.length - 1);
    conn.serialize(function(){
        var stmt = conn.prepare("INSERT INTO " + table + " VALUES (" + placeholder + ")");
        if(fields[0] instanceof Array) {
            for(var i in fields) {
                stmt.run(fields[i]);
            }
        } else {
            stmt.run(fields);
        }
        stmt.finalize(cb);
    });
    conn.close();
};