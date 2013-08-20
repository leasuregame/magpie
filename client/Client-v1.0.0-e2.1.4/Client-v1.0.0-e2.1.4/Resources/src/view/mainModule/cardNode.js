/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-30
 * Time: 上午1:48
 * To change this template use File | Settings | File Templates.
 */


/*
 * card node
 * */


var CardNode = cc.Node.extend({
    _card: null,
    _frameSprite: null,
    _heroSprite: null,
    _iconSprite: null,

    init: function (card) {
        cc.log("CardNode init");

        if (!this._super()) return false;

        this._card = card;

        return true;
    },

    getCardId: function () {
        cc.log("CardNode getCardId");

        return this._card.get("id");
    }
});


CardNode.create = function (card) {
    var ret = new CardNode();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
};