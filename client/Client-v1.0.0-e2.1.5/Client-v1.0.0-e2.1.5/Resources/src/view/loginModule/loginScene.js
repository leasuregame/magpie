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

    init: function() {
        cc.log("LoginScene init");

        if(!this._super()) return false;

        this.switchLayer(LoginLayer);

        return true;
    },

    switchLayer: function (runLayer) {
        cc.log("LoginScene switchLayer");

        if (runLayer.canEnter && !runLayer.canEnter()) {
            return;
        }

        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            this.switch(runLayer.create());
        }
    },

    switch: function (layerObject) {
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