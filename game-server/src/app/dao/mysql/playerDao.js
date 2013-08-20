/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * player dao
 *
 * create
 * update
 * select
 * delete
 * */
var Player = require("../../domain/entity/player");
var cardDao = require("./cardDao");
var rankDao = require("./rankDao");
var passiveSkillDao = require("./passiveSkillDao")
var async = require('async');

var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var PlayerDao = (function(_super) {
    utility.extends(PlayerDao, _super);

    function PlayerDao() {
        PlayerDao.__super__.constructor.apply(this, arguments);
    }

    PlayerDao.table = 'player';
    PlayerDao.domain = Player;
    PlayerDao.syncKey = 'playerSync.updatePlayerById';

    PlayerDao.getPlayerInfo = function(options, cb) {
        var _this = this;
        var player, cards;
        async.waterfall([
            function(callback) {
                _this.fetchOne(options, callback);
            },
            function(res, callback) {
                player = res;
                cardDao.getCards({
                    sync: options.sync,
                    where: {
                        playerId: player.id
                    }
                }, callback);
            },
            function(res, callback) {
                cards = res;
                rankDao.fetchOne({
                    sync: options.sync,
                    where: {
                        playerId: player.id
                    }
                }, function(err, res) {
                    if (err && err.code == 404) {
                        return callback(null, null);
                    }
                    return callback(null, res);
                });
            }
        ], function(err, rank) {
            if (err !== null) {
                return cb(err, null);
            }

            player.addCards(cards);
            player.set('rank', rank);
            return cb(null, player);
        });
    };

    PlayerDao.getPlayerDetails = function(ids, cb) {
        var _this = this;

        async.parallel([
            function(callback) {
                _this.fetchMany({
                    where: " id in (" + ids.toString() + ")"
                }, callback);
            },
            function(callback) {
                cardDao.fetchMany({
                    where: ' playerId in (' + ids.toString() + ')'
                }, callback);
            },
            function(callback) {
                rankDao.fetchMany({
                    where: ' playerId in (' + ids.toString() + ')'
                }, callback);
            },
            function(callback) {
                passiveSkillDao.query(
                    "select p.* from passiveSkill p join card c on c.id = p.cardId where c.playerId in (" + ids.toString() + ")",
                    [],
                    callback
                );
            }
        ], function(err, results) {
            if (err !== null) {
                return cb(err, null);
            }

            var players = results[0];
            var cards = results[1];
            var ranks = results[2];
            var passiveSkills = results[3];

            cards.forEach(function(c) {
                c.addPassiveSkills(passiveSkills.filter(function(ps){
                    return ps.cardId == c.id;
                }));
            });

            players.forEach(function(p){
                p.addCards(cards.filter(function(c){ return c.playerId == p.id}));

                _ranks = ranks.filter(function(r) { return r.playerId == p.id});
                if (_ranks.length > 0) {
                    p.set('rank', _ranks[0]);
                }
            });

            return cb(null, players);
        });

    };

    return PlayerDao;
})(DaoBase);

module.exports = PlayerDao;