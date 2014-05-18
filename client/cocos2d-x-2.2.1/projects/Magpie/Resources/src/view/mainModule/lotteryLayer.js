/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 下午10:30
 * To change this template use File | Settings | File Templates.
 */


/*
 * lottery layer
 * */


var LotteryLayer = cc.Layer.extend({
    _lotteryLayerFit: null,

    _data: null,
    _goldLabel: null,
    _energyLabel: null,
    _lotteryLabel: null,
    _times: 1,
    _goldLotteryIcon: [],
    _goldTenLotteryIcon: [],
    _goldLotteryLabel: [],
    _energyLotteryIcon: [],
    _energyTenLotteryIcon: [],
    _openTenLotteryItem: null,
    _closeTenLotteryItem: null,
    _privilegeIcon: null,
    _tenLotteryTip: null,
    _tenLotteryTip2: null,

    onEnter: function () {
        cc.log("LotteryLayer onEnter");

        this._super();
        this.update();
        this._updateTips();

        lz.um.beginLogPageView("抽卡界面");
    },

    onExit: function () {
        cc.log("LotteryLayer onExit");

        this._super();

        lz.um.endLogPageView("抽卡界面");
    },

    init: function () {
        cc.log("LotteryLayer init");

        if (!this._super())  return false;

        this._lotteryLayerFit = gameFit.mainScene.lotteryLayer;

        this.times = 1;

        var bgSprite = cc.Sprite.create(main_scene_image.bg19);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._lotteryLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var fragmentTipLayer = StrokeLabel.create("高级十连抽必得卡魂", "STHeitiTC-Medium", 20);
        fragmentTipLayer.setPosition(this._lotteryLayerFit.fragmentTipLayerPoint);
        this.addChild(fragmentTipLayer);

        var fragmentTipIcon = cc.Sprite.create(main_scene_image.icon243);
        fragmentTipIcon.setPosition(this._lotteryLayerFit.fragmentTipIconPoint);
        fragmentTipIcon.setScale(0.8);
        this.addChild(fragmentTipIcon);

        this._lotteryLabel = cc.BuilderReader.load(main_scene_image.uiEffect6, this);
        this._lotteryLabel.setPosition(this._lotteryLayerFit.lotteryLabelPoint);
        this.addChild(this._lotteryLabel);

        this._tenLotteryTip = this._lotteryLabel.controller.ccbTenLotteryTip;
        this._tenLotteryTip.setVisible(false);
        this._tenLotteryTip2 = this._lotteryLabel.controller.ccbTenLotteryTip2;

        var lotteryDescLabel1 = cc.Sprite.create(main_scene_image.icon113);
        lotteryDescLabel1.setPosition(this._lotteryLayerFit.lotteryDescLabel1Point);
        this.addChild(lotteryDescLabel1);

        var lotteryDescLabel2 = cc.Sprite.create(main_scene_image.icon114);
        lotteryDescLabel2.setPosition(this._lotteryLayerFit.lotteryDescLabel2Point);
        this.addChild(lotteryDescLabel2);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setPosition(this._lotteryLayerFit.headLabelPoint);
        this.addChild(headLabel);

        var energyIcon = cc.Sprite.create(main_scene_image.icon154);
        energyIcon.setPosition(this._lotteryLayerFit.energyIconPoint);
        this.addChild(energyIcon);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(this._lotteryLayerFit.goldIconPoint);
        this.addChild(goldIcon);

        var fragmentIcon = cc.Sprite.create(main_scene_image.icon243);
        fragmentIcon.setPosition(this._lotteryLayerFit.fragmentIconPoint);
        this.addChild(fragmentIcon);

        this._energyLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._energyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._energyLabel.setPosition(this._lotteryLayerFit.energyLabelPoint);
        this.addChild(this._energyLabel);

        this._goldLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(this._lotteryLayerFit.goldLabelPoint);
        this.addChild(this._goldLabel);

        this._fragmentLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._fragmentLabel.setAnchorPoint(cc.p(0, 0.5));
        this._fragmentLabel.setPosition(this._lotteryLayerFit.fragmentLabelPoint);
        this.addChild(this._fragmentLabel);

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        for (var i = 0; i < 2; ++i) {
            var x = this._lotteryLayerFit.goldLotteryItemBasePoint.x + 330 * i;
            var y = this._lotteryLayerFit.goldLotteryItemBasePoint.y;

            var goldLotteryItem = cc.MenuItemImage.create(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                this._onClickLottery(LOTTERY_BY_GOLD, i + 1),
                this
            );
            goldLotteryItem.setPosition(cc.p(x, y));

            this._goldLotteryIcon[i] = cc.Sprite.create(main_scene_image["icon" + (139 + i)]);
            this._goldLotteryIcon[i].setPosition(cc.p(75, 35));
            goldLotteryItem.addChild(this._goldLotteryIcon[i]);

            this._goldTenLotteryIcon[i] = cc.Sprite.create(main_scene_image["icon" + (312 + i)]);
            this._goldTenLotteryIcon[i].setPosition(cc.p(75, 35));
            goldLotteryItem.addChild(this._goldTenLotteryIcon[i]);

            this._goldLotteryLabel[i] = StrokeLabel.create("首抽免费", "STHeitiTC-Medium", 25);
            this._goldLotteryLabel[i].setPosition(cc.p(75, 35));
            this._goldLotteryLabel[i].setColor(cc.c3b(255, 239, 131));
            goldLotteryItem.addChild(this._goldLotteryLabel[i]);

            menu.addChild(goldLotteryItem);

            x = this._lotteryLayerFit.energyLotteryItemBasePoint.x + 330 * i;
            y = this._lotteryLayerFit.energyLotteryItemBasePoint.y;

            var energyLotteryItem = cc.MenuItemImage.create(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                this._onClickLottery(LOTTERY_BY_ENERGY, i + 1),
                this
            );
            energyLotteryItem.setPosition(cc.p(x, y));

            this._energyLotteryIcon[i] = cc.Sprite.create(main_scene_image["icon" + (141 + i)]);
            this._energyLotteryIcon[i].setPosition(cc.p(75, 35));
            energyLotteryItem.addChild(this._energyLotteryIcon[i]);

            this._energyTenLotteryIcon[i] = cc.Sprite.create(main_scene_image["icon" + (314 + i)]);
            this._energyTenLotteryIcon[i].setPosition(cc.p(75, 35));
            energyLotteryItem.addChild(this._energyTenLotteryIcon[i]);

            menu.addChild(energyLotteryItem);
        }

        this._openTenLotteryItem = cc.MenuItemImage.create(
            main_scene_image.button69,
            main_scene_image.button69s,
            this._onClickOpenTenLottery,
            this
        );
        this._openTenLotteryItem.setPosition(this._lotteryLayerFit.tenLotteryItemPoint);
        menu.addChild(this._openTenLotteryItem);

        this._closeTenLotteryItem = cc.MenuItemImage.create(
            main_scene_image.button70,
            main_scene_image.button70s,
            this._onClickCloseTenLottery,
            this
        );
        this._closeTenLotteryItem.setPosition(this._lotteryLayerFit.tenLotteryItemPoint);
        menu.addChild(this._closeTenLotteryItem);

        var openTenLotteryEffect = cc.BuilderReader.load(main_scene_image.uiEffect76, this);
        openTenLotteryEffect.setPosition(cc.p(74, 74));
        this._openTenLotteryItem.addChild(openTenLotteryEffect);

        var closeTenLotteryEffect = cc.BuilderReader.load(main_scene_image.uiEffect78, this);
        closeTenLotteryEffect.setPosition(cc.p(74, 74));
        this._closeTenLotteryItem.addChild(closeTenLotteryEffect);

        this._privilegeIcon = cc.Sprite.create(main_scene_image.icon319);
        this._privilegeIcon.setPosition(this._lotteryLayerFit.privilegeIconPoint);
        this.addChild(this._privilegeIcon);

        var tipBgSprite = cc.Sprite.create(main_scene_image.icon245);
        tipBgSprite.setPosition(this._lotteryLayerFit.tipBgSpritePoint);
        tipBgSprite.setScaleY(1.1);
        this.addChild(tipBgSprite);

        var tipLabel = cc.LabelTTF.create(
            "祝福好友，每日登录可获得活力点",
            "STHeitiTC-Medium",
            20
        );
        tipLabel.setPosition(this._lotteryLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        this._tipsLabel = ColorLabelTTF.create();
        this._tipsLabel.setPosition(this._lotteryLayerFit.tipsLabelPoint);
        this.addChild(this._tipsLabel, 2);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );

        helpItem.setPosition(this._lotteryLayerFit.helpItemPoint);
        menu.addChild(helpItem);

        return true;
    },

    update: function () {
        cc.log("LotteryLayer update");

        var player = gameData.player;

        this._goldLabel.setString(player.get("gold"));
        this._energyLabel.setString(player.get("energy"));
        this._fragmentLabel.setString(player.get("fragment"));

        this._energyLotteryIcon[0].setVisible(this._times == 1);
        this._energyLotteryIcon[1].setVisible(this._times == 1);

        this._energyTenLotteryIcon[0].setVisible(this._times == 10);
        this._energyTenLotteryIcon[1].setVisible(this._times == 10);

        var isVisible = true;

        var isFirstLottery = gameData.lottery.get("freeLowLotteryCard");
        if (isFirstLottery) {
            isVisible = false;
            this._goldLotteryIcon[0].setVisible(false);
            this._goldTenLotteryIcon[0].setVisible(false);
        } else {
            this._goldLotteryIcon[0].setVisible(this._times == 1);
            this._goldTenLotteryIcon[0].setVisible(this._times == 10);
        }

        this._goldLotteryLabel[0].setVisible(isFirstLottery);

        isFirstLottery = gameData.lottery.get("freeHighLotteryCard");
        if (isFirstLottery) {
            isVisible = false;
            this._goldLotteryIcon[1].setVisible(false);
            this._goldTenLotteryIcon[1].setVisible(false);
        } else {
            this._goldLotteryIcon[1].setVisible(this._times == 1);
            this._goldTenLotteryIcon[1].setVisible(this._times == 10);
        }

        this._goldLotteryLabel[1].setVisible(isFirstLottery);

        if (!isVisible) {
            this._openTenLotteryItem.setVisible(false);
            this._closeTenLotteryItem.setVisible(false);
            this._privilegeIcon.setVisible(false);
        } else {
            this._openTenLotteryItem.setVisible(this._times == 1);
            this._closeTenLotteryItem.setVisible(this._times == 10);
            this._privilegeIcon.setVisible(true);
        }
    },

    _updateTips: function () {
        cc.log("LotteryLayer _update");

        var lottery = gameData.lottery;
        var rate;

        this._tipsLabel.setVisible(false);

        if (this._times == 1) {
            rate = lottery.getFragmentRate();
            if (rate > 0) {
                this._tipsLabel.setLabel(
                    {
                        string: rate + "%",
                        fontName: "STHeitiTC-Medium",
                        fontSize: 22,
                        color: cc.c3b(117, 255, 57),
                        offset: cc.p(0, -2)
                    },
                    {
                        string: "得",
                        fontName: "STHeitiTC-Medium",
                        fontSize: 22
                    },
                    {
                        iconName: "fragment",
                        scale: 0.7,
                        spacing: -2
                    }
                );
                this._tipsLabel.setVisible(true);
            }
        } else {
            rate = lottery.getFiveStarCardRate();
            if (rate > 0) {
                this._tipsLabel.setLabel(
                    {
                        string: rate + "%",
                        fontName: "STHeitiTC-Medium",
                        fontSize: 22,
                        color: cc.c3b(117, 255, 57),
                        offset: cc.p(0, -2)
                    },
                    {
                        string: "得",
                        fontName: "STHeitiTC-Medium",
                        fontSize: 22
                    },
                    {
                        string: "5",
                        fontName: "STHeitiTC-Medium",
                        fontSize: 22,
                        offset: cc.p(0, -2)
                    },
                    {
                        iconName: "star",
                        spacing: -8
                    }
                );
                this._tipsLabel.setVisible(true);
            }
        }
    },

    ccbFnShowCard: function () {
        cc.log("LotteryLayer ccbFnShowCard");

        this.update();

        if (noviceTeachingLayer.isNoviceTeaching()) {
            noviceTeachingLayer.setVisible(false);
        }
        if (this._times == 1) {
            LotteryCardLayer.pop(this._data);
        } else if (this._times == 10) {
            TenLotteryCardLayer.pop(this._data);
        }

        LazyLayer.closeCloudLayer();
    },

    _onClickOpenTenLottery: function () {
        cc.log("LotteryLayer _onClickOpenTenLottery");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._closeTenLotteryItem.setVisible(true);
        this._openTenLotteryItem.setVisible(false);
        for (var i = 0; i < 2; i++) {
            this._goldLotteryIcon[i].setVisible(false);
            this._goldTenLotteryIcon[i].setVisible(true);
            this._energyLotteryIcon[i].setVisible(false);
            this._energyTenLotteryIcon[i].setVisible(true);
        }
        this._times = 10;
        this._updateTips();
    },

    _onClickCloseTenLottery: function () {
        cc.log("LotteryLayer _onClickCloseTenLottery");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._closeTenLotteryItem.setVisible(false);
        this._openTenLotteryItem.setVisible(true);
        for (var i = 0; i < 2; i++) {
            this._goldLotteryIcon[i].setVisible(true);
            this._goldTenLotteryIcon[i].setVisible(false);
            this._energyLotteryIcon[i].setVisible(true);
            this._energyTenLotteryIcon[i].setVisible(false);
        }
        this._times = 1;
        this._updateTips();
    },

    _onClickLottery: function (type, level) {
        return function () {
            cc.log("LotteryLayer _onClickLottery");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            if (gameData.cardList.isFull()) {
                CardListFullTipLayer.pop();
                return;
            }

            var lottery = gameData.lottery;

            if (!lottery.canLottery(type, level, this._times)) {
                return;
            }

            if (noviceTeachingLayer.isNoviceTeaching()) {
                noviceTeachingLayer.clearAndSave();
            }

            LazyLayer.showCloudLayer();

            var that = this;

            var fn = function (data) {
                if (data) {
                    that._data = data;

                    var highDoorPosition = that._lotteryLabel.controller.ccbHighDoor.getPosition();
                    var lowDoorPosition = that._lotteryLabel.controller.ccbLowDoor.getPosition();

                    that._lotteryLabel.animationManager.runAnimationsForSequenceNamedTweenDuration(
                        "animation_2_" + level,
                        0
                    );

                    that._lotteryLabel.controller.ccbHighDoor.setPosition(highDoorPosition);
                    that._lotteryLabel.controller.ccbLowDoor.setPosition(lowDoorPosition);
                } else {
                    LazyLayer.closeCloudLayer();
                }
            };

            if (this._times == 1) {
                lottery.lottery(function (data) {
                    cc.log(data);

                    that.update();
                    that._updateTips();
                    fn(data);

                }, type, level);
            } else if (this._times == 10) {
                lottery.tenLottery(function (data) {
                    cc.log(data);

                    that.update();
                    that._updateTips();
                    fn(data);

                }, type, level);
            }
        }
    },

    _onClickExchange: function () {
        cc.log("LotteryLayer _onClickExchange");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (gameData.cardList.isFull()) {
            CardListFullTipLayer.pop();
            return;
        }

        MainScene.getInstance().switchLayer(ExchangeLayer);
    },

    _onClickBack: function () {
        cc.log("LotteryLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(MainLayer);
    },

    _onClickHelp: function () {
        cc.log("LotteryLayer _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        GameHelpLabel.pop(gameHelp["lottery"]);
    }
});


LotteryLayer.create = function () {
    var ret = new LotteryLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};