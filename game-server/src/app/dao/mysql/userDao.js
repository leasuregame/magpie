/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * user dao
 *
 * create
 * update
 * selete
 * delete
 * */


var sqlHelper = require("./sqlHelper");
var dbClient = require("pomelo").app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var User = require("../../domain/user");

var userDao = {
    /*
     * 创建一条 user 记录
     * @param {object} param 字面量，创建需要的数据
     * @param {function} cb  回调函数
     * */
    createUser: function (param, cb) {
        if (typeof (param) == "undefined") {
            throw new Error("userDao.createUser param is undefined");
        }

        if (typeof (param.account) == "undefined") {
            throw new Error("userDao.createUser param.account is undefined");
        }

        var _ref = sqlHelper.insertSql("user", param);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.insert(sql, args, function (err, res) {
            if (err) {
                logger.error("[userDao.createUser faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else {
                return cb(null, new User({id: res.insertId, account: param.account}));
            }
        });
    },

    /*
     * 根据 id 更新一条 user 记录
     * @param {number} id 需要更新的记录号
     * @param {object} param 字面量，更新需要的数据
     * @param {function} cb  回调函数
     * */
    updateUserById: function (id, param, cb) {
        if (typeof (id) == "undefined") {
            throw new Error("userDao.updateUserById id is undefined");
        }

        if (typeof (param) == "undefined") {
            throw new Error("userDao.updateUserById param is undefined");
        }

        var _ref = sqlHelper.updateSql("user", ["id", id], param);
        var sql = _ref[0];
        var args = _ref[1];
        console.log(sql, args);
        return dbClient.update(sql, args, function (err, res) {
            if (err) {
                logger.error("[userDao.updateUserById faild] ", err.stack);

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
     * 根据 account 更新一条 user 记录
     * @param {string} account 需要更新的用户名
     * @param {object} param 字面量，更新需要的数据
     * @param {function} cb  回调函数
     * */
    updateUserByAccount: function (account, param, cb) {
        if (typeof (account) == "undefined") {
            throw new Error("userDao.updateUserByAccount account is undefined");
        }

        if (typeof (param) == "undefined") {
            throw new Error("userDao.updateUserByAccount param is undefined");
        }

        var _ref = sqlHelper.updateSql("user", ["account", account], param);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.update(sql, args, function (err, res) {
            if (err) {
                logger.error("[userDao.updateUserByAccount faild] ", err.stack);

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
     * 根据 id 查找一条 user 记录
     * @param {number} id 需要查找的记录号
     * @param {function} cb  回调函数
     * */
    getUserById: function (id, cb) {
        if (typeof (id) == "undefined") {
            throw new Error("userDao.getUserById id is undefined");
        }

        var _ref = sqlHelper.selectSql("user", ["id", id]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.query(sql, args, function (err, res) {
            if (err) {
                logger.error("[userDao.getUserById faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else if (res && res.length === 1) {
                return cb(null, new User(res[0]));
            } else {
                return cb({
                    code: null,
                    msg: "User not exists"
                }, null);
            }
        });
    },

    /*
     * 根据 account 查找一条 user 记录
     * @param {string} account 需要查找的账号名
     * @param {function} cb  回调函数
     * */
    getUserByAccount: function (account, cb) {
        if (typeof (account) == "undefined") {
            throw new Error("userDao.getUserByAccount id account undefined");
        }

        var _ref = sqlHelper.selectSql("user", ["account", account]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.query(sql, args, function (err, res) {
            if (err) {
                logger.error("[userDao.getUserByAccount faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else if (res && res.length === 1) {
                return cb(null, new User(res[0]));
            } else {
                return cb({
                    code: null,
                    msg: "User not exists"
                }, null);
            }
        });
    },

    /*
     * 根据 id 删除一条 user 记录
     * @param {number} id 需要删除的记录号
     * @param {function} cb  回调函数
     * */
    deleteUserById: function (id, cb) {
        if (typeof (id) == "undefined") {
            throw new Error("userDao.deleteUserById id is undefined");
        }

        var _ref = sqlHelper.deleteSql("user", ["id", id]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.delete(sql, args, function (err, res) {
            if (err) {
                logger.error("[userDao.deleteUserById faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else {
                if (!!res && res.affectedRows > 0){
                    return cb(null, true);
                } else {
                    return cb(null, false);
                }
            }
        });
    },

    /*
     * 根据 user 删除一条 user 记录
     * @param {object} user 需要删除的用户对象
     * @param {function} cb  回调函数
     * */
    deleteUser: function (user, cb) {
        if (typeof (user) == "undefined") {
            throw new Error("userDao.deleteUser user is undefined");
        }

        return this.deleteUserById(user.getId(), cb);
    }
};

module.exports = userDao;
