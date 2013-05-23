/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:26
 * To change this template use File | Settings | File Templates.
 */


/*
* shop layer
* */

var ShopLayer = cc.Layer.extend({
    init : function() {
        cc.log("ShopLayer init");

        if(!this._super()) return false;

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create("ShopLayer");
        label.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(label);

        return true;
    }
})

ShopLayer.create = function() {
    var ret = new ShopLayer();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}