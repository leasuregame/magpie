/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 下午6:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * player
 * */


var Player = Entity.extend({
    _id: 0,             // 数据库id
    _createTime: 0,     // 创建时间
    _userId: 0,         // 账号id
    _areaId: 0,         // 区
    _name: "",          // 角色
    _power: 0,          // 体力
    _lv: 0,             // 等级
    _exp: 0,            // 经验
    _gold: 0,           // 元宝
    _money: 0,          // 金钱
    _elixir: 0,         // 仙丹
    _fragment: 0,       // 碎片
    _energy: 0,         // 活力
    _skillPoint: 0,     // 技能点
    _ability: 0,        // 战斗力
    _vip: 0,            // VIP等级
    _rank: 0,
    _maxTournamentCount: 0,
    _tournamentCount: 0,

    _maxExp: 0,      // 最大经验
    _maxPower: 200,     // 最大体力

    _playerLabel: null,

    init: function (data) {
        cc.log("Player init");

        this._id = data.id || this._id;
        this._createTime = data.createTime || this._createTime;
        this._userId = data.userId || this._userId;
        this._areaId = data.areaId || this._areaId;
        this._name = data.name || this._name;
        this._power = data.power.value || this._power;
        this._lv = data.lv || this._lv;
        this._exp = data.exp || this._exp;
        this._gold = data.gold || this._gold;
        this._money = data.money || this._money;
        this._elixir = data.elixir || this._elixir;
        this._skillPoint = data.skillPoint || this._skillPoint;
        this._ability = data.ability || this._ability;
        this._energy = data.energy || this._energy;
        this._maxExp = outputTables.player_upgrade.rows[this._lv].exp;

        gameData.cardList.init(data.cards);
        gameData.lineUp.init(data.lineUp);
        gameData.task.init(data.task);
        gameData.pass.init(data.pass);

        cc.log(this);

        return true;
    },

    update: function (data) {
        cc.log("Player update");

        if (data) {
            this.adds(data);
        }

        var table = outputTables.player_upgrade.rows;

        this._maxExp = table[this._lv].exp;

        if (this._exp >= this._maxExp) {
            this._lv += 1;
            this._exp -= this._maxExp;
            this._maxExp = table[this._lv].exp;
        }
    }
});


Player.create = function (data) {
    var ret = new Player();

    if (ret) {
        return ret;
    }

    return null;
};