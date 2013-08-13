/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:53
 * To change this template use File | Settings | File Templates.
 */


/*
 * message layer
 * */

var MessageLayer = cc.Layer.extend({
    init: function () {
        cc.log("MessageLayer init");

        if (!this._super()) return false;

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create("MessageLayer", '黑体', 60);
        label.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(label);

        return true;
    }
})

MessageLayer.create = function () {
    var res = new MessageLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
}