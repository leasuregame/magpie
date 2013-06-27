/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * battleLog dao
 *
 * create
 * update
 * selete
 * delete
 * */


(function () {
    var sqlHelper = require("./sqlHelper");
    var dbClient = require("pomelo").app.get("dbClient");
    var logger = require("pomelo-logger").getLogger(__filename);
    var BattleLog = require("../../domain/battleLog");

    var battleLogDao = {
        /*
         * 创建一条 battleLog 记录
         * @param {object} param 字面量，创建需要的数据
         * @param {function} cb  回调函数
         * */
        createBattleLog: function (param, cb) {
            if (typeof (param) == "undefined") {
                throw new Error("battleLogDao.createBattleLog param is undefined");
            }

            if (typeof (param.own) == "undefined") {
                throw new Error("battleLogDao.createBattleLog param.own is undefined");
            }

            if (typeof (param.battleLog) == "undefined") {
                throw new Error("battleLogDao.createBattleLog param.battleLog is undefined");
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
                    return cb(null, new BattleLog(res));
                }
            });
        },

        /*
         * 根据 id 更新一条 battleLog 记录
         * @param {number} id 需要更新的记录号
         * @param {object} param 字面量，更新需要的数据
         * @param {function} cb  回调函数
         * */
        updateBattleLogById: function (id, param, cb) {
            if (typeof (id) == "undefined") {
                throw new Error("battleLogDao.updateBattleLogById id is undefined");
            }

            if (typeof (param) == "undefined") {
                throw new Error("battleLogDao.updateBattleLogById param is undefined");
            }

            var _ref = sqlHelper.updateSql("battleLog", ["id", id], param);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.update(sql, args, function (err, res) {
                if (err) {
                    logger.error("[battleLogDao.updateBattleLogById faild] ", err.stack);

                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else {
                    return cb(null, res);
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
                throw new Error("battleLogDao.getBattleLogById id is undefined");
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
                    return cb(null, new BattleLog(res[0]));
                } else {
                    return cb({
                        code: null,
                        msg: "BattleLog not exists"
                    }, null);
                }
            });
        },

        /*
         * 根据 playersId 查找主动发起的 battleLog 记录
         * @param {number} playersId 需要查找的记录号
         * @param {function} cb  回调函数
         * */
        getBattleLogByOwnPlayersId: function (playersId, cb) {
            if (typeof (playersId) == "undefined") {
                throw new Error("battleLogDao.getBattleLogByOwnPlayersId playersId is undefined");
            }

            var _ref = sqlHelper.selectSql("battleLog", ["own", playersId]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.query(sql, args, function (err, res) {
                if (err) {
                    logger.error("[battleLogDao.getBattleLogByOwnPlayersId faild] ", err.stack);

                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else if (res) {
                    var battleLogList = [];
                    var len = res.length;

                    for (var i = 0; i < len; ++i) {
                        battleLogList.push(new BattleLog(res[i]));
                    }

                    return cb(null, battleLogList);
                }
            });
        },

        /*
         * 根据 playersId 查找被攻击的 battleLog 记录
         * @param {number} playersId 需要查找的记录号
         * @param {function} cb  回调函数
         * */
        getBattleLogByEnemyPlayersId: function (playersId, cb) {
            if (typeof (playersId) == "undefined") {
                throw new Error("battleLogDao.getBattleLogByEnemyPlayersId playersId is undefined");
            }

            var _ref = sqlHelper.selectSql("battleLog", ["enemy", playersId]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.query(sql, args, function (err, res) {
                if (err) {
                    logger.error("[battleLogDao.getBattleLogByEnemyPlayersId faild] ", err.stack);

                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else if (res) {
                    var battleLogList = [];
                    var len = res.length;

                    for (var i = 0; i < len; ++i) {
                        battleLogList.push(new BattleLog(res[i]));
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
                throw new Error("battleLogDao.deleteBattleLogById id is undefined");
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
                } else {
                    return cb(null, res);
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
                throw new Error("battleLogDao.deleteBattleLog battleLog is undefined");
            }

            return this.deleteBattleLogById(battleLog.getId(), cb);
        }
    }

    module.exports = battleLogDao;

}).call(this);