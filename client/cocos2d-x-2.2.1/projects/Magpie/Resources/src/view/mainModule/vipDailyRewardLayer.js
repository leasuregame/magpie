/**
 * Created by lujunyu on 14-5-5.
 */

var VipDailyRewardLayer = cc.Layer.extend({
    _vipDailyRewardLayerFit: null,

    _getRewardItem: null,

    init: function () {
        cc.log("VipDailyRewardLayer init");

        if (!this._super()) return false;

        this._vipDailyRewardLayerFit = gameFit.mainScene.vipDailyRewardLayer;

        var bgLabel = cc.Sprite.create(main_scene_image.bg23);
        bgLabel.setScale(this._vipDailyRewardLayerFit.bgLabelScaleY);
        bgLabel.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bgLabel);

        var titleIcon = cc.Sprite.create(main_scene_image.icon438);
        titleIcon.setAnchorPoint(cc.p(0, 0.5));
        titleIcon.setPosition(this._vipDailyRewardLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var cardIcon = cc.Sprite.create(main_scene_image.card39_full2);
        cardIcon.setPosition(this._vipDailyRewardLayerFit.cardIconPoint);
        this.addChild(cardIcon, 2);

        var tipsIcon = cc.Sprite.create(main_scene_image.icon439);
        tipsIcon.setAnchorPoint(cc.p(0, 0.5));
        tipsIcon.setPosition(this._vipDailyRewardLayerFit.tipsIconPoint);
        this.addChild(tipsIcon, 3);

        var rewardBgLabel = cc.Sprite.create(main_scene_image.icon440);
        rewardBgLabel.setPosition(this._vipDailyRewardLayerFit.rewardBgLabelPoint);
        this.addChild(rewardBgLabel);

        var vip = gameData.player.get("vip");
        var vipIcon = cc.Sprite.create(main_scene_image["vip" + vip]);
        vipIcon.setPosition(cc.p(222, 250));
        vipIcon.setScale(1.2);
        rewardBgLabel.addChild(vipIcon);

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        rewardBgLabel.addChild(menu);

        if (vip < 1) {
            var tipsLabel = cc.Sprite.create(main_scene_image.icon441);
            tipsLabel.setPosition(cc.p(300, 140));
            rewardBgLabel.addChild(tipsLabel);

            var go2PaymentItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button21,
                main_scene_image.button21s,
                main_scene_image.button21d,
                main_scene_image.icon159,
                this._onClickGo2Payment,
                this
            );
            go2PaymentItem.setPosition(cc.p(300, 40));

            menu.addChild(go2PaymentItem);
        } else {
            var rewards = outputTables.vip_daily_reward.rows[vip];
            var x = 88;

            for (var key in rewards) {
                if (key == "id") {
                    continue;
                }

                var goods = giftBagGoods[key];
                var goodsSprite = cc.Sprite.create(main_scene_image[goods.url]);
                goodsSprite.setAnchorPoint(cc.p(0, 0));
                goodsSprite.setPosition(cc.p(x, 100));
                rewardBgLabel.addChild(goodsSprite);

                var goodsLabel = StrokeLabel.create("+" + rewards[key], "STHeitiTC-Medium", 16);
                goodsLabel.setAnchorPoint(cc.p(1, 0));
                goodsLabel.setPosition(cc.p(73, 8));
                goodsLabel.setBgColor(cc.c3b(0, 0, 0));
                goodsSprite.addChild(goodsLabel);

                x += 120;
            }

            this._getRewardItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button10,
                main_scene_image.button10s,
                main_scene_image.button9d,
                main_scene_image.icon123,
                this._onClickGetReward,
                this
            );
            this._getRewardItem.setPosition(cc.p(300, 40));
            this._getRewardItem.setEnabled(gameData.activity.get("vipLoginReward"));

            menu.addChild(this._getRewardItem);
        }

        return true;
    },

    _onClickGo2Payment: function () {
        cc.log("VipDailyRewardLayer _onClickGo2Payment");

        var shopLayer = ShopLayer.create();
        shopLayer._onClickVipLayer();
        MainScene.getInstance().switchTo(shopLayer);
    },

    _onClickGetReward: function () {

        cc.log("VipDailyRewardLayer _onClickGetReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        gameData.activity.getVipDailyReward(function (reward) {
            that._getRewardItem.setEnabled(false);
            lz.tipReward(reward);
        });
    }

});

VipDailyRewardLayer.create = function () {
    cc.log("VipDailyRewardLayer create");

    var ret = new VipDailyRewardLayer();
    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
