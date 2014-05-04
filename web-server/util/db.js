var mysql = require('mysql');
var config = require('../../game-server/config/mysql');

var dbs = config['production'];

module.exports = function(areaId) {
  if (!dbs[areaId]) {
    throw new Error('can not find database configuration of area ' + areaId);
  }

  return {
    query: function(sql, args, cb) {
      var cfg = dbs[areaId];
      var connection = mysql.createConnection({
        host: cfg.host,
        port: cfg.port,
        user: cfg.user,
        password: cfg.password,
        database: cfg.database
      });

      //connection.connect();
      connection.query(sql, args, function(err, res) {
        connection.end();
        cb(err, res);
      });
    }
  }
};
