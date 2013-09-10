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
        headIcon.setPosition(cc.p(40, 962));
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

            var nameLabel = StrokeLabel.create(achievement[key].name, "黑体", 25);
            nameLabel.setColor(cc.c3b(255, 224, 147));
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(45, y + 69));
            scrollViewLayer.addChild(nameLabel, 1);

            var countLabel = cc.LabelTTF.create(
                "(" + achievement[key].count + "/" + achievement[key].need + ")",
                "黑体",
                20
            );
            countLabel.setColor(cc.c3b(45, 18, 1));
            countLabel.setAnchorPoint(cc.p(0, 0.5));
            countLabel.setPosition(cc.p(200, y + 69));
            scrollViewLayer.addChild(countLabel);

            var descriptionLabel = cc.LabelTTF.create(achievement[key].description, "黑体", 20);
            descriptionLabel.setColor(cc.c3b(45, 18, 1));
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setPosition(cc.p(45, y + 34));
            scrollViewLayer.addChild(descriptionLabel);

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

            var isAchieveIcon = cc.Sprite.create(main_scene_image.icon212);
            isAchieveIcon.setPosition(cc.p(510, y + 40));
            scrollViewLayer.addChild(isAchieveIcon);
            isAchieveIcon.setVisible(false);

            var receiverItem = cc.MenuItemImage.create(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                this._onClickReceiver(parseInt(key)),
                this
            );
            receiverItem.setPosition(cc.p(510, y + 40));
            menu.addChild(receiverItem);
            receiverItem.setVisible(false);

            var receiverIcon = cc.Sprite.create(main_scene_image.icon123);
            receiverIcon.setPosition(cc.p(510, y + 40));
            scrollViewLayer.addChild(receiverIcon, 1);
            receiverIcon.setVisible(false);

            this._scrollViewElement[key] = {
                energyIcon: energyIcon,
                energyLabel: energyLabel,
                goldIcon: goldIcon,
                goldLabel: goldLabel,
                isAchieveIcon: isAchieveIcon,
                receiverItem: receiverItem,
                receiverIcon: receiverIcon
            };
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

    update: function () {
        cc.log("AchievementLayer update");
    },

    _onClickReceiver: function (id) {
        return function () {
            cc.log("AchievementLayer _onClickReceiver: " + id);

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