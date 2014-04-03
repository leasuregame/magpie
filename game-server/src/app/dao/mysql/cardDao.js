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

var dbClient = require('pomelo').app.get('dbClient');
var Card = require("../../domain/entity/card");
//var passiveSkillDao = require('./passiveSkillDao');
var async = require('async');
var DaoBase = require("./daoBase");
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
			} */
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
				var ids = cards.map(function(c) {
					return c.id;
				});

				if (ids.length == 0) {
					return cb(null, []);
				}

        return cb(null, cards);
			}
		]);
	};

	CardDao.createExpCard = function(options, cb) {
		var exp_card_id = require('../../../config/data').card.EXP_CARD_ID;

		return CardDao.create({data: {
			playerId: options.data.playerId,
			tableId: exp_card_id,
			star: 1,
			lv: options.data.lv || 1,
			exp: options.data.exp || 0
		}}, cb);
	};

	CardDao.totalCount = function(cb) {
		dbClient.query('select count(id) as num from card where tableId = tableId_old and tableId < 2000', function(err, res) {
			if (err) {
				console.log('[sql error] when select count form card', err);
			}

			if (!!res && res.length > 0) {
				cb(null, res[0].num);
			} else {
				cb(null, 0);
			}
		});
	};

	CardDao.selectForUpdate = function(limit, cb) {
		dbClient.query('select id, tableId from card where tableId = tableId_old and tableId < 2000 order by id limit ' + limit, function(err, res) {
			if (err) {
				console.log('[sql error]', err);
			}

			if (!!res && res.length > 0) {
				cb(null, res);
			} else {
				cb(null, []);
			}
		});
	}

	return CardDao;
})(DaoBase);

module.exports = CardDao;