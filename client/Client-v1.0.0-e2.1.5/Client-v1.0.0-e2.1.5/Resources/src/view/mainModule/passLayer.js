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

        this._top = pass.getTop();
        this._element = {};

        var bgSprite = cc.Sprite.create(main_scene_image.bg5);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 968));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon17);
        titleIcon.setPosition(cc.p(360, 1008));
        this.addChild(titleIcon);

        this._mysticalItem = cc.MenuItemImage.create(
            main_scene_image.button43,
            main_scene_image.button43,
            this._onClickMystical,
            this
        );
        this._mysticalItem.setPosition(cc.p(580, 610));
        this._mysticalItem.setVisible(false);

        var mysticalItemMenu = cc.Menu.create(this._mysticalItem);
        mysticalItemMenu.setPosition(cc.p(0, 0));
        this.addChild(mysticalItemMenu);

        for (var i = 0; i < 6; ++i) {
            this._blackHoleSprite[i] = cc.Sprite.create(main_scene_image["icon" + (228 + i)]);
            this._blackHoleSprite[i].setPosition(cc.p(82, 125));
            this._mysticalItem.addChild(this._blackHoleSprite[i]);
        }

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 774));

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
            passNameLabel.setColor(cc.c3b(255, 239, 131));
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

        this._scrollView = cc.ScrollView.create(cc.size(640, 774), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(640, 18700));
        this._scrollView.setPosition(GAME_BG_POINT);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);
        this._locate(this._top);

        var tipLabel = cc.Sprite.create(main_scene_image.bg6);
        tipLabel.setAnchorPoint(cc.p(0, 0));
        tipLabel.setPosition(cc.p(40, 900));
        this.addChild(tipLabel);

        this._topLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._topLabel.setColor(cc.c3b(255, 239, 131));
        this._topLabel.setAnchorPoint(cc.p(0, 0.5));
        this._topLabel.setPosition(cc.p(190, 934));
        this.addChild(this._topLabel);

        this._skillPointLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 20);
        this._skillPointLabel.setColor(cc.c3b(255, 239, 131));
        this._skillPointLabel.setAnchorPoint(cc.p(0, 0.5));
        this._skillPointLabel.setPosition(cc.p(583, 837));
        this.addChild(this._skillPointLabel);

        this._towerSprite = cc.Sprite.create(main_scene_image.icon225);
        this._towerSprite.setAnchorPoint(cc.p(0, 0));
        this._towerSprite.setPosition(cc.p(524, 226));
        this.addChild(this._towerSprite);

        var towerBgSprite = cc.Sprite.create(main_scene_image.icon224);
        towerBgSprite.setAnchorPoint(cc.p(0, 0));
        towerBgSprite.setPosition(cc.p(510, 220));
        this.addChild(towerBgSprite);

        this._wipeOutItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon15,
            this._onClickWipeOut,
            this
        );
        this._wipeOutItem.setPosition(cc.p(580, 934));

        this._resetItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon223,
            this._onClickReset,
            this
        );
        this._resetItem.setPosition(cc.p(580, 934));

        var menu = cc.Menu.create(this._wipeOutItem, this._resetItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("PassLayer update");

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

            this._isWin = null;
        }

        var top = pass.getTop();

        if (top != this._top) {
            this._locate(this._top);

            this._top = top;

            this._defianceAnimation();
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
        bgLayer.setPosition(GAME_ZERO);
        layer.addChild(bgLayer);

        var bgSprite = cc.Sprite.create(main_scene_image.bg16);
        bgSprite.setPosition(cc.p(360, 580));
        layer.addChild(bgSprite);

        var rewardLabel = cc.LabelTTF.create("是否消耗 200 魔石重置关卡?", "STHeitiTC-Medium", 25);
        rewardLabel.setColor(cc.c3b(255, 239, 131));
        rewardLabel.setAnchorPoint(cc.p(0.5, 1));
        rewardLabel.setPosition(cc.p(360, 650));
        layer.addChild(rewardLabel);

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
        okItem.setPosition(cc.p(260, 530));

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            function () {
                layer.removeFromParent();
            },
            this
        );
        closeItem.setPosition(cc.p(460, 530));

        var menu = cc.Menu.create(okItem, closeItem);
        menu.setPosition(cc.p(0, 0));
        layer.addChild(menu);
    },

    _showWipeOutReward: function (reward) {
        cc.log("PassLayer _showWipeOutReward");

        var layer = LazyLayer.create();
        this.addChild(layer);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 960);
        bgLayer.setPosition(GAME_ZERO);
        layer.addChild(bgLayer);

        var bgSprite = cc.Sprite.create(main_scene_image.bg17);
        bgSprite.setPosition(cc.p(360, 580));
        layer.addChild(bgSprite);

        var obtainSprite = cc.Sprite.create(main_scene_image.icon226);
        obtainSprite.setPosition(cc.p(360, 718));
        layer.addChild(obtainSprite);

        var str = lz.getRewardString(reward);
        var len = str.length;

        var offsetY = 655;
        for (var i = 0; i < len; ++i) {
            var rewardLabel = cc.LabelTTF.create(str[i], "STHeitiTC-Medium", 20);
            rewardLabel.setColor(cc.c3b(255, 239, 131));
            rewardLabel.setAnchorPoint(cc.p(0.5, 1));
            rewardLabel.setPosition(cc.p(360, offsetY));
            layer.addChild(rewardLabel);

            offsetY -= 45;
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
        okItem.setPosition(cc.p(360, 415));

        var menu = cc.Menu.create(okItem);
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

        LazyLayer.showCloudLayer();

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

        LazyLayer.showCloudLayer();

        this._locate(1);

        this._element[1].passItem.setEnabled(false);

        this._spiritWalk(2, 0.5, 50, 1);
        var index = 2;
        this.schedule(function () {
            this._element[index].passItem.setEnabled(false);
            this._element[index].ladderSprite.setColor(cc.c3b(160, 160, 160));

            index += 1;

            if (index > this._top) {
                LazyLayer.closeCloudLayer();
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

            var that = this;
            gameData.pass.defiance(function (battleLogId) {
                that._isWin = BattlePlayer.getInstance().play(battleLogId);
            }, id);
        }
    },

    _onClickWipeOut: function () {
        cc.log("PassLayer _onClickWipeOut");

        var that = this;
        gameData.pass.wipeOut(function (data) {
            cc.log(data);

            that._wipeOutAnimation(data);
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
};