/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * passiveSkill dao
 *
 * create
 * update
 * select
 * delete
 * */


(function () {
    var sqlHelper = require("./sqlHelper");
    var dbClient = require("pomelo").app.get("dbClient");
    var logger = require("pomelo-logger").getLogger(__filename);
    var PassiveSkill = require("../../domain/passiveSkill");

    var passiveSkillDao = {
        /*
         * 创建一条 passiveSkill 记录
         * @param {object} param 字面量，创建需要的数据
         * @param {function} cb  回调函数
         * */
        createPassiveSkill: function (param, cb) {
            if (typeof (param) == "undefined" || typeof (param.cardId) == "undefined" || typeof (param.tableId) == "undefined") {
                return cb("param error", null);
            }

            var _ref = sqlHelper.insertSql("passiveSkill", param);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.insert(sql, args, function (err, res) {
                if (err) {
                    logger.error("[passiveSkillDao.createPassiveSkill faild] ", err.stack);
                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else {
                    return cb(null, new PassiveSkill({id: res.insertId}));
                }
            });
        },

        /*
         * 根据 id 更新一条 passiveSkill 记录
         * @param {number} id 需要更新的记录号
         * @param {object} param 字面量，更新需要的数据
         * @param {function} cb  回调函数
         * */
        updatePassiveSkillById: function (id, param, cb) {
            if (typeof (id) == "undefined" || typeof (param) == "undefined") {
                return cb("param error", null);
            }

            var _ref = sqlHelper.updateSql("passiveSkill", ["id", id], param);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.update(sql, args, function (err, res) {
                if (err) {
                    logger.error("[passiveSkillDao.updatePassiveSkillById faild] ", err.stack);

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
        },

        /*
         * 根据 id 查找一条 passiveSkill 记录
         * @param {number} id 需要查找的记录号
         * @param {function} cb  回调函数
         * */
        getPassiveSkillById: function (id, cb) {
            if (typeof (id) == "undefined") {
                return cb("param error", null);
            }

            var _ref = sqlHelper.selectSql("passiveSkill", ["id", id]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.query(sql, args, function (err, res) {
                if (err) {
                    logger.error("[passiveSkillDao.getPassiveSkillById faild] ", err.stack);

                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else if (res && res.length === 1) {
                    return cb(null, new PassiveSkill(res[0]));
                } else {
                    return cb({
                        code: null,
                        msg: "PassiveSkill not exists"
                    }, null);
                }
            });
        },

        /*
         * 根据 cardId 查找 passiveSkill 记录
         * @param {number} cardId 需要查找的记录号
         * @param {function} cb  回调函数
         * */
        getPassiveSkillByCardId: function (cardId, cb) {
            if (typeof (cardId) == "undefined") {
                return cb("param error", null);
            }

            var _ref = sqlHelper.selectSql("passiveSkill", ["cardId", cardId]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.query(sql, args, function (err, res) {
                if (err) {
                    logger.error("[passiveSkillDao.getPassiveSkillByCardId faild] ", err.stack);

                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else if (res) {
                    var passiveSkillList = [];
                    var len = res.length;

                    for (var i = 0; i < len; ++i) {
                        passiveSkillList.push(new PassiveSkill(res[i]));
                    }

                    return cb(null, passiveSkillList);
                }
            });
        },

        /*
         * 根据 id 删除一条 passiveSkill 记录
         * @param {number} id 需要删除的记录号
         * @param {function} cb  回调函数
         * */
        deletePassiveSkillById: function (id, cb) {
            if (typeof (id) == "undefined") {
                return cb("param error", null);
            }

            var _ref = sqlHelper.deleteSql("passiveSkill", ["id", id]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.delete(sql, args, function (err, res) {
                if (err) {
                    logger.error("[passiveSkillDao.deletePassiveSkillById faild] ", err.stack);

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

    module.exports = passiveSkillDao;

}).call(this);