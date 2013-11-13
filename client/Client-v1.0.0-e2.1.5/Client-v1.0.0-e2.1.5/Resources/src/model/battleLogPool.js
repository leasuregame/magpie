/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-28
 * Time: 下午5:31
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle log pool
 *
 * 战报是一个不会修改的数据，所以可以本地缓存起来
 * 如果玩家请求播放某场战斗，先从本地缓存读取
 * 如果没有再按ID请求服务器获取战报
 * 该模块待添加
 * */


var PVE_BATTLE_LOG = 0;
var PVP_BATTLE_LOG = 1;

var BattleLogPool = Entity.extend({
    _battleLogPool: {},

    init: function () {
        cc.log("BattleLogPool init");

        this._battleLogPool = {};
        this._load();
    },

    _load: function () {
        cc.log("BattleLogPool _load");

        var battleLogPool = sys.localStorage.getItem("battleLogPool") || {};

        for (var key in battleLogPool) {
            if (battleLogPool[key]) {
                this._battleLogPool[key] = battleLogPool[key];
            }
        }
    },

    _save: function () {
        sys.localStorage.setItem("battleLogPool", this._battleLogPool);
    },

    pushBattleLog: function (battleLog, battleType) {
        cc.log("BattleLogPool pushBattleLog");

        battleLog.type = battleType || PVE_BATTLE_LOG;
        battleLog.id = battleLog.id || 0;

        if (battleLog.ownId !== gameData.player.get("id")) {
            if (battleLog.winner == "own") {
                battleLog.winner = "enemy";
            } else if (battleLog.winner == "enemy") {
                battleLog.winner = "own"
            }
        }

        this._battleLogPool[battleLog.id] = battleLog;

        this._save();

        return battleLog.id;
    },

    getBattleLogById: function (id) {
        cc.log("BattleLogPool getBattleByBattleLogId");

        return this._battleLogPool[id];
    }
});


/*
 * 单例
 * */
BattleLogPool.getInstance = singleton(BattleLogPool);