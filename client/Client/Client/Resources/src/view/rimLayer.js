/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午2:51
 * To change this template use File | Settings | File Templates.
 */


/*
 * 边框
 * 适配 ipad 和 iphone5 分辨率
 * */

var RimLayer = cc.Layer.extend({
    init: function () {
        cc.log("RimLayer init");

        if (!this._super()) return false;

        return true;
    }
})

RimLayer.create = function () {
    var ret = new RimLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}