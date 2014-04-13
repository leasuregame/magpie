/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-29
 * Time: 下午4:04
 * To change this template use File | Settings | File Templates.
 */


var RechargeLayer = cc.Layer.extend({
    _rechargeLayerFit: null,

    onEnter: function () {
        cc.log("RechargeLayer onEnter");

        this._super();

        lz.um.beginLogPageView("充值优惠界面");
    },

    onExit: function () {
        cc.log("RechargeLayer onExit");

        this._super();

        lz.um.endLogPageView("充值优惠界面");
    },

    init: function () {
        cc.log("RechargeLayer init");

        if (!this._super()) return false;

        this._rechargeLayerFit = gameFit.mainScene.rechargeLayer;

        var headIcon = cc.Sprite.create(main_scene_image.icon266);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._rechargeLayerFit.headIconPoint);
        this.addChild(headIcon);

        var midIcon = cc.Sprite.create(main_scene_image.icon267);
        midIcon.setAnchorPoint(cc.p(0, 0));
        midIcon.setPosition(this._rechargeLayerFit.midIconPoint);
        this.addChild(midIcon);

        var itemText = cc.LabelTTF.create("首次充值，3倍返利。", "STHeitiTC-Medium", 20);
        itemText.setAnchorPoint(cc.p(0, 0));
        itemText.setPosition(this._rechargeLayerFit.itemTextPoint);
        itemText.setColor(cc.c3b(97, 11, 9));
        this.addChild(itemText);

        var description = lz.format("首次任意金额的充值，你都将获得3倍的魔石。不是2倍，更不是1倍，是3倍。送啥都不如送这玩意来的更直接，更实在。", 14);
        for (var i = 0; i < description.length; i++) {
            var text = cc.LabelTTF.create(description[i], "STHeitiTC-Medium", 20);
            text.setAnchorPoint(cc.p(0, 0));
            text.setPosition(cc.p(this._rechargeLayerFit.textBasePoint.x, this._rechargeLayerFit.textBasePoint.y - i * this._rechargeLayerFit.textOffsetY));
            text.setColor(cc.c3b(97, 11, 9));
            this.addChild(text);
        }

        var go2PaymentItem = cc.MenuItemImage.create(
            main_scene_image.button21,
            main_scene_image.button21s,
            this._onClickGo2Payment,
            this
        );
        go2PaymentItem.setScaleX(1.5);
        go2PaymentItem.setScaleY(1.3);
        go2PaymentItem.setPosition(this._rechargeLayerFit.go2PaymentItemPoint);

        var menu = cc.Menu.create(go2PaymentItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var btnTitle = cc.Sprite.create(main_scene_image.icon268);
        btnTitle.setPosition(this._rechargeLayerFit.btnTitlePoint);
        this.addChild(btnTitle);

        return true;
    },

    _onClickGo2Payment: function () {
        cc.log("RechargeLayer _onClickGo2Payment");

        //gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        var shopLayer = ShopLayer.create();
        shopLayer._onClickVipLayer();
        MainScene.getInstance().switchTo(shopLayer);
    }
});

RechargeLayer.create = function () {
    var ret = new RechargeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};