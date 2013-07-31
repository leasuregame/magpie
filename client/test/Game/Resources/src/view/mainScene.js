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
    _nowLayer : null,

    ctor : function() {
        cc.log("MainScene ctor");

        this._super();
    },

    onEnter : function() {
        cc.log("MainScene onEnter");

        this._super();

        var mainBgLayer = MainBgLayer.create();
        this.addChild(mainBgLayer,  -1);

        var mainMenuLayer = MainMenuLayer.create();
        this.addChild(mainMenuLayer, 1);

        this._nowLayer = MainLayer.create(this);
        this.addChild(this._nowLayer);
    },

    switchLayer : function(runLayer) {
        cc.log("MainScene switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if(!(this._nowLayer instanceof runLayer)) {
            this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }
    }
})