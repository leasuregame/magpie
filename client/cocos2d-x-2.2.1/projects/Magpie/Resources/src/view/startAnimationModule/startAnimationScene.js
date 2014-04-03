/**
 * Created by lcc3536 on 13-12-16.
 */


/*
 * start animation scene
 * */


var StartAnimationScene = cc.Scene.extend({
    _nowLayer: null,

    onEnter: function () {
        cc.log("StartAnimationScene onEnter");

        this._super();

        lz.um.beginLogPageView("开场动画场景");
    },

    onExit: function () {
        cc.log("StartAnimationScene onExit");

        this._super();

        lz.um.endLogPageView("开场动画场景");
    },

    init: function () {
        cc.log("StartAnimationScene init");

        if (!this._super()) return false;

        cc.Director.getInstance().getScheduler().setTimeScale(MAIN_PLAY_SPEED);

        var startAnimationLayer = StartAnimationLayer.create();
        this.addChild(startAnimationLayer);

        return true;
    }
});


StartAnimationScene.create = function () {
    var ret = new StartAnimationScene();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};