
var sqlite3 = require('sqlite3').verbose();
var DB_PATH = './sqlite/webServDb.sqlite';

exports.query = function(sql, cb) {

    var conn = new sqlite3.Database(DB_PATH);
    conn.all(sql, function(err, res){
        conn.close();
        cb(err, res);
    });
};

exports.insert = function(table, rows, cb) {

    var conn = new sqlite3.Database(DB_PATH);
    conn.serialize(function(){
        var stmt = conn.prepare("INSERT INTO " + table + " VALUES (?, ?, ?, ?, ?, ?, ?)");
        if(rows[0] instanceof Array) {
            for(var i in rows) {
                stmt.run(rows[i]);
            }
        } else {
            stmt.run(rows);
        }
        stmt.finalize(cb);
    });
};