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


var MAX_CARD_TABLE_ID = 1000;
var MAX_CARD_STAR = 5;

var EVOLUTION_SUCCESS = 1;
var EVOLUTION_FAIL = 0;
var EVOLUTION_ERROR = -1;

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
    _ability: 0,            // 战斗力
    _skillLv: 0,            // 技能等级
    _skillInc: 0,           // 技能初始伤害
    _elixirHp: 0,           // 生命值仙丹
    _elixirAtk: 0,          // 攻击力仙丹
    _skillPoint: 0,         // 技能点
    _passiveSkill: {},      // 被动技能

    _name: "",              // 卡牌名称
    _description: "",       // 卡牌描述
    _star: 0,               // 卡牌星级
    _kind: 0,
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

    _newCardMark: false,

    init: function (data) {
        cc.log("Card init");

        this._passiveSkill = {};

        this.update(data);

        this._newCardMark = this._id && ((sys.localStorage.getItem("card_" + this._id + "_mark") == "true") || false);

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
            this.set("ability", data.ability);
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

        this._maxLv = cardLvLimitTable.max_lv;
    },

    _loadSkillTable: function () {
        cc.log("Card _loadSkillTable");

        if (!this._skillId) return;

        // 读取技能配置表
        var skillTable = outputTables.skills.rows[this._skillId];

        var skillHarmGrow = skillTable["star" + this._star + "_grow"] || 0;

        if (!this._skillInc) {
            this._skillInc = skillTable["star" + this._star + "_inc_max"] || 0;
        }

        this._skillHarm = this._skillInc + skillHarmGrow * (this._skillLv - 1);
        this._skillRate = skillTable["rate" + this._star] || 0;
        this._skillDescription = skillTable.description;
        this._skillType = skillTable.type;
        this._skillMaxLv = outputTables.lv_limit.rows[1].skill_lv_limit;
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

    setNewCardMark: function (mark) {
        this._newCardMark = mark;
        sys.localStorage.setItem("card_" + this._id + "_mark", this._newCardMark);
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

    getCardFullUrl: function () {
        cc.log("Card getCardFullUrl");

        var len = this._star - 3;

        var urlList = [main_scene_image[this._url + "_full1"]];

        for (var i = 0; i < len; ++i) {
            urlList.push(main_scene_image[this._url + "_full" + (i + 2)]);
        }

        return urlList;
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

    canUpgrade: function () {
        cc.log("Card canUpgrade");

        return (this._lv < this._maxLv);
    },

    virtualCard: function () {
        this._loadCardTable();
        this._loadSkillTable();
        this._calculateAddition();
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

                lz.dc.event("event_card_upgrade", that._lv);
            } else {
                cc.log("upgrade fail");

                TipLayer.tip(data.msg);

                cb(null);
            }
        });
    },

    canUpgradeSkill: function () {
        cc.log("Card canUpgradeSkill");

        return (this._star > 2 && (this._skillLv < this._skillMaxLv));
    },

    getUpgradeNeedSKillPoint: function () {
        cc.log("Card getUpgradeNeedSKillPoint");

        if (this.canUpgradeSkill()) {
            var skillUpgradeTable = outputTables.skill_upgrade.rows[this._skillLv];
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
        lz.server.request("area.trainHandler.skillUpgrade", {
            cardId: this._id
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("upgradeSkill success");

                var msg = data.msg;

                that.update({
                    skillLv: msg.skillLv,
                    ability: msg.ability
                });

                gameData.player.add("skillPoint", -msg.skillPoint);

                cb();

                lz.dc.event("event_card_skill_upgrade", that._skillLv);
            } else {
                cc.log("upgradeSkill fail");

                TipLayer.tip(data.msg);

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
        lz.server.request("area.trainHandler.passSkillAfresh", {
            cardId: this._id,
            psIds: afreshIdList,
            type: type
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("passSkillAfresh success");

                var msg = data.msg;

                that.update(msg);

                if (type == USE_MONEY) {
                    gameData.player.add("money", -2000);
                } else if (type == USE_GOLD) {
                    gameData.player.add("gold", -20);
                }

                cb(true);

                lz.dc.event("event_card_passive_skill_afresh", type);
            } else {
                cc.log("passSkillAfresh fail");

                TipLayer.tip(data.msg);

                cb(false);
            }
        });
    },

    canEvolution: function () {
        cc.log("Card canEvolution");

        return ((this._tableId <= MAX_CARD_TABLE_ID) && (this._lv >= this._maxLv) && (this._star < MAX_CARD_STAR));
    },

    getPreCardRate: function () {
        cc.log("Card getPreCardRate");

        if (this._star < MAX_CARD_STAR) {
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
        lz.server.request("area.trainHandler.starUpgrade", {
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
                var result = msg.upgrade ? EVOLUTION_SUCCESS : EVOLUTION_FAIL;
                cb(result);

                lz.dc.event("event_card_evolution", "star:" + that._star + " use:" + cardIdList.length);
            } else {
                cc.log("evolution fail");

                TipLayer.tip(data.msg);

                cb(EVOLUTION_ERROR);
            }
        });
    },

    canTrain: function () {
        cc.log("Card canTrain");

        return (this._star > 2);
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

                cb();

                lz.dc.event("event_card_train", "type:" + trainType + " count:" + trainCount);
            } else {
                cc.log("train fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    getSellCardMoney: function () {
        cc.log("Card getSellCardMoney");

        var table = outputTables.card_price.rows[1];

        var price = table["star" + this._star];

        price += Math.max(this._lv - 1, 0) * table.grow_per_lv;

        return price;
    },

    isLeadCard: function (tableId) {
        return (tableId < 10000 || tableId == 30000);
    }
});

Card.create = function (data) {
    var ret = new Card();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};