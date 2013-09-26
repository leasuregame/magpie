/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-8
 * Time: 下午6:08
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle player
 * */


var BattlePlayer = cc.Class.extend({
    _battleScene: null,

    play: function (id) {
        cc.log("BattlePlayer play");

        var battleLog = BattleLog.create(id);

        this._battleScene = BattleScene.create(battleLog);

        if (this._battleScene) {
            cc.Director.getInstance().pushScene(this._battleScene);

            this._battleScene.play();
        }

        return battleLog.isWin();
    },

    next: function () {
        cc.log("BattlePlayer next");

        this._battleScene.next();
    },

    end: function () {
        cc.log("BattlePlayer end");

        cc.Director.getInstance().popScene();
//      cc.Director.getInstance().replaceScene(cc.TransitionTurnOffTiles.create(1, MainScene.getInstance()));
    }
});


/*
 * 单例
 * */
BattlePlayer.getInstance = singleton(BattlePlayer);