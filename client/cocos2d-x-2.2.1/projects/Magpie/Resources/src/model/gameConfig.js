/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-4
 * Time: 上午2:01
 * To change this template use File | Settings | File Templates.
 */


/*
 * game config
 * */

var FPS_LIST = [15, 30, 60];

var gameConfig = new (Entity.extend({
    _fps: 0,

    init: function () {
        cc.log("gameConfig init");

        var fps = lz.load("gameConfigFps") || 30;

        var len = FPS_LIST.length;
        for (var i = 0; i < len; ++i) {
            if (fps == FPS_LIST[i]) {
                this.setFps(fps);
                return;
            }
        }

        this.setFps(30);
    },

    setFps: function (fps) {
        cc.log("gameConfig setFps: " + fps);

        if (fps > 0 && fps != this._fps) {
            this._fps = fps;

            lz.save("gameConfigFps", this._fps);

            cc.Director.getInstance().setAnimationInterval(1.0 / this._fps);
        }
    }
}));
