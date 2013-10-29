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
    _fragment: 0,       // 卡魂
    _energy: 0,         // 活力
    _skillPoint: 0,     // 技能点
    _vip: 0,            // VIP等级
    _cash: 0,           // 付费
    _rank: 0,
    _maxTournamentCount: 0,
    _tournamentCount: 0,

    _maxLv: 0,          // 最大等级
    _maxPower: 0,       // 最大体力
    _maxMoney: 0,       // 最大金钱
    _maxSkillPoint: 0,  // 最大技能点
    _maxEnergy: 0,      // 最大活力
    _maxExp: 0,         // 最大经验

    init: function (data) {
        cc.log("Player init");

        MAX_LINE_UP_CARD = 3;

        this.off();
        this.on("lvChange", this._lvChangeEvent);

        this._load();
        this.update(data);

        gameData.cardLibrary.init();
        gameData.friend.init();
        gameData.message.init();
        gameData.signIn.init();
        gameData.rank.init();
        gameData.achievement.init();
        gameData.speak.init();
        gameData.exchange.init();

        cc.log(this);

        return true;
    },

    _load: function () {
        this._maxLv = outputTables.lv_limit.rows[1].player_lv_limit;

        var resourceLimitTable = outputTables.resource_limit.rows[1];
        this._maxPower = resourceLimitTable.power_value;
        this._maxMoney = resourceLimitTable.money;
        this._skillPoint = resourceLimitTable.skillPoint;
        this._maxEnergy = resourceLimitTable.energy;
    },

    update: function (data) {
        cc.log("Player update");

        this.set("id", data.id);
        this.set("createTime", data.createTime);
        this.set("userId", data.userId);
        this.set("areaId", data.areaId);
        this.set("name", data.name);
        this.set("lv", data.lv);
        this.set("exp", data.exp);
        this.set("gold", data.gold);
        this.set("money", data.money);
        this.set("elixir", data.elixir);
        this.set("fragment", data.fragments);
        this.set("skillPoint", data.skillPoint);
        this.set("energy", data.energy);
        this.set("vip", data.vip);
        this.set("cash", data.cash);
        this.set("power", data.power.value);

        gameData.cardList.init(data.cards);
        gameData.lineUp.init(data.lineUp);
        gameData.task.init(data.task);
        gameData.pass.init(data.pass);
        gameData.spirit.init(data.spiritor);
        gameData.spiritPool.init(data.spiritPool);
        gameData.tournament.init(data.rank);
        gameData.treasureHunt.init({
            count: data.dailyGift.lotteryCount,
            freeCount: data.dailyGift.lotteryFreeCount
        });
        gameData.shop.init({
            useVipBoxList: data.vipBox,
            powerBuyCount: data.dailyGift.powerBuyCount,
            challengeBuyCount: data.dailyGift.challengeBuyCount
        });

    },

    upgrade: function (data) {
        cc.log("Player upgrade");

        if (!data) return;

        this.set("lv", data.lv);
        this.adds(data.rewards);

        gameData.friend.set("maxFriendCount", data.friendsCount);
    },

    _lvChangeEvent: function () {
        cc.log("Player _lvChangeEvent");

        this.set("maxExp", outputTables.player_upgrade.rows[this._lv].exp);

        var table = outputTables.function_limit.rows[1];

        MAX_LINE_UP_CARD = 3;

        if (this._lv >= table.card4_position) {
            MAX_LINE_UP_CARD = 4;
        }

        if (this._lv >= table.card5_position) {
            MAX_LINE_UP_CARD = 5;
        }
    },

    getAbility: function () {
        var lineUpCardList = gameData.lineUp.getLineUpCardList();
        var len = lineUpCardList.length;
        var ability = gameData.spirit.get("ability");

        for (var i = 0; i < len; ++i) {
            ability += lineUpCardList[i].get("ability");
        }

        return ability;
    },

    sendMessage: function (cb, playerId, msg) {
        cc.log("Player sendMessage: " + playerId + " " + msg);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.leaveMessage", {
            friendId: playerId,
            content: msg
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("sendMessage success");

                cb("success");
            } else {
                cc.log("sendMessage fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    fight: function (cb, playerId) {
        cc.log("Player learn: " + playerId);

        var that = this;
        lzWindow.pomelo.request("area.rankHandler.fight", {
            targetId: playerId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("learn success");

                var msg = data.msg;

                var battleLogId = BattleLogPool.getInstance().pushBattleLog(msg.battleLog, PVP_BATTLE_LOG);

                cb(battleLogId);
            } else {
                cc.log("learn fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    playerDetail: function (cb, playerId) {
        cc.log("Player playerDetail: " + playerId);

        var that = this;
        lzWindow.pomelo.request("area.playerHandler.getLineUpInfo", {
            playerId: playerId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("playerDetail success");

                var msg = data.msg;

                cb(msg);
            } else {
                cc.log("playerDetail fail");

                TipLayer.tip(data.msg);
            }
        });
    }
});


Player.create = function () {
    var ret = new Player();

    if (ret) {
        return ret;
    }

    return null;
};