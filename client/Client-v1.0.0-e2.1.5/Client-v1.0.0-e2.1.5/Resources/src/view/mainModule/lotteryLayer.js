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

    _goldLabel: null,
    _energyLabel: null,

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
        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var lotteryLabel = cc.Sprite.create(main_scene_image.icon242);
        lotteryLabel.setPosition(this._lotteryLayerFit.lotteryLabelPoint);
        this.addChild(lotteryLabel);

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

        var menu = cc.Menu.create(exchangeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        for (var i = 0; i < 2; ++i) {
            var x = this._lotteryLayerFit.goldLotteryItemBasePoint.x + 254 * i;
            var y = this._lotteryLayerFit.goldLotteryItemBasePoint.y;

            var goldLotteryItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                main_scene_image["icon" + (139 + i)],
                this._onClickLottery(LOTTERY_BY_GOLD, i + 1),
                this
            );
            goldLotteryItem.setPosition(cc.p(x, y));
            menu.addChild(goldLotteryItem);

            x = this._lotteryLayerFit.energyLotteryItemBasePoint.x + 254 * i;
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

    _onClickLottery: function (type, level) {
        return function () {
            cc.log("LotteryLayer _onClickLottery");

            var lottery = gameData.lottery;

            if (!lottery.canLottery(type, level)) {
                return;
            }

            if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
                NoviceTeachingLayer.getInstance().clearAndSave();
            }

            LazyLayer.showCloudLayer();

            var that = this;
            gameData.lottery.lottery(function (data) {
                cc.log(data);

                that.update();

                if (data) {
                    var blackLayer = cc.LayerColor.create(cc.c4b(0, 0, 0, 255), 720, 1136);
                    that.addChild(blackLayer);

                    var ret = playEffect({
                        effectId: 3,
                        target: blackLayer,
                        delay: 0.16,
                        loops: 1,
                        cb: function () {
                            var cardFullNode = CardFullNode.create(data);
                            cardFullNode.setPosition(ret.sprite.getPosition());
                            blackLayer.addChild(cardFullNode);

                            that.scheduleOnce(function () {
                                blackLayer.removeFromParent();
                                LazyLayer.closeCloudLayer();

                                if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
                                    NoviceTeachingLayer.getInstance().next();
                                }
                            }, 2);
                        }
                    });
                } else {
                    LazyLayer.closeCloudLayer();
                }
            }, type, level);
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