/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-17
 * Time: 下午5:25
 * To change this template use File | Settings | File Templates.
 */


/*
 * soul layer
 * */


var SoulLayer = cc.Layer.extend({
    onEnter: function () {
        cc.log("SoulLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SoulLayer init");

        if (!this._super()) return false;


        return true;
    },

    update: function () {
        cc.log("SoulLayer update");


    }
})


SoulLayer.create = function () {
    var ret = new SoulLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}