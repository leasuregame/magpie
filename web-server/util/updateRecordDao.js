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
  userDb.query("select `version`, `created` from upgradeVersion where `version` = ?", args, cb);
};