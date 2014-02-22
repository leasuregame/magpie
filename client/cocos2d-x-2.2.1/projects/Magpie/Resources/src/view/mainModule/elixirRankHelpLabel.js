/**
 * Created by lujunyu on 14-2-22.
 */

var ElixirRankHelpLabel = LazyLayer.extend({

    _elixirRankHelpLabelFit: null,

    init: function () {
        cc.log("ElixirRankHelpLabel init");

        if (!this._super()) return false;

        this._elixirRankHelpLabelFit = gameFit.mainScene.elixirRankHelpLabel;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var headIcon = cc.Sprite.create(main_scene_image.icon381);
        headIcon.setPosition(this._elixirRankHelpLabelFit.headIconPoint);
        this.addChild(headIcon);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(this._elixirRankHelpLabelFit.bgSpriteSize);
        bgSprite.setAnchorPoint(cc.p(0.5, 0));
        bgSprite.setPosition(this._elixirRankHelpLabelFit.bgSpritePoint);
        this.addChild(bgSprite);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        titleBgIcon.setPosition(this._elixirRankHelpLabelFit.titleBgIconPoint);
        this.addChild(titleBgIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon378);
        titleIcon.setPosition(this._elixirRankHelpLabelFit.titleIconPoint);
        this.addChild(titleIcon);

        var rankBgIcon = cc.Scale9Sprite.create(main_scene_image.icon169);
        rankBgIcon.setPosition(this._elixirRankHelpLabelFit.rankBgIconPoint);
        rankBgIcon.setContentSize(this._elixirRankHelpLabelFit.rankBgIconSize);
        this.addChild(rankBgIcon);

        var tipIcon = cc.Sprite.create(main_scene_image.icon384);
        tipIcon.setPosition(this._elixirRankHelpLabelFit.tipIconPoint);
        this.addChild(tipIcon);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._elixirRankHelpLabelFit.closeItemPoint);


        var menu = LazyMenu.create(closeItem);
        menu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var tipBgIcon = cc.Sprite.create(main_scene_image.icon175);
        tipBgIcon.setPosition(this._elixirRankHelpLabelFit.tipPoint);
        tipBgIcon.setScaleX(1.2);
        tipBgIcon.setScaleY(0.4);
        this.addChild(tipBgIcon);

        var tipLabel = cc.LabelTTF.create("50名以外，排名越高，奖励越高", "STHeitiTC-Medium", 26)
        tipLabel.setPosition(this._elixirRankHelpLabelFit.tipPoint);
        this.addChild(tipLabel);

        this._addRankScrollView();

        return true;
    },

    _addRankScrollView: function () {
        cc.log("ElixirRankHelpLabel _addRankScrollView");

        var scrollViewLayer = MarkLayer.create(this._elixirRankHelpLabelFit.scrollViewLayerRect);
        scrollViewLayer.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);

        var len = 50;
        var scrollViewHeight = len * 75;

        for (var i = 0; i < len; i++) {
            var y = scrollViewHeight - 65 - 75 * i;

            var bgIcon = cc.Sprite.create(main_scene_image.button6);
            bgIcon.setAnchorPoint(cc.p(0, 0));
            bgIcon.setPosition(cc.p(5, y));
            scrollViewLayer.addChild(bgIcon);

            if (i < 3) {
                var rankIcon = cc.Sprite.create(main_scene_image["icon" + (201 + i)]);
                rankIcon.setPosition(cc.p(42, y + 30));
                scrollViewLayer.addChild(rankIcon);
            } else {
                var rankLabel = StrokeLabel.create(i + 1, "Arial", 55);
                rankLabel.setColor(cc.c3b(255, 252, 175));
                rankLabel.setPosition(cc.p(42, y + 32));
                scrollViewLayer.addChild(rankLabel);
            }

            var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
            moneyIcon.setAnchorPoint(cc.p(0, 0.5));
            moneyIcon.setPosition(cc.p(85, y + 30));
            scrollViewLayer.addChild(moneyIcon);

            var moneyLabel = cc.LabelTTF.create("600000", "STHeitiTC-Medium", 22);
            moneyLabel.setAnchorPoint(cc.p(0, 0.5));
            moneyLabel.setColor(cc.c3b(123, 76, 65));
            moneyLabel.setPosition(cc.p(135, y + 28));
            scrollViewLayer.addChild(moneyLabel);

            var expCardIcon = cc.Sprite.create(main_scene_image.icon316);
            expCardIcon.setAnchorPoint(cc.p(0, 0.5));
            expCardIcon.setPosition(cc.p(207, y + 30));
            scrollViewLayer.addChild(expCardIcon);

            var expCardLabel = cc.LabelTTF.create("60", "STHeitiTC-Medium", 22);
            expCardLabel.setAnchorPoint(cc.p(0, 0.5));
            expCardLabel.setColor(cc.c3b(123, 76, 65));
            expCardLabel.setPosition(cc.p(258, y + 28));
            scrollViewLayer.addChild(expCardLabel);

            var elixirIcon = cc.Sprite.create(main_scene_image.icon151);
            elixirIcon.setAnchorPoint(cc.p(0, 0.5));
            elixirIcon.setPosition(cc.p(284, y + 30));
            scrollViewLayer.addChild(elixirIcon);

            var elixirLabel = cc.LabelTTF.create("60000", "STHeitiTC-Medium", 22);
            elixirLabel.setAnchorPoint(cc.p(0, 0.5));
            elixirLabel.setColor(cc.c3b(123, 76, 65));
            elixirLabel.setPosition(cc.p(330, y + 28));
            scrollViewLayer.addChild(elixirLabel);

            var powerIcon = cc.Sprite.create(main_scene_image.icon150);
            powerIcon.setAnchorPoint(cc.p(0, 0.5));
            powerIcon.setPosition(cc.p(388, y + 30));
            scrollViewLayer.addChild(powerIcon);

            var powerLabel = cc.LabelTTF.create("200", "STHeitiTC-Medium", 22);
            powerLabel.setAnchorPoint(cc.p(0, 0.5));
            powerLabel.setColor(cc.c3b(123, 76, 65));
            powerLabel.setPosition(cc.p(431, y + 28));
            scrollViewLayer.addChild(powerLabel);

            var energyIcon = cc.Sprite.create(main_scene_image.icon154);
            energyIcon.setAnchorPoint(cc.p(0, 0.5));
            energyIcon.setPosition(cc.p(472, y + 30));
            scrollViewLayer.addChild(energyIcon);

            var energyLabel = cc.LabelTTF.create("10000", "STHeitiTC-Medium", 22);
            energyLabel.setAnchorPoint(cc.p(0, 0.5));
            energyLabel.setColor(cc.c3b(123, 76, 65));
            energyLabel.setPosition(cc.p(518, y + 28));
            scrollViewLayer.addChild(energyLabel);

        }

        var scrollView = cc.ScrollView.create(this._elixirRankHelpLabelFit.scrollViewSize, scrollViewLayer);
        scrollView.setPosition(this._elixirRankHelpLabelFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(600, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

    },

    _onClickClose: function () {
        cc.log("ElixirRankHelpLabel _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.removeFromParent();
    }
});

ElixirRankHelpLabel.create = function () {
    cc.log("ElixirRankHelpLabel create");

    var ref = new ElixirRankHelpLabel();
    if (ref && ref.init()) {
        return ref;
    }
    return null
};

ElixirRankHelpLabel.pop = function () {
    cc.log("ElixirRankHelpLabel pop");

    var elixirRankHelpLabel = ElixirRankHelpLabel.create();
    MainScene.getInstance().getLayer().addChild(elixirRankHelpLabel, 10);
};