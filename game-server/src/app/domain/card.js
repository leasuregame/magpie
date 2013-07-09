/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:08
 * To change this template use File | Settings | File Templates.
 */


/*
 * card
 * */


var utility = require('../common/utility');
var Entity = require('./entity');
var _ = require("underscore");

var FIELDS = {
    id: true,
    createTime: true,
    playerId: true,
    tableId: true,
    lv: true,
    exp: true,
    skillLv: true,
    hpAddition: true,
    atkAddition: true
};

/*
 * Card 与 card 表对应的数据类，提供简单操作
 * @param {object} param 数据库 card 表中的一行记录
 * */
var Card = (function (_super) {
    utility.extends(Card, _super);

    function Card(param) {
        Card.__super__.constructor.apply(this, arguments);
        this._fields = FIELDS;
    }

    Card.prototype.init = function () {
        this.passiveSkills = [];
    };

    Card.prototype.addPassiveSkill = function (ps) {
        if (typeof ps.id !== 'undefined' && ps.id !== null) {
            this.passiveSkills.push(ps);
        }
    };

    Card.prototype.addPassiveSkills = function(passiveSkills) {
        self = this;
        passiveSkills.forEach(function(ps){
            self.addPassiveSkill(ps);
        });
    };

    Card.prototype.eatCards = function(cards) {
        
    };

    return Card;
})(Entity);

module.exports = Card;