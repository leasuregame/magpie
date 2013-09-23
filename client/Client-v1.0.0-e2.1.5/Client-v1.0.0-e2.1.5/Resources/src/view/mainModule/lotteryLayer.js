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
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        this._goldLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(cc.p(470, 934));
        this.addChild(this._goldLabel);

        this._energyLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._energyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._energyLabel.setPosition(cc.p(580, 934));
        this.addChild(this._energyLabel);

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        for (var i = 1; i <= 3; ++i) {
            var x = i * 210 - 60;

            var goldLotteryItem = cc.MenuItemImage.create(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                this._onClickLottery(LOTTERY_BY_GOLD, i),
                this
            );
            goldLotteryItem.setPosition(cc.p(x, 340));
            menu.addChild(goldLotteryItem);

            var energyLotteryItem = cc.MenuItemImage.create(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                this._onClickLottery(LOTTERY_BY_ENERGY, i),
                this
            );
            energyLotteryItem.setPosition(cc.p(x, 450));
            menu.addChild(energyLotteryItem);

            var goldLotteryIcon = cc.Sprite.create(main_scene_image["icon" + (138 + i)]);
            goldLotteryIcon.setPosition(cc.p(x, 340));
            this.addChild(goldLotteryIcon);

            var energyLotteryIcon = cc.Sprite.create(main_scene_image["icon" + (141 + i)]);
            energyLotteryIcon.setPosition(cc.p(x, 450));
            this.addChild(energyLotteryIcon);
        }

        return true;
    },

    update: function () {
        cc.log("LotteryLayer update");

        var player = gameData.player;

        this._goldLabel.setString(player.get("gold"));
        this._energyLabel.setString(player.get("energy"));
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

                var effectSprite = playEffect({
                    effectId: 3,
                    target: blackLayer,
                    delay: 0.16,
                    loops: 1,
                    cb: function () {
                        var cardFullNode = CardFullNode.create(data);
                        cardFullNode.setPosition(effectSprite.getPosition());
                        blackLayer.addChild(cardFullNode);

                        that.scheduleOnce(function () {
                            blackLayer.removeFromParent();
                            LazyLayer.closeCloudLayer();
                        }, 2);
                    }
                });
            }, type, level);
        }
    }
});


LotteryLayer.create = function () {
    var ret = new LotteryLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};