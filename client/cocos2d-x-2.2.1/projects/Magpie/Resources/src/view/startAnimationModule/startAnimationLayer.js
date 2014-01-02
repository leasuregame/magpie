/**
 * Created by lcc3536 on 13-12-16.
 */


/*
 * start animation layer
 * */


var StartAnimationLayer = cc.Layer.extend({
    _animation: [
        main_scene_image.startAnimation1,
        main_scene_image.startAnimation2,
        main_scene_image.startAnimation3,
        main_scene_image.startAnimation4,
        main_scene_image.startAnimation5
    ],
    _ccbNode: null,
    _index: 0,

    init: function () {
        cc.log("StartAnimationLayer init");

        if (!this._super()) return false;

        this._ccbNode = null;
        this._index = 0;

        this.play();

        return true;
    },

    play: function () {
        cc.log("StartAnimationLayer play");

        this.ccbFnNext();
    },

    ccbFnNext: function () {
        cc.log("StartAnimationLayer ccbFnNext");

        if (this._ccbNode) {
            this._ccbNode.removeFromParent();
            this._ccbNode = null;
        }

        if (this._index < this._animation.length) {
            this._ccbNode = cc.BuilderReader.load(this._animation[this._index], this);
            this._ccbNode.setPosition(gameFit.GAME_MIDPOINT);
            this.addChild(this._ccbNode);

            this._index += 1;
        } else {
            this.end();
        }
    },

    end: function () {
        cc.log("StartAnimationLayer end");

        var sound = gameData.sound;

        sound.stopMusic();
        sound.stopEffect();

        cc.Director.getInstance().replaceScene(MainScene.getInstance());
    },

    ccbFnPlayMusic: function () {
        cc.log("StartAnimationLayer ccbFnPlayMusic");

        gameData.sound.playMusic(main_scene_image.start_animation_music, true);
    }
});


StartAnimationLayer.create = function () {
    var ret = new StartAnimationLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};