/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-28
 * Time: 下午6:48
 * To change this template use File | Settings | File Templates.
 */


/*
 * system message layer
 * */


var SystemMessageLayer = cc.Layer.extend({
    init: function () {
        cc.log("SystemMessageLayer init");

        if (!this._super()) return false;

        return true;
    }
});


SystemMessageLayer.create = function () {
    var ret = new SystemMessageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}