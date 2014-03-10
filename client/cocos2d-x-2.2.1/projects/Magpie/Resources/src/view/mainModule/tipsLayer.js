/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-28
 * Time: 下午6:11
 * To change this template use File | Settings | File Templates.
 */


var TipsLayer = LazyLayer.extend({
    _tipsLayerFit: null,

    onEnter: function () {
        cc.log("TipsLayer onEnter");

        this._super();

        lz.um.beginLogPageView("帮助界面");
    },

    onExit: function () {
        cc.log("TipsLayer onExit");

        this._super();

        lz.um.endLogPageView("帮助界面");
    },

    init: function () {
        cc.log("TipsLayer init");
        if (!this._super) return false;

        this._tipsLayerFit = gameFit.mainScene.tipsLayer;

        var lazyLayer = LazyLayer.create();
        this.addChild(lazyLayer);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 720, 1136);
        bgLayer.setPosition(cc.p(0, 88));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(this._tipsLayerFit.bgSpriteContentSize);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._tipsLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var title = StrokeLabel.create("攻略", "STHeitiTC-Medium", 40);
        title.setPosition(this._tipsLayerFit.titlePoint);
        this.addChild(title);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._tipsLayerFit.closeItemPoint);
        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var scrollViewLayer = MarkLayer.create(this._tipsLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setTouchPriority(-200);
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollView = cc.ScrollView.create(this._tipsLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setTouchPriority(-300);
        scrollView.setPosition(this._tipsLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        var keys = Object.keys(gameHelp);
        var len = keys.length;
        var scrollViewHeight = 11 * 250;

        for (var i = 0; i < len; ++i) {
            var key = keys[i];
            var help = gameHelp[key];

            var y = scrollViewHeight - 250 - i * 250;
            var bgSpriteUrl = main_scene_image.icon169;
            var bgSprite = cc.Scale9Sprite.create(bgSpriteUrl);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            bgSprite.setContentSize(cc.size(580, 250));
            scrollViewLayer.addChild(bgSprite);

            var title = StrokeLabel.create(help.title, "STHeitiTC-Medium", 30);
            title.setAnchorPoint(cc.p(0, 0));
            title.setPosition(cc.p(10, y + 195));
            title.setColor(cc.c3b(255, 232, 75));
            scrollViewLayer.addChild(title);

            var yy = scrollViewHeight - 85 - 250 * i;
            var descriptions = help.descriptions;
            var len2 = descriptions.length;
            for (var j = 0; j < len2; j++) {
                var description = lz.format(descriptions[j], 28);
                this._addDescription(description, yy, scrollViewLayer);
                yy -= description.length * 25;
            }
        }

        scrollView.setContentSize(cc.size(580, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
    },

    _addDescription: function (desc, y, parent) {
        for (var i = 0; i < desc.length; i++) {
            var itemText = cc.LabelTTF.create(desc[i], "STHeitiTC-Medium", 20);
            itemText.setAnchorPoint(cc.p(0, 0));
            itemText.setPosition(cc.p(10, y - i * 25));
            parent.addChild(itemText);
        }
    },

    _onClickClose: function () {
        cc.log("TipsLayer _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }
});


TipsLayer.create = function () {
    var ret = new TipsLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


TipsLayer.pop = function () {
    var tipsLayer = TipsLayer.create();

    MainScene.getInstance().getLayer().addChild(tipsLayer, 10);

    return tipsLayer;
};
