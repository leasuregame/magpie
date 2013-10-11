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
var friendDao = require('./friendDao');
var async = require('async');
var dbClient = require('pomelo').app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);

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
        var player, cards, rank;
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
            },
            function(res, callback) {
                rank = res;
                friendDao.getFriends(player.id, callback);
            }
        ], function(err, friends) {
            if (err !== null) {
                return cb(err, null);
            }

            player.addCards(cards);
            player.set('rank', rank);
            player.set('friends', friends);
            return cb(null, player);
        });
    };

    PlayerDao.getPlayerDetails = function(ids, cb) {
        var start = Date.now();
        var _this = this;

        async.parallel([
            function(callback) {
                _this.fetchMany({
                    where: " id in (" + ids.toString() + ")",
                    fields: ['id', 'name', 'lv', 'ability', 'lineUp']
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

        ], function(err, results) {
            if (err !== null) {
                return cb(err, null);
            }

            var players = results[0];
            var cards = results[1];
            var ranks = results[2];




            players.forEach(function(p){
                p.addCards(cards.filter(function(c){ return c.playerId == p.id}));

                _ranks = ranks.filter(function(r) { return r.playerId == p.id});
                if (_ranks.length > 0) {
                    p.set('rank', _ranks[0]);
                }
            });
            var end = Date.now();
            console.log('get player details time: ', (end - start)/1000);
            return cb(null, players);
        });

    };

    PlayerDao.orderByRanking = function(limit, cb) {
        var sql = 'select p.id, p.name, p.lv, p.ability, r.ranking from player as p \
            join rank as r on r.playerId = p.id \
            order by r.ranking \
            limit ' + limit;

        dbClient.query(sql, [], function(err, res) {
            if (err) {
                logger.error('[SQL OERROR, when fetch player order by ranking]');
                logger.error(err.stack);
            }

            if (!!res && res.length > 0) {
                return cb(null, res);
            } else {
                return cb(null, []);
            }
        });
    };

    PlayerDao.orderBy = function (orderby, limit, cb) {
        var sql = 'select id, name, lv, ability from player \
            order by ' + orderby + ' limit ' + limit;

        dbClient.query(sql, [], function(err, res) {
            if (err) {
                logger.error('[SQL OERROR, when fetch player order by ' + orderby + ']');
                logger.error(err.stack);
            }

            if (!!res && res.length > 0) {
                return cb(null, res);
            } else {
                return cb(null, []);
            }
        });
    };

    return PlayerDao;
})(DaoBase);

module.exports = PlayerDao;