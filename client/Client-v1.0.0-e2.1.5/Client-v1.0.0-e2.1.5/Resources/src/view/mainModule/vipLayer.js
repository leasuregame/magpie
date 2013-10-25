/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-4
 * Time: 上午10:00
 * To change this template use File | Settings | File Templates.
 */


/*
 * vip layer
 * */


var vipBoxGoods = {
    energy: {
        name: "活力值",
        url: "icon110",
        point: cc.p(220, 750)
    },

    money: {
        name: "铜板",
        url: "icon108",
        point: cc.p(440, 750)
    },

    skillPoint: {
        name: "技能点",
        url: "icon109",
        point: cc.p(220, 650)
    },

    elixir: {
        name: "仙丹",
        url: "icon107",
        point: cc.p(440, 650)
    },

    fragments: {
        name: "卡牌碎片",
        url: "icon145",
        point: cc.p(220, 550)
    },

    exp_card: {
        name: "经验卡",
        url: "icon146",
        point: cc.p(440, 550)
    }
};

var VipLayer = cc.Layer.extend({
    _goldLabel: null,
    _moneyLabel: null,
    _scrollView: null,

    onEnter: function () {
        cc.log("VipLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("VipLayer init");

        if (!this._super()) return false;

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

        return true;
    },

    update: function () {
        cc.log("VipLayer update");

        var player = gameData.player;

        this._goldLabel.setString(player.get("gold"));
        this._moneyLabel.setString(player.get("money"));

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var vipBoxList = gameData.shop.getVipBoxList();
        var len = vipBoxList.length;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 711));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 176 + 20;

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 176 - i * 176;

            var vipBox = vipBoxList[i];

            var bgSprite = cc.Sprite.create(main_scene_image.icon162);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(17, y));
            scrollViewLayer.addChild(bgSprite);

            var vipBoxDetailsItem = cc.MenuItemImage.create(
                main_scene_image.icon219,
                main_scene_image.icon219,
                this._onClickVipBoxDetails(vipBox),
                this
            );
            vipBoxDetailsItem.setScale(0.6);
            vipBoxDetailsItem.setPosition(cc.p(95, y + 82));
            menu.addChild(vipBoxDetailsItem);

            var buyItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon163,
                this._onClickBuy(vipBox.id),
                this
            );
            buyItem.setPosition(cc.p(525, y + 45));
            menu.addChild(buyItem);

            var vipLabel = cc.Sprite.create(main_scene_image["vip" + vipBox.id]);
            vipLabel.setAnchorPoint(cc.p(0, 0.5));
            vipLabel.setPosition(cc.p(170, y + 143));
            scrollViewLayer.addChild(vipLabel);

            var titleLabel = cc.LabelTTF.create("尊享礼包", "STHeitiTC-Medium", 22);
            titleLabel.setColor(cc.c3b(74, 27, 27));
            titleLabel.setPosition(cc.p(340, y + 140));
            scrollViewLayer.addChild(titleLabel);

            var cost = vipBox.price * 10;

            var descriptionLabel = cc.LabelTTF.create(
                "只能购买一次，点击图表可预览礼包内容。",
                "STHeitiTC-Medium",
                18
            );
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setColor(cc.c3b(74, 27, 27));
            descriptionLabel.setPosition(cc.p(170, y + 105));
            scrollViewLayer.addChild(descriptionLabel);

            var costIcon = cc.LabelTTF.create("原价", "STHeitiTC-Medium", 20);
            costIcon.setColor(cc.c3b(74, 27, 27));
            costIcon.setAnchorPoint(cc.p(0, 0.5));
            costIcon.setPosition(cc.p(175, y + 70));
            scrollViewLayer.addChild(costIcon);

            var costGoldIcon = cc.Sprite.create(main_scene_image.icon148);
            costGoldIcon.setScale(0.7);
            costGoldIcon.setPosition(cc.p(250, y + 70));
            scrollViewLayer.addChild(costGoldIcon);

            var costLabel = cc.LabelTTF.create(cost, "STHeitiTC-Medium", 20);
            costLabel.setColor(cc.c3b(74, 27, 27));
            costLabel.setAnchorPoint(cc.p(0, 0.5));
            costLabel.setPosition(cc.p(275, y + 67));
            scrollViewLayer.addChild(costLabel);

            var specialOfferIcon = cc.LayerColor.create(cc.c4b(217, 59, 59, 255), 50, 30);
            specialOfferIcon.setPosition(cc.p(170, y + 20));
            scrollViewLayer.addChild(specialOfferIcon);

            var specialOfferIconLabel = cc.LabelTTF.create("现价", "STHeitiTC-Medium", 20);
            specialOfferIconLabel.setAnchorPoint(cc.p(0, 0.5));
            specialOfferIconLabel.setPosition(cc.p(175, y + 35));
            scrollViewLayer.addChild(specialOfferIconLabel);

            var goldIcon = cc.Sprite.create(main_scene_image.icon148);
            goldIcon.setScale(0.7);
            goldIcon.setPosition(cc.p(250, y + 35));
            scrollViewLayer.addChild(goldIcon);

            var specialOfferLabel = cc.LabelTTF.create(vipBox.price, "STHeitiTC-Medium", 20);
            specialOfferLabel.setColor(cc.c3b(74, 27, 27));
            specialOfferLabel.setAnchorPoint(cc.p(0, 0.5));
            specialOfferLabel.setPosition(cc.p(275, y + 32));
            scrollViewLayer.addChild(specialOfferLabel);
        }

        this._scrollView = cc.ScrollView.create(cc.size(640, 711), scrollViewLayer);
        this._scrollView.setPosition(GAME_BG_POINT);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());
    },

    _addVipBoxDetails: function (data) {
        cc.log("VipLayer _addVipBoxDetails");

        var lazyLayer = LazyLayer.create();
        this.addChild(lazyLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 550));
        bgSprite.setPosition(cc.p(360, 580));
        lazyLayer.addChild(bgSprite);

        for (var key in data) {
            if (vipBoxGoods[key] != undefined && data[key] > 0) {
                var goods = vipBoxGoods[key];
                var point = goods.point;

                var goodsSprite = cc.Sprite.create(main_scene_image[goods.url]);
                goodsSprite.setPosition(point);
                lazyLayer.addChild(goodsSprite);

                var nameLabel = StrokeLabel.create(goods.name, "STHeitiTC-Medium", 25);
                nameLabel.setColor(cc.c3b(255, 252, 175));
                nameLabel.setAnchorPoint(cc.p(0, 0.5));
                nameLabel.setPosition(cc.p(point.x + 50, point.y + 20));
                lazyLayer.addChild(nameLabel);

                var countLabel = StrokeLabel.create(data[key], "STHeitiTC-Medium", 25);
                countLabel.setColor(cc.c3b(225, 121, 60));
                countLabel.setAnchorPoint(cc.p(0, 0.5));
                countLabel.setPosition(cc.p(point.x + 50, point.y - 20));
                lazyLayer.addChild(countLabel);
            }
        }

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            function () {
                lazyLayer.removeFromParent();
            },
            this
        );
        okItem.setPosition(cc.p(360, 360));

        var menu = cc.Menu.create(okItem);
        menu.setPosition(cc.p(0, 0));
        lazyLayer.addChild(menu);
    },

    _addTip: function (id) {
        cc.log("VipLayer _addTip");

        var lazyLayer = LazyLayer.create();
        this.addChild(lazyLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 250));
        bgSprite.setPosition(cc.p(360, 580));
        lazyLayer.addChild(bgSprite);

        var failLabel = StrokeLabel.create("购 买 失 败", "STHeitiTC-Medium", 25);
        failLabel.setColor(cc.c3b(255, 252, 175));
        failLabel.setPosition(cc.p(360, 660));
        lazyLayer.addChild(failLabel);

        var tipLabel = cc.LabelTTF.create("只有达到VIP" + id + "才能购买此礼包，快去充值吧！", "STHeitiTC-Medium", 20);
        tipLabel.setColor(cc.c3b(255, 252, 175));
        tipLabel.setPosition(cc.p(360, 600));
        lazyLayer.addChild(tipLabel);

        var paymentItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button21,
            main_scene_image.button21s,
            main_scene_image.icon159,
            function () {
                lazyLayer.removeFromParent();
                this._onClickPayment();
            },
            this
        );
        paymentItem.setPosition(cc.p(260, 520));

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            function () {
                lazyLayer.removeFromParent();
            },
            this
        );
        closeItem.setPosition(cc.p(460, 520));

        var menu = cc.Menu.create(paymentItem, closeItem);
        menu.setPosition(cc.p(0, 0));
        lazyLayer.addChild(menu);
    },

    _onClickPayment: function () {
        cc.log("VipLayer _onClickPayment");

        var paymentLayer = PaymentLayer.create();
        this.addChild(paymentLayer, 1);
    },

    _onClickBuy: function (id) {
        return function () {
            cc.log("VipLayer _onClickBuy: " + id);

            if (gameData.player.get("vip") < id) {
                this._addTip(id);

                return;
            }

            var that = this;
            gameData.shop.buyVipBox(function (data) {
                cc.log(data);

                that.update();
                lz.tipReward(data);
            }, id);
        }
    },

    _onClickVipBoxDetails: function (data) {
        return function () {
            cc.log("VipLayer _onClickVipBoxDetails");

            this._addVipBoxDetails(data);
        }
    }
});


VipLayer.create = function () {
    var ret = new VipLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};