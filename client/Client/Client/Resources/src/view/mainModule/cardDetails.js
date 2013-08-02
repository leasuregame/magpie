/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-3
 * Time: 下午3:06
 * To change this template use File | Settings | File Templates.
 */


/*
 * 卡牌 详细信息面板
 * */


var CardDetails = LazyLayer.extend({
    _card: null,

    init: function (card) {
        cc.log("CardDetails init");

        if (!this._super()) return false;

        this._card = card;

        var bgSprite = cc.Sprite.create(main_scene_image.bg7);
        bgSprite.setPosition(GAME_MIDPOINT);
        this.addChild(bgSprite);

        var cardFullNode = CardFullNode.create(this._card);
        cardFullNode.setPosition(cc.p(220, 730));
        this.addChild(cardFullNode);

        var activeSkillLabel = cc.Sprite.create(main_scene_image.icon34);
        activeSkillLabel.setPosition(cc.p(510, 800));
        this.addChild(activeSkillLabel);

        var passiveSkillLabel = cc.Sprite.create(main_scene_image.icon35);
        passiveSkillLabel.setPosition(cc.p(510, 640));
        this.addChild(passiveSkillLabel);

        var informationLabel = cc.Sprite.create(main_scene_image.icon36);
        informationLabel.setPosition(cc.p(200, 610));
        this.addChild(informationLabel);

        var closeItem = cc.MenuItemImage.create(main_scene_image.button17, main_scene_image.button17s, this._onClickClose, this);
        closeItem.setPosition(360, 130);

        this.addMenuItem(closeItem);

        return true;
    },

    _onClickClose: function () {
        cc.log("CardDetails _onClickClose");

        this.setCanClick(false);
        this.removeFromParent();
    }
})


CardDetails.create = function (card) {
    var ret = new CardDetails();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
}

