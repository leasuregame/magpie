/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午10:37
 * To change this template use File | Settings | File Templates.
 */


/*
 * login scene
 * */


var LoginScene = cc.Scene.extend({
    _nowLayer: null,

    onEnter: function () {
        cc.log("LoginScene onEnter");

        this._super();
//
//        if(typeof UpdateLayer == "undefined") {
        this.switchLayer(LoginLayer);
//        } else {
//            this.switchLayer(UpdateLayer);
//        }

        lz.dc.beginLogPageView("登录场景");
    },

    onExit: function () {
        cc.log("LoginScene onExit");

        this._super();

        lz.dc.endLogPageView("登录场景");
    },

    init: function () {
        cc.log("LoginScene init");

        if (!this._super()) return false;

        cc.Director.getInstance().getScheduler().setTimeScale(MAIN_PLAY_SPEED);

        if (gameDevice != "Iphone5") {
            var gameFrame = GameFrame.create();
            this.addChild(gameFrame, 100);
        }

        var loginBgLayer = LoginBgLayer.create();
        this.addChild(loginBgLayer);

        return true;
    },

    switchLayer: function (runLayer) {
        cc.log("LoginScene switchLayer");

        if (runLayer.canEnter && !runLayer.canEnter()) {
            return;
        }

        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            this.switchTo(runLayer.create());
        }
    },

    switchTo: function (layerObject) {
        cc.log("LoginScene switch");

        if (this._nowLayer != null) {
            this.removeChild(this._nowLayer);
        }

        this._nowLayer = layerObject;
        this.addChild(this._nowLayer);
    }
});


LoginScene.create = function () {
    var ret = new LoginScene();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};