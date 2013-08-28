/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-28
 * Time: 下午6:48
 * To change this template use File | Settings | File Templates.
 */


/*
 * friend message layer
 * */


var FriendMessageLayer = cc.Layer.extend({
    init: function () {
        cc.log("FriendMessageLayer init");

        if (!this._super()) return false;

        return true;
    }
});


FriendMessageLayer.create = function () {
    var ret = new FriendMessageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}