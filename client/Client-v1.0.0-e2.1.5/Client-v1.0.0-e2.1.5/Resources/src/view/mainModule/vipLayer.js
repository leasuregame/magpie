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
        name: "活力点",
        url: "icon110"
    },

    money: {
        name: "仙币",
        url: "icon108"
    },

    skillPoint: {
        name: "技能点",
        url: "icon109"
    },

    elixir: {
        name: "仙丹",
        url: "icon107"
    },

    fragments: {
        name: "卡魂",
        url: "icon145"
    },

    exp_card: {
        name: "经验元灵",
        url: "icon146"
    }
};

var vipBoxUrl = {
    vip1: "icon276",
    vip2: "icon276",
    vip3: "icon276",
    vip4: "icon276",
    vip5: "icon277",
    vip6: "icon277",
    vip7: "icon277",
    vip8: "icon277",
    vip9: "icon281",
    vip10: "icon281",
    vip11: "icon281",
    vip12: "icon281"
};

var VipLayer = cc.Layer.extend({
    _vipLayerFit: null,

    _goldLabel: null,
    _moneyLabel: null,
    _scrollView: null,

    onEnter: function () {
        cc.log("VipLayer onEnter");

        this._super();
        this.update();

        this.schedule(this._update, 1);

        lz.dc.beginLogPageView("VIP礼包界面");
    },

    onExit: function () {
        cc.log("VipLayer onExit");

        this._super();

        lz.dc.endLogPageView("VIP礼包界面");
    },

    init: function () {
        cc.log("VipLayer init");

        if (!this._super()) return false;

        this._vipLayerFit = gameFit.mainScene.vipLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._vipLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setAnchorPoint(cc.p(0, 0));
        headLabel.setPosition(this._vipLayerFit.headLabelPoint);
        this.addChild(headLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(this._vipLayerFit.goldIconPoint);
        this.addChild(goldIcon);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(this._vipLayerFit.moneyIconPoint);
        this.addChild(moneyIcon);

        this._goldLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(this._vipLayerFit.goldLabelPoint);
        this.addChild(this._goldLabel);

        this._moneyLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(this._vipLayerFit.moneyLabelPoint);
        this.addChild(this._moneyLabel);

        var paymentItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button38,
            main_scene_image.button38s,
            main_scene_image.icon159,
            this._onClickPayment,
            this
        );
        paymentItem.setPosition(this._vipLayerFit.paymentItemPoint);

        var menu = cc.Menu.create(paymentItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("VipLayer update");

        this._update();

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var vipBoxList = gameData.shop.getVipBoxList();
        var len = vipBoxList.length;
        var index;
        var vip = gameData.player.get("vip");

        var scrollViewLayer = MarkLayer.create(this._vipLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 180;
        if (scrollViewHeight < this._vipLayerFit.scrollViewHeight) {
            scrollViewHeight = this._vipLayerFit.scrollViewHeight;
        }

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 170 - i * 180;

            var vipBox = vipBoxList[i];

            var bgSprite = cc.Sprite.create(main_scene_image.icon162);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(17, y));
            scrollViewLayer.addChild(bgSprite);

            if (vipBox.id <= vip && index == undefined) {
                index = i;

                var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect56, this);
                ccbNode.setPosition(cc.p(320, y + 85));
                scrollViewLayer.addChild(ccbNode);
            }

            var vipBoxDetailsItem = cc.MenuItemImage.create(
                main_scene_image[vipBoxUrl["vip" + vipBox.id]],
                main_scene_image[vipBoxUrl["vip" + vipBox.id]],
                this._onClickVipBoxDetails(vipBox),
                this
            );
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

            var costLabel = cc.LabelTTF.create(vipBox.true_price, "STHeitiTC-Medium", 20);
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

        this._scrollView = cc.ScrollView.create(this._vipLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._vipLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));

        offsetY = Math.min(this._scrollView.minContainerOffset().y + (index  || 0) * 180, 0);
        this._scrollView.setContentOffset(cc.p(0, offsetY));
    },

    _update: function () {
        cc.log("VipLayer _update");

        var player = gameData.player;

        this._goldLabel.setString(player.get("gold"));
        this._moneyLabel.setString(player.get("money"));
    },

    _addVipBoxDetails: function (obj) {
        cc.log("VipLayer _addVipBoxDetails");

        var data = obj.data;
        var cb = obj.cb;

        var lazyLayer = LazyLayer.create();
        this.addChild(lazyLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 550));
        bgSprite.setPosition(this._vipLayerFit.bgSprite2Point);
        lazyLayer.addChild(bgSprite);

        for (var key in data) {
            if (vipBoxGoods[key] != undefined && data[key] > 0) {
                var goods = vipBoxGoods[key];
                var point = this._vipLayerFit.vipBoxGoodsPoints[key];

                var goodsSprite = cc.Sprite.create(main_scene_image[goods.url]);
                goodsSprite.setPosition(point);
                lazyLayer.addChild(goodsSprite);

                var nameLabel = StrokeLabel.create(goods.name, "STHeitiTC-Medium", 25);
                nameLabel.setColor(cc.c3b(255, 252, 175));
                nameLabel.setAnchorPoint(cc.p(0, 0.5));
                nameLabel.setPosition(cc.p(point.x + 50, point.y + 20));
                lazyLayer.addChild(nameLabel);

                var countLabel = StrokeLabel.create(data[key], "STHeitiTC-Medium", 25);
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
                if (cb) {
                    cb();
                }
            },
            this
        );
        okItem.setPosition(this._vipLayerFit.okItemPoint);

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
        bgSprite.setPosition(this._vipLayerFit.bgSprite2Point);
        lazyLayer.addChild(bgSprite);

        var failLabel = StrokeLabel.create("购 买 失 败", "STHeitiTC-Medium", 25);
        failLabel.setPosition(this._vipLayerFit.failLabelPoint);
        lazyLayer.addChild(failLabel);

        var tipLabel = cc.LabelTTF.create("只有达到VIP" + id + "才能购买此礼包，快去充值吧！", "STHeitiTC-Medium", 20);
        tipLabel.setPosition(this._vipLayerFit.tipLabelPoint);
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
        paymentItem.setPosition(this._vipLayerFit.paymentItem2Point);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            function () {
                lazyLayer.removeFromParent();
            },
            this
        );
        closeItem.setPosition(this._vipLayerFit.closeItemPoint);

        var menu = cc.Menu.create(paymentItem, closeItem);
        menu.setPosition(cc.p(0, 0));
        lazyLayer.addChild(menu);
    },

    _onClickPayment: function () {
        cc.log("VipLayer _onClickPayment");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var paymentLayer = PaymentLayer.create();
        this.addChild(paymentLayer, 1);
    },

    _onClickBuy: function (id) {
        return function () {
            cc.log("VipLayer _onClickBuy: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            if (gameData.player.get("vip") < id) {
                this._addTip(id);

                return;
            }

            var that = this;
            gameData.shop.buyVipBox(function (data) {
                cc.log(data);
                var cb = function () {
                    that.update();
                    lz.tipReward(data);
                };
                that._addVipBoxDetails({data: data, cb: cb});
            }, id);
        }
    },

    _onClickVipBoxDetails: function (data) {
        return function () {
            cc.log("VipLayer _onClickVipBoxDetails");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            this._addVipBoxDetails({data: data});
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