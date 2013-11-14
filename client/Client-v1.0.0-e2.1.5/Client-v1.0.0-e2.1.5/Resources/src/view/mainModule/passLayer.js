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
    _upgradeReward: null,
    _spirit: null,
    _towerSprite: null,
    _topLabel: null,
    _skillPointLabel: null,
    _wipeOutItem: null,
    _resetItem: null,
    _mysticalItem: null,
    _scrollView: null,
    _element: {},
    _blackHoleSprite: [],

    onEnter: function () {
        cc.log("PassLayer onEnter");

        this._super();
        this.update();
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

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._passLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon17);
        titleIcon.setPosition(this._passLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        this._mysticalItem = cc.MenuItemImage.create(
            main_scene_image.button43,
            main_scene_image.button43,
            this._onClickMystical,
            this
        );
        this._mysticalItem.setPosition(this._passLayerFit.mysticalItemPoint);
        this._mysticalItem.setVisible(false);

        var mysticalItemMenu = cc.Menu.create(this._mysticalItem);
        mysticalItemMenu.setPosition(cc.p(0, 0));
        this.addChild(mysticalItemMenu);

        for (var i = 0; i < 6; ++i) {
            this._blackHoleSprite[i] = cc.Sprite.create(main_scene_image["icon" + (228 + i)]);
            this._blackHoleSprite[i].setPosition(cc.p(82, 125));
            this._mysticalItem.addChild(this._blackHoleSprite[i]);
        }

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

        this._spirit = SpiritNode.create();
        this._spirit.setAnchorPoint(cc.p(0, 0));
        this._spirit.setPosition(this._getCardLocation(this._top));
        scrollViewLayer.addChild(this._spirit, 1);

        this._scrollView = cc.ScrollView.create(this._passLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setContentSize(this._passLayerFit.scrollViewContentSize);
        this._scrollView.setPosition(this._passLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);
        this._locate(this._top);

        var tipLabel = cc.Sprite.create(main_scene_image.bg6);
        tipLabel.setAnchorPoint(cc.p(0, 0));
        tipLabel.setPosition(this._passLayerFit.tipLabelPoint);
        this.addChild(tipLabel, 1);

        var skillPointIcon = cc.Sprite.create(main_scene_image.icon282);
        skillPointIcon.setAnchorPoint(cc.p(0, 0.5));
        skillPointIcon.setPosition(this._passLayerFit.skillPointIconPoint);
        this.addChild(skillPointIcon);

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

        this._wipeOutItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
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

        var menu = cc.Menu.create(this._wipeOutItem, this._resetItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        return true;
    },

    update: function () {
        cc.log("PassLayer update");

        if (this._upgradeReward) {
            PlayerUpgradeLayer.pop(this._upgradeReward);
            this._upgradeReward = null;
        }

        var pass = gameData.pass;

        this._blackHoleRotate();

        for (var i = 1; i <= MAX_PASS_COUNT; ++i) {
            var mark = pass.getMarkByIndex(i);

            this._element[i].passItem.setEnabled(mark);

            if (i > 1) {
                var color = mark ? cc.c3b(255, 255, 255) : cc.c3b(160, 160, 160);
                this._element[i].ladderSprite.setColor(color);
            }
        }

        if (this._isWin != null) {
            this._spirit.speak(this._isWin);

            var top = pass.getTop();

            if (top != this._top) {
                this._locate(this._top);

                this._top = top;

                this._defianceAnimation();
            } else {
                LazyLayer.closeCloudLayer();
            }

            this._isWin = null;
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
        this._spirit.runAction(jumpAction);

        this._locate(index, duration);
    },

    _showLadder: function (index) {
        cc.log("PassLayer _showLadder");

        var ladderSprite = this._element[index].ladderSprite;

        ladderSprite.stopAllActions();

        var showAction = cc.Show.create();
        var fadeInAction = cc.FadeIn.create(1.5);
        var blinkAction = cc.Blink.create(1, 2);
        var action = cc.Sequence.create(showAction, fadeInAction, blinkAction);
        ladderSprite.runAction(action);
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
        this.addChild(layer);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 960);
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

    _showWipeOutReward: function (reward) {
        cc.log("PassLayer _showWipeOutReward");

        var layer = LazyLayer.create();
        layer.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        MainScene.getInstance().addChild(layer, 10);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 960);
        bgLayer.setPosition(this._passLayerFit.bgLayerPoint);
        layer.addChild(bgLayer);

        var bgSprite = cc.Sprite.create(main_scene_image.bg17);
        bgSprite.setPosition(this._passLayerFit.bgSprite2Point);
        layer.addChild(bgSprite);

        var obtainSprite = cc.Sprite.create(main_scene_image.icon226);
        obtainSprite.setPosition(this._passLayerFit.obtainSpritePoint);
        layer.addChild(obtainSprite);

        var str = lz.getRewardString(reward);
        var len = str.length;

        // var offsetY = 655;
        var point = this._passLayerFit.rewardLabelBasePoint;
        for (var i = 0; i < len; ++i) {
            var rewardLabel = cc.LabelTTF.create(str[i], "STHeitiTC-Medium", 20);
            rewardLabel.setColor(cc.c3b(255, 239, 131));
            rewardLabel.setAnchorPoint(cc.p(0.5, 1));
            rewardLabel.setPosition(point);
            layer.addChild(rewardLabel);

            point.y -= this._passLayerFit.rewardLabelOffsetY;
        }

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            function () {
                layer.removeFromParent();
                this.update();
            },
            this
        );
        okItem.setPosition(this._passLayerFit.okItem2Point);

        var menu = cc.Menu.create(okItem);
        menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        layer.addChild(menu);
    },

    _blackHoleRotate: function () {
        cc.log("PassLayer _blackHoleRotate");

        var deltaAngleList = [10, 15, 20, 25, 30, 35];
        var len = this._blackHoleSprite.length;

        for (var i = 0; i < len; ++i) {
            this._blackHoleSprite[i].stopAllActions();

            this._blackHoleSprite[i].runAction(
                cc.RepeatForever.create(
                    cc.RotateBy.create(1, deltaAngleList[i])
                )
            );
        }
    },

    _defianceAnimation: function () {
        cc.log("PassLayer _defianceAnimation");

        if (this._top > MAX_PASS_COUNT) {
            LazyLayer.closeCloudLayer();
            return;
        }

        this._showLadder(this._top);

        this.scheduleOnce(function () {
            this._spiritWalk(this._top);
        }, 2.5);

        this.scheduleOnce(function () {
            LazyLayer.closeCloudLayer();
        }, 3.5);
    },

    _wipeOutAnimation: function (reward) {
        cc.log("PassLayer _wipeOutAnimation");

        this._locate(1);

        this._element[1].passItem.setEnabled(false);

        this._spiritWalk(2, 0.5, 50, 1);
        var index = 2;
        this.schedule(function () {
            this._element[index].passItem.setEnabled(false);
            this._element[index].ladderSprite.setColor(cc.c3b(160, 160, 160));

            index += 1;

            if (index > this._top) {
                LazyLayer.closeCloudAll();
                this._showWipeOutReward(reward);
                return;
            }

            this._spiritWalk(index, 0.5, 50, 1);
        }, 0.6, this._top - 2);
    },

    _onClickDefiance: function (id) {
        return function () {
            cc.log("PassLayer _onClickDefiance: " + id);

            if (id > this._top) {
                TipLayer.tip("请先挑战前面关卡");
                return;
            }

            LazyLayer.showCloudLayer();

            var that = this;
            gameData.pass.defiance(function (data) {
                cc.log(data);

                if (data) {
                    that._upgradeReward = data.upgradeReward || null;

                    that._isWin = BattlePlayer.getInstance().play(data.battleLogId);
                } else {
                    that.update();

                    LazyLayer.closeCloudLayer();
                }
            }, id);
        }
    },

    _onClickWipeOut: function () {
        cc.log("PassLayer _onClickWipeOut");

        LazyLayer.showCloudAll();

        var that = this;
        gameData.pass.wipeOut(function (data) {
            cc.log(data);

            if (data) {
                that._upgradeReward = data.upgradeReward || null;

                that._wipeOutAnimation(data.reward);
            } else {
                that.update();

                LazyLayer.closeCloudAll();
            }

        });
    },

    _onClickMystical: function () {
        cc.log("PassLayer _onClickMystical");

        var that = this;
        gameData.pass.mystical(function (battleLogId) {
            that._isWin = BattlePlayer.getInstance().play(battleLogId);
        });
    },

    _onClickReset: function () {
        cc.log("PassLayer _onClickReset");

        this._showReset();
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