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

    play: function (id, isPlayback) {
        cc.log("BattlePlayer play");

        isPlayback = isPlayback || false;

        var battleLog = BattleLog.create(id, isPlayback);

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

    end: function (goLayer) {
        cc.log("BattlePlayer end");

        cc.Director.getInstance().popScene();

        if (goLayer) {
            MainScene.getInstance().switchLayer(goLayer);
        }
    }
});


/*
 * 单例
 * */
BattlePlayer.getInstance = singleton(BattlePlayer);