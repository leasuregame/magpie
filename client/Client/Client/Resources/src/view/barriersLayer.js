/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */


var BarriersLayer = cc.Layer.extend({
    init: function () {
        cc.log("BarriersLayer init");

        if (!this._super()) return false;

        return true;
    }
})

BarriersLayer.create = function () {
    var ret = new BarriersLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}