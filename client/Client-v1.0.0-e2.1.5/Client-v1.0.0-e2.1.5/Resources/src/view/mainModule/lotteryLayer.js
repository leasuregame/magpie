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

    _goldLotteryIcon: [],
    _goldLotteryLabel: [],

    onEnter: function () {
        cc.log("LotteryLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("LotteryLayer init");

        if (!this._super())  return false;

        this._lotteryLayerFit = gameFit.mainScene.lotteryLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg19);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._lotteryLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._lotteryLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon241);
        titleIcon.setPosition(this._lotteryLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._lotteryLayerFit.backItemPoint);

        this._lotteryLabel = cc.BuilderReader.load(main_scene_image.uiEffect6, this);
        this._lotteryLabel.setPosition(this._lotteryLayerFit.lotteryLabelPoint);
        this.addChild(this._lotteryLabel);

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

        var exchangeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button21,
            main_scene_image.button21s,
            main_scene_image.icon244,
            this._onClickExchange,
            this
        );
        exchangeItem.setPosition(this._lotteryLayerFit.exchangeItemPoint);

        var menu = cc.Menu.create(backItem, exchangeItem);
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

            this._goldLotteryLabel[i] = StrokeLabel.create("首抽免费", "STHeitiTC-Medium", 25);
            this._goldLotteryLabel[i].setPosition(cc.p(75, 35));
            this._goldLotteryLabel[i].setColor(cc.c3b(255, 239, 131));
            goldLotteryItem.addChild(this._goldLotteryLabel[i]);

            var player = gameData.player;
            var isVisible = sys.localStorage.getItem(player.get("userId") + "*" + player.get("areaId") + "firstLottery" + i) || true;

            cc.log(isVisible);
            this._goldLotteryLabel[i].setVisible(isVisible);
            this._goldLotteryIcon[i].setVisible(!isVisible);

            menu.addChild(goldLotteryItem);

            x = this._lotteryLayerFit.energyLotteryItemBasePoint.x + 330 * i;
            y = this._lotteryLayerFit.energyLotteryItemBasePoint.y;

            var energyLotteryItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                main_scene_image["icon" + (141 + i)],
                this._onClickLottery(LOTTERY_BY_ENERGY, i + 1),
                this
            );
            energyLotteryItem.setPosition(cc.p(x, y));
            menu.addChild(energyLotteryItem);
        }

        var tipBgSprite = cc.Sprite.create(main_scene_image.icon245);
        tipBgSprite.setPosition(this._lotteryLayerFit.tipBgSpritePoint);
        tipBgSprite.setScaleY(1.1);
        this.addChild(tipBgSprite);

        var tipLabel = cc.LabelTTF.create(
            "祝福好友，每日登录可获得活力值",
            "STHeitiTC-Medium",
            20
        );
        tipLabel.setPosition(this._lotteryLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        return true;
    },

    update: function () {
        cc.log("LotteryLayer update");

        var player = gameData.player;

        this._goldLabel.setString(player.get("gold"));
        this._energyLabel.setString(player.get("energy"));
        this._fragmentLabel.setString(player.get("fragment"));
    },

    showCard: function () {
        cc.log("LotteryLayer showCard");

        this.update();

        LotteryCardLayer.pop(this._data);

        LazyLayer.closeCloudLayer();
    },

    _onClickLottery: function (type, level) {
        return function () {
            cc.log("LotteryLayer _onClickLottery");

            var lottery = gameData.lottery;

            if (!lottery.canLottery(type, level)) {
                return;
            }

            if (noviceTeachingLayer.isNoviceTeaching()) {
                noviceTeachingLayer.clearAndSave();
                noviceTeachingLayer.setVisible(false);
            }

            LazyLayer.showCloudLayer();

            var that = this;
            lottery.lottery(function (data) {
                cc.log(data);

                that.update();

                if (data) {
                    that._data = data;

                    var highDoorPosition = that._lotteryLabel.controller.highDoor.getPosition();
                    var lowDoorPosition = that._lotteryLabel.controller.lowDoor.getPosition();

                    that._lotteryLabel.animationManager.runAnimationsForSequenceNamedTweenDuration(
                        "animation_2_" + level,
                        0
                    );

                    that._lotteryLabel.controller.highDoor.setPosition(highDoorPosition);
                    that._lotteryLabel.controller.lowDoor.setPosition(lowDoorPosition);
                } else {
                    LazyLayer.closeCloudLayer();
                }
            }, type, level);

            if (type == LOTTERY_BY_GOLD) {
                var player = gameData.player;
                var isFirstLottery = sys.localStorage.getItem(player.get("userId") + "*" + player.get("areaId") + "firstLottery" + (level - 1)) || true;
                cc.log(isFirstLottery);
                if (isFirstLottery == true) {
                    sys.localStorage.setItem(player.get("userId") + "*" + player.get("areaId") + "firstLottery" + (level - 1), false);
                    this._goldLotteryIcon[level - 1].setVisible(true);
                    this._goldLotteryLabel[level - 1].setVisible(false);
                }
            }

        }
    },

    _onClickExchange: function () {
        cc.log("LotteryLayer _onClickExchange");

        MainScene.getInstance().switchLayer(ExchangeLayer);
    },

    _onClickBack: function () {
        cc.log("LotteryLayer _onClickBack");

        MainScene.getInstance().switchLayer(MainLayer);
    }
});


LotteryLayer.create = function () {
    var ret = new LotteryLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};