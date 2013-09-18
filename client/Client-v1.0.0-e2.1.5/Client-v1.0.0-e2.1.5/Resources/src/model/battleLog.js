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


var BattleLog = Entity.extend({
    _id: 0,
    _type: PVE_BATTLE_LOG,
    _card: null,
    _ownId: 0,
    _enemyId: 0,
    _winner: "",
    _reward: null,
    _battleStep: null,
    _battleStepLen: 0,
    _index: -1,

    init: function (id) {
        cc.log("BattleLog init");

        var battleLog = BattleLogPool.getInstance().getBattleLogById(id);

        this.set("id", battleLog.id);
        this.set("type", battleLog.type);
        this.set("card", battleLog.cards);
        this.set("ownId", battleLog.ownId);
        this.set("enemyId", battleLog.enemyId);
        this.set("winner", battleLog.winner);
        this.set("reward", battleLog.rewards);
        this.set("battleStep", battleLog.steps);
        this.set("battleStepLen", battleLog.steps.length);

        return true;
    },

    getBattleNode: function () {
        cc.log("BattleLog getBattleNode");

        var key;
        var battleNode = {};

        for (key in this._card) {
            battleNode[key] = this._card[key];
        }

        return battleNode;
    },

    getSpirit: function (id) {
        cc.log("BattleLog getSpirit: " + id);

        var i;
        if(id > 6) {
            for(i = 6; i < 12; ++i) {
                if(this._card[i] != undefined && typeof(this._card[i]) == "number") {
                    return i;
                }
            }
        } else {
            for(i = 1; i <= 6; ++i) {
                if(this._card[i] != undefined && typeof(this._card[i]) == "number") {
                    return i;
                }
            }
        }
    },

    recover: function () {
        this._index = -1;
    },

    hasNextBattleStep: function () {
        this._index += 1;

        cc.log("BattleLog has Next BattleStep " + this._index + "  " + this._battleStepLen + " " + (this._index < this._battleStepLen));

        return (this._index < this._battleStepLen);
    },

    getBattleStep: function () {
        cc.log("BattleLog getBattleStep: " + this._battleStep[this._index]);

        return BattleStep.create(this._battleStep[this._index]);
    },

    getBattleStepIndex: function () {
        return this._index;
    }
});


BattleLog.create = function (id) {
    var ret = new BattleLog();

    if (ret && ret.init(id)) {
        return ret;
    }

    return null;
};