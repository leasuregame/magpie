/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-9
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */


/*
 * achievement layer
 * */


var AchievementLayer = cc.Layer.extend({
    _achievementLayerFit: null,

    _scrollViewElement: {},

    init: function () {
        cc.log("AchievementLayer init");

        if (!this._super()) return false;

        this._achievementLayerFit = gameFit.mainScene.achievementLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._achievementLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._achievementLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon210);
        titleIcon.setPosition(this._achievementLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._achievementLayerFit.backItemPoint);
        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);


        var achievement = gameData.achievement.get("achievement");
        var len = gameData.achievement.get("length");
        cc.log(achievement);
        var scrollViewHeight = len * 120;
        if (scrollViewHeight < 700) {
            scrollViewHeight = 700;
        }

        var scrollViewLayer = MarkLayer.create(this._achievementLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        this._scrollViewElement = {};

        var y = scrollViewHeight;
        for (var key in achievement) {
            y -= 120;

            var bgSprite = cc.Sprite.create(main_scene_image.button15);
            bgSprite.setScaleX(1.04);
            bgSprite.setScaleY(0.9);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(bgSprite);

            var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameIcon.setContentSize(cc.size(140, 34));
            nameIcon.setPosition(cc.p(95, y + 78));
            scrollViewLayer.addChild(nameIcon);

            var nameLabel = cc.LabelTTF.create(achievement[key].name, "STHeitiTC-Medium", 25);
            nameLabel.setColor(cc.c3b(255, 242, 206));
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(35, y + 78));
            scrollViewLayer.addChild(nameLabel, 1);

            var countLabel = cc.LabelTTF.create(
                "(" + achievement[key].count + "/" + achievement[key].need + ")",
                "STHeitiTC-Medium",
                20
            );
            countLabel.setColor(cc.c3b(56, 3, 5));
            countLabel.setAnchorPoint(cc.p(0, 0.5));
            countLabel.setPosition(cc.p(180, y + 79));
            scrollViewLayer.addChild(countLabel);

            var descriptionLabel = cc.LabelTTF.create(achievement[key].description, "STHeitiTC-Medium", 20);
            descriptionLabel.setColor(cc.c3b(56, 3, 5));
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setPosition(cc.p(30, y + 40));
            scrollViewLayer.addChild(descriptionLabel);

            var isReceiver = achievement[key].isReceiver;
            var isAchieve = achievement[key].isAchieve;

            this._scrollViewElement[key] = {};

            var isReceiverIcon = cc.Sprite.create(main_scene_image.icon212);
            isReceiverIcon.setPosition(cc.p(510, y + 60));
            scrollViewLayer.addChild(isReceiverIcon);

            if (!isReceiver) {
                isReceiverIcon.setVisible(false);

                if (isAchieve) {
                    var receiverItem = cc.MenuItemImage.createWithIcon(
                        main_scene_image.button10,
                        main_scene_image.button10s,
                        main_scene_image.icon123,
                        this._onClickReceiver(parseInt(key)),
                        this
                    );
                    receiverItem.setPosition(cc.p(510, y + 60));
                    menu.addChild(receiverItem);

                    this._scrollViewElement[key].isReceiverIcon = isReceiverIcon;
                    this._scrollViewElement[key].receiverItem = receiverItem;
                } else {
                    var goldIcon = cc.Sprite.create(main_scene_image.icon214);
                    goldIcon.setPosition(cc.p(410, y + 50));
                    scrollViewLayer.addChild(goldIcon);

                    var goldLabel = cc.LabelTTF.create(achievement[key].gold, "Arial", 25);
                    goldLabel.setColor(cc.c3b(56, 3, 5));
                    goldLabel.setAnchorPoint(cc.p(0, 0.5));
                    goldLabel.setPosition(cc.p(430, y + 50));
                    scrollViewLayer.addChild(goldLabel);

                    var energyIcon = cc.Sprite.create(main_scene_image.icon213);
                    energyIcon.setPosition(cc.p(510, y + 50));
                    scrollViewLayer.addChild(energyIcon);

                    var energyLabel = cc.LabelTTF.create(achievement[key].energy, "Arial", 25);
                    energyLabel.setColor(cc.c3b(56, 3, 5));
                    energyLabel.setAnchorPoint(cc.p(0, 0.5));
                    energyLabel.setPosition(cc.p(530, y + 50));
                    scrollViewLayer.addChild(energyLabel);
                }
            }
        }

        var scrollView = cc.ScrollView.create(this._achievementLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setPosition(this._achievementLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(609, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
    },

    _onClickReceiver: function (id) {
        return function () {
            cc.log("AchievementLayer _onClickReceiver: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var that = this;
            gameData.achievement.receiver(function (data) {
                cc.log(data);

                that._scrollViewElement[id].receiverItem.setVisible(false);

                var isReceiverIcon = that._scrollViewElement[id].isReceiverIcon;
                isReceiverIcon.setVisible(true);

                isReceiverIcon.setScale(1.5);
                isReceiverIcon.runAction(
                    cc.Sequence.create(
                        cc.ScaleTo.create(0.3, 0.9, 0.9),
                        cc.ScaleTo.create(0.1, 1, 1)
                    )
                );

                lz.tipReward(data);
            }, id);
        }

    },

    _onClickBack: function () {
        cc.log("AchievementLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(MainLayer);
    }

});


AchievementLayer.create = function () {
    var ret = new AchievementLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};