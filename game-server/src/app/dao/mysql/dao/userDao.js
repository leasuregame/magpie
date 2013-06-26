/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
* user dao
* */


(function () {
    var sqlHelper = require("./../sqlHelper");
    var dbClient = require("pomelo").app.get("dbClient");
    var logger = require("pomelo-logger").getLogger(__filename);
    var User = require("../../../domain/user");

    var getUser = function (param) {
        var user = new Card({
            id: param.id,
            createTime: param.createTime,
            playersId: param.playersId,
            tableId: param.tableId,
            lv: param.lv,
            skillLv: param.skillLv,
            hpAddition: param.hpAddition,
            atkAddition: param.atkAddition
        });

        return card;
    };

    var getError = function (errorFunction, err) {
        if (err) {
            logger.error("[" + errorFunction + " faild] ", err.stack);

            return {
                code: err.code,
                msg: err.message
            };
        }

        return null;
    };

    var cardDao = {
        /*
         *
         * @param {literals} param 字面量，创建卡牌所需要的数据
         * @param {function} cb  回调函数
         *
         * */
        createCard: function (param, cb) {
            if (typeof (param) == "undefined") {
                throw new Error("cardDao.createCard param is undefined");
            }

            if (typeof (param.playersId) == "undefined") {
                throw new Error("cardDao.createCard param.playersId is undefined");
            }

            if (typeof (param.tableId) == "undefined") {
                throw new Error("cardDao.createCard param.tableId is undefined");
            }

            var _ref = sqlHelper.insertSql("card", param);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.insert(sql, args, function (err, res) {
                if (err) {
                    return cb(getError("cardDao.createCard", err), null);
                } else {
                    return cb(null, getCard(res));
                }
            });
        },

        updateCardById: function (id, param, cb) {
            if (typeof (id) == "undefined") {
                throw new Error("cardDao.updateCardById id is undefined");
            }

            if (typeof (param) == "undefined") {
                throw new Error("cardDao.updateCardById param is undefined");
            }

            var _ref = sqlHelper.updateSql("card", id, param);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.update(sql, args, function (err, res) {
                if (err) {
                    return cb(getError("cardDao.updateCardById", err), null);
                } else {
                    return cb(null, res);
                }
            });
        },

        getCardById: function (id, cb) {
            if (typeof (id) == "undefined") {
                throw new Error("cardDao.getCardById id is undefined");
            }

            var _ref = sqlHelper.selectSql("card", ["id", id]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.query(sql, args, function (err, res) {
                if (err) {
                    return cb(getError("cardDao.getCardById", err), null);
                } else if (res && res.length === 1) {
                    return cb(null, getCard(res[0]));
                } else {
                    return cb({
                        code: null,
                        msg: "Card not exists"
                    }, null);
                }
            });
        },

        getCardByPlayersId: function (id, cb) {
            if (typeof (id) == "undefined") {
                throw new Error("cardDao.getCardByPlayersId id is undefined");
            }

            var _ref = sqlHelper.selectSql("card", ["playersId", id]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.query(sql, args, function (err, res) {
                if (err) {
                    return cb(getError("cardDao.getCardByPlayersId", err), null);
                } else if (res) {
                    var len = res.length;
                    var cardList = [];

                    for (var i = 0; i < len; ++i) {
                        cardList.push(getCard(res[i]));
                    }

                    return cb(null, cardList);
                }
            });
        },

        deleteCardById: function (id, cb) {
            if (typeof (id) == "undefined") {
                throw new Error("cardDao.deleteCardById id is undefined");
            }

            var _ref = sqlHelper.deleteSql("card", ["id", id]);
            var sql = _ref[0];
            var args = _ref[1];

            return dbClient.delete(sql, args, function (err, res) {
                if (err) {
                    return cb(getError("cardDao.deleteCardById", err), null);
                } else {
                    return cb(null, res);
                }
            });
        },

        deleteCard: function (card, cb) {
            if (typeof (card) == "undefined") {
                throw new Error("card is undefined");
            }

            this.deleteCardById(card.id, cb);
        }
    }

    module.exports = cardDao;

}).call(this);