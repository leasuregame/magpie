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

var PlayerDao = require('../../playerDao');
var _ = require('underscore');
var logger = require('pomelo-logger').getLogger(__filename);

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

        return PlayerDao.update({
            where: {id: param.id},
            data: param.data
        }, cb);
    }
};

module.exports = playerSync;