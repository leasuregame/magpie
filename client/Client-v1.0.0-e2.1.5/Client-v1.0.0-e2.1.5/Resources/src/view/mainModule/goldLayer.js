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


var GoldLayer = cc.Layer.extend({
    init: function () {
        cc.log("GoldLayer init");

        if (!this._super()) return false;

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