/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午6:35
 * To change this template use File | Settings | File Templates.
 */


/*
 * explore layer
 * */


var ExploreLayer = cc.Layer.extend({
    _index: 0,
    _sectionId: 0,
    _spirit: null,
    _spiritShadow: null,
    _mapLabel: null,
    _exploreItem: null,
    _scrollView: null,
    _element: {},

    onEnter: function () {
        cc.log("ExploreLayer onEnter");

        this._super();
        this.update();
    },

    init: function (sectionId) {
        cc.log("ExploreLayer init");

        if (!this._super()) return false;

        this.setTouchEnabled(true);

        this._sectionId = sectionId;

        var bgSprite = cc.Sprite.create(main_scene_image.bg9);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        this._mapLabel = cc.Sprite.create(main_scene_image.bg4);
        this._mapLabel.setAnchorPoint(cc.p(0, 0));
        this._mapLabel.setPosition(cc.p(40, 766));
        this.addChild(this._mapLabel);

        var line1Icon = cc.Sprite.create(main_scene_image.icon96);
        line1Icon.setAnchorPoint(cc.p(0.5, 0));
        line1Icon.setPosition(cc.p(360, 928));
        this.addChild(line1Icon);

        var line2Icon = cc.Sprite.create(main_scene_image.icon96);
        line2Icon.setRotation(180);
        line2Icon.setAnchorPoint(cc.p(0.5, 0));
        line2Icon.setPosition(cc.p(360, 797));
        this.addChild(line2Icon);

        var descriptionIcon = cc.Sprite.create(main_scene_image.icon216);
        descriptionIcon.setPosition(cc.p(120, 250));
        this.addChild(descriptionIcon);

        var chapter = Math.ceil((this._sectionId) / TASK_SECTION_COUNT);

        var titleLabel = StrokeLabel.create(outputTables.chapter_title.rows[chapter].name, "STHeitiTC-Medium", 40);
        titleLabel.setColor(cc.c3b(255, 240, 170));
        titleLabel.setPosition(cc.p(360, 1005));
        this.addChild(titleLabel);

        this._spiritShadow = cc.Sprite.create(main_scene_image.icon217);
        this._spiritShadow.setPosition(cc.p(360, 786));
        this.addChild(this._spiritShadow);

        this._spirit = cc.Sprite.create(main_scene_image.spirit_side1);
        this._spirit.setAnchorPoint(cc.p(0.5, 0));
        this._spirit.setPosition(cc.p(360, 790));
        this.addChild(this._spirit);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(cc.p(100, 1005));

        this._exploreItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon38,
            this._onClickExplore,
            this
        );
        this._exploreItem.setPosition(cc.p(360, 370));

        var menu = cc.Menu.create(backItem, this._exploreItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        // 读配置表
        var chapterTable = outputTables.task.rows;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 569));

        var lazyMenu = LazyMenu.create();
        lazyMenu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(lazyMenu, 1);

        this._element = {};

        for (var i = 1; i <= TASK_POINTS_COUNT; ++i) {
            var id = this._getTaskId(i);
            var x = 640 * (i - 1);

            var exploreBgSprite = cc.Sprite.create(main_scene_image.bg10);
            exploreBgSprite.setPosition(cc.p(x + 320, 370));
            scrollViewLayer.addChild(exploreBgSprite);

            var nameLabel = cc.LabelTTF.create(chapterTable[id].section_name + " " + i + " / 10", "STHeitiTC-Medium", 25);
            nameLabel.setColor(cc.c3b(255, 240, 170));
            nameLabel.setPosition(cc.p(x + 320, 468));
            scrollViewLayer.addChild(nameLabel);

            var exploreExpLabel = cc.LabelTTF.create(chapterTable[id].exp_obtain, "STHeitiTC-Medium", 20);
            exploreExpLabel.setColor(cc.c3b(255, 240, 170));
            exploreExpLabel.setAnchorPoint(cc.p(0, 0.5));
            exploreExpLabel.setPosition(cc.p(255 + x, 410));
            scrollViewLayer.addChild(exploreExpLabel);

            var exploreMoneyLabel = cc.LabelTTF.create(chapterTable[id].coins_obtain, "STHeitiTC-Medium", 20);
            exploreMoneyLabel.setColor(cc.c3b(255, 240, 170));
            exploreMoneyLabel.setAnchorPoint(cc.p(0, 0.5));
            exploreMoneyLabel.setPosition(cc.p(405 + x, 410));
            scrollViewLayer.addChild(exploreMoneyLabel);

            var powerLabel = cc.LabelTTF.create("0/0", "STHeitiTC-Medium", 20);
            powerLabel.setColor(cc.c3b(255, 240, 170));
            powerLabel.setAnchorPoint(cc.p(0, 0.5));
            powerLabel.setPosition(cc.p(450 + x, 361));
            scrollViewLayer.addChild(powerLabel);

            var expLabel = cc.LabelTTF.create("999999", "STHeitiTC-Medium", 20);
            expLabel.setColor(cc.c3b(255, 240, 170));
            expLabel.setAnchorPoint(cc.p(0, 0.5));
            expLabel.setPosition(cc.p(450 + x, 320));
            scrollViewLayer.addChild(expLabel);

            var progressLabel = cc.LabelTTF.create("0/0", "STHeitiTC-Medium", 20);
            progressLabel.setColor(cc.c3b(255, 240, 170));
            progressLabel.setAnchorPoint(cc.p(0, 0.5));
            progressLabel.setPosition(cc.p(450 + x, 280));
            scrollViewLayer.addChild(progressLabel);

            var descriptionLabel = cc.Node.create();
            descriptionLabel.setPosition(cc.p(230, 270));
            this.addChild(descriptionLabel);

            var powerProgress = Progress.create(null, main_scene_image.progress1, 200, 200);
            powerProgress.setPosition(cc.p(320 + x, 362));
            scrollViewLayer.addChild(powerProgress);

            var expProgress = Progress.create(null, main_scene_image.progress2, 200, 200);
            expProgress.setPosition(cc.p(320 + x, 321));
            scrollViewLayer.addChild(expProgress);

            var sectionProgress = Progress.create(null, main_scene_image.progress3, 200, 200);
            sectionProgress.setPosition(cc.p(320 + x, 281));
            scrollViewLayer.addChild(sectionProgress);

            var description = lz.format(chapterTable[id].description, 20);
            var len = description.length;
            for (var j = 0; j < len; ++j) {
                var storyLabel = cc.LabelTTF.create(description[j], "STHeitiTC-Medium", 20);
                storyLabel.setAnchorPoint(cc.p(0, 0));
                storyLabel.setPosition(cc.p(0, -30 * j));
                descriptionLabel.addChild(storyLabel);
            }

            this._element[i] = {
                powerLabel: powerLabel,
                expLabel: expLabel,
                progressLabel: progressLabel,
                powerProgress: powerProgress,
                expProgress: expProgress,
                sectionProgress: sectionProgress,
                descriptionLabel: descriptionLabel
            }
        }

        this._scrollView = cc.ScrollView.create(cc.size(640, 569), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(6400, 569));
        this._scrollView.setPosition(GAME_BG_POINT);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        return true;
    },

    update: function () {
        cc.log("ExploreLayer update");

        this._scrollView.setContentOffset(this._getScrollViewOffset(), true);

        var player = gameData.player;

        var power = player.get("power");
        var maxPower = player.get("maxPower");

        var exp = player.get("exp");
        var maxExp = player.get("maxExp");

        var progress = gameData.task.getProgress(this._getTaskId());
        var value = progress.progress;
        var maxValue = progress.maxProgress;

        var element = this._element[this._index];

        element.powerLabel.setString(power + "/" + maxPower);
        element.expLabel.setString(maxExp - exp);
        element.progressLabel.setString(value + "/" + maxValue);

        element.powerProgress.setAllValue(power, maxPower, 0.1);
        element.expProgress.setAllValue(exp, maxExp, 0.1);
        element.sectionProgress.setAllValue(value, maxValue, 0.1);

        for (var i = 1; i <= TASK_POINTS_COUNT; ++i) {
            this._element[i].descriptionLabel.setVisible(i == this._index);
        }
    },

    _getScrollViewOffset: function () {
        cc.log("ExploreLayer _getScrollViewOffset");

        this._index = Math.max(this._index, 1);
        this._index = Math.min(this._index, TASK_POINTS_COUNT);

        return cc.p(-640 * (this._index - 1), 0);
    },

    _getTaskId: function (index) {
        cc.log("ExploreLayer _getTaskId");

        index = index || this._index;

        return (this._sectionId - 1) * TASK_POINTS_COUNT + index;
    },

    _onClickBack: function () {
        cc.log("ExploreLayer _onClickBack");

        MainScene.getInstance().switchLayer(PveLayer);
    },

    _onClickExplore: function () {
        cc.log("ExploreLayer _onClickExplore");

        this._playAnimation();

        var that = this;
        gameData.task.explore(function (data) {
            cc.log(data);


            if (data.result == "fight") {
                BattlePlayer.getInstance().play(data.battleLogId);
            } else {
                that.update();
            }
        }, this._index);
    },

    _playAnimation: function () {
        cc.log("ExploreLayer _playAnimation");

        var scaleAction1 = cc.ScaleTo.create(0.1, 1, 0.96);
        var scaleAction2 = cc.ScaleTo.create(0.1, 1, 1.04);
        var scaleAction3 = cc.ScaleTo.create(0.3, 1, 1);
        var scaleAction4 = cc.ScaleTo.create(0.3, 1, 1.04);
        var scaleAction5 = cc.ScaleTo.create(0.1, 1, 1);

        var waitAction1 = cc.DelayTime.create(0.1);
        var waitAction2 = cc.DelayTime.create(0.2);

        var moveAction1 = cc.EaseSineOut.create(cc.MoveBy.create(0.3, cc.p(0, 35)));
        var moveAction2 = cc.EaseSineIn.create(cc.MoveBy.create(0.3, cc.p(0, -35)));

        var scaleAction = cc.Sequence.create(
            scaleAction1,
            scaleAction2,
            scaleAction3,
            scaleAction4,
            scaleAction5
        );

        var moveAction = cc.Sequence.create(
            waitAction2.copy(),
            moveAction1,
            moveAction2.copy(),
            waitAction1.copy()
        );

        var spiritAction = cc.Spawn.create(scaleAction, moveAction);

        var repeatAction = cc.Repeat.create(spiritAction, 2);

        this._spirit.runAction(repeatAction);


        var mapAction = cc.Sequence.create(
            cc.EaseSineOut.create(cc.MoveBy.create(0.1, cc.p(-5, 0))),
            cc.MoveBy.create(0.35, cc.p(-35, 0)),
            cc.MoveBy.create(0.35, cc.p(-35, 0))
        );

        this._mapLabel.setPosition(cc.p(40, 766));
        this._mapLabel.runAction(cc.Repeat.create(mapAction, 2));


        var spiritShadowAction = cc.Sequence.create(
            cc.ScaleTo.create(0.1, 1.2, 1.2),
            cc.ScaleTo.create(0.1, 1, 1),
            cc.ScaleTo.create(0.25, 0.5, 0.5),
            cc.ScaleTo.create(0.25, 1, 1),
            cc.ScaleTo.create(0.1, 1.1, 1.1)
        );
        this._spiritShadow.runAction(cc.Repeat.create(spiritShadowAction, 2));
    },

    /**
     * when a touch finished
     * @param {cc.Touch} touches
     * @param {event} event
     */
    onTouchesEnded: function (touches, event) {
        cc.log("TaskLayer onTouchesEnded");

        this._scrollView.unscheduleAllCallbacks();
        this._scrollView.stopAllActions();

        var beganOffset = this._getScrollViewOffset();
        var endOffset = this._scrollView.getContentOffset();
        var len = beganOffset.x - endOffset.x;

        if (len > 30) {
            this._index = 1 - Math.floor(endOffset.x / 640);
        } else if (len < -30) {
            this._index = 1 - Math.ceil(endOffset.x / 640);
        }

        this.update();
    },

    /**
     * @param touch
     * @param event
     */
    onTouchesCancelled: function (touch, event) {
        this.onTouchesEnded(touch, event);
    }
});


ExploreLayer.create = function (sectionId) {
    var ret = new ExploreLayer();

    if (ret && ret.init(sectionId)) {
        return ret;
    }

    return null;
};