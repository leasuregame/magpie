/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午5:33
 * To change this template use File | Settings | File Templates.
 */


/*
 * activity layer
 * */


var ActivityLayer = cc.Layer.extend({
    init: function () {
        cc.log("ActivityLayer init");

        if (!this._super()) return false;

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create("ActivityLayer", "黑体", 60);
        label.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(label);

        return true;
    }
});


ActivityLayer.create = function () {
    var ret = new ActivityLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};