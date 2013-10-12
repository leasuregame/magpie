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
    _mainMenuLayer: null,

    init: function () {
        cc.log("MainScene init");

        var mainBgLayer = MainBgLayer.create();
        this.addChild(mainBgLayer, -1);

        this._mainMenuLayer = MainMenuLayer.create();
        this.addChild(this._mainMenuLayer, 1);

        var gameFrame = GameFrame.create();
        this.addChild(gameFrame, 10);

        this.switchLayer(MainLayer);
    },

    getLayer: function () {
        return this._nowLayer;
    },

    switchLayer: function (runLayer) {
        cc.log("MainScene switchLayer");
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
MainScene.getInstance = singleton(MainScene);