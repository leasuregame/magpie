/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */
/*
 * card dao
 *
 * create
 * update
 * select
 * delete
 * */
var Card = require("../../domain/entity/card");
var async = require('async');
var DaoBase = require("./daoBase");
var dbClient = require('./mysql');
var utility = require("../../common/utility");

var CardDao = (function(_super) {
	utility.extends(CardDao, _super);

	function CardDao() {
		CardDao.__super__.constructor.apply(this, arguments);
	}

	CardDao.table = 'card';
	CardDao.domain = Card;
	CardDao.syncKey = 'cardSync.updateCardById';

	CardDao.getCardInfo = function(options, cb) {
		var _this = this;
		async.parallel([
			function(callback) {
				_this.fetchOne(options, callback);
			}
		], function(err, results) {
			if (err !== null) {
				return cb(err, null)
			}

			var card = results[0];
			return cb(null, card);
		});
	};

	CardDao.getCards = function(options, cb) {
		var _this = this;

		async.waterfall([
			function(callback) {
				_this.fetchMany(options, callback);
			},
			function(cards, callback) {
                return cb(null, cards);
			}
		]);
	};

    CardDao.deleteExploreCards = function(pid,cb){
        var sql = "delete from card where playerId = ? and lv < ?";
        console.log(sql);
        var args = [pid,11];
        dbClient.query(sql,args,function(err,res){
            if(err) {
                //logger.error("[SQL ERROR, when delete cards]", err.stack);
                return cb({
                    code: err.code,
                    msg: err.message
                });
            }
            if (!!res && res.affectedRows > 0) {
                console.log(res.affectedRows);
                return cb(null, true);
            } else {
                return cb(null, false);
            }
        })
    }

	return CardDao;
})(DaoBase);

module.exports = CardDao;