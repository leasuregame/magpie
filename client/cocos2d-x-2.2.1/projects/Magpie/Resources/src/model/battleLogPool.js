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
var BOSS_BATTLE_LOG = 2;

var BattleLogPool = Entity.extend({
    _battleLogPool: null,

    init: function () {
        cc.log("BattleLogPool init");

        this._battleLogPool = {};
    },

    put: function (battleLog) {
        cc.log("BattleLogPool pushBattleLog");

        battleLog.type = battleLog.type || PVE_BATTLE_LOG;
        battleLog.id = battleLog.id || 100000000;

        this._battleLogPool[battleLog.id] = battleLog;

        lz.save("battleLog" + battleLog.id, battleLog);

        return battleLog.id;
    },

    get: function (id) {
        cc.log("BattleLogPool getBattleByBattleLogId");

        this._battleLogPool[id] = this._battleLogPool[id] || lz.load("battleLog" + id);

        return this._battleLogPool[id];
    }
});


/*
 * 单例
 * */
BattleLogPool.getInstance = singleton(BattleLogPool);