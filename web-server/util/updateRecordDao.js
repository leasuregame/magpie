var userDb = require('./userDb');
var async = require('async');

exports.versionCounts = function(cb) {
  userDb.query('select count(id) as num, version from upgradeVersion group by  `version`', cb);
};

exports.period = function(version, cb) {
  var args = [];
  args.push(version);
  userDb.query("select max(created) as maxDate, min(created) as minDate from upgradeVersion where `version` = ?", args, cb);
};

exports.getByVersion = function(version, cb) {
  var args = [];
  args.push(version);
  userDb.query("select `version`, date(created) as created, count(id) as num from upgradeVersion where `version` = ? group by date(created)", args, cb);
};

exports.getUserCount = function(cb) {
  userDb.query('select count(*) as num from user', cb);
}