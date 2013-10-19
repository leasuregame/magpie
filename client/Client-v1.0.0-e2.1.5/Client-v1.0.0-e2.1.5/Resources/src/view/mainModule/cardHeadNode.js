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

    init: function (card) {
        cc.log("CardHeadNode init");

        if (!this._super()) return false;

        this._card = card;

        var url = "icon11";
        var star = 1;

        if (this._card === -1) {
            url = "icon12";
        } else if (this._card) {
            star = this._card.get("star");
            url = this._card.get("url") + "_head" + (Math.floor((star - 1) / 2) + 1);
        }

        this._cardSprite = cc.Sprite.create(main_scene_image[url]);
        this._cardSprite.setAnchorPoint(cc.p(0, 0));
        this._cardSprite.setPosition(cc.p(6, 12));
        this.addChild(this._cardSprite);

        this._frameSprite = cc.Sprite.create(main_scene_image["card_item_bg" + star]);
        this._frameSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(this._frameSprite);

        this.setContentSize(cc.size(108, 108));

        return true;
    },

    getId: function () {
        cc.log("CardNode getId");

        return this._card.get("id");
    },

    setColor: function (color3) {
        this._frameSprite.setColor(color3);
        this._cardSprite.setColor(color3);
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
    var cardItem = cc.MenuItemLabel.create(cardHeadNode, cb, target);

    cardItem.setColor = function (color3) {
        cardHeadNode.setColor(color3);
    };

    return cardItem;
};