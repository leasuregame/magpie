/**
 * Created by lujunyu on 14-6-14.
 */

var ExpInstanceLayer = cc.Layer.extend({

    init: function() {
        cc.log("ExpInstanceLayer init");

        if(!this._super()) return false;

        var a = 0;

        return true;
    }

});

ExpInstanceLayer.create = function () {
    cc.log("ExpInstanceLayer create");

    var ret = new ExpInstanceLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;

};