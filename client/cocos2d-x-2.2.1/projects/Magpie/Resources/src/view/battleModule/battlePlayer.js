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


var MAIN_PLAY_SPEED = 1;
var BATTLE_PLAY_SPEEDS = [1, 1.5, 2.0, 2.7];

var BattlePlayer = Entity.extend({
    _battleScene: null,
    _cb: null,

    play: function (args) {
        cc.log("BattlePlayer play: " + args);

        this._cb = args.cb;
        var id = args.id;
        var isPlayback = args.isPlayback || false;

        var battleLog = BattleLog.create(id, isPlayback);

        this._battleScene = BattleScene.create(battleLog);

        if (this._battleScene) {
            cc.Director.getInstance().pushScene(this._battleScene);

            this._battleScene.play();
        }

        gameData.sound.playMusic(main_scene_image.battle_bg_music, true);

        var playSpeedTimes = lz.load(gameData.player.get("uid") + "playSpeedTimes") || 1;
        cc.Director.getInstance().getScheduler().setTimeScale(BATTLE_PLAY_SPEEDS[playSpeedTimes]);

        return battleLog.isWin();
    },

    next: function () {
        cc.log("BattlePlayer next");

        this._battleScene.next();
    },

    end: function (goLayer) {
        cc.log("BattlePlayer end");

        gameData.sound.playMusic();
        cc.Director.getInstance().getScheduler().setTimeScale(MAIN_PLAY_SPEED);

        cc.Director.getInstance().popScene();

        var cb = this._cb;
        lz.scheduleOnce(function () {
            if (cb) {
                cb();
            }
        }, 0.1);

        if (goLayer) {
            MainScene.getInstance().switchLayer(goLayer);
            LazyLayer.closeCloudAll();
        }
    },

    getScene: function () {
        return this._battleScene;
    }
});


/*
 * 单例
 * */
BattlePlayer.getInstance = singleton(BattlePlayer);
