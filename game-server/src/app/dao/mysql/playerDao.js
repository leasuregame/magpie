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

var sqlHelper = require("./sqlHelper");
var app = require("pomelo").app;
var dbClient = app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var Player = require("../../domain/player");
var cardDao = require("./cardDao");
var async = require('async');
var _ = require('underscore');

var DEFAULT_PLAYER_INFO = {
    power: 100,
    lv: 1,
    exp: 0,
    money: 1000,
    gold: 50,
    lineUp: '',
    ability: 0,
    task: {id: 1, progress: 0},
    pass: 0,
    passMark: 0
};

var createNewPlayer = function (playerInfo) {
    var player = new Player(playerInfo);

    player.on('save', function (cb) {
        var id = player.id;
        app.get('sync').exec('playerSync.updatePlayerById', id, [id, player.getSaveData(), cb]);
    });
    return player;
};

var playerDao = {
    /*
     * 创建一条 player 记录
     * @param {object} param 字面量，创建需要的数据
     * @param {function} cb  回调函数
     * */
    createPlayer: function (param, cb) {
        if (typeof param == "undefined" || 
            typeof param.areaId == "undefined" || 
            typeof param.name == "undefined" || 
            typeof param.userId == "undefined"
        ) {
            return cb("param error", null);
        }

        var fields = _.clone(DEFAULT_PLAYER_INFO)
        _.extend(fields, param);
        var _ref = sqlHelper.insertSql("player", fields);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.insert(sql, args, function (err, res) {
            if (err) {
                logger.error("[playerDao.createPlayer faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else {
                return cb(null, createNewPlayer(_.extend({id: res.insertId}, fields)));
            }
        });
    },

    /*
     * 根据 id 查找一条 player 记录
     * @param {number} id 需要查找的记录号
     * @param {function} cb  回调函数
     * */
    getPlayerById: function (id, cb) {
        if (typeof (id) == "undefined") {
            cb("param error", null);
        }

        playerDao._getPlayer({field: 'id', value: id}, cb);
    },

    /*
     * 根据 name 查找一条 player 记录
     * @param {string} name 需要查找的账号名
     * @param {function} cb  回调函数
     * */
    getPlayerByName: function (name, cb) {
        if (typeof (name) == "undefined") {
            cb("param error", null);
        }

        playerDao._getPlayer({field: 'name', value: name}, cb);
    },

    /*
     * 根据 userId 查找一条 player 记录
     * @param {string} uid 需要查找的用户Id 
     * @param {function} cb  回调函数
     * */
    getPlayerByUserId: function(uid, cb) {
        if (typeof uid == 'undefined') {
            cb("param error", null);
        }

        playerDao._getPlayer({field: 'userId', value: uid}, cb);
    },

    /*
     * 根据 id 查找一条 player 记录, 包括所有的卡牌等其他信息
     * @param {number} id 需要查找的记录号
     * @param {function} cb  回调函数
     * */
    getPlayerInfo: function (id, cb) {
        async.parallel([
            function (callback) {
                playerDao.getPlayerById(id, callback);
            },
            function (callback) {
                cardDao.getCardByPlayerId(id, callback);
            }
        ], function (err, results) {
            if (err !== null) {
                return cb(err, null)
            }

            var player = results[0];
            var cards = results[1];
            player.addCards(cards);
            return cb(null, player);
        });
    },

    /*
     * 根据所给参数条件查找一条 player 记录
     * @param {object} param 包含两个属性 field 和 value
     *                       例如：{field: id, value: 1} 表示查找id=1的player
     * @param {function} cb  回调函数
     */
    _getPlayer: function(param, cb) {
        if (typeof param == 'undefined') {
            cb("param error", null);
        }

        var _ref = sqlHelper.selectSql("player", [param.field, param.value]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.query(sql, args, function(err, res) {
            if (err) {
                logger.error("[playerDao.getPlayerByUser faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else if (res && res.length === 1) {
                return cb(null, createNewPlayer(res[0]));
            } else {
                return cb({
                    code: null,
                    msg: "Player not exists"
                }, null);
            }
        });
    },


    /*
     * 根据 id 删除一条 player 记录
     * @param {number} id 需要删除的记录号
     * @param {function} cb  回调函数
     * */
    deletePlayerById: function (id, cb) {
        if (typeof (id) == "undefined") {
            cb("param error", null);
        }

        var _ref = sqlHelper.deleteSql("player", ["id", id]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.delete(sql, args, function (err, res) {
            if (err) {
                logger.error("[playerDao.deletePlayerById faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else {
                if (!!res && res.affectedRows > 0) {
                    return cb(null, true);
                } else {
                    return cb(null, false);
                }
            }
        });
    }
}

module.exports = playerDao;
