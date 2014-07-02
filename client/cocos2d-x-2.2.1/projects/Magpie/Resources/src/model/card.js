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


var MAX_CARD_TABLE_ID = 2000;
var MAX_CARD_STAR = 7;

var EVOLUTION_SUCCESS = 1;
var EVOLUTION_FAIL = 0;
var EVOLUTION_ERROR = -1;

var EXTRACT_ELIXIR = 0;
var EXTRACT_SKILL_POINT = 1;

var LOCK_TYPE_DEFAULT = 0;
var LOCK_TYPE_NAME = 1;
var LOCK_TYPE_VALUE = 2;
var LOCK_TYPE_BOTH = 3;

var TYPE_CRIT_NONE = 0;
var TYPE_CRIT_SMALL = 1;
var TYPE_CRIT_MIDDLE = 2;
var TYPE_CTIT_BIG = 3;

var EXP_CARD_PRIORITY = 1;
var LEAD_CARD_PRIORITY = 10;

var LEAD_CARD_TABLE_ID = {
    begin: 0,
    end: 9999
};

var BOSS_CARD_TABLE_ID = {
    begin: 40000,
    end: 40002
};

var MONSTER_CARD_TABLE_ID = {
    begin: 10000,
    end: 39999
};

var EXP_CARD_TABLE_ID = {
    begin: 50001,
    end: 50005
};

var passiveSkillDescription = {
    atk_improve: "攻击",
    hp_improve: "生命",
    crit: "暴击",
    dodge: "闪避",
    dmg_reduce: "减伤",
    toughness: "韧性",
    hit: "命中",
    disrupting: "破防"
};

// 卡牌下标
var skillIconMap = {
    1: {
        0: "card_icon_1_0",
        1: "card_icon_1_1",
        2: "card_icon_1_2",
        3: "card_icon_1_2",
        4: "card_icon_1_3",
        5: "card_icon_1_4",
        6: "card_icon_1_4",
        7: "card_icon_1_5",
        8: "card_icon_1_5",
        9: "card_icon_1_5",
        10: "card_icon_1_5"
    },
    2: {
        0: "card_icon_2_0",
        1: "card_icon_2_1",
        2: "card_icon_2_2",
        3: "card_icon_2_2",
        4: "card_icon_2_3",
        5: "card_icon_2_4",
        6: "card_icon_2_4",
        7: "card_icon_2_5",
        8: "card_icon_2_5",
        9: "card_icon_2_5",
        10: "card_icon_2_5"
    }
};

