/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 上午11:58
 * To change this template use File | Settings | File Templates.
 */


/*
 * card library layer
 * */


var CardLibraryLayer = cc.Layer.extend({
    init: function () {
        cc.log("CardLibraryLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite, -1);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon116);
        titleIcon.setPosition(cc.p(360, 1000));
        this.addChild(titleIcon);

        var tipIcon = cc.Sprite.create(main_scene_image.main_message_bg);
        tipIcon.setPosition(cc.p(360, 945));
        this.addChild(tipIcon);

        var tipLabel = cc.LabelTTF.create("每次获得新卡牌，点击该卡牌可领取仙丹。卡牌星级越高，可获得的仙丹越多。", "黑体", 17);
        tipLabel.setPosition(cc.p(360, 945));
        this.addChild(tipLabel);

        var cardLibrary = gameData.cardLibrary.get("cardLibrary");
        var len = cardLibrary.length;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 733));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var scrollViewHeight = Math.ceil(len / 4) * 143 + 35;

        for (var i = 0; i < len; ++i) {
            var row = Math.floor(i / 4);
            var index = i % 4;

            var cardItem = CardHeadNode.getCardHeadItem(cardLibrary[i].card);
            cardItem.setPosition(cc.p(94 + 148 * index, scrollViewHeight - 89 - 143 * row));
            menu.addChild(cardItem);
        }

        var scrollView = cc.ScrollView.create(cc.size(640, 733), scrollViewLayer);
        scrollView.setContentSize(cc.size(640, scrollViewHeight));
        scrollView.setPosition(GAME_BG_POINT);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);
        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
    }
});


CardLibraryLayer.create = function () {
    var res = new CardLibraryLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};