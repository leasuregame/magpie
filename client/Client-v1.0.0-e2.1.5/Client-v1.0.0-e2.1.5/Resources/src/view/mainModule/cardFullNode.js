/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-31
 * Time: 下午6:14
 * To change this template use File | Settings | File Templates.
 */


/*
 * card full node
 * */


var CardFullNode = cc.Node.extend({
    _card: null,

    init: function (card) {
        cc.log("CardFullNode init");

        if (!this._super()) return false;

        this._card = card;

        var cardFullSprite = cc.Sprite.create(this._card.getCardFullUrl());
        this.addChild(cardFullSprite);

        var cardFullOverlayUrl = this._card.getCardFullOverlayUrl();
        if (cardFullOverlayUrl) {
            var cardFullOverlaySprite = cc.Sprite.create(cardFullOverlayUrl);
            this.addChild(cardFullOverlaySprite);
        }

        return true;
    },

    getId: function () {
        cc.log("CardNode getId");

        return this._card.get("id");
    }
});


CardFullNode.create = function (card) {
    var ret = new CardFullNode();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
};