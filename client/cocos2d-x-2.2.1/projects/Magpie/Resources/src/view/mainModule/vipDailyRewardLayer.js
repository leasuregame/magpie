/**
 * Created by lujunyu on 14-5-5.
 */

var VipDailyRewardLayer = cc.Layer.extend({

    init: function () {
        cc.log("VipDailyRewardLayer init");

        if(!this._super()) return false;

        return true;
    }

});

VipDailyRewardLayer.create = function () {
    cc.log("VipDailyRewardLayer create");

    var ret = new VipDailyRewardLayer();
    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
