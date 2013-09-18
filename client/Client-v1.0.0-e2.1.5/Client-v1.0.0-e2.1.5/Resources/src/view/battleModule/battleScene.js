/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午4:06
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle scene
 * */


var BattleScene = cc.Scene.extend({
    _battleProcess: [],
    _index: 0,

    init: function (battleLog) {
        cc.log("BattleScene init");

        if (!this._super()) return false;

        this._battleProcess = [];

        var battleBeganLayer = BattleBeganLayer.create(battleLog);
        this.addChild(battleBeganLayer, 1);
        this._battleProcess.push(battleBeganLayer);

        var batterLayer = BatterLayer.create(battleLog);
        this.addChild(batterLayer);
        this._battleProcess.push(batterLayer);

        var battleEndLayer = BattleEndLayer.create(battleLog);
        this.addChild(battleEndLayer, 1);
        this._battleProcess.push(battleEndLayer);

        var gameFrame = GameFrame.create();
        this.addChild(gameFrame, 1);

        return true;
    },

    play: function () {
        cc.log("BattleScene play");

        this._index = 0;
        this.next();
    },

    next: function () {
        cc.log("BattleScene next");

        if (this._index < this._battleProcess.length) {
            this._battleProcess[this._index].play();
            this._index += 1;
        } else {
            this.end();
        }
    },

    end: function () {
        cc.log("BattleScene end");

        BattlePlayer.getInstance().end();
    }
});


BattleScene.create = function (battleLog) {
    var ret = new BattleScene();

    if (ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
};