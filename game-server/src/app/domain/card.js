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
var table = require('../manager/table');
var _ = require("underscore");

var GROUP_EFFECT_ATK = 1
var GROUP_EFFECT_HP = 2

/*
 * Card 与 card 表对应的数据类，提供简单操作
 * @param {object} param 数据库 card 表中的一行记录
 * */
var Card = (function (_super) {
    utility.extends(Card, _super);

    function Card(param) {
        Card.__super__.constructor.apply(this, arguments);
    }

    Card.fields = [
        'id',
        'createTime',
        'playerId',
        'tableId',
        'star',
        'lv',
        'exp',
        'skillLv',
        'hpAddition',
        'atkAddition'
    ];

    Card.prototype.init = function () {
        this.passiveSkills = {};
    };

    Card.prototype.activeGroupEffect = function(cardConfig) {
        var _property = {
            GROUP_EFFECT_ATK: 'atk',
            GROUP_EFFECT_HP: 'hp'
        }
        var type = cardConfig.group_effect;
        var factor = table.getTableItem('factors', this.lv).factor;
        this[_property[type]+'Addition'] += parseInt(cardConfig[_property[type]] * factor * 20 / 100);
    };

    Card.prototype.addPassiveSkill = function (ps) {
        if (typeof ps.id !== 'undefined' && ps.id !== null) {
            this.passiveSkills[ps.id] = ps;
        }
    };

    Card.prototype.addPassiveSkills = function(passiveSkills) {
        self = this;
        passiveSkills.forEach(function(ps){
            self.addPassiveSkill(ps);
        });
    };

    Card.prototype.eatCards = function(cards) {
        var totalExp = 0;
        cards.forEach(function(card){
            totalExp += cardExp(card.lv, card.exp_need);
        });
        var upgraded_lv = this.upgrade(totalExp);
        return [totalExp, upgraded_lv];
    };

    Card.prototype.upgrade = function(exp) {
        var _this = this;
        var rows = table.getTable('card_grow').filter(function(row){
            return row.lv >= _this.lv;
        });

        var upgraded_lv = 0;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (exp >= row.exp_need) {
                exp -= row.exp_need;
                this.increase('lv');
                upgraded_lv++;
            } else {
                this.set('exp', exp);
            }
        }
        return upgraded_lv;
    };


    Card.prototype.toJson = function() {
        return {
            id: this.id,
            playerId: this.playerId,
            tableId: this.tableId,
            star: this.star,
            lv: this.lv,
            exp: this.exp,
            skillLv: this.skillLv,
            hpAddition: this.hpAddition,
            atkAddition: this.atkAddition, 
            passiveSkills: _.values(this.passiveSkills).map(function(ps) {
                return ps.toJson();
            })
        };
    };

    return Card;
})(Entity);

var cardExp = function (lv, exp) {
    var rows = table.getTable('card_grow').filter(function(row){
        return row.lv < lv;
    });

    var totalExp = exp;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        totalExp += parseInt(row.exp);
    }
    return totalExp;
};

module.exports = Card;