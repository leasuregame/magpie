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
var dbClient = require("pomelo").app.get("dbClient");
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

    battleLog.on('save', function () {
        app.get('sync').exec('battleLogSync.updateBattleLogById', res.id, battleLog.getSaveData());
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

        var _ref = sqlHelper.insertSql("battleLog", param);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.insert(sql, args, function (err, res) {
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

        var _ref = sqlHelper.selectSql("battleLog", ["id", id]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.query(sql, args, function (err, res) {
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

        var _ref = sqlHelper.selectSql("battleLog", ["own", playerId]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.query(sql, args, function (err, res) {
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

        var _ref = sqlHelper.selectSql("battleLog", ["enemy", playerId]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.query(sql, args, function (err, res) {
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

        var _ref = sqlHelper.deleteSql("battleLog", ["id", id]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.delete(sql, args, function (err, res) {
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
    },

    /*
     * 根据 battleLog 删除一条 battleLog 记录
     * @param {object} battleLog 需要删除的用户对象
     * @param {function} cb  回调函数
     * */
    deleteBattleLog: function (battleLog, cb) {
        if (typeof (battleLog) == "undefined") {
            return cb("param error", null);
        }

        return this.deleteBattleLogById(battleLog.get("id"), cb);
    }
}

module.exports = battleLogDao;