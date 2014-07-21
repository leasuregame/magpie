/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-31
 * Time: 下午5:04
 * To change this template use File | Settings | File Templates.
 */


/*
 * card half node
 * */


var CardHalfNode = cc.Node.extend({
    _card: null,
    _frameSprite: null,
    _cardSprite: null,
    _iconSprite: null,

    init: function (card) {
        cc.log("CardHalfNode init");

        if (!this._super()) return false;

        this._card = card;

        var url = this._card.get("url");
        var star = this._card.get("star");
        var index;

        if (this._card.isBossCard()) {
            var ccbNode = cc.BuilderReader.load(main_scene_image[url], this);
            this.addChild(ccbNode);

            ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration("def", 0);
        } else {
            if (this._card.isRareCard()) {
                index = (5 == star) ? 1 : 2;
                this._cardSprite = cc.Sprite.create(main_scene_image[url + "_half" + index]);
                this._frameSprite = cc.Sprite.create(main_scene_image["card_frame" + star]);
            } else if (this._card.isLeadCard()) {
                index = star > 2 ? Math.min(star - 2, 3) : 1;
                this._cardSprite = cc.Sprite.create(main_scene_image[url + "_half" + index]);
                this._frameSprite = cc.Sprite.create(main_scene_image["card_frame" + star]);
            } else if (this._card.isResourceCard()) {
                this._cardSprite = cc.Sprite.create(main_scene_image[url + "_half1"]);
                this._frameSprite = cc.Sprite.create(main_scene_image["card_frame" + star]);
            }

            this.addChild(this._frameSprite);
            this.addChild(this._cardSprite);

            if (this._card.isRareCard() || this._card.isLeadCard()) {
                this._iconSprite = cc.Sprite.create(this._card.getCardIcon());
                this._iconSprite.setPosition(cc.p(40, -53));
                this.addChild(this._iconSprite);
            }

            if (this._card.getCardSubscript()) {
                var subscriptSprite = cc.Sprite.create(this._card.getCardSubscript());
                subscriptSprite.setAnchorPoint(cc.p(0, 0));
                subscriptSprite.setPosition(cc.p(-1.8, -2.3));
                this._iconSprite.addChild(subscriptSprite);
            }
        }

        return true;
    },

    up: function () {
        this._frameSprite.setScale(1.05);
        this._cardSprite.setScale(1.1);

        if (this._iconSprite) {
            this._iconSprite.setScale(1.05);
        }
    },

    put: function () {
        this._frameSprite.setScale(1);
        this._cardSprite.setScale(1);

        if (this._iconSprite) {
            this._iconSprite.setScale(1);
        }
    },

    getId: function () {
        cc.log("CardNode getId");

        return this._card.get("id");
    }
});


CardHalfNode.create = function (card) {
    var ret = new CardHalfNode();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
};