var Card = Entity.extend({
    _id: 0,                 // 数据库对应ID
    _tableId: 0,            // 数据表对应ID
    _lv: 0,                 // 卡牌等级
    _exp: 0,                // 当前经验
    _ability: 0,            // 战斗力
    _skillLv: 0,            // 技能等级
    _skillInc: 0,           // 技能初始伤害
    _elixirHp: 0,           // 生命值仙丹
    _elixirAtk: 0,          // 攻击力仙丹
    _elixirHpCrit: 0,       // 生命值暴击仙丹
    _elixirAtkCrit: 0,      // 攻击力暴击仙丹
    _skillPoint: 0,         // 技能点
    _passiveSkill: {},      // 被动技能

    _name: "",              // 卡牌名称
    _description: "",       // 卡牌描述
    _star: 0,               // 卡牌星级
    _kind: 0,               // 卡牌类型
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

    _url: "",               // 图片资源路径

    _pill: 0,               // 当前觉醒玉数量
    _potentialLv: 0,        // 当前觉醒等级

    _newCardMark: false,    // 新卡标记

    _priority: 0,           //卡牌优先级

    init: function (data) {
        cc.log("Card init");

        this._passiveSkill = {};

        this.update(data);

        this.off();
        this.on("abilityChange", this._abilityChangeEvent);

        this._newCardMark = this._id && (lz.load("card_" + this._id + "_mark") || false);
        this.set("priority", this.getCardPriority());

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
            this.set("elixirHpCrit", data.elixirHpCrit);
            this.set("elixirAtkCrit", data.elixirAtkCrit);
            this.set("skillPoint", data.skillPoint);
            this.set("pill", data.pill);
            this.set("potentialLv", data.potentialLv);

            this._updatePassiveSkills(data.passiveSkills);
        }

        this._loadCardTable();
        this._loadSkillTable();
        this._calculateAddition();

        if (data) {
            this.set("ability", data.ability);
        }
    },

    _updatePassiveSkills: function (data) {
        cc.log("Card _updatePassiveSkill");

        cc.log(data);

        if (data) {
            var len = data.length;
            for (var i = 0; i < len; ++i) {
                this._updatePassiveSkill(data[i]);
            }
        }
    },

    _updatePassiveSkill: function (passiveSkill) {
        cc.log("Card _updatePassiveSkill: ");
        cc.log(passiveSkill);

        this._passiveSkill[passiveSkill.id] = {
            id: passiveSkill.id,
            active: passiveSkill.active,
            items: {}
        };

        var items = passiveSkill.items;
        var len = items.length;
        for (var i = 0; i < len; ++i) {
            var item = items[i];
            this._passiveSkill[passiveSkill.id].items[item.id] = {
                id: item.id,
                name: item.name,
                value: item.value,
                description: passiveSkillDescription[item.name]
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
        this._kind = cardTable.number || 0;
        this._initHp = cardTable.hp;
        this._initAtk = cardTable.atk;
        this._skillId = cardTable.skill_id;
        this._skillName = cardTable.skill_name || "无";

        // 读取等级加成表
        var factorsTable = outputTables.factors.rows[this._lv];
        var multiple = factorsTable.factor;

        this._initHp *= multiple;
        this._initAtk *= multiple;

        this._initHp = Math.floor(this._initHp);
        this._initAtk = Math.floor(this._initAtk);

        this._url = "card" + cardTable.url;

        // 读取卡牌升级配置表
        var cardGrowTable = outputTables.card_grow.rows[this._lv];

        this._maxExp = cardGrowTable.exp_need;

        // 读取星级上限表
        var cardLvLimitTable = outputTables.card_lv_limit.rows[this._star];

        this._maxLv = (this.isLeadCard()) ? cardLvLimitTable.max_lv : 1;
    },

    _loadSkillTable: function () {
        cc.log("Card _loadSkillTable");

        if (!this._skillId) return;

        // 读取技能配置表
        var skillTable = outputTables.skills.rows[this._skillId];

        var skillHarmGrow = skillTable["star" + this._star + "_grow"] || 0;

        if (!this._skillInc) {
            var skillIncMin = skillTable["star" + this._star + "_inc_min"] || 0;
            var skillIncMax = this._skillInc = skillTable["star" + this._star + "_inc_max"] || 0;
            this._skillHarm = [skillIncMin + skillHarmGrow * (this._skillLv - 1), skillIncMax + skillHarmGrow * (this._skillLv - 1)];
        } else {
            this._skillHarm = this._skillInc + skillHarmGrow * (this._skillLv - 1);
        }

        this._skillRate = skillTable["rate" + this._star] || 0;
        this._skillDescription = skillTable.description;
        this._skillType = skillTable.type;
        this._skillMaxLv = outputTables.lv_limit.rows[1].skill_lv_limit;
    },

    _calculateAddition: function () {
        cc.log("Card _calculateAddition");

        this._atk = this._hp = 0;

        this._calculatePotentialLvAddition();
        this._calculatePassiveSkillAddition();
        this._calculateElixirAddition();
    },

    _calculatePotentialLvAddition: function () {
        cc.log("Card _calculatePotentialLvAddition");


        this._initHp = parseInt(this._initHp * (100 + this.getPotentialLvAddition()) / 100);
        this._initAtk = parseInt(this._initAtk * (100 + this.getPotentialLvAddition()) / 100);

        this._hp += this._initHp;
        this._atk += this._initAtk;
    },

    _calculatePassiveSkillAddition: function () {
        cc.log("Card _calculatePassiveSkillAddition");

        var psHpMultiple = 0;
        var psAtkMultiple = 0;

        for (var key in this._passiveSkill) {
            var ps = this._passiveSkill[key];
            if (ps.active) {
                for (var id in ps.items) {
                    var item = ps.items[id];
                    if (item.name == "hp_improve") {
                        psHpMultiple += item.value;
                    }
                    if (item.name == "atk_improve") {
                        psAtkMultiple += item.value;
                    }
                }
                break;
            }
        }

        var psHp = Math.floor(this._initHp * psHpMultiple / 100);
        var psAtk = Math.floor(this._initAtk * psAtkMultiple / 100);

        this._hp += psHp;
        this._atk += psAtk;
    },

    _calculateElixirAddition: function () {
        cc.log("Card _calculateElixirAddition");

        // 读取仙丹配置表
        var elixirTable = outputTables.elixir.rows[1];

        var eachConsume = elixirTable.elixir;

        var elixirHp = parseInt((this._elixirHp + this._elixirHpCrit) / eachConsume) * elixirTable.hp;
        var elixirAtk = parseInt((this._elixirAtk + this._elixirAtkCrit) / eachConsume) * elixirTable.atk;

        this._hp += elixirHp;
        this._atk += elixirAtk;
    },

    _abilityChangeEvent: function () {
        cc.log("Card _abilityChangeEvent");

        gameData.player.checkAbility();
    },

    setNewCardMark: function (mark) {
        this._newCardMark = mark;
        lz.save("card_" + this._id + "_mark", this._newCardMark);
    },

    getSkillType: function () {
        cc.log("Card _getSkillType");

        if (this._skillType == 1 || this._skillType == 2) {
            return "攻击";
        }

        if (this._skillType == 3 || this._skillType == 4) {
            return "治疗";
        }

        return "";
    },

    hasSkill: function () {
        return (!!this._skillId);
    },

    hasPassiveSkill: function () {
        for (var key in this._passiveSkill) {
            return true;
        }

        return false;
    },

    getCardIcon: function (type) {
        type = type != 2 ? 1 : 2;

        return main_scene_image[(skillIconMap[type][this._skillId] || skillIconMap[type][0])];
    },

    getCardSubscript: function () {
        return main_scene_image["card_subscript_" + this._star];
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

    getCardFullLvNeedExp: function () {
        cc.log("Card getCardFullLvNeedExp");

        // 读取卡牌升级配置表
        var cardGrow = outputTables.card_grow.rows[this._maxLv];

        return (cardGrow.cur_exp - this.getCardExp());
    },

    getCardNextLvNeedExp: function () {
        return (this._lv == this._maxLv) ? 0 : outputTables.card_grow.rows[this._lv + 1].cur_exp - this.getCardExp();
    },

    // 可获得觉醒玉
    getCardPill: function () {
        cc.log("Card getCardPill");
        return outputTables.card_pill_dissolve.rows[this._star].pill;
    },

    getSmeltMoney: function () {
        cc.log("Card getSmeltMoney");
        return outputTables.card_pill_dissolve.rows[this._star].money;
    },

    canUpgrade: function () {
        cc.log("Card canUpgrade");

        return (this._lv < this._maxLv && this.isLeadCard());
    },

    upgrade: function (cb, cardIdList) {
        cc.log("Card upgrade " + this._id);
        cc.log(cardIdList);

        var that = this;
        lz.server.request("area.trainHandler.strengthen", {
            target: this._id,
            sources: cardIdList
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("upgrade success");

                var msg = data.msg;

                that.update({
                    lv: msg.cur_lv,
                    exp: msg.cur_exp,
                    ability: msg.ability
                });

                gameData.player.add("money", -msg.money_consume);
                gameData.cardList.deleteById(cardIdList);

                cb({
                    exp: msg.exp_obtain,
                    money: msg.money_consume
                });

                lz.um.event("event_card_upgrade", that._lv);
            } else {
                cc.log("upgrade fail");

                TipLayer.tip(data.msg);

                cb(null);
            }
        });
    },

    canUpgradeSkill: function () {
        cc.log("Card canUpgradeSkill");

        return (this._star > 2 && (this._skillLv < this._skillMaxLv) && this.isLeadCard());
    },

    getUpgradeNeedSKillPoint: function () {
        cc.log("Card getUpgradeNeedSKillPoint");

        if (this.canUpgradeSkill()) {
            var skillUpgradeTable = outputTables.skill_upgrade.rows;
            var totalSKillPoint = 0;
            for (var i = 1; i <= this._skillLv; i++) {
                totalSKillPoint += skillUpgradeTable[i]["star" + this._star];
            }
            return totalSKillPoint - this._skillPoint;
        }
        return 0;
    },

    getNextSkillLvHarm: function () {
        cc.log("Card getNextSkillLvHarm");

        if (this.canUpgradeSkill()) {
            // 读取技能配置表
            var skillTable = outputTables.skills.rows[this._skillId];

            var skillHarmGrow = skillTable["star" + this._star + "_grow"] || 0;

            return (this._skillInc + skillHarmGrow * this._skillLv);
        }

        return 0;
    },

    upgradeSkill: function (cb) {
        cc.log("Card upgradeSkill " + this._id);

        var that = this;
        lz.server.request("area.trainHandler.skillUpgrade", {
            cardId: this._id
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("upgradeSkill success");

                var msg = data.msg;
                that.add("skillPoint", msg.skillPoint);

                that.update({
                    skillLv: msg.skillLv,
                    ability: msg.ability
                });

                gameData.player.add("skillPoint", -msg.skillPoint);

                cb();

                lz.um.event("event_card_skill_upgrade", that._skillLv);
            } else {
                cc.log("upgradeSkill fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    canAfreshPassiveSkill: function () {
        cc.log("Card canAfreshPassiveSkill");

        return (this._star > 2 && this.isLeadCard());
    },

    getActivePassiveSkill: function () {
        cc.log("Card getActivePassiveSkill");

        for (var key in this._passiveSkill) {
            var passiveSkill = this._passiveSkill[key];
            if (passiveSkill.active) {
                return passiveSkill.items;
            }
        }

        return null;
    },

    getActivePassiveSkillId: function () {
        cc.log("Card getActivePassiveSkillId");

        for (var key in this._passiveSkill) {
            var passiveSkill = this._passiveSkill[key];
            if (passiveSkill.active) {
                return passiveSkill.id;
            }
        }

        return null;
    },

    getPassiveSkillById: function (id) {
        cc.log("Card getPassiveSkillById: " + id);

        if (this._passiveSkill[id]) {
            return this._passiveSkill[id].items;
        }

        return null;
    },

    getOpenPassiveSkillNeedGold: function () {
        return (Object.keys(this._passiveSkill).length - 2) * 50;
    },

    updateActivePassiveSkill: function (id) {
        cc.log("Card updateActivePassiveSkill: " + id);

        for (var key in this._passiveSkill) {
            var passiveSkill = this._passiveSkill[key];
            if (passiveSkill.active) {
                passiveSkill.active = false;
            }
        }

        this._passiveSkill[id].active = true;
    },

    afreshPassiveSkill: function (cb, gid, afreshIdList, type) {
        cc.log("Card afreshPassiveSkill " + this._id);
        cc.log(gid);
        cc.log(afreshIdList);
        cc.log(type);

        var that = this;
        lz.server.request("area.trainHandler.passSkillAfresh", {
            cardId: this._id,
            groupId: gid,
            psIds: afreshIdList,
            type: type
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("passSkillAfresh success");

                var msg = data.msg;

                that._updatePassiveSkill(msg.passiveSkill);
                that.update();
                that.set("ability", msg.ability);

                if (type == USE_MONEY) {
                    gameData.player.add("money", -5000);
                } else if (type == USE_GOLD) {
                    gameData.player.add("gold", -20);
                }

                cb(true);

                lz.um.event("event_card_passive_skill_afresh", type);
            } else {
                cc.log("passSkillAfresh fail");

                TipLayer.tip(data.msg);

                cb(false);
            }
        });
    },

    activePassiveSkill: function (cb, id) {
        cc.log("Card activePassiveSkill: " + id);

        var that = this;
        lz.server.request("area.trainHandler.passSkillActive", {
            cardId: this._id,
            groupId: id
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("passSkillActive success");

                that.updateActivePassiveSkill(id);
                that.update();
                that.set("ability", data.msg.ability);
                cb();

            } else {
                cc.log("passSkillActive fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    openPassiveSkill: function (cb) {
        cc.log("Card openPassiveSkill");

        var that = this;
        lz.server.request("area.trainHandler.passSkillOpen", {
            cardId: this._id
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("passSkillOpen success");
                var msg = data.msg;

                gameData.player.set("gold", msg.gold);
                that._updatePassiveSkill(msg.passiveSkill);

                cb();
            } else {
                cc.log("passSkillOpen fail");

                TipLayer.tip(data.msg);
            }
        });

    },

    canEvolution: function () {
        cc.log("Card canEvolution");

        return ((this._tableId <= MAX_CARD_TABLE_ID) && (this._star < MAX_CARD_STAR) && this.isLeadCard());
    },

    getPreCardRate: function () {
        cc.log("Card getPreCardRate");

        if (this._star < MAX_CARD_STAR) {
            return outputTables.star_upgrade.rows[this._star].rate_per_card;
        }

        return 0;
    },

    getEvolutionNeedStar: function () {
        cc.log("Card getEvolutionNeedStar");

        if (this._star < MAX_CARD_STAR) {
            return outputTables.star_upgrade.rows[this._star].source_card_star;
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

    getEvolutionNeedSuperHonor: function () {
        cc.log("Card getEvolutionNeedSuperHonor");

        if (this.canEvolution()) {
            return outputTables.star_upgrade.rows[this._star].super_honor;
        }

        return 0;
    },

    evolution: function (cb, cardIdList) {
        cc.log("Card evolution " + this._id);
        cc.log(cardIdList);

        var that = this;
        lz.server.request("area.trainHandler.starUpgrade", {
            target: this._id,
            sources: cardIdList
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("evolution success");

                var msg = data.msg;

                gameData.player.add("money", -that.getEvolutionNeedMoney());
                gameData.player.add("superHonor", -that.getEvolutionNeedSuperHonor());
                gameData.cardList.deleteById(cardIdList);

                that.update(msg.card);

                if (msg.initRate) {
                    gameData.player.set("evolutionRate", msg.initRate);
                }

                var result = msg.upgrade ? EVOLUTION_SUCCESS : EVOLUTION_FAIL;

                cb(result);

                lz.um.event("event_card_evolution", "star:" + that._star + " use:" + cardIdList.length);
            } else {
                cc.log("evolution fail");

                TipLayer.tip(data.msg);

                cb(EVOLUTION_ERROR);
            }
        });
    },

    canTrain: function () {
        cc.log("Card canTrain");

        return (this._star > 2 && this.isLeadCard());
    },

    train: function (cb, trainCount, trainType) {
        cc.log("Card train " + this._id);

        var elixir = trainCount * 20;
        var that = this;
        lz.server.request("area.trainHandler.useElixir", {
            cardId: this._id,
            elixir: elixir,
            type: trainType
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("train success");

                var msg = data.msg;

                that.update(msg);

                gameData.player.add("elixir", -elixir);

                cb(msg.critType);

                lz.um.event("event_card_train", "type:" + trainType + " count:" + trainCount);
            } else {
                cc.log("train fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    getElixir: function () {
        return this._elixirAtk + this._elixirHp;
    },

    extract: function (cb, type) {
        cc.log("Card extract: ", +this._id);

        var that = this;
        lz.server.request("area.trainHandler.extract", {
            cardId: this._id,
            type: type
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cc.log("extract success");

                var msg = data.msg;
                gameData.player.add("gold", -200);

                that.update(msg.card);

                if (msg.elixir) {
                    var oldElixir = gameData.player.get("elixir");
                    gameData.player.set("elixir", msg.elixir);
                    lz.tipReward({
                        "elixir": msg.elixir - oldElixir
                    });

                } else if (msg.skillPoint) {
                    var oldSkillPoint = gameData.player.get("skillPoint");
                    gameData.player.set("skillPoint", msg.skillPoint);
                    lz.tipReward({
                        "skillPoint": msg.skillPoint - oldSkillPoint
                    });
                }

                cb();

                lz.um.event("event_card_extract", "type:" + type);
            } else {
                cc.log("extract fail");

                TipLayer.tip(data.msg);
            }

        });
    },

    usePill: function (cb) {
        cc.log("Card usePill");

        var that = this;
        lz.server.request("area.convertorHandler.usePill", {
            cardId: this._id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cc.log("usePill success");

                var msg = data.msg;
                gameData.player.set("pill", msg.playerPill);

                that.update({
                    "pill": msg.pill,
                    "potentialLv": msg.potentialLv,
                    "ability": msg.ability
                });

                cb();

            } else {
                cc.log("usePill fail");

                TipLayer.tip(data.msg);
            }
        });

    },

    canUsePill: function () {
        cc.log("Card canUsePill");

        return (this._star >= 4 && this.isLeadCard());
    },

    canUpgradePotentialLv: function () {
        cc.log("Card canUpgradePotentialLv");

        return this._potentialLv < 7;
    },

    getUpgradeNeedPill: function () {
        cc.log("Card getUpgradeNeedPill");

        if (this.canUpgradePotentialLv()) {
            return outputTables.card_pill_use.rows[this._potentialLv + 1].pill;
        }

        return 0;
    },

    getPotentialLvAddition: function () {
        cc.log("Card getPotentialLvAddition");

        if (this._potentialLv > 0) {
            return outputTables.card_pill_use.rows[this._potentialLv].grow_percent;
        }
        return 0;
    },

    getNextPotentialLvAddition: function () {
        cc.log("Card getNextPotentialLvAddition");

        if (this.canUpgradePotentialLv()) {
            return outputTables.card_pill_use.rows[this._potentialLv + 1].grow_percent;
        }

        return 0;
    },

    getSellCardMoney: function () {
        cc.log("Card getSellCardMoney");

        var price = 0;

        if (this.isLeadCard()) {
            var table = outputTables.card_price.rows[1];

            price = table["star" + this._star];

            var rows = outputTables.card_grow.rows;
            for (var i = 1; i < this._lv; ++i) {
                price += rows[i].money_need;
            }
        } else if (this.isExpCard()) {
            price = outputTables.resource_cards.rows[this._tableId].price;
        }

        return price;
    },

    isExpCard: function () {
        return this._tableId >= EXP_CARD_TABLE_ID.begin && this._tableId <= EXP_CARD_TABLE_ID.end;
    },

    isLeadCard: function () {
        return this._tableId >= LEAD_CARD_TABLE_ID.begin && this._tableId <= LEAD_CARD_TABLE_ID.end;
    },

    isMonsterCard: function () {
        return (this._tableId >= MONSTER_CARD_TABLE_ID.begin && this._tableId <= MONSTER_CARD_TABLE_ID.end) || (this._tableIdId >= 40003 && this._tableId <= 40005);
    },

    isResourceCard: function () {
        return this.isExpCard();
    },

    isBossCard: function () {
        cc.log(this._tableId);

        return (this._tableId >= BOSS_CARD_TABLE_ID.begin && this._tableId <= BOSS_CARD_TABLE_ID.end);
    },

    getCardPriority: function () {
        cc.log("Card getCardPriority");

        if (this.isExpCard()) {
            return EXP_CARD_PRIORITY;
        } else if (this.isLeadCard()) {
            return LEAD_CARD_PRIORITY;
        }

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