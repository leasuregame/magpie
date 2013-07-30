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
var Card = require("../../domain/card");
var passiveSkillDao = require('./passiveSkillDao');
var async = require('async');
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var CardDao = (function (_super) {
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
            function (callback) {
                _this.fetchOne(options, callback);
            },
            function (callback) {
                passiveSkillDao.fetchMany({
                    where: {cardId: options.where.id},
                    sync: options.sync
                }, callback);
            }
        ], function (err, results) {
            if (err !== null) {
                return cb(err, null)
            }

            var card = results[0];
            var pss = results[1];

            card.addPassiveSkill(pss);
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
                var cardList = [];
                async.each(cards, function (card, done) {
                    passiveSkillDao.fetchMany({sync: options.sync, where: {cardId: card.id}}, function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        if (!!res && res.length > 0){
                            card.addPassiveSkills(res)
                        }
                        cardList.push(card);
                        return done();
                    });
                }, function(err) {
                    if (err) {
                        return cb(err, null)
                    } else {
                        return cb(null, cardList)
                    }
                });
            }
        ]);
    };

    return CardDao;
})(DaoBase);

module.exports = CardDao;