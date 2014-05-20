/**
 * Created by lujunyu on 14-5-20.
 */

var SmeltLayer = cc.Layer.extend({
    smeltLayerFit: null,

    init: function () {
        cc.log("SmeltLayer init");

        if (!this._super()) return false;



        return true;
    }

});

SmeltLayer.create = function () {
    cc.log("SmeltLayer create");

    var ret = new SmeltLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};