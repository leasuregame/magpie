var db = require('./db');
var async = require('async');

exports.insert = function(rows, cb) {
	async.map(rows, function(row, done) {
		console.log(row);
		db.query('insert into cdkey set ?', row, done);
	}, cb);
};

exports.query = function(options, cb) {
  if (!options) {
    options = {};
  }
  var where = '    ', args = [];
  for (var n in options) {
    where += '`' + n + '` = ? and ';
    args.push(options[n]);
  }

  var sql = 'select * from cdkey ' + where.slice(0, -4);
  db.query(sql, args, cb);
};