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

        var urlList = this._card.getCardFullUrl();
        var len = urlList.length;

        for (var i = 0; i < len; ++i) {
            var cardFullSprite = cc.Sprite.create(urlList[i]);
            this.addChild(cardFullSprite);
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