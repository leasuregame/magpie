/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-28
 * Time: 下午5:31
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle log note
 *
 * 战报是一个不会修改的数据，所以可以本地缓存起来
 * 如果玩家请求播放某场战斗，先从本地缓存读取
 * 如果没有再按ID请求服务器获取战报
 * 该模块待添加
 * */


var BattleLogNote = Entity.extend({
    _battleLogNote: {},

    pushBattleLogByJson: function (json) {
        cc.log("BattleLogNote pushBattleLogByJson");

        var battleLog = BattleLog.create(json);
        this.pushBattleLog(battleLog);
    },

    pushBattleLog: function (battleLog) {
        cc.log("BattleLogNote pushBattleLog");

        var id = battleLog.get("id");
        this._battleLogNote[id] = battleLog;
    },

    getBattleByBattleLogId: function (id) {
        cc.log("BattleLogNote getBattleByBattleLogId");

        return this._battleLogNote[id];
    },

    _loadLocalBattleLogData: function () {
        cc.log("BattleLogNote _loadLocalBattleLogData");

        // 待添加
    }
})


/*
 * 单例
 * */
BattleLogNote.getInstance = singleton(BattleLogNote);