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
    _scrollViewElement: {},

    init: function () {
        cc.log("AchievementLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 968));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon210);
        titleIcon.setPosition(cc.p(360, 1000));
        this.addChild(titleIcon);

        var achievement = gameData.achievement.get("achievement");
        var len = gameData.achievement.get("length");
        cc.log(achievement);
        var scrollViewHeight = len * 100;
        if (scrollViewHeight < 700) {
            scrollViewHeight = 700;
        }

        var scrollViewLayer = MarkLayer.create(cc.rect(54, 228, 609, 700));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        this._scrollViewElement = {};

        var y = scrollViewHeight;
        for (var key in achievement) {
            y -= 100;

            var bgSprite = cc.Sprite.create(main_scene_image.button42);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(bgSprite);

            var nameIcon = cc.Sprite.create(main_scene_image.icon211);
            nameIcon.setPosition(cc.p(120, y + 72));
            scrollViewLayer.addChild(nameIcon);

            var nameLabel = StrokeLabel.create(achievement[key].name, "STHeitiTC-Medium", 25);
            nameLabel.setColor(cc.c3b(255, 224, 147));
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(45, y + 69));
            scrollViewLayer.addChild(nameLabel, 1);

            var countLabel = cc.LabelTTF.create(
                "(" + achievement[key].count + "/" + achievement[key].need + ")",
                "STHeitiTC-Medium",
                20
            );
            countLabel.setColor(cc.c3b(45, 18, 1));
            countLabel.setAnchorPoint(cc.p(0, 0.5));
            countLabel.setPosition(cc.p(200, y + 69));
            scrollViewLayer.addChild(countLabel);

            var descriptionLabel = cc.LabelTTF.create(achievement[key].description, "STHeitiTC-Medium", 20);
            descriptionLabel.setColor(cc.c3b(45, 18, 1));
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setPosition(cc.p(45, y + 34));
            scrollViewLayer.addChild(descriptionLabel);

            var isReceiver = achievement[key].isReceiver;
            var isAchieve = achievement[key].isAchieve;

            this._scrollViewElement[key] = {};

            var isReceiverIcon = cc.Sprite.create(main_scene_image.icon212);
            isReceiverIcon.setPosition(cc.p(510, y + 40));
            scrollViewLayer.addChild(isReceiverIcon);

            if (!isReceiver) {
                isReceiverIcon.setVisible(false);

                if (isAchieve) {
                    var receiverItem = cc.MenuItemImage.createWithIcon(
                        main_scene_image.button9,
                        main_scene_image.button9s,
                        main_scene_image.button9d,
                        main_scene_image.icon123,
                        this._onClickReceiver(parseInt(key)),
                        this
                    );
                    receiverItem.setPosition(cc.p(510, y + 40));
                    menu.addChild(receiverItem);

                    this._scrollViewElement[key].isReceiverIcon = isReceiverIcon;
                    this._scrollViewElement[key].receiverItem = receiverItem;
                } else {
                    var energyIcon = cc.Sprite.create(main_scene_image.icon213);
                    energyIcon.setPosition(cc.p(410, y + 40));
                    scrollViewLayer.addChild(energyIcon);

                    var energyLabel = cc.LabelTTF.create(achievement[key].energy, "Arial", 25);
                    energyLabel.setColor(cc.c3b(99, 62, 21));
                    energyLabel.setAnchorPoint(cc.p(0, 0.5));
                    energyLabel.setPosition(cc.p(430, y + 40));
                    scrollViewLayer.addChild(energyLabel);

                    var goldIcon = cc.Sprite.create(main_scene_image.icon214);
                    goldIcon.setPosition(cc.p(510, y + 40));
                    scrollViewLayer.addChild(goldIcon);

                    var goldLabel = cc.LabelTTF.create(achievement[key].gold, "Arial", 25);
                    goldLabel.setColor(cc.c3b(99, 62, 21));
                    goldLabel.setAnchorPoint(cc.p(0, 0.5));
                    goldLabel.setPosition(cc.p(530, y + 40));
                    scrollViewLayer.addChild(goldLabel);
                }
            }
        }

        var scrollView = cc.ScrollView.create(cc.size(609, 700), scrollViewLayer);
        scrollView.setPosition(cc.p(54, 228));
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

            var that = this;
            gameData.achievement.receiver(function (data) {
                cc.log(data);

                that._scrollViewElement[id].receiverItem.setVisible(false);
                that._scrollViewElement[id].isReceiverIcon.setVisible(true);
            }, id);
        }

    }
});


AchievementLayer.create = function () {
    var ret = new AchievementLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};