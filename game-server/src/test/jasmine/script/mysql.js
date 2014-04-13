var config = require('../../../config/mysql').development;
var magpie_area_1 = config[1];
var magpie_area_2 = config[2];
var userdbConfig = config['userdb'];
var mysql = require('mysql');
var exp = module.exports;

var m1Conn = mysql.createConnection({
  host: magpie_area_1.host,
  port: magpie_area_1.port,
  user: magpie_area_1.user,
  password: magpie_area_1.password,
  database: magpie_area_1.database
});
m1Conn.connect()

exp.magpiedb1 = m1Conn;

// var m2Conn = mysql.createConnection({
//   host: magpie_area_2.host,
//   port: magpie_area_2.port,
//   user: magpie_area_2.user,
//   password: magpie_area_2.password,
//   database: magpie_area_2.database
// });
// m2Conn.connect()

// exp.magpiedb2 = m2Conn;


var userConn = mysql.createConnection({
  host: userdbConfig.host,
  port: userdbConfig.port,
  user: userdbConfig.user,
  password: userdbConfig.password,
  database: userdbConfig.database
});
userConn.connect()

exp.userdb = userConn;
