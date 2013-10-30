/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午10:52
 * To change this template use File | Settings | File Templates.
 */


/*
 *  main bg layer
 * */


var MainBgLayer = cc.Layer.extend({
    _messagesLabel: null,

    init: function () {
        cc.log("MainBgLayer init");

        if (!this._super()) return false;

        this._messagesLabel = MessageLabel.create();
        this._messagesLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 1014));
        this.addChild(this._messagesLabel);

        return true;
    },

    changeMessage: function (msg) {
        cc.log("MainBgLayer changeMessage");

        this._messagesLabel.push(msg);
    }
});


MainBgLayer.create = function () {
    var ret = new MainBgLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};