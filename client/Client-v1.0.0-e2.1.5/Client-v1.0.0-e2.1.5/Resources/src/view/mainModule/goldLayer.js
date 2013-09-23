/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-22
 * Time: 下午6:05
 * To change this template use File | Settings | File Templates.
 */


/*
 * gold layer
 * */


var GoldLayer = LazyLayer.extend({
    init: function () {
        cc.log("GoldLayer init");

        if (!this._super()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 960);
        bgLayer.setPosition(GAME_ZERO);
        this.addChild(bgLayer);



        return true;
    }
});


GoldLayer.create = function () {
    var ret = new GoldLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};