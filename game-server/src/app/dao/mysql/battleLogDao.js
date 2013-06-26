(function () {
    var Player, dbclient, logger, playerCallbackHandler, playerDao, sqlHelper, _;

    dbclient = require('pomelo').app.get('dbclient');

    sqlHelper = require('./sqlHelper');

    Player = require('../../domain/player');

    logger = require('pomelo-logger').getLogger(__filename);

    _ = require('underscore');

    module.exports = battleLogDao = {
        /*
         创建一个新的战报
         @param {number} own 战斗发起人ID
         @param {number} enemy 战斗受击人ID | null
         @param {string} battle_log 战报，json格式
         @param {function} callback 回调函数
         */
        createBattleLog: function (battleLog) {
            if (typeof (battleLog) == "undefined") {
                throw new Error("param battleLog is null");
            }

            if (typeof (battleLog.own) == "undefined" || typeof (battleLog.battle_log == "undefined")) {
                throw new Error("can not create battleLog with not own or battleLog");
            }

            var _ref = sqlHelper.insertSql('player', fields);
            var sql = _ref[0];
            var args = _ref[1];

            return dbclient.insert(sql, args, function (err, res) {
                if (err) {
                    logger.error(' [create user faild]', err.stack);
                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else {
                    return playerCallbackHandler(res, cb);
                }
            });
        },

        createBattleLog: function (own, enemy, battle_log, callback) {

        },

        /*
         创建一个新的玩家
         @param {uid} 用户id，必须参数
         @param {name} 玩家名称，必须参数
         @param {params} 提供创建是额外的玩家信息，如： {money: 10000}
         @param {cb} 回调函数
         */

        createPlayer: function (uid, name, params, cb) {
            var args, fields, sql, _ref;
            if (!uid || !name) {
                throw new Error("can not create user with not userid or username");
            }
            fields = _.extend({
                user_id: uid,
                name: name
            }, params);
            _ref = sqlHelper.insertSql('player', fields), sql = _ref[0], args = _ref[1];
            return dbclient.insert(sql, args, function (err, res) {
                if (err) {
                    logger.error(' [create user faild]', err.stack);
                    return cb({
                        code: err.code,
                        msg: err.message
                    }, null);
                } else {
                    return playerCallbackHandler(res, cb);
                }
            });
        },
        /*
         更新玩家的信息
         @param {playerId} 玩家Id，必须参数
         @param {params} 需要更新的玩家属性，如：{name: '名称', lv: 20}
         @param {cb} 回调函数
         */

        updatePlayer: function (playerId, params, cb) {
            var args, sql, _ref;
            if (!playerId || params) {
                throw new Error("can not update player with not playerId or updated fields");
            }
            _ref = sqlHelper.updateSql('player', playerId, params), sql = _ref[0], args = _ref[1];
            return dbclient.update(sql, args, function (err, res) {
                if (err) {
                    return cb({
                        code: err.number,
                        msg: err.message
                    }, null);
                } else {
                    return cb(null, res);
                }
            });
        },
        getPlayerById: function (playerId, cb) {
            var args, sql, _ref;
            if (playerId != null) {
                _ref = sqlHelper.selectSql('player', ['id', playerId]), sql = _ref[0], args = _ref[1];
                return dbclient.query(sql, args, function (err, res) {
                    if (err) {
                        cb(err.message, null);
                        return;
                    }
                    if (!!res && res.length === 1) {
                        return playerCallbackHandler(res[0], cb);
                    } else {
                        return cb(' Player not exists ', null);
                    }
                });
            }
        },
        getPlayerByName: function (name, cb) {
            var args, sql, _ref;
            if (name != null) {
                _ref = sqlHelper.selectSql('player', ['name', name]), sql = _ref[0], args = _ref[1];
                return dbclient.query(sql, args, function (err, res) {
                    if (err) {
                        cb(err.message, null);
                        return;
                    }
                    if (!!res && res.length === 1) {
                        return playerCallbackHandler(res[0], cb);
                    } else {
                        return cb(' Player not exists ', null);
                    }
                });
            }
        }
    };

    playerCallbackHandler = function (row, cb) {
        var player;
        player = new Player({
            id: row.insertId,
            uid: row.user_id,
            area_id: row.area_id,
            name: row.name,
            power: row.power,
            lv: row.lv,
            exp: row.exp,
            money: row.money,
            gold: row.gold,
            formation: row.formation,
            ability: row.ability,
            task: row.task,
            task_mark: row.task_mark,
            pass: row.pass,
            pass_mark: row.pass_mark
        });
        return cb(null, player);
    };

}).call(this);
