/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * card dao
 *
 * create
 * update
 * select
 * delete
 * */


var sqlHelper = require("./sqlHelper");
var dbClient = require("pomelo").app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var Card = require("../../domain/card");
var cardSync = require("./mapping/cardSync");

var getCardObject = function (res) {
    var card = new Card({
        id: res.id,
        createTime: res.createTime,
        playerId: res.playerId,
        tableId: res.tableId,
        lv: res.lv,
        exp: res.exp,
        skillLv: res.skillLv,
        hpAddition: res.hpAddition,
        atkAddition: res.atkAddition
    });

    card.on('save', function () {
        app.get('sync').exec('cardSync.updateCardById', res.id, card.getSaveData());
    });

    return card;
}

var cardDao = {
    /*
     * 创建一条 card 记录
     * @param {object} param 字面量，创建需要的数据
     * @param {function} cb  回调函数
     * */
    createCard: function (param, cb) {
        if (typeof (param) == "undefined" || typeof (param.playerId) == "undefined" || typeof (param.tableId) == "undefined") {
            return cb("param error", null);
        }

        var _ref = sqlHelper.insertSql("card", param);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.insert(sql, args, function (err, res) {
            if (err) {
                logger.error("[cardDao.createCard faild] ", err.stack);

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
     * 根据 id 更新一条 card 记录
     * @param {number} id 需要更新的记录号
     * @param {object} param 字面量，更新需要的数据
     * @param {function} cb  回调函数
     * */
    updateCardById: function (id, param, cb) {
        if (typeof (id) == "undefined" || typeof (param) == "undefined") {
            return cb("param error", null);
        }

        var _ref = sqlHelper.updateSql("card", ["id", id], param);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.update(sql, args, function (err, res) {
            if (err) {
                logger.error("[cardDao.updateCardById faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            }
            if (!!res && res.affectedRows > 0) {
                return cb(null, true);
            } else {
                return cb(null, false);
            }
        });
    },

    /*
     * 根据 id 查找一条 card 记录
     * @param {number} id 需要查找的记录号
     * @param {function} cb  回调函数
     * */
    getCardById: function (id, cb) {
        if (typeof (id) == "undefined") {
            return cb("param error", null);
        }

        var _ref = sqlHelper.selectSql("card", ["id", id]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.query(sql, args, function (err, res) {
            if (err) {
                logger.error("[cardDao.getCardById faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else if (res && res.length === 1) {
                return cb(null, getCardObject(res[0]));
            } else {
                return cb({
                    code: null,
                    msg: "Card not exist"
                }, null);
            }
        });
    },

    /*
     * 根据 playerId 查找 card 记录
     * @param {number} playerId 需要查找的玩家号
     * @param {function} cb  回调函数
     * */
    getCardByPlayerId: function (playerId, cb) {
        if (typeof (playerId) == "undefined") {
            return cb("param error", null);
        }

        var _ref = sqlHelper.selectSql("card", ["playerId", playerId]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.query(sql, args, function (err, res) {
            if (err) {
                logger.error("[cardDao.getCardByPlayerId faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } else if (res) {
                var cardList = [];
                var len = res.length;

                for (var i = 0; i < len; ++i) {
                    cardList.push(getCardObject(res[i]));
                }

                return cb(null, cardList);
            }
        });
    },

    /*
     * 根据 id 删除一条 card 记录
     * @param {number} id 需要删除的记录号
     * @param {function} cb  回调函数
     * */
    deleteCardById: function (id, cb) {
        if (typeof (id) == "undefined") {
            return cb("param error", null);
        }

        var _ref = sqlHelper.deleteSql("card", ["id", id]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.delete(sql, args, function (err, res) {
            if (err) {
                logger.error("[cardDao.deleteCardById faild] ", err.stack);

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
     * 根据 card 删除一条 card 记录
     * @param {object} card 需要删除的用户对象
     * @param {function} cb  回调函数
     * */
    deleteCard: function (card, cb) {
        if (typeof (card) == "undefined") {
            return cb("param error", null);
        }

        return this.deleteCardById(card.get("id"), cb);
    }
}

module.exports = cardDao;