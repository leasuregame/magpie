var userDb = require('./db/userDb');
var async = require('async');

exports.versionCounts = function(cb) {
  userDb.query('select count(id) as num, version from upgradeVersion group by  `version`', function(err, res) {
    cb(err, res);
  });
};

exports.period = function(version, cb) {
  var args = [];
  args.push(version);
  userDb.query("select max(created) as maxDate, min(created) as minDate from upgradeVersion where `version` = ?", args, function(err, res) {
    cb(err, res);
  });
};

exports.getByVersion = function(version, cb) {
  var args = [];
  args.push(version);
  userDb.query("select `version`, date(created) as created, count(id) as num from upgradeVersion where `version` = ? group by date(created)", args, function(err, res) {
    cb(err, res);
  });
};

exports.getUserCount = function(cb) {
  userDb.query('select count(*) as num from user', function(err, res) {
    cb(err, res);
  });
};