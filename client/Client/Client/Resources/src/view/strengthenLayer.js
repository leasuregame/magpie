/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:59
 * To change this template use File | Settings | File Templates.
 */


/*
 * 强化
 * */


var StrengthenLayer = cc.Layer.extend({
    init: function () {
        cc.log("StrengthenLayer init");

        if (!this._super()) return false;

        return true;
    }
})

StrengthenLayer.create = function () {
    var res = new StrengthenLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
}