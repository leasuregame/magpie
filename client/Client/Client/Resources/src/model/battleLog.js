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
    _battleLog : null,

    init : function(json) {
        cc.log("Battle init");

        cc.log(json);

        if(typeof(json) == "string") {
            json = json.substring(json.indexOf("("));

            cc.log(json);

            this._battleLog = eval(json);

            cc.log(this._battleLog);
            return true;
        }

        this._battleLog = json;

        return true;
    },

    getBattleSteps : function() {
        cc.log("BattleLog getBattleSteps");
        return this._battleLog.steps;
    },

    getBattleWinner : function() {
        cc.log("BattleLog getBattleWinner");
        return this._battleLog.winner;
    },

    getBattleEnemy : function() {
        cc.log("BattleLog getBattleEnemy");
        return this._battleLog.enemy;
    },

    getBattleResult : function() {
        cc.log("BattleLog getBattleResult");
        return this._battleLog.result;
    },

    getBattleMe : function() {
        cc.log("BattleLog getBattleMe");
        return this._battleLog.me;
    }
})


BattleLog.create = function(json) {
    var ret = new BattleLog();

    if(ret && ret.init(json)) {
        return ret;
    }

    return ret;
}

var json_str = ""