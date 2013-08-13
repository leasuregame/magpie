/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-27
 * Time: 下午4:02
 * To change this template use File | Settings | File Templates.
 */


/*
 * 卡牌类
 * */


var passiveSkillDescription = {
    atk_improve: "攻击",
    hp_improve: "生命",
    crit: "暴击",
    dodge: "闪避",
    dmg_reduce: "减伤"
};

var Card = Entity.extend({
    _id: 0,                 // 数据库对应ID
    _createTime: 0,         // 创建时间
    _tableId: 0,            // 数据表对应ID
    _lv: 0,                 // 卡牌等级
    _exp: 0,                // 当前经验
    _skillLv: 0,            // 技能等级
    _hpAddition: 0,         // 生命培养量
    _atkAddition: 0,        // 攻击培养量
    _elixir: 0,             // 已经消耗的仙丹
    _passiveSkill: {},      // 被动技能

    _kindId: 0,             // 系列号
    _name: "",              // 卡牌名称
    _description: "",       // 卡牌描述
    _star: 0,               // 卡牌星级
    _maxLv: 0,              // 卡牌最大等级
    _maxExp: 0,             // 最大经验
    _hpInit: 0,             // 卡牌初始生命值
    _atkInit: 0,            // 卡牌初始攻击值
    _hp: 0,                 // 卡牌总生命值
    _atk: 0,                // 卡牌总攻击力
    _ability: 0,            // 战斗力
    _skillId: 0,            // 数据库表对应技能ID

    _skillName: "",         // 技能名称
    _skillHarm: 0,          // 技能伤害
    _skillRate: 0,          // 技能概率
    _skillDescription: "",  // 技能描述
    _skillMaxLv: 0,         // 技能最大等级

    _url: "",

    init: function (data) {
        cc.log("Card init");

        return this.update(data);
    },

    // 更新卡牌数据
    update: function (data) {
        cc.log("Card update");
        if (data) {
            this._id = data.id || this._id;
            this._createTime = data.createTime || this._createTime;
            this._tableId = data.tableId || this._tableId;
            this._lv = data.lv || this._lv;
            this._exp = data.exp || this._exp;
            this._skillLv = data.skillLv || this._skillLv;
            this._hpAddition = data.hpAddition || this._hpAddition;
            this._atkAddition = data.atkAddition || this._atkAddition;
            this._elixir = data.elixir || this._elixir;
            this._passiveSkill = {};
            this._updatePassiveSkill(data.passiveSkills);
        }

        this._loadCardTable();
        this._loadSkillTable();

        this._ability = this._getCardAbility();

        return true;
    },

    _updatePassiveSkill: function (data) {
        cc.log("Card _updatePassiveSkill");
        if (data) {
            var len = data.length;
            cc.log(len);
            for (var i = 0; i < len; ++i) {
                this._passiveSkill[data[i].id] = {
                    id: data[i].id,
                    createTime: data[i].createTime,
                    name: data[i].name,
                    value: data[i].value,
                    description: passiveSkillDescription[data[i].name]
                }
            }
        }
    },

    _loadCardTable: function () {
        cc.log("Card _loadCardTable");

        // 读取卡牌配置表
        var cardTable = outputTables.cards.rows[this._tableId];

        this._kindId = cardTable.number;
        this._name = cardTable.name;
        this._description = cardTable.description;
        this._star = cardTable.star;
        this._hpInit = cardTable.hp;
        this._atkInit = cardTable.atk;
        this._skillId = cardTable.skill_id;

        // 读取等级加成表
        var factorsTable = outputTables.factors.rows[this._lv];
        var multiple = factorsTable.factor;

        this._hpInit *= multiple;
        this._atkInit *= multiple;

        this._hpInit = Math.round(this._hpInit);
        this._atkInit = Math.round(this._atkInit);

        this._hp = this._hpInit + this._hpAddition;
        this._atk = this._atkInit + this._atkAddition;

        this._url = "hero" + (this._id % 6 + 1);

        // 读取卡牌升级配置表
        var cardGrowTable = outputTables.card_grow.rows[this._lv];

        this._maxExp = cardGrowTable.exp_need;

        // 读取星级上限表
        var cardLvLimitTable = outputTables.card_lv_limit.rows[this._star];

        this._maxLv = cardLvLimitTable.max_lv;
    },

    _loadSkillTable: function () {
        cc.log("Card _loadSkillTable");

        // 读取技能配置表
        var skillTable = outputTables.skills.rows[this._skillId];

        var skillHarmString = skillTable["star" + this._star];
        var skillHarm = [0, 0];

        if (skillHarmString) {
            skillHarm = skillHarmString.split(",", 2);
        }

        this._skillHarm = parseInt(skillHarm[0]) + parseInt(skillHarm[1]) * this._skillLv;

        this._skillRate = skillTable["rate" + this._star];

        if (!this._skillRate) this._skillRate = 0;

        this._skillName = skillTable.name;
        this._skillDescription = skillTable.description;
        this._skillMaxLv = 5;
    },

    // 计算单个卡牌战斗力
    _getCardAbility: function () {
        cc.log("Card _getCardAbility");

        return 0;
    },

    addExp: function (exp) {
        cc.log("Card addExp " + exp);

        var needMoney = 0;
        var cardGrow = outputTables.card_grow.rows;

        this._exp += exp;

        while (true) {
            if (this._lv >= this._maxLv) {
                this._lv = this._maxLv;
                this._exp = 0;
                break;
            }

            if (this._exp < this._maxExp) {
                break;
            }

            cc.log("this._exp: " + this._exp);
            cc.log("this._maxExp: " + this._maxExp);

            needMoney += cardGrow[this._lv].money_need;

            this._exp -= this._maxExp;
            this._lv += 1;
            this._maxExp = cardGrow[this._lv].exp_need;
        }

        this.update();

        return needMoney;
    },

    // 计算总经验
    getCardExp: function () {
        cc.log("Card getCardExp");

        // 读取卡牌升级配置表
        var cardGrow = outputTables.card_grow.rows[this._lv];

        return (cardGrow.cur_exp + this._exp);
    },

    getCardFullLvExp: function () {
        cc.log("Card getCardFullLvExp");

        // 读取卡牌升级配置表
        var cardGrow = outputTables.card_grow.rows[this._maxLv];

        return (cardGrow.cur_exp + this.getCardExp());
    },

    upgrade: function (cb, cardIdList) {
        cc.log("Card upgrade " + this._id);
        cc.log(cardIdList);

        var that = this;
        lzWindow.pomelo.request("logic.trainHandler.strengthen", {
            playerId: gameData.player.get("id"),
            target: this._id,
            sources: cardIdList
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("upgrade success");

                var msg = data.msg;

                that.update({
                    lv: msg.cur_lv,
                    exp: msg.cur_exp
                });

                gameData.player.add("money", -msg.money_consume);
                gameData.cardList.deleteById(cardIdList);

                cb({
                    exp: msg.exp_obtain,
                    money: msg.money_consume
                });
            } else {
                cc.log("upgrade fail");

                cb(null);
            }
        });
    },

    canUpgradeSkill: function () {
        cc.log("Card canUpgradeSkill");

        return (this._star > 2 && this._skillLv < this._skillMaxLv)
    },

    getUpgradeNeedSKillPoint: function () {
        cc.log("Card getUpgradeNeedSKillPoint");

        if (this.canUpgradeSkill()) {
            var skillUpgradeTable = outputTables.skill_upgrade.rows[this._skillLv + 1];
            return skillUpgradeTable["star" + this._star];
        }

        return 0;
    },

    getNextSkillLvHarm: function () {
        cc.log("Card getNextSkillLvHarm");

        if (this.canUpgradeSkill()) {
            // 读取技能配置表
            var skillHarmString = outputTables.skills.rows[this._skillId]["star" + this._star];
            var skillHarm = [0, 0];

            if (skillHarmString) {
                skillHarm = skillHarmString.split(",", 2);
            }

            return (parseInt(skillHarm[0]) + parseInt(skillHarm[1]) * (this._skillLv + 1));
        }

        return 0;
    },

    upgradeSkill: function (cb) {
        cc.log("Card upgradeSkill " + this._id);

        var that = this;
        lzWindow.pomelo.request("logic.trainHandler.skillUpgrade", {
            playerId: gameData.player.get("id"),
            cardId: this._id
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("upgradeSkill success");

                var msg = data.msg;

                that.update({
                    skillLv: msg.skillLv
                });

                gameData.player.add("skillPoint", -msg.skillPoint);

                cb();
            } else {
                cc.log("upgradeSkill fail");

                cb();
            }
        });
    },

    afreshPassiveSkill: function (cb, afreshIdList, type) {
        cc.log("Card afreshPassiveSkill " + this._id);
        cc.log(afreshIdList);
        cc.log(type);

        var that = this;
        lzWindow.pomelo.request("logic.trainHandler.passSkillAfresh", {
            playerId: gameData.player.get("id"),
            cardId: this._id,
            psIds: afreshIdList,
            type: type
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("passSkillAfresh success");

                var msg = data.msg;

                that._updatePassiveSkill(msg);

                if (type == USE_MONEY) {
                    gameData.player.add("money", -20000);
                } else if (type == USE_GOLD) {
                    gameData.player.add("gold", -10);
                }

                cb();
            } else {
                cc.log("passSkillAfresh fail");

                cb();
            }
        });
    },

    canEvolution: function () {
        cc.log("Card canEvolution");

        return (this._star < 5);
    },

    getPreCardRate: function () {
        cc.log("Card getPreCardRate");
    },

    getEvolutionUseMaxCard: function () {
        cc.log("Card getEvolutionUseMaxCard");
    },

    getEvolutionNeedMoney: function () {
        cc.log("Card getEvolutionNeedMoney");
    }
})

Card.create = function (data) {
    var ret = new Card();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
}