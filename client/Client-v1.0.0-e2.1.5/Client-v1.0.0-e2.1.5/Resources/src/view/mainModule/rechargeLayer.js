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
        this.update();
    },

    init: function () {
        cc.log("RechargeLayer init");

        if (!this._super()) return false;

        this._rechargeLayerFit = gameFit.mainScene.rechargeLayer;

        return true;
    },

    update: function () {
        cc.log("RechargeLayer update");
        var headIcon = cc.Sprite.create(main_scene_image.icon266);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._rechargeLayerFit.headIconPoint);
        this.addChild(headIcon);

        var midIcon = cc.Sprite.create(main_scene_image.icon267);
        midIcon.setAnchorPoint(cc.p(0, 0));
        midIcon.setPosition(this._rechargeLayerFit.midIconPoint);
        this.addChild(midIcon);

        var itemText = cc.LabelTTF.create('时间：从XX时间---XX时间', "STHeitiTC-Medium", 20);
        itemText.setAnchorPoint(cc.p(0, 0));
        itemText.setPosition(this._rechargeLayerFit.itemTextPoint);
        itemText.setColor(cc.c3b(97, 11, 9));
        this.addChild(itemText);

        var description = lz.format('奖励：任意充值，均可额外获得两倍魔石赠送。你还在犹豫什么呢，赶紧充值吧。', 14);
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
    },

    _onClickGo2Payment: function () {
        MainScene.getInstance().switchLayer(ShopLayer);
    }
});

RechargeLayer.create = function () {
    var ret = new RechargeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};