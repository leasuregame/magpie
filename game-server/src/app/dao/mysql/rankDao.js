var sqlHelper = require("./sqlHelper");
var app = require("pomelo").app;
var dbClient = app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var Rank = require('../../domain/rank');
var _ = require('underscore');

var DEFAULT_RANK_INFO = {
	honorPoint: 0,
	title: '',
	rank: 1,
	ranking: 0,
	counts: {
		challenge: 0,
		win: 0,
		lose: 0,
		winningStreak: 0
	}
};

var createNewRank = function (rankInfo) {
    var rank = new Rank(rankInfo);

    rank.on('save', function (cb) {
        var id = rank.id;
        app.get('sync').exec(
            'rankSync.updateRank', 
            id,
            {
                id: id,
                data: rank.getSaveData(),
                cb: cb
            }
        );
    });
    return rank;
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

		var stm = sqlHelper.selectSql("rank", param);
		return dbClient.query(stm.sql, stm.args, function(err, res) {
			if (err) {
				logger.error("[rankDao.getRank faild] ", err.stack);

				return cb({
					code: err.code,
					msg: err.message
				}, null);
			} else if (!!res && res.length == 1) {
				return cb(null, createNewRank(res[0]));
			} else {
				return cb(null, {code: null, msg: 'can not find rank'})
			}
		});
	}, 

	top10: function(cb) {
		var sql = 'select * from rank order by ranking limit 10';
		return dbClient.query(sql, [], function(err, res){
            if (err) {
                logger.error('[rankDao.top10 faild]', err.stack);
                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            }

            if (!!res && res.length > 0) {
                var rankList = res.map(function(data) {
                    return new Rank(data);
                });
                return cb(null, rankList);
            } else {
                return cb(null, []);
            }
        }); 
	},

	select: function(where, cb) {
		var sql = 'select * from rank ' + (where !== '' ? 'where ' + where : '');
		console.log(sql);
		return dbClient.query(sql, [], function(err, res){
        if (err) {
            logger.error('[rankDao.select faild]', err.stack);
            return cb({
                code: err.code,
                msg: err.message
            }, null);
        }

        if (!!res && res.length > 0) {
            var rankList = res.map(function(data) {
                return createNewRank(data);
            });
            return cb(null, rankList);
        } else {
            return cb(null, []);
        }
    }); 
	}, 

  updateRanks: function(param, cb) {
    var sql = 'call exchangeRankings (' + [
        param.player.id, 
        param.target.id,
        param.player.ranking,
        param.target.ranking
      ].toString() + ')';
    return dbClient.query(sql, [], function(err, res) {
      if (err) {
        logger.error('[rankDao.select faild]', err.stack);
        return cb({
            code: err.code,
            msg: err.message
        }, null);
      }

      if (!!res) {
        return cb(null, res);
      }
    });
  }

};

module.exports = Dao;