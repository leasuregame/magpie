/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午5:15
 * To change this template use File | Settings | File Templates.
 */


/*
 * evolution layer
 * */


var EvolutionLayer = cc.Layer.extend({
    init: function () {
        cc.log("EvolutionLayer init");

        if (!this._super()) return false;

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create("EvolutionLayer", '黑体', 60);
        label.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(label);

        return true;
    }
})


EvolutionLayer.create = function () {
    var ret = new EvolutionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}