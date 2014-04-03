/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-6
 * Time: 下午2:18
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle step
 * */


var BATTLE_MAX_STEP = 30;

var BattleStep = Entity.extend({
    _step: 0,
    _isSkill: false,
    _attacker: 0,
    _type: null,
    _target: null,
    _isCrit: null,
    _effect: null,
    _targetLen: 0,
    _index: -1,

    init: function (battleStep) {
        cc.log("BattleStep init");
        cc.log(battleStep);

        this._target = [];
        this._isCrit = [];
        this._effect = [];

        this._step = battleStep.p;
        this._isSkill = battleStep.a < 0;
        this._attacker = Math.abs(battleStep.a);

        this._type = battleStep.t || null;

        this._targetLen = battleStep.d.length;

        for (var i = 0; i < this._targetLen; ++i) {
            this._isCrit[i] = battleStep.d[i] < 0;
            this._target[i] = Math.abs(battleStep.d[i]);
            this._effect[i] = battleStep.e[i];
        }

        return true;
    },

    recover: function () {
        this._index = -1;
    },

    hasNextTarget: function () {
        this._index += 1;
        return this._index < this._targetLen;
    },

    getTarget: function () {
        return this._target[this._index];
    },

    isSkill: function () {
        return this._isSkill;
    },

    getEffect: function () {
        return this._effect[this._index];
    },

    isCrit: function () {
        return this._isCrit[this._index];
    },

    isSpiritAtk: function () {
        return (this._type == 1);
    }
});


BattleStep.create = function (battleStep) {
    var ret = new BattleStep();

    if (ret && ret.init(battleStep)) {
        return ret;
    }

    return null;
};