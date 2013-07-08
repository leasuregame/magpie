/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */


/*
* player sync
* */


var sqlHelper = require("../sqlHelper");
var dbClient = require("pomelo").app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var _ = require('underscore');

playerSync = {
    /*
     * 根据 id 更新一条 player 记录
     * @param {number} id 需要更新的记录号
     * @param {object} param 字面量，更新需要的数据
     * @param {function} cb  回调函数
     * */
    updatePlayerById: function (id, param) {
        var cb = function() {};
        if(typeof (param.cb) != "undefined") {
            cb = param.cb;
        }

        if (typeof (param.id) == "undefined" || typeof (param.data) == "undefined") {
            return cb("param error", null);
        }

        if (_.isEmpty(param.data)) {
            // not data have to update
            logger.debug('not data have to update for player');
            return cb(null, true);
        }

        var _ref = sqlHelper.updateSql("player", ["id", param.id], param.data);
        var sql = _ref[0];
        var args = _ref[1];

        logger.debug(sql, args);
        return dbClient.update(sql, args, function (err, res) {
            if (err) {
                logger.error("[playerDao.updatePlayerById faild] ", err.stack);

                return cb({
                    code: err.code,
                    msg: err.message
                }, null);
            } if (!!res && res.affectedRows > 0) {
                return cb(null, true);
            } else {
                return cb(null, false);
            }
        });
    }
};

module.exports = playerSync;