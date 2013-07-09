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


var Card = cc.Node.extend({
    _tid: 0,                // 数据库对应ID
    _id: 0,                 // 数据表对应ID
    _name: "",              // 卡牌名称
    _description: "",       // 卡牌描述
    _star: 0,               // 卡牌星级
    _level: 0,              // 卡牌等级
    _maxLevel: 0,           // 卡牌最大等级
    _exp: 0,                // 当前经验
    _maxExp: 0,             // 最大经验
    _skillId: 0,            // 数据库表对应技能ID
    _skillName: "",         // 技能名称
    _skillDescription: "",  // 技能描述
    _skillLevel: 0,         // 技能等级
    _skillMaxLevel: 0,      // 技能最大等级
    _hp: 0,                 // 卡牌生命值
    _damage: 0,             // 卡牌攻击值
    _critProbability: 0.0,  // 卡牌暴击概率
    _missProbability: 0.0,  // 卡牌闪避概率

    _cardNode: null,
    _cardMenuItem: null,
    _cardProgress: null,

    init: function (tid, id, star, level, skillLevel, hp, damage) {
        cc.log("Card init");

        this._super();
        this._tid = tid || 0;
        this._id = id;
        this._star = star;
        this._level = level;
        this._skillLevel = skillLevel;
        this._hp = hp;
        this._damage = damage;
    },

    initWithTable: function (row) {
        cc.log("Card initWithTable");

        this.init(row.tid, row.id, row.star, row.level, row.skillLevel, row.hp, row.damage);
    },

    cardUpdata: function () {

    },

    getCardNode: function () {
        if (this._cardNode == null) {
            this._cardNode = CardNode.create(this);
        }

        return this._cardNode;
    },

    releaseCardNode: function () {
        this._cardNode = null;
    },

    getCardMenuItem: function () {
        if (this._cardMenuItem == null) {
            this._cardMenuItem = CardMenuItem.create(this);
        }

        return this._cardMenuItem;
    },

    releaseCardMenuItem: function () {
        this._cardMenuItem = null;
    },

    getCardDetails: function () {
        return CardDetails.create(this);
    }
})


var test = {
    11: "card",
    2: "lcc"

}

cc.log(test[11]);