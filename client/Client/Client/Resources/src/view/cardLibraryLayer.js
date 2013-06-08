/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 上午11:58
 * To change this template use File | Settings | File Templates.
 */


/*
* CardLibraryLayer
* */

var CardLibraryLayer = cc.Layer.extend({
    init : function() {
        cc.log("CardLibraryLayer init");

        if(!this._super()) return false;

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create("CardLibraryLayer", 'Times New Roman', 60);
        label.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(label);



        return true;
    }
})

CardLibraryLayer.create = function() {
    var res = new CardLibraryLayer();

    if(res && res.init()) {
        return res;
    }

    return null;
}