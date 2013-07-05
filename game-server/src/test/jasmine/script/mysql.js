var config = require('../../../config/mysql').development;
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : config.host,
  port     : config.port,
  user     : config.user,
  password : config.password,
  database : config.database
});

connection.connect();

var mysqlClient = module.exports;

mysqlClient.query = function(sql, args, cb){
  

  connection.query(sql, args, function(err, results) {
    if (err) {
      throw err;
    }

    cb(null, results);

    //connection.end();  
  });

};


