/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle log sync
 * */


var sqlHelper = require("../sqlHelper");
var dbClient = require("pomelo").app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);

var battleLogSync = {
    /*
     * 根据 id 更新一条 battleLog 记录
     * @param {number} id 需要更新的记录号
     * @param {object} param 字面量，更新需要的数据
     * @param {function} cb  回调函数
     * */
    updateBattleLogById: function (id, param) {
        var cb = function() {};
        if(typeof (param.cb) != "undefined") {
            cb = param.cb;
        }

        if (typeof (param.id) == "undefined" || typeof (param.data) == "undefined") {
            return cb("param error", null);
        }

        var stm = sqlHelper.updateSql("battleLog", {"id": param.id}, param.data);
        return dbClient.update(stm.sql, stm.args, function (err, res) {
            if (err) {
                logger.error("[battleLogDao.updateBattleLogById faild] ", err.stack);

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
    }
};

module.exports = battleLogSync;