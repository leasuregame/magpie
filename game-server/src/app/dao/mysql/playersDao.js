/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * players dao
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
    var Players = require("../../domain/players");

    var playersDao = {
        /*
         * 创建一条 players 记录
         * @param {object} param 字面量，创建需要的数据
         * @param {function} cb  回调函数
         * */
        createPlayers: function (param, cb) {
            if (typeof (param) == "undefined") {
                throw new Error("playersDao.createPlayers param is undefined");
            }

            if (typeof (param.playersId) == "undefined") {
                throw new Error("playersDao.createPlayers param.playersId is undefined");
            }

            if (typeof (param.areaId) == "undefined") {
                throw new Error("playersDao.createPlayers param.areaId is undefined");
            }

            if (typeof (param.name) == "undefined") {
                throw new Error("playersDao.createPlayers param.name is undefined");
            }

            var _ref = sqlHelper.insertSql("players", param);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.insert(sql, args, function (err, res) {
                if (err) {
                    logger.error("[playersDao.createPlayers faild] ", err.stack);

                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else {
                    return cb(null, new Players(res));
                }
            });
        },

        /*
         * 根据 id 更新一条 players 记录
         * @param {number} id 需要更新的记录号
         * @param {object} param 字面量，更新需要的数据
         * @param {function} cb  回调函数
         * */
        updatePlayersById: function (id, param, cb) {
            if (typeof (id) == "undefined") {
                throw new Error("playersDao.updatePlayersById id is undefined");
            }

            if (typeof (param) == "undefined") {
                throw new Error("playersDao.updatePlayersById param is undefined");
            }

            var _ref = sqlHelper.updateSql("players", ["id", id], param);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.update(sql, args, function (err, res) {
                if (err) {
                    logger.error("[playersDao.updatePlayersById faild] ", err.stack);

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
         * 根据 name 更新一条 players 记录
         * @param {string} name 需要更新的用户名
         * @param {object} param 字面量，更新需要的数据
         * @param {function} cb  回调函数
         * */
        updatePlayersByName: function (name, param, cb) {
            if (typeof (name) == "undefined") {
                throw new Error("playersDao.updatePlayersByName name is undefined");
            }

            if (typeof (param) == "undefined") {
                throw new Error("playersDao.updatePlayersByName param is undefined");
            }

            var _ref = sqlHelper.updateSql("players", ["name", name], param);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.update(sql, args, function (err, res) {
                if (err) {
                    logger.error("[playersDao.updatePlayersByName faild] ", err.stack);

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
         * 根据 id 查找一条 players 记录
         * @param {number} id 需要查找的记录号
         * @param {function} cb  回调函数
         * */
        getPlayersById: function (id, cb) {
            if (typeof (id) == "undefined") {
                throw new Error("playersDao.getPlayersById id is undefined");
            }

            var _ref = sqlHelper.selectSql("players", ["id", id]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.query(sql, args, function (err, res) {
                if (err) {
                    logger.error("[playersDao.getPlayersById faild] ", err.stack);

                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else if (res && res.length === 1) {
                    return cb(null, new Players(res[0]));
                } else {
                    return cb({
                        code: null,
                        msg: "Players not exists"
                    }, null);
                }
            });
        },

        /*
         * 根据 name 查找一条 players 记录
         * @param {string} name 需要查找的账号名
         * @param {function} cb  回调函数
         * */
        getPlayersByName: function (name, cb) {
            if (typeof (name) == "undefined") {
                throw new Error("playersDao.getPlayersByName id name undefined");
            }

            var _ref = sqlHelper.selectSql("players", ["name", name]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.query(sql, args, function (err, res) {
                if (err) {
                    logger.error("[playersDao.getPlayersByName faild] ", err.stack);

                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else if (res && res.length === 1) {
                    return cb(null, new Players(res[0]));
                } else {
                    return cb({
                        code: null,
                        msg: "Players not exists"
                    }, null);
                }
            });
        },

        /*
         * 根据 id 删除一条 players 记录
         * @param {number} id 需要删除的记录号
         * @param {function} cb  回调函数
         * */
        deletePlayersById: function (id, cb) {
            if (typeof (id) == "undefined") {
                throw new Error("playersDao.deletePlayersById id is undefined");
            }

            var _ref = sqlHelper.deleteSql("players", ["id", id]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.delete(sql, args, function (err, res) {
                if (err) {
                    logger.error("[playersDao.deletePlayersById faild] ", err.stack);

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
         * 根据 players 删除一条 players 记录
         * @param {object} players 需要删除的用户对象
         * @param {function} cb  回调函数
         * */
        deletePlayers: function (players, cb) {
            if (typeof (players) == "undefined") {
                throw new Error("playersDao.deletePlayers players is undefined");
            }

            return this.deletePlayersById(players.getId(), cb);
        }
    }

    module.exports = playersDao;

}).call(this);