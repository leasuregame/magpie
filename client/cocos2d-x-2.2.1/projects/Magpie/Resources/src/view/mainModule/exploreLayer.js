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
    _sectionId: 0,
    _spiritNode: null,
    _spiritShadow: null,
    _turnLeftSprite: null,
    _turnRightSprite: null,
    _mapLabel: [],
    _exploreItem: null,
    _scrollView: null,
    _element: {},
    _reward: null,
    _level9Box: null,
    _playerLvLabel: null,

    onEnter: function () {
        cc.log("ExploreLayer onEnter");

        this._super();
        this.update();

        lz.dc.beginLogPageView("探索界面");
    },

    onExit: function () {
        cc.log("ExploreLayer onExit");

        this._super();

        lz.dc.endLogPageView("探索界面");
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

        var bgSprite = cc.Sprite.create(main_scene_image.bg9);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._exploreLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._exploreLayerFit.headIconPoint);
        this.addChild(headIcon, 1);

        var chapter = Math.ceil((this._sectionId) / TASK_SECTION_COUNT);

        var sid = (sectionId - 1) % 5 < 3 ? 1 : 0;
        var id = (chapter * 2 - sid) % 8;
        if (id == 0) {
            id = 8;
        }
        var url = "explore_bg_" + id;
        for (var i = 0; i < 3; ++i) {
            this._mapLabel[i] = cc.Sprite.create(main_scene_image[url]);
            this._mapLabel[i].setAnchorPoint(cc.p(0, 0));
            this._mapLabel[i].setPosition(cc.p(this._exploreLayerFit.mapLabelBasePoint.x + i * this._exploreLayerFit.mapLabelOffsetX, this._exploreLayerFit.mapLabelBasePoint.y));
            this._mapLabel[i].setScaleY(this._exploreLayerFit.mapLabelScaleY);
            this.addChild(this._mapLabel[i]);
        }

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

        this._spiritShadow = cc.Sprite.create(main_scene_image.icon217);
        this._spiritShadow.setPosition(this._exploreLayerFit.spiritShadowPoint);
        this.addChild(this._spiritShadow);

        this._spiritNode = SpiritSideNode.create();
        this._spiritNode.setPosition(this._exploreLayerFit.spiritNodePoint);
        this.addChild(this._spiritNode);

        this._spiritNode.speak();

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

        this._exploreItem = cc.MenuItemImage.create(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            this._onClickExplore,
            this
        );
        this._exploreItem.setPosition(this._exploreLayerFit.exploreItemPoint);


        var menu = cc.Menu.create(backItem, this._exploreItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

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

            var descriptionLabel = cc.Node.create();
            descriptionLabel.setPosition(this._exploreLayerFit.descriptionLabelPoint);
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

            var description = lz.format(chapterTable[id].description, 19);
            var len = description.length;
            for (var j = 0; j < len; ++j) {
                var storyLabel = cc.LabelTTF.create(description[j], "STHeitiTC-Medium", 24);
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

        this._scrollView = cc.ScrollView.create(this._exploreLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setContentSize(this._exploreLayerFit.scrollViewContentSize);
        this._scrollView.setPosition(this._exploreLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.setBounceable(false);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentOffset(this._getScrollViewOffset());

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

        this._playerLvLabel.setString("Lv. " + gameData.player.get("lv"));

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

            if (point.x < this._exploreLayerFit.pointX) {
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

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(TaskLayer);
    },

    _onClickExplore: function () {
        cc.log("ExploreLayer _onClickExplore");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (gameData.cardList.isFull()) {
            CardListFullTipLayer.pop();
            return;
        }

        var task = gameData.task;

        var statue = task.canExplore();

        if (statue == CAN_EXPLORE) {
            this._lock();

            var that = this;
            gameData.task.explore(function (data) {
                cc.log(data);

                if (data) {
                    that._reward = data;

                    that._playAnimation();
                } else {
                    that.update();
                    that._unlock();
                }
            }, this._getTaskId());
        } else if (statue == POWER_NO_ENOUGH) {
            this._onBuyPower();
        } else {
            return;
        }

        if (noviceTeachingLayer.isNoviceTeaching()) {
            noviceTeachingLayer.clearAndSave();
            noviceTeachingLayer.next();
        }
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

    _toNext: function (cb) {
        cc.log("ExploreLayer _toNext");

        var passEffect = cc.BuilderReader.load(main_scene_image.uiEffect24, this);
        passEffect.controller.ccbGoldLayer.setString(this._reward.through_reward.money);
        passEffect.setPosition(this._exploreLayerFit.passEffectPoint);
        this.addChild(passEffect);

        var that = this;

        passEffect.animationManager.setCompletedAnimationCallback(this, function () {
            passEffect.removeFromParent();
            that._index += 1;

            if (that._index > that._maxIndex) {
                that._unlock();
                that._onClickBack();
            }
            that.scheduleOnce(that._unlock, 0.3);
            cb();
            that.update();
        });
    },

    _showReward: function () {
        cc.log("ExploreLayer _showReward");

        if (this._reward) {

            if (this._reward.money && this._reward.exp) {
                var url = "uiEffect48";
                if(this._reward.isDouble) {
                    url = "uiEffect87";
                }
                var rewardEffect = cc.BuilderReader.load(main_scene_image[url], this);
                rewardEffect.controller.ccbMoneyLabel.setString("+" + this._reward.money);
                rewardEffect.controller.ccbExpLabel.setString("+" + this._reward.exp);
                rewardEffect.setPosition(this._exploreLayerFit.rewardEffectPoint);
                this.addChild(rewardEffect);
                rewardEffect.animationManager.setCompletedAnimationCallback(this, function () {
                    rewardEffect.removeFromParent();
                });
            }

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
                powerLabel.setPosition(cc.p(x, 365));
                this._scrollView.addChild(powerLabel, 2);
                powerLabel.setAnchorPoint(cc.p(0.5, 0.5));

                powerLabel.runAction(action.clone());
            }

            if (this._reward.exp) {
                var expLabel = cc.LabelTTF.create("+" + this._reward.exp, "STHeitiTC-Medium", 15);
                expLabel.setPosition(cc.p(x, 324));
                this._scrollView.addChild(expLabel, 2);
                expLabel.setAnchorPoint(cc.p(0.5, 0.5));

                expLabel.runAction(action.clone());
            }


            if (this._reward.progress) {
                var progressLabel = cc.LabelTTF.create("+" + this._reward.progress, "STHeitiTC-Medium", 15);
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
                var upgradeReward = this._reward.upgradeReward;
                var level9Box = this._reward.level9Box;

                var next = function () {
                    if (upgradeReward) {
                        var cb = function () {
                            if (goldList) {
                                GoldLayer.pop({
                                    goldList: goldList,
                                    cb: function () {
                                        if (level9Box) {
                                            Level9BoxLayer.pop({reward: level9Box});
                                        }
                                    }
                                });
                            } else {
                                if (level9Box) {
                                    Level9BoxLayer.pop({reward: level9Box});
                                }
                            }
                        };
                        PlayerUpgradeLayer.pop({reward: upgradeReward, cb: cb});
                    } else {
                        if (goldList) {
                            GoldLayer.pop({
                                goldList: goldList,
                                cb: function () {
                                    if (level9Box) {
                                        Level9BoxLayer.pop({reward: level9Box});
                                    }
                                }
                            });
                        } else {
                            if (level9Box) {
                                Level9BoxLayer.pop({reward: level9Box});
                            }
                        }
                    }
                };

                if (toNext) {
                    this._toNext(next);
                } else {
                    this._unlock();
                    next();
                }

                this._reward = null;
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
                        var isWin = BattlePlayer.getInstance().play(this._reward.battleLogId);
                        this._spiritNode.normal();

                        if (isWin) {
                            if (this._reward.isFirstFight) {
                                MandatoryTeachingLayer.pop(FIRST_FIGHT);
                            }
                        }

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

    _showBox: function () {
        cc.log("ExploreLayer _showBox");

        var boxEffect = cc.BuilderReader.load(main_scene_image.uiEffect47, this);
        boxEffect.setPosition(this._exploreLayerFit.openBoxSpritePoint);
        this.addChild(boxEffect);

        boxEffect.animationManager.setCompletedAnimationCallback(this, function () {
            boxEffect.removeFromParent();
        });
    },

    ccbFnOpenBox: function () {
        cc.log("ExploreLayer ccbFnOpenBox");

        var that = this;
        var cb = function () {
            that.update();
        };

        LotteryCardLayer.pop({card: this._reward.card, cb: cb});
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
