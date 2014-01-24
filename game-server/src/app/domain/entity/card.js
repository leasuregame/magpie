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


var utility = require('../../common/utility');
var Entity = require('./entity');
var table = require('../../manager/table');
var elixirConfig = table.getTableItem('elixir', 1);
var cardConfig = require('../../../config/data/card');
var _ = require("underscore");
var psConfig = require('../../../config/data/passSkill');
var cardLvs = table.getTable('card_lv_limit');
var GROUP_EFFECT_ATK = 1
var GROUP_EFFECT_HP = 2

var addEvents = function(card) {
    card.on('add.passiveSkill', function() {
        countPassiveSkills(card);
    });

    card.on('elixirHp.change', function(elixir) {
        card.incs.elixir_hp = parseInt(elixir / elixirConfig.elixir * elixirConfig.hp);
        card.recountHpAndAtk();
    });

    card.on('elixirAtk.change', function(elixir) {
        card.incs.elixir_atk = parseInt(elixir / elixirConfig.elixir * elixirConfig.atk);
        card.recountHpAndAtk();
    });

    card.on('lv.change', function(lv) {
        countHpAtk(card);
        card.recountHpAndAtk();
    });

    card.on('tableId.change', function(id) {
        if (id) {
            var cardData = table.getTableItem('cards', id);
            // 同步配置表中卡牌的星级到数据库
            if (cardData) {
                card.set('star', cardData.star);
                if (cardData.star >= 3) {
                    card.skill = table.getTableItem('skills', cardData.skill_id);
                }
                card.cardData = cardData;
            }
        }
    });

    // card.on('skillPoint.change', function() {
    //     checkSkillLv(card);
    // });
};

var countElixirEffect = function(card) {
    card.incs.elixir_hp = parseInt(card.elixirHp / elixirConfig.elixir) * elixirConfig.hp;
    card.incs.elixir_atk = parseInt(card.elixirAtk / elixirConfig.elixir) * elixirConfig.atk;

    card.recountHpAndAtk();
};

var countPassiveSkills = function(card) {
    var _pro = {
        'atk_improve': 'atk',
        'hp_improve': 'hp'
    };
    var total = {
        atk_improve: 0,
        hp_improve: 0
    };
    _.values(card.passiveSkills).filter(function(ps) {
        return _.keys(_pro).indexOf(ps.name) > -1;
    }).forEach(function(ps) {
        total[ps.name] += ps.value;
    });

    _.extend(card.incs, {
        ps_hp: parseInt((total.hp_improve * card.init_hp) / 100),
        ps_atk: parseInt((total.atk_improve * card.init_atk) / 100)
    });
    card.recountHpAndAtk();
};

var countHpAtk = function(card) {
    if (card.tableId) {
        var cardData = table.getTableItem('cards', card.tableId);
        var factor = table.getTableItem('factors', card.lv).factor;

        var _hp = parseInt(cardData.hp * factor),
            _atk = parseInt(cardData.atk * factor);
        card.set({
            init_hp: _hp,
            hp: _hp,
            init_atk: _atk,
            atk: _atk
        });
    }
};

var checkSkillLv = function(card) {
    if (card.star < 3) {
        return;
    }

    var items, skillLv, i, el, sp = card.skillPoint;
    items = table.getTable('skill_upgrade').map(function(row) {
        return row['star' + card.star];
    }).sort(function(x, y) {
        return x - y;
    });

    skillLv = 1;
    for (i = 0; i < items.length; i++) {
        el = items[i];
        if (sp >= el) {
            skillLv += 1;
            sp -= el;
        } else {
            break;
        }
    }
    card.skillLv = skillLv;
};

/*
 * Card 与 card 表对应的数据类，提供简单操作
 * @param {object} param 数据库 card 表中的一行记录
 * */
