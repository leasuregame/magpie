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

    onEnter: function () {
        cc.log("AchievementLayer onEnter");

        this._super();

        lz.um.beginLogPageView("成就界面");
    },

    onExit: function () {
        cc.log("AchievementLayer onExit");

        this._super();

        lz.um.endLogPageView("成就界面");
    },

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


        var achievement = gameData.achievement.getAchievementList();
        var len = achievement.length;
        var scrollViewHeight = len * 120;
        if (scrollViewHeight < this._achievementLayerFit.scrollViewHeight) {
            scrollViewHeight = this._achievementLayerFit.scrollViewHeight;
        }

        var slideLabel = [];

        var scrollViewLayer = MarkLayer.create(this._achievementLayerFit.scrollViewLayerRect);

        this._scrollViewElement = {};

        var y = scrollViewHeight;
        for (var i = 0; i < len; ++i) {
            y -= 120;
            var id = achievement[i].id;

            slideLabel[i] = cc.Node.create();
            slideLabel[i].setPosition(cc.p(0, 0));
            slideLabel[i].setVisible(false);

            var menu = LazyMenu.create();
            menu.setPosition(cc.p(0, 0));
            slideLabel[i].addChild(menu, 1);

            var bgSprite = cc.Sprite.create(main_scene_image.button15);
            bgSprite.setScaleX(1.04);
            bgSprite.setScaleY(0.9);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            slideLabel[i].addChild(bgSprite);

            var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameIcon.setContentSize(cc.size(140, 34));
            nameIcon.setPosition(cc.p(95, y + 78));
            slideLabel[i].addChild(nameIcon);

            var nameLabel = cc.LabelTTF.create(achievement[i].name, "STHeitiTC-Medium", 25);
            nameLabel.setColor(cc.c3b(255, 242, 206));
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(35, y + 78));
            slideLabel[i].addChild(nameLabel, 1);

            var countLabel = cc.LabelTTF.create(
                "(" + achievement[i].count + "/" + achievement[i].need + ")",
                "STHeitiTC-Medium",
                20
            );
            countLabel.setColor(cc.c3b(56, 3, 5));
            countLabel.setAnchorPoint(cc.p(0, 0.5));
            countLabel.setPosition(cc.p(180, y + 79));
            slideLabel[i].addChild(countLabel);

            var descriptionLabel = cc.LabelTTF.create(achievement[i].description, "STHeitiTC-Medium", 20);
            descriptionLabel.setColor(cc.c3b(56, 3, 5));
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setPosition(cc.p(30, y + 40));
            slideLabel[i].addChild(descriptionLabel);

            var isReceiver = achievement[i].isReceiver;
            var isAchieve = achievement[i].isAchieve;

            this._scrollViewElement[id] = {};

            var isReceiverIcon = cc.Sprite.create(main_scene_image.icon212);
            isReceiverIcon.setPosition(cc.p(535, y + 88));
            slideLabel[i].addChild(isReceiverIcon);

            var receiverItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button10,
                main_scene_image.button10s,
                main_scene_image.icon123,
                this._onClickReceiver(achievement[i].id),
                this
            );
            receiverItem.setPosition(cc.p(510, y + 60));
            menu.addChild(receiverItem);

            this._scrollViewElement[id].isReceiverIcon = isReceiverIcon;
            this._scrollViewElement[id].receiverItem = receiverItem;


            var rewardLabel = cc.Node.create();
            slideLabel[i].addChild(rewardLabel);

            var goldIcon = cc.Sprite.create(main_scene_image.icon148);
            goldIcon.setPosition(cc.p(410, y + 50));
            rewardLabel.addChild(goldIcon);

            var goldLabel = cc.LabelTTF.create(achievement[i].gold, "Arial", 25);
            goldLabel.setColor(cc.c3b(56, 3, 5));
            goldLabel.setAnchorPoint(cc.p(0, 0.5));
            goldLabel.setPosition(cc.p(430, y + 50));
            rewardLabel.addChild(goldLabel);

            var energyIcon = cc.Sprite.create(main_scene_image.icon154);
            energyIcon.setPosition(cc.p(510, y + 50));
            rewardLabel.addChild(energyIcon);

            var energyLabel = cc.LabelTTF.create(achievement[i].energy, "Arial", 25);
            energyLabel.setColor(cc.c3b(56, 3, 5));
            energyLabel.setAnchorPoint(cc.p(0, 0.5));
            energyLabel.setPosition(cc.p(530, y + 50));
            rewardLabel.addChild(energyLabel);

            this._scrollViewElement[id].rewardLabel = rewardLabel;

            if (!isReceiver) {
                isReceiverIcon.setVisible(false);
                if (isAchieve) {
                    receiverItem.setVisible(true);
                    rewardLabel.setVisible(false);
                } else {
                    receiverItem.setVisible(false);
                    rewardLabel.setVisible(true);
                }
            } else {
                receiverItem.setVisible(false);
            }

            scrollViewLayer.addChild(slideLabel[i]);
        }


        var scrollView = cc.ScrollView.create(this._achievementLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setPosition(this._achievementLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(609, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        var slideLayer = SlideLayer.create(
            {
                labels: slideLabel,
                slideTime: 0.4,
                timeTick: 0.05
            }
        );

        slideLayer.showSlide();

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

                that._scrollViewElement[id].rewardLabel.setVisible(true);

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
                gameMark.updateAchievementMark(false);

                if (mandatoryTeachingLayer) {
                    if (mandatoryTeachingLayer.isTeaching()) {
                        mandatoryTeachingLayer.clearAndSave();
                        mandatoryTeachingLayer.next();
                    }
                }

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