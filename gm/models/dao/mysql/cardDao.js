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
var passiveSkillDao = require('./passiveSkillDao');
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
			/*function(callback) {
				passiveSkillDao.fetchMany({
					where: {
						cardId: options.where.id
					},
					sync: options.sync
				}, callback);
			}*/
		], function(err, results) {
			if (err !== null) {
				return cb(err, null)
			}

			var card = results[0];
			//var pss = results[1];

			//card.addPassiveSkills(pss);
            //card.passSkills = pss;
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
				/*var ids = cards.map(function(c) {
					return c.id;
				});

				if (ids.length == 0) {
					return cb(null, []);
				}

				passiveSkillDao.fetchMany({
					sync: options.sync,
					where: ' cardId in (' + ids.toString() + ')'
				}, function(err, pss) {
					if (err) {
						return cb(err);
					}

                    for(var i = 0;i < cards.length;i++) {
                        cards[i].passSkills = [];
                        for(var j = 0;j < pss.length;j++)
                            if(cards[i].id == pss[j].cardId) {
                                cards[i].passSkills.push(pss[j]);
                            }
                    }
                  //  console.log(cards);

				});
                */
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