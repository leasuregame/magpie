var db = require('./db/db');
var async = require('async');

exports.getRecords = function(scope, areaId, cb) {
  if (arguments.length == 2) {
    cb = areaId;
    areaId = 1;
  }

  var d = new Date(parseInt(scope) || scope);
  var start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  var end = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1);
  console.log(scope, areaId, d, start, end);
  var sql = 'select createTime as ct, qty from onlineUser where \
    createTime between ' + start.getTime() + ' and ' + end.getTime();
  //console.log(sql);
  db(areaId).query(sql, cb);
};