/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午5:22
 * To change this template use File | Settings | File Templates.
 */


/*
 * config layer
 * */


var ConfigLayer = cc.Layer.extend({
    init: function () {
        cc.log("ConfigLayer init");

        if (!this._super()) return false;

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create("ConfigLayer", "STHeitiTC-Medium", 60);
        label.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(label);

        return true;
    }
});


ConfigLayer.create = function () {
    var ret = new ConfigLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};