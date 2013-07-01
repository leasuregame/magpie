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

var utility = require('../common/utility');
var Entity = require('./entity');
var _ = require("underscore");

var FIELD = {
    id: true,
    createTime: true,
    own: true,
    enemy: true,
    battleLog: true
};

/*
 * BattleLog 与 battleLog 表对应的数据类，提供简单操作
 * @param {object} row 数据库 battleLog 表中的一行记录
 * */
var BattleLog = (function (_super) {
    utility.extends(BattleLog, _super);

    function BattleLog(param) {
        console.log(BattleLog);
        BattleLog.__super__.constructor.apply(this, arguments);
        BattleLog.__super__.setField.apply(this, [FIELD]);
    }

    return BattleLog;
})(Entity);

module.exports = BattleLog;