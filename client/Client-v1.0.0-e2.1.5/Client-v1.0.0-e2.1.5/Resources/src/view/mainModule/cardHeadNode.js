/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-31
 * Time: 下午4:55
 * To change this template use File | Settings | File Templates.
 */


/*
 * card head node
 * */


var CardHeadNode = cc.Node.extend({
    _card: null,
    _frameSprite: null,
    _cardSprite: null,
    _iconSprite: null,

    init: function (card) {
        cc.log("CardHeadNode init");

        if (!this._super()) return false;

        this._card = card;

        var url = "";
        var star = 1;
        var index = 1;

        if (this._card) {
            url = this._card.get("url");
            star = this._card.get("star");
            index = Math.floor((star - 1) / 2) + 1;
        }


        this._frameSprite = cc.Sprite.create(main_scene_image["card_item_bg" + star]);
        this._frameSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(this._frameSprite);

        if (url) {
            this._cardSprite = cc.Sprite.create(main_scene_image[url + "_head" + index]);
            this._cardSprite.setAnchorPoint(cc.p(0, 0));
            this._cardSprite.setPosition(cc.p(6, 12));
            this.addChild(this._cardSprite);
        }

        this._iconSprite = cc.Sprite.create(main_scene_image.card_item_frame);
        this._iconSprite.setAnchorPoint(cc.p(0, 0));
        this._iconSprite.setPosition(cc.p(6, 12));
        this.addChild(this._iconSprite);

        this.setContentSize(cc.size(108, 108));

        return true;
    },

    getId: function () {
        cc.log("CardNode getId");

        return this._card.get("id");
    }
});


CardHeadNode.create = function (card) {
    var ret = new CardHeadNode(card);

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
};


CardHeadNode.getCardHeadItem = function (card, cb, target) {
    card = card || null;
    cb = cb || function () {
        var cardDetails = CardDetails.create(card);
        cc.Director.getInstance().getRunningScene().addChild(cardDetails, 1);
    };
    target = target || this;

    var cardHeadNode = CardHeadNode.create(card);
    return cc.MenuItemLabel.create(cardHeadNode, cb, target);
};