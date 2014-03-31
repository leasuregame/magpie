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
var goldCardDao = require('./goldCardDao');
var bossFriendRewardDao = require('./bossFriendRewardDao');
var async = require('async');
var dbClient = require('pomelo').app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);

var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var util = require('util');

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
        var player, cards, rank, friends, goldCards;
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
            },
            function(res, callback) {
                friends = res;
                goldCardDao.getValidCards(player.id, callback);
            },
            function(res, callback) {
                goldCards = res;
                bossFriendRewardDao.exists({
                    where: {
                        playerId: player.id,
                        got: 0
                    }
                }, callback);
            }
        ], function(err, hasFriendReward) {
            if (err !== null) {
                return cb(err, null);
            }

            player.addCards(cards);
            player.set('rank', rank);
            player.set('friends', friends);
            player.addGoldCards(goldCards);
            player.hasFriendReward = hasFriendReward;
            return cb(null, player);
        });
    };

    PlayerDao.getPlayerDetails = function(ids, cb) {
        var start = Date.now();
        var _this = this;

        var players = null;
        var cards = null;
        var ranks = null;

        async.waterfall([

            function(callback) {
                _this.fetchMany({
                    where: " id in (" + ids.toString() + ")",
                    fields: ['id', 'name', 'lineUp']
                }, function(err, plys) {
                    players = plys;
                    callback();
                });
            },
            function(callback) {
                var cardIds = [];
                players.forEach(function(p) {
                    // cardIds = _.union(cardIds, p.lineUp.reduce(function(pre, cur) {
                    //     return pre.concat(_.values(cur));
                    // }, []));
                    cardId = cardIds.concat(_.values(p.lineUp[0]) || []);
                });
                callback(null, cardIds);
            },
            function(cardIds, callback) {
                cardDao.fetchMany({
                    where: ' id in (' + cardIds.toString() + ')',
                    fields: ['playerId', 'tableId']
                }, function(err, res) {
                    cards = res;
                    callback();
                });
            },
            function(callback) {
                rankDao.fetchMany({
                    where: ' playerId in (' + ids.toString() + ')'
                }, function(err, res) {
                    ranks = res;
                    callback();
                });
            }
        ], function(err) {

            players.forEach(function(p) {
                p.addCards(cards.filter(function(c) {
                    return c.playerId == p.id
                }));

                _ranks = ranks.filter(function(r) {
                    return r.playerId == p.id
                });
                if (_ranks.length > 0) {
                    p.set('rank', _ranks[0]);
                }
            });
            var end = Date.now();
            return cb(null, players);
        });

    };

    PlayerDao.getLineUpInfoByIds = function(ids, cb) {
        var start = Date.now();
        var end;
        var players = null;
        var cards = null;

        async.waterfall([

            function(callback) {
                var sql = "select id,name,lineUp,ability from player where id in (" + ids.toString() + ")";
                dbClient.query(sql, [], function(err, plys) {
                    players = plys;
                    callback();
                });
            },
            function(callback) {
                var cardIds = [];
                players.forEach(function(p) {
                    cardIds = cardIds.concat(_.without(getLineUpIds(p.lineUp), -1));
                });
                cardIds.sort(sort);
                callback(null, cardIds);
            },
            function(cardIds, callback) {
                if (cardIds.length != 0) {
                    var sql = "select playerId, tableId, star from card where id in (" + cardIds.toString() + ")";
                    dbClient.query(sql, [], function(err, res) {
                        cards = res;
                        callback();
                    });
                } else
                    callback();
            }
        ], function(err) {
            if (cards)
                players.forEach(function(p) {
                    p.cards = cards.filter(function(c) {
                        return c.playerId == p.id
                    });
                });
            end = Date.now();
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

            if ( !! res && res.length > 0) {
                return cb(null, res);
            } else {
                return cb(null, []);
            }
        });
    };

    PlayerDao.orderBy = function(orderby, limit, cb) {
        orderBy(null, orderby, limit, cb);
    };

    PlayerDao.orderByLayer = function(limit, cb) {
        orderBy(
            ['id', 'name', 'ability', 'passLayer'],
            'passLayer DESC, ability DESC',
            limit,
            cb
        );
    };

    PlayerDao.getLineUpInfo = function(playerId, done) {
        var _this = this;

        async.waterfall([

            function(cb) {
                _this.fetchOne({
                    where: {
                        id: playerId
                    },
                    fields: ['id', 'lineUp', 'spiritor', 'vip']
                }, cb);
            },
            function(player, cb) {
                var ids = player.activeCardIds();
                if (!_.isEmpty(ids)) {
                    cardDao.fetchMany({
                        where: ' id in (' + ids.toString() + ')'
                    }, function(err, cards) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, player, cards);
                        }
                    });
                } else {
                    logger.warn('line up cards is empty')
                    cb(null, player, []);
                }
            },
            function(player, cards, cb) {
                rankDao.fetchOne({
                    where: {
                        playerId: player.id
                    }
                }, function(err, r) {
                    if (err) {
                        if (err.code == 404) {
                            player.rankStats = {
                                avgWinRate: "0.0%",
                                beChallengeCount: 0,
                                challengeCount: 0,
                                historyRanking: 0,
                                loseCount: 0,
                                winCount: 0,
                                winStreakCount: 0,
                                winningStreak: 0
                            };
                            cb(null, player, cards);
                        } else {
                            cb(err);
                        }
                    } else {
                        player.rankStats = r.stats();
                        cb(null, player, cards);
                    }
                });
            }
        ], function(err, player, cards) {
            if (err) {
                done(err);
            } else {
                player.addCards(cards);
                done(null, player);
            }
        })
    };

    PlayerDao.random = function(playerId, exceptIds, limit, cb) {
        exceptIds.push(playerId);
        // var sql = 'SELECT r1.id, r1.name, r1.lv, r1.ability FROM player AS r1 \
        //     JOIN (SELECT ROUND(RAND() * (SELECT MAX(id) FROM player)) AS id) AS r2 \
        //     WHERE r1.id not in (%s) and r1.id >= r2.id \
        //     ORDER BY r1.id ASC \
        //     LIMIT %d';
        var sql = 'SELECT id, name, lv, ability FROM `player` \
            WHERE id >= (SELECT FLOOR( MAX(id) * RAND()) FROM `player` ) \
            AND id not in (%s) ORDER BY id LIMIT %s';

        sql = util.format(sql, exceptIds.toString(), limit);
        dbClient.query(sql, [], function(err, res) {
            if (err) {
                logger.error('[SQL OERROR, when fetch player by random]');
                logger.error(err.stack);
            }

            if ( !! res && res.length > 0) {
                return cb(null, res);
            } else {
                return cb(null, []);
            }
        });
    };

    return PlayerDao;
})(DaoBase);

var orderBy = function(fields, orderby, limit, cb) {
    if (!fields) {
        fields = ['id', 'name', 'lv', 'ability'];
    }
    var sql = 'select ' + fields.toString() + ' from player \
            order by ' + orderby + ' limit ' + limit;

    dbClient.query(sql, [], function(err, res) {
        if (err) {
            logger.error('[SQL OERROR, when fetch player order by ' + orderby + ']');
            logger.error(err.stack);
        }

        if ( !! res && res.length > 0) {
            return cb(null, res);
        } else {
            return cb(null, []);
        }
    });
};

function sort(a, b) {
    return a - b;
};

function getLineUpIds(lineUp) {
    var ids = [];
    if (_.isString(lineUp) && lineUp !== '') {
        var lines = lineUp.split(',');
        lines.forEach(function(l) {
            var _ref = l.split(':'),
                pos = _ref[0],
                num = parseInt(_ref[1]);
            ids.push(num)
        });
    };
    return ids;
};

module.exports = PlayerDao;