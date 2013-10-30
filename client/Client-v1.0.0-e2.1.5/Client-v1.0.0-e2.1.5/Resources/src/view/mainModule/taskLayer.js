/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:17
 * To change this template use File | Settings | File Templates.
 */


/*
 * task layer
 * */


var TaskLayer = cc.Layer.extend({
    _index: 0,
    _turnLeftSprite: null,
    _turnRightSprite: null,
    _markSprite: null,
    _wipeOutItem: null,
    _sectionItem: {},
    _scrollView: null,
    _locate: [
        cc.p(160, 550),
        cc.p(200, 270),
        cc.p(440, 440),
        cc.p(480, 260),
        cc.p(360, 70),

        cc.p(160, 550),
        cc.p(200, 270),
        cc.p(440, 470),
        cc.p(480, 260),
        cc.p(340, 70),

        cc.p(160, 550),
        cc.p(210, 315),
        cc.p(415, 480),
        cc.p(480, 260),
        cc.p(360, 70),

        cc.p(160, 550),
        cc.p(200, 290),
        cc.p(420, 470),
        cc.p(480, 260),
        cc.p(360, 70),

        cc.p(155, 550),
        cc.p(200, 270),
        cc.p(420, 470),
        cc.p(480, 260),
        cc.p(360, 70),

        cc.p(160, 550),
        cc.p(200, 290),
        cc.p(440, 470),
        cc.p(480, 260),
        cc.p(360, 70),

        cc.p(160, 550),
        cc.p(200, 270),
        cc.p(440, 450),
        cc.p(480, 260),
        cc.p(360, 70),

        cc.p(160, 550),
        cc.p(200, 270),
        cc.p(440, 440),
        cc.p(480, 260),
        cc.p(360, 70),

        cc.p(140, 550),
        cc.p(200, 270),
        cc.p(420, 470),
        cc.p(480, 260),
        cc.p(360, 70),

        cc.p(140, 550),
        cc.p(200, 270),
        cc.p(430, 460),
        cc.p(480, 260),
        cc.p(360, 70)
    ],

    onEnter: function () {
        cc.log("TaskLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("TaskLayer init");

        if (!this._super()) return false;

        this.setTouchEnabled(true);

        this._index = gameData.task.getChapter();

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 968));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon16);
        titleIcon.setPosition(cc.p(360, 1008));
        this.addChild(titleIcon);

        this._wipeOutItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon15,
            this._onClickWipeOut,
            this
        );
        this._wipeOutItem.setPosition(cc.p(595, 230));

        var menu = cc.Menu.create(this._wipeOutItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        this._turnLeftSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnLeftSprite.setRotation(180);
        this._turnLeftSprite.setPosition(cc.p(80, 550));
        this.addChild(this._turnLeftSprite, 2);

        this._turnRightSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnRightSprite.setPosition(cc.p(640, 550));
        this.addChild(this._turnRightSprite, 2);

        // 读配置表
        var chapterTitleTable = outputTables.chapter_title.rows;
        var chapterTable = outputTables.chapter.rows;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 198, 640, 744));

        var lazyMenu = LazyMenu.create();
        lazyMenu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(lazyMenu, 1);

        this._markSprite = cc.Sprite.create(main_scene_image.icon218);
        this._markSprite.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(this._markSprite, 2);

        var moveAction1 = cc.MoveBy.create(1, cc.p(0, 20));
        var moveAction2 = cc.MoveBy.create(1, cc.p(0, -20));
        var moveAction = cc.Sequence.create(moveAction1, moveAction2);
        var repeatForeverAction = cc.RepeatForever.create(moveAction);

        this._markSprite.runAction(repeatForeverAction);

        for (var i = 1; i <= TASK_CHAPTER_COUNT; ++i) {
            var x = 640 * (i - 1);

            var bgSprite = cc.Sprite.create(main_scene_image.bg8);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(x, 0);
            scrollViewLayer.addChild(bgSprite);

            var titlesLabel = StrokeLabel.create(chapterTitleTable[i].name, "STHeitiTC-Medium", 30);
            titlesLabel.setColor(cc.c3b(255, 239, 131));
            titlesLabel.setPosition(cc.p(320 + x, 745));
            scrollViewLayer.addChild(titlesLabel);

            for (var j = 1; j <= TASK_SECTION_COUNT; ++j) {
                var index = 5 * (i - 1) + j;

                var sectionItem = cc.MenuItemImage.createWithIcon(
                    main_scene_image["task" + index],
                    main_scene_image["task" + index],
                    main_scene_image.icon200,
                    this._onClickSection(index),
                    this
                );
                sectionItem.setAnchorPoint(cc.p(0.5, 0));
                sectionItem.setPosition(cc.p(this._locate[index - 1].x + x, this._locate[index - 1].y));
                lazyMenu.addChild(sectionItem);

                var point = cc.p(this._locate[index - 1].x + x, this._locate[index - 1].y - 20);

                var sectionNameBgSprite = cc.Sprite.create(main_scene_image.icon3);
                sectionNameBgSprite.setPosition(point);
                scrollViewLayer.addChild(sectionNameBgSprite, 1);

                var sectionNameLabel = cc.LabelTTF.create(chapterTable[index].chapter, "STHeitiTC-Medium", 25);
                sectionNameLabel.setColor(cc.c3b(255, 239, 131));
                sectionNameLabel.setPosition(point);
                scrollViewLayer.addChild(sectionNameLabel, 1);

                this._sectionItem[index] = sectionItem;
            }
        }

        this._scrollView = cc.ScrollView.create(cc.size(640, 768), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(6400, 768));
        this._scrollView.setPosition(GAME_BG_POINT);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.setBounceable(false);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentOffset(this._getScrollViewOffset());

        return true;
    },

    update: function () {
        cc.log("TaskLayer update");

        cc.log(this._index);

        var task = gameData.task;

        this._scrollView.setContentOffset(this._getScrollViewOffset(), true);

        this._turnLeftSprite.setVisible(this._index > 1);
        this._turnRightSprite.setVisible(this._index < TASK_CHAPTER_COUNT);

        this._wipeOutItem.setEnabled(task.canWipeOut());

        var section = task.getSection();

        var size = this._sectionItem[section].getContentSize();
        var point = this._sectionItem[section].getPosition();
        this._markSprite.setPosition(cc.p(point.x, point.y + size.height - 30));

        var minIndex = Math.max(this._index - 2, 0) * TASK_SECTION_COUNT + 1;
        var maxIndex = Math.min(this._index + 1, TASK_CHAPTER_COUNT) * TASK_SECTION_COUNT;

        for (var key in this._sectionItem) {
            var sectionItem = this._sectionItem[key];

            if (sectionItem != undefined) {
                var index = parseInt(key);

                if (index >= minIndex && index <= maxIndex) {
                    sectionItem.setVisible(true);

                    if (index > section) {
                        sectionItem.showIconImage();
                        sectionItem.setColor(cc.c3b(130, 130, 130));
                    } else {
                        sectionItem.hidIconImage();
                        sectionItem.setColor(cc.c3b(255, 255, 255));
                    }
                } else {
                    sectionItem.setVisible(false);
                }
            }
        }
    },

    _getScrollViewOffset: function () {
        cc.log("TaskLayer _getScrollViewOffset");

        this._index = Math.max(this._index, 1);
        this._index = Math.min(this._index, TASK_CHAPTER_COUNT);

        return cc.p(-640 * (this._index - 1), 0);
    },

    _onClickSection: function (id) {
        return function () {
            cc.log("TaskLayer _onClickSection " + id);

            var task = gameData.task;

            if (id > task.getSection()) {
                TipLayer.tip("当前关卡未打开");

                return;
            }

            if (task.getMarkByIndex(id)) {
                this._wipOut(id);

                return;
            }

            MainScene.getInstance().switch(ExploreLayer.create(id));
        }
    },

    _wipOut: function (id) {
        cc.log("TaskLayer _wipOut: " + id);

        var that = this;
        gameData.task.wipeOut(function (data) {
            cc.log(data);

            lz.tipReward(data);

            that.update();
        }, id);
    },

    _onClickWipeOut: function () {
        cc.log("TaskLayer _onClickWipeOut");

        this._wipOut();
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

        if (len !== 0) {
            if (len > 30) {
                this._index = 1 - Math.floor(endOffset.x / 640);
            } else if (len < -30) {
                this._index = 1 - Math.ceil(endOffset.x / 640);
            }

            this.update();
        }
    },

    /**
     * @param touch
     * @param event
     */
    onTouchesCancelled: function (touch, event) {
        this.onTouchesEnded(touch, event);
    }
});


TaskLayer.create = function () {
    var ret = new TaskLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};