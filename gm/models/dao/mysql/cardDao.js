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
var Card = require("../../domain/entity/card");
var async = require('async');
var DaoBase = require("./daoBase");
var dbClient = require('./mysql');
var utility = require("../../common/utility");
//var PlayerDao = require("./playerDao");

var CardDao = (function (_super) {
    utility.extends(CardDao, _super);

    function CardDao() {
        CardDao.__super__.constructor.apply(this, arguments);
    }

    CardDao.table = 'card';
    CardDao.domain = Card;
    CardDao.syncKey = 'cardSync.updateCardById';

    CardDao.getCardInfo = function (options, cb) {
        var _this = this;
        async.parallel([
            function (callback) {
                _this.fetchOne(options, callback);
            }
        ], function (err, results) {
            console.log(err, results);
            if (err != null) {
                return cb(err, null)
            }
            var card = results[0];
            return cb(null, card);
        });
    };

    CardDao.getCards = function (options, cb) {
        var _this = this;

        async.waterfall([
            function (callback) {
                _this.fetchMany(options, callback);
            },
            function (cards, callback) {
                return cb(null, cards);
            }
        ]);
    };

    CardDao.deleteExploreCards = function (pid, cb) {
        console.log("deleteExploreCards");
        var sql = "select lineUp from player where id = ?";

        var args = [pid];
        dbClient.query(sql, args, function (err, res) {
            if (err) {
                //logger.error("[SQL ERROR, when delete cards]", err.stack);
                return cb({
                    code: err.code,
                    msg: err.message
                });
            }
            if (!!res) {
                console.log(res);
                var ids = getLineUpIds(res[0].lineUp);
                var sql = "delete from card where playerId = " + pid + " and id not in (" + ids.toString() + ")";
                dbClient.query(sql, [], function (err, res) {
                    if (err) {
                        return cb({
                            code: err.code,
                            msg: err.message
                        });
                    }
                    if (!!res && res.affectedRows > 0) {
                        return cb(null, true);
                    } else {
                        return cb(null, false);
                    }
                });

            } else {
                return cb(null, false);
            }
        })
    }

    return CardDao;
})(DaoBase);

var matrixOrder = ['00', '01', '02', '10', '11', '12'];

function getLineUpIds(line) {
    var line = line.split(',');
    var lineUp = [0, 0, 0, 0, 0, 0];
    for (var i = 0; i < line.length; i++) {
            var l = line[i].split(':'), pos = l[0], id = l[1];
        lineUp[positionToNumber(pos)] = parseInt(id);
    }
    var ids = [];
    for (var i = 0; i < lineUp.length; i++) {
        if (lineUp[i] > 0) {
            ids.push(lineUp[i]);
        }
    }
    console.log(ids);
    return ids;
};

function positionToNumber(pos) {
    return matrixOrder.indexOf(pos);
};

module.exports = CardDao;

