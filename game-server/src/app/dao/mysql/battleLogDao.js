/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * battleLog dao
 * */


var sqlHelper = require("./sqlHelper");
var app = require("pomelo").app;
var dbClient = app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var BattleLog = require("../../domain/battleLog");

var getBattleLogObject = function (res) {
    var battleLog = new BattleLog({
        id: res.id,
        createTime: res.createTime,
        own: res.own,
        enemy: res.enemy,
        battleLog: res.battleLog
    });

    battleLog.on('save', function (cb) {
        var id = res.id;
        app.get('sync').exec('battleLogSync.updateBattleLogById', id, {id: id, data: battleLog.getSaveData(), cb: cb});
    });

    return battleLog;
}

var battleLogDao = {
    /*
     * 创建一条 battleLog 记录
     * @param {object} param 字面量，创建需要的数据
     * @param {function} cb  回调函数
     * */
    createBattleLog: function (param, cb) {
        if (typeof (param) == "undefined" || typeof (param.own) == "undefined" || typeof (param.battleLog) == "undefined") {
            return cb("param error", null);
        }

        var stm = sqlHelper.insertSql("battleLog", param);
        return dbClient.insert(stm.sql, stm.args, function (err, res) {
            if (err) {
                logger.error("[battleLogDao.createBattleLog faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else {
                return cb(null, {id: res.insertId});
            }
        });
    },

    /*
     * 根据 id 查找一条 battleLog 记录
     * @param {number} id 需要查找的记录号
     * @param {function} cb  回调函数
     * */
    getBattleLogById: function (id, cb) {
        if (typeof (id) == "undefined") {
            return cb("param error", null);
        }

        var stm = sqlHelper.selectSql("battleLog", {"id": id});
        return dbClient.query(stm.sql, stm.args, function (err, res) {
            if (err) {
                logger.error("[battleLogDao.getBattleLogById faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else if (res && res.length === 1) {
                return cb(null, getBattleLogObject(res[0]));
            } else {
                return cb({
                    code: null,
                    msg: "BattleLog not exist"
                }, null);
            }
        });
    },

    /*
     * 根据 playerId 查找主动发起的 battleLog 记录
     * @param {number} playerId 需要查找的记录号
     * @param {function} cb  回调函数
     * */
    getBattleLogByOwnPlayerId: function (playerId, cb) {
        if (typeof (playerId) == "undefined") {
            return cb("param error", null);
        }

        var stm = sqlHelper.selectSql("battleLog", {"own": playerId});
        return dbClient.query(stm.sql, stm.args, function (err, res) {
            if (err) {
                logger.error("[battleLogDao.getBattleLogByOwnPlayerId faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else if (res) {
                var battleLogList = [];
                var len = res.length;

                for (var i = 0; i < len; ++i) {
                    battleLogList.push(getBattleLogObject(res[i]));
                }

                return cb(null, battleLogList);
            }
        });
    },

    /*
     * 根据 playerId 查找被攻击的 battleLog 记录
     * @param {number} playerId 需要查找的记录号
     * @param {function} cb  回调函数
     * */
    getBattleLogByEnemyPlayerId: function (playerId, cb) {
        if (typeof (playerId) == "undefined") {
            return cb("param error", null);
        }

        var stm = sqlHelper.selectSql("battleLog", {"enemy": playerId});
        return dbClient.query(stm.sql, stm.args, function (err, res) {
            if (err) {
                logger.error("[battleLogDao.getBattleLogByEnemyPlayerId faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else if (res) {
                var battleLogList = [];
                var len = res.length;

                for (var i = 0; i < len; ++i) {
                    battleLogList.push(getBattleLogObject(res[i]));
                }

                return cb(null, battleLogList);
            }
        });
    },

    /*
     * 根据 id 删除一条 battleLog 记录
     * @param {number} id 需要删除的记录号
     * @param {function} cb  回调函数
     * */
    deleteBattleLogById: function (id, cb) {
        if (typeof (id) == "undefined") {
            return cb("param error", null);
        }

        var stm = sqlHelper.deleteSql("battleLog", {"id": id});
        return dbClient.delete(stm.sql, stm.args, function (err, res) {
            if (err) {
                logger.error("[battleLogDao.deleteBattleLogById faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else if (res && res.affectedRows > 0) {
                return cb(null, true);
            } else {
                return cb(null, false);
            }
        });
    }
}

module.exports = battleLogDao;