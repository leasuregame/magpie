/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-4
 * Time: 上午10:02
 * To change this template use File | Settings | File Templates.
 */


/*
 * props layer
 * */


var PropsLayer = cc.Layer.extend({
    onEnter: function () {
        cc.log("PropsLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("PropsLayer init");

        if (!this._super()) return false;

        return true;
    },

    update: function () {
        cc.log("PropsLayer update");
    }

});


PropsLayer.create = function () {
    var ret = new PropsLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};