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
			},
			function(callback) {
				passiveSkillDao.fetchMany({
					where: {
						cardId: options.where.id
					},
					sync: options.sync
				}, callback);
			}
		], function(err, results) {
			if (err !== null) {
				return cb(err, null)
			}

			var card = results[0];
			var pss = results[1];

			//card.addPassiveSkills(pss);
            card.passSkills = pss;
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

				passiveSkillDao.fetchMany({
					sync: options.sync,
					where: ' cardId in (' + ids.toString() + ')'
				}, function(err, pss) {
					if (err) {
						return cb(err);
					}
                   /* var id = 0;
                    var data = new Array();
                    for(var i = 0;i < cards.length;i++) {
                        passiveSkillDao.fetchMany({
                            where: {
                                cardId: cards[i].id
                            },
                            sync: options.sync
                        }, function(err,passSkills){
                            // console.log(card);
                            //console.log(passSkills);
                           // console.log(i);
                            var card = cards[id];
                            card["passSkills"] = passSkills;
                            data[id] = card;
                           // console.log(data[id]);
                            id++;
                        });
                    }
                    /*
					cards.forEach(function(card) {
						var _pss = _.where(pss, {
							cardId: card.id
						});

                        passiveSkillDao.fetchMany({
                            where: {
                                cardId: card.id
                            },
                            sync: options.sync
                        }, function(err,passSkills){
                           // console.log(card);
                            card["passSkills"] = passSkills;
                          //  console.log(card);
                        });
						/*if (_pss !== null) {
                            console.log(card);
                            var c = Card(card);
							c.addPassiveSkills(_pss);
						}


					});
                    */
                    //console.log(pss);
                    for(var i = 0;i < cards.length;i++) {
                        cards[i].passSkills = [];
                        for(var j = 0;j < pss.length;j++)
                            if(cards[i].id == pss[j].cardId) {
                                cards[i].passSkills.push(pss[j]);
                            }
                    }
                  //  console.log(cards);
					return cb(null, cards);
				});

			}
		]);
	};

	return CardDao;
})(DaoBase);

module.exports = CardDao;