var Card = (function(_super) {
    utility.extends(Card, _super);

    function Card(param) {
        Card.__super__.constructor.apply(this, arguments);

        if (this.tableId) {
            var cardData = table.getTableItem('cards', this.tableId);
            // 同步配置表中卡牌的星级到数据库
            this.set('star', cardData.star);
            if (cardData.star >= 3) {
                this.skill = table.getTableItem('skills', cardData.skill_id);
            }
            this.cardData = cardData;
        }


        countHpAtk(this);
        countElixirEffect(this);
        countPassiveSkills(this);
        addEvents(this);
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
        'factor',
        'skillPoint',
        'elixirHp',
        'elixirAtk',
        'passiveSkills',
        'useCardsCounts'
    ];

    Card.DEFAULT_VALUES = {
        star: 1,
        lv: 1,
        exp: 0,
        skillLv: 1,
        factor: 0,
        skillPoint: 0,
        elixirHp: 0,
        elixirAtk: 0,
        init_hp: 0,
        init_atk: 0,
        hp: 0,
        atk: 0,
        incs: {
            spirit_hp: 0,
            spirit_atk: 0,
            ps_hp: 0,
            ps_atk: 0,
            elixir_hp: 0,
            elixir_atk: 0
        },
        passiveSkills: [],
        useCardsCounts: 0
    };

    Card.prototype.init = function() {
        this.passiveSkills = this.passiveSkills || [];
    };

    Card.prototype.recountHpAndAtk = function() {
        var hp = this.init_hp,
            atk = this.init_atk;

        hp += this.incs.elixir_hp;
        //hp += this.incs.spirit_hp;
        hp += this.incs.ps_hp;
        atk += this.incs.elixir_atk;
        //atk += this.incs.spirit_atk;
        atk += this.incs.ps_atk;

        this.hp = hp;
        this.atk = atk;
        //console.log('hp and atk',this.hp,this.atk);
    };

    Card.prototype.activeGroupEffect = function() {
        var _property = {};
        _property[GROUP_EFFECT_ATK] = 'atk';
        _property[GROUP_EFFECT_HP] = 'hp';

        var type = parseInt(this.cardData.effetc_type);
        var effect_val = 20;
        if (type == GROUP_EFFECT_HP) {
            effect_val = 25;
        }
        var aval = parseInt(this[_property[type]] * effect_val / 100);
        this.increase(_property[type] + 'Addition', aval);

        this.increase(_property[type], aval);
        this.incs['group_' + _property[type]] = aval;
        return this;
    };

    Card.prototype.ability = function() {
        var ae = cardConfig.ABILIGY_EXCHANGE;

        // 1点攻击力=1点战斗力
        // 2点生命值=1点战斗力
        var _abi = parseInt(this.atk / ae.atk) + parseInt(this.hp / ae.hp);

        // 技能增强效果 
        if (this.skill && this.skillLv > 0) {
            _abi += ae.star[this.star] * this.skillLv;
        }

        // 0.1%暴击率=10点战斗力
        // 0.1%闪避率=10点战斗力
        // 0.1%减伤率=10点战斗力
        var should_inc_ps = ['dmg_reduce', 'crit', 'dodge'];
        if (this.star >= 3) {
            var sum = _.values(this.passiveSkills)
                .filter(function(ps) {
                    return should_inc_ps.indexOf(ps.name) > -1;
                })
                .map(function(ps) {
                    return ps.value * ae[ps.name];
                })
                .reduce(function(x, y) {
                    return x + y;
                }, 0);

            _abi += sum;
        }

        return parseInt(_abi);
    };

    Card.prototype.addPassiveSkill = function(ps) {
        var pss = _.clone(this.passiveSkills);
        if (typeof ps.id !== 'undefined' && ps.id !== null) {
            if (pss.length == this.star - 2) {
                for (var i = 0; i < pss.length; i++) {
                    if (pss[i].id == ps.id) {
                        pss[i] = ps;
                        break;
                    }
                }
            } else if (pss.length < this.star - 2) {
                pss[pss.length] = ps;
            }
            this.passiveSkills = pss;
            this.emit('add.passiveSkill');
        }
    };

    Card.prototype.addPassiveSkills = function(passiveSkills) {
        self = this;
        passiveSkills.forEach(function(ps) {
            self.addPassiveSkill(ps);
        });
    };

    //产生被动技能
    Card.prototype.bornPassiveSkill = function() {
        var born_rates = psConfig.BORN_RATES;
        var name = utility.randomValue(_.keys(born_rates), _.values(born_rates));
        var value = _.random(100, psConfig.INIT_MAX * 100);
        var id;
        if (this.passiveSkills.length == 0)
            id = 0;
        else {
            var maxId = 0;
            this.passiveSkills.forEach(function(ps) {
                if (ps.id > maxId)
                    maxId = ps.id;
            });
            id = maxId + 1;
        }
        var ps = {
            id: id,
            name: name,
            value: parseFloat((value / 100).toFixed(1))
        };
        this.addPassiveSkill(ps);
    };


    Card.prototype.afreshPassiveSkill = function(type, ps) {
        var born_rates = psConfig.BORN_RATES
        var value_obj = psConfig.AFRESH[type]


        var name = utility.randomValue(_.keys(born_rates), _.values(born_rates));
        var valueScope = utility.randomValue(_.keys(value_obj), _.values(value_obj));
        var _ref = valueScope.split('~'),
            start = _ref[0],
            end = _ref[1];
        var value = _.random(start * 100, end * 100);

        var p = _.clone(ps);

        p.name = name;
        p.value = parseFloat((value / 100).toFixed(1));
        this.addPassiveSkill(p);
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
        var rows = table.getTable('card_grow').filter(function(id, item) {
            return parseInt(item.lv) >= _this.lv;
        });

        rows.sort(function(x, y) {
            return x.lv - y.lv;
        });

        var upgraded_lv = 0;
        exp += this.exp; // 加上卡牌本身剩余的经验
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (exp >= row.exp_need) {
                exp -= parseInt(row.exp_need);
                upgraded_lv++;
            } else {
                break;
            }
        }
        var max_lv = cardLvs.getItem(this.star).max_lv;
        if ((this.lv + upgraded_lv) >= max_lv) {
            upgraded_lv = max_lv - this.lv;
            exp = 0;
        }

        return [upgraded_lv, exp];
    };

    Card.prototype.upgrade = function(lv, exp) {
        if (this.lv >= cardLvs.getItem(this.star).max_lv) {
            return;
        }
        this.increase('lv', lv);
        return this.set('exp', exp);
    };

    Card.prototype.price = function() {
        cfg = table.getTableItem('card_price', 1);
        return (cfg.grow_per_lv * (this.lv - 1)) + cfg['star' + this.star];
    };

    Card.prototype.resetSkillLv = function() {
        checkSkillLv(this);
    };

    Card.prototype.getSkillInc = function() {
        var max, min, skillInc = 0,
            star = this.star;
        if (this.skill) {
            max = this.skill['star' + star + '_inc_max'];
            min = this.skill['star' + star + '_inc_min'];
            skillInc = Math.round((max - min) * this.factor / 1000) + min;
        }
        this.skillInc = skillInc;
        return skillInc;
    };

    Card.prototype.toJson = function() {
        return {
            id: this.id,
            tableId: this.tableId,
            hp: this.hp,
            atk: this.atk,
            ability: this.ability(),
            lv: this.lv,
            exp: this.exp,
            factor: this.factor,
            skillLv: this.star >= 3 ? this.skillLv : void 0,
            skillInc: this.star >= 3 ? this.getSkillInc() : void 0,
            skillPoint: this.skillPoint,
            elixirHp: this.elixirHp,
            elixirAtk: this.elixirAtk,
            passiveSkills: this.passiveSkills
        };
    };

    return Card;
})(Entity);

module.exports = Card;