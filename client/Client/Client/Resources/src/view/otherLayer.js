/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:53
 * To change this template use File | Settings | File Templates.
 */


/*
* other layer
* */

var OtherLayer = cc.Layer.extend({
    init : function() {
        cc.log("OtherLayer init");

        if(!this._super()) return false;

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create("OtherLayer", 'Times New Roman', 60);
        label.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(label);

        return true;
    }
})

OtherLayer.create = function() {
    var res = new OtherLayer();

    if(res && res.init()) {
        return res;
    }

    return null;
}