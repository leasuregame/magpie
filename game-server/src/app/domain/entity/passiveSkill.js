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

var utility = require('../../common/utility');
var Entity = require('./entity');
var psConfig = require('../../../config/data/passSkill');
var _ = require("underscore");


/*
 * PassiveSkill 与 passiveSkill 表对应的数据类，提供简单操作
 * @param {object} row 数据库 passiveSkill 表中的一行记录
 * */
var PassiveSkill = (function(_super) {
    utility.extends(PassiveSkill, _super);

    function PassiveSkill(param) {
        PassiveSkill.__super__.constructor.apply(this, arguments);
    }

    PassiveSkill.FIELDS = [
        'id',
        'cardId',
        'name',
        'value'
    ];

    PassiveSkill.DEFAULT_VALUES = {
        name: '',
        value: 0.0
    };

    PassiveSkill.born = function() {
        var born_rates = psConfig.BORN_RATES;
        var name = utility.randomValue(_.keys(born_rates), _.values(born_rates));
        var value = _.random(100, psConfig.INIT_MAX * 100);
        return {
            name: name,
            value: parseFloat((value / 100).toFixed(1))
        };
    };

    PassiveSkill.prototype.afresh = function(type) {
        var born_rates = psConfig.BORN_RATES
        var value_obj = psConfig.AFRESH[type]

        var name = utility.randomValue(_.keys(born_rates), _.values(born_rates))
        var valueScope = utility.randomValue(_.keys(value_obj), _.values(value_obj))
        var _ref = valueScope.split('~'),
            start = _ref[0],
            end = _ref[1];
        var value = _.random(start * 100, end * 100)

        this.set({
            name: name,
            value: parseFloat((value / 100).toFixed(1))
        })
    };

    PassiveSkill.prototype.toJson = function() {
        return {
            id: this.id,
            cardId: this.cardId,
            name: this.name,
            value: parseFloat(this.value)
        };
    };

    return PassiveSkill;
})(Entity);

module.exports = PassiveSkill;