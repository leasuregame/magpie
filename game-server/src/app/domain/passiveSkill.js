/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:48
 * To change this template use File | Settings | File Templates.
 */


/*
 * passive skill
 * */

var utility = require('../common/utility');
var Entity = require('./entity');
var _ = require("underscore");

var FIELDS = {
    id: true,
    createTime: true,
    cardId: true,
    name: true,
    value: true
};

/*
 * PassiveSkill 与 passiveSkill 表对应的数据类，提供简单操作
 * @param {object} row 数据库 passiveSkill 表中的一行记录
 * */
var PassiveSkill = (function (_super) {
    utility.extends(PassiveSkill, _super);

    function PassiveSkill(param) {
        PassiveSkill.__super__.constructor.apply(this, arguments);
        this._fields = FIELDS;
    }

    return PassiveSkill;
})(Entity);

module.exports = PassiveSkill;