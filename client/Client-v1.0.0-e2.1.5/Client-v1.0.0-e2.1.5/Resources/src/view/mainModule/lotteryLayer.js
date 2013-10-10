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

        var bgSprite = cc.Sprite.create(main_scene_image.bg19);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(cc.p(40, 0));
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 968));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon241);
        titleIcon.setPosition(cc.p(360, 1008));
        this.addChild(titleIcon);

        var lotteryLabel = cc.Sprite.create(main_scene_image.icon242);
        lotteryLabel.setPosition(cc.p(360, 600));
        this.addChild(lotteryLabel);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setPosition(cc.p(360, 938));
        this.addChild(headLabel);

        var energyIcon = cc.Sprite.create(main_scene_image.icon154);
        energyIcon.setPosition(cc.p(80, 938));
        this.addChild(energyIcon);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(cc.p(220, 938));
        this.addChild(goldIcon);

        var fragmentIcon = cc.Sprite.create(main_scene_image.icon243);
        fragmentIcon.setPosition(cc.p(450, 938));
        this.addChild(fragmentIcon);

        this._energyLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._energyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._energyLabel.setPosition(cc.p(110, 938));
        this.addChild(this._energyLabel);

        this._goldLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(cc.p(250, 938));
        this.addChild(this._goldLabel);

        this._fragmentLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._fragmentLabel.setAnchorPoint(cc.p(0, 0.5));
        this._fragmentLabel.setPosition(cc.p(480, 938));
        this.addChild(this._fragmentLabel);

        var exchangeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button21,
            main_scene_image.button21s,
            main_scene_image.icon244,
            this._onClickExchange,
            this
        );
        exchangeItem.setPosition(cc.p(600, 938));

        var menu = cc.Menu.create(exchangeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        for (var i = 1; i <= 3; ++i) {
            var x = i * 210 - 60;

            var goldLotteryItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                main_scene_image["icon" + (138 + i)],
                this._onClickLottery(LOTTERY_BY_GOLD, i),
                this
            );
            goldLotteryItem.setPosition(cc.p(x, 470));
            menu.addChild(goldLotteryItem);

            var energyLotteryItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                main_scene_image["icon" + (141 + i)],
                this._onClickLottery(LOTTERY_BY_ENERGY, i),
                this
            );
            energyLotteryItem.setPosition(cc.p(x, 550));
            menu.addChild(energyLotteryItem);
        }

        var tipBgSprite = cc.Sprite.create(main_scene_image.icon245);
        tipBgSprite.setPosition(cc.p(360, 220));
        this.addChild(tipBgSprite);

        var tipLabel = cc.LabelTTF.create(
            "祝福好友，每日登录可获得活力值",
            "STHeitiTC-Medium",
            18
        );
        tipLabel.setPosition(cc.p(360, 220));
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

            var that = this;
            gameData.lottery.lottery(function (data) {
                cc.log(data);

                LazyLayer.showCloudLayer();

                that.update();

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
                        }, 2);
                    }
                });
            }, type, level);
        }
    },

    _onClickExchange: function () {
        cc.log("LotteryLayer _onClickExchange");

        MainScene.getInstance().switchLayer(ExchangeLayer);
    }
});


LotteryLayer.create = function () {
    var ret = new LotteryLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};