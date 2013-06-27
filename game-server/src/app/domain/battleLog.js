/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:44
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle log
 * */


(function () {
    /*
     * BattleLog 与 battleLog 表对应的数据类，提供简单操作
     * @param {object} row 数据库 battleLog 表中的一行记录
     * */
    var BattleLog = function (row) {
        if (typeof (row) == "undefined") {
            throw new Error("BattleLog row is undefined");
        }

        var _id = row.id;
        var _createTime = row.createTime;
        var _own = row.own;
        var _enemy = row.enemy;
        var _battleLog = eval("(" + row.battleLog + ")");

        var getId = function () {
            return _id;
        }

        var getCreateTime = function () {
            return _createTime;
        }

        var getOwn = function () {
            return _own;
        }

        var getEnemy = function () {
            return _enemy;
        }

        var getBattleLog = function () {
            return _battleLog;
        }
    }

    module.exports = BattleLog;

}).call(this);