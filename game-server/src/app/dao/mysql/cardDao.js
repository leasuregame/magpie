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
var table = require('../../manager/table');

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
			if (err != null) {
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
		if (typeof options.data.tableId == 'undefined') {
			var star = options.data.star;
			var item = table.getTable('resource_cards').findOne(function(id, row) {
				return parseInt(row.star) == parseInt(star);
			});
	    var exp = item.exp || 0
	    var tableId = item.id || (configData.card.EXP_CARD_ID + star);

	    options.data.exp = exp;
	    options.data.tableId = tableId;
	  }

		return CardDao.create(options, cb);
	};

	CardDao.totalCount = function(cb) {
		dbClient.query('select count(id) as num from card where tableId != 30000', function(err, res) {
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
		dbClient.query('select id, tableId from card where tableId != 30000 order by id limit ' + limit, function(err, res) {
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