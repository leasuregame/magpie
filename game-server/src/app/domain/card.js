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

var MAX_LEVEL = require('../../config/data/card').MAX_LEVEL
var GROUP_EFFECT_ATK = 1
var GROUP_EFFECT_HP = 2

/*
 * Card 与 card 表对应的数据类，提供简单操作
 * @param {object} param 数据库 card 表中的一行记录
 * */
var Card = (function(_super) {
    utility.extends(Card, _super);

    function Card(param) {
        Card.__super__.constructor.apply(this, arguments);

        if (this.tableId) {
            var cardConfig = table.getTableItem('cards', this.tableId);
            var factor = table.getTableItem('factors', this.lv).factor;
            this.set({
                init_hp: cardConfig.hp * factor,
                hp: cardConfig.hp * factor,
                init_atk: cardConfig.atk * factor,
                atk: cardConfig.atk * factor
            });

            // 同步配置表中卡牌的星级到数据库
            this.set('star', cardConfig.star);
            if (cardConfig.star >= 3) {
                this.skill = table.getTableItem('skills', cardConfig.skill_id);
            }
            this.cardConfig = cardConfig;
        }
        // 被动属性生效
        passiveSkillEffect(this);
    }

    Card.FIELDS = [
        'id',
        'createTime',
        'playerId',
        'tableId',
        'star',
        'lv',
        'exp',
        'skillLv',
        'skillPoint',
        'elixir',
        'hpAddition',
        'atkAddition'
    ];

    Card.DEFAULT_VALUES = {
        star: 1,
        lv: 1,
        exp: 0,
        skillLv: 1,
        skillPoint: 0,
        elixir: 0,
        hpAddition: 0,
        atkAddition: 0
    };

    Card.prototype.init = function() {
        this.passiveSkills = this.passiveSkills || {};
    };

    Card.prototype.activeGroupEffect = function() {
        var _property = {};
        _property[GROUP_EFFECT_ATK] = 'atk';
        _property[GROUP_EFFECT_HP] = 'hp';

        var type = parseInt(this.cardConfig.effetc_type);
        var effect_val = 20;
        if (type == GROUP_EFFECT_HP) {
            effect_val = 25;
        }
        this.set(_property[type] + 'Addition', parseInt(this[_property[type]] * effect_val / 100));
        return this;
    };

    Card.prototype.ability = function() {
        // 1点攻击力=1点战斗力
        // 3点生命值=1点战斗力
        var _abi = this.atk + parseInt(this.hp / 3);

        // 技能增强效果 技能攻击个数 * 技能增强效果 * 触发概率
        if (this.skill) {
            _abi += parseInt(this.skill.target_num) *
                utility.parseEffect(this.skill['star' + this.star])[0] *
                utility.parseEffect(this.skill['rate' + this.star])[0];
        }

        // 0.1%暴击率=10点战斗力
        // 0.1%闪避率=10点战斗力
        // 0.1%减伤率=10点战斗力
        var should_inc_ps = ['dmg_reduce', 'crit', 'dodge']
        if (this.star >= 3) {
            var ps_values = _.values(this.passiveSkills)
                .filter(function(ps) {
                    return should_inc_ps.indexOf(ps.name) > -1;
                })
                .map(function(ps) {
                    return ps.value;
                });
            var sum = 0;
            if (ps_values.length > 0) {
                sum += _.reduce(ps_values, function(x, y) {
                    return x + y;
                });
            }
            _abi += sum * 100;
        }
        return parseInt(_abi);
    };

    Card.prototype.addPassiveSkill = function(ps) {
        if (typeof ps.id !== 'undefined' && ps.id !== null) {
            this.passiveSkills[ps.id] = ps;
        }
        passiveSkillEffect(this);
    };

    Card.prototype.addPassiveSkills = function(passiveSkills) {
        self = this;
        passiveSkills.forEach(function(ps) {
            self.addPassiveSkill(ps);
        });
    };

    Card.prototype.eatCards = function(cards) {
        var totalExp = 0;
        cards.forEach(function(card) {
            var row = table.getTable('card_grow').findOne(function(id) {
                return parseInt(id) == card.lv;
            });
            if (row !== null) {
                totalExp += parseInt(row.cur_exp);
            }
        });        
        return totalExp;
    };

    Card.prototype.vitual_upgrade = function(exp) {
        var _this = this;
        var rows = table.getTable('card_grow').filter(function(id) {
            return parseInt(id) >= _this.lv;
        });

        var upgraded_lv = 0;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (exp >= row.exp_need) {
                exp -= parseInt(row.exp_need);
                upgraded_lv++;
            }
        }

        if ((this.lv + upgraded_lv) > MAX_LEVEL[this.star]) {
            upgraded_lv = MAX_LEVEL[this.star] - this.lv;
            exp = 0;
        }

        return [upgraded_lv, exp];
    };

    Card.prototype.upgrade = function(lv, exp) {
        if (this.lv == MAX_LEVEL[this.star]) {
            return;
        }
        this.increase('lv', lv);
        return this.set('exp', exp);
    };


    Card.prototype.toJson = function() {
        return {
            id: this.id,
            createTime: this.createTime,
            playerId: this.playerId,
            tableId: this.tableId,
            star: this.star,
            lv: this.lv,
            exp: this.exp,
            skillLv: this.skillLv,
            skillPoint: this.skillPoint,
            elixir: this.elixir,
            hpAddition: this.hpAddition,
            atkAddition: this.atkAddition,
            passiveSkills: _.values(this.passiveSkills).map(function(ps) {
                return ps.toJson();
            })
        };
    };

    return Card;
})(Entity);

var passiveSkillEffect = function(card) {
    var _pro = {
        'atk_improve': 'atk',
        'hp_improve': 'hp'
    };
    _.values(card.passiveSkills).filter(function(ps) {
        return _.keys(_pro).indexOf(ps.name) > -1;
    }).forEach(function(ps) {
        card[_pro[ps.name]] += parseInt(card[_pro['init_' + ps.name]] * ps.value / 100);
    });
};

module.exports = Card;