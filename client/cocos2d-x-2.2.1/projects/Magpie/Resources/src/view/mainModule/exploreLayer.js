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
    _exploreLayerFit: null,

    _index: 0,
    _maxIndex: 0,
    _pageIndex: 0,
    _sectionId: 0,
    _spiritNode: null,
    _spiritShadow: null,
    _turnLeftSprite: null,
    _turnRightSprite: null,
    _mapLabel: [],
    _exploreItem: null,
    _prePageItem: null,
    _nextPageItem: null,
    _scrollView: null,
    _element: {},
    _playerLvLabel: null,
    _descriptionLabel: null,
    _rewardTipsItem: null,
    _rewardEffect: null,
    _collectElement: null,

    onEnter: function () {
        cc.log("ExploreLayer onEnter");

        this._super();

        lz.um.beginLogPageView("探索界面");
    },

    onExit: function () {
        cc.log("ExploreLayer onExit");

        this._super();

        lz.um.endLogPageView("探索界面");
    },

    init: function (sectionId) {
        cc.log("ExploreLayer init");

        if (!this._super()) return false;

        this._exploreLayerFit = gameFit.mainScene.exploreLayer;

        this.setTouchEnabled(true);

        this._sectionId = sectionId;

        this._maxIndex = TASK_POINTS_COUNT;
        this._index = 1;

        if (this._sectionId == gameData.task.getSection()) {
            this._index = gameData.task.getPoints();
        }

        this._pageIndex = this._getTaskId();

        var bgSprite = cc.Sprite.create(main_scene_image.bg9);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._exploreLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var chapter = Math.ceil((this._sectionId) / TASK_SECTION_COUNT);

        var sid = (sectionId - 1) % 5 < 3 ? 1 : 0;
        var id = (chapter * 2 - sid) % 8;
        if (id == 0) {
            id = 8;
        }
        var url = "exploreEffect" + id;
        for (var i = 0; i < 3; ++i) {
            this._mapLabel[i] = cc.Node.create();
            this._mapLabel[i].addChild(cc.BuilderReader.load(main_scene_image[url], this));
            this._mapLabel[i].setPosition(cc.p(this._exploreLayerFit.mapLabelBasePoint.x + i * this._exploreLayerFit.mapLabelOffsetX, this._exploreLayerFit.mapLabelBasePoint.y));
            this._mapLabel[i].setScaleY(this._exploreLayerFit.mapLabelScaleY);
            this.addChild(this._mapLabel[i]);
        }

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._exploreLayerFit.headIconPoint);
        this.addChild(headIcon);

        var lvIcon = cc.Sprite.create(main_scene_image.icon335);
        lvIcon.setPosition(this._exploreLayerFit.lvIconPoint);
        this.addChild(lvIcon);

        this._playerLvLabel = StrokeLabel.create("Lv. 0", "STHeitiTC-Medium", 28);
        this._playerLvLabel.setAnchorPoint(cc.p(0, 0.5));
        this._playerLvLabel.setPosition(this._exploreLayerFit.playerLvLabelPoint);
        this.addChild(this._playerLvLabel);

        var lineIcon = cc.Sprite.create(main_scene_image.icon96);
        lineIcon.setRotation(180);
        lineIcon.setAnchorPoint(cc.p(0.5, 0));
        lineIcon.setPosition(this._exploreLayerFit.line2IconPoint);
        this.addChild(lineIcon, 1);

        var descriptionBgIcon = cc.Sprite.create(main_scene_image.icon287);
        descriptionBgIcon.setAnchorPoint(cc.p(0, 0));
        descriptionBgIcon.setPosition(this._exploreLayerFit.descriptionBgIconPoint);
        descriptionBgIcon.setScaleY(1.1);
        this.addChild(descriptionBgIcon);

        var descriptionIcon = cc.Sprite.create(main_scene_image.icon216);
        descriptionIcon.setPosition(this._exploreLayerFit.descriptionIconPoint);
        this.addChild(descriptionIcon);

        var titleLabel = StrokeLabel.create(outputTables.chapter_title.rows[chapter].name, "STHeitiTC-Medium", 40);
        titleLabel.setColor(cc.c3b(255, 239, 131));
        titleLabel.setPosition(this._exploreLayerFit.titleLabelPoint);
        this.addChild(titleLabel, 1);

        this._turnLeftSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnLeftSprite.setRotation(180);
        this._turnLeftSprite.setPosition(this._exploreLayerFit.turnLeftSpritePoint);
        this.addChild(this._turnLeftSprite, 2);

        this._turnRightSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnRightSprite.setPosition(this._exploreLayerFit.turnRightSpritePoint);
        this.addChild(this._turnRightSprite, 2);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._exploreLayerFit.backItemPoint);

        this._exploreItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            main_scene_image.icon403,
            this._onClickExplore,
            this
        );
        this._exploreItem.setPosition(this._exploreLayerFit.exploreItemPoint);
        this._exploreItem.setOffset(cc.p(0, 5));

        this._prePageItem = cc.MenuItemImage.create(
            main_scene_image.button83,
            main_scene_image.button83s,
            this._onClickPrePage,
            this
        );
        this._prePageItem.setPosition(this._exploreLayerFit.prePageItemPoint);


        this._nextPageItem = cc.MenuItemImage.create(
            main_scene_image.button83,
            main_scene_image.button83s,
            this._onClickNextPage,
            this
        );
        this._nextPageItem.setScaleX(-1);
        this._nextPageItem.setPosition(this._exploreLayerFit.nextPageItemPoint);

        this._rewardTipsItem = cc.MenuItemImage.create(
            main_scene_image.button84d,
            main_scene_image.button84d,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);
                TipLayer.tip("凑齐4种奖励方可领取");
            },
            this
        );

        this._rewardTipsItem.setPosition(this._exploreLayerFit.rewardItemPoint);

        var menu = cc.Menu.create(backItem, this._exploreItem, this._prePageItem, this._nextPageItem, this._rewardTipsItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._spiritShadow = cc.Sprite.create(main_scene_image.icon217);
        this._spiritShadow.setPosition(this._exploreLayerFit.spiritShadowPoint);
        this.addChild(this._spiritShadow);

        this._spiritNode = SpiritSideNode.create();
        this._spiritNode.setPosition(this._exploreLayerFit.spiritNodePoint);
        this.addChild(this._spiritNode);

        this._spiritNode.speak();

        this._descriptionLabel = cc.Node.create();
        this._descriptionLabel.setPosition(this._exploreLayerFit.descriptionLabelPoint);
        this.addChild(this._descriptionLabel);

        var collectLabel = cc.Sprite.create(main_scene_image.icon443);
        collectLabel.setPosition(this._exploreLayerFit.collectLabelPoint);
        this.addChild(collectLabel, 2);

        var goldIcon = cc.Sprite.create(main_scene_image.icon444);
        goldIcon.setPosition(cc.p(50, 19));
        collectLabel.addChild(goldIcon);

        var expCardIcon = cc.Sprite.create(main_scene_image.icon445);
        expCardIcon.setPosition(cc.p(120, 19));
        collectLabel.addChild(expCardIcon);

        var spiritIcon = cc.Sprite.create(main_scene_image.icon446);
        spiritIcon.setPosition(cc.p(190, 19));
        collectLabel.addChild(spiritIcon);

        var cardIcon = cc.Sprite.create(main_scene_image.icon447);
        cardIcon.setPosition(cc.p(260, 19));
        collectLabel.addChild(cardIcon);

        this._collectElement = {
            gold: goldIcon,
            exp_card: expCardIcon,
            spirit: spiritIcon,
            card: cardIcon
        };

        // 读配置表
        var chapterTable = outputTables.task.rows;

        var scrollViewLayer = MarkLayer.create(this._exploreLayerFit.scrollViewLayerRect);

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
            exploreExpLabel.setAnchorPoint(cc.p(0, 0.5));
            exploreExpLabel.setPosition(cc.p(275 + x, 408));
            scrollViewLayer.addChild(exploreExpLabel);

            var exploreMoneyLabel = cc.LabelTTF.create(chapterTable[id].coins_obtain, "STHeitiTC-Medium", 20);
            exploreMoneyLabel.setAnchorPoint(cc.p(0, 0.5));
            exploreMoneyLabel.setPosition(cc.p(425 + x, 408));
            scrollViewLayer.addChild(exploreMoneyLabel);

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
            powerLabel.setAnchorPoint(cc.p(0, 0.5));
            powerLabel.setPosition(cc.p(465 + x, 360));
            scrollViewLayer.addChild(powerLabel);

            var expLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
            expLabel.setAnchorPoint(cc.p(0, 0.5));
            expLabel.setPosition(cc.p(465 + x, 319));
            scrollViewLayer.addChild(expLabel);

            var progressLabel = cc.LabelTTF.create("0/0", "STHeitiTC-Medium", 20);
            progressLabel.setAnchorPoint(cc.p(0, 0.5));
            progressLabel.setPosition(cc.p(465 + x, 278));
            scrollViewLayer.addChild(progressLabel);

            this._element[i] = {
                powerLabel: powerLabel,
                expLabel: expLabel,
                progressLabel: progressLabel,
                powerProgress: powerProgress,
                expProgress: expProgress,
                sectionProgress: sectionProgress
            }
        }

        this._scrollView = cc.ScrollView.create(this._exploreLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setContentSize(this._exploreLayerFit.scrollViewContentSize);
        this._scrollView.setPosition(this._exploreLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.setBounceable(false);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentOffset(this._getScrollViewOffset());

        this.update();
        this._updatePage();
        gameData.task.resetNewCollect();
        this._updateCollect();

        return true;
    },

    update: function (time) {
        cc.log("ExploreLayer update");

        time = time || 0;

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

        this._playerLvLabel.setString("Lv. " + gameData.player.get("lv"));

        var element = this._element[this._index];

        element.powerLabel.setString(power + "/" + maxPower);
        element.expLabel.setString(maxExp - exp);
        element.progressLabel.setString(value + "/" + maxValue);

        element.powerProgress.setAllValue(power, maxPower, time);
        element.expProgress.setAllValue(exp, maxExp, time);
        element.sectionProgress.setAllValue(value, maxValue, time);

        for (var i = 0; i < 3; ++i) {
            var point = this._mapLabel[i].getPosition();

            if (point.x < this._exploreLayerFit.pointX) {
                point.x += 1920;
                this._mapLabel[i].setPosition(point);
            }
        }

        this._updatePage();
    },

    _updatePage: function () {
        cc.log("ExploreLayer _updatePage");

        var sectionId = gameData.task.getSection();
        var maxIndex = gameData.task.getPoints() + (sectionId - 1) * TASK_POINTS_COUNT;

        if (this._pageIndex < 1) {
            TipLayer.tip("没有上一页了");
            this._pageIndex = 1;
            return;
        }

        if (this._pageIndex > maxIndex) {
            TipLayer.tip("下一页未开启");
            this._pageIndex = maxIndex;
            return;
        }

        this._descriptionLabel.removeAllChildren();

        var chapterTable = outputTables.task.rows;
        var description = lz.format(chapterTable[this._pageIndex].description, 19);
        var len = description.length;
        for (var i = 0; i < len; ++i) {
            var storyLabel = cc.LabelTTF.create(description[i], "STHeitiTC-Medium", 24);
            storyLabel.setAnchorPoint(cc.p(0, 0));
            storyLabel.setPosition(cc.p(0, -30 * i));
            this._descriptionLabel.addChild(storyLabel);
        }
    },

    _updateCollect: function () {
        cc.log("ExploreLayer _updateCollect");

        var table = outputTables.turn_reward_type.rows;
        var task = gameData.task;

        var key, reward;

        var scaleToAction = cc.Sequence.create(
            cc.FadeIn.create(0.2),
            cc.ScaleTo.create(0.3, 1.2),
            cc.ScaleTo.create(0.2, 1)
        );

        for (key in table) {
            reward = table[key];

            if (task.getCollectStateById(TYPE_NEW_COLLECT, reward.id)) {
                var element = this._collectElement[reward["reward_type"]];
                element.runAction(scaleToAction.clone());
            }
        }

        for (key in table) {
            reward = table[key];
            this._collectElement[reward["reward_type"]].setVisible(task.getCollectStateById(TYPE_COLLECTED, reward.id));
        }

        var isCollectedAll = task.isCollectedAll();

        this._rewardTipsItem.setVisible(!isCollectedAll);

        if (isCollectedAll && !this._rewardEffect) {
            this._showRewardEffect();
        }

        if (!isCollectedAll) {
            if (this._rewardEffect) {
                this._rewardEffect.removeFromParent();
                this._rewardEffect = null;
            }
        }

    },

    _showRewardEffect: function () {
        cc.log("ExploreLayer _showRewardEffect");

        this._rewardEffect = cc.BuilderReader.load(main_scene_image.uiEffect111, this);
        this._rewardEffect.setPosition(this._exploreLayerFit.rewardItemPoint);
        this.addChild(this._rewardEffect);

        var rewardItem = cc.MenuItemImage.create(
            main_scene_image.button84,
            main_scene_image.button84,
            this._onClickReward,
            this
        );
        rewardItem.setPosition(cc.p(0, 0));

        var menu = cc.Menu.create(rewardItem);
        menu.setPosition(cc.p(0, 0));
        this._rewardEffect.controller.ccbMenu.addChild(menu);
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

    _lock: function () {
        cc.log("ExploreLayer _lock");

        this._exploreItem.setEnabled(false);
        LazyLayer.showCloudAll();
        this.setTouchEnabled(false);
    },

    _unlock: function () {
        cc.log("ExploreLayer _unlock");

        this._exploreItem.setEnabled(true);
        LazyLayer.closeCloudAll();
        this.setTouchEnabled(true);
    },

    _playAnimation: function (cb) {
        cc.log("ExploreLayer _playAnimation");

        var callFuncAction = cc.CallFunc.create(function () {
            cb();
        }, this);

        var spiritScaleAction = cc.Sequence.create(
            cc.ScaleTo.create(0.08, 1, 0.92),
            cc.ScaleTo.create(0.08, 1, 1.08),
            cc.ScaleTo.create(0.24, 1, 1),
            cc.ScaleTo.create(0.24, 1, 1.08),
            cc.ScaleTo.create(0.08, 1, 1)
        );

        var spiritMoveAction = cc.Sequence.create(
            cc.DelayTime.create(0.16),
            cc.CallFunc.create(function () {
                gameData.sound.playEffect(main_scene_image.startAnimation_pop_sound, false);
            }, this),
            cc.EaseSineOut.create(cc.MoveBy.create(0.24, cc.p(0, 60))),
            cc.EaseSineIn.create(cc.MoveBy.create(0.24, cc.p(0, -60))),
            cc.DelayTime.create(0.08)
        );

        var spiritRepeatAction = cc.Repeat.create(
            cc.Spawn.create(spiritScaleAction, spiritMoveAction),
            2
        );

        var spiritAction = cc.Sequence.create(spiritRepeatAction, callFuncAction);

        this._spiritNode.runAction(spiritAction);

        var spiritShadowScaleAction = cc.Sequence.create(
            cc.ScaleTo.create(0.08, 1.1, 1.1),
            cc.ScaleTo.create(0.08, 1, 1),
            cc.ScaleTo.create(0.24, 0.4, 0.4),
            cc.ScaleTo.create(0.24, 1, 1),
            cc.ScaleTo.create(0.08, 1.1, 1.1)
        );

        var spiritShadowAction = cc.Repeat.create(spiritShadowScaleAction, 2);

        this._spiritShadow.runAction(spiritShadowAction);

        var mapMoveAction = cc.Sequence.create(
            cc.EaseSineIn.create(cc.MoveBy.create(0.16, cc.p(-6, 0))),
            cc.MoveBy.create(0.24, cc.p(-40, 0)),
            cc.MoveBy.create(0.24, cc.p(-40, 0)),
            cc.EaseSineOut.create(cc.MoveBy.create(0.08, cc.p(-6, 0)))
        );

        var mapAction = cc.Repeat.create(mapMoveAction, 2);

        for (var i = 0; i < 3; ++i) {
            this._mapLabel[i].runAction(mapAction.clone());
        }
    },

    _onBuyPower: function () {
        cc.log("ExploreLayer _onBuyPower");

        var id = 2;
        var product = gameData.shop.getProduct(id);

        cc.log(product);

        if (product.remainTimes <= 0) {
            if (gameData.shop.get("powerBuyCount") <= 0) {
                var tipVip = gameData.player.get("vip") + 1;

                tipVip = Math.max(tipVip, 1);
                tipVip = Math.min(tipVip, 12);

                GoPaymentLayer.pop({
                    title: "体力购买次数已用完",
                    msg: "成为VIP" + tipVip + "，每日即可获得额外的购买次数"
                });
            }

            return;
        }

        var that = this;
        AmountLayer.pop(
            function (count) {
                that._buyPower(id, count);
            },
            product
        );
    },

    _buyPower: function (id, count) {
        cc.log("ExploreLayer _buyCount");

        if (count > 0) {
            var that = this;
            gameData.shop.buyProduct(function (data) {
                that.update();

                lz.tipReward(data);
            }, id, count);
        }
    },

    _onClickExplore: function () {
        cc.log("ExploreLayer _onClickExplore");


        var that = this;
        var task = gameData.task;

        var statue = task.canExplore();

        if (statue == POWER_NO_ENOUGH) {
            this._onBuyPower();
            this.unscheduleAllCallbacks();
        } else if (statue == CARD_FULL) {
            CardListFullTipLayer.pop();
            this.unscheduleAllCallbacks();
        } else {
            gameData.task.explore(function (data) {

                if (task.isCollectedAll()) {
                    task.getTurnReward();
                }

                if (data) {
                    if (data.goldList) {
                        var len = data.goldList.length;
                        var gold = 0;
                        for (var i = 0; i < len; i++) {
                            gold += data.goldList[i];
                        }
                        task.obtainGold(gold);
                    }

                    if (data.toNext) {
                        that._index += 1;
                    }

                    if (that._index > that._maxIndex) {
                        that._sectionId = task.getSection();
                    }

                    that.update();
                    that._updateCollect();
                }

                that.scheduleOnce(function () {
                    that._onClickExplore();
                }, 3.5);
            }, this._getTaskId());
        }
    },

    _onClickBack: function () {
        cc.log("ExploreLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        gameData.task.currentChapter = Math.ceil(this._sectionId / TASK_SECTION_COUNT);

        MainScene.getInstance().switchLayer(InstancesLayer);
    },

    _onClickPrePage: function () {
        cc.log("ExploreLayer _onClickPrePage");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._pageIndex--;
        this._updatePage();
    },

    _onClickNextPage: function () {
        cc.log("ExploreLayer _onClickNextPage");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._pageIndex++;
        this._updatePage();
    },

    _onClickReward: function () {
        cc.log("ExploreLayer _onClickReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;

        gameData.task.getTurnReward(function (reward) {
            GiftBagLayer.pop({
                reward: reward,
                type: SHOW_GIFT_BAG_NO_CLOSE,
                titleType: TYPE_EXPLORE_REWARD,
                cb: function () {
                    that._updateCollect();
                    that.update();
                    lz.tipReward(reward);
                }
            });
        });
    },

    /**
     * when a touch finished
     * @param {cc.Touch} touches
     * @param {event} event
     */
    onTouchesEnded: function (touches, event) {
        cc.log("ExploreLayer onTouchesEnded");

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
