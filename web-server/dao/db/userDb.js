var mysql = require('mysql');
var config = require('../../../game-server/config/mysql');

var cfg = config['production']['userdb'];

exports.query = function(sql, args, cb) {
    var connection = mysql.createConnection({
        host: cfg.host,
        port: cfg.port,
        user: cfg.user,
        password: cfg.password,
        database: cfg.database
    });

    //connection.connect();
    connection.query(sql, args, function(err, res){
        cb(err, res);
    });
    connection.end();
};
