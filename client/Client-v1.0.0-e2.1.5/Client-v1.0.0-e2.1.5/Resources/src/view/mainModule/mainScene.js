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

    init: function () {
        cc.log("MainScene init");

        this.retain();

        var mainBgLayer = MainBgLayer.create();
        this.addChild(mainBgLayer, -1);

        this._nowLayer = MainLayer.create();
        this.addChild(this._nowLayer);

        var mainMenuLayer = MainMenuLayer.create(this);
        this.addChild(mainMenuLayer, -1);

        var gameFrame = GameFrame.create();
        this.addChild(gameFrame, 1);
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
    }
});


/*
 * 单例
 * */
MainScene.getInstance = singleton(MainScene);