var mysql = require('mysql');
var config = require('../../../game-server/config/mysql');

var cfg = config['production']['userdb'];

var connection = mysql.createConnection({
  host: cfg.host,
  port: cfg.port,
  user: cfg.user,
  password: cfg.password,
  database: cfg.database
});

exports.query = function(sql, args, cb) {
  //connection.connect();
  connection.query(sql, args, cb);
  //connection.end();
};
