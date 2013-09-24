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
    _spirit: null,
    _towerSprite: null,
    _topLabel: null,
    _skillPointLabel: null,
    _wipeOutItem: null,
    _resetItem: null,
    _scrollView: null,
    _element: {},

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

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 768));

        var lazyMenu = LazyMenu.create();
        lazyMenu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(lazyMenu);

        for (var i = 1; i <= MAX_PASS_COUNT; ++i) {
            var flag = (i - 1) % 2;

            var passItem = null;
            if (pass.isBossPass(i)) {
                passItem = cc.MenuItemImage.create(
                    main_scene_image["button13"],
                    main_scene_image["button13s"],
                    main_scene_image["button13d"],
                    this._onClickDefiance(i),
                    this
                );
                passItem.setPosition(cc.p(125 + flag * 210, 100 + 185 * (i - 1)));

            } else {
                passItem = cc.MenuItemImage.create(
                    main_scene_image["button14"],
                    main_scene_image["button14s"],
                    main_scene_image["button14d"],
                    this._onClickDefiance(i),
                    this
                );
                passItem.setPosition(cc.p(140 + flag * 180, 100 + 185 * (i - 1)));
            }
            lazyMenu.addChild(passItem);

            if (i > 1) {
                var ladderSprite = cc.Sprite.create(main_scene_image["ladder" + (2 - flag)]);
                ladderSprite.setAnchorPoint(cc.p(0, 0));
                ladderSprite.setPosition(cc.p(138 + 27 * flag, 132 + 185 * (i - 2)));
                scrollViewLayer.addChild(ladderSprite);

                if (i > this._top) {
                    ladderSprite.setVisible(false);
                }
            }

            var passNamePoint = cc.p(250 - 40 * flag, 80 + 185 * (i - 1));

            var passNameBgSprite = cc.Sprite.create(main_scene_image.icon3);
            passNameBgSprite.setPosition(passNamePoint);
            scrollViewLayer.addChild(passNameBgSprite);

            var passNameLabel = cc.LabelTTF.create("第" + i + "关", "STHeitiTC-Medium", 25);
            passNameLabel.setColor(cc.c3b(255, 240, 170));
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

        this._scrollView = cc.ScrollView.create(cc.size(640, 768), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(640, 18620));
        this._scrollView.setPosition(GAME_BG_POINT);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);
        this._locate(this._top);

        var tipLabel = cc.Sprite.create(main_scene_image.bg6);
        tipLabel.setAnchorPoint(cc.p(0, 0));
        tipLabel.setPosition(cc.p(40, 894));
        this.addChild(tipLabel);

        this._topLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._topLabel.setColor(cc.c3b(255, 240, 170));
        this._topLabel.setAnchorPoint(cc.p(0, 0.5));
        this._topLabel.setPosition(cc.p(190, 928));
        this.addChild(this._topLabel);

        this._skillPointLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 20);
        this._skillPointLabel.setColor(cc.c3b(255, 240, 170));
        this._skillPointLabel.setAnchorPoint(cc.p(0, 0.5));
        this._skillPointLabel.setPosition(cc.p(583, 837));
        this.addChild(this._skillPointLabel);

        this._wipeOutItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon15,
            this._onClickWipeOut,
            this
        );
        this._wipeOutItem.setPosition(cc.p(580, 928));

        this._resetItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon223,
            this._onClickReset,
            this
        );
        this._resetItem.setPosition(cc.p(580, 928));

        var menu = cc.Menu.create(this._wipeOutItem, this._resetItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._towerSprite = cc.Sprite.create(main_scene_image.icon225);
        this._towerSprite.setAnchorPoint(cc.p(0, 0));
        this._towerSprite.setPosition(cc.p(524, 226));
        this.addChild(this._towerSprite);

        var towerBgSprite = cc.Sprite.create(main_scene_image.icon224);
        towerBgSprite.setAnchorPoint(cc.p(0, 0));
        towerBgSprite.setPosition(cc.p(510, 220));
        this.addChild(towerBgSprite);

        return true;
    },

    update: function () {
        cc.log("PassLayer update");


        for (var i = 1; i <= MAX_PASS_COUNT; ++i) {
            this._element[i].passItem.setEnabled(gameData.pass.getMarkByIndex(i));
        }

        var top = gameData.pass.getTop();

        if (top != this._top) {
            this._top = top;

            this._locate(this._top);

            this._defianceAnimation();
        }

        this._skillPointLabel.setString(gameData.player.get("skillPoint"));
        this._topLabel.setString(this._top);

        var height = this._top / MAX_PASS_COUNT * 211;
        this._towerSprite.setTextureRect(cc.rect(0, 211 - height, 104, height));
    },

    _getOffset: function (index) {
        cc.log("PassLayer _getOffset");

        var height = 140 - 185 * (index - 1);

        height = height < 0 ? height : 0;
        height = height > -17870 ? height : -17870;

        return cc.p(0, height);
    },

    _locate: function (index, duration) {
        cc.log("PassLayer _locate");

        var offsetPoint = this._getOffset(index);

        if (duration) {
            this._scrollView.setContentOffsetInDuration(offsetPoint, duration);
        } else {
            this._scrollView.setContentOffset(offsetPoint);
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

    _spiritWalk: function (index, duration) {
        cc.log("PassLayer _spiritWalk");

        duration = duration || 2;

        this._spirit.setPosition(this._getCardLocation(index - 1));
        var jumpAction = cc.JumpTo.create(duration, this._getCardLocation(index), 25, 5);
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

    _defianceAnimation: function () {
        cc.log("PassLayer _defianceAnimation");

        LazyLayer.showCloudLayer();

        if (this._top >= MAX_PASS_COUNT) {
            LazyLayer.closeCloudLayer();
            return;
        }

        this._showLadder(this._top);

        this.scheduleOnce(function () {
            this._spiritWalk(this._top);
        }, 2.5);

        this.scheduleOnce(function () {
            LazyLayer.closeCloudLayer();
        }, 4.5);
    },

    _wipeOutAnimation: function () {
        cc.log("PassLayer _wipeOutAnimation");

        LazyLayer.showCloudLayer();

        this._locate(1);

        this._spiritWalk(1, 0.3);
        var index = 2;
        this.schedule(function () {
            if (index > this._top) {
                LazyLayer.closeCloudLayer();
                return;
            }

            this._spiritWalk(index, 0.3);
            index += 1;
        }, 0.4, this._top);
    },

    _onClickDefiance: function (id) {
        return function () {
            cc.log("PassLayer _onClickDefiance: " + id);

            var pass = gameData.pass;

            if (pass.canDefiance(id)) {
                TipLayer.tip("请先挑战前面关卡");

                return;
            }

            var that = this;
            pass.defiance(function (battleLogId) {
                var isWin = BattlePlayer.getInstance().play(battleLogId);

                if (isWin) {
                    that._spirit.passWinSpeak();
                } else {
                    that._spirit.passFailSpeak();
                }
            }, id);
        }
    },

    _onClickWipeOut: function () {
        cc.log("PassLayer _onClickWipeOut");

        this._wipeOutAnimation();
        gameData.pass.wipeOut(function (data) {
            cc.log(data);
        });
    },

    _onClickMystical: function () {
        cc.log("PassLayer _onClickMystical");

        var that = this;
    },

    _onClickReset: function () {
        cc.log("PassLayer _onClickReset");

        var that = this;

    }
});

PassLayer.create = function () {
    var ret = new PassLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};