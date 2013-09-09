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
    _cash: 0,           // 付费
    _rank: 0,
    _maxTournamentCount: 0,
    _tournamentCount: 0,

    _maxExp: 0,         // 最大经验
    _maxPower: 200,     // 最大体力

    _playerLabel: null,

    init: function (data) {
        cc.log("Player init");

        this.set("id", data.id);
        this.set("createTime", data.createTime);
        this.set("userId", data.userId);
        this.set("areaId", data.areaId);
        this.set("name", data.name);
        this.set("power", data.power.value);
        this.set("lv", data.lv);
        this.set("exp", data.exp);
        this.set("gold", data.gold);
        this.set("money", data.money);
        this.set("elixir", data.elixir);
        this.set("skillPoint", data.skillPoint);
        this.set("ability", data.ability);
        this.set("energy", data.energy);
        this.set("vip", data.vip);
        this.set("cash", data.cash);
        this.set("maxExp", outputTables.player_upgrade.rows[this._lv].exp);

        gameData.cardList.init(data.cards);
        gameData.lineUp.init(data.lineUp);
        gameData.task.init(data.task);
        gameData.pass.init(data.pass);
        gameData.spirit.init(data.spiritor);
        gameData.spiritPool.init(data.spiritPool);
        gameData.cardLibrary.init();
        gameData.friend.init({
            friendList: data.friends,
            giveBlessCount: data.dailyGift.gaveBless.count,
            giveBlessList: data.dailyGift.gaveBless.receivers,
            receiveBlessCount: data.dailyGift.receivedBless.count,
            receiveBlessList: data.dailyGift.receivedBless.givers
        });
        gameData.treasureHunt.init({
            count: data.dailyGift.lotteryCount,
            freeCount: data.dailyGift.lotteryFreeCount
        });
        gameData.shop.init({
            useVipBoxList: data.vipBox
        });
        gameData.message.init();
        gameData.signIn.init();
        gameData.rank.init();

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


Player.create = function () {
    var ret = new Player();

    if (ret) {
        return ret;
    }

    return null;
};