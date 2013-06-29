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
 * selete
 * delete
 * */


(function () {
    var sqlHelper = require("./sqlHelper");
    var dbClient = require("pomelo").app.get("dbClient");
    var logger = require("pomelo-logger").getLogger(__filename);
    var Player = require("../../domain/player");

    var playerDao = {
        /*
         * 创建一条 player 记录
         * @param {object} param 字面量，创建需要的数据
         * @param {function} cb  回调函数
         * */
        createPlayer: function (param, cb) {
            if (typeof (param) == "undefined") {
                throw new Error("playerDao.createPlayer param is undefined");
            }

            if (typeof (param.playerId) == "undefined") {
                throw new Error("playerDao.createPlayer param.playerId is undefined");
            }

            if (typeof (param.areaId) == "undefined") {
                throw new Error("playerDao.createPlayer param.areaId is undefined");
            }

            if (typeof (param.name) == "undefined") {
                throw new Error("playerDao.createPlayer param.name is undefined");
            }

            var _ref = sqlHelper.insertSql("player", param);
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
                    return cb(null, new Player(res));
                }
            });
        },

        /*
         * 根据 id 更新一条 player 记录
         * @param {number} id 需要更新的记录号
         * @param {object} param 字面量，更新需要的数据
         * @param {function} cb  回调函数
         * */
        updatePlayerById: function (id, param, cb) {
            if (typeof (id) == "undefined") {
                throw new Error("playerDao.updatePlayerById id is undefined");
            }

            if (typeof (param) == "undefined") {
                throw new Error("playerDao.updatePlayerById param is undefined");
            }

            var _ref = sqlHelper.updateSql("player", ["id", id], param);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.update(sql, args, function (err, res) {
                if (err) {
                    logger.error("[playerDao.updatePlayerById faild] ", err.stack);

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
         * 根据 name 更新一条 player 记录
         * @param {string} name 需要更新的用户名
         * @param {object} param 字面量，更新需要的数据
         * @param {function} cb  回调函数
         * */
        updatePlayerByName: function (name, param, cb) {
            if (typeof (name) == "undefined") {
                throw new Error("playerDao.updatePlayerByName name is undefined");
            }

            if (typeof (param) == "undefined") {
                throw new Error("playerDao.updatePlayerByName param is undefined");
            }

            var _ref = sqlHelper.updateSql("player", ["name", name], param);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.update(sql, args, function (err, res) {
                if (err) {
                    logger.error("[playerDao.updatePlayerByName faild] ", err.stack);

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
         * 根据 id 查找一条 player 记录
         * @param {number} id 需要查找的记录号
         * @param {function} cb  回调函数
         * */
        getPlayerById: function (id, cb) {
            if (typeof (id) == "undefined") {
                throw new Error("playerDao.getPlayerById id is undefined");
            }

            var _ref = sqlHelper.selectSql("player", ["id", id]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.query(sql, args, function (err, res) {
                if (err) {
                    logger.error("[playerDao.getPlayerById faild] ", err.stack);

                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else if (res && res.length === 1) {
                    return cb(null, new Player(res[0]));
                } else {
                    return cb({
                        code: null,
                        msg: "Player not exists"
                    }, null);
                }
            });
        },

        /*
         * 根据 name 查找一条 player 记录
         * @param {string} name 需要查找的账号名
         * @param {function} cb  回调函数
         * */
        getPlayerByName: function (name, cb) {
            if (typeof (name) == "undefined") {
                throw new Error("playerDao.getPlayerByName id name undefined");
            }

            var _ref = sqlHelper.selectSql("player", ["name", name]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.query(sql, args, function (err, res) {
                if (err) {
                    logger.error("[playerDao.getPlayerByName faild] ", err.stack);

                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else if (res && res.length === 1) {
                    return cb(null, new Player(res[0]));
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
                throw new Error("playerDao.deletePlayerById id is undefined");
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
                    return cb(null, res);
                }
            });
        },

        /*
         * 根据 player 删除一条 player 记录
         * @param {object} player 需要删除的用户对象
         * @param {function} cb  回调函数
         * */
        deletePlayer: function (player, cb) {
            if (typeof (player) == "undefined") {
                throw new Error("playerDao.deletePlayer player is undefined");
            }

            return this.deletePlayerById(player.getId(), cb);
        }
    }

    module.exports = playerDao;

}).call(this);