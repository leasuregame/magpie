var db = require('./db');
var async = require('async');

exports.getRecords = function(scope, cb) {
  var d = new Date(scope);
  var start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  var end = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1);

  var sql = 'select createTime as ct, qty from onlineUser where createTime between ' + start.getTime() + ' and ' + end.getTime();
  console.log(sql);
  db.query(sql, cb);
};