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
    init: function () {
        cc.log("MainScene init");

        var mainLayer = MainLayer.create();
        this.addChild(mainLayer);

        return true;
    }
});


MainScene.create = function () {
    var ret = new MainScene();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};