/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 上午11:58
 * To change this template use File | Settings | File Templates.
 */


/*
 * card library layer
 * */

var CardLibraryLayer = cc.Layer.extend({
    init: function () {
        cc.log("CardLibraryLayer init");

        if (!this._super()) return false;


        return true;
    }
});

CardLibraryLayer.create = function () {
    var res = new CardLibraryLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};