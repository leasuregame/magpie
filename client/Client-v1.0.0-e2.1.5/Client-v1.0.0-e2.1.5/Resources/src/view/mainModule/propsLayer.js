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
        goldIcon.setPosition(cc.p(270, 934));
        this.addChild(goldIcon);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(cc.p(410, 934));
        this.addChild(moneyIcon);

        this._goldLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(cc.p(288, 932));
        this.addChild(this._goldLabel);

        this._moneyLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(435, 932));
        this.addChild(this._moneyLabel);

        var paymentItem = cc.MenuItemImage.create(
            main_scene_image.button38,
            main_scene_image.button38s,
            this._onClickPayment,
            this
        );
        paymentItem.setPosition(cc.p(600, 934));

        var paymentIcon = cc.Sprite.create(main_scene_image.icon159);
        paymentIcon.setPosition(cc.p(600, 934));
        this.addChild(paymentIcon, 1);

        var label = cc.Sprite.create(main_scene_image.icon162);
        label.setPosition(cc.p(360, 800));
        this.addChild(label);

        var expCardLabel = cc.Sprite.create(main_scene_image.icon146);
        expCardLabel.setPosition(cc.p(120, 800));
        this.addChild(expCardLabel);

        var buyItem = cc.MenuItemImage.create(
            main_scene_image.button20,
            main_scene_image.button20s,
            this._onClickBuy,
            this
        );
        buyItem.setPosition(cc.p(570, 750));

        var buyIcon = cc.Sprite.create(main_scene_image.icon163);
        buyIcon.setPosition(cc.p(570, 750));
        this.addChild(buyIcon, 1);

        var menu = cc.Menu.create(paymentItem, buyItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var nameLabel = StrokeLabel.create("经验卡", "STHeitiTC-Medium", 25);
        nameLabel.setColor(cc.c3b(255, 252, 175));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(200, 850));
        this.addChild(nameLabel);

        var descriptionLabel1 = StrokeLabel.create("蕴含大量经验，可快速提升卡牌等级。");
        descriptionLabel1.setAnchorPoint(cc.p(0, 0.5));
        descriptionLabel1.setColor(cc.c3b(255, 252, 175));
        descriptionLabel1.setPosition(cc.p(200, 800));
        this.addChild(descriptionLabel1);

        var priceIcon = StrokeLabel.create("价格:");
        priceIcon.setColor(cc.c3b(255, 252, 175));
        priceIcon.setAnchorPoint(cc.p(0, 0.5));
        priceIcon.setPosition(cc.p(200, 750));
        this.addChild(priceIcon);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(cc.p(275, 750));
        this.addChild(moneyIcon);

        var priceLabel = StrokeLabel.create("5000");
        priceLabel.setColor(cc.c3b(255, 252, 175));
        priceLabel.setAnchorPoint(cc.p(0, 0.5));
        priceLabel.setPosition(cc.p(305, 750));
        this.addChild(priceLabel);


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

    _onClickBuy: function () {
        cc.log("PropsLayer _onClickBuy");

        var that = this;
        AmountLayer.pop(
            function (count) {
                that._buyExpCard(count);
            },
            "购买经验卡",
            1,
            Math.floor(gameData.player.get("money") / 5000)
        );
    },

    _buyExpCard: function (count) {
        cc.log("PropsLayer _onClickOk");

        if (count > 0) {
            var that = this;
            gameData.shop.buyExpCard(function () {
                that.update();
            }, count);
        }
    },

    _buyMoney: function() {

    },

    _buyPower: function() {

    }
});


PropsLayer.create = function () {
    var ret = new PropsLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};