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


var BattleStep = cc.Class.extend({
    _isSkill : null,
    _attacker : 0,
    _target : [],
    _isCrit : [],
    _effect : [],
    _targetLen : 0,
    _index : -1,

    init : function(battleStep) {
        cc.log("Battle init");
        cc.log(battleStep);

        this._isSkill = battleStep.a < 0;
        this._attacker = Math.abs(battleStep.a);

        if(typeof(battleStep.d) == "number") battleStep.d = [battleStep.d];
        if(typeof(battleStep.e) == "number") battleStep.e = [battleStep.e];

        var len = battleStep.d.length;
        this._targetLen = len;

        for(var i = 0; i < len; ++i) {
            this._isCrit[i] = battleStep.d[i] < 0;
            this._target[i] = Math.abs(battleStep.d[i]);
            this._effect[i] = battleStep.e[i];
        }

        return true;
    },

    getAttacker : function() {
        return this._attacker;
    },

    isSkill : function() {
        return this._isSkill;
    },

    getAllTarget : function() {
        return this._target;
    },

    getAllEffect : function() {
        return this._effect;
    },

    recover : function() {
        this._index = -1;
    },

    hasNextTaget : function() {
        this._index += 1;
        return this._index < this._targetLen;
    },

    getTarget : function() {
        return this._target[this._index];
    },

    getEffect : function() {
        return this._effect[this._index];
    },

    isCrit : function() {
        return this._isCrit[this._index];
    }
})


BattleStep.create = function(battleStep) {
    var ret = new BattleStep();

    if(ret && ret.init(battleStep)) {
        return ret;
    }

    return null;
}