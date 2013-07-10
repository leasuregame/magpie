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
    _id: 0,                 // 数据库对应ID
    _createTime : 0,        // 创建时间
    _tableId: 0,            // 数据表对应ID
    _lv: 0,                 // 卡牌等级
    _exp: 0,                // 当前经验
    _skillLv: 0,            // 技能等级
    _hpAddition : 0,        // 生命培养量
    _atkAddition: 0,        // 攻击培养量

    _name: "",              // 卡牌名称
    _description: "",       // 卡牌描述
    _star: 0,               // 卡牌星级

    _maxLv: 0,              // 卡牌最大等级

    _maxExp: 0,             // 最大经验
    _skillId: 0,            // 数据库表对应技能ID
    _skillName: "",         // 技能名称
    _skillDescription: "",  // 技能描述

    _skillMaxLv: 0,         // 技能最大等级
    _hp: 0,                 // 卡牌生命值
    _atk: 0,                // 卡牌攻击值

    init: function (data) {
        cc.log("Card init");

        this._id = data.id;
        this._createTime = data.createTime;
        this._tableId = data.tableId;
        this._lv = data.lv;

        return null;
    },

    initWithTable: function (row) {
        cc.log("Card initWithTable");

        this.init(row.tid, row.id, row.star, row.level, row.skillLevel, row.hp, row.damage);
    },

    update: function () {
        cc.log("Card update");
    }
})

Card.create = function(data) {
    var ret = new Card();

    if(ret && ret.init(data)) {
        return ret;
    }

    return null;
}