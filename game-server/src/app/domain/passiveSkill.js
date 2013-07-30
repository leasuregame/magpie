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


/*
 * PassiveSkill 与 passiveSkill 表对应的数据类，提供简单操作
 * @param {object} row 数据库 passiveSkill 表中的一行记录
 * */
var PassiveSkill = (function (_super) {
    utility.extends(PassiveSkill, _super);

    function PassiveSkill(param) {
        PassiveSkill.__super__.constructor.apply(this, arguments);
    }

    PassiveSkill.FIELDS = [
        'id',
        'createTime',
        'cardId',
        'name',
        'value'
    ];

    PassiveSkill.DEFAULT_VALUES = {
        name: '',
        value: 0
    };

    PassiveSkill.prototype.toJson = function(){
        return {
            id: this.id,
            cardId: this.cardId,
            name: this.name,
            value: this.value
        };
    };

    return PassiveSkill;
})(Entity);

module.exports = PassiveSkill;