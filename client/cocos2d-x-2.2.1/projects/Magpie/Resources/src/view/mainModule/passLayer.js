/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */


/*
 * pass layer
 * */


var PassLayer = cc.Layer.extend({
    _passLayerFit: null,

    _top: 0,
    _isWin: null,
    _spirit: null,
    _towerSprite: null,
    _topLabel: null,
    _skillPointLabel: null,
    _wipeOutItem: null,
    _resetItem: null,
    _mysticalItem: null,
    _scrollView: null,
    _element: null,
    _scrollViewLayer: null,

    onEnter: function () {
        cc.log("PassLayer onEnter");

        this._super();

        lz.um.beginLogPageView("天道界面");
    },

    onExit: function () {
        cc.log("PassLayer onExit");

        this._super();

        lz.um.endLogPageView("天道界面");
    },

    init: function () {
        cc.log("PassLayer init");

        if (!this._super()) return false;

        var pass = gameData.pass;

        this._passLayerFit = gameFit.mainScene.passLayer;

        this._top = pass.getTop();
        this._element = {};

        var bgSprite = cc.Sprite.create(main_scene_image.bg5);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._passLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect28, this);
        ccbNode.setPosition(this._passLayerFit.ccbNodePoint);
        this.addChild(ccbNode);

        this._mysticalItem = cc.BuilderReader.load(main_scene_image.uiEffect1, this);
        this._mysticalItem.setPosition(this._passLayerFit.mysticalItemPoint);
        this.addChild(this._mysticalItem);

        var scrollViewLayer = MarkLayer.create(this._passLayerFit.scrollViewLayerRect);

        var lazyMenu = LazyMenu.create();
        lazyMenu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(lazyMenu);

        for (var i = 1; i <= MAX_PASS_COUNT; ++i) {
            var flag = (i - 1) % 2;

            var passItem = null;
            var passNamePoint = null;

            if (pass.isBossPass(i)) {
                passItem = cc.MenuItemImage.create(
                    main_scene_image["button13"],
                    main_scene_image["button13s"],
                    main_scene_image["button13d"],
                    this._onClickDefiance(i),
                    this
                );
                passItem.setPosition(cc.p(125 + flag * 210, 100 + 185 * (i - 1)));

                passNamePoint = cc.p(65 + 340 * flag, 20 + 185 * (i - 1));

            } else {
                passItem = cc.MenuItemImage.create(
                    main_scene_image["button14"],
                    main_scene_image["button14s"],
                    main_scene_image["button14d"],
                    this._onClickDefiance(i),
                    this
                );
                passItem.setPosition(cc.p(140 + flag * 180, 100 + 185 * (i - 1)));

                passNamePoint = cc.p(72 + 310 * flag, 50 + 185 * (i - 1));
            }
            lazyMenu.addChild(passItem);

            if (i > 1) {
                var ladderSprite = cc.Sprite.create(main_scene_image["ladder" + (2 - flag)]);
                ladderSprite.setAnchorPoint(cc.p(0, 0));
                ladderSprite.setPosition(cc.p(140 + 16 * flag, 132 + 185 * (i - 2)));
                scrollViewLayer.addChild(ladderSprite);

                if (i > this._top) {
                    ladderSprite.setVisible(false);
                }
            }

            var passNameBgSprite = cc.Sprite.create(main_scene_image.icon3);
            passNameBgSprite.setPosition(passNamePoint);
            scrollViewLayer.addChild(passNameBgSprite);
            passNameBgSprite.setScale(0.8);

            var passNameLabel = cc.LabelTTF.create("第" + i + "层", "STHeitiTC-Medium", 20);
            passNameLabel.setPosition(passNamePoint);
            scrollViewLayer.addChild(passNameLabel);

            this._element[i] = {
                passItem: passItem,
                ladderSprite: ladderSprite
            };
        }

        this._spirit = SpiritNode.create(0);
        this._spirit.setAnchorPoint(cc.p(0, 0));
        this._spirit.setPosition(this._getCardLocation(this._top));
        scrollViewLayer.addChild(this._spirit, 1);

        this._scrollViewLayer = scrollViewLayer;
        this._scrollView = cc.ScrollView.create(this._passLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setContentSize(this._passLayerFit.scrollViewContentSize);
        this._scrollView.setPosition(this._passLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);
        this._locate(this._top);

        var tipLabel = cc.Sprite.create(main_scene_image.icon60);
        tipLabel.setAnchorPoint(cc.p(0, 0));
        tipLabel.setPosition(this._passLayerFit.tipLabelPoint);
        this.addChild(tipLabel, 1);

        var skillPointIcon = cc.Sprite.create(main_scene_image.icon282);
        skillPointIcon.setAnchorPoint(cc.p(0, 0.5));
        skillPointIcon.setPosition(this._passLayerFit.skillPointIconPoint);
        this.addChild(skillPointIcon);

        var topIcon = cc.Sprite.create(main_scene_image.icon62);
        topIcon.setPosition(this._passLayerFit.topIconPoint);
        this.addChild(topIcon);

        this._topLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._topLabel.setAnchorPoint(cc.p(0, 0.5));
        this._topLabel.setPosition(this._passLayerFit.topLabelPoint);
        this.addChild(this._topLabel, 1);

        this._skillPointLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 20);
        this._skillPointLabel.setAnchorPoint(cc.p(0, 0.5));
        this._skillPointLabel.setPosition(this._passLayerFit.skillPointLabelPoint);
        this.addChild(this._skillPointLabel);

        this._towerSprite = cc.Sprite.create(main_scene_image.icon225);
        this._towerSprite.setAnchorPoint(cc.p(0, 0));
        this._towerSprite.setPosition(this._passLayerFit.towerSpritePoint);
        this.addChild(this._towerSprite);

        var towerBgSprite = cc.Sprite.create(main_scene_image.icon224);
        towerBgSprite.setAnchorPoint(cc.p(0, 0));
        towerBgSprite.setPosition(this._passLayerFit.towerBgSpritePoint);
        this.addChild(towerBgSprite);

        var lineUpItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon24,
            this._onClickLineUp,
            this
        );
        lineUpItem.setPosition(this._passLayerFit.lineUpItemPoint);

        this._wipeOutItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.button9d,
            main_scene_image.icon15,
            this._onClickWipeOut,
            this
        );
        this._wipeOutItem.setPosition(this._passLayerFit.wipeOutItemPoint);

        this._resetItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon223,
            this._onClickReset,
            this
        );
        this._resetItem.setPosition(this._passLayerFit.resetItemPoint);

        var menu = cc.Menu.create(lineUpItem, this._wipeOutItem, this._resetItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        this.update();
        this.updateGuide();

        return true;
    },

    update: function () {
        cc.log("PassLayer update");

        var pass = gameData.pass;

        this._locate(this._top);

        for (var i = 1; i <= MAX_PASS_COUNT; ++i) {
            var mark = pass.getMarkByIndex(i);

            this._element[i].passItem.setEnabled(mark);

            if (i > 1) {
                var color = mark ? cc.c3b(255, 255, 255) : cc.c3b(160, 160, 160);
                this._element[i].ladderSprite.setColor(color);
            }
        }

        this._wipeOutItem.setEnabled(pass.canWipeOut());
        this._resetItem.setVisible(pass.canReset());
        this._mysticalItem.setVisible(pass.get("hasMystical"));

        this._skillPointLabel.setString(gameData.player.get("skillPoint"));
        this._topLabel.setString(pass.get("top"));

        var height = this._top / MAX_PASS_COUNT * 211;
        this._towerSprite.setTextureRect(cc.rect(0, 211 - height, 104, height));
    },

    _getOffset: function (index) {
        cc.log("PassLayer _getOffset");

        var offsetY = 140 - 185 * (index - 1);

        var maxOffset = this._scrollView.maxContainerOffset();
        var minOffset = this._scrollView.minContainerOffset();

        offsetY = Math.min(offsetY, maxOffset.y);
        offsetY = Math.max(offsetY, minOffset.y);

        return cc.p(0, offsetY);
    },

    _locate: function (index, duration) {
        cc.log("PassLayer _locate");

        var offset = this._getOffset(index);

        if (duration) {
            this._scrollView.setContentOffsetInDuration(offset, duration);
        } else {
            this._scrollView.setContentOffset(offset);
        }
    },

    _getCardLocation: function (index) {
        cc.log("PassLayer _getCardLocation");

        var flag = (index - 1) % 2;

        if (gameData.pass.isBossPass(index)) {
            return cc.p(125 + flag * 210, 168 + 185 * (index - 1));
        } else {
            return cc.p(140 + flag * 180, 168 + 185 * (index - 1));
        }
    },

    _spiritWalk: function (index, duration, height, jumps) {
        cc.log("PassLayer _spiritWalk");

        duration = duration || 1;
        height = height || 35;
        jumps = jumps || 3;

        this._spirit.setPosition(this._getCardLocation(index - 1));
        var jumpAction = cc.JumpTo.create(duration, this._getCardLocation(index), height, jumps);
        var callFuncAction = cc.CallFunc.create(function () {
            gameData.sound.playEffect(main_scene_image.startAnimation_pop_sound, false);
        }, this);

        var playSoundAction = cc.Sequence.create(
            callFuncAction,
            cc.DelayTime.create(duration / 3),
            callFuncAction,
            cc.DelayTime.create(duration / 3),
            callFuncAction
        );
        this._spirit.runAction(
            cc.Spawn.create(playSoundAction, jumpAction)
        );

        this._locate(index, duration);
    },

    _showLadder: function (index) {
        cc.log("PassLayer _showLadder");

        var ladderSprite = this._element[index].ladderSprite;

        var url = "uiEffect" + (50 + index % 2);
        var effect = cc.BuilderReader.load(main_scene_image[url], this);
        effect.setPosition(ladderSprite.getPosition());
        effect.animationManager.setCompletedAnimationCallback(this, function () {
            effect.removeFromParent();
            ladderSprite.setVisible(true);
        });

        this._scrollViewLayer.addChild(effect);

    },

    _reset: function () {
        cc.log("PassLayer _reset");

        var that = this;
        gameData.pass.reset(function (data) {
            cc.log(data);

            that.update();
        });
    },

    _showReset: function () {
        cc.log("PassLayer _showWipeOutReward");

        var layer = LazyLayer.create();
        this.addChild(layer, 5);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 1136);
        bgLayer.setPosition(this._passLayerFit.bgLayerPoint);
        layer.addChild(bgLayer);

        var bgSprite = cc.Sprite.create(main_scene_image.bg16);
        bgSprite.setPosition(this._passLayerFit.bgSprite2Point);
        layer.addChild(bgSprite);

        var rewardLabel1 = cc.LabelTTF.create("是否消耗 200 ", "STHeitiTC-Medium", 25);
        rewardLabel1.setColor(cc.c3b(255, 239, 131));
        rewardLabel1.setAnchorPoint(cc.p(0, 1));
        rewardLabel1.setPosition(this._passLayerFit.rewardLabel1Point);
        layer.addChild(rewardLabel1);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setAnchorPoint(cc.p(0, 1));
        goldIcon.setPosition(this._passLayerFit.goldIconPoint);
        layer.addChild(goldIcon);

        var rewardLabel2 = cc.LabelTTF.create("重置关卡?", "STHeitiTC-Medium", 25);
        rewardLabel2.setColor(cc.c3b(255, 239, 131));
        rewardLabel2.setAnchorPoint(cc.p(0, 1));
        rewardLabel2.setPosition(this._passLayerFit.rewardLabel2Point);
        layer.addChild(rewardLabel2);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            function () {
                this._reset();
                layer.removeFromParent();
            },
            this
        );
        okItem.setPosition(this._passLayerFit.okItemPoint);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            function () {
                layer.removeFromParent();
            },
            this
        );
        closeItem.setPosition(this._passLayerFit.closeItemPoint);

        var menu = cc.Menu.create(okItem, closeItem);
        menu.setPosition(cc.p(0, 0));
        layer.addChild(menu);
    },

    _showWipeOutReward: function (cb, reward) {
        cc.log("PassLayer _showWipeOutReward");

        var layer = LazyLayer.create();
        layer.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        MainScene.getInstance().addChild(layer, 10);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 1136);
        bgLayer.setPosition(this._passLayerFit.bgLayerPoint);
        layer.addChild(bgLayer);

        var bgSprite = cc.BuilderReader.load(main_scene_image.uiEffect17, this);
        bgSprite.setPosition(this._passLayerFit.bgSprite2Point);
        layer.addChild(bgSprite);

        var label = bgSprite.controller.ccbLabel;
        var titleIcon = bgSprite.controller.ccbTitleIcon;
        titleIcon.setTexture(lz.getTexture(main_scene_image.icon226));

        var str = lz.getRewardString(reward);
        var len = str.length;

        var offsetY = 133;
        for (var i = 0; i < len; ++i) {
            if (str[i].icon) {
                var rewardIcon = cc.Sprite.create(main_scene_image[str[i].icon]);
                rewardIcon.setPosition(cc.p(-70, offsetY - 10));
                label.addChild(rewardIcon);
            }

            var rewardLabel = cc.LabelTTF.create(str[i].str, "STHeitiTC-Medium", 20);
            rewardLabel.setColor(str[i].color);
            rewardLabel.setAnchorPoint(cc.p(0, 1));
            rewardLabel.setPosition(cc.p(-40, offsetY));
            label.addChild(rewardLabel);
            offsetY -= 57;
        }

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            function () {
                layer.removeFromParent();
                cb();
            },
            this
        );
        okItem.setPosition(this._passLayerFit.okItem2Point);

        var menu = cc.Menu.create(okItem);
        menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        label.addChild(menu);

        bgSprite.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_1", 0);
    },

    _defianceAnimation: function (cb) {
        cc.log("PassLayer _defianceAnimation");

        if (this._top > MAX_PASS_COUNT) {
            cb();
            return;
        }

        this._showLadder(this._top);

        this.scheduleOnce(function () {
            this._spiritWalk(this._top);
        }, 2.5);

        this.scheduleOnce(function () {
            var ccbNode;
            if (gameData.pass.isBossPass(this._top)) {
                ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect20, this);
            } else {
                ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect16, this);
            }
            ccbNode.setPosition(this._element[this._top].passItem.getPosition());
            this._scrollView.addChild(ccbNode);

            ccbNode.animationManager.setCompletedAnimationCallback(this, function () {
                ccbNode.removeFromParent();
            });

            cb();
        }, 3.5);
    },

    _wipeOutAnimation: function (cb) {
        cc.log("PassLayer _wipeOutAnimation");

        this.ccbFnCallback = function () {
            cc.log("PassLayer ccbFnCallback");

            this._element[1].passItem.setEnabled(false);
            this._locate(2, 0.05);

            var index = 2;
            this.schedule(function () {
                this._element[index].passItem.setEnabled(false);
                this._element[index].ladderSprite.setColor(cc.c3b(160, 160, 160));

                index += 1;

                if (index > this._top) {
                    ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_3", 0);
                    ccbNode.animationManager.setCompletedAnimationCallback(this, function () {
                        this._spirit.setVisible(true);
                        ccbNode.removeFromParent();

                        cb();
                    });

                    return;
                }

                this._locate(index, 0.05);
            }, 0.05, this._top - 2);
        };

        var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect83, this);
        ccbNode.setPosition(cc.pAdd(gameFit.GAME_ZERO_POINT, cc.p(230, 200)));
        this.addChild(ccbNode);

        this._spirit.setVisible(false);

        this._locate(1);
    },

    ccbFnCallback: function () {
        cc.log("PassLayer ccbFnCallback null");
    },

    _onClickDefiance: function (id) {
        return function () {
            cc.log("PassLayer _onClickDefiance: " + id);

            gameData.sound.playEffect(main_scene_image.click_building_sound, false);

            this._element[id].passItem.stopAllActions();

            this._element[id].passItem.runAction(
                cc.Sequence.create(
                    cc.ScaleTo.create(0.2, 1.2),
                    cc.ScaleTo.create(0.3, 0.9),
                    cc.ScaleTo.create(0.2, 1)
                )
            );

            if (id > this._top) {
                TipLayer.tip("请先挑战前面关卡");
                return;
            }

            LazyLayer.showCloudAll();

            var that = this;
            gameData.pass.defiance(function (data) {
                cc.log(data);

                if (data) {
                    var battleLogId = data.battleLogId;
                    var upgradeReward = data.upgradeReward || null;
                    var level9Box = data.level9Box || null;
                    var isFirstPassWin = data.isFirstPassWin || false;
                    var isWin = false;
                    var next = function () {
                        gameCombo.next();
                    };

                    gameCombo.push([
                        function () {
                            isWin = BattlePlayer.getInstance().play({
                                cb: next,
                                id: battleLogId
                            });
                        },
                        function () {
                            that._spirit.speak(isWin);

                            that.update();

                            var top = gameData.pass.getTop();

                            if (top != that._top) {
                                that._top = top;
                                that._defianceAnimation(next);
                            } else {
                                next();
                            }
                        },
                        function () {
                            LazyLayer.closeCloudAll();
                            next();
                        },
                        function () {
                            if (upgradeReward) {
                                PlayerUpgradeLayer.pop({
                                    cb: next,
                                    reward: upgradeReward
                                });
                            } else {
                                next();
                            }
                        },
                        function () {
                            if (level9Box) {
                                Level9BoxLayer.pop({
                                    cb: next,
                                    reward: level9Box
                                });
                            } else {
                                next();
                            }
                        },
                        function () {
                            if (isFirstPassWin) {
                                MandatoryTeachingLayer.pop({
                                    cb: next,
                                    progress: FIRST_PASS_WIN
                                });
                            } else {
                                next();
                            }
                        },
                        function () {
                            if (upgradeReward) {
                                gameGuide.updateGuide();
                            }
                            next();
                        }
                    ]);
                } else {
                    that.update();

                    LazyLayer.closeCloudAll();
                }
            }, id);
        }
    },

    _onClickWipeOut: function () {
        cc.log("PassLayer _onClickWipeOut");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        LazyLayer.showCloudAll();

        var that = this;
        gameData.pass.wipeOut(function (data) {
            cc.log(data);

            if (data) {
                var upgradeReward = data.upgradeReward || null;
                var level9Box = data.level9Box || null;

                var next = function () {
                    gameCombo.next();
                };

                gameCombo.push([
                    function () {
                        that._wipeOutAnimation(next);
                    },
                    function () {
                        that._showWipeOutReward(next, data.reward);
                        LazyLayer.closeCloudAll();
                    },
                    function () {
                        that.update();
                        next();
                    },
                    function () {
                        if (upgradeReward) {
                            PlayerUpgradeLayer.pop({
                                cb: next,
                                reward: upgradeReward
                            });
                        } else {
                            next();
                        }
                    },
                    function () {
                        if (level9Box) {
                            Level9BoxLayer.pop({
                                cb: next,
                                reward: level9Box
                            });
                        } else {
                            next();
                        }
                    },
                    function () {
                        if (upgradeReward) {
                            gameGuide.updateGuide();
                        }
                        next();
                    }
                ]);
            } else {
                that.update();

                LazyLayer.closeCloudAll();
            }
        });
    },

    ccbFnMystical: function () {
        cc.log("PassLayer ccbFnMystical");

        gameData.sound.playEffect(main_scene_image.click_building_sound, false);

        LazyLayer.showCloudAll();

        var that = this;
        gameData.pass.mystical(function (battleLogId) {
            if (battleLogId) {
                var isWin = false;
                var next = function () {
                    gameCombo.next();
                };

                gameCombo.push([
                    function () {
                        isWin = BattlePlayer.getInstance().play({
                            cb: next,
                            id: battleLogId
                        });
                    },
                    function () {
                        that.update();

                        if (isWin) {
                            that._spirit.speak(isWin);
                        }

                        LazyLayer.closeCloudAll();
                        next();
                    }
                ]);
            } else {
                LazyLayer.closeCloudAll();
            }
        });
    },

    _onClickLineUp: function () {
        cc.log("TournamentLabel _onClickLineUp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        LineUpLayer.pop();
    },

    _onClickReset: function () {
        cc.log("PassLayer _onClickReset");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._showReset();
    },

    updateGuide: function () {
        cc.log("PassLayer updateGuide");

        if (gameGuide.get("passExplain")) {
            gameGuide.set("passExplain", false);
            var url = gameGuide.getExplainEffect("pass");
            var effect = cc.BuilderReader.load(main_scene_image[url], this);
            effect.setPosition(gameFit.gameGuide.effectPoint);
            effect.animationManager.setCompletedAnimationCallback(this, function () {
                effect.removeFromParent();
            });
            this.addChild(effect, 10);
        }
    }
});

PassLayer.create = function () {
    var ret = new PassLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

PassLayer.canEnter = function () {
    var limitLv = outputTables.function_limit.rows[1].pass;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("天道" + limitLv + "级开放");

    return false;
};