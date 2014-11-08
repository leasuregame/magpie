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
        cc.log(JSON.stringify(card));
        if (!this._super()) return false;

        this._card = card;

        var url = "icon11";
        var star = 0;
        var frameUrl = "card_item_bg" + star;

        if (this._card === -1) {
            url = "icon12";
        } else if (this._card) {
            star = this._card.get("star");
            frameUrl = "card_item_bg" + star;
            if (this._card.isRareCard()) {
                url = this._card.get("url") + "_head" + (star == 5 ? 1 : 2);
                frameUrl = "rare_card_item_bg" + star;
            } else if (this._card.isLeadCard() || this._card.isBossCard()) {
                url = this._card.get("url") + "_head" + (star > 2 ? Math.min(star - 2, 3) : 1);
            } else if (this._card.isResourceCard()) {
                url = this._card.get("url") + "_head1";
            }
        } else {
            var effect = cc.BuilderReader.load(main_scene_image.uiEffect61, this);
            effect.setPosition(cc.p(51, 57));
            this.addChild(effect, 1);
        }
        cc.log('card url=======' + url);
        this._cardSprite = cc.Sprite.create(main_scene_image[url]);
        this._cardSprite.setAnchorPoint(cc.p(0, 0));
        if (star <= 5) {
            this._cardSprite.setPosition(cc.p(0, 6));
        } else {
            this._cardSprite.setPosition(cc.p(2, 4));
        }
        this.addChild(this._cardSprite);

        this._frameSprite = cc.Sprite.create(main_scene_image[frameUrl]);
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
        CardDetails.pop(card);
    };
    target = target || this;

    var cardHeadNode = CardHeadNode.create(card);
    var cardItem = cc.MenuItemLabel.create(cardHeadNode, cb, target);

    cardItem.setColor = function (color3) {
        cardHeadNode.setColor(color3);
    };

    return cardItem;
};