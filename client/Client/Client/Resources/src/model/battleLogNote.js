/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-28
 * Time: 下午5:31
 * To change this template use File | Settings | File Templates.
 */


/*
* battleLogNote
* */

var BattleLogNote = cc.Class.extend({
    _battleLogNote : null,

    init : function() {
        cc.log("BattleLogNote init");

        this._battleLogNote = [];
    },

    pushBattleLogWithJson : function(json) {
        cc.log("BattleLogNote pushBattleLogWithJson");

        this._battleLogNote.push(BattleLog.create(json));
    },

    pushBattleLog : function(battleLog) {
        this._battleLogNote.push(battleLog);
    },

    getLastBattleLog : function() {
        cc.log("BattleLogNote getLastBattleLog");

        return this._battleLogNote[this._battleLogNote.length - 1];
    },

    getBattleLogNote : function() {
        cc.log("BattleLogNote getBattleLogNote");

        return this._battleLogNote;
    },

    getBattleWithIndex : function(index) {
        cc.log("BattleLogNote getBattleWithIndex");

        return this._battleLogNote[index];
    }
})


/*
 * 单例
 * */
BattleLogNote.getInstance = singleton(BattleLogNote);