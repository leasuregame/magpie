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
    _toLayer: null,
    _updateType: null,

    onEnter: function () {
        cc.log("YY LoginScene onEnter");

        this._super();

        if (LoginScene.flag) {
            if (this._toLayer) {
                this.switchLayer(this._toLayer);
            } else {
                this.switchLayer(LoginLayer);

                if (!lz.TARGET_PLATFORM_IS_BROWSER) {
                    NoticeLayer.pop();
                }
            }
        } else {
            LoginScene.flag = true;

            var effect = cc.BuilderReader.load(main_scene_image.uiEffect106, this);
            effect.setPosition(gameFit.GAME_MIDPOINT);

            effect.animationManager.setCompletedAnimationCallback(this, function () {

                if (this._toLayer) {
                    this.switchLayer(this._toLayer);
                } else {
                    this.switchLayer(LoginLayer);

                    if (!lz.TARGET_PLATFORM_IS_BROWSER) {
                        NoticeLayer.pop();
                    }
                }

                effect.removeFromParent();
            });

            this.addChild(effect);
        }

        lz.um.beginLogPageView("登录场景");
    },

    onExit: function () {
        cc.log("LoginScene onExit");

        this._super();

        lz.um.endLogPageView("登录场景");
    },

    init: function (toLayer, updateType) {
        cc.log("LoginScene init");

        if (!this._super()) return false;

        this._toLayer = toLayer;
        this._updateType = updateType;

        cc.Director.getInstance().getScheduler().setTimeScale(MAIN_PLAY_SPEED);

        gameData.sound.stopMusic();

        if (gameDevice !== "Iphone5") {
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

            this.switchTo(runLayer.create(this._updateType));
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


LoginScene.flag = false;

LoginScene.create = function (toLayer, upateType) {
    var ret = new LoginScene();

    if (ret && ret.init(toLayer, upateType)) {
        return ret;
    }

    return null;
};