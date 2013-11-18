/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午10:37
 * To change this template use File | Settings | File Templates.
 */


/*
 * main scene
 * */


var MainScene = cc.Scene.extend({
    _nowLayer: null,
    _mainBgLayer: null,
    _mainMenuLayer: null,

    onEnter: function () {
        cc.log("MainScene onEnter");

        this._super();

        lz.dc.beginLogPageView("主场景");
    },

    onExit: function () {
        cc.log("MainScene onExit");

        this._super();

        lz.dc.endLogPageView("主场景");
    },

    init: function () {
        cc.log("MainScene init");

        gameData.sound.playMusic();

        this._mainBgLayer = MainBgLayer.create();
        this.addChild(this._mainBgLayer, -1);

        this._mainMenuLayer = MainMenuLayer.create();
        this.addChild(this._mainMenuLayer, 1);

        if (gameDevice != "Iphone5") {
            var gameFrame = GameFrame.create();
            this.addChild(gameFrame, 100);
        }

       noviceTeachingLayer = NoviceTeachingLayer.create();
        if (noviceTeachingLayer.isNoviceTeaching()) {
            this.addChild(noviceTeachingLayer, 20);
        } else {
            this.switchLayer(MainLayer);
        }
    },

    changeMessage: function (msg) {
        cc.log("MainScene changeMessage");

        this._mainBgLayer.changeMessage(msg);
    },

    getLayer: function () {
        return this._nowLayer;
    },

    updateMark: function() {
        if(this._nowLayer.updateMark) {
            this._nowLayer.updateMark();
        }
    },

    switchLayer: function (runLayer) {
        cc.log("MainScene switchLayer");

        if (runLayer.canEnter && !runLayer.canEnter()) {
            return;
        }

        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            this.switch(runLayer.create());
        }
    },

    switch: function (layerObject) {
        cc.log("MainScene switch");

        if (this._nowLayer != null) {
            this.removeChild(this._nowLayer);
        }

        this._nowLayer = layerObject;
        this.addChild(this._nowLayer);

        this._mainMenuLayer.update();
    }
});


/*
 * 单例
 * */
(function () {
    var _mainScene = null;

    MainScene.getInstance = function () {
        if (_mainScene == null) {
            _mainScene = new MainScene();
            _mainScene.init();
        }

        return _mainScene;
    };

    MainScene.destroy = function () {
        _mainScene = null;

        cc.AudioEngine.getInstance().stopMusic();
    };
})();