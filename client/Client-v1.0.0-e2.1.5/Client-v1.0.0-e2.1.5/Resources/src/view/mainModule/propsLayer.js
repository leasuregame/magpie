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

var productUrl = ["icon146","icon278","icon279","icon280","icon106"];

var PropsLayer = cc.Layer.extend({
    _goldLabel: null,
    _moneyLabel: null,

    onEnter: function () {
        cc.log("PropsLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("PropsLayer init");

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setAnchorPoint(cc.p(0, 0));
        headLabel.setPosition(cc.p(40, 905));
        this.addChild(headLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(cc.p(280, 934));
        this.addChild(goldIcon);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(cc.p(410, 934));
        this.addChild(moneyIcon);

        this._goldLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(cc.p(310, 932));
        this.addChild(this._goldLabel);

        this._moneyLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(435, 932));
        this.addChild(this._moneyLabel);

        var paymentItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button38,
            main_scene_image.button38s,
            main_scene_image.icon159,
            this._onClickPayment,
            this
        );
        paymentItem.setPosition(cc.p(600, 934));

        var menu = cc.Menu.create(paymentItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var productList = gameData.shop.getProductList();
        var len = productList.length;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 711));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 180;

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 170 - i * 180;

            var product = productList[i];

            var bgSprite = cc.Sprite.create(main_scene_image.icon162);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(17, y));
            scrollViewLayer.addChild(bgSprite);

            var productSprite = cc.Sprite.create(main_scene_image[productUrl[i]]);
            productSprite.setPosition(cc.p(95, y + 82));
            scrollViewLayer.addChild(productSprite);

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
            scrollViewLayer.addChild(titleLabel);

            var descriptionLabel = cc.LabelTTF.create(product.disc, "STHeitiTC-Medium", 18);
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setColor(cc.c3b(74, 27, 27));
            descriptionLabel.setPosition(cc.p(170, y + 85));
            scrollViewLayer.addChild(descriptionLabel);

            var costIcon = cc.LabelTTF.create("价格:", "STHeitiTC-Medium", 20);
            costIcon.setColor(cc.c3b(74, 27, 27));
            costIcon.setAnchorPoint(cc.p(0, 0.5));
            costIcon.setPosition(cc.p(170, y + 45));
            scrollViewLayer.addChild(costIcon);

            var costTypeIcon = cc.Sprite.create(main_scene_image[gameGoodsIcon[product.consume_type]]);
            costTypeIcon.setPosition(cc.p(245, y + 45));
            scrollViewLayer.addChild(costTypeIcon);

            var costLabel = cc.LabelTTF.create(product.consume, "STHeitiTC-Medium", 20);
            costLabel.setColor(cc.c3b(74, 27, 27));
            costLabel.setAnchorPoint(cc.p(0, 0.5));
            costLabel.setPosition(cc.p(275, y + 42));
            scrollViewLayer.addChild(costLabel);
        }

        this._scrollView = cc.ScrollView.create(cc.size(640, 680), scrollViewLayer);
        this._scrollView.setPosition(cc.p(40, 210));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

        return true;
    },

    update: function () {
        cc.log("PropsLayer update");

        var player = gameData.player;

        this._goldLabel.setString(player.get("gold"));
        this._moneyLabel.setString(player.get("money"));
    },

    _onClickPayment: function () {
        cc.log("PropsLayer _onClickPayment");

        PaymentLayer.pop();
    },

    _onClickBuy: function (id) {
        return function () {
            cc.log("PropsLayer _onClickBuy");

            var product = gameData.shop.getProduct(id);

            cc.log(product);

            if (product.count <= 0) {
                TipLayer.tip(product.tip);
                return;
            }

            var that = this;
            AmountLayer.pop(
                function (count) {
                    that._buyProduct(id, count);
                },
                product
            );
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