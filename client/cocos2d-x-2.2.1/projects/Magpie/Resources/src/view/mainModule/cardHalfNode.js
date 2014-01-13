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
        var index = star > 2 ? star - 2 : 1;
        var skillType = this._card.get("skillType") || 0;
        if (skillType > 3) {
            skillType = 3;
        }

        this._frameSprite = cc.Sprite.create(main_scene_image["card_frame" + star]);
        this.addChild(this._frameSprite);

        this._cardSprite = cc.Sprite.create(main_scene_image[url + "_half" + index]);
        this.addChild(this._cardSprite);

        this._iconSprite = cc.Sprite.create(main_scene_image["card_icon" + skillType]);
        this._iconSprite.setPosition(cc.p(40, -53));
        this.addChild(this._iconSprite);

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