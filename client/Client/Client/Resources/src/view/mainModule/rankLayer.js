/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 下午12:00
 * To change this template use File | Settings | File Templates.
 */

/*
 * ranking layer
 * */

var RankLayer = cc.Layer.extend({
    init: function () {
        cc.log("RankLayer init");

        if (!this._super()) return false;

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create("RankLayer", 'Times New Roman', 60);
        label.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(label);

        return true;
    }
})

RankLayer.create = function () {
    var ret = new RankLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}