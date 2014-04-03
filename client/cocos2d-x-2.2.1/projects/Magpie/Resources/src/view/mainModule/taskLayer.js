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
    _taskLayerFit: null,

    _index: 0,
    _turnLeftSprite: null,
    _turnRightSprite: null,
    _markSprite: null,
    _wipeOutItem: null,
    _tipItem: null,
    _sectionItem: {},
    _scrollView: null,
    _locate: [],

    _goldItem: null,

    onEnter: function () {
        cc.log("TaskLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("修炼界面");
    },

    onExit: function () {
        cc.log("TaskLayer onExit");

        this._super();

        lz.um.endLogPageView("修炼界面");
    },

    init: function () {
        cc.log("TaskLayer init");

        if (!this._super()) return false;

        this._taskLayerFit = gameFit.mainScene.taskLayer;

        this._goldItem = [];
        this._locate = this._taskLayerFit.locatePoints;
        this.setTouchEnabled(true);

        this._index = gameData.task.getChapter();

        this._wipeOutItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon44,
            this._onClickWipeOut,
            this
        );
        this._wipeOutItem.setPosition(this._taskLayerFit.wipeOutItemPoint);

        this._tipItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9d,
            main_scene_image.button9d,
            main_scene_image.icon44,
            this._onClickTip,
            this
        );

        this._tipItem.setPosition(this._taskLayerFit.wipeOutItemPoint);

        var menu = cc.Menu.create(this._wipeOutItem, this._tipItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        this._turnLeftSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnLeftSprite.setRotation(180);
        this._turnLeftSprite.setPosition(this._taskLayerFit.turnLeftSpritePoint);
        this.addChild(this._turnLeftSprite, 2);

        this._turnRightSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnRightSprite.setPosition(this._taskLayerFit.turnRightSpritePoint);
        this.addChild(this._turnRightSprite, 2);

        // 读配置表
        var chapterTitleTable = outputTables.chapter_title.rows;
        var chapterTable = outputTables.chapter.rows;

        var scrollViewLayer = MarkLayer.create(this._taskLayerFit.scrollViewLayerRect);

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
            bgSprite.setAnchorPoint(cc.p(0.5, 0.5));
            bgSprite.setPosition(x + this._taskLayerFit.scrollViewSize.width / 2, this._taskLayerFit.scrollViewSize.height / 2);
            if (i % 2 == 0) {
                bgSprite.setScaleX(-1);
            }
            scrollViewLayer.addChild(bgSprite);

            var titleBgIcon = cc.Sprite.create(main_scene_image.icon147);
            titleBgIcon.setPosition(cc.p(x, this._taskLayerFit.titlePointY));
            scrollViewLayer.addChild(titleBgIcon);

            var titleLabel = StrokeLabel.create(chapterTitleTable[i].name, "STHeitiTC-Medium", 30);
            titleLabel.setColor(cc.c3b(255, 239, 131));
            titleLabel.setPosition(cc.p(320 + x, this._taskLayerFit.titlePointY));
            scrollViewLayer.addChild(titleLabel);

            var titleIcon1 = cc.Sprite.create(main_scene_image.icon143);
            titleIcon1.setPosition(220 + x, this._taskLayerFit.titlePointY);
            scrollViewLayer.addChild(titleIcon1, 1);

            var titleIcon2 = cc.Sprite.create(main_scene_image.icon143);
            titleIcon2.setScaleX(-1);
            titleIcon2.setPosition(420 + x, this._taskLayerFit.titlePointY);
            scrollViewLayer.addChild(titleIcon2, 1);

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
                sectionNameLabel.setPosition(point);
                scrollViewLayer.addChild(sectionNameLabel, 1);

                this._sectionItem[index] = sectionItem;
            }
        }

        this._scrollView = cc.ScrollView.create(this._taskLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setContentSize(this._taskLayerFit.scrollViewContentSize);
        this._scrollView.setPosition(this._taskLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.setBounceable(false);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentOffset(this._getScrollViewOffset());

        var cloudEffect = cc.BuilderReader.load(main_scene_image.uiEffect75);
        cloudEffect.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(cloudEffect);

        return true;
    },

    update: function () {
        cc.log("TaskLayer update");

        cc.log(this._index);

        var task = gameData.task;

        this._scrollView.setContentOffset(this._getScrollViewOffset(), true);

        this._turnLeftSprite.setVisible(this._index > 1);
        this._turnRightSprite.setVisible(this._index < TASK_CHAPTER_COUNT);

        var isVisible = task.canWipeOut();
        this._wipeOutItem.setVisible(isVisible);
        this._tipItem.setVisible(!isVisible);

        var section = task.getSection();

        var size = this._sectionItem[section].getContentSize();
        var point = this._sectionItem[section].getPosition();

        this._markSprite.setPosition(cc.p(point.x, point.y + size.height - 30));

        var minIndex = Math.max(this._index - 2, 0) * TASK_SECTION_COUNT + 1;
        var maxIndex = Math.min(this._index + 1, TASK_CHAPTER_COUNT) * TASK_SECTION_COUNT;

        var that = this;

        for (var key in this._sectionItem) {

            (function (key) {
                var sectionItem = that._sectionItem[key];

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

                            var itemPoint = that._sectionItem[index].getPosition();
                            var itemSize = that._sectionItem[index].getContentSize();

                            if (task.getMarkByIndex(index) == true) {
                                if (that._goldItem[index] == null) {
                                    that._goldItem[index] = cc.BuilderReader.load(main_scene_image.uiEffect13, that);
                                    that._goldItem[index].setPosition(cc.p(itemPoint.x, itemPoint.y + itemSize.height));
                                    that._scrollView.addChild(that._goldItem[index], 1);
                                }
                            } else {
                                if (that._goldItem[index]) {
                                    that._goldItem[index].removeFromParent();
                                    that._goldItem[index] = null;

                                    var goldGetEffect = cc.BuilderReader.load(main_scene_image.uiEffect14, that);
                                    goldGetEffect.setPosition(cc.p(itemPoint.x, itemPoint.y + itemSize.height));
                                    that._scrollView.addChild(goldGetEffect, 1);
                                    goldGetEffect.animationManager.setCompletedAnimationCallback(that, function () {
                                        goldGetEffect.removeFromParent();
                                    });


                                }
                            }
                        }
                    } else {
                        sectionItem.setVisible(false);
                    }
                }
            })(key);
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

            gameData.sound.playEffect(main_scene_image.click_building_sound, false);

            var task = gameData.task;

            if (id > task.getSection()) {
                TipLayer.tip("当前关卡未开启");

                return;
            }

            if (task.getMarkByIndex(id)) {
                this._wipOut(id);

                return;
            }

            MainScene.getInstance().switchTo(ExploreLayer.create(id));

            if (noviceTeachingLayer.isNoviceTeaching()) {
                noviceTeachingLayer.clearAndSave();
                noviceTeachingLayer.next();
            }
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

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._wipOut();
    },

    _onClickTip: function () {
        cc.log("TaskLayer _onClickTip");
        TipLayer.tip("已通关卡，每天可获得1次仙币奖励。");
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