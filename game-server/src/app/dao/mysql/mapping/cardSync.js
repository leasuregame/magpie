/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */


/*
* card sync
* */


var sqlHelper = require("../sqlHelper");
var dbClient = require("pomelo").app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);

cardSync = {
    /*
     * 根据 id 更新一条 card 记录
     * @param {number} id 需要更新的记录号
     * @param {object} param 字面量，更新需要的数据
     * @param {function} cb  回调函数
     * */
    updateCardById: function (id, param) {
        var cb = function() {};
        if(typeof (param[2]) != "undefined") {
            cb = param[2];
        }

        if (typeof (param[0]) == "undefined" || typeof (param[1]) == "undefined") {
            return cb("param error", null);
        }

        var _ref = sqlHelper.updateSql("card", ["id", param[0]], param[1]);
        var sql = _ref[0];
        var args = _ref[1];

        return dbClient.update(sql, args, function (err, res) {
            if (err) {
                logger.error("[cardDao.updateCardById faild] ", err.stack);

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

module.exports = cardSync;