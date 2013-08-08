/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:52
 * To change this template use File | Settings | File Templates.
 */

/*
 * friend layer
 * */

var FriendLayer = cc.Layer.extend({
    init: function () {
        cc.log("FriendLayer init");

        if (!this._super()) return false;

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create("FriendLayer", 'Times New Roman', 60);
        label.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(label);

        return true;
    }
})

FriendLayer.create = function () {
    var res = new FriendLayer()

    if (res && res.init()) {
        return res;
    }

    return null;
}