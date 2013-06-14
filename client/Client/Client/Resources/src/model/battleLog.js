/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-28
 * Time: 下午1:16
 * To change this template use File | Settings | File Templates.
 */


/*
* battle log
* */


var BattleLog = cc.Class.extend({
    _own : null,
    _enemy : null,
    _winner : "",
    _rewards : null,
    _battleStep : null,
    _battleStepLen : 0,
    _index : -1,

    init : function(json) {
        cc.log("BattleLog init");

        var battleLog = json;

        if(typeof(battleLog) == "string") {
            battleLog = battleLog.substring(battleLog.indexOf("("));
            battleLog = eval(battleLog);
        }

        cc.log(battleLog);

        this._own = battleLog.own;
        this._enemy = battleLog.enemy;
        this._winner = battleLog.winner;
        this._rewards = battleLog.rewards;
        this._battleStep = battleLog.steps;
        this._battleStepLen = this._battleStep.length;

        return true;
    },

    getBattleWinner : function() {
        cc.log("BattleLog getBattleWinner");
        return this._winner;
    },

    getBattleOwn : function() {
        cc.log("BattleLog getBattleMe");
        return this._own;
    },

    getBattleEnemy : function() {
        cc.log("BattleLog getBattleEnemy");
        return this._enemy;
    },

    getBattleReward : function() {
        cc.log("BattleLog getBattleResult");
        return this._rewards;
    },

    recover : function() {
        this._index = -1;
    },

    hasNextBattleStep : function() {
        this._index += 1;

        cc.log("BattleLog has Next BattleStep " + this._index + "  " + this._battleStepLen + " " + (this._index < this._battleStepLen));

        return (this._index < this._battleStepLen);
    },

    getBattleStep : function() {
        cc.log("BattleLog getBattleStep");
        return BattleStep.create(this._battleStep[this._index]);
    },

    getBattleStepIndex : function() {
        return this._index;
    }
})


BattleLog.create = function(json) {
    var ret = new BattleLog();

    if(ret && ret.init(json)) {
        return ret;
    }

    return null;
}