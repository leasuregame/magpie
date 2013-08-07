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
    _passiveSkillList: [],  // 被动技能
    _isUse: false,          // 是否上阵

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

        this._id = data.id || this._id;
        this._createTime = data.createTime || this._createTime;
        this._tableId = data.tableId || this._tableId;
        this._lv = data.lv || this._lv;
        this._exp = data.exp || this._exp;
        this._skillLv = data.skillLv || this._skillLv;
        this._hpAddition = data.hpAddition || this._hpAddition;
        this._atkAddition = data.atkAddition || this._atkAddition;
        this._elixir = data.elixir || this._elixir;

        if (data.passiveSkills) {
            var passiveSkillList = data.passiveSkills;
            var len = passiveSkillList.length;
            for (var i = 0; i < len; ++i) {
                this._passiveSkillList[i] = {
                    id: passiveSkillList.id,
                    name: passiveSkillList.name,
                    value: passiveSkillList.value
                }
            }
        }

        this._loadCardTable();
        this._loadSkillTable();

        this._ability = this._getCardAbility();

        return true;
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
    },

    _loadSkillTable: function () {
        cc.log("Card _loadSkillTable");

        // 读取技能配置表

        var skillTable = outputTables.skills.rows[this._skillId];

        this._skillName = skillTable.name;
        this._skillDescription = skillTable.description;
        this._skillMaxLv = 6;
    },

    // 计算单个卡牌战斗力
    _getCardAbility: function () {
        cc.log("Card _getCardAbility");

        return 0;
    },

    // 计算总经验
    getCardExp: function () {
        cc.log("Card getCardExp");

        var hasExp = exp;

    },

    clone: function () {
        cc.log("Card clone");

        return Card.create({
            id: this._id,
            createTime: this._createTime,
            tableId: this._tableId,
            lv: this._lv,
            exp: this._exp,
            skillLv: this._skillLv,
            hpAddition: this._hpAddition,
            atkAddition: this._atkAddition,
            elixir: this._elixir
        });
    }
})

Card.create = function (data) {
    var ret = new Card();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
}