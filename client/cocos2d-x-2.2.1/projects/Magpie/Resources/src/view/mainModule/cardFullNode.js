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
    _cardSprite: null,

    init: function (card) {
        cc.log("CardFullNode init");

        if (!this._super()) return false;

        this._card = card;

        var url = this._card.get("url");
        var star = this._card.get("star");
        var index = star > 2 ? Math.min(star - 2, 3) : 1;

        if (this._card.isLeadCard()) {
            this._cardSprite = cc.Sprite.create(main_scene_image[url + "_full" + index]);
        } else if (this._card.isResourceCard()) {
            this._cardSprite = cc.Sprite.create(main_scene_image[url + "_full1"]);
        }

        this.addChild(this._cardSprite);

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