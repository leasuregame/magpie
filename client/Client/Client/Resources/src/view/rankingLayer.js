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

var RankingLayer = cc.Layer.extend({
    init: function () {
        cc.log("RankingLayer init");

        if (!this._super()) return false;

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create("RankingLayer", 'Times New Roman', 60);
        label.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(label);

        return true;
    }
})

RankingLayer.create = function () {
    var ret = new RankingLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}