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


var __hasProp = {}.hasOwnProperty;
var __extends = function (child, parent) {
    for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
        this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};

var Entity = require('./entity');
var _ = require("underscore");

/*
 * BattleLog 与 battleLog 表对应的数据类，提供简单操作
 * @param {object} row 数据库 battleLog 表中的一行记录
 * */
var BattleLog = (function (_super) {
    __extends(BattleLog, _super);

    function BattleLog(param) {
        BattleLog.__super__.constructor.apply(this, arguments);
    }

    return BattleLog;
})(Entity);

module.exports = BattleLog;