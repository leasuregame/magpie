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
 * select
 * delete
 * */


var sqlHelper = require("./sqlHelper");
var app = require("pomelo").app;
var dbClient = app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var User = require("../../domain/user");

var getUserObject = function (res) {
    var user = new User({
        id: res.id,
        createTime: res.createTime,
        account: res.account,
        password: res.password,
        name: res.name,
        loginCount: res.loginCount,
        lastLoginTime: res.lastLoginTime,
        lostLoginDevice: res.lostLoginDevict
    });

    user.on('save', function (cb) {
        var id = res.id;
        app.get('sync').exec('userSync.updateUserById', id, {id: id, data: user.getSaveData(), cb: cb});
    });

    return user;
}

var userDao = {
    /*
     * 创建一条 user 记录
     * @param {object} param 字面量，创建需要的数据
     * @param {function} cb  回调函数
     * */
    createUser: function (param, cb) {
        if (typeof (param) == "undefined" || typeof (param.account) == "undefined") {
            cb("param error", null);
        }

        var stm = sqlHelper.insertSql("user", param);
        return dbClient.insert(stm.sql, stm.args, function (err, res) {
            if (err) {
                logger.error("[userDao.createUser faild] ", err.stack);

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
     * 根据 id 查找一条 user 记录
     * @param {number} id 需要查找的记录号
     * @param {function} cb  回调函数
     * */
    getUserById: function (id, cb) {
        if (typeof (id) == "undefined") {
            cb("param error", null);
        }

        var stm = sqlHelper.selectSql("user", {"id": id});
        return dbClient.query(stm.sql, stm.args, function (err, res) {
            if (err) {
                logger.error("[userDao.getUserById faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else if (res && res.length === 1) {
                return cb(null, getUserObject(res[0]));
            } else {
                return cb({
                    code: null,
                    msg: "User not exist"
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
            cb("param error", null);
        }

        var stm = sqlHelper.selectSql("user", {"account": account});
        return dbClient.query(stm.sql, stm.args, function (err, res) {
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
                    msg: "User not exist"
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
            cb("param error", null);
        }

        var stm = sqlHelper.deleteSql("user", {"id": id});
        return dbClient.delete(stm.sql, stm.args, function (err, res) {
            if (err) {
                logger.error("[userDao.deleteUserById faild] ", err.stack);

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
};

module.exports = userDao;
