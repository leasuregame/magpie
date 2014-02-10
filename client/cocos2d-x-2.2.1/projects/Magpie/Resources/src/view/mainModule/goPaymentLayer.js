/**
 * Created by lcc3536 on 13-12-6.
 */


/*
 * go payment layer
 * */


var GoPaymentLayer = LazyLayer.extend({
    _goPaymentLayerFit: null,

    _cb: null,

    init: function (data) {
        cc.log("GoPaymentLayer init");

        if (!this._super()) return false;

        this._goPaymentLayerFit = gameFit.mainScene.goPaymentLayer;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var title = data.title;
        var msg = data.msg;

        this._cb = data.cb || function () {
            var shopLayer = ShopLayer.create();
            shopLayer.switchLayer(VipLayer);
            MainScene.getInstance().switchTo(shopLayer);
        };

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 250));
        bgSprite.setPosition(this._goPaymentLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var titleLabel = StrokeLabel.create(title, "STHeitiTC-Medium", 28);
        titleLabel.setPosition(this._goPaymentLayerFit.titleLabelPoint);
        this.addChild(titleLabel);

        var tipLabel = cc.LabelTTF.create(msg, "STHeitiTC-Medium", 20);
        tipLabel.setPosition(this._goPaymentLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        var paymentItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button21,
            main_scene_image.button21s,
            main_scene_image.icon159,
            this._onClickGo,
            this
        );
        paymentItem.setPosition(this._goPaymentLayerFit.paymentItemPoint);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            this._onClickCancel,
            this
        );
        closeItem.setPosition(this._goPaymentLayerFit.closeItemPoint);

        var menu = cc.Menu.create(paymentItem, closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickGo: function () {
        cc.log("GoPaymentLayer _onClickGo");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        if (this._cb) {
            this._cb();
        }
    },

    _onClickCancel: function () {
        cc.log("GoPaymentLayer _onClickCancel");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }
});


GoPaymentLayer.create = function (data) {
    var ret = new GoPaymentLayer();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};


GoPaymentLayer.pop = function (data) {
    var goPaymentLayer = GoPaymentLayer.create(data);

    MainScene.getInstance().getLayer().addChild(goPaymentLayer, 10);

    return goPaymentLayer;
};