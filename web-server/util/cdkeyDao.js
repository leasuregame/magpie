var db = require('./db');
var async = require('async');

exports.insert = function(rows, cb) {
	async.map(rows, function(row, done) {
		console.log(row);
		db.query('insert into cdkey set ?', row, done);
	}, cb);
};

exports.query = function(options, cb) {

};