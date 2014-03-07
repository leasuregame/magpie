/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-12
 * Time: 下午3:36
 * To change this template use File | Settings | File Templates.
 */


var CardListFullTipLayer = LazyLayer.extend({
    _cardListFullTipLayerFit: null,

    onEnter: function () {
        cc.log("CardListFullTipLayer onEnter");

        this._super();

        lz.um.beginLogPageView("卡库满提示界面");
    },

    onExit: function () {
        cc.log("CardListFullTipLayer onExit");

        this._super();

        lz.um.endLogPageView("卡库满提示界面");
    },

    init: function () {
        cc.log("CardListFullTipLayer init");

        if (!this._super()) return false;

        this._cardListFullTipLayerFit = gameFit.mainScene.cardListFullTipLayer;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 300));
        bgSprite.setPosition(this._cardListFullTipLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var tipTitleLabel = cc.LabelTTF.create("温馨提示", "STHeitiTC-Medium", 30);
        tipTitleLabel.setPosition(this._cardListFullTipLayerFit.tipTitleLabelPoint);
        this.addChild(tipTitleLabel);

        var tipLabel = cc.LabelTTF.create("卡牌数量已达上限，可以选择以下操作", "STHeitiTC-Medium", 25);
        tipLabel.setPosition(this._cardListFullTipLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        var go2StrengthenItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon132,
            this._onClickGo2Strengthen,
            this
        );
        go2StrengthenItem.setPosition(this._cardListFullTipLayerFit.go2StrengthenItemPoint);

        var go2SellItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon22,
            this._onClickGo2Sell,
            this
        );
        go2SellItem.setPosition(this._cardListFullTipLayerFit.go2SellPoint);

        var go2BuyItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon307,
            this._onClickGo2Buy,
            this
        );
        go2BuyItem.setPosition(this._cardListFullTipLayerFit.go2BuyPoint);

        var cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon308,
            this._onClickCancel,
            this
        );
        cancelItem.setPosition(this._cardListFullTipLayerFit.cancelItemPoint);

        var menu = cc.Menu.create(go2StrengthenItem, go2SellItem, go2BuyItem, cancelItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;

    },

    _onClickGo2Strengthen: function () {
        cc.log("CardListFullTipLayer _onClickGo2Strengthen");
        this.removeFromParent();
        MainScene.getInstance().switchLayer(StrengthenLayer);

    },

    _onClickGo2Sell: function () {
        cc.log("CardListFullTipLayer _onGo2Sell");
        this.removeFromParent();
        MainScene.getInstance().switchTo(CardListLayer.create(SELECT_TYPE_SELL));
    },

    _onClickGo2Buy: function () {
        cc.log("CardListFullTipLayer _onClickGo2Buy");
        this.removeFromParent();

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var id = 7;
        var product = gameData.shop.getProduct(id);

        cc.log(product);

        if (product.count <= 0) {
            TipLayer.tip(product.tip);
            return;
        }

        var that = this;
        AmountLayer.pop(
            function (count) {
                that._buyCount(id, count);
            },
            product
        );
    },

    _onClickCancel: function () {
        cc.log("CardListFullTipLayer _onClickCancel");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.removeFromParent();
    },

    _buyCount: function (id, count) {
        cc.log("CardListFullTipLayer _buyCount");

        if (count > 0) {
            var that = this;
            gameData.shop.buyProduct(function (data) {
                lz.tipReward(data);
            }, id, count);
        }
    }
});

CardListFullTipLayer.create = function () {
    var ret = new CardListFullTipLayer();

    if (ret && ret.init()) {
        return ret;
    }
    return null;
};

CardListFullTipLayer.pop = function () {
    var cardListFullTipLayer = CardListFullTipLayer.create();

    MainScene.getInstance().getLayer().addChild(cardListFullTipLayer, 10);
};
