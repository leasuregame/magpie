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
var Player = require("../../domain/player");
var cardDao = require("./cardDao");
var rankDao = require("./rankDao");
var async = require('async');

var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var PlayerDao = (function(_super) {
    utility.extends(PlayerDao, _super);

    function PlayerDao() {
        PlayerDao.__super__.constructor.apply(this, arguments);
    }

    PlayerDao.DEFAULT_VALUES = {
        power: 100,
        lv: 1,
        exp: 0,
        money: 1000,
        gold: 50,
        lineUp: '',
        ability: 0,
        task: {
            id: 1,
            progress: 0
        },
        pass: 0,
        passMark: 0,
        dailyGift: [],
        fragments: 0,
        energy: 0,
        skillPoint: 0
    };
    PlayerDao.table = 'player';
    PlayerDao.domain = Player;
    PlayerDao.syncKey = 'playerSync.updatePlayerById';

    PlayerDao.getPlayerInfo = function(options, cb) {
        var _this = this;
        async.parallel([
            function(callback) {
                _this.fetchOne(options, callback);
            },
            function(callback) {
                cardDao.getCards({
                    sync: options.sync,
                    where: {
                        playerId: options.where.id
                    }
                }, callback);
            },
            function(callback) {
                rankDao.fetchOne({
                    sync: options.sync,
                    where: {
                        playerId: options.where.id
                    }
                }, function(err, res) {
                    if (err && err.code == 404) {
                        return callback(null, null);
                    }
                    return callback(null, res);
                });
            }
        ], function(err, results) {
            if (err !== null) {
                return cb(err, null)
            }

            var player = results[0];
            var cards = results[1];
            var rank = results[2];
            player.addCards(cards);
            player.set('rank', rank);
            return cb(null, player);
        });
    };

    return PlayerDao;
})(DaoBase);

module.exports = PlayerDao;