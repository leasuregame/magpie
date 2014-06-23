/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-4
 * Time: 上午10:02
 * To change this template use File | Settings | File Templates.
 */


/*
 * props layer
 * */

var productUrl = ["icon284", "icon374", "icon278", "icon279", "icon280"];

var PropsLayer = cc.Layer.extend({
    _propsLayerFit: null,

    _goldLabel: null,
    _moneyLabel: null,

    onEnter: function () {
        cc.log("PropsLayer onEnter");

        this._super();
        this.update();

        this.schedule(this.update, 1);

        lz.um.beginLogPageView("道具界面");
    },

    onExit: function () {
        cc.log("PropsLayer onExit");

        this._super();

        lz.um.endLogPageView("道具界面");
    },

    init: function () {
        cc.log("PropsLayer init");

        this._propsLayerFit = gameFit.mainScene.propsLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._propsLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setAnchorPoint(cc.p(0, 0));
        headLabel.setPosition(this._propsLayerFit.headLabelPoint);
        this.addChild(headLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(this._propsLayerFit.goldIconPoint);
        this.addChild(goldIcon);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(this._propsLayerFit.moneyIconPoint);
        this.addChild(moneyIcon);

        this._goldLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(this._propsLayerFit.goldLabelPoint);
        this.addChild(this._goldLabel);

        this._moneyLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(this._propsLayerFit.moneyLabelPoint);
        this.addChild(this._moneyLabel);

        var paymentItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button38,
            main_scene_image.button38s,
            main_scene_image.icon159,
            this._onClickPayment,
            this
        );
        paymentItem.setPosition(this._propsLayerFit.paymentItemPoint);

        var menu = cc.Menu.create(paymentItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var effect = cc.BuilderReader.load(main_scene_image.uiEffect74, this);
        effect.setPosition(this._propsLayerFit.paymentItemPoint);
        this.addChild(effect);

        var buyIcon = cc.Sprite.create(main_scene_image.icon303);
        buyIcon.setPosition(this._propsLayerFit.buyIconPoint);
        this.addChild(buyIcon);

        var productList = gameData.shop.getProductList();
        var len = productList.length;

        var slideLabel = [];

        var scrollViewLayer = MarkLayer.create(this._propsLayerFit.scrollViewLayerRect);

        var scrollViewHeight = len * 180;

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 170 - i * 180;

            var product = productList[i];

            slideLabel[i] = cc.Node.create();
            slideLabel[i].setPosition(cc.p(0, 0));
            slideLabel[i].setVisible(false);

            var menu = LazyMenu.create();
            menu.setPosition(cc.p(0, 0));
            slideLabel[i].addChild(menu, 1);

            var bgSprite = cc.Sprite.create(main_scene_image.icon162);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(17, y));
            slideLabel[i].addChild(bgSprite);

            var productSprite = cc.Sprite.create(main_scene_image[productUrl[i]]);
            productSprite.setPosition(cc.p(95, y + 82));
            slideLabel[i].addChild(productSprite);

            var buyItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon163,
                this._onClickBuy(product.id),
                this
            );
            buyItem.setPosition(cc.p(525, y + 45));
            menu.addChild(buyItem);

            var titleLabel = cc.LabelTTF.create(product.name, "STHeitiTC-Medium", 22);
            titleLabel.setColor(cc.c3b(74, 27, 27));
            titleLabel.setAnchorPoint(cc.p(0, 0.5));
            titleLabel.setPosition(cc.p(170, y + 125));
            slideLabel[i].addChild(titleLabel);

            var descriptionLabel = cc.LabelTTF.create(product.disc, "STHeitiTC-Medium", 18);
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setColor(cc.c3b(74, 27, 27));
            descriptionLabel.setPosition(cc.p(170, y + 85));
            slideLabel[i].addChild(descriptionLabel);

            var costIcon = cc.LabelTTF.create("价格:", "STHeitiTC-Medium", 20);
            costIcon.setColor(cc.c3b(74, 27, 27));
            costIcon.setAnchorPoint(cc.p(0, 0.5));
            costIcon.setPosition(cc.p(170, y + 45));
            slideLabel[i].addChild(costIcon);

            var costTypeIcon = cc.Sprite.create(main_scene_image[gameGoodsIcon[product.consume_type]]);
            costTypeIcon.setPosition(cc.p(245, y + 45));
            slideLabel[i].addChild(costTypeIcon);

            var costLabel = cc.LabelTTF.create(product.consume, "STHeitiTC-Medium", 20);
            costLabel.setColor(cc.c3b(74, 27, 27));
            costLabel.setAnchorPoint(cc.p(0, 0.5));
            costLabel.setPosition(cc.p(275, y + 42));
            slideLabel[i].addChild(costLabel);

            scrollViewLayer.addChild(slideLabel[i]);
        }

        this._scrollView = cc.ScrollView.create(this._propsLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._propsLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

        var slideLayer = SlideLayer.create(
            {
                labels: slideLabel,
                slideTime: 0.4,
                timeTick: 0.05
            }
        );

        slideLayer.showSlide();

        return true;
    },

    update: function () {
        cc.log("PropsLayer update");

        var player = gameData.player;

        this._goldLabel.setString(player.get("gold"));
        this._moneyLabel.setString(lz.getMoneyStr(player.get("money")));
    },

    _onClickPayment: function () {
        cc.log("PropsLayer _onClickPayment");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        PaymentLayer.pop();
    },

    _onClickBuy: function (id) {
        return function () {
            cc.log("PropsLayer _onClickBuy");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            if (id == 1 && gameData.cardList.isFull()) {
                CardListFullTipLayer.pop();
                return;
            }

            var product = gameData.shop.getProduct(id);

            cc.log(product);

            if (product.remainTimes <= 0) {

                if (id <= 2) {

                    var tipVip = gameData.player.get("vip") + 1;

                    tipVip = Math.max(tipVip, 1);
                    tipVip = Math.min(tipVip, 12);

                    if (id == 1) {
                        if (gameData.shop.get("expCardBuyCount") <= 0) {
                            GoPaymentLayer.pop({
                                title: "经验元灵购买次数已用完",
                                msg: "成为VIP" + tipVip + "，每日即可获得额外的购买次数"
                            });
                        }
                    } else {
                        if (gameData.shop.get("powerBuyCount") <= 0) {
                            GoPaymentLayer.pop({
                                title: "体力购买次数已用完",
                                msg: "成为VIP" + tipVip + "，每日即可获得额外的购买次数"
                            });
                        }
                    }
                }
            } else {
                var that = this;
                AmountLayer.pop(
                    function (count) {
                        that._buyProduct(id, count);
                    },
                    product
                );
            }
        }
    },

    _buyProduct: function (id, count) {
        cc.log("PropsLayer _onClickOk");

        if (count > 0) {
            var that = this;
            gameData.shop.buyProduct(function (data) {
                that.update();

                lz.tipReward(data);
            }, id, count);
        }
    }
});


PropsLayer.create = function () {
    var ret = new PropsLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};