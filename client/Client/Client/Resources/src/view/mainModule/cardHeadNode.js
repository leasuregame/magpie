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


var CardHeadNode = CardNode.extend({
    init: function (card) {
        cc.log("CardHeadNode init");

        if (!this._super(card)) return false;

        var url = this._card.get("url");
        var star = this._card.get("star");
        var index = Math.floor((star - 1) / 2) + 1;

        this._frameSprite = cc.Sprite.create(main_scene_image["card_item_bg" + star]);
        this._frameSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(this._frameSprite);

        this._heroSprite = cc.Sprite.create(main_scene_image[url + "_head" + index]);
        this._heroSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(this._heroSprite);

        this._iconSprite = cc.Sprite.create(main_scene_image["card_item_frame" + star]);
        this._iconSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(this._iconSprite);

        this.setContentSize(cc.size(105, 106));

        return true;
    }
})


CardHeadNode.create = function (card) {
    var ret = new CardHeadNode(card);

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
}


CardHeadNode.getCardHeadItem = function (card, cb, target) {
    cb = cb || function () {
        var cardDetails = CardDetails.create(card);
        MainScene.getInstance().addChild(cardDetails, 1);
    };
    target = target || this;

    var cardHeadNode = CardHeadNode.create(card);
    return cc.MenuItemLabel.create(cardHeadNode, cb, target);
}