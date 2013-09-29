/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-27
 * Time: 下午4:02
 * To change this template use File | Settings | File Templates.
 */


/*
 * card
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
    _tableId: 0,            // 数据表对应ID
    _lv: 0,                 // 卡牌等级
    _exp: 0,                // 当前经验
    _skillLv: 0,            // 技能等级
    _skillInc: 0,           // 技能初始伤害
    _elixirHp: 0,           // 生命值仙丹
    _elixirAtk: 0,          // 攻击力仙丹
    _skillPoint: 0,         // 技能点
    _passiveSkill: {},      // 被动技能

    _name: "",              // 卡牌名称
    _description: "",       // 卡牌描述
    _star: 0,               // 卡牌星级
    _maxLv: 0,              // 卡牌最大等级
    _maxExp: 0,             // 最大经验
    _initHp: 0,             // 卡牌初始生命值
    _initAtk: 0,            // 卡牌初始攻击值
    _hp: 0,                 // 卡牌总生命值
    _atk: 0,                // 卡牌总攻击力
    _skillId: 0,            // 数据库表对应技能ID

    _skillName: "",         // 技能名称
    _skillHarm: 0,          // 技能伤害
    _skillRate: 0,          // 技能概率
    _skillDescription: "",  // 技能描述
    _skillType: 0,          // 技能类型
    _skillMaxLv: 0,         // 技能最大等级

    _url: "",

    init: function (data) {
        cc.log("Card init");

        this._passiveSkill = {};

        this.update(data);

        if (data.skillInc) {
            cc.log("=============================================");
            cc.log(data);


            cc.log(this);

            if (data != undefined && data.hp != undefined && SETTING_IS_BROWSER)
                cc.Assert(data.hp == this._hp, "Card hp error");

            if (data != undefined && data.atk != undefined && SETTING_IS_BROWSER)
                cc.Assert(data.atk == this._atk, "Card atk error");

            cc.log("=============================================");
        }


        return true;
    },

    // 更新卡牌数据
    update: function (data) {
        cc.log("Card update");

        if (data) {
            this.set("id", data.id);
            this.set("tableId", data.tableId);
            this.set("lv", data.lv);
            this.set("exp", data.exp);
            this.set("skillLv", data.skillLv);
            this.set("skillInc", data.skillInc);
            this.set("elixirHp", data.elixirHp);
            this.set("elixirAtk", data.elixirAtk);
            this.set("skillPoint", data.skillPoint);

            this._updatePassiveSkill(data.passiveSkills);
        }

        this._loadCardTable();
        this._loadSkillTable();
        this._calculateAddition();
    },

    _updatePassiveSkill: function (data) {
        cc.log("Card _updatePassiveSkill");

        if (data) {
            var len = data.length;
            for (var i = 0; i < len; ++i) {
                this._passiveSkill[data[i].id] = {
                    id: data[i].id,
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

        this._name = cardTable.name;
        this._description = cardTable.description;
        this._star = cardTable.star;
        this._initHp = cardTable.hp;
        this._initAtk = cardTable.atk;
        this._skillId = cardTable.skill_id;
        this._skillName = cardTable.skill_name || "三星以上拥有技能";

        // 读取等级加成表
        var factorsTable = outputTables.factors.rows[this._lv];
        var multiple = factorsTable.factor;

        this._initHp *= multiple;
        this._initAtk *= multiple;

        this._initHp = Math.floor(this._initHp);
        this._initAtk = Math.floor(this._initAtk);

        this._hp = this._initHp;
        this._atk = this._initAtk;

        this._url = "card" + (cardTable.number % 6 + 1);

        // 读取卡牌升级配置表
        var cardGrowTable = outputTables.card_grow.rows[this._lv];

        this._maxExp = cardGrowTable.exp_need;

        // 读取星级上限表
        var cardLvLimitTable = outputTables.card_lv_limit.rows[this._star];

        this._maxLv = cardLvLimitTable.max_lv;
    },

    _loadSkillTable: function () {
        cc.log("Card _loadSkillTable");

        this._skillDescription = "你的卡牌弱爆了，赶紧升星吧。";

        if (!this._skillId) return;

        // 读取技能配置表
        var skillTable = outputTables.skills.rows[this._skillId];

        var skillHarmGrow = skillTable["star" + this._star + "_grow"] || 0;

        if (!this._skillInc) {
            this._skillInc = skillTable["star" + this._star + "_inc_max"] || 0;
        }

        this._skillHarm = this._skillInc + skillHarmGrow * this._skillLv;
        this._skillRate = skillTable["rate" + this._star] || 0;
        this._skillDescription = skillTable.description;
        this._skillType = skillTable.type;
        this._skillMaxLv = 5;
    },

    _calculateAddition: function () {
        cc.log("Card _calculateAddition");

        // 读取仙丹配置表
        var elixirTable = outputTables.elixir.rows[1];

        var eachConsume = elixirTable.elixir;

        var elixirHp = Math.floor(this._elixirHp / eachConsume) * elixirTable.hp;
        var elixirAtk = Math.floor(this._elixirAtk / eachConsume) * elixirTable.atk;

        var psHpMultiple = 0;
        var psAtkMultiple = 0;

        for (var key in this._passiveSkill) {
            if (this._passiveSkill[key].name == "hp_improve") {
                psHpMultiple += this._passiveSkill[key].value;
            }

            if (this._passiveSkill[key].name == "atk_improve") {
                psAtkMultiple += this._passiveSkill[key].value;
            }
        }

        var psHp = Math.floor(this._initHp * psHpMultiple / 100);
        var psAtk = Math.floor(this._initAtk * psAtkMultiple / 100);

        this._hp = this._initHp + elixirHp + psHp;
        this._atk = this._initAtk + elixirAtk + psAtk;
    },

    addExp: function (exp) {
        cc.log("Card addExp: " + exp);

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
        lzWindow.pomelo.request("area.trainHandler.strengthen", {
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
            var skillTable = outputTables.skills.rows[this._skillId];

            var skillHarmGrow = skillTable["star" + this._star + "_grow"] || 0;

            return (this._skillInc + skillHarmGrow * (this._skillLv + 1));
        }

        return 0;
    },

    upgradeSkill: function (cb) {
        cc.log("Card upgradeSkill " + this._id);

        var that = this;
        lzWindow.pomelo.request("area.trainHandler.skillUpgrade", {
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

    canAfreshPassiveSkill: function () {
        cc.log("Card canAfreshPassiveSkill");

        return (this._star > 2);
    },

    afreshPassiveSkill: function (cb, afreshIdList, type) {
        cc.log("Card afreshPassiveSkill " + this._id);
        cc.log(afreshIdList);
        cc.log(type);

        var that = this;
        lzWindow.pomelo.request("area.trainHandler.passSkillAfresh", {
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

        if (this.canEvolution()) {
            return outputTables.star_upgrade.rows[this._star].rate_per_card;
        }

        return 0;
    },

    getEvolutionUseMaxCard: function () {
        cc.log("Card getEvolutionUseMaxCard");

        if (this.canEvolution()) {
            return outputTables.star_upgrade.rows[this._star].max_num;
        }

        return 0;
    },

    getEvolutionNeedMoney: function () {
        cc.log("Card getEvolutionNeedMoney");

        if (this.canEvolution()) {
            return outputTables.star_upgrade.rows[this._star].money_need;
        }

        return 0;
    },

    evolution: function (cb, cardIdList) {
        cc.log("Card evolution " + this._id);
        cc.log(cardIdList);

        var that = this;
        lzWindow.pomelo.request("area.trainHandler.starUpgrade", {
            target: this._id,
            sources: cardIdList
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("evolution success");

                var msg = data.msg;

                gameData.player.add("money", -that.getEvolutionNeedMoney());
                gameData.cardList.deleteById(cardIdList);

                that.update(msg.card);

                cb();
            } else {
                cc.log("evolution fail");

                cb(null);
            }
        });
    },

    canTrain: function () {
        cc.log("Card canTrain");

        return (this._star > 2);
    },

    train: function (cb, trainCount, trainType) {
        cc.log("Card train " + this._id);

        var elixir = trainCount * 10;
        var that = this;
        lzWindow.pomelo.request("area.trainHandler.useElixir", {
            cardId: this._id,
            elixir: elixir,
            type: trainType
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("train success");

                var msg = data.msg;

                gameData.player.add("elixir", -elixir);

                this._elixir += elixir;

                if (trainType == TRAIN_CARD_HP) {
                    that._hpAddition += trainCount * 3;
                    that._hp += trainCount * 3;
                } else if (trainType == TRAIN_CARD_ATK) {
                    that._atkAddition += trainCount;
                    that._atk += trainCount;
                }

                cb();
            } else {
                cc.log("train fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    getSellCardMoney: function () {
        cc.log("Card getSellCardMoney");

        return 0;
    }
});

Card.create = function (data) {
    var ret = new Card();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};