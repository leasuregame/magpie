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
    _own: null,
    _enemy: null,
    _winner: "",
    _reward: null,
    _battleStep: null,
    _battleStepLen: 0,
    _index: -1,

    init: function (id) {
        cc.log("BattleLog init");

        var battleLog = BattleLogPool.getInstance().getBattleLogById(id);
        cc.log(battleLog);
        this.set("id", battleLog.id);
        this.set("type", battleLog.type);
        this.set("own", battleLog.own);
        this.set("enemy", battleLog.enemy);
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

        for (key in this._own.cards) {
            battleNode[key] = this._own.cards[key];
        }

        for (key in this._enemy.cards) {
            battleNode[key] = this._enemy.cards[key];
        }

        return battleNode;
    },

    getSpirit: function (id) {
        cc.log("BattleLog getThisCardSpirit: " + id);

        if (id < 6) {
            return this._getOwnSpirit();
        } else {
            return this._getEnemySpirit();
        }
    },

    _getOwnSpirit: function () {
        for (var key in this._own.cards) {
            if (typeof (this._own.cards[key]) == "number") {
                return key;
            }
        }
    },

    _getEnemySpirit: function () {
        for (var key in this._enemy.cards) {
            if (typeof (this._enemy.cards[key]) == "number") {
                return key;
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