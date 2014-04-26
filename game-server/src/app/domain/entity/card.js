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
var configData = require('../../../config/data');
var _ = require("underscore");
var PassiveSkillGroup = require('./passiveSkill');
var cardLvs = table.getTable('card_lv_limit');
var GROUP_EFFECT_ATK = 1
var GROUP_EFFECT_HP = 2

var addEvents = function(card) {
    card.on('passiveSkills.change', function() {
        countPassiveSkills(card);
    });

    card.on('elixirHp.change', function(elixir) {
        card.incs.elixir_hp = parseInt((elixir + card.elixirHpCrit) / elixirConfig.elixir * elixirConfig.hp);
        card.recountHpAndAtk();
    });

    card.on('elixirAtk.change', function(elixir) {
        card.incs.elixir_atk = parseInt((elixir + card.elixirAtkCrit) / elixirConfig.elixir * elixirConfig.atk);
        card.recountHpAndAtk();
    });

    card.on('lv.change', function(lv) {
        countHpAtk(card);
        countPassiveSkills(card);
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
        countHpAtk(card);
        countPassiveSkills(card);
    });

    // card.on('skillPoint.change', function() {
    //     checkSkillLv(card);
    // });
};

var countElixirEffect = function(card) {
    card.incs.elixir_hp = parseInt((card.elixirHp + card.elixirHpCrit) / elixirConfig.elixir) * elixirConfig.hp;
    card.incs.elixir_atk = parseInt((card.elixirAtk + card.elixirAtkCrit) / elixirConfig.elixir) * elixirConfig.atk;

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
    var group = card.passiveSkills.filter(function(group) {
        return group.active;
    });

    if ( !! group && group.length > 0) {
        group[0].items.filter(function(ps) {
            return _.keys(_pro).indexOf(ps.name) > -1;
        }).forEach(function(ps) {
            total[ps.name] += ps.value;
        });
    }

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
        'elixirHpCrit',
        'elixirAtk',
        'elixirAtkCrit',
        'passiveSkills',
        'useCardsCounts',
        'psGroupCount',
        'pill'
    ];

    Card.DEFAULT_VALUES = {
        star: 1,
        lv: 1,
        exp: 0,
        skillLv: 1,
        factor: 0,
        skillPoint: 0,
        elixirHp: 0,
        elixirHpCrit: 0,
        elixirAtk: 0,
        elixirAtkCrit: 0,
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
        useCardsCounts: 0,
        psGroupCount: 3,
        pill: 0
    };

    Card.prototype.init = function() {
        this.passiveSkills = this.passiveSkills || [];
    };

    Card.prototype.getPsGroup = function(gid) {
        var group = this.passiveSkills.filter(function(ps) {
            return ps.id == gid;
        });
        if ( !! group && group.length > 0) {
            return new PassiveSkillGroup(group[0]);
        }
        return null;
    };

    Card.prototype.addPsGroup = function() {
        this.increase('psGroupCount');
        var groupId = 1 + _.max(this.passiveSkills.map(function(p) {
            return p.id;
        }));
        this.passiveSkills.push({
            id: groupId,
            items: [],
            active: false
        });
        var group = this.getPsGroup(groupId);
        group.create(this.star);
        this.updatePsGroup(group);
    };

    Card.prototype.afrash = function(type, groupId, psIds) {
        var group = this.getPsGroup(groupId);
        group.afrashGroup(type, this.star, psIds);
        this.updatePsGroup(group);
    };

    Card.prototype.updatePsGroup = function(group) {
        var pss = _.clone(this.passiveSkills);
        for (var i = 0; i < pss.length; i++) {
            if (pss[i].id == group.id) {
                pss[i] = group.toJson();
            }
        }

        this.passiveSkills = pss;
        this.psGroupCount = pss.length;
    };

    Card.prototype.activeGroup = function(gid) {
        var pss = _.clone(this.passiveSkills);
        pss.forEach(function(group) {
            if (group.id == gid) {
                group.active = true;
            } else {
                group.active = false;
            }
        });
        this.passiveSkills = pss;
    };

    Card.prototype.recountHpAndAtk = function() {
        var hp = this.init_hp,
            atk = this.init_atk;

        hp += this.incs.elixir_hp;
        hp += this.incs.ps_hp;
        atk += this.incs.elixir_atk;
        atk += this.incs.ps_atk;

        this.hp = hp;
        this.atk = atk;
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
        var ae = configData.card.ABILIGY_EXCHANGE;

        // 1点攻击力=1点战斗力
        // 2点生命值=1点战斗力
        var _abi = parseInt(this.atk / ae.atk) + parseInt(this.hp / ae.hp);

        // 技能增强效果 
        if (this.skill && this.skillLv > 0) {
            _abi += ae.star[this.star] * this.skillLv;
        }

        // 1%暴击率=80点战斗力
        // 1%闪避率=80点战斗力
        // 1%减伤率=80点战斗力
        var should_inc_ps = ['dmg_reduce', 'crit', 'dodge', 'toughness', 'hit', 'disrupting'];
        if (this.star >= 3) {
            var group = this.passiveSkills.filter(function(group) {
                return group.active;
            });
            if ( !! group && group.length > 0) {
                var items = group[0].items;

                var sum = items.filter(function(ps) {
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
        var pss = _.clone(this.passiveSkills);
        var star = this.star;

        if (pss.length == 0) {
            pss = [{
                id: 1,
                items: [],
                active: true
            }, {
                id: 2,
                items: [],
                active: false
            }, {
                id: 3,
                items: [],
                active: false
            }];
        }

        pss.forEach(function(group) {
            group = new PassiveSkillGroup(group).create(star).toJson();
        });
        this.passiveSkills = pss;
    };


    Card.prototype.afreshPassiveSkill = function(type, ps) {
        var born_rates = configData.passSkill.BORN_RATES;
        var star = this.star >= 5 ? this.star : 5;
        var value_obj = configData.passSkill.AFRESH.TYPE[type].STAR[star];

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
        var curLv = this.lv;
        var cfg = table.getTableItem('card_price', 1);
        var lv_money = table.getTable('card_grow').filter(function(id, item) {
            return item.lv < curLv && item.lv > 0;
        }).map(function(item) {
            return item.money_need;
        }).reduce(function(x, y) {
            return x + y;
        }, 0);

        return lv_money + (cfg.grow_per_lv * (this.lv - 1)) + cfg['star' + this.star];
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

    Card.prototype.skillPointLeft = function() {
        var skillLv = this.skillLv;
        var star = this.star;
        var total_sp = table.getTable('skill_upgrade').filter(function(id, item) {
            return id < skillLv;
        }).map(function(i) {
            return i['star' + star];
        }).reduce(function(x, y) {
            return x + y;
        }, 0);
        var res = this.skillPoint - total_sp;
        return res < 0 ? 0 : res;
    };

    Card.prototype.toJson = function() {
        return {
            id: this.id,
            tableId: this.tableId,
            hp: this.hp,
            atk: this.atk,
            init_hp: this.init_hp,
            init_atk: this.init_atk,
            incs: this.incs,
            ability: this.ability(),
            lv: this.lv,
            exp: this.exp,
            factor: this.factor,
            skillLv: this.star >= 3 ? this.skillLv : void 0,
            skillInc: this.star >= 3 ? this.getSkillInc() : void 0,
            skillPoint: this.skillPoint,
            elixirHp: this.elixirHp,
            elixirAtk: this.elixirAtk,
            elixirHpCrit: this.elixirHpCrit,
            elixirAtkCrit: this.elixirAtkCrit,
            passiveSkills: this.passiveSkills
        };
    };

    return Card;
})(Entity);

module.exports = Card;