var sqlHelper = require("./sqlHelper");
var app = require("pomelo").app;
var dbClient = app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var Rank = require('../../domain/rank');
var _ = require('underscore');

var DEFAULT_RANK_INFO = {
	ranking: 0,
	counts: {
		challenge: 0,
		win: 0,
		lose: 0,
		winningStreak: 0
	}
};

var Dao = {
	createRank: function(param, cb) {
		if (typeof param == 'undefined') {
			return cb('Invalid parameters when create a rank', null);
		}

		var fields = _.clone(DEFAULT_RANK_INFO);
		_.extend(fields, param);
		var _ref = sqlHelper.insertSql("rank", fields);
		var sql = _ref[0];
		var args = _ref[1];

		return dbClient.insert(sql, args, function(err, res) {
			if (err) {
				logger.error("[rankDao.createRank faild] ", err.stack);

				return cb({
					code: err.code,
					msg: err.message
				}, null);
			} else {
				return cb(null, new Rank(
					_.extend({
						id: res.insertId
					}, fields)
				));
			}
		});
	},

	getRank: function(param, cb) {
		if (typeof param == 'undefined') {
			return cb('[Invalid parameters when get a rank] ' + JSON.stringify(param), null);
		}

		var _ref = sqlHelper.selectSql("rank", param);
		var sql = _ref[0], args = _ref[1];

		return dbClient.query sql, args, function(err, res) {
			if (err) {
				logger.error("[rankDao.getRank faild] ", err.stack);

				return cb({
					code: err.code,
					msg: err.message
				}, null);
			} else if (!!res && res.length == 1) {
				return cb(null, new Rank(res[0]));
			} else {
				return cb(null, {code: null, msg: 'can not find rank'})
			}
		};
	}, 

	updateRank: function(param, cb) {
		if (typeof (param.id) == "undefined" || typeof (param.data) == "undefined") {
		    return cb("param error", null);
		}

		var stm = sqlHelper.updateSql("user", {"id": param.id}, param.data);
		return dbClient.update(stm.sql, stm.args, function (err, res) {
		    if (err) {
		        logger.error("[userDao.updateUserById faild] ", err.stack);

		        return cb({
		            code: err.code,
		            msg: err.message
		        }, null);
		    } if (!!res && res.affectedRows > 0) {
		        return cb(null, true);
		    } else {
		        return cb(null, false);
		    }
		});
	}
};

module.exports = Dao;