var db = require('./db');
var async = require('async');

exports.insert = function(rows, cb) {
	async.map(rows, function(row, done) {
		db.query('insert into cdkey set ?', row, done);
	}, cb);
};

exports.totalCount = function(options, cb) {
  var _ref = genWhere(options), where = _ref[0], args = _ref[1];
  db.query('select count(*) as totalCount from cdkey ' + where, args, function(err, res) {
    if (err) {
      console.log(err);
      return cb(err);
    }

    if (!!res && res.length > 0) {
      return cb(null, res[0].totalCount);
    } else {
      return cb(null, 0);
    }
  });
};

exports.search = function(text, cb) {
  var sql = "select c.* from cdkey c join player p on p.id = c.playerId where p.name = ? \
    union \
    select * from cdkey where code = ? \
  ";
  var args = [text, text, text, text];

  if (new Date(text).toString() != 'Invalid Date') {
    sql += 'union select * from cdkey where startDate = ? or endDate = ?';
    args.push(text);
  }

  db.query(sql, args, cb);
};

exports.query = function(options, limitStart, limitCount, cb) {
  if (!options) {
    options = {};
  }
  var _ref = genWhere(options), where = _ref[0], args = _ref[1];
  var limit = '';
  if (limitStart != null) {
    limit += ' limit ' + limitStart;
  }
  if (limitCount) {
    limit += ', ' + limitCount;
  }

  var sql = 'select * from cdkey ' + where + ' order by startDate ' + limit;
  console.log(sql);
  db.query(sql, args, cb);
};

var genWhere = function(options) {
  var where = '    ', args = [];
  for (var n in options) {
    where += ' where `' + n + '` = ? and ';
    args.push(options[n]);
  }
  return [where.slice(0, -4), args];
};