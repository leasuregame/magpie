/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-28
 * Time: 下午6:43
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle message layer
 * */


var BattleMessageLayer = cc.Layer.extend({
    init: function () {
        cc.log("BattleMessageLayer init");

        if (!this._super()) return false;

        return true;
    }
});


BattleMessageLayer.create = function () {
    var ret = new BattleMessageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}