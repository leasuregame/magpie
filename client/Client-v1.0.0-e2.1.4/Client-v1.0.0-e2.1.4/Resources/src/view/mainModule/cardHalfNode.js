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


var CardHalfNode = CardNode.extend({
    init: function (card) {
        cc.log("CardNode init");

        if (!this._super(card)) return false;

        var url = this._card.get("url");
        var star = this._card.get("star");
        var index = Math.floor((star - 1) / 2) + 1;

        this._frameSprite = cc.Sprite.create(main_scene_image["card_frame" + star]);
        this.addChild(this._frameSprite, -1);

        this._heroSprite = cc.Sprite.create(main_scene_image[url + "_half" + index]);
        this.addChild(this._heroSprite);

        var skillType = this._card.get("skillType");
        if (skillType > 3) {
            skillType = 3;
        }

        this._iconSprite = cc.Sprite.create(main_scene_image["card_icon" + skillType]);
        this._iconSprite.setPosition(cc.p(47, -60));
        this.addChild(this._iconSprite, 1);

        return true;
    }
})


CardHalfNode.create = function (card) {
    var ret = new CardHalfNode();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
}