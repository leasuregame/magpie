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
    _maxIndex: 0,
    _sectionId: 0,
    _spiritNode: null,
    _spiritShadow: null,
    _turnLeftSprite: null,
    _turnRightSprite: null,
    _mapLabel: [],
    _closeBoxSprite: null,
    _openBoxSprite: null,
    _exploreItem: null,
    _scrollView: null,
    _element: {},
    _reward: null,

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

        this._maxIndex = TASK_POINTS_COUNT;
        this._index = this._maxIndex;

        if (this._sectionId == gameData.task.getSection()) {
            this._index = gameData.task.getPoints();
        }

        var bgSprite = cc.Sprite.create(main_scene_image.bg9);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon, 1);

        for (var i = 0; i < 3; ++i) {
            this._mapLabel[i] = cc.Sprite.create(main_scene_image.bg4);
            this._mapLabel[i].setAnchorPoint(cc.p(0, 0));
            this._mapLabel[i].setPosition(cc.p(40 + i * 640, 766));
            this.addChild(this._mapLabel[i]);
        }

        var line1Icon = cc.Sprite.create(main_scene_image.icon96);
        line1Icon.setAnchorPoint(cc.p(0.5, 0));
        line1Icon.setPosition(cc.p(360, 928));
        this.addChild(line1Icon, 1);

        var line2Icon = cc.Sprite.create(main_scene_image.icon96);
        line2Icon.setRotation(180);
        line2Icon.setAnchorPoint(cc.p(0.5, 0));
        line2Icon.setPosition(cc.p(360, 797));
        this.addChild(line2Icon, 1);

        var descriptionIcon = cc.Sprite.create(main_scene_image.icon216);
        descriptionIcon.setPosition(cc.p(120, 250));
        this.addChild(descriptionIcon);

        var chapter = Math.ceil((this._sectionId) / TASK_SECTION_COUNT);

        var titleLabel = StrokeLabel.create(outputTables.chapter_title.rows[chapter].name, "STHeitiTC-Medium", 40);
        titleLabel.setColor(cc.c3b(255, 239, 131));
        titleLabel.setPosition(cc.p(360, 1005));
        this.addChild(titleLabel, 1);

        this._spiritShadow = cc.Sprite.create(main_scene_image.icon217);
        this._spiritShadow.setPosition(cc.p(350, 786));
        this.addChild(this._spiritShadow);

        this._spiritNode = SpiritSideNode.create();
        this._spiritNode.setPosition(cc.p(360, 783));
        this.addChild(this._spiritNode);

        this._spiritNode.speak();

        this._turnLeftSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnLeftSprite.setRotation(180);
        this._turnLeftSprite.setPosition(cc.p(80, 550));
        this.addChild(this._turnLeftSprite, 2);

        this._turnRightSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnRightSprite.setPosition(cc.p(640, 550));
        this.addChild(this._turnRightSprite, 2);

        this._closeBoxSprite = cc.Sprite.create(main_scene_image.icon219);
        this._closeBoxSprite.setPosition(cc.p(360, 1025));
        this.addChild(this._closeBoxSprite);
        this._closeBoxSprite.setVisible(false);

        this._openBoxSprite = cc.Sprite.create(main_scene_image.icon220);
        this._openBoxSprite.setPosition(cc.p(360, 860));
        this.addChild(this._openBoxSprite);
        this._openBoxSprite.setVisible(false);

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
            main_scene_image.button9d,
            main_scene_image.icon38,
            this._onClickExplore,
            this
        );
        this._exploreItem.setPosition(cc.p(360, 370));


        var menu = cc.Menu.create(backItem, this._exploreItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

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
            nameLabel.setColor(cc.c3b(255, 239, 131));
            nameLabel.setPosition(cc.p(x + 320, 470));
            scrollViewLayer.addChild(nameLabel);

            var exploreExpLabel = cc.LabelTTF.create(chapterTable[id].exp_obtain, "STHeitiTC-Medium", 20);
            exploreExpLabel.setColor(cc.c3b(255, 239, 131));
            exploreExpLabel.setAnchorPoint(cc.p(0, 0.5));
            exploreExpLabel.setPosition(cc.p(275 + x, 408));
            scrollViewLayer.addChild(exploreExpLabel);

            var exploreMoneyLabel = cc.LabelTTF.create(chapterTable[id].coins_obtain, "STHeitiTC-Medium", 20);
            exploreMoneyLabel.setColor(cc.c3b(255, 239, 131));
            exploreMoneyLabel.setAnchorPoint(cc.p(0, 0.5));
            exploreMoneyLabel.setPosition(cc.p(425 + x, 408));
            scrollViewLayer.addChild(exploreMoneyLabel);

            var descriptionLabel = cc.Node.create();
            descriptionLabel.setPosition(cc.p(230, 270));
            this.addChild(descriptionLabel);

            var powerProgress = Progress.create(null, main_scene_image.progress1, 0, 0);
            powerProgress.setPosition(cc.p(320 + x, 360));
            scrollViewLayer.addChild(powerProgress);

            var expProgress = Progress.create(null, main_scene_image.progress2, 0, 0, false, true);
            expProgress.setPosition(cc.p(320 + x, 319));
            scrollViewLayer.addChild(expProgress);

            var sectionProgress = Progress.create(null, main_scene_image.progress3, 0, 0);
            sectionProgress.setPosition(cc.p(320 + x, 278));
            scrollViewLayer.addChild(sectionProgress);

            var powerLabel = cc.LabelTTF.create("0/0", "STHeitiTC-Medium", 20);
            powerLabel.setColor(cc.c3b(255, 239, 131));
            powerLabel.setAnchorPoint(cc.p(0, 0.5));
            powerLabel.setPosition(cc.p(465 + x, 360));
            scrollViewLayer.addChild(powerLabel);

            var expLabel = cc.LabelTTF.create("999999", "STHeitiTC-Medium", 20);
            expLabel.setColor(cc.c3b(255, 239, 131));
            expLabel.setAnchorPoint(cc.p(0, 0.5));
            expLabel.setPosition(cc.p(465 + x, 319));
            scrollViewLayer.addChild(expLabel);

            var progressLabel = cc.LabelTTF.create("0/0", "STHeitiTC-Medium", 20);
            progressLabel.setColor(cc.c3b(255, 239, 131));
            progressLabel.setAnchorPoint(cc.p(0, 0.5));
            progressLabel.setPosition(cc.p(465 + x, 278));
            scrollViewLayer.addChild(progressLabel);

            var description = lz.format(chapterTable[id].description, 20);
            var len = description.length;
            for (var j = 0; j < len; ++j) {
                var storyLabel = cc.LabelTTF.create(description[j], "STHeitiTC-Medium", 20);
                storyLabel.setColor(cc.c3b(255, 239, 131));
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

        var task = gameData.task;

        if (task.getSection() == this._sectionId) {
            this._maxIndex = task.getPoints();
            this._scrollView.setContentSize(cc.size(640 * this._maxIndex, 569));
        }

        this._scrollView.setContentOffset(this._getScrollViewOffset(), true);

        this._turnLeftSprite.setVisible(this._index > 1);
        this._turnRightSprite.setVisible(this._index < this._maxIndex);

        var player = gameData.player;

        var power = player.get("power");
        var maxPower = player.get("maxPower");

        var exp = player.get("exp");
        var maxExp = player.get("maxExp");

        var progress = task.getProgress(this._getTaskId());
        var value = progress.progress;
        var maxValue = progress.maxProgress;

        var time = this._showReward();

        var element = this._element[this._index];

        element.powerLabel.setString(power + "/" + maxPower);
        element.expLabel.setString(maxExp - exp);
        element.progressLabel.setString(value + "/" + maxValue);

        element.powerProgress.setAllValue(power, maxPower, time);
        element.expProgress.setAllValue(exp, maxExp, time);
        element.sectionProgress.setAllValue(value, maxValue, time);

        for (var i = 1; i <= TASK_POINTS_COUNT; ++i) {
            this._element[i].descriptionLabel.setVisible(i == this._index);
        }

        for (var i = 0; i < 3; ++i) {
            var point = this._mapLabel[i].getPosition();

            if (point.x < -600) {
                point.x += 1920;
                this._mapLabel[i].setPosition(point);
            }
        }
    },

    _getScrollViewOffset: function () {
        cc.log("ExploreLayer _getScrollViewOffset");

        this._index = Math.max(this._index, 1);
        this._index = Math.min(this._index, this._maxIndex);

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

        this._lock();

        var that = this;
        gameData.task.explore(function (data) {
            cc.log(data);

            that._reward = data;

            that._playAnimation();
        }, this._getTaskId());
    },

    _lock: function () {
        cc.log("ExploreLayer _lock");

        LazyLayer.showCloudLayer();
        this.setTouchEnabled(false);
    },

    _unlock: function () {
        cc.log("ExploreLayer _unlock");

        LazyLayer.closeCloudLayer();
        this.setTouchEnabled(true);
    },

    _toNext: function () {
        cc.log("ExploreLayer _next");

        TipLayer.tip("恭喜您，本关已完成");

        this.scheduleOnce(function () {
            this._index += 1;

            if (this._index > this._maxIndex) {
                this._onClickBack();
            }

            this.update();

            this._unlock();
        }, 1);
    },

    _showReward: function () {
        cc.log("ExploreLayer _showReward");

        if (this._reward) {
            var fadeAction = cc.Sequence.create(
                cc.FadeIn.create(0.3),
                cc.DelayTime.create(0.6),
                cc.FadeOut.create(0.1)
            );

            var moveAction = cc.MoveBy.create(0.5, cc.p(0, 20));

            var scaleAction = cc.ScaleTo.create(0.5, 1.5, 1.5);

            var action = cc.Spawn.create(
                fadeAction,
                moveAction,
                scaleAction
            );

            var x = 640 * (this._index - 1) + 320;
            if (this._reward.power) {
                var powerLabel = cc.LabelTTF.create("-" + this._reward.power, "STHeitiTC-Medium", 15);
                powerLabel.setColor(cc.c3b(255, 239, 131));
                powerLabel.setPosition(cc.p(x, 365));
                this._scrollView.addChild(powerLabel, 2);
                powerLabel.setAnchorPoint(cc.p(0.5, 0.5));

                powerLabel.runAction(action.copy());
            }

            if (this._reward.exp) {
                var expLabel = cc.LabelTTF.create("+" + this._reward.exp, "STHeitiTC-Medium", 15);
                expLabel.setColor(cc.c3b(255, 239, 131));
                expLabel.setPosition(cc.p(x, 324));
                this._scrollView.addChild(expLabel, 2);
                expLabel.setAnchorPoint(cc.p(0.5, 0.5));

                expLabel.runAction(action.copy());
            }


            if (this._reward.progress) {
                var progressLabel = cc.LabelTTF.create("+" + this._reward.progress, "STHeitiTC-Medium", 15);
                progressLabel.setColor(cc.c3b(255, 239, 131));
                progressLabel.setPosition(cc.p(x, 283));
                this._scrollView.addChild(progressLabel, 2);
                progressLabel.setAnchorPoint(cc.p(0.5, 0.5));

                progressLabel.runAction(action);
            }

            this.scheduleOnce(function () {
                if (powerLabel) powerLabel.removeFromParent();
                if (expLabel) expLabel.removeFromParent();
                if (progressLabel) progressLabel.removeFromParent();


                var toNext = this._reward.toNext;
                var goldList = this._reward.goldList;

                this._reward = null;

                if (toNext) {
                    this._toNext();
                } else {
                    this._unlock();
                }

                if (goldList) {
                    GoldLayer.play(goldList);
                }
            }, 1);

            return 1;
        }

        return 0;
    },

    _playAnimation: function () {
        cc.log("ExploreLayer _playAnimation");

        var callFuncAction = cc.CallFunc.create(function () {
            if (this._reward) {
                if (this._reward.result == "fight") {
                    this._spiritNode.encounterBattle();

                    this.scheduleOnce(function () {
                        BattlePlayer.getInstance().play(this._reward.battleLogId);
                        this._spiritNode.normal();
                    }, 1);
                } else if (this._reward.result == "box") {
                    this._spiritNode.encounterBox();

                    this.scheduleOnce(function () {
                        this._showBox();
                        this._spiritNode.normal();
                    }, 1);
                } else {
                    this.update();
                }
            } else {
                this._unlock();
            }
        }, this);

        var spiritScaleAction = cc.Sequence.create(
            cc.ScaleTo.create(0.1, 1, 0.92),
            cc.ScaleTo.create(0.1, 1, 1.08),
            cc.ScaleTo.create(0.3, 1, 1),
            cc.ScaleTo.create(0.3, 1, 1.08),
            cc.ScaleTo.create(0.1, 1, 1)
        );

        var spiritMoveAction = cc.Sequence.create(
            cc.DelayTime.create(0.2),
            cc.EaseSineOut.create(cc.MoveBy.create(0.3, cc.p(0, 60))),
            cc.EaseSineIn.create(cc.MoveBy.create(0.3, cc.p(0, -60))),
            cc.DelayTime.create(0.1)
        );

        var spiritRepeatAction = cc.Repeat.create(
            cc.Spawn.create(spiritScaleAction, spiritMoveAction),
            2
        );

        var spiritAction = cc.Sequence.create(spiritRepeatAction, callFuncAction);

        this._spiritNode.runAction(spiritAction);

        var spiritShadowScaleAction = cc.Sequence.create(
            cc.ScaleTo.create(0.1, 1.1, 1.1),
            cc.ScaleTo.create(0.1, 1, 1),
            cc.ScaleTo.create(0.3, 0.4, 0.4),
            cc.ScaleTo.create(0.3, 1, 1),
            cc.ScaleTo.create(0.1, 1.1, 1.1)
        );

        var spiritShadowAction = cc.Repeat.create(spiritShadowScaleAction, 2);

        this._spiritShadow.runAction(spiritShadowAction);

        var mapMoveAction = cc.Sequence.create(
            cc.EaseSineIn.create(cc.MoveBy.create(0.2, cc.p(-6, 0))),
            cc.MoveBy.create(0.3, cc.p(-40, 0)),
            cc.MoveBy.create(0.3, cc.p(-40, 0)),
            cc.EaseSineOut.create(cc.MoveBy.create(0.1, cc.p(-6, 0)))
        );

        var mapAction = cc.Repeat.create(mapMoveAction, 2);

        for (var i = 0; i < 3; ++i) {
            this._mapLabel[i].runAction(mapAction.copy());
        }
    },

    _showBox: function () {
        cc.log("TaskLayer _openBox");

        var boxAction = cc.Sequence.create(
            cc.Spawn.create(
                cc.MoveBy.create(0.3, cc.p(0, -165)),
                cc.ScaleTo.create(0.3, 1, 1)
            ),
            cc.CallFunc.create(
                this._openBox,
                this
            )
        );

        this._closeBoxSprite.setPosition(cc.p(360, 1025));
        this._closeBoxSprite.setScale(0.9);
        this._closeBoxSprite.setVisible(true);

        this._openBoxSprite.setVisible(false);

        this._closeBoxSprite.runAction(boxAction);
    },

    _openBox: function () {
        cc.log("TaskLayer _openBox");

        this._closeBoxSprite.setVisible(false);
        this._openBoxSprite.setVisible(true);

        var that = this;
        var cb = function () {
            that._openBoxSprite.setVisible(false);
            that.update();
        };

        this.scheduleOnce(function () {
            var cardDetails = CardDetails.create(this._reward.card, cb);
            cc.Director.getInstance().getRunningScene().addChild(cardDetails, 1);
        }, 0.5);
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


ExploreLayer.create = function (sectionId) {
    var ret = new ExploreLayer();

    if (ret && ret.init(sectionId)) {
        return ret;
    }

    return null;
};