/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-14
 * Time: 下午5:15
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle began layer
 * */


var BattleBeganLayer = cc.Layer.extend({
    _battleLog: null,
    _cloudLayer: null,

    init: function (battleLog) {
        cc.log("BattleBeganLayer init");

        if (!this._super()) return false;

        this._battleLog = battleLog;

        this._cloudLayer = CloudLayer.create();
        this.addChild(this._cloudLayer);

        return true;
    },

    play: function () {
        cc.log("BattleBeganLayer play");

        var that = this;
        this._cloudLayer.play(function () {
            playEffect({
                effectId: 2,
                target: that,
                loops: 1,
                clear: true,
                cb: that.end
            });
        });
    },

    end: function () {
        cc.log("BattleBeganLayer end");

        BattlePlayer.getInstance().next();
    }
});


BattleBeganLayer.create = function (battleLog) {
    var ret = new BattleBeganLayer();

    if (ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
};