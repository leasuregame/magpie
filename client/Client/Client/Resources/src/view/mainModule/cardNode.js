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
    _cardFrameSprite: null,
    _cardSprite: null,
    _cardIconSprite: null,

    init: function (card) {
        cc.log("CardNode init");

        if (!this._super()) return false;

        this._card = card;

        var star = this._card.get("star");

        this._cardFrameSprite = cc.Sprite.create(main_scene_image[""]);
        this.addChild(this._cardFrameSprite, -1);

        this._cardSprite = cc.Sprite.create();
        this.addChild(this._cardSprite);

        this._cardIconSprite = cc.Sprite.create();
        this._cardIconSprite.setPosition(cc.p());
        this.addChild(this._cardIconSprite, 0);

        return true;
    }
})


CardNode.create = function (card) {
    var ret = new CardNode();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